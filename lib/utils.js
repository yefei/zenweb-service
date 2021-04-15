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
 * 查找 service 文件
 * @param {string} directory
 * @param {string} [patterns]
 */
function findServiceFiels(directory, patterns) {
  return findFilesSync(directory, patterns || '**/*.js').map(filepath => [filepath, path.join(directory, filepath)]);
}

/**
 * 查找并注册 service
 * @param {ServiceRegister} register
 * @param {string} directory 需要扫描的目录
 * @param {string} [patterns]
 */
function findServices(register, directory, patterns) {
  let count = 0;
  for (const [filepath, fullpath] of findServiceFiels(directory, patterns)) {
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
 * @param {boolean} [stripCwd] 去除当前目录
 */
function getStackLocation(stackIndex = 3, stripCwd = true) {
  const stack = new Error().stack.split('\n')[stackIndex];
  if (stack) {
    // Stack trace format :
    // https://v8.dev/docs/stack-trace-api
    const filename = stack.slice(stack.indexOf('(') + 1, stack.lastIndexOf(')'));
    if (stripCwd && filename && filename.startsWith(process.cwd())) {
      return filename.slice(process.cwd().length + 1);
    }
    return filename;
  }
}

module.exports = {
  getStackLocation,
  findServiceFiels,
  findServices,
  camelize,
};
