/*
 * @Author:
 * @Date: 2022-02-28 09:45:49
 * @LastEditTime: 2025-08-05 10:00:03
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
import { getContext } from '../context';

import iconMarker from '../image/icon_marker.png';
// import redCircle2 from '../image/redCircle2.png';

import Position from './Position';
import BaseFn from './BaseFn';
import { parseDom } from '../utils';
export default class Draw {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;

    this.handler = null;
    this.cesiumContainer = document.getElementById('cesiumContainer');
    this.toolTipDom = null; //toolTip dom对象

    this._positions = []; //活动点

    this._entities = []; //脏数据，用于绘制完成后清除
    this._drawData = null; //脏数据，绘制的实体
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position();
  }

  /**获取Position对象 */
  get BaseFnUtils() {
    return new BaseFn();
  }

  /**绘制完成后清除脏数据*/
  _clean() {
    /*销毁鼠标事件*/
    if (this.handler) {
      this.handler.destroy();
      this._destroyToolTip();
      this.handler = null;
    }

    this._entities.forEach((item) => {
      this.viewer.entities.remove(item);
    });
    this._drawData = null;
    this._positions = [];
    this._entities = [];
  }

  /** 创建ToolTip元素
   * @param {*}
   * @param {*} position 屏幕坐标
   * @return {*}
   */
  _createdToolTip(text = '右击完成绘制') {
    let html = `
            <div style="font-size:12px;position: absolute;padding:5px 10px;color: #fff;
            background: rgba(0,0,0,.7);user-select: none;pointer-events：none;
            border-radius: 4px;" class='cesium-toolTip' id='cesiumToolTip'>${text}</div>
        `;
    this.toolTipDom = parseDom(html)[1];
    if (this.toolTipDom) {
      this.cesiumContainer.appendChild(this.toolTipDom);
      this.toolTipDom.style.display = 'none';
      this.cesiumContainer.addEventListener('mousemove', this._toolTipShow);
    }
  }
  /**更新Tooltip 内容
   * @param {*} content
   *  */
  _updateToopTipContent(content) {
    this.toolTipDom.innerHTML = content;
  }
  /**显示toolTip */
  _toolTipShow(e) {
    let toolTipDom = document.getElementById('cesiumToolTip');
    if (e && toolTipDom) {
      toolTipDom.style.top = e.offsetY - 15 + 'px';
      toolTipDom.style.left = e.offsetX + 20 + 'px';
      toolTipDom.style.display = 'block';
    }
  }

  /**销毁Tooltip*/
  _destroyToolTip() {
    if (this.toolTipDom) {
      this.cesiumContainer.removeEventListener('mousemove', this._toolTipShow);
      this.toolTipDom.parentNode.removeChild(this.toolTipDom);
      this.toolTipDom = null;
    }
  }

  /**加载图标点
   * @param {*} position
   * @param {*} myData
   * @param {*} imgUrl
   * @param {*} imgSize
   */
  loadMarker(position, myData, imgUrl, imgSize = { w: 40, h: 40 }) {
    let point = this.viewer.entities.add({
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
        disableDepthTestDistance: Number.POSITIVE_INFINITY, //解决被倾斜摄影或其他面数据遮挡的问题
      },
    });
    return point;
  }

  //创建点
  _createPoint(cartesian, labelText) {
    let options = {};
    if (labelText) {
      options.label = {
        text: labelText,
        font: '18px sans-serif',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
      };
    }
    var point = this.viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 9,
        color: Cesium.Color.fromBytes(255, 255, 255, 255),
        outlineColor: Cesium.Color.fromBytes(35, 216, 184, 255),
        outlineWidth: 2,
      },
      ...options,
    });
    this._entities.push(point);

    return point;
  }

  /**加载线
   * @param {*} position
   * @param {*} data
   * @param {*} LineStyle
   * @return {*}
   */
  loadPolyline(position, data, LineStyle) {
    var polyline = this.viewer.entities.add({
      myData: data,
      polyline: {
        positions: position,
        show: true,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 1)'),
        width: 3,
        clampToGround: true,
        ...LineStyle,
      },
    });
    return polyline;
  }

  //创建线
  _createPolyline(LineStyle) {
    var polyline = this.viewer.entities.add({
      polyline: {
        //使用cesium的peoperty
        positions: new Cesium.CallbackProperty(() => {
          return this._positions;
        }, false),
        show: true,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 1)'),
        width: 3,
        clampToGround: true, //贴地
        ...LineStyle,
      },
    });
    this._entities.push(polyline);
    return polyline;
  }

  /**绘制线
   * @param {*} callback 返回线的entity实体对象
   * @return {*}
   */
  Polyline(callback, measure, LineStyle) {
    this._clean();
    this._createdToolTip('左击选择点位，右击结束！');
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction((evt) => {
      //开始绘制
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.push(cartesian.clone());

      //测量
      if (measure) {
        //计算俩点之间的距离
        let polylineData = this._positions.concat();
        polylineData.pop();
        let distance = this.BaseFnUtils.getSpaceDistance(polylineData.slice(polylineData.length - 2));
        this._createPoint(cartesian, distance + '米'); // 绘制点
      } else {
        this._createPoint(cartesian); // 绘制点
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((evt) => {
      //移动时绘制线
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.endPosition, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (!Cesium.defined(this._drawData)) {
        this._drawData = this._createPolyline(LineStyle);
      }
      if (this._drawData) {
        this._toolTipShow();
        this._positions.pop();
        this._positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((evt) => {
      //右击结束绘制
      if (!this._drawData) return;
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.pop();
      let polylineData = this._positions.concat();

      //如果是测量返回测量结果，标绘返回实体
      if (measure) {
        let distance = this.BaseFnUtils.getSpaceDistance(polylineData.slice(polylineData.length - 2));
        if (typeof callback == 'function') {
          callback(distance);
          /*销毁鼠标事件*/
          if (this.handler) {
            this.handler.destroy();
            this._destroyToolTip();
            this.handler = null;
          }
        }
      } else {
        let polyline = this.loadPolyline(polylineData, {}, LineStyle);
        if (typeof callback == 'function') {
          callback(polyline, polylineData);
        }
        this._clean();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**测量距离 */
  MeasureDistance(callback) {
    this.Polyline(callback, true);
  }

  /**加载带边框的面 */
  loadHollowPolygon(position, data, LineStyle, GonStyle, LabelStyle) {
    let hollowPolygon = this.viewer.entities.add({
      myData: data,
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(position),
        clampToGround: true,
        fill: true,
        material: new Cesium.Color.fromCssColorString('rgba(0,0,0,0)'),
        outline: false,
        ...GonStyle,
      },
      polyline: {
        positions: position.concat(position[0]),
        clampToGround: true,
        ...LineStyle,
      },
      ...LabelStyle,
    });
    return hollowPolygon;
  }

  /**加载面
   * @param {*}
   * @return {*}
   */
  loadPolygon(position, data, PolygonStyle) {
    let polygon = this.viewer.entities.add({
      myData: data,
      polygon: {
        hierarchy: new Cesium.PolygonHierarchy(position),
        clampToGround: true,
        fill: true,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
        outline: false,
        ...PolygonStyle,
      },
    });
    return polygon;
  }

  /**创建面*/
  _createPolygon(PolygonStyle) {
    var polygon = this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this._positions);
        }, false),
        clampToGround: true,
        show: true,
        fill: true,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        outline: false,
        ...PolygonStyle,
      },
      label: {
        text: 'labelText',
        font: '18px sans-serif',
        fillColor: Cesium.Color.GOLD,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        pixelOffset: new Cesium.Cartesian2(20, -20),
      },
    });
    this._entities.push(polygon);
    return polygon;
  }

  /**创建带边框的面*/
  _createHollowPolygon(LineStyle, GonStyle, LabelStyle) {
    var polygon = this.viewer.entities.add({
      polygon: {
        hierarchy: new Cesium.CallbackProperty(() => {
          return new Cesium.PolygonHierarchy(this._positions);
        }, false),
        clampToGround: true,
        show: true,
        fill: true,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
        outline: false,
        ...GonStyle,
      },
      polyline: {
        //使用cesium的peoperty
        positions: new Cesium.CallbackProperty(() => {
          return this._positions.concat(this._positions[0]);
        }, false),
        clampToGround: true,
        ...LineStyle,
      },
      ...LabelStyle,
    });
    this._entities.push(polygon);
    return polygon;
  }

  /**绘制面
   * @param {*} callback 返回面的entity实体对象
   * @return {*}
   */
  Polygon(callback, measure, PolygonStyle) {
    let Label;
    this._clean();
    this._createdToolTip('左击选择点位，右击结束！');
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction((evt) => {
      //开始绘制
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.push(cartesian.clone());
      this._createPoint(cartesian); // 绘制点
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((evt) => {
      //移动时绘制线
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.endPosition, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (this._positions.length == 3) {
        if (!Cesium.defined(this._drawData)) {
          this._drawData = this._createPolygon(PolygonStyle);
          if (measure) {
            Label = this.viewer.entities.add({
              position: new Cesium.CallbackProperty(() => {
                var polyPositions = this._drawData.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions;
                var polyCenter = Cesium.BoundingSphere.fromPoints(polyPositions).center;
                return polyCenter;
              }, false),
              label: {
                text: '0',
                font: '18px sans-serif',
                fillColor: Cesium.Color.GOLD,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(20, -20),
              },
            });
            this._entities.push(Label);
          }
        }
      }
      this._toolTipShow();
      this._positions.pop();
      this._positions.push(cartesian);

      Label && (Label._label._text._value = this.BaseFnUtils.getArea(this._positions) + '平方米');
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((evt) => {
      //右击结束绘制
      if (!this._drawData) return;
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.pop();
      let polygonData = this._positions.concat();

      //如果是测量返回测量结果，标绘返回实体
      if (measure) {
        let area = this.BaseFnUtils.getArea(polygonData);
        if (typeof callback == 'function') {
          callback(area);
          /*销毁鼠标事件*/
          if (this.handler) {
            this.handler.destroy();
            this._destroyToolTip();
            this.handler = null;
          }
        }
      } else {
        let polyline = this.loadPolygon(polygonData, {}, PolygonStyle);
        if (typeof callback == 'function') {
          callback(polyline, polygonData);
        }
        this._clean();
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**绘制带边框的面
   * @param {*} callback 返回面的entity实体对象
   * @return {*}
   */
  HollowPolygon(callback, LineStyle, GonStyle, LabelStyle) {
    GonStyle = {
      material: new Cesium.Color.fromCssColorString('rgba(0,0,0,0.3)'),
      ...GonStyle,
    };

    this._clean();
    this._createdToolTip('左击选择点位，右击结束！');
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    this.handler.setInputAction((evt) => {
      //开始绘制
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.push(cartesian.clone());
      this._createPoint(cartesian); // 绘制点
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((evt) => {
      //移动时绘制线
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.endPosition, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (this._positions.length == 3) {
        if (!Cesium.defined(this._drawData)) {
          this._drawData = this._createHollowPolygon(LineStyle, GonStyle, LabelStyle);
        }
      }
      this._toolTipShow();
      this._positions.pop();
      this._positions.push(cartesian);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((evt) => {
      //右击结束绘制
      if (!this._drawData) return;
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      this._positions.pop();
      let polygonData = this._positions.concat();

      let polyline = this.loadHollowPolygon(polygonData, {}, LineStyle, GonStyle, LabelStyle);
      if (typeof callback == 'function') {
        callback(polyline, polygonData);
      }
      this._clean();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**测量面积
   * @param {*} callback
   * @return {*}
   */
  MeasureArea(callback) {
    this.Polygon(callback, true);
  }

  /**加载圆
   * @param {*} ciclePosition
   * @return {*}
   */
  loadCicle(ciclePosition, myData) {
    var r = Math.sqrt(
      Math.pow(ciclePosition[0].x - ciclePosition[ciclePosition.length - 1].x, 2) +
        Math.pow(ciclePosition[0].y - ciclePosition[ciclePosition.length - 1].y, 2)
    );
    var Cicle = this.viewer.entities.add({
      myData: myData,
      position: ciclePosition[0],
      name: 'circle',
      type: 'circle',
      ellipse: {
        semiMinorAxis: r,
        semiMajorAxis: r,
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
        outline: true,
      },
    });
    return Cicle;
  }

  /**创建圆
   * @param {*}
   * @return {*}
   */
  _createCicle() {
    var Cicle = this.viewer.entities.add({
      position: this._positions[0],
      name: 'circle',
      type: 'circle',
      ellipse: {
        semiMinorAxis: new Cesium.CallbackProperty(() => {
          //半径 两点间距离
          var r = Math.sqrt(
            Math.pow(this._positions[0].x - this._positions[this._positions.length - 1].x, 2) +
              Math.pow(this._positions[0].y - this._positions[this._positions.length - 1].y, 2)
          );
          return r ? r : r + 1;
        }, false),
        semiMajorAxis: new Cesium.CallbackProperty(() => {
          var r = Math.sqrt(
            Math.pow(this._positions[0].x - this._positions[this._positions.length - 1].x, 2) +
              Math.pow(this._positions[0].y - this._positions[this._positions.length - 1].y, 2)
          );
          return r ? r : r + 1;
        }, false),
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
        outline: true,
      },
    });

    this._entities.push(Cicle);
    return Cicle;
  }

  /**绘制圆
   * @param {*} callback 返回圆的entity实体对象
   * @return {*}
   */
  Cicle(callback) {
    this._clean();
    this._createdToolTip('左键点击选择起点！');
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
    // this.viewer.scene.globe.depthTestAgainstTerrain = true;

    this.handler.setInputAction((evt) => {
      //开始绘制
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (this._positions.length == 0) {
        this._positions.push(cartesian.clone());
        this._createPoint(cartesian); // 绘制点
        this._updateToopTipContent('右击点击结束绘制！');
        this._positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((evt) => {
      //移动时绘制线
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.endPosition, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (!Cesium.defined(this._drawData) && this._positions.length == 2) {
        this._drawData = this._createCicle();
      }
      if (this._drawData) {
        this._toolTipShow();
        this._positions.pop();
        this._positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((evt) => {
      //右击结束绘制
      if (!this._drawData) return;
      let polyline = this.loadCicle(this._positions, {});
      if (typeof callback == 'function') {
        callback(polyline, this._positions);
      }
      this._clean();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**加载矩形
   * @param {*}
   * @return {*}
   */
  loadRectangle(rectanglePosition, myData) {
    var Rectangle = this.viewer.entities.add({
      name: 'rectangle',
      myData: myData,
      rectangle: {
        coordinates: Cesium.Rectangle.fromCartesianArray(rectanglePosition),
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
      },
    });
    return Rectangle;
  }

  /**创建矩形
   * @param {*}
   * @return {*}
   */
  _createRectangle() {
    var Rectangle = this.viewer.entities.add({
      name: 'rectangle',
      rectangle: {
        coordinates: new Cesium.CallbackProperty(() => {
          var obj = Cesium.Rectangle.fromCartesianArray(this._positions);
          return obj;
        }, false),
        material: new Cesium.Color.fromCssColorString('rgba(255, 134, 27, 0.5)'),
      },
    });
    this._entities.push(Rectangle);
    return Rectangle;
  }

  /**绘制矩形
   * @param {*}
   * @return {*}
   */
  Rectangle(callback) {
    this._clean();
    this._createdToolTip('左键点击选择起点！');
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    this.handler.setInputAction((evt) => {
      //开始绘制
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.position, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (this._positions.length == 0) {
        this._positions.push(cartesian.clone());
        this._createPoint(cartesian); // 绘制点
        this._updateToopTipContent('右击结束绘制！');
        this._positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    this.handler.setInputAction((evt) => {
      //移动时绘制线
      //屏幕坐标转地形上坐标
      let cartesian = this.PositionUtils.getClickPosition(evt.endPosition, 2);
      //鼠标不在地球上
      if (!Cesium.defined(cartesian)) {
        return false;
      }

      if (!Cesium.defined(this._drawData) && this._positions.length == 2) {
        this._drawData = this._createRectangle();
      }
      if (this._drawData) {
        this._toolTipShow();
        this._positions.pop();
        this._positions.push(cartesian);
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((evt) => {
      //右击结束绘制
      if (!this._drawData) return;
      let Rectangle = this.loadRectangle(this._positions, {});
      if (typeof callback == 'function') {
        callback(Rectangle, this._positions);
      }
      this._clean();
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  /**
   * 创建一个带材质的墙体
   * @param {wallPosition} 带高度的经纬度数组 如：[103.56,30.2,500,104.2,31.6,500,...]
   * @param { data } 自己组要传递的数据
   * @param { material } 材质；根据CM.Material.createCustomMaterial方法创建
   * @param {wallStyle} 其它一些关于wall的配置，参考cesium官方文档
   * @return {wallEntity } 返回一个wall实体对象
   *  */
  loadWall(wallPosition, data, material, wallStyle = {}) {
    let wallEntity = viewer.entities.add({
      myData: data,
      wall: {
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(wallPosition),
        material,
        outline: false, //一个布尔属性，用于指定是否勾勒出墙的轮廓。
        ...wallStyle,
      },
    });

    return wallEntity;
  }

  /**创建一个水波纹图标点
   * @param {*} position
   * @param {*} material 材质；根据CM.Material.createCircleWaveMaterial
   * @param {ellipseStyle} 其它一些关于ellipse的配置，参考cesium官方文档
   * @return {ellipseEntity } 返回一个ellipse实体对象
   */
  loadCircleWaveMarker(opt) {
    //如果没有坐标和材质的情况
    if (!opt.position || !opt.material) {
      throw new Error('坐标和材质为必传参数');
    }
    let options = {
      ellipseStyle: {
        semiMinorAxis: 2000,
        semiMajorAxis: 2000,
      },
      myData: {},
      imgUrl: iconMarker,
      imgSize: { w: 40, h: 40 },
      ...opt,
    };

    let circleWave = this.viewer.entities.add({
      myData: options.myData,
      position: Cesium.Cartesian3.fromDegrees(options.position.lng, options.position.lat, options.position.height || 1),
      billboard: {
        //图标
        image: options.imgUrl,
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        scale: 1,
        width: options.imgSize.w,
        height: options.imgSize.h,
        eyeOffset: new Cesium.Cartesian3(0, -4, 0),
      },
      ellipse: {
        material: options.material,
        ...options.ellipseStyle,
      },
    });
    return circleWave;
  }

  /**编辑entity （线、面）对象 */
  startEditEntity(entity, callback) {
    if (!entity) {
      return false;
    }
    this._drawData = entity;
    this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);

    let positions, entityObj, entityObj2;

    if (entity.polyline && entity.polygon) {
      entityObj = entity.polyline;
      entityObj2 = entity.polygon;

      positions = entityObj2.hierarchy._value.positions;
      positions.forEach((item, index) => {
        let point = this._createPoint(item); // 绘制点
        point.isEditPoint = true;
        point.pointIndex = index;
      });
      //CallbackProperty用于动态改变坐标
      entityObj2.hierarchy = new Cesium.CallbackProperty(() => {
        return new Cesium.PolygonHierarchy(positions);
      }, false);

      //CallbackProperty用于动态改变坐标
      entityObj.positions = new Cesium.CallbackProperty(() => {
        return positions.concat(positions[0]);
      }, false);
    } else if (entity.polyline) {
      entityObj = entity.polyline;
      positions = entityObj.positions._value;
      positions.forEach((item, index) => {
        let point = this._createPoint(item); // 绘制点
        point.isEditPoint = true;
        point.pointIndex = index;
      });
      //CallbackProperty用于动态改变坐标
      entityObj.positions = new Cesium.CallbackProperty(() => {
        return positions;
      }, false);
    } else if (entity.polygon) {
      entityObj = entity.polygon;
      positions = entityObj.hierarchy._value.positions;
      positions.forEach((item, index) => {
        let point = this._createPoint(item); // 绘制点
        point.isEditPoint = true;
        point.pointIndex = index;
      });
      //CallbackProperty用于动态改变坐标
      entityObj.hierarchy = new Cesium.CallbackProperty(() => {
        return new Cesium.PolygonHierarchy(positions);
      }, false);
    }

    let pointDraged, leftDownFlag, pointIndex;
    this.handler.setInputAction((event) => {
      let et = this.viewer.scene.pick(event.position); //选取当前的entity
      if (et && et.id.isEditPoint) {
        pointDraged = et;
        leftDownFlag = true;
        if (pointDraged) {
          this.viewer.scene.screenSpaceCameraController.enableRotate = false; //锁定相机
          pointIndex = pointDraged.id.pointIndex;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN);

    this.handler.setInputAction((event) => {
      if (leftDownFlag === true && pointDraged != null) {
        let ray = this.viewer.camera.getPickRay(event.endPosition);
        let cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);

        let wgs84 = this.PositionUtils.transformCartesianToWGS84(cartesian);
        pointDraged.id.position = this.PositionUtils.transformWGS84ToCartesian({
          lng: wgs84.lng,
          lat: wgs84.lat,
          height: 1,
        }); //此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;

        positions[pointIndex] = cartesian;
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this.handler.setInputAction((event) => {
      if (leftDownFlag && pointDraged != null) {
        leftDownFlag = false;
        this.viewer.scene.screenSpaceCameraController.enableRotate = true; //解锁相机
        pointDraged = null;
        callback && callback(positions);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_UP);
  }

  /**停止编辑entity对象 */
  stopEditEntity(callback) {
    if (this._drawData) {
      if (this._drawData.polyline && this._drawData.polygon) {
        let positions = this._drawData.polygon.hierarchy.getValue().positions;
        this._drawData.polygon.hierarchy = new Cesium.PolygonHierarchy(positions);
        this._drawData.polyline.positions = positions.concat(positions[0]);
      } else if (this._drawData.polyline) {
        this._drawData.polyline.positions = this._drawData.polyline.positions.getValue();
      } else if (this._drawData.polygon) {
        let positions = this._drawData.polygon.hierarchy.getValue().positions;
        this._drawData.polygon.hierarchy = new Cesium.PolygonHierarchy(positions);
      }
      callback && callback(this._drawData);
      this._clean();
    }
  }
}
