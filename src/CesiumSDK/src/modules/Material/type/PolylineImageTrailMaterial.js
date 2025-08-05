/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 09:56:18
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-03-14 17:30:47
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\PolylineImageTrailMaterial.js
 * @Description:
 *
 */
import MaterialProperty from '../MaterialProperty.js';

Cesium.Material.PolylineImageTrailType = 'PolylineImageTrail';
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineImageTrailType, {
  fabric: {
    type: Cesium.Material.PolylineImageTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      image: Cesium.Material.DefaultImageId,
      speed: 1,
      repeat: new Cesium.Cartesian2(1, 1),
      direction: 1.0,
    },
    source: `
          uniform sampler2D image;
          uniform float speed;
          uniform vec4 color;
          uniform vec2 repeat;
          uniform float direction;
          czm_material czm_getMaterial(czm_materialInput materialInput){
            czm_material material = czm_getDefaultMaterial(materialInput);
            float time = fract(czm_frameNumber * speed / 1000.0);
            vec2 st;
            vec4 colorImage;
            if(direction == -1.0){
              //图片翻转
              st = 1.0 - repeat * materialInput.st;
              colorImage = texture(image, vec2(fract(st.s + (direction * time)), st.t));
            }else{
              st = repeat * materialInput.st;
              colorImage = texture(image, vec2(fract(st.s - (direction * time)), st.t));
            }
            if(color.a == 0.0){
                if(colorImage.rgb == vec3(1.0) || colorImage.rgb == vec3(0.0)){
                discard;
                }
                material.alpha = colorImage.a;
                material.diffuse = colorImage.rgb;
            }else{
                material.alpha = colorImage.a * color.a;
                material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);
            }
            return material;
          }`,
  },
  translucent: function (material) {
    return true;
  },
});

class PolylineImageTrailMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._image = undefined;
    this._repeat = undefined;
    this._direction = undefined;
    this.image = options.image;
    this.repeat = new Cesium.Cartesian2(options.repeat?.x || 1, options.repeat?.y || 1);
    this.direction = options.direction || 1.0;
  }

  getType(time) {
    return Cesium.Material.PolylineImageTrailType;
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

  // 当我们创建多个entity，使用同一个材质时，会调用该函数，判断两个材质当前属性值是否相同，
  // 如果相同就共用材质内存，节省空间。当不同时就会再创建一个该材质。
  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineImageTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._image, other._image) &&
        Cesium.Property.equals(this._repeat, other._repeat) &&
        Cesium.Property.equals(this._speed, other._speed) &&
        Cesium.Property.equals(this._direction, other._direction))
    );
  }
}

Object.defineProperties(PolylineImageTrailMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  image: Cesium.createPropertyDescriptor('image'),
  repeat: Cesium.createPropertyDescriptor('repeat'),
  direction: Cesium.createPropertyDescriptor('direction'),
});

export default PolylineImageTrailMaterialProperty;
