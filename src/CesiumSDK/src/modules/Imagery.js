/*
 * @Author:
 * @Date: 2022-02-10 16:49:56
 * @LastEditTime: 2025-08-05 10:01:17
 * @LastEditors: caorui 778943319@qq.com
 * @Description: 图层相关
 */
/*global Cesium viewer*/
import { getContext } from '../context';

class Imagery {
  constructor() {
    const { viewer, CesiumMap } = getContext();
    this.viewer = viewer;
    this.CesiumMap = CesiumMap;
  }

  /** 创建天地图图层  通过Viewer.addBaseLayer加载
   * @param style //style: vec、cva、img、cia、ter
   * @returns {layer}
   */
  createTdtImageryProvider(style) {
    let options = {
      style: style || 'vec', //style: vec、cva、img、cia、ter
      key: this.CesiumMap.TDT_KEY,
    };
    return new Cesium.TdtImageryProvider(options);
  }

  /** 百度地图
   * @param style // style: img、vec、normal、dark
   * @returns {layer}
   */
  createBaiduImageryProvider(style) {
    let options = {
      style: style || 'img',
      crs: 'WGS84', // 使用84坐标系，默认为：BD09
    };
    return new Cesium.BaiduImageryProvider(options);
  }

  /** 腾讯地图
   * @param style //style: img、1：经典
   * @returns {layer}
   */
  createTencentImageryProvider(style) {
    let options = {
      style: style || 1,
    };
    return new Cesium.TencentImageryProvider(options);
  }

  /** 高德地图
   * @param style // style: img、elec、cva
   * @returns {layer}
   */
  createAmapImageryProvider(style) {
    let options = {
      style: style || 'img',
      crs: 'WGS84', // 使用84坐标系，默认为：GCJ02
    };
    return new Cesium.AmapImageryProvider(options);
  }

  /** 谷歌地图
   * @param style  //style: img、elec、ter
   * @returns {layer}
   */
  createGoogleImageryProvider(style) {
    let options = {
      style: style || 'img',
      crs: 'WGS84', // 使用84坐标系
    };
    return new Cesium.GoogleImageryProvider(options);
  }

  /** 创建地图图层 通过Viewer.addBaseLayer加载
   * @param options new Cesium.UrlTemplateImageryProvider 的参数
   * @returns {layer}
   */
  createUrlImageryLayer(option) {
    return new Cesium.UrlTemplateImageryProvider(option);
  }

  /**添加地形数据 通过Viewer.addTerrain方法加载
   * @param options new Cesium.CesiumTerrainProvider 的参数
   * @returns {layer}
   */
  createUrlTerrain(options) {
    return new Cesium.CesiumTerrainProvider(options);
  }

  /**根据geojson创建一个地图区域，其它区域已指定颜色填充
   * @param geojson json数据
   * @param bgColor 填充颜色颜色
   */
  createGeojsonArea(geojson, bgColor = '#081122') {
    let arr = [];
    geojson.features[0].geometry.coordinates[0][0].forEach(item => {
      arr.push(item[0]);
      arr.push(item[1]);
    });
    var polygonWithHole = new Cesium.PolygonGeometry({
      polygonHierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray([73.0, 53.0, 73.0, 0.0, 135.0, 0.0, 135.0, 53.0]),
        [new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(arr))]
      ),
    });
    var geometry = Cesium.PolygonGeometry.createGeometry(polygonWithHole);
    let instances = [];
    instances.push(
      new Cesium.GeometryInstance({
        geometry: geometry,
        attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
            Cesium.Color.fromCssColorString(bgColor)
          ),
        },
      })
    );
    function addRect(instances, left, down, right, up) {
      instances.push(
        new Cesium.GeometryInstance({
          geometry: new Cesium.RectangleGeometry({
            rectangle: Cesium.Rectangle.fromDegrees(left, down, right, up),
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.fromCssColorString(bgColor)
            ),
          },
        })
      );
    }
    addRect(instances, -180.0, -90.0, 73.0, 90.0);
    addRect(instances, 135.0, -90.0, 180.0, 90.0);
    addRect(instances, 73.0, 53.0, 135.0, 90.0);
    addRect(instances, 73.0, -90.0, 135.0, 0.0);
    let primit = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        geometryInstances: instances,
        appearance: new Cesium.PerInstanceColorAppearance({
          flat: true,
          translucent: false,
        }),
      })
    );
    return primit;
  }

  /**
   * 根据geojson创建一个反选遮罩，其它区域已指定颜色填充
   * @param geojson json数据
   * @param rgbaColor 填充颜色颜色
   */
  createOverlayArea(geojson, rgbaColor = 'rgba(0, 0, 0, 0.85)') {
    let holes = [];

    geojson.features[0].geometry.coordinates.forEach(item => {
      holes.push({ positions: Cesium.Cartesian3.fromDegreesArray(item.flat(Infinity)) });
    });
    // 遮罩
    let polygonEntity = new Cesium.Entity({
      polygon: {
        hierarchy: {
          // 添加外部区域为1/4半圆，设置为180会报错
          positions: Cesium.Cartesian3.fromDegreesArray([0, 0, 0, 90, 179, 90, 179, 0]),
          // 中心挖空的“洞”
          holes: holes,
        },
        material: new Cesium.Color.fromCssColorString(rgbaColor),
      },
    });
    viewer.entities.add(polygonEntity);
    return polygonEntity;
  }
}
export default Imagery;
