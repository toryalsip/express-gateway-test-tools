const getBackendServer = require('../../server-tools/get-backend-server');
const request = require('supertest');

describe('getBackendServer()', function () {
  it('should return an express app that is listening on a random port', function () {
    let handler = function (req, res, next) {
      res.sendStatus(200);
    }
    return getBackendServer(0, handler)
      .then((server) => {
        return request(server.app);
      });
  });
});