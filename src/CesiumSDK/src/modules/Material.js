/*
 * @Author:
 * @Date: 2022-02-16 16:04:03
 * @LastEditTime: 2024-12-27 13:38:48
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
/*global Cesium*/

import PolylineImageTrailMaterialProperty from './Material/type/PolylineImageTrailMaterial';
import PolylineFlowMaterialProperty from './Material/type/PolylineFlowMaterial';
import PolylineLightingTrailMaterialProperty from './Material/type/PolylineLightingTrailMaterial';
import WallImageTrailMaterialProperty from './Material/type/WallImageTrailMaterial';
import WallTrailMaterialProperty from './Material/type/WallTrailMaterial';
import WallLineTrailMaterialProperty from './Material/type/WallLineTrailMaterial';
import CircleWaveMaterialProperty from './Material/type/CircleWaveMaterial';

class Material {
  constructor() {}
  /**图片轨迹线材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  image 图片地址
   * @params  repeat 重复规则
   * @params  direction 动画方向
   */
  PolylineImageTrailMaterial = options => new PolylineImageTrailMaterialProperty(options);

  /**颜色流动线材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  percent 比例
   * @params  gradient 透明程度
   */
  PolylineFlowMaterial = options => new PolylineFlowMaterialProperty(options);

  /**发光流动线材质
   * @params  color 颜色
   * @params  speed 速度
   */
  PolylineLightingTrailMaterial = options => new PolylineLightingTrailMaterialProperty(options);

  /**图片轨迹墙体材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  image 图片地址
   * @params  repeat 重复规则
   * @params  direction 动画方向
   */
  WallImageTrailMaterial = options => new WallImageTrailMaterialProperty(options);

  /**轨迹墙体材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  direction 动画方向
   */
  WallTrailMaterial = options => new WallTrailMaterialProperty(options);

  /**线条轨迹墙体材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  repeat 重复规则
   * @params  direction 动画方向
   */
  WallLineTrailMaterial = options => new WallLineTrailMaterialProperty(options);

  /**波纹圆材质
   * @params  color 颜色
   * @params  speed 速度
   * @params  count 波浪数量
   * @params  gradient 渐变曲率
   */
  CircleWaveMaterial = options => new CircleWaveMaterialProperty(options);
}

export default Material;
