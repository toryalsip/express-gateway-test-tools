module.exports = {
  version: '1.0.0',
  policies: ['test-policy'],
  init: function (pluginContext) {
    const logger = pluginContext.logger;
    logger.debug('test-plugin init()');
    pluginContext.registerPolicy(require('./test-policy'));
  }
};
