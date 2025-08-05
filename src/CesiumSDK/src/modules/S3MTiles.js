/*
 * @Author:
 * @Date: 2022-06-15 15:37:22
 * @LastEditTime: 2025-08-05 10:03:33
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
import { getContext } from '../context';
class S3MTiles {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    this.handler = null;
  }

  /** 加载3DTitles图层*/
  createS3MTilesLayer(tilesLayerUrl) {
    if (!Cesium.S3MTilesLayer) {
      throw new Error('S3MTilesLayer: 请先引入S3MTilesLayer插件');
    }
    return new Cesium.S3MTilesLayer({
      context: this.viewer.scene._context,
      url: tilesLayerUrl,
    });
  }

  /**注册S3MTiles点击事件监听
   * @param {*} callback
   * @return {*} 返回S3MTiles实体对象;
   */
  OnClickS3MTiles(callback) {
    let scene = this.viewer.scene;
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.handler = handler;
    handler.setInputAction((event) => {
      const clickPoint = viewer.scene.pick(event.position);
      if (clickPoint && clickPoint.primitive && clickPoint.primitive.TilesType == 'S3M_Tiles') {
        callback && callback(clickPoint);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /** 注销点击事件*/
  removeClick() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
}

export default S3MTiles;
