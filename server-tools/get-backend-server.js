const express = require('express');

module.exports = function(port, handler) {
  const app = express();

  app.use(handler);

  return new Promise((resolve) => {
    const runningApp = app.listen(port || 0, () => {
      resolve({
        app: runningApp,
        port: runningApp.address().port
      });
    });
  });
};