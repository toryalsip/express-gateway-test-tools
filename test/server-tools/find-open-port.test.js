const findOpenPortNumbers = require('../../server-tools/find-open-port');
const chai = require('chai');
const should = chai.should();

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
});