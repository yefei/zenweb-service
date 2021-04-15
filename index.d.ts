import * as Koa from 'koa';

export interface ServiceOptions {
  paths?: string[];
  typingGenerate?: boolean;
  typingFile?: string;
}

export declare class Service {
  protected ctx: Koa.Context;
  constructor(ctx: Koa.Context);
}

type serviceClass = <T extends Service> () => { new(ctx: Koa.Context): T };

declare class ServiceRegister {
  /**
   * 注册 service
   * @param cls service class
   * @param name 自定义实例名称，如果不指定则自动使用 class name 首字母小写
   */
  register(cls: serviceClass, name?: string): void;

  /**
   * 取得 services 对象，这里并不会取得所有 service, 而是在单独取得时候才会被初始化
   * @param ctx 
   */
  getContextServices(ctx: Koa.Context): { [name: string]: serviceClass };
}

export declare interface Services {}

declare module '@zenweb/core' {
  interface Core {
    service: ServiceRegister;
  }
}

declare module 'koa' {
  interface BaseContext {
    service: Services;
  }
}
