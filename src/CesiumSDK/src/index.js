/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2023-10-17 14:39:45
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-24 13:42:25
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\index.js
 * @Description:
 *
 */
import { setContext } from './context.js';

import Viewer from './modules/Viewer';
import Imagery from './modules/Imagery';
import Animation from './modules/Animation';
import Roaming from './modules/Roaming';
import BaseFn from './modules/BaseFn';
import Entity from './modules/Entity';
import Position from './modules/Position';
import Popup from './modules/Popup';
import Draw from './modules/Draw';
import MVT from './modules/MVT';
import S3MTiles from './modules/S3MTiles';
import CesiumThree from './modules/CesiumThree';
import Material from './modules/Material.js';

import './styles/index.css';

class CesiumMap {
  // 天地图key
  static TDT_KEY = '';

  constructor(id, options = {}) {
    this.id = id;
    this.options = options;
    this._init();
  }

  //保存cesium的viewer对象
  get _viewer() {
    return this.Viewer._viewer;
  }

  /**初始化 */
  _init() {
    this.Viewer = new Viewer(this.id, this.options, CesiumMap);

    // 设置全局上下文
    setContext(this._viewer, CesiumMap);

    // 后续模块可以直接使用 getContext 获取 viewer 和 CesiumMap
    this.Animation = new Animation();
    this.Roaming = new Roaming();
    this.Imagery = new Imagery();
    this.BaseFn = new BaseFn();
    this.Entity = new Entity();
    this.Position = new Position();
    this.Popup = new Popup();
    this.Draw = new Draw();
    this.Material = new Material();
    this.CesiumThree = new CesiumThree();

    //下面几个对象需要在使用的时候手动new初始化一下
    this.MVT = MVT;
    this.S3MTiles = S3MTiles;
  }
}

export default CesiumMap;
