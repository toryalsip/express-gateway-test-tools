const gateway = require('express-gateway/lib/gateway');
const Config = require('express-gateway/lib/config/config');
const plugins = require('express-gateway/lib/plugins');
const createGatewayConfig = require('./create-gateway-config');

/**
 * Configures and starts up an express-gateway instance
 * @param {string} customCfg Well-formed gatewayConfig object (use createGatewayConfig())
 * @param {string} pluginPackage Optional, path relative to the test file for the plugin manifest
 * @param {Array} policiesToTest Optional, an array of policies to configure the gateway to test
 */
module.exports = function (customCfg, pluginPackage, policiesToTest = []) {
  policiesToTest.forEach((policyCfg) => {
    const policyName = Object.keys(policyCfg)[0];
    customCfg.policies.push(policyName);
    customCfg.pipelines.basic.policies.unshift(policyCfg);
  });

  const config = new Config();
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
    loadedPlugins = plugins.load({config});
  }

  return gateway({
    plugins: loadedPlugins,
    config
  });
};
