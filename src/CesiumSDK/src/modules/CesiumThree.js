/*
 * @Author:
 * @Date: 2022-02-16 16:04:03
 * @LastEditTime: 2025-08-05 09:59:28
 * @LastEditors: caorui 778943319@qq.com
 * @Description:
 */
/*global Cesium THREE*/
import { getContext } from '../context';
// three对象
function _3DObject() {
  //THREEJS 3DObject.mesh
  this.threeMesh = null;
  //location bounding box
  this.minWGS84 = null;
  this.maxWGS84 = null;
}

class CesiumThree {
  constructor() {
    const { viewer } = getContext();
    this.viewer = viewer;
    // three对象
    this.three = {
      renderer: null,
      camera: null,
      scene: null,
    };
    //Could be any Three.js object mesh
    this._3Dobjects = [];

    // 模型定位范围
    this.minWGS84 = [115.56936458615716, 39.284100766866445];
    this.maxWGS84 = [117.10745052365716, 41.107831235616445];
  }

  //渲染three对象
  _renderThreeObj() {
    let _this = this;
    // register Three.js scene with Cesium
    _this.three.camera.fov = Cesium.Math.toDegrees(_this.viewer.camera.frustum.fovy); // ThreeJS FOV is vertical
    //three.camera.updateProjectionMatrix();
    let cartToVec = function(cart) {
      return new THREE.Vector3(cart.x, cart.y, cart.z);
    };

    // Configure Three.js meshes to stand against globe center position up direction
    for (let id in _this._3Dobjects) {
      _this.minWGS84 = _this._3Dobjects[id].minWGS84;
      _this.maxWGS84 = _this._3Dobjects[id].maxWGS84;
      // convert lat/long center position to Cartesian3
      let center = Cesium.Cartesian3.fromDegrees(
        (_this.minWGS84[0] + _this.maxWGS84[0]) / 2,
        (_this.minWGS84[1] + _this.maxWGS84[1]) / 2
      );
      // get forward direction for orienting model
      let centerHigh = Cesium.Cartesian3.fromDegrees(
        (_this.minWGS84[0] + _this.maxWGS84[0]) / 2,
        (_this.minWGS84[1] + _this.maxWGS84[1]) / 2,
        1
      );
      // use direction from bottom left to top left as up-vector
      let bottomLeft = cartToVec(
        Cesium.Cartesian3.fromDegrees(_this.minWGS84[0], _this.minWGS84[1])
      );
      let topLeft = cartToVec(Cesium.Cartesian3.fromDegrees(_this.minWGS84[0], _this.maxWGS84[1]));
      let latDir = new THREE.Vector3().subVectors(bottomLeft, topLeft).normalize();
      // configure entity position and orientation
      _this._3Dobjects[id].threeMesh.position.copy(center);
      _this._3Dobjects[id].threeMesh.lookAt(centerHigh.x, centerHigh.y, centerHigh.z);
      _this._3Dobjects[id].threeMesh.up.copy(latDir);
    }
    // Clone Cesium Camera projection position so the
    // Three.js Object will appear to be at the same place as above the Cesium Globe
    _this.three.camera.matrixAutoUpdate = false;
    let cvm = _this.viewer.camera.viewMatrix;
    let civm = _this.viewer.camera.inverseViewMatrix;

    // 注意这里，经大神博客得知，three高版本这行代码需要放在 three.camera.matrixWorld 之前
    _this.three.camera.lookAt(0, 0, 0);

    _this.three.camera.matrixWorld.set(
      civm[0],
      civm[4],
      civm[8],
      civm[12],
      civm[1],
      civm[5],
      civm[9],
      civm[13],
      civm[2],
      civm[6],
      civm[10],
      civm[14],
      civm[3],
      civm[7],
      civm[11],
      civm[15]
    );

    _this.three.camera.matrixWorldInverse.set(
      cvm[0],
      cvm[4],
      cvm[8],
      cvm[12],
      cvm[1],
      cvm[5],
      cvm[9],
      cvm[13],
      cvm[2],
      cvm[6],
      cvm[10],
      cvm[14],
      cvm[3],
      cvm[7],
      cvm[11],
      cvm[15]
    );

    // 设置three宽高
    let width = document.getElementById('cesiumContainer').clientWidth;
    let height = document.getElementById('cesiumContainer').clientHeight;

    let aspect = width / height;
    _this.three.camera.aspect = aspect;
    _this.three.camera.updateProjectionMatrix();
    _this.three.renderer.setSize(width, height);
    _this.three.renderer.clear();
    _this.three.renderer.render(_this.three.scene, _this.three.camera);
  }

  //初始化three
  initThree(id) {
    let _this = this;
    let fov = 45;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let aspect = width / height;
    let near = 1;
    let far = 10 * 1000 * 1000;
    _this.three.scene = new THREE.Scene();
    _this.three.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    _this.three.renderer = new THREE.WebGLRenderer({ alpha: true });
    let Amlight = new THREE.AmbientLight(0xffffff, 2);
    _this.three.scene.add(Amlight);
    // 注意这里，直接把three容器（canvas 添加到 cesium中，在cesium的canvas之下），
    // 这样的话，两个canvas才会重叠起来。
    let ThreeContainer = document.getElementById(id);
    ThreeContainer.appendChild(_this.three.renderer.domElement);

    return _this.three;
  }

  //添加Three.js object
  add3Dobjects(objData) {
    let _3DOB = new _3DObject();
    _3DOB.threeMesh = objData;
    _3DOB.minWGS84 = this.minWGS84;
    _3DOB.maxWGS84 = this.maxWGS84;
    this._3Dobjects.push(_3DOB);
  }
  // 同步
  loop() {
    let fn = () => {
      requestAnimationFrame(fn);
      this.viewer.render();
      this._renderThreeObj();
    };
    fn();
  }
}
export default CesiumThree;
