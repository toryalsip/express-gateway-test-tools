const gateway = require('express-gateway/lib/gateway');
const Config = require('express-gateway/lib/config/config');
const plugins = require('express-gateway/lib/plugins');
const createGatewayConfig = require('./create-gateway-config');

module.exports = function (customCfg, pluginPackage) {
  if (!process.env.EG_DISABLE_CONFIG_WATCH) {
    process.env.EG_DISABLE_CONFIG_WATCH = 'true';
  }

  let config = new Config();
  config.gatewayConfig = customCfg || createGatewayConfig();

  let loadedPlugins = { };
  if (pluginPackage) {
    config.systemConfig = {
      plugins: {
        'custom-plugin': {
          package: pluginPackage
        }
      }
    };
    loadedPlugins = plugins.load({config})
  }

  return gateway({
    plugins: loadedPlugins,
    config
  });
}