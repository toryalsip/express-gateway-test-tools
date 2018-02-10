const chai = require('chai');
const should = chai.should();
const {createGateway, createGatewayConfig} = require('../gateway-tools');
const getBackendServer = require('../server-tools').getBackendServer;
const request = require('supertest');

describe('gateway-tools', function () {
  describe('createGatewayConfig()', function () {
    it('should create a basic configuration object', function () {
      let gwConfig = createGatewayConfig();

      // Only going to check a few key properties but not the object in
      // its entirety.
      gwConfig.should.have.property('http').with.property('port').equal(0);
      gwConfig.apiEndpoints.api.paths.should.equal('/ip');
      gwConfig.serviceEndpoints.backend.url.should.equal('http://httpbin.org');
      gwConfig.should.have.property('policies').with.lengthOf(1);
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
      let gwConfig = createGatewayConfig();
      let gwApp;
      let backendApp;

      let customBackendCalled = false;

      let handler = (req, res) => {
        customBackendCalled = true;
        res.sendStatus(200);
      };

      return getBackendServer(0, handler)
        .then((backend) => {
          backendApp = backend.app;
          gwConfig.serviceEndpoints.backend.url = `http://localhost:${backend.port}`;
          return createGateway(gwConfig)
        })
        .then((gw) => {
          gwApp = gw.app;
          return request(gwApp)
            .get('/ip')
            .expect(200)
        })
        .then(() => {
          gwApp.close();
          backendApp.close();
          customBackendCalled.should.be.true;
        });
    });

    it('should create a running gateway that can send requests through a custom plugin', function () {
      let gwConfig = createGatewayConfig();
      let gwApp;

      // TODO: Figure out better way to configure a policy under test, or leave it up to the plugin dev
      gwConfig.policies.push('test-policy');
      gwConfig.pipelines.basic.policies.unshift({'test-policy': []});

      return createGateway(gwConfig, './fixtures/test-plugin/manifest.js')
        .then((gw) => {
          gwApp = gw.app;
          return request(gwApp)
            .get('/ip')
            .expect(200)
            .expect((res) => 
              res.header.should.have.property('x-test-policy'));
        })
        .then(() => {
          gwApp.close();
        });
    });
  });
});