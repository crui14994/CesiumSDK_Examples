/*
 * @Author:
 * @Date: 2022-02-17 11:03:50
 * @LastEditTime: 2025-01-23 11:06:16
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
import { getContext } from '../context';
export default class Position {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;
  }

  get camera() {
    return this.viewer.camera;
  }

  /**获取相机位置及姿态
   * @param {*}
   * @return {*}
   */
  getCameraAttitude() {
    return {
      lng: Cesium.Math.toDegrees(this.camera.positionCartographic.longitude).toFixed(6),
      lat: Cesium.Math.toDegrees(this.camera.positionCartographic.latitude).toFixed(6),
      height: this.camera.positionCartographic.height.toFixed(0),
      heading: Cesium.Math.toDegrees(this.camera.heading).toFixed(0),
      pitch: Cesium.Math.toDegrees(this.camera.pitch).toFixed(0),
      roll: Cesium.Math.toDegrees(this.camera.roll).toFixed(0),
    };
  }

  /**根据屏幕坐标 获取世界坐标、地形坐标、场景坐标
   * @param {event} event.position
   * @param {type} type 1-世界坐标（地图/椭球体表面的坐标） 2-地形坐标 3-场景坐标
   * @return {position}
   */
  getClickPosition(eventPosition, type = 1) {
    // return new Promise(resolve => {
    //     let position;
    //     if (type == 1) {
    //         //当前点击视线与椭球面相交处的坐标，其中ellipsoid是当前地球使用的椭球对象
    //         position = this.viewer.scene.camera.pickEllipsoid(event.position, this.viewer.scene.globe.ellipsoid);
    //     } else if (type == 2) {
    //         //只能求交于地形，不包括模型、倾斜摄影表面，能获取加载地形后的坐标，pick(ray, scene, result) → Cartesian3|undefined
    //         let ray = this.viewer.camera.getPickRay(event.position);
    //         position = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    //     } else if (type == 3) {
    //         // 根据窗口坐标，从场景的深度缓冲区中拾取相应的位置，返回笛卡尔坐标，不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。pickPosition(windowPosition, result) → Cartesian3
    //         var pickedObject = this.viewer.scene.pick(event.endPosition);
    //         // 使用时，最好利用pickPositionSupported判断一下浏览器是否支持模型高度拾取
    //         if (this.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject)) {
    //             //解决viewer.scene.pickPosition(e.position)在没有3dTile模型下的笛卡尔坐标不准问题
    //             this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
    //             position = this.viewer.scene.pickPosition(event.position);
    //         }
    //     } else if (type == 4) {
    //         //获取点击处屏幕坐标 ：屏幕坐标（鼠标点击位置距离canvas左上角的像素值）
    //         position = event.position;
    //     }
    //     resolve(position);
    // })

    let position;
    if (type == 1) {
      //当前点击视线与椭球面相交处的坐标，其中ellipsoid是当前地球使用的椭球对象
      position = this.viewer.scene.camera.pickEllipsoid(eventPosition, this.viewer.scene.globe.ellipsoid);
    } else if (type == 2) {
      //只能求交于地形，不包括模型、倾斜摄影表面，能获取加载地形后的坐标，pick(ray, scene, result) → Cartesian3|undefined
      let ray = this.viewer.camera.getPickRay(eventPosition);
      position = this.viewer.scene.globe.pick(ray, this.viewer.scene);
    } else if (type == 3) {
      // 根据窗口坐标，从场景的深度缓冲区中拾取相应的位置，返回笛卡尔坐标，不仅可以求交地形，还可以求交除地形以外其他所有写深度的物体。pickPosition(windowPosition, result) → Cartesian3
      var pickedObject = this.viewer.scene.pick(eventPosition);
      // 使用时，最好利用pickPositionSupported判断一下浏览器是否支持模型高度拾取
      if (this.viewer.scene.pickPositionSupported && Cesium.defined(pickedObject)) {
        //解决viewer.scene.pickPosition(e.position)在没有3dTile模型下的笛卡尔坐标不准问题
        this.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
        position = this.viewer.scene.pickPosition(eventPosition);
      }
    }
    return position;
  }

  /**根据经纬度获取terrain高程，精度为m
   * @return {*}
   */
  getHeigthByLonLat(lng, lat) {
    var positions = Cesium.Cartographic.fromDegrees(lng, lat);

    return new Promise((resolve, reject) => {
      Cesium.sampleTerrain(this.viewer.terrainProvider, 13, [positions]).then((updatedPositions) => {
        resolve(updatedPositions[0].height);
      });
    });
  }

  /**根据经纬度数组获取terrain高程，精度为m
   * @return {*}
   */
  getHeigthByArr(positions) {
    positions = positions.map((item) => {
      return Cesium.Cartographic.fromDegrees(item.lng, item.lat);
    });

    return new Promise((resolve, reject) => {
      Cesium.sampleTerrain(this.viewer.terrainProvider, 13, positions).then((updatedPositions) => {
        resolve(updatedPositions);
      });
    });
  }

  /** 世界坐标转换为 84 坐标(纬度坐标)
   * @param {cartesian} cartesian：世界坐标
   * @return {position}
   */
  transformCartesianToWGS84(cartesian) {
    if (cartesian) {
      var ellipsoid = this.viewer.scene.globe.ellipsoid;
      var cartographic = ellipsoid.cartesianToCartographic(cartesian);
      var lat = Cesium.Math.toDegrees(cartographic.latitude);
      var lng = Cesium.Math.toDegrees(cartographic.longitude);
      var alt = cartographic.height;
      return {
        lng: lng,
        lat: lat,
        height: alt,
      };
    }
  }

  /**84坐标(纬度坐标)转换为世界坐标
   * @param  position
   * @return {Cartesian3}
   */
  transformWGS84ToCartesian(position) {
    return position
      ? Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height, Cesium.Ellipsoid.WGS84)
      : Cesium.Cartesian3.ZERO;
  }

  /** 84纬度坐标转换为 84弧度坐标
   * @param {Position} position：84 坐标
   * @return {cartographic}
   */
  transformWGS84ToCartographic(position) {
    return position
      ? Cesium.Cartographic.fromDegrees(position.lng, position.lat, position.height)
      : Cesium.Cartographic.ZERO;
  }

  /** 世界坐标数组转 84 坐标数组
   * @param {Array<cartesian3>} cartesianArr：世界坐标数组
   * @return {*}
   */
  transformCartesianArrayToWGS84Array(cartesianArr) {
    return cartesianArr ? cartesianArr.map((item) => this.transformCartesianToWGS84(item)) : [];
  }

  /**屏幕坐标转84坐标(纬度坐标)
   * @param {*} position 屏幕坐标，格式{x:1,y:1}
   * @return {*}
   */
  transformWindowToWGS84(position) {
    let scene = this.viewer.scene;
    let cartesian;
    if (scene.mode === Cesium.SceneMode.SCENE3D) {
      let ray = scene.camera.getPickRay(position);
      cartesian = scene.globe.pick(ray, scene);
    } else {
      cartesian = scene.camera.pickEllipsoid(position, Cesium.Ellipsoid.WGS84);
    }
    return this.transformCartesianToWGS84(cartesian);
  }

  /** 84 坐标数组转世界坐标数组
   * @param {Array<cartesian3>} WGS84Arr：84 坐标数组
   * @return {*}
   */
  transformWGS84ArrayToCartesianArray(WGS84Arr) {
    return WGS84Arr
      ? WGS84Arr.map((item) =>
          Cesium.Cartesian3.fromDegrees(item.lng, item.lat, item.height || 0, Cesium.Ellipsoid.WGS84)
        )
      : [];
  }

  /**84坐标(纬度坐标)转 屏幕坐标
   * @param {*} position  84 坐标
   * @return {*}
   */
  transformWGS84ToWindow(position) {
    let scene = this.viewer.scene;
    return Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, this.transformWGS84ToCartesian(position));
  }
}
