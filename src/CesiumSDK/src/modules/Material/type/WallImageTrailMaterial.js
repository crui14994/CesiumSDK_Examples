/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 16:07:32
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-26 16:27:17
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\WallImageTrailMaterial.js
 * @Description:
 *
 */
import MaterialProperty from '../MaterialProperty.js';

Cesium.Material.WallImageTrailType = 'WallImageTrail';
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallImageTrailType, {
  fabric: {
    type: Cesium.Material.WallImageTrailType,
    uniforms: {
      image: Cesium.Material.DefaultImageId,
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      repeat: new Cesium.Cartesian2(1, 1),
      direction: 1.0,
    },
    source: `
      uniform sampler2D image;
      uniform vec4 color;
      uniform float speed;
      uniform vec2 repeat;
      czm_material czm_getMaterial(czm_materialInput materialInput){
        czm_material material = czm_getDefaultMaterial(materialInput);
        float time = fract(czm_frameNumber * speed / 1000.0);
        vec2 st;
        if(direction == -1.0){
          //图片翻转
          st =1.0 - materialInput.st * repeat;
        }else{
          st =materialInput.st * repeat;
        }
        vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));
        material.alpha =  colorImage.a * color.a ;
        material.diffuse = colorImage.rgb * color.rgb * 3.0 ;
        return material;
      }
    `,
  },
  translucent: function (material) {
    return true;
  },
});

class WallImageTrailMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._image = undefined;
    this._imageSubscription = undefined;
    this._repeat = undefined;
    this._direction = undefined;
    this._repeatSubscription = undefined;
    this.image = options.image;
    this.repeat = new Cesium.Cartesian2(options.repeat?.x || 1, options.repeat?.y || 1);
    this.direction = options.direction || 1.0;
  }

  getType(time) {
    return Cesium.Material.WallImageTrailType;
  }

  getValue(time, result) {
    result = Cesium.defaultValue(result, {});
    result.color = Cesium.Property.getValueOrUndefined(this._color, time);
    result.image = Cesium.Property.getValueOrUndefined(this._image, time);
    result.repeat = Cesium.Property.getValueOrUndefined(this._repeat, time);
    result.speed = this._speed;
    result.direction = this._direction;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof WallImageTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._image, other._image) &&
        Cesium.Property.equals(this._repeat, other._repeat) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._direction, other._direction))
    );
  }
}

Object.defineProperties(WallImageTrailMaterialProperty.prototype, {
  image: Cesium.createPropertyDescriptor('image'),
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  repeat: Cesium.createPropertyDescriptor('repeat'),
  direction: Cesium.createPropertyDescriptor('direction'),
});
export default WallImageTrailMaterialProperty;
