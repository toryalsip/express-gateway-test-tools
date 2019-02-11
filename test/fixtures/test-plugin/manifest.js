module.exports = {
  version: '1.0.0',
  policies: ['test-policy'],
  schema: {
    $id: 'my-schema-id',
    param1: {
      title: 'Parameter 1',
      description: 'For testing',
      type: 'string'
    },
    required: ['param1']
  },
  init: function (pluginContext) {
    const logger = pluginContext.logger;
    logger.debug('test-plugin init()');
    pluginContext.registerPolicy(require('./test-policy'));
  }
};
