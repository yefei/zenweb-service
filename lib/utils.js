'use strict';

const path = require('path');
const { findFilesSync } = require('@feiye/discover');

const NAME_TEST = /^[a-z][a-z0-9_-]*$/i;
const NAME_SPLIT = /[_-][a-z]/ig;

/**
 * 驼峰文件名
 * @param {string} filepath 
 * @param {string} separator
 */
function camelize(filepath, separator = '_') {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    if (!NAME_TEST.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }
    // FooBar.js  > fooBar
    property = property.replace(NAME_SPLIT, s => s.substring(1).toUpperCase());
    return property[0].toLowerCase() + property.slice(1);
  }).join(separator);
}

/**
 * 查找并注册 service
 * @param {ServiceRegister} register
 * @param {string} directory
 */
function findServices(register, directory) {
  let count = 0;
  for (const filepath of findFilesSync(directory, '**/*.js')) {
    const fullpath = path.join(directory, filepath);
    try {
      const cls = require(fullpath);
      register.register(cls, camelize(filepath));
      count++;
    } catch (e) {
      throw new Error(`load error [${fullpath}]: ${e.message}`);
    }
  }
  return count;
}

/**
 * 取得调用栈中位置信息，例如文件位置
 * @param {number} [stackIndex] 第几层
 */
function getStackLocation(stackIndex = 3) {
  const stack = new Error().stack.split('\n')[stackIndex];
  if (stack) {
    // Stack trace format :
    // https://v8.dev/docs/stack-trace-api
    return stack.slice(stack.indexOf('(') + 1, stack.lastIndexOf(')'));
  }
}

module.exports = {
  getStackLocation,
  findServices,
  camelize,
};
