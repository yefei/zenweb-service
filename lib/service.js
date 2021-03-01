/**
 * @typedef {import('koa').Context} Context
 * @typedef {import('zenweb').Core} Core
 */
'use strict';

const debug = require('debug')('zenweb:service');
const { getStackLocation } = require('./utils');

class Service {
  /**
   * @param {Context} ctx 
   */
  constructor(ctx) {
    this.ctx = ctx;
  }
}

class ServiceRegister {
  constructor() {
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
    if (this.registeredServices.has(name)) {
      throw new Error(`Duplicate service name: ${getStackLocation() || cls} => ${name}`);
    }
    if (debug.enabled) {
      debug('register: %s => %s', getStackLocation() || cls, name);
    }
  }

  /**
   * 取得 services 对象，这里并不会取得所有 service, 而是在单独取得时候才会被初始化
   * @param {Context} ctx
   */
  getContextServices(ctx) {
    return new Proxy({}, {
      get(target, property) {
        if (!(property in target)) {
          if (!this.registeredServices.has(property)) {
            throw new Error(`Does not exist service: ${property}`);
          }
          debug('init: %s', property);
          const cls = this.registeredServices.get(property);
          target[property] = new cls(ctx);
        }
        return target[property];
      },
    });
  }
}

module.exports = {
  Service,
  ServiceRegister,
};
