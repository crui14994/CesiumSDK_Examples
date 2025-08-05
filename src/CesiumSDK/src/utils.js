/*
 * @Author:
 * @Date: 2022-02-10 14:32:05
 * @LastEditTime: 2022-03-01 11:13:29
 * @LastEditors: Please set LastEditors
 * @Description:
 */

/**转换html字符串为dom对象 */
export function parseDom(arg) {
  var objE = document.createElement('div');
  objE.innerHTML = arg;
  return objE.childNodes;
}
