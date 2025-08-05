/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 16:07:32
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-27 13:40:27
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\WallLineTrailMaterial.js
 * @Description:
 *
 */
import MaterialProperty from '../MaterialProperty.js';
import IMG from '../../../image/space_line.png';

Cesium.Material.WallLineTrailType = 'WallLineTrail';
Cesium.Material._materialCache.addMaterial(Cesium.Material.WallLineTrailType, {
  fabric: {
    type: Cesium.Material.WallLineTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      image: Cesium.Material.DefaultImageId,
      repeat: new Cesium.Cartesian2(1, 1),
      speed: 3.0,
      direction: 1.0,
    },
    source: `
        uniform sampler2D image;
        uniform float speed;
        uniform vec4 color;
        uniform vec2 repeat;

        czm_material czm_getMaterial(czm_materialInput materialInput){
        czm_material material = czm_getDefaultMaterial(materialInput);
        float perDis = 1.0 / repeat.y / 3.0  ;
        vec2 st;
        if(direction == -1.0){
            st =1.0 - materialInput.st * repeat;
        }else{
            st = materialInput.st * repeat;
        }
        float time = fract(czm_frameNumber * speed / 1000.0);
        vec4 colorImage = texture(image, vec2(st.s, fract(st.t - time)));
        material.alpha =  colorImage.a * smoothstep(.2 ,1. ,distance(st.t * perDis ,1. + perDis ));
        material.diffuse = max(color.rgb * material.alpha * 1.5, color.rgb);
        material.emission = max(color.rgb * material.alpha * 1.5, color.rgb);
        return material;
        }
    `,
  },
  translucent: function (material) {
    return true;
  },
});

class WallLineTrailMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._image = undefined;
    this._direction = undefined;
    this._imageSubscription = undefined;
    this._repeat = undefined;
    this._repeatSubscription = undefined;
    this.image = IMG;
    this.repeat = new Cesium.Cartesian2(options.repeat?.x || 1, options.repeat?.y || 1);
    this.direction = options.direction || 1.0;
  }

  getType(time) {
    return Cesium.Material.WallLineTrailType;
  }

  getValue(time, result) {
    if (!result) {
      result = {};
    }
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
      (other instanceof WallLineTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._repeat, other._repeat) &&
        Cesium.Property.equals(this._direction, other._direction))
    );
  }
}

Object.defineProperties(WallLineTrailMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  image: Cesium.createPropertyDescriptor('image'),
  repeat: Cesium.createPropertyDescriptor('repeat'),
  speed: Cesium.createPropertyDescriptor('speed'),
  direction: Cesium.createPropertyDescriptor('direction'),
});

export default WallLineTrailMaterialProperty;
