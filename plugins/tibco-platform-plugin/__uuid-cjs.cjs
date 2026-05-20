// Jest CJS shim for uuid v14 (pure ESM).
// uuid v14 transpiled by SWC gets __esModule:true, which breaks _interopRequireDefault
// in @material-table/core. Plain CJS here lets _interopRequireDefault wrap it correctly.
const { randomUUID } = require('crypto');

module.exports = {
  v4: () => randomUUID(),
  v1: () => randomUUID(),
  v3: () => randomUUID(),
  v5: () => randomUUID(),
  v6: () => randomUUID(),
  v7: () => randomUUID(),
  validate: str =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str),
  version: () => 4,
  NIL: '00000000-0000-0000-0000-000000000000',
  MAX: 'ffffffff-ffff-ffff-ffff-ffffffffffff',
};
