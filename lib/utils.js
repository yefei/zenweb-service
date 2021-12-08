import { globby } from 'globby';
import debug from './debug.js';

const NAME_TEST = /^[a-z][a-z0-9_-]*$/i;
const NAME_SPLIT = /[_-][a-z]/ig;

/**
 * 驼峰文件名
 *  aaa/bbb_service.js => aaa_bbbService
 * @param {string} filepath
 */
export function camelize(filepath) {
  const properties = filepath.substring(0, filepath.lastIndexOf('.')).split('/');
  return properties.map(property => {
    if (!NAME_TEST.test(property)) {
      throw new Error(`${property} is not match 'a-z0-9_-' in ${filepath}`);
    }
    // FooBar.js  > fooBar
    property = property.replace(NAME_SPLIT, s => s.substring(1).toUpperCase());
    return property[0].toLowerCase() + property.slice(1);
  }).join('_');
}

/**
 * 查找并注册 service
 * @param {ServiceRegister} register
 * @param {string} directory 需要扫描的目录
 * @param {string} [patterns]
 */
export async function findServices(register, directory, patterns) {
  let count = 0;
  for (const file of await globby(patterns || '**/*.js', { cwd: directory, absolute: true })) {
    const cls = await import('file://' + file);
    if (cls.default) {
      const filename = file.slice(directory.length + 1);
      const name = camelize(filename);
      debug('register: file://%s => %s', file, name);
      register.register(cls.default, name);
      count++;
    } else {
      debug('ignore: file://%s', file)
    }
  }
  return count;
}
