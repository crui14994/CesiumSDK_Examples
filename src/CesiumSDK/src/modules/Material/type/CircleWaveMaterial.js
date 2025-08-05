/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2024-12-24 09:56:18
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2024-12-26 17:45:50
 * @FilePath: \cesium-plugins-fn\src\CesiumSDK\src\modules\Material\type\CircleWaveMaterial.js
 * @Description:
 *
 */
import MaterialProperty from '../MaterialProperty.js';

Cesium.Material.CircleWaveType = 'CircleWave';
Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveType, {
  fabric: {
    type: Cesium.Material.CircleWaveType,
    uniforms: {
      color: new Cesium.Color(1.0, 0.0, 0.0, 0.7),
      speed: 3.0,
      count: 1,
      gradient: 0.1,
    },
    source: `
        uniform vec4 color;
        uniform float speed;
        uniform float count;
        uniform float gradient;

        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
        czm_material material = czm_getDefaultMaterial(materialInput);
        material.diffuse = 1.5 * color.rgb;
        vec2 st = materialInput.st;
        float dis = distance(st, vec2(0.5, 0.5));
        float per = fract(czm_frameNumber * speed / 1000.0);
        if(count == 1.0){
            if(dis > per * 0.5){
            discard;
            }else {
            material.alpha = color.a  * dis / per / 2.0;
            }
        } else {
            vec3 str = materialInput.str;
            if(abs(str.z)  > 0.001){
            discard;
            }
            if(dis > 0.5){
            discard;
            } else {
            float perDis = 0.5 / count;
            float disNum;
            float bl = 0.0;
            for(int i = 0; i <= 999; i++){
                if(float(i) <= count){
                disNum = perDis * float(i) - dis + per / count;
                if(disNum > 0.0){
                    if(disNum < perDis){
                    bl = 1.0 - disNum / perDis;
                    }
                    else if(disNum - perDis < perDis){
                    bl = 1.0 - abs(1.0 - disNum / perDis);
                    }
                    material.alpha = pow(bl,(1.0 + 10.0 * (1.0 - gradient)));
                }
                }
            }
            }
        }
        return material;
        }


        `,
  },
  translucent: function (material) {
    return true;
  },
});

class CircleWaveMaterialProperty extends MaterialProperty {
  constructor(options = {}) {
    super(options);
    this.count = Math.max(options.count || 3, 1);
    this.gradient = Cesium.Math.clamp(options.gradient || 0.1, 0, 1);
  }

  get isConstant() {
    return false;
  }

  get definitionChanged() {
    return this._definitionChanged;
  }

  getType(time) {
    return Cesium.Material.CircleWaveType;
  }

  getValue(time, result) {
    if (!result) {
      result = {};
    }
    result.color = Cesium.Property.getValueOrUndefined(this._color, time);
    result.speed = this._speed;
    result.count = this.count;
    result.gradient = this.gradient;
    return result;
  }

  equals(other) {
    return (
      this === other ||
      (other instanceof CircleWaveMaterialProperty &&
        Cesium.Property.equals(this._color, other._color) &&
        Cesium.Property.equals(this._speed, other._speed))
    );
  }
}

Object.defineProperties(CircleWaveMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed'),
});

export default CircleWaveMaterialProperty;
