const logger = require('express-gateway/lib/logger').policy;

module.exports = {
  name: 'test-policy',
  policy: (actionParams) => {
    return (req, res, next) => {
      logger.debug('req received by test-policy');
      res.setHeader('x-test-policy', 'abc123');
      next();
    }
  }
};