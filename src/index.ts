import * as path from 'path';
import { Core } from '@zenweb/core';
import { ServiceRegister } from './service';
import { findServices } from './utils';
import { findServicesToTyping } from './typing';
export { Service } from './service';

export interface ServiceOption {
  /**
   * 加载 service 文件目录，默认: ./app/service
   */
  paths?: string[];

  /**
   * 文件匹配规则，默认: ** /*.{ts,js}
   */
  patterns?: string;

  /**
   * 是否需要生成 service.d.ts 文件，在开发环境下每次都生成
   */
  typingGenerate?: boolean;

  /**
   * 生成 service.d.ts 文件的路径，默认：./typings/service.d.ts
   */
  typingFile?: string;
}

const defaultOption: ServiceOption = {
  paths: [path.join(process.cwd(), 'app', 'service')],
  typingGenerate: process.env.NODE_ENV === 'development',
  typingFile: path.resolve(process.cwd(), 'typings', 'service.d.ts'),
};

/**
 * 安装 service 服务
 */
export function setup(core: Core, option?: ServiceOption) {
  option = Object.assign({}, defaultOption, option);
  const register = new ServiceRegister();
  Object.defineProperty(core, 'serviceRegister', { value: register });
  core.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
  if (option.paths && option.paths.length) {
    core.setupAfter(async () => {
      for (const p of option.paths) {
        await findServices(register, p, option.patterns);
      }
      // 生成代码补全提示文件
      if (option.typingGenerate) {
        await findServicesToTyping(option.paths, option.typingFile, option.patterns);
      }
    });
  }
}

declare module '@zenweb/core' {
  interface Core {
    serviceRegister: ServiceRegister;
  }
}

/**
 * ctx.service 中的 service 索引都定义在此
 */
export declare interface Services {}

declare module 'koa' {
  interface DefaultContext {
    service: Services;
  }
}
