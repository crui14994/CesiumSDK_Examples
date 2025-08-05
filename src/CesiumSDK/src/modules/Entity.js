/*
 * @Author:
 * @Date: 2022-02-17 11:18:12
 * @LastEditTime: 2024-07-16 14:50:03
 * @LastEditors: Please set LastEditors
 * @Description:
 */
import { getContext } from '../context';

import iconMarker from '../image/icon_marker.png';
import Position from './Position';
export default class Entity {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    //聚合图标数据
    this.clusterDataSource = new Cesium.CustomDataSource('cluster');
    this.viewer.dataSources.add(this.clusterDataSource);
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position();
  }

  /**获取实体集合 */
  get entities() {
    return this.viewer.entities;
  }

  /**根据id获取一个实体 */
  getEntityById(id) {
    return this.viewer.entities.getById(id);
  }

  /**根据id删除一个实体 */
  removeEntityById(id) {
    this.viewer.entities.removeById(id);
  }

  /**删除所有实体 */
  removeAllEntity() {
    this.viewer.entities.removeAll();
  }

  /**获取所有聚合图标自定义的DataSource对象 */
  getClusterDataSource() {
    return this.clusterDataSource;
  }

  /**注册Entity点击事件监听
   * @param {*} callback
   * @return {*} 返回entity实体对象组成的数组;
   */
  onClick(callback) {
    let scene = this.viewer.scene;
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    this.handler = handler;
    handler.setInputAction((event) => {
      // const clickPoint = scene.pick(event.position);	//设置拾取点，如果点击处有实体，返回拾取对象，否则返回undefined
      // if (clickPoint && this.entities.contains(clickPoint.id) && clickPoint.id instanceof Cesium.Entity) {		//判断实体是否存在
      //     callback && callback(clickPoint.id);
      // }

      //获取实体点击对象
      let drillPick = scene.drillPick(event.position).map((item) => item.id);
      if (drillPick.length > 0) {
        callback && callback(drillPick, event, 'Entity');
      } else {
        //如果点击没有实体，判断是否点击的是切片信息
        let pickRay = this.viewer.camera.getPickRay(event.position);
        //获取点击的矢量切片信息
        let featuresPromise = this.viewer.imageryLayers.pickImageryLayerFeatures(pickRay, this.viewer.scene);

        if (!Cesium.defined(featuresPromise)) {
          console.log('No features picked.');
        } else {
          featuresPromise.then((features) => {
            if (features.length > 0) {
              callback && callback(features, event, 'ImageryLayerFeatures');
            }
          });
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /** 注销点击事件*/
  removeClick() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**注册Entity点击事件监听
   * @param {*} callback
   * @return {*} 返回当前托动entity实体对象
   */
  /** 开启entity拖拽事件*/
  entityMove(callback) {
    var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler = handler;
    let pointDraged, leftDownFlag;
    handler.setInputAction((event) => {
      let entity = this.viewer.scene.pick(event.position); //选取当前的entity
      if (entity && entity.id && entity.id.myData.isMove) {
        pointDraged = entity;
        leftDownFlag = true;
        this.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    handler.setInputAction((event) => {
      if (leftDownFlag === true && pointDraged != null) {
        // console.log("鼠标移动");
        let ray = this.viewer.camera.getPickRay(event.endPosition);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        let wgs84 = this.PositionUtils.transformCartesianToWGS84(cartesian);
        let position = CM.Position.transformWGS84ToWindow(wgs84);
        //根据图标大小设置移动图标的偏移量
        position.y = position.y + pointDraged.id.billboard.height._value / 2;
        wgs84 = CM.Position.transformWindowToWGS84(position);

        pointDraged.id.position = this.PositionUtils.transformWGS84ToCartesian({
          lng: wgs84.lng,
          lat: wgs84.lat,
          height: 0,
        }); //此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction((event) => {
      leftDownFlag = false;
      this.viewer.scene.screenSpaceCameraController.enableRotate = true; //解锁相机
      callback && pointDraged && callback(pointDraged.id);
      pointDraged = null;
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  /** 注销entity拖拽事件*/
  removeEntityMove() {
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  /**加载聚合图标点
   * @param {*} position
   * @param {*} myData
   * @param {*} imgUrl
   * @param {*} imgSize
   * @return {*} 返回当前创建的聚合图标实体对象
   */
  loadClusterMarker(position, myData, imgUrl, imgSize = { w: 40, h: 40 }) {
    let clusterMarker = this.clusterDataSource.entities.add({
      myData: myData || {},
      position: Cesium.Cartesian3.fromDegrees(position.lng, position.lat, position.height || 1),
      billboard: {
        //图标
        image: imgUrl || iconMarker,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        scale: 1,
        width: imgSize.w,
        height: imgSize.h,
        eyeOffset: new Cesium.Cartesian3(0, -4, 0),
      },
    });
    return clusterMarker;
  }

  /**加载自定义的聚合图标点
   * @param {*} entityObj
   * @return {*} 返回当前创建的聚合图标实体对象
   */
  loadCustomClusterMarker(entityObj) {
    let maker = this.clusterDataSource.entities.add(entityObj);
    return maker;
  }

  /**将所有普通图标点转换为聚合图标点
   * @return {*} 返回当前聚合图标点DataSource对象
   */
  pointToClusterMarker() {
    this.entities._entities._array.forEach((item) => {
      this.loadCustomClusterMarker(item);
    });
    return this.clusterDataSource;
  }

  /**开启聚合图标显示
   * @param {*} callback
   * @return {*} 返回当前托动entity实体对象
   */
  openCluster(option, clusterIconConfig) {
    // 设置聚合参数
    option = {
      enabled: true,
      pixelRange: 80,
      minimumClusterSize: 2,
      ...option,
    };
    for (let key in option) {
      this.clusterDataSource.clustering[key] = option[key];
    }

    //聚合图标配置
    if (!clusterIconConfig) {
      clusterIconConfig = [
        {
          max: 20, //当聚合数量超过此值执行的配置;值为0时为默认配置
          color: '#0000ff', //聚合图标颜色
          // isImg: true, //是否使用自定义图片代替聚合图标
          // imgUrl: require('@/assets/logo.png'),
          width: 72, //图标宽度
          height: 72, //图标高度
          fontColor: '#fff', //聚合图标字体图标
        },
        {
          max: 12,
          color: '#F8C71F',
          // isImg: true,
          // imgUrl: require('@/assets/logo.png'),
          width: 56,
          height: 56,
          fontColor: '#fff',
        },
        {
          max: 0,
          color: '#FF1E1E',
          // isImg: true,
          // imgUrl: require('@/assets/logo.png'),
          width: 56,
          height: 56,
          fontColor: '#fff',
        },
      ];
    }

    // 添加监听函数
    this.clusterDataSource.clustering.clusterEvent.addEventListener(async (clusteredEntities, cluster) => {
      // 关闭自带的显示聚合数量的标签
      cluster.label.show = false;
      cluster.billboard.show = true;
      cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

      // 根据聚合数量的多少设置不同层级的图片以及大小
      let index = clusterIconConfig.findIndex((item) => clusteredEntities.length >= item.max);
      let itemConfig = clusterIconConfig[index];

      if (itemConfig.isImg) {
        cluster.billboard.image = await createClusterIMage(
          itemConfig.imgUrl,
          itemConfig.fontColor,
          clusteredEntities.length,
          itemConfig.width,
          itemConfig.height
        );
      } else {
        cluster.billboard.image = createClusterIcon(
          itemConfig.color,
          itemConfig.fontColor,
          clusteredEntities.length,
          itemConfig.width,
          itemConfig.height
        );
      }
      cluster.billboard.width = itemConfig.width;
      cluster.billboard.height = itemConfig.height;

      /**
       * @description: 根据图片生成聚合图标
       * @param {*} url：文件地址
       * @param {*} label：文字
       * @param {*} width：画布宽
       * @param {*} height：画布高
       * @return {*} 返回canvas
       */
      function createClusterIMage(url, fontColor, label, width, height) {
        // 创建画布对象
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');

        return new Promise((resolve, reject) => {
          let image = document.createElement('img');
          image.src = url;
          image.onload = () => {
            ctx.drawImage(image, 0, 0, width, height);
            // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
            ctx.fillStyle = fontColor;
            ctx.font = '14px Microsoft YaHei';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label, width / 2, height / 2);
            resolve(canvas);
          };
        });
      }

      /**
       * @description: 生成聚合图标
       * @param {*} color：图标颜色
       * @param {*} label：文字
       * @param {*} width：画布宽
       * @param {*} height：画布高
       * @return {*} 返回canvas
       */
      function createClusterIcon(color, fontColor, label, width, height) {
        // 创建画布对象
        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');

        let startAngle = -Math.PI / 12;
        let angle = Math.PI / 2;
        let intervalAngle = Math.PI / 6;
        ctx.save();
        ctx.scale(width / 24, height / 24); //Added to auto-generated code to scale up to desired size.
        ctx.beginPath();
        ctx.arc(12, 12, 6, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.arc(12, 12, 8, startAngle, startAngle + angle, false);
          ctx.strokeStyle = new Cesium.Color.fromCssColorString(color).withAlpha(0.4).toCssColorString();
          ctx.stroke();
          ctx.arc(12, 12, 11, startAngle, startAngle + angle, false);
          ctx.strokeStyle = new Cesium.Color.fromCssColorString(color).withAlpha(0.2).toCssColorString();
          ctx.stroke();
          ctx.closePath();
          startAngle = startAngle + angle + intervalAngle;
        }
        ctx.restore();
        // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
        ctx.fillStyle = fontColor;
        ctx.font = '14px Microsoft YaHei';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, width / 2 - 1, height / 2 + 1);
        return canvas;
      }
    });

    return this.clusterDataSource;
  }

  /**关闭聚合图标显示
   * @param {*} callback
   * @return {*} 返回当前托动entity实体对象
   */
  removeCluster() {
    this.clusterDataSource.clustering.enabled = false;
  }
}
