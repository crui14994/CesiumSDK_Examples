/*
 * @Author:
 * @Date: 2022-02-23 17:38:42
 * @LastEditTime: 2024-02-05 16:32:17
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { getContext } from '../context';

import Position from './Position';
// import { parseDom } from '../utils';

export default class Popup {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;
    this.popupDom = null; //弹窗html对象
    this.eventListener = null; //监听对象
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position();
  }

  /**创建弹窗
   * @param {*} wgs_84 经纬度坐标 {lng:0, lat:0,height:0}
   * @param {*} width 盒子宽度
   * @param {*} height 盒子高度
   * @param {*} topH 上下偏移高度
   * @param {*} leftW 左右偏移宽度
   * @return {*}
   */
  async createPopup(id, wgs_84, width = 300, height = 200, topH = 0, leftW = 0) {
    if (!id) {
      return false;
    }

    //获取地形高程数据才不会在有地形时popup发生偏移
    // eslint-disable-next-line no-prototype-builtins
    if (!wgs_84.hasOwnProperty('height')) {
      wgs_84.height = await this.PositionUtils.getHeigthByLonLat(wgs_84.lng, wgs_84.lat);
    }

    this.closePopup();
    this.popupDom = document.getElementById(id);
    this.popupDom.style.width = width + 'px';
    this.popupDom.style.height = height + 'px';
    // 获取点位屏幕坐标
    let entityXY = this.PositionUtils.transformWGS84ToWindow(wgs_84);
    let { x, y } = entityXY;
    this.popupDom.style.top = y - height / 2 - 23 + topH + 'px';
    this.popupDom.style.left = x - width + leftW + 'px';
    this.popupDom.style.display = 'block';

    this.eventListener = () => {
      if (this.popupDom.style.display !== 'none') {
        //气泡已经被点击显示的时候触发
        //将实体的坐标系位置转化为当前窗口位置
        let entityPos = this.PositionUtils.transformWGS84ToWindow(wgs_84);
        if (entityPos) {
          let { x, y } = entityPos;
          this.popupDom.style.top = y - height / 2 - 23 + topH + 'px';
          this.popupDom.style.left = x - width + leftW + 'px';
        }
      }
    };
    // 气泡跟随实体点的移动而移动
    this.viewer.scene.postRender.addEventListener(this.eventListener);
  }

  /**关闭popup弹窗 */
  closePopup() {
    if (this.popupDom && this.popupDom.style.display !== 'none') {
      this.popupDom.style.display = 'none';
      this.viewer.scene.postRender.removeEventListener(this.eventListener);
      this.eventListener = null;
    }
  }
}
