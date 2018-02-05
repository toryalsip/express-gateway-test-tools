const chai = require('chai');
const should = chai.should();
const {createGateway, createGatewayConfig} = require('../gateway-tools');
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
    it('should create a running gateway that can respond to requests', function () {
      let app;
      return createGateway()
        .then((gw) => {
          app = gw.app;
          return request(gw.app)
            .get('/ip')
            .expect(200);
        }).then(() => app.close());
    });
  });
});