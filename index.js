'use strict';

const debug = require('./lib/debug');
const path = require('path');
const { Service, ServiceRegister } = require('./lib/service');
const { findServices } = require('./lib/utils');


/**
 * 安装 service 服务
 * @param {import('@zenweb/core').Core} core 
 * @param {object} [options]
 * @param {string[]} [options.paths]
 */
function setup(core, options) {
  options = Object.assign({
    paths: [path.join(process.cwd(), 'app', 'service')],
  }, options);
  debug('options: %o', options);
  const register = new ServiceRegister();
  Object.defineProperty(core, 'service', { value: register });
  core.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
  if (options.paths && options.paths.length) {
    core.setupAfter(() => {
      options.paths.forEach(path => {
        const count = findServices(register, path);
        debug('load: %s %o files', path, count);
      });
    });
  }
}

module.exports = {
  Service,
  setup,
};
