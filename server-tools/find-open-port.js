const net = require('net');

module.exports = function (count = 1) {
  let completeCount = 0;
  const ports = [];
  return new Promise((resolve, reject) => {
    for (let i = 0; i < count; i++) {
      const server = net.createServer();

      server.listen(0);

      server.on('listening', () => {
        ports.push(server.address().port);

        server.once('close', () => {
          completeCount++;

          if (completeCount === count) {
            resolve(ports);
          }
        });
        server.close();
      });

      server.on('error', (err) => {
        reject(err);
      });
    }
  });
};
