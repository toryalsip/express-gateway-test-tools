const gateway = require('express-gateway/lib/gateway');
const Config = require('express-gateway/lib/config/config');
const createGatewayConfig = require('./create-gateway-config');

module.exports = function () {
  if (!process.env.EG_DISABLE_CONFIG_WATCH) {
    process.env.EG_DISABLE_CONFIG_WATCH = 'true';
  }

  let config = new Config();
  config.gatewayConfig = createGatewayConfig();

  return gateway({
    plugins: { },
    config
  });
}