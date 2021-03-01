'use strict';

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
};
