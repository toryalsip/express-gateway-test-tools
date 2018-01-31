const {findOpenPortNumbers, getBackendServer} = require('../server-tools');
const chai = require('chai');
const should = chai.should();
const request = require('supertest');

let backend = undefined;

describe('server-tools', function () {
  describe('findOpenPortNumbers()', function () {
    it('should return a promise that resolves to an array of available ports', function () {
      return findOpenPortNumbers(3)
        .then((ports) => {
          ports.should.have.lengthOf(3);
          ports.should.not.include(0);
        });
    });
  });

  describe('getBackendServer()', function () {
    before(function () {
      let handler = function (req, res, next) {
        res.sendStatus(200);
      }
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