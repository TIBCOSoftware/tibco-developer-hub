// Print the first free TCP port (bound on 127.0.0.1, matching the backend's
// listen host) at or above argv[2]. Used by the devhub launchers to fall back to
// a free port when the default is busy.
//
//   node find-free-port.cjs <desiredPort> [<explicit>]
//
// If <explicit> is "1" the user picked the port deliberately: only that exact port
// is checked — print it if free, otherwise exit 1 (the launcher then errors out
// instead of silently moving a port the user asked for).
const net = require('net');
const start = parseInt(process.argv[2], 10) || 7007;
const explicit = process.argv[3] === '1';
const max = explicit ? start : start + 50;

function isFree(port) {
  return new Promise(resolve => {
    const srv = net.createServer();
    srv.once('error', () => resolve(false));
    srv.once('listening', () => srv.close(() => resolve(true)));
    srv.listen(port, '127.0.0.1');
  });
}

(async () => {
  for (let p = start; p <= max; p++) {
    if (await isFree(p)) {
      process.stdout.write(String(p));
      process.exit(0);
    }
  }
  process.exit(1); // nothing free in range
})();
