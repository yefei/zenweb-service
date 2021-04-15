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
 * @param {boolean} [options.typingGenerate]
 * @param {string} [options.typingFile]
 * @param {string} [options.patterns]
 */
function setup(core, options) {
  options = Object.assign({
    paths: [path.join(process.cwd(), 'app', 'service')],
    typingGenerate: process.env.NODE_ENV === 'development',
    typingFile: path.resolve(process.cwd(), 'typings', 'service.d.ts'),
  }, options);
  debug('options: %o', options);
  const register = new ServiceRegister();
  Object.defineProperty(core, 'service', { value: register });
  core.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
  if (options.paths && options.paths.length) {
    core.setupAfter(() => {
      options.paths.forEach(path => {
        const count = findServices(register, path, options.patterns);
        debug('load: %s %o files', path, count);
      });
      // 生成代码补全提示文件
      if (options.typingGenerate) {
        debug('generate service typing');
        require('./lib/typing').findServicesToTyping(options.paths, options.typingFile, options.patterns);
      }
    });
  }
}

module.exports = {
  Service,
  setup,
};
