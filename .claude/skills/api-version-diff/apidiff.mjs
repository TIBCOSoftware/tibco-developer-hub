#!/usr/bin/env node
/**
 * apidiff.mjs — structural diff of two OpenAPI/AsyncAPI-style specification documents.
 *
 * Ships with the `api-version-diff` skill. It does the mechanical part of the comparison
 * (operations, parameters, request bodies, responses, schemas) and classifies every finding
 * as breaking or additive, so the agent can spend its effort on the narrative instead of on
 * eyeballing a 20k-line JSON diff.
 *
 *   node apidiff.mjs <old-spec> <new-spec> [options]
 *
 *     --json              emit the raw finding set as JSON instead of Markdown
 *     --out <file>        write to a file instead of stdout
 *     --from <label>      label for the old spec   (default: its info.version, else filename)
 *     --to <label>        label for the new spec   (default: its info.version, else filename)
 *     --title <text>      H1 of the Markdown report
 *
 * Accepts JSON or YAML. YAML needs the `yaml` or `js-yaml` package, which every Backstage
 * checkout already has in node_modules; run this from the repository root and it is found
 * automatically.
 *
 * Exit codes: 0 = no breaking changes, 1 = breaking changes found, 2 = could not run.
 * That makes it usable as a CI gate as well as a documentation generator.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { basename } from 'node:path';
import { createRequire } from 'node:module';

const HTTP_METHODS = ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'];

// ---------------------------------------------------------------- loading --

function loadYamlParser() {
  const require = createRequire(`${process.cwd()}/`);
  for (const name of ['yaml', 'js-yaml']) {
    try {
      const mod = require(name);
      // `yaml` exposes parse(); `js-yaml` exposes load().
      if (typeof mod.parse === 'function') return t => mod.parse(t);
      if (typeof mod.load === 'function') return t => mod.load(t);
    } catch {
      /* try the next one */
    }
  }
  return null;
}

function loadSpec(path) {
  const text = readFileSync(path, 'utf8');
  if (/^\s*[{[]/.test(text)) return JSON.parse(text);
  const parseYaml = loadYamlParser();
  if (!parseYaml) {
    fail(
      `${path} looks like YAML, but neither the "yaml" nor the "js-yaml" package could be ` +
        `resolved from ${process.cwd()}.\nRun this from your Developer Hub checkout (both are ` +
        `in its node_modules), or convert the spec to JSON first.`,
    );
  }
  return parseYaml(text);
}

function fail(msg) {
  console.error(`apidiff: ${msg}`);
  process.exit(2);
}

// ------------------------------------------------------------- extraction --

/** "GET /entities/by-query" -> the operation object, for every path × method in the spec. */
function operations(spec) {
  const out = new Map();
  for (const [path, item] of Object.entries(spec.paths ?? {})) {
    if (!item || typeof item !== 'object') continue;
    for (const method of HTTP_METHODS) {
      if (!item[method]) continue;
      out.set(`${method.toUpperCase()} ${path}`, {
        op: item[method],
        // Parameters can sit on the path item and apply to every method under it.
        inherited: Array.isArray(item.parameters) ? item.parameters : [],
      });
    }
  }
  return out;
}

/** Parameters of one operation, keyed "name (in)" — path-item level merged in. */
function paramsOf(entry, spec) {
  const out = new Map();
  for (const raw of [...entry.inherited, ...(entry.op.parameters ?? [])]) {
    const p = deref(raw, spec);
    if (!p?.name) continue;
    out.set(`${p.name} (${p.in ?? 'query'})`, p);
  }
  return out;
}

/** One level of $ref resolution inside the same document — enough for components/*. */
function deref(node, spec, seen = new Set()) {
  let cur = node;
  while (cur && typeof cur === 'object' && typeof cur.$ref === 'string') {
    const ref = cur.$ref;
    if (!ref.startsWith('#/') || seen.has(ref)) return cur;
    seen.add(ref);
    let target = spec;
    for (const part of ref.slice(2).split('/')) {
      target = target?.[part.replace(/~1/g, '/').replace(/~0/g, '~')];
      if (target === undefined) return cur;
    }
    cur = target;
  }
  return cur;
}

const schemasOf = spec => spec.components?.schemas ?? spec.definitions ?? {};

/** The type of a schema, normalised across the 3.0 `nullable` and 3.1 `["null"]` spellings. */
function typeOf(schema) {
  if (!schema || typeof schema !== 'object') return undefined;
  if (Array.isArray(schema.type)) return schema.type.filter(t => t !== 'null').join('|') || 'null';
  if (schema.type) return schema.type;
  for (const key of ['anyOf', 'oneOf', 'allOf']) {
    if (Array.isArray(schema[key])) {
      const parts = schema[key].map(s => typeOf(s)).filter(t => t && t !== 'null');
      if (parts.length) return [...new Set(parts)].join('|');
    }
  }
  return undefined;
}

/** True when a schema admits null, in either dialect. */
function isNullable(schema) {
  if (!schema || typeof schema !== 'object') return false;
  if (schema.nullable === true) return true;
  if (Array.isArray(schema.type)) return schema.type.includes('null');
  for (const key of ['anyOf', 'oneOf']) {
    if (Array.isArray(schema[key]) && schema[key].some(s => isNullable(s) || s?.type === 'null')) return true;
  }
  return false;
}

/**
 * The single meaningful branch of a nullability wrapper, or null.
 *
 * OpenAPI 3.1 has no `nullable` keyword, so a 3.0 `{type: object, nullable: true, properties: …}`
 * is re-spelled as `{anyOf: [{type: object, properties: …}, {type: "null"}]}`. Without unwrapping
 * that, every property of such a schema reads as deleted — the exact false alarm this exists to
 * prevent. Only unwrapped when there is exactly ONE non-null branch; a genuine polymorphic union
 * is left alone.
 */
function nullWrapperBranch(schema, spec) {
  for (const key of ['anyOf', 'oneOf']) {
    const branches = schema?.[key];
    if (!Array.isArray(branches)) continue;
    const real = branches.map(b => deref(b, spec)).filter(b => b && b.type !== 'null');
    if (real.length === 1 && branches.length > real.length) return real[0];
  }
  return null;
}

/** Properties of a schema, flattening allOf and nullability wrappers. */
function propertiesOf(schema, spec) {
  const props = { ...(schema?.properties ?? {}) };
  for (const part of schema?.allOf ?? []) {
    Object.assign(props, deref(part, spec)?.properties ?? {});
  }
  const branch = nullWrapperBranch(schema, spec);
  if (branch) Object.assign(props, propertiesOf(branch, spec));
  return props;
}

function requiredOf(schema, spec) {
  const req = new Set(schema?.required ?? []);
  for (const part of schema?.allOf ?? []) {
    for (const r of deref(part, spec)?.required ?? []) req.add(r);
  }
  const branch = nullWrapperBranch(schema, spec);
  if (branch) for (const r of requiredOf(branch, spec)) req.add(r);
  return req;
}

// ------------------------------------------------------------------ diff --

function diffSpecs(oldSpec, newSpec) {
  const findings = [];
  const add = (severity, area, subject, detail) => findings.push({ severity, area, subject, detail });

  // --- dialect / metadata -------------------------------------------------
  const oldDialect = oldSpec.openapi ?? oldSpec.swagger ?? oldSpec.asyncapi;
  const newDialect = newSpec.openapi ?? newSpec.swagger ?? newSpec.asyncapi;
  if (oldDialect !== newDialect) {
    add('note', 'dialect', 'specification dialect', `${oldDialect} → ${newDialect}`);
  }

  // --- operations ---------------------------------------------------------
  const oldOps = operations(oldSpec);
  const newOps = operations(newSpec);

  for (const key of newOps.keys()) {
    if (!oldOps.has(key)) {
      const { op } = newOps.get(key);
      add('additive', 'operation', key, op.operationId ?? op.summary ?? '');
    }
  }
  for (const key of oldOps.keys()) {
    if (!newOps.has(key)) {
      const { op } = oldOps.get(key);
      add('breaking', 'operation', key, `removed (was ${op.operationId ?? 'unnamed'})`);
    }
  }

  for (const [key, newEntry] of newOps) {
    const oldEntry = oldOps.get(key);
    if (!oldEntry) continue;

    if ((oldEntry.op.operationId ?? '') !== (newEntry.op.operationId ?? '')) {
      add('breaking', 'operation', key,
        `operationId ${oldEntry.op.operationId ?? '(none)'} → ${newEntry.op.operationId ?? '(none)'} ` +
        `(renames the generated client method)`);
    }
    if (!oldEntry.op.deprecated && newEntry.op.deprecated) {
      add('note', 'operation', key, 'marked deprecated');
    }

    // parameters
    const oldParams = paramsOf(oldEntry, oldSpec);
    const newParams = paramsOf(newEntry, newSpec);
    for (const [pk, p] of newParams) {
      if (oldParams.has(pk)) continue;
      add(p.required ? 'breaking' : 'additive', 'parameter', `${key} — ${pk}`,
        p.required ? 'new required parameter' : describeParam(p));
    }
    for (const pk of oldParams.keys()) {
      if (!newParams.has(pk)) add('breaking', 'parameter', `${key} — ${pk}`, 'removed');
    }
    for (const [pk, np] of newParams) {
      const op_ = oldParams.get(pk);
      if (!op_) continue;
      if (!op_.required && np.required) {
        add('breaking', 'parameter', `${key} — ${pk}`, 'became required');
      }
      const oldEnum = op_.schema?.enum;
      const newEnum = np.schema?.enum;
      if (Array.isArray(oldEnum) && Array.isArray(newEnum)) {
        const gone = oldEnum.filter(v => !newEnum.includes(v));
        const fresh = newEnum.filter(v => !oldEnum.includes(v));
        if (gone.length) add('breaking', 'parameter', `${key} — ${pk}`, `enum values removed: ${gone.join(', ')}`);
        if (fresh.length) add('additive', 'parameter', `${key} — ${pk}`, `enum values added: ${fresh.join(', ')}`);
      }
    }

    // request body
    const oldBody = deref(oldEntry.op.requestBody, oldSpec);
    const newBody = deref(newEntry.op.requestBody, newSpec);
    if (!oldBody && newBody) {
      add(newBody.required ? 'breaking' : 'additive', 'request body', key,
        newBody.required ? 'new required request body' : 'new optional request body');
    } else if (oldBody && !newBody) {
      add('breaking', 'request body', key, 'removed');
    } else if (oldBody && newBody && !oldBody.required && newBody.required) {
      add('breaking', 'request body', key, 'became required');
    }

    // responses
    const oldCodes = Object.keys(oldEntry.op.responses ?? {});
    const newCodes = Object.keys(newEntry.op.responses ?? {});
    for (const c of newCodes.filter(c => !oldCodes.includes(c))) {
      add('additive', 'response', `${key} — ${c}`, 'new response code');
    }
    for (const c of oldCodes.filter(c => !newCodes.includes(c))) {
      add('breaking', 'response', `${key} — ${c}`, 'response code removed');
    }
  }

  // --- shared components.parameters --------------------------------------
  const oldShared = oldSpec.components?.parameters ?? {};
  const newShared = newSpec.components?.parameters ?? {};
  for (const name of Object.keys(newShared).filter(n => !(n in oldShared))) {
    add('additive', 'shared parameter', name, describeParam(newShared[name]));
  }
  for (const name of Object.keys(oldShared).filter(n => !(n in newShared))) {
    add('breaking', 'shared parameter', name, 'removed');
  }

  // --- schemas ------------------------------------------------------------
  const oldSchemas = schemasOf(oldSpec);
  const newSchemas = schemasOf(newSpec);

  for (const name of Object.keys(newSchemas).filter(n => !(n in oldSchemas))) {
    add('additive', 'schema', name, 'new schema');
  }
  for (const name of Object.keys(oldSchemas).filter(n => !(n in newSchemas))) {
    add('breaking', 'schema', name, 'removed');
  }

  for (const name of Object.keys(newSchemas)) {
    if (!(name in oldSchemas)) continue;
    const o = deref(oldSchemas[name], oldSpec);
    const n = deref(newSchemas[name], newSpec);

    const oType = typeOf(o);
    const nType = typeOf(n);
    if (oType !== nType) add('breaking', 'schema', name, `type ${oType ?? '(none)'} → ${nType ?? '(none)'}`);

    // A 3.0 `nullable: true` becoming a 3.1 `["null"]` union is a spelling change, not a
    // semantic one — report it as a note so it does not drown the real findings.
    if (isNullable(o) !== isNullable(n)) {
      add(isNullable(o) ? 'breaking' : 'additive', 'schema', name,
        isNullable(o) ? 'no longer nullable' : 'now nullable');
    } else if (isNullable(o) && ('nullable' in (o ?? {})) !== ('nullable' in (n ?? {}))) {
      add('note', 'schema', name, 'nullability re-expressed for the newer dialect (semantics unchanged)');
    }

    const oProps = propertiesOf(o, oldSpec);
    const nProps = propertiesOf(n, newSpec);
    const oReq = requiredOf(o, oldSpec);
    const nReq = requiredOf(n, newSpec);

    for (const p of Object.keys(nProps).filter(p => !(p in oProps))) {
      add(nReq.has(p) ? 'breaking' : 'additive', 'schema property', `${name}.${p}`,
        nReq.has(p)
          ? `new REQUIRED property (${typeOf(deref(nProps[p], newSpec)) ?? 'object'})`
          : `new optional property (${typeOf(deref(nProps[p], newSpec)) ?? 'object'})`);
    }
    for (const p of Object.keys(oProps).filter(p => !(p in nProps))) {
      add('breaking', 'schema property', `${name}.${p}`, 'removed');
    }
    for (const p of [...nReq].filter(p => !oReq.has(p) && p in oProps)) {
      add('breaking', 'schema property', `${name}.${p}`, 'existing property became required');
    }
    for (const p of [...oReq].filter(p => !nReq.has(p) && p in nProps)) {
      add('additive', 'schema property', `${name}.${p}`, 'no longer required');
    }
    for (const p of Object.keys(nProps).filter(p => p in oProps)) {
      const op_ = deref(oProps[p], oldSpec);
      const np = deref(nProps[p], newSpec);
      const ot = typeOf(op_);
      const nt = typeOf(np);
      if (ot !== nt) add('breaking', 'schema property', `${name}.${p}`, `type ${ot ?? '(none)'} → ${nt ?? '(none)'}`);
      if (Array.isArray(op_?.enum) && Array.isArray(np?.enum)) {
        const gone = op_.enum.filter(v => !np.enum.includes(v));
        const fresh = np.enum.filter(v => !op_.enum.includes(v));
        if (gone.length) add('breaking', 'schema property', `${name}.${p}`, `enum values removed: ${gone.join(', ')}`);
        if (fresh.length) add('additive', 'schema property', `${name}.${p}`, `enum values added: ${fresh.join(', ')}`);
      }
    }
  }

  // --- security -----------------------------------------------------------
  const oldSec = Object.keys(oldSpec.components?.securitySchemes ?? {});
  const newSec = Object.keys(newSpec.components?.securitySchemes ?? {});
  for (const s of newSec.filter(s => !oldSec.includes(s))) add('note', 'security', s, 'new security scheme');
  for (const s of oldSec.filter(s => !newSec.includes(s))) add('breaking', 'security', s, 'security scheme removed');

  return {
    summary: {
      from: oldSpec.info?.version ?? null,
      to: newSpec.info?.version ?? null,
      dialect: { from: oldDialect ?? null, to: newDialect ?? null },
      operations: { from: oldOps.size, to: newOps.size },
      schemas: { from: Object.keys(oldSchemas).length, to: Object.keys(newSchemas).length },
      counts: {
        breaking: findings.filter(f => f.severity === 'breaking').length,
        additive: findings.filter(f => f.severity === 'additive').length,
        note: findings.filter(f => f.severity === 'note').length,
      },
    },
    findings,
  };
}

function describeParam(p) {
  const bits = [`in: ${p.in ?? 'query'}`];
  const t = typeOf(p.schema);
  if (t) bits.push(`type: ${t}`);
  if (Array.isArray(p.schema?.enum)) bits.push(`enum: ${p.schema.enum.join(' | ')}`);
  if (p.schema?.default !== undefined) bits.push(`default: ${p.schema.default}`);
  return bits.join(', ');
}

// ------------------------------------------------------------- rendering --

const ORDER = { breaking: 0, additive: 1, note: 2 };
const LABEL = { breaking: '🔴 Breaking', additive: '🟢 Additive', note: '🔵 Note' };

function renderMarkdown(result, { title, from, to }) {
  const { summary, findings } = result;
  const L = [];
  L.push(`# ${title}`, '');
  L.push(`Comparison of **${from}** and **${to}**, generated by \`apidiff.mjs\`.`, '');

  L.push('| | From | To |', '|---|---|---|');
  L.push(`| Spec version | ${summary.from ?? '—'} | ${summary.to ?? '—'} |`);
  L.push(`| Dialect | ${summary.dialect.from ?? '—'} | ${summary.dialect.to ?? '—'} |`);
  L.push(`| Operations | ${summary.operations.from} | ${summary.operations.to} |`);
  L.push(`| Schemas | ${summary.schemas.from} | ${summary.schemas.to} |`);
  L.push('');

  const { breaking, additive, note } = summary.counts;
  L.push(
    breaking === 0
      ? `**No breaking changes.** ${additive} additive change${additive === 1 ? '' : 's'}` +
          `${note ? ` and ${note} note${note === 1 ? '' : 's'}` : ''}.`
      : `**${breaking} breaking change${breaking === 1 ? '' : 's'}**, ${additive} additive` +
          `${note ? `, ${note} note${note === 1 ? '' : 's'}` : ''}.`,
    '',
  );

  const sorted = [...findings].sort(
    (a, b) => ORDER[a.severity] - ORDER[b.severity] || a.area.localeCompare(b.area) || a.subject.localeCompare(b.subject),
  );

  for (const severity of ['breaking', 'additive', 'note']) {
    const group = sorted.filter(f => f.severity === severity);
    if (!group.length) continue;
    L.push(`## ${LABEL[severity]}`, '');
    L.push('| Area | Subject | Detail |', '|---|---|---|');
    for (const f of group) L.push(`| ${f.area} | \`${f.subject}\` | ${f.detail} |`);
    L.push('');
  }

  L.push('---', '');
  L.push(
    '> Generated mechanically. It reports *what* changed in the contract, never *why* — the ' +
      'rationale, the migration steps and the consumer impact are the parts a human (or the ' +
      '`api-version-diff` skill) still has to write.',
    '',
  );
  return L.join('\n');
}

// ------------------------------------------------------------------ main --

function main() {
  const argv = process.argv.slice(2);
  const positional = [];
  const opts = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--json') opts.json = true;
    else if (a.startsWith('--')) opts[a.slice(2)] = argv[++i];
    else positional.push(a);
  }

  if (positional.length !== 2) {
    console.error('usage: node apidiff.mjs <old-spec> <new-spec> [--json] [--out FILE] [--from LABEL] [--to LABEL] [--title TEXT]');
    process.exit(2);
  }

  const [oldPath, newPath] = positional;
  let oldSpec;
  let newSpec;
  try {
    oldSpec = loadSpec(oldPath);
    newSpec = loadSpec(newPath);
  } catch (e) {
    fail(e.message);
  }

  const result = diffSpecs(oldSpec, newSpec);
  const from = opts.from ?? oldSpec.info?.version ?? basename(oldPath);
  const to = opts.to ?? newSpec.info?.version ?? basename(newPath);
  const title = opts.title ?? `${newSpec.info?.title ?? 'API'} — changes from ${from} to ${to}`;

  const output = opts.json
    ? JSON.stringify(result, null, 2)
    : renderMarkdown(result, { title, from, to });

  if (opts.out) {
    writeFileSync(opts.out, output.endsWith('\n') ? output : `${output}\n`);
    console.error(`apidiff: wrote ${opts.out}`);
  } else {
    process.stdout.write(`${output}\n`);
  }

  process.exit(result.summary.counts.breaking > 0 ? 1 : 0);
}

main();
