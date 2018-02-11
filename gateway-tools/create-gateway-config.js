module.exports = function () {
  return {
    http: {
      port: 0
    },
    apiEndpoints: {
      api: {
        host: '*',
        paths: '/ip'
      }
    },
    serviceEndpoints: {
      backend: {
        url: `http://httpbin.org`
      }
    },
    policies: ['proxy'],
    pipelines: {
      basic: {
        apiEndpoints: ['api'],
        policies: [{
          proxy: [{
            action: {
              serviceEndpoint: 'backend'
            }
          }]
        }]
      }
    }
  };
};
