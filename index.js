'use strict';

const { Service, ServiceRegister } = require('./lib/service');

/**
 * 安装 service 服务
 * @param {import('zenweb').Core} core 
 * @param {object} [options]
 */
function setup(core, options) {
  const register = new ServiceRegister();
  Object.defineProperty(core, 'service', { value: register });
  core.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
}

module.exports = {
  Service,
  setup,
};
