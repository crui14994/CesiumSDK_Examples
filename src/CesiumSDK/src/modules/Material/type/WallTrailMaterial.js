/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 16:07:32
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-27 15:59:27
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\WallTrailMaterial.js
 * @Description:
 *
 */
/*global Cesium*/
import MaterialProperty from '../MaterialProperty.js';
import IMG from '../../../image/fence.png';

Cesium.Material.WallTrailType = 'WallTrail';
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallTrailType, {
  fabric: {
    type: Cesium.Material.WallTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      image: Cesium.Material.DefaultImageId,
      speed: 1,
      direction: 1.0,
    },
    source: `
        uniform sampler2D image;
        uniform float speed;
        uniform vec4 color;
        uniform float direction;
        czm_material czm_getMaterial(czm_materialInput materialInput){
          czm_material material = czm_getDefaultMaterial(materialInput);
          vec2 st;
          if(direction == -1.0){
            st =1.0 - materialInput.st;
          }else{
            st = materialInput.st;
          }
          float time = fract(czm_frameNumber * speed / 1000.0);
          vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));
          if(color.a == 0.0){
            material.alpha = colorImage.a;
            material.diffuse = colorImage.rgb;
          }else{
            material.alpha = colorImage.a * color.a;
            material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);
          }
          return material;
        }
    `,
  },
  translucent: function(material) {
    return true;
  },
});

class WallTrailMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._image = undefined;
    this._direction = undefined;
    this._imageSubscription = undefined;
    this.image = IMG;
    this.direction = options.direction || 1.0;
  }

  getType(time) {
    return Cesium.Material.WallTrailType;
  }

  getValue(time, result) {
    if (!result) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrUndefined(this._color, time);
    result.image = Cesium.Property.getValueOrUndefined(this._image, time);
    result.speed = this._speed;
    result.direction = this._direction;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof WallTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._direction, other._direction))
    );
  }
}

Object.defineProperties(WallTrailMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  image: Cesium.createPropertyDescriptor('image'),
  direction: Cesium.createPropertyDescriptor('direction'),
});

export default WallTrailMaterialProperty;
