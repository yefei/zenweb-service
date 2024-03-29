import * as path from 'path';
import { SetupFunction } from '@zenweb/core';
import { ServiceRegister } from './service';
import { findServices } from './utils';
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
}

const defaultOption: ServiceOption = {
  paths: [path.join(process.cwd(), 'app', 'service')],
};

/**
 * 安装 service 服务
 */
export default function setup(option?: ServiceOption): SetupFunction {
  option = Object.assign({}, defaultOption, option);
  return async function service(setup) {
    setup.debug('option: %o', option);
    const register = new ServiceRegister();
    setup.defineCoreProperty('serviceRegister', { value: register });
    setup.defineContextCacheProperty('service', ctx => register.getContextServices(ctx));
    if (option.paths && option.paths.length) {
      for (const p of option.paths) {
        await findServices(register, p, option.patterns);
      }
    }
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
