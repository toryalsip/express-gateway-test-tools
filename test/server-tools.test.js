const { getBackendServer } = require('../index');
const request = require('supertest');

let backend;

describe('server-tools', function () {
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
