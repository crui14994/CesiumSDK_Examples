/*
 * @Author:
 * @Date: 2022-02-11 18:04:18
 * @LastEditTime: 2025-01-08 11:27:41
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
/*global Cesium viewer CM*/
import { getContext } from '../context';

import Position from './Position';
import BaseFn from './BaseFn';

let entityRoaming,
  property, //巡航的entity对象
  propertyTimes = []; //巡航的entity对象的时间集合
// eslint-disable-next-line no-unused-vars

let dataSources = new Cesium.CustomDataSource('dataSourcesRoaming'); //创建一个数据源

class Roaming {
  static roamingPitch = -40; //巡航俯仰角
  static roamingHeight = 1500; //巡航高度
  static roamingSpeed = 0.3; //巡航速度
  static roamingRange = 50.0; //距中心的距离

  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    viewer.dataSources.add(dataSources); //添加数据源

    this.roamingHandler = null; //跟踪巡航监听视角方向事件
    this._roamingHandlerFn = this._roamingHandlerFn.bind(this); // 绑定事件处理函数
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position();
  }

  /**获取BaseFn对象 */
  get BaseFnUtils() {
    return new BaseFn();
  }

  /**路径漫游
   * @param {*} polylineData 路径的Cartesian3坐标数组
   * @return {*}
   */
  RoamingStart(polylineData, romingConfig) {
    if (!polylineData) {
      throw new Error('巡航路径未定义！');
    }
    romingConfig = {
      modelUrl: '',
      modelShow: true,
      pathShow: true,
      polylineShow: true,
      interpolationOptions: null,
      ...romingConfig,
    };

    //获取路径总距离
    let distanceTotal = this.BaseFnUtils.getSpaceDistance(polylineData);

    const start = Cesium.JulianDate.fromDate(new Date()); // 获取当前时间作为开始时间
    const duration = distanceTotal / 50; // 动画持续时间50米每秒（这里计算是保证不管路线长短运动速度是一样的）
    const stop = Cesium.JulianDate.addSeconds(start, duration, new Cesium.JulianDate()); // 计算结束时间

    // 配置Cesium时钟
    viewer.clock.startTime = start;
    viewer.clock.stopTime = stop;
    viewer.clock.currentTime = start;
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.multiplier = Roaming.roamingSpeed; // 动画速度
    viewer.clock.shouldAnimate = true;

    // 设置时间轴
    viewer.timeline.zoomTo(start, stop);

    property = new Cesium.SampledPositionProperty(); // 创建样本位置属性
    // 开始采样 每个点与初始点间隔多少时间 单位秒
    let num = 0;
    polylineData.forEach((point, index) => {
      let distance = 0;
      if (index > 0) {
        distance = this.BaseFnUtils.getSpaceDistance([
          polylineData[index - 1],
          polylineData[index],
        ]);
      }
      //用于匀速飞行
      let t2 = (distance / distanceTotal) * duration + num;
      num = t2;

      const time = Cesium.JulianDate.addSeconds(start, t2, new Cesium.JulianDate());
      propertyTimes.push(time);
      // property.addSample(time, point); // 添加每个点
      let wgs84 = this.PositionUtils.transformCartesianToWGS84(point);
      let cartesian = Cesium.Cartesian3.fromDegrees(wgs84.lng, wgs84.lat, Roaming.roamingHeight);
      property.addSample(time, cartesian);
    });

    entityRoaming = dataSources.entities.add({
      availability: new Cesium.TimeIntervalCollection([
        new Cesium.TimeInterval({ start: start, stop: stop }),
      ]),
      position: property,
      orientation: new Cesium.VelocityOrientationProperty(property),
      model: {
        uri: romingConfig.modelUrl,
        minimumPixelSize: 21,
        show: romingConfig.modelShow,
      },
      path: {
        resolution: 1,
        material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.1,
          color: Cesium.Color.YELLOW,
        }),
        width: 5,
        show: romingConfig.pathShow,
      },
    });

    if (romingConfig.polylineShow) {
      dataSources.entities.add({
        polyline: {
          positions: polylineData,
          show: true,
          material: Cesium.Color.TRANSPARENT,
          width: 1,
          clampToGround: true,
        },
      });
    }

    // 点插值
    if (romingConfig.interpolationOptions) {
      entityRoaming.position.setInterpolationOptions({ ...romingConfig.interpolationOptions });
    }

    return entityRoaming;
  }

  /**上帝视角开启 */
  openGodView() {
    if (dataSources) {
      if (this.roamingHandler) {
        this.StopTrackedEntity();
      } else {
        let viewer = this.viewer;
        // viewer.trackedEntity = undefined;
        viewer.zoomTo(
          dataSources.entities,
          new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90))
        );
      }
    } else {
      throw new Error('还为创建巡航对象！'); //注意Error要大写
    }
  }

  /**停止跟踪巡航实体 */
  StopTrackedEntity() {
    let that = this;
    if (that.roamingHandler && entityRoaming) {
      let viewer = this.viewer;
      // viewer.trackedEntity = undefined;
      viewer.zoomTo(
        dataSources.entities,
        new Cesium.HeadingPitchRange(0, Cesium.Math.toRadians(-90))
      );
      viewer.scene.preRender.removeEventListener(that._roamingHandlerFn);
      that.roamingHandler = null;
    } else {
      throw new Error('还为创建巡航对象或者未在巡航状态！'); //注意Error要大写
    }
  }

  /**动态修改视角方向 */
  _roamingHandlerFn(scene, time) {
    let currentPosition = entityRoaming.position.getValue(time); // 获取当前模型位置
    if (currentPosition) {
      let nextPosition = property.getValue(
        Cesium.JulianDate.addSeconds(time, 0.1, new Cesium.JulianDate())
      ); // 获取下一个位置
      let heading = 0;
      if (nextPosition && currentPosition) {
        // 计算航向角（heading）
        heading = this.BaseFnUtils.getCartesian3Heading(currentPosition, nextPosition);
      }
      const dynamicHeading = Cesium.Math.toRadians(heading);
      const pitch = Cesium.Math.toRadians(Roaming.roamingPitch);
      const range = Roaming.roamingRange;
      viewer.camera.lookAt(
        currentPosition,
        new Cesium.HeadingPitchRange(dynamicHeading, pitch, range)
      );
    }
  }
  /**跟踪巡航实体 */
  RoamingTrackedEntity() {
    let viewer = this.viewer;
    let that = this;
    if (entityRoaming) {
      // viewer.trackedEntity = entityRoaming;
      that.roamingHandler = viewer.scene.preRender.addEventListener(that._roamingHandlerFn);
    }
  }
  /**暂停巡航 */
  RoamingPause() {
    this.viewer.clock.shouldAnimate = false;
  }
  /**继续巡航 */
  RoamingContinue() {
    this.viewer.clock.shouldAnimate = true;
  }

  /**改变飞行的速度
   * @param {*} value
   */
  RoamingSpeed(value) {
    Roaming.roamingSpeed = value;
    this.viewer.clock.multiplier = value;
  }

  /**改变飞行倾斜角度
   * @param {*} value
   */
  RoamingPitch(value) {
    Roaming.roamingPitch = value;
  }

  /**改变飞行高度
   * @param {*} value
   */
  RoamingHeight(value) {
    Roaming.roamingHeight = value;

    propertyTimes.forEach(time => {
      let position = property.getValue(time);
      let wgs84 = this.PositionUtils.transformCartesianToWGS84(position);
      let cartesian = Cesium.Cartesian3.fromDegrees(wgs84.lng, wgs84.lat, Roaming.roamingHeight);
      // 更新样本，注意需要删除旧样本
      property.removeSample(time);
      property.addSample(time, cartesian);
    });
  }

  /**距中心的距离
   * @param {*} value
   */
  RoamingRange(value) {
    Roaming.roamingRange = value;
  }
}

export default Roaming;
