#!/usr/bin/env python3
"""
lineage.py — build the data-flow graph and the field inventory for a Backstage
system, from a catalog entity dump.

Used by the /data-lineage skill. Two things the catalog does not give you for
free, and that every lineage report needs:

  1. A DIRECTED flow graph. Backstage relations are symmetric pairs; direction
     comes from which half you read. providesApi = writes, consumesApi = reads.
     Component -> API -> Component alternation is the actual data flow.
  2. A field inventory per contract. spec.definition is JSON Schema for events
     and XSD for SAP IDoc contracts — different parsers, one normalised output.

Usage:
  # dump entities first (MCP or REST), then:
  lineage.py graph   <entities.json>
  lineage.py fields  <entities.json> [--flat]
  lineage.py trace   <entities.json> --field <name>
  lineage.py flow    <entities.json> --api <ref> [--field <name>]
  lineage.py path    <entities.json> --from <ref> --to <ref>

Field names are compared case- and separator-insensitively (normalised to
lowercase alnum) so MaterialNumber == materialNumber == material_number.
That cross-convention match is itself a finding — see `trace`, which reports
the raw spellings it unified.
"""

import json
import re
import sys
from collections import defaultdict

# ---------------------------------------------------------------- field parsing

XSD_ELEMENT = re.compile(r'<xsd:element\s+name="([A-Za-z0-9_]+)"([^>]*)>')
XSD_ATTRIBUTE = re.compile(r'<xsd:attribute\s+name="([A-Za-z0-9_]+)"([^>]*)>')
XSD_TYPE = re.compile(r'type="(?:xsd:)?([A-Za-z0-9_]+)"')


def norm(name):
    """Normalise a field name for cross-contract comparison."""
    return re.sub(r"[^a-z0-9]", "", name.split(".")[-1].split("[]")[-1].lower())


def _json_fields(schema, prefix="", out=None, required=None):
    """Walk a JSON Schema, emitting dotted paths. Arrays get a [] segment."""
    out = {} if out is None else out
    req = set(schema.get("required", []))
    for name, spec in (schema.get("properties") or {}).items():
        path = f"{prefix}{name}"
        if not isinstance(spec, dict):
            continue
        typ = spec.get("type", "any")
        out[path] = {
            "type": typ if isinstance(typ, str) else "/".join(typ),
            "required": name in req,
            "format": spec.get("format"),
            "leaf": typ not in ("object", "array"),
        }
        if typ == "object":
            _json_fields(spec, path + ".", out)
        elif typ == "array" and isinstance(spec.get("items"), dict):
            _json_fields(spec["items"], path + "[].", out)
    return out


def _xsd_fields(text):
    """
    Walk an XSD. Named complexTypes are resolved one level so that
    ShipToAddress -> AddressType expands to ShipToAddress.City etc.
    """
    # named complexType blocks -> their child elements
    blocks = {}
    for m in re.finditer(
        r'<xsd:complexType\s+name="([A-Za-z0-9_]+)"(.*?)</xsd:complexType>', text, re.S
    ):
        blocks[m.group(1)] = m.group(2)

    def walk(body, prefix, out, depth=0):
        for m in XSD_ELEMENT.finditer(body):
            name, attrs = m.group(1), m.group(2)
            tm = XSD_TYPE.search(attrs)
            typ = tm.group(1) if tm else "complex"
            path = f"{prefix}{name}"
            out[path] = {
                "type": typ,
                "required": 'minOccurs="0"' not in attrs,
                "format": None,
                "leaf": typ not in blocks and typ != "complex",
            }
            if typ in blocks and depth < 3:
                walk(blocks[typ], path + ".", out, depth + 1)
        for m in XSD_ATTRIBUTE.finditer(body):
            out[f"{prefix}@{m.group(1)}"] = {
                "type": "attribute",
                "required": 'use="required"' in m.group(2),
                "format": None,
                "leaf": True,
            }

    # only the root element(s), i.e. outside named complexType blocks
    root = re.sub(
        r'<xsd:complexType\s+name="[A-Za-z0-9_]+".*?</xsd:complexType>', "", text, flags=re.S
    )
    out = {}
    walk(root, "", out)
    return out


def parse_definition(definition):
    """-> (format, {path: meta}). Never raises; unknown formats yield {}."""
    if not definition:
        return "none", {}
    text = definition.strip()
    if text.startswith("{"):
        try:
            return "json-schema", _json_fields(json.loads(text))
        except json.JSONDecodeError:
            return "json-invalid", {}
    if "xsd:schema" in text or text.startswith("<?xml"):
        return "xsd", _xsd_fields(text)
    if re.match(r"^(openapi|swagger):", text, re.M):
        return "openapi", {}  # field-level OpenAPI parsing not implemented
    return "unknown", {}


# ---------------------------------------------------------------- graph building

FLOW_OUT = "providesApi"   # component writes this contract
FLOW_IN = "consumesApi"    # component reads this contract


def load(path):
    data = json.load(open(path))
    return data.get("items", data) if isinstance(data, dict) else data


def build(entities):
    by_ref, g = {}, {}
    for e in entities:
        ref = f"{e['kind'].lower()}:{e['metadata'].get('namespace','default')}/{e['metadata']['name']}"
        by_ref[ref] = e
    for ref, e in by_ref.items():
        rels = defaultdict(list)
        for r in e.get("relations", []):
            rels[r["type"]].append(r["targetRef"])
        spec = e.get("spec", {})
        fmt, fields = parse_definition(spec.get("definition", "")) if e["kind"] == "API" else ("n/a", {})
        g[ref] = {
            "ref": ref,
            "kind": e["kind"],
            "name": e["metadata"]["name"],
            "desc": e["metadata"].get("description", ""),
            "type": spec.get("type"),
            "owner": spec.get("owner", ""),
            "lifecycle": spec.get("lifecycle", ""),
            "rels": dict(rels),
            "format": fmt,
            "fields": fields,
            # transport resource the contract rides on
            "transport": next(
                (t for t in rels.get("dependsOn", []) if t.startswith("resource:")), None
            ) if e["kind"] == "API" else None,
        }
    return g


def producers(g, api_ref):
    return g[api_ref]["rels"].get("apiProvidedBy", [])


def consumers(g, api_ref):
    return g[api_ref]["rels"].get("apiConsumedBy", [])


def writes(g, comp_ref):
    return g[comp_ref]["rels"].get(FLOW_OUT, [])


def reads(g, comp_ref):
    return g[comp_ref]["rels"].get(FLOW_IN, [])


def systems_of_record(g, comp_ref):
    """Non-transport resources a component touches — the SAP-side sources/sinks."""
    out = []
    for t in g[comp_ref]["rels"].get("dependsOn", []):
        n = g.get(t)
        if n and n["kind"] == "Resource" and n["type"] not in ("topic", "queue", "message-broker"):
            out.append(t)
    return out


# ---------------------------------------------------------------- traversal

def downstream(g, start, max_hops=8):
    """Hops away from `start` (an API ref) following consume -> provide."""
    hops, frontier, seen = [], [start], {start}
    for depth in range(max_hops):
        nxt = []
        for api in frontier:
            for c in consumers(g, api):
                for out_api in writes(g, c):
                    hops.append({"depth": depth, "in": api, "via": c, "out": out_api})
                    if out_api not in seen:
                        seen.add(out_api)
                        nxt.append(out_api)
                if not writes(g, c):
                    hops.append({"depth": depth, "in": api, "via": c, "out": None})
        if not nxt:
            break
        frontier = nxt
    return hops


def upstream(g, start, max_hops=8):
    """Hops toward the origin of `start` following provide <- consume."""
    hops, frontier, seen = [], [start], {start}
    for depth in range(max_hops):
        nxt = []
        for api in frontier:
            for p in producers(g, api):
                srcs = reads(g, p)
                if srcs:
                    for src in srcs:
                        hops.append({"depth": depth, "in": src, "via": p, "out": api})
                        if src not in seen:
                            seen.add(src)
                            nxt.append(src)
                else:
                    hops.append({"depth": depth, "in": None, "via": p, "out": api})
        if not nxt:
            break
        frontier = nxt
    return hops


def classify(g, hop, field=None):
    """
    Confidence tier for a field crossing one component hop.

    carried   — same normalised field name on both sides
    derived   — field absent downstream but a plausible relative exists
    originates— downstream has it, upstream does not: the component adds it
    dropped   — upstream has it, downstream does not carry it at all
    """
    if not field or not hop.get("in") or not hop.get("out"):
        return "n/a", ""
    n = norm(field)
    src = {norm(f): f for f in g[hop["in"]]["fields"]}
    dst = {norm(f): f for f in g[hop["out"]]["fields"]}
    if n in src and n in dst:
        same = src[n] == dst[n]
        return "carried", "" if same else f"renamed {src[n]} -> {dst[n]}"
    if n in src and n not in dst:
        near = [d for k, d in dst.items() if n in k or k in n]
        return ("derived", f"candidate: {', '.join(near)}") if near else ("dropped", "")
    if n not in src and n in dst:
        return "originates", dst[n]
    return "absent", ""


# ---------------------------------------------------------------- commands

def cmd_graph(g):
    for ref, n in sorted(g.items()):
        if n["kind"] != "Component":
            continue
        print(f"\n{n['name']}  ({n['owner'].split('/')[-1]})")
        for a in reads(g, ref):
            print(f"   reads   <- {g[a]['name']:24} [{g[a]['transport'] and g[g[a]['transport']]['name']}]")
        for a in writes(g, ref):
            print(f"   writes  -> {g[a]['name']:24} [{g[a]['transport'] and g[g[a]['transport']]['name']}]")
        for r in systems_of_record(g, ref):
            print(f"   sor     ** {g[r]['name']}")


def cmd_fields(g, flat=False):
    inv = defaultdict(list)
    for ref, n in sorted(g.items()):
        if n["kind"] != "API":
            continue
        if not flat:
            print(f"\n{n['name']}  [{n['format']}]  {len(n['fields'])} fields")
        for f, meta in n["fields"].items():
            if not flat:
                flag = "*" if meta["required"] else " "
                print(f"  {flag} {f:38} {meta['type']}")
            inv[norm(f)].append((n["name"], f))
    if flat:
        print(f"{'field':24} {'n':>3}  contracts")
        for k, v in sorted(inv.items(), key=lambda x: (-len(x[1]), x[0])):
            if len(v) > 1:
                spell = {f for _, f in v}
                s = f"  [{' / '.join(sorted(spell))}]" if len(spell) > 1 else ""
                print(f"{k:24} {len(v):>3}  {', '.join(c for c, _ in v)}{s}")


def cmd_trace(g, field):
    n = norm(field)
    carriers = [
        (ref, f) for ref, x in g.items() if x["kind"] == "API"
        for f in x["fields"] if norm(f) == n
    ]
    if not carriers:
        print(f"no contract carries a field matching '{field}'")
        return
    spellings = sorted({f for _, f in carriers})
    print(f"field '{field}' -> {len(carriers)} contract(s); spellings: {', '.join(spellings)}")
    if len(spellings) > 1:
        print("  !! naming convention differs across contracts — mapping risk")
    print()
    for ref, f in sorted(carriers):
        x = g[ref]
        meta = x["fields"][f]
        prod = [g[p]["name"] for p in producers(g, ref)] or ["<external>"]
        cons = [g[c]["name"] for c in consumers(g, ref)] or ["<none>"]
        tr = g[x["transport"]]["name"] if x["transport"] else "-"
        print(f"{x['name']:24} {f:22} {meta['type']:10} {'req' if meta['required'] else 'opt':4} "
              f"[{tr}]  {'+'.join(prod)} -> {', '.join(cons)}")


def cmd_flow(g, api, field=None):
    """Upstream provenance and downstream reach of one contract, hop by hop."""
    if api not in g:
        print(f"unknown ref: {api}")
        return
    print(f"=== {g[api]['name']} — upstream (provenance) ===")
    for h in upstream(g, api):
        show_hop(g, h, field, "  " * h["depth"])
    print(f"\n=== {g[api]['name']} — downstream (reach) ===")
    for h in downstream(g, api):
        show_hop(g, h, field, "  " * h["depth"])


def show_hop(g, hop, field, indent=""):
    src = g[hop["in"]]["name"] if hop.get("in") else "<external>"
    via = g[hop["via"]]
    out = g[hop["out"]]["name"] if hop.get("out") else "<sink>"
    sor = [g[r]["name"] for r in systems_of_record(g, hop["via"])]
    tier, note = classify(g, hop, field)
    tag = f"  [{tier}{': ' + note if note else ''}]" if field else ""
    print(f"{indent}{src} -> {via['name']} ({via['owner'].split('/')[-1]}"
          f"{', ' + '+'.join(sor) if sor else ''}) -> {out}{tag}")


def cmd_path(g, src, dst):
    """Shortest producer/consumer path between two refs, over the directed graph."""
    from collections import deque
    q, seen = deque([(src, [src])]), {src}
    while q:
        cur, path = q.popleft()
        if cur == dst:
            print(" -> ".join(g[p]["name"] if p in g else p for p in path))
            return
        nxts = []
        node = g.get(cur)
        if not node:
            continue
        if node["kind"] == "API":
            nxts = consumers(g, cur)
        elif node["kind"] == "Component":
            nxts = writes(g, cur) + [
                r for r in node["rels"].get("dependsOn", [])
                if g.get(r, {}).get("kind") == "Resource"
                and g[r]["type"] not in ("topic", "queue", "message-broker")
            ]
        for nx in nxts:
            if nx not in seen:
                seen.add(nx)
                q.append((nx, path + [nx]))
    print("no directed path")


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    cmd, path = sys.argv[1], sys.argv[2]
    argv = sys.argv[3:]
    g = build(load(path))

    def opt(flag, default=None):
        return argv[argv.index(flag) + 1] if flag in argv else default

    if cmd == "graph":
        cmd_graph(g)
    elif cmd == "fields":
        cmd_fields(g, flat="--flat" in argv)
    elif cmd == "trace":
        cmd_trace(g, opt("--field"))
    elif cmd == "flow":
        cmd_flow(g, opt("--api"), opt("--field"))
    elif cmd == "path":
        cmd_path(g, opt("--from"), opt("--to"))
    else:
        print(__doc__)
        sys.exit(1)


if __name__ == "__main__":
    main()
