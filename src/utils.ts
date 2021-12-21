import * as globby from 'globby';
import debug from './debug';
import { ServiceRegister } from './service';

const NAME_TEST = /^[a-z][a-z0-9_-]*$/i;
const NAME_SPLIT = /[_-][a-z]/ig;

/**
 * 驼峰文件名
 *  aaa/bbb_service.js => aaa_bbbService
 */
export function camelize(filepath: string) {
  const dotIndex = filepath.lastIndexOf('.');
  const properties = (dotIndex > 0 ? filepath.substring(0, dotIndex) : filepath).split('/');
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
 * @param directory 需要扫描的目录
 * @param patterns 扫描匹配规则
 */
export async function findServices(register: ServiceRegister, directory: string, patterns?: string) {
  let count = 0;
  for (const file of await globby(patterns || '**/*.{ts,js}', { cwd: directory, absolute: true })) {
    const cls = require(file.slice(0, -3));
    if (cls.default) {
      const filename = file.slice(directory.length + 1);
      const name = camelize(filename);
      debug('register: %s => %s', file, name);
      register.register(cls.default, name);
      count++;
    } else {
      debug('ignore: %s', file)
    }
  }
  return count;
}
