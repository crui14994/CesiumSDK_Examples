/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 09:56:18
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-27 15:58:22
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\PolylineLightingTrailMaterial.js
 * @Description:
 *
 */
/*global Cesium*/
import MaterialProperty from '../MaterialProperty.js';
import IMG from '../../../image/lighting.png';

Cesium.Material.PolylineLightingTrailType = 'PolylineLightingTrail';
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightingTrailType, {
  fabric: {
    type: Cesium.Material.PolylineLightingTrailType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      image: Cesium.Material.DefaultImageId,
      speed: 3.0,
    },
    source: `
        uniform sampler2D image;
        uniform vec4 color;
        uniform float speed;
        czm_material czm_getMaterial(czm_materialInput materialInput){
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        float time = fract(czm_frameNumber * speed / 1000.0);
        vec4 colorImage = texture(image,st);
        vec3 fragColor = color.rgb;
        if(st.t > 0.45 && st.t < 0.55 ) {
            fragColor = vec3(1.0);
        }
        if(color.a == 0.0){
            material.alpha = colorImage.a * 1.5 * fract(st.s - time);
            material.diffuse = colorImage.rgb;
        }else{
            material.alpha = colorImage.a * color.a * 1.5 * smoothstep(.0,1., fract(st.s - time));
            material.diffuse = max(fragColor.rgb * material.alpha , fragColor.rgb);
        }
        return material;
        }
        `,
  },
  translucent: function(material) {
    return true;
  },
});

class PolylineLightingTrailMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this._image = undefined;
    this._imageSubscription = undefined;
    this.image = IMG;
  }

  getType(time) {
    return Cesium.Material.PolylineLightingTrailType;
  }

  getValue(time, result) {
    if (!result) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrUndefined(this._color, time);
    result.image = Cesium.Property.getValueOrUndefined(this._image, time);
    result.speed = this._speed;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof PolylineLightingTrailMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    );
  }
}

Object.defineProperties(PolylineLightingTrailMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
  image: Cesium.createPropertyDescriptor('image'),
});

export default PolylineLightingTrailMaterialProperty;
