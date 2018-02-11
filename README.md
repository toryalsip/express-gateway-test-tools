# Testing Tools for express-gateway

The purpose of this package is to provide a set of tools to make it easier to write tests against custom plugin code that runs off of the [Express Gateway](https://github.com/ExpressGateway/express-gateway).  Note that some tools may become obsolete dependent on what programmatic features are added to Express Gateway in the future.

## Usage Examples

```JavaScript
const gwTools = require('express-gateway-test-tools').gatewayTools;

describe('exmaple test', function () {
  it('with custom policy', function () {
    let gwConfig = gwTools.createGatewayConfig();
    let gwApp;

    // Setup the actionParams you want to pass into the policies you'll be testing
    let policiesToTest = [
      { 'myPolicy': [
        param1: 'foo',
        param2: 'bar'
      ]}
    ];

    // Path to the manifest file needs to be relative to the test file
    return gwTools.createGateway(gwConfig, '../manifest.js', policiesToTest)
      .then((gw) => {
        gwApp = gw.app;
        return request(gwApp)
          .get('/ip')
          .expect(200)
      })
      .then(() => {
        // Always make sure to close your app when done, or else your test runner won't exit
        gwApp.close();
      });
  });
});

```

## Setting up tests to run
Make certain that at a minimum set `EG_DISABLE_CONFIG_WATCH=true` when running your tests, otherwise the gateway will have issues attempting to load.

## A note on dependencies

The testing tools have no specific dependencies defined, so as to allow a plugin developer to test against the version of Express Gateway that they're actually using.  Thus it is assumed that some version of Express Gateway is installed by the app that is consuming this package.

