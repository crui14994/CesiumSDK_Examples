/*
 * @Author:
 * @Date: 2022-07-06 14:23:45
 * @LastEditTime: 2023-12-06 10:15:10
 * @LastEditors: Please set LastEditors
 * @Description:
 */
/*global Cesium */
import Position from './Position';

const DEF_OPTS = {
  animation: false, //动画
  shouldAnimate: true, // 必须为true开启动画 否则不会达到飞机模型飞行动画效果
  homeButton: false, //home键
  geocoder: false, //是否显示geocoder小器件，右上角查询按钮
  baseLayerPicker: false, //图层选择控件
  timeline: true, // 必须为true显示时间线组件（如不想显示可以使用样式层叠表修改display：none） 否则viewer.timeline.zoomTo会报undefined错误
  fullscreenButton: false, //全屏显示
  infoBox: false, //点击要素之后浮窗
  sceneModePicker: false, //二维三维投影方式显示
  // sceneMode: Cesium.SceneMode.SCENE2D, //2D、3D模式： SCENE2D | SCENE3D | MORPHING
  navigationInstructionsInitiallyVisible: false, //导航指令
  navigationHelpButton: false, //帮助信息
  selectionIndicator: false, // 选中元素显示,默认true
};
class Viewer {
  constructor(id, options = {}, CesiumMap = {}) {
    if (!id || (typeof id === 'string' && !document.getElementById(id))) {
      throw new Error('Viewer：the id is empty');
    }

    this.CesiumMap = CesiumMap;

    this._viewer = null; //保存cesium的viewer对象
    this._initViewer(id, options);
  }

  /**获取Position对象 */
  get PositionUtils() {
    return new Position(this._viewer);
  }

  get scene() {
    return this._viewer.scene;
  }

  get camera() {
    return this._viewer.camera;
  }

  get canvas() {
    return this._viewer.scene.canvas;
  }

  get dataSources() {
    return this._viewer.dataSources;
  }

  get imageryLayers() {
    return this._viewer.imageryLayers;
  }

  get terrainProvider() {
    return this._viewer.terrainProvider;
  }

  get entities() {
    return this._viewer.entities;
  }

  get postProcessStages() {
    return this._viewer.scene.postProcessStages;
  }

  get clock() {
    return this._viewer.clock;
  }

  get viewerEvent() {
    return this._viewerEvent;
  }

  _initViewer(id, options = {}) {
    if (!id || (typeof id === 'string' && !document.getElementById(id))) {
      throw new Error('Viewer：the id is empty');
    }

    //初始化viewer
    Cesium.Ion.defaultAccessToken = this.CesiumMap.CESIUM_KEY;
    this._viewer = new Cesium.Viewer(id, {
      ...DEF_OPTS,
      ...options,
    });

    // eslint-disable-next-line no-prototype-builtins
    if (options.hasOwnProperty('imageryProvider') && options.imageryProvider == null) {
      this.imageryLayers.removeAll();
    }

    // 设置缩放最大最小限制
    // this.scene.screenSpaceCameraController.minimumZoomDistance = 1200;
    // this.scene.screenSpaceCameraController.maximumZoomDistance = 25000;

    //取消双击事件
    this._viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );

    //去除版权信息
    this._viewer._cesiumWidget._creditContainer.style.display = 'none';
    //使用太阳作为光源，可以照亮地球。
    this.scene.globe.enableLighting = false;
    //关闭地面大气效果，（默认为开启状态）
    this.scene.globe.showGroundAtmosphere = false;
    //FPS 帧率显示
    this.scene.debugShowFramesPerSecond = false;
  }

  /**设置天空盒 */
  setSkyBox(sources) {
    var skyBox = new Cesium.SkyBox({
      sources: sources,
    });
    this.scene.skyBox = skyBox;
  }

  /**黑夜特效 */
  setDarkEffect() {
    var fs =
      'uniform sampler2D colorTexture;\n' +
      'varying vec2 v_textureCoordinates;\n' +
      'uniform float scale;\n' +
      'uniform vec3 offset;\n' +
      'void main() {\n' +
      ' // vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
      ' vec4 color = texture2D(colorTexture, v_textureCoordinates);\n' +
      ' // float gray = 0.2989*color.r+0.5870*color.g+0.1140*color.b;\n' +
      ' // gl_FragColor = vec4(gray,gray,2.0*(gray+1.0), 1.0);\n' +
      ' gl_FragColor = vec4(color.r*0.2,color.g * 0.4,color.b*0.6, 1.0);\n' +
      '}\n';
    let Effect = this.scene.postProcessStages.add(
      new Cesium.PostProcessStage({
        name: 'darkEffect',
        fragmentShader: fs,
        uniforms: {
          scale: 1.0,
          offset: function() {
            return new Cesium.Cartesian3(0.1, 0.2, 0.3);
          },
        },
      })
    );
    return Effect;
  }

  /** 雨天特效*/
  setRainEffect() {
    var fs =
      'uniform sampler2D colorTexture;\n\
                varying vec2 v_textureCoordinates;\n\
                \n\
                float hash(float x){\n\
                return fract(sin(x*23.3)*13.13);\n\
                }\n\
                \n\
                void main(){\n\
                    float time = czm_frameNumber / 60.0;\n\
                    vec2 resolution = czm_viewport.zw;\n\
                    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                    vec3 c=vec3(.6,.7,.8);\n\
                    float a=-.4;\n\
                    float si=sin(a),co=cos(a);\n\
                    uv*=mat2(co,-si,si,co);\n\
                    uv*=length(uv+vec2(0,4.9))*.3+1.;\n\
                    float v=1.-sin(hash(floor(uv.x*100.))*2.);\n\
                    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;\n\
                    c*=v*b;\n\
                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), 0.2);\n\
                }\n\
                ';

    let Effect = this.scene.postProcessStages.add(
      new Cesium.PostProcessStage({
        name: 'rainEffect',
        fragmentShader: fs,
      })
    );

    return Effect;
  }

  /**雪天特效 */
  setSnowEffect() {
    var fs =
      'uniform sampler2D colorTexture;\n\
                    varying vec2 v_textureCoordinates;\n\
                    \n\
                    float snow(vec2 uv,float scale){\n\
                        float time = czm_frameNumber / 60.0;\n\
                        float w=smoothstep(1.,0.,-uv.y*(scale/10.));\n\
                        if(w<.1)return 0.;\n\
                        uv+=time/scale;\n\
                        uv.y+=time*2./scale;\n\
                        uv.x+=sin(uv.y+time*.5)/scale;\n\
                        uv*=scale;\n\
                        vec2 s=floor(uv),f=fract(uv),p;\n\
                        float k=3.,d;\n\
                        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;\n\
                        d=length(p);\n\
                        k=min(d,k);\n\
                        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);\n\
                        return k*w;\n\
                    }\n\
                    \n\
                    void main(){\n\
                        vec2 resolution = czm_viewport.zw;\n\
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);\n\
                        vec3 finalColor=vec3(0);\n\
                        float c = 0.0;\n\
                        c+=snow(uv,30.)*.0;\n\
                        c+=snow(uv,20.)*.0;\n\
                        c+=snow(uv,15.)*.0;\n\
                        c+=snow(uv,10.);\n\
                        c+=snow(uv,8.);\n\
                        c+=snow(uv,6.);\n\
                        c+=snow(uv,5.);\n\
                        finalColor=(vec3(c));\n\
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);\n\
                        \n\
                    }\n\
                    ';

    let Effect = this.scene.postProcessStages.add(
      new Cesium.PostProcessStage({
        name: 'snowEffect',
        fragmentShader: fs,
      })
    );

    return Effect;
  }

  /**添加影像图层
   * @param baseLayers 通过new Cesium.UrlTemplateImageryProvider等方法获取到的图层数据
   * @param removeAllLayer 是否清除全部图层再加载,默认false
   * @returns {Viewer}
   */
  addBaseLayer(baseLayers, removeAllLayer = false) {
    if (!baseLayers && baseLayers.length > 0) {
      return [];
    }
    let layersArr = [];
    if (removeAllLayer) {
      this.imageryLayers.removeAll();
    }
    baseLayers.forEach(item => {
      let itemLayer = this.imageryLayers.addImageryProvider(item);
      layersArr.push(itemLayer);
    });
    return layersArr;
  }

  /**添加3DTiles图层
   * @param baseLayers 图层数组
   * @param removeAllLayer 是否清除全部图层再加载,默认false
   * @returns {layersArr}
   */
  add3DTilesLayer(baseLayers, removeAllLayer = false) {
    if (!baseLayers && baseLayers.length > 0) {
      return [];
    }
    let layersArr = [];
    if (removeAllLayer) {
      this.scene.primitives.removeAll();
    }
    baseLayers.forEach(item => {
      let itemLayer = this.scene.primitives.add(item);
      itemLayer.readyPromise.then(function(tileset) {
        console.log(tileset);

        let tans = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(tileset._position));
        console.log(tans);
        tileset.modelMatrix = tans;
      });
      layersArr.push(itemLayer);
    });
    return layersArr;
  }

  /**添加地形
   * @param terrain 通过new Cesium.CesiumTerrainProvider得到的地形数据
   * @returns {Viewer}
   */
  addTerrain(terrain) {
    if (!terrain) {
      return this;
    }
    this.terrainProvider = terrain;
  }

  /**加载kml
   * @param {kmlUrl}
   * @param {fly} 是否飞行到kml区域
   */
  loadKml(kmlUrl, fly = false, callback) {
    let options = {
      camera: this.scene.camera,
      canvas: this.scene.canvas,
      clampToGround: true, //开启贴地
    };
    let promise = this.dataSources.add(Cesium.KmlDataSource.load(kmlUrl, options));
    promise.then(dataSource => {
      fly && this._viewer.flyTo(promise);
      let entities = dataSource.entities.values;
      callback && callback(entities);
    });
  }

  /**加载geoJson
   * @param {jsonUrl}
   * @return {*}
   */
  loadGeoJson(geoJson, myData, callback, style) {
    if (!style) {
      style = {
        fill: new Cesium.Color.fromCssColorString('rgba(255,255,0,.9)'),
        stroke: new Cesium.Color.fromCssColorString('rgba(255,255,0,1)'), //折线和多边形轮廓的默认颜色
      };
    }
    let promise = this.dataSources.add(Cesium.GeoJsonDataSource.load(geoJson, style));
    promise.then(dataSource => {
      let entities = dataSource.entities.values;
      entities.forEach(item => {
        delete myData.GEOJSON;
        item.myData = myData;
      });
      callback && callback(entities, dataSource);
    });
  }

  /**清除所有DataSources
   */
  removeAllDataSources() {
    this.dataSources.removeAll();
  }
}

export default Viewer;
