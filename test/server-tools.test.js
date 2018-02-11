const {findOpenPortNumbers, getBackendServer} = require('../server-tools');
const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');

let backend;

describe('server-tools', function () {
  describe('findOpenPortNumbers()', function () {
    it('should return a promise that resolves to an array of available ports', function () {
      return findOpenPortNumbers(3)
        .then((ports) => {
          expect(ports).to.have.lengthOf(3);
          expect(ports).to.not.include(0);
        });
    });
  });

  describe('getBackendServer()', function () {
    before(function () {
      const handler = function (req, res, next) {
        res.sendStatus(200);
      };
      return getBackendServer(0, handler)
        .then((server) => {
          backend = server.app;
        });
    });

    after(function () {
      if (backend) {
        backend.close();
      }
    });
    it('should return an express app that is listening on a random port', function () {
      return request(backend)
        .get('/test')
        .expect(200);
    });
  });
});
