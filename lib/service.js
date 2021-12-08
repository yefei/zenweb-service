/**
 * @typedef {import('koa').Context} Context
 * @typedef {import('@zenweb/core').Core} Core
 */
import debug from './debug.js';

export class Service {
  /**
   * @param {Context} ctx 
   */
  constructor(ctx) {
    this.ctx = ctx;
  }
}

export class ServiceRegister {
  constructor() {
    // this.registeredServices = {};
    this.registeredServices = new Map();
  }

  /**
   * 注册 service
   * @param {<T extends Service>() => { new(ctx: Context): T }} cls service class
   * @param {string} [name] 自定义实例名称，如果不指定则自动使用 class name 首字母小写
   */
  register(cls, name) {
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
    if (this.registeredServices.has(name)) {
      throw new Error(`Duplicate service name: ${name}`);
    }
    this.registeredServices.set(name, cls);
  }

  /**
   * 取得 services 对象，这里并不会取得所有 service, 而是在单独取得时候才会被初始化
   * @param {Context} ctx
   */
  getContextServices(ctx) {
    return new Proxy({}, {
      get: (target, property) => {
        if (!(property in target)) {
          if (!this.registeredServices.has(property)) {
            throw new Error(`Service: '${property}' not exist`);
          }
          debug('init: %s', property);
          const cls = this.registeredServices.get(property);
          target[property] = new cls(ctx);
        }
        return target[property];
      },
      has: (target, property) => {
        return this.registeredServices.has(property);
      },
    });
  }
}
