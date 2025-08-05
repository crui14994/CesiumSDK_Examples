/*
 * @Author:
 * @Date: 2022-06-15 15:37:22
 * @LastEditTime: 2024-03-06 16:10:21
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { getContext } from '../context';

class MVT {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    this.providerArr = []; //保存创建的MVT对象，用于销毁
  }

  /**
   * 获取所有MVT生成的图层
   * @returns
   */
  getAllProviderLayers() {
    return this.providerArr;
  }

  /**加载MVT图层
   * @param {*} mapboxStyle mapbox的样式配置对象
   * @param {*} name 指定一个唯一值，用于销毁MVT图层
   * @param {*} callback
   * @return {*} myLayer 当前加载的MVT图层
   */
  loadMvtLayers(mapboxStyle, name, callback) {
    let provider = new Cesium.MVTImageryProvider({
      style: mapboxStyle,
    });
    provider.name = name;
    return provider.readyPromise.then(() => {
      let myLayer = this.viewer.imageryLayers.addImageryProvider(provider);
      this.providerArr.push({
        name: name,
        provider: provider,
        imageryLayer: myLayer,
      });
      callback && callback(myLayer);
    });
  }

  /**销毁全部mvt图层
   * 在切换加载MVT时一定要销毁之前的图层，否则会报错
   */
  destoryMvtAll() {
    this.providerArr.forEach((item) => {
      this.viewer.imageryLayers.remove(item.imageryLayer, true);
      item.imageryLayer = null;
      item.provider.destroy();
    });
    this.providerArr = [];
  }

  /**根据name销毁指定的mvt图层
   * @param {Array} nameArr 字符串数组，要销毁的图层
   */
  destoryMVT(nameArr) {
    nameArr.forEach((item) => {
      let i = this.providerArr.findIndex((pItem) => pItem.name == item);
      if (i != -1) {
        this.viewer.imageryLayers.remove(this.providerArr[i].imageryLayer, true);
        this.providerArr[i].imageryLayer = null;
        this.providerArr[i].provider.destroy();
        this.providerArr.splice(i, 1);
      }
    });
  }
}

export default MVT;
