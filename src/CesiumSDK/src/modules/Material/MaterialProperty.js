/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 09:54:49
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-25 15:20:59
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\MaterialProperty.js
 * @Description:
 *
 */
class MaterialProperty {
  constructor(options = {}) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._speed = undefined;
    this.color = options.color || Cesium.Color.fromBytes(0, 255, 255, 255);
    this.speed = options.speed || 1;
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return null;
  }

  getValue(time, result) {
    result = Cesium.defaultValue(result, {});
    return result;
  }

  equals(other) {
    return this === other;
  }
}

export default MaterialProperty;
