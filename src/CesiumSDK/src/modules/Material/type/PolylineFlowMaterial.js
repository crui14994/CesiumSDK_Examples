/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 09:56:18
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-26 14:55:18
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\PolylineFlowMaterial.js
 * @Description:
 *
 */
import MaterialProperty from '../MaterialProperty.js';

Cesium.Material.PolylineFlowType = 'PolylineFlow';
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineFlowType, {
  fabric: {
    type: Cesium.Material.PolylineFlowType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 1,
      percent: 0.03,
      gradient: 0.1,
    },
    source: `
          uniform vec4 color;
          uniform float speed;
          uniform float percent;
          uniform float gradient;
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            vec2 st = materialInput.st;
            float t =fract(czm_frameNumber * speed / 1000.0);
            t *= (1.0 + percent);
            float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);
            alpha += gradient;
            material.diffuse = color.rgb;
            material.alpha = alpha;
            return material;
          }`,
  },
  translucent: function (material) {
    return true;
  },
});

class PolylineFlowMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._percent = undefined;
    this._gradient = undefined;
    this.percent = options.percent || 0.03;
    this.gradient = options.gradient || 0.1;
  }

  getType(time) {
    return Cesium.Material.PolylineFlowType;
  }

  getValue(time, result) {
    if (!result) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrUndefined(this._color, time);
    result.speed = this._speed;
    result.percent = this._percent;
    result.gradient = this._gradient;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineFlowMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._percent, other._percent) &&
        Cesium.Property.equals(this._gradient, other._gradient))
    );
  }
}

Object.defineProperties(PolylineFlowMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  percent: Cesium.createPropertyDescriptor('percent'),
  gradient: Cesium.createPropertyDescriptor('gradient'),
});

export default PolylineFlowMaterialProperty;
