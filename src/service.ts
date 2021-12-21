import * as Koa from 'koa';
import debug from './debug';

export class Service {
  readonly ctx: Koa.Context;

  constructor(ctx: Koa.Context) {
    this.ctx = ctx;
  }
}

export type ServiceClass = { new<T extends Service>(ctx: Koa.Context): T };
export type ServiceMap = { [name: string | symbol]: ServiceClass };

export class ServiceRegister {
  registeredServices: ServiceMap = {};

  /**
   * 注册 service
   * @param cls service class
   * @param name 自定义实例名称，如果不指定则自动使用 class name 首字母小写
   */
  register(cls: ServiceClass, name?: string) {
    if (!name) {
      name = cls.name.charAt(0).toLowerCase() + cls.name.slice(1);
    }
    /*
    const namePath = name.split('.');
    namePath.reduce((pre, cur, index) => {
      if (index < namePath.length - 1) {
        if (!pre[cur]) {
          pre[cur] = {};
        }
      } else {
        if (pre[cur]) {
          throw new Error(`Duplicate service name: ${name}`);
        }
        pre[cur] = cls;
      }
      return pre[cur];
    }, this.registeredServices);
    */
    if (name in this.registeredServices) {
      throw new Error(`Duplicate service name: ${name}`);
    }
    this.registeredServices[name] = cls;
  }

  /**
   * 取得 services 对象，这里并不会取得所有 service, 而是在单独取得时候才会被初始化
   */
  getContextServices(ctx: Koa.Context) {
    const inited: { [name: string | symbol]: any } = {};
    return new Proxy(inited, {
      get: (target, property) => {
        if (!(property in target)) {
          if (!(property in this.registeredServices)) {
            throw new Error(`Service: '${String(property)}' not exist`);
          }
          debug('init: %s', property);
          const cls = this.registeredServices[property];
          target[property] = new cls(ctx);
        }
        return target[property];
      },
      has: (target, property) => {
        return property in this.registeredServices;
      },
    });
  }
}
