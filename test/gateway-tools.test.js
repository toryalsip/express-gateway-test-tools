const {
  createGateway,
  createGatewayConfig,
  getBackendServer
} = require('../index');
const request = require('supertest');

describe('gateway-tools', function () {
  describe('createGatewayConfig()', function () {
    it('should create a basic configuration object', function () {
      const gwConfig = createGatewayConfig();

      // Only going to check a few key properties but not the object in
      // its entirety.
      expect(gwConfig.http.port).toBe(0);
      expect(gwConfig.apiEndpoints.api.paths).toBe('/ip');
      expect(gwConfig.serviceEndpoints.backend.url).toBe('http://httpbin.org');
      expect(gwConfig.policies.length).toBe(1);
    });
  });

  describe('createGateway()', function () {
    it('should create a running gateway with default config that can respond to requests', function () {
      let app;
      return createGateway()
        .then((gw) => {
          app = gw.app;
          return request(gw.app)
            .get('/ip')
            .expect(200);
        }).then(() => app.close());
    });

    it('should create a running gateway with custom config and backend that can respond to requests', function () {
      const gwConfig = createGatewayConfig();
      let gwApp;
      let backendApp;

      let customBackendCalled = false;

      const handler = (req, res) => {
        customBackendCalled = true;
        res.sendStatus(200);
      };

      return getBackendServer(0, handler)
        .then((backend) => {
          backendApp = backend.app;
          gwConfig.serviceEndpoints.backend.url = `http://localhost:${backend.port}`;
          return createGateway(gwConfig);
        })
        .then((gw) => {
          gwApp = gw.app;
          return request(gwApp)
            .get('/ip')
            .expect(200);
        })
        .then(() => {
          gwApp.close();
          backendApp.close();
          expect(customBackendCalled).toBe(true);
        });
    });

    it('should create a running gateway that can send requests through a custom plugin', function () {
      const gwConfig = createGatewayConfig();
      let gwApp;

      const policiesToTest = [{
        'test-policy': []
      }];

      return createGateway(gwConfig, './fixtures/test-plugin/manifest.js', policiesToTest)
        .then((gw) => {
          gwApp = gw.app;
          return request(gwApp)
            .get('/ip')
            .expect(200)
            .then((res) =>
              expect(res.headers).toHaveProperty('x-test-policy'));
        })
        .then(() => {
          gwApp.close();
        });
    });
  });
});
