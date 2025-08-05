/*
 * @Author:
 * @Date: 2022-02-11 18:04:18
 * @LastEditTime: 2023-11-22 16:31:55
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { getContext } from '../context';

import Position from './Position';

class Animation {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    this._icrf = null; //自转函数
    this.icrfActive = false; //自转状态
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position();
  }

  /**设置视图到某一点
   * @param {*} position
   * @return {*}
   */
  setView(position) {
    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height),
      orientation: {
        heading: Cesium.Math.toRadians(position.heading || 0.0),
        pitch: Cesium.Math.toRadians(position.pitch || -90.0),
        roll: Cesium.Math.toRadians(position.roll || 0.0),
      },
    });
  }

  /**
   * 异步设置摄像机以查看提供的一个或多个实体或数据源
   * @param {*} target
   * @param {*} offset
   */
  zoomTo(target, offset) {
    this.viewer.zoomTo(target, offset);
  }

  /**设置视图到某区域
   * @param {*} position //120.86667, 30.66667, 122.2, 31.883333
   * @return {*}
   */
  setViewArea(position) {
    this.viewer.camera.setView({
      destination: Cesium.Rectangle.fromDegrees(position),
    });
  }

  /**开始自转 */
  startIcrf() {
    let _viewer = this.viewer;
    _viewer.clock.shouldAnimate = true;
    _viewer.clock.multiplier = 100;
    var previousTime = _viewer.clock.currentTime.secondsOfDay;
    this._icrf = function () {
      var spinRate = 1;
      var currentTime = _viewer.clock.currentTime.secondsOfDay;
      var delta = (currentTime - previousTime) / 1000;
      previousTime = currentTime;
      _viewer.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z, spinRate * delta);
    };
    _viewer.clock.onTick.addEventListener(this._icrf);
    this.icrfActive = true;
  }

  /**停止自转 */
  stopTcrf() {
    if (!this.icrfActive) {
      this.icrfActive = false;
      return false;
    }
    this.viewer.clock.onTick.removeEventListener(this._icrf);
    this.viewer.clock.multiplier = 1;
    this.viewer.clock.shouldAnimate = false;
    this._icrf = null;
  }

  /**
   * 如果在场景中已经添加了各个要素，需要定位到某个目标，显然viewer. fyTo()是比较合适的；也就是说目标是要素，viewer. fyTo()比较合适。
   * 把相机飞到entity, entities, 或者data source位置。在这些数据还加载和渲染完成后，才能触发fyTo。
   * target:可以是entity、entities、tilse或者data source
   */
  viewerFlyTo(target, option = {}, callback) {
    let flyPromise = this.viewer.flyTo(target, {
      duration: 3,
      ...option,
    });
    flyPromise.then(() => {
      callback();
    });
  }

  /**如定位到某个坐标；如果是设置相机位置，Camera.fyTo()比较合适。 */
  cameraFlyTo(position, completeCallback, duration = 3) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height),
      orientation: {
        heading: Cesium.Math.toRadians(position.heading || 0.0),
        pitch: Cesium.Math.toRadians(position.pitch || -90.0),
        roll: Cesium.Math.toRadians(position.roll || 0.0),
      },
      complete: completeCallback,
      duration: duration,
    });
  }

  /**相机绕点旋转
     *
     * * @param viewer
        *  let options = {
            lng: 117.1423291616,
            lat: 39.0645831633,
            height: 15.8,
        };
        viewer.clock.stopTime = viewer.clock.startTime
    */
  setCameraEotateHeading(options, speed = 30) {
    if (options) {
      let viewer = this.viewer;
      let position = Cesium.Cartesian3.fromDegrees(options.lng, options.lat, options.height);
      // 相机看点的角度，如果大于0那么则是从地底往上看，所以要为负值，这里取-30度
      let pitch = Cesium.Math.toRadians(-30);
      // 给定飞行一周所需时间，比如10s, 那么每秒转动度数
      let angle = 360 / speed;
      // 给定相机距离点多少距离飞行，这里取值为5000m
      let distance = 5000;
      let startTime = Cesium.JulianDate.fromDate(new Date());
      viewer.clock.startTime = startTime.clone(); // 开始时间
      viewer.clock.currentTime = startTime.clone(); // 当前时间
      viewer.clock.clockRange = Cesium.ClockRange.CLAMPED; // 行为方式
      viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK; // 时钟设置为当前系统时间; 忽略所有其他设置。
      //相机的当前heading
      let initialHeading = viewer.camera.heading;
      let Exection = function TimeExecution() {
        // 当前已经过去的时间，单位s
        let delTime = Cesium.JulianDate.secondsDifference(viewer.clock.currentTime, viewer.clock.startTime);
        let heading = Cesium.Math.toRadians(delTime * angle) + initialHeading;
        viewer.scene.camera.setView({
          destination: position, // 点的坐标
          orientation: {
            heading: heading,
            pitch: pitch,
          },
        });
        viewer.scene.camera.moveBackward(distance);

        if (Cesium.JulianDate.compare(viewer.clock.currentTime, viewer.clock.stopTime) >= 0) {
          viewer.clock.onTick.removeEventListener(Exection);
        }
      };
      viewer.clock.onTick.addEventListener(Exection);
    }
  }
}

export default Animation;
