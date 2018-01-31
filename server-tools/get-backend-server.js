const express = require('express');

module.exports = function(port, handler) {
  const app = express();

  app.use(handler);

  return new Promise((resolve) => {
    const runningApp = app.listen(port || 0, () => {
      console.log(`backend server listening on ${runningApp.address().port}`);
      resolve({
        app: runningApp,
        port: runningApp.address().port
      });
    });
  });
};