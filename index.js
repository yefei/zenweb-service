import path from 'node:path';
import { ServiceRegister } from './lib/service.js';
import { findServices } from './lib/utils.js';
import { findServicesToTyping } from './lib/typing.js';
export { Service } from './lib/service.js';

/**
 * 安装 service 服务
 * @param {import('@zenweb/core').Core} core 
 * @param {object} [options]
 * @param {string[]} [options.paths]
 * @param {boolean} [options.typingGenerate]
 * @param {string} [options.typingFile]
 * @param {string} [options.patterns]
 */
export function setup(core, options) {
  options = Object.assign({
    paths: [path.join(process.cwd(), 'app', 'service')],
    typingGenerate: process.env.NODE_ENV === 'development',
    typingFile: path.resolve(process.cwd(), 'typings', 'service.d.ts'),
  }, options);
  const register = new ServiceRegister();
  Object.defineProperty(core, 'serviceRegister', { value: register });
  core.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
  if (options.paths && options.paths.length) {
    core.setupAfter(async () => {
      for (const p of options.paths) {
        await findServices(register, p, options.patterns);
      }
      // 生成代码补全提示文件
      if (options.typingGenerate) {
        await findServicesToTyping(options.paths, options.typingFile, options.patterns);
      }
    });
  }
}
