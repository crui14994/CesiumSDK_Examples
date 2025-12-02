var si=Object.defineProperty;var li=(i,e,t)=>e in i?si(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var ze=(i,e,t)=>li(i,typeof e!="symbol"?e+"":e,t);let Pr=null,Dr=null;const ci=(i,e)=>{Pr=i,Dr=e},Ce=()=>({viewer:Pr,CesiumMap:Dr});class Fe{constructor(){const{viewer:e}=Ce();this.viewer=e}get camera(){return this.viewer.camera}getCameraAttitude(){return{lng:Cesium.Math.toDegrees(this.camera.positionCartographic.longitude).toFixed(6),lat:Cesium.Math.toDegrees(this.camera.positionCartographic.latitude).toFixed(6),height:this.camera.positionCartographic.height.toFixed(0),heading:Cesium.Math.toDegrees(this.camera.heading).toFixed(0),pitch:Cesium.Math.toDegrees(this.camera.pitch).toFixed(0),roll:Cesium.Math.toDegrees(this.camera.roll).toFixed(0)}}getClickPosition(e,t=1){let r;if(t==1)r=this.viewer.scene.camera.pickEllipsoid(e,this.viewer.scene.globe.ellipsoid);else if(t==2){let n=this.viewer.camera.getPickRay(e);r=this.viewer.scene.globe.pick(n,this.viewer.scene)}else if(t==3){var a=this.viewer.scene.pick(e);this.viewer.scene.pickPositionSupported&&Cesium.defined(a)&&(this.viewer.scene.globe.depthTestAgainstTerrain=!0,r=this.viewer.scene.pickPosition(e))}return r}getHeigthByLonLat(e,t){var r=Cesium.Cartographic.fromDegrees(e,t);return new Promise((a,n)=>{Cesium.sampleTerrain(this.viewer.terrainProvider,13,[r]).then(o=>{a(o[0].height)})})}getHeigthByArr(e){return e=e.map(t=>Cesium.Cartographic.fromDegrees(t.lng,t.lat)),new Promise((t,r)=>{Cesium.sampleTerrain(this.viewer.terrainProvider,13,e).then(a=>{t(a)})})}transformCartesianToWGS84(e){if(e){var t=this.viewer.scene.globe.ellipsoid,r=t.cartesianToCartographic(e),a=Cesium.Math.toDegrees(r.latitude),n=Cesium.Math.toDegrees(r.longitude),o=r.height;return{lng:n,lat:a,height:o}}}transformWGS84ToCartesian(e){return e?Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height,Cesium.Ellipsoid.WGS84):Cesium.Cartesian3.ZERO}transformWGS84ToCartographic(e){return e?Cesium.Cartographic.fromDegrees(e.lng,e.lat,e.height):Cesium.Cartographic.ZERO}transformCartesianArrayToWGS84Array(e){return e?e.map(t=>this.transformCartesianToWGS84(t)):[]}transformWindowToWGS84(e){let t=this.viewer.scene,r;if(t.mode===Cesium.SceneMode.SCENE3D){let a=t.camera.getPickRay(e);r=t.globe.pick(a,t)}else r=t.camera.pickEllipsoid(e,Cesium.Ellipsoid.WGS84);return this.transformCartesianToWGS84(r)}transformWGS84ArrayToCartesianArray(e){return e?e.map(t=>Cesium.Cartesian3.fromDegrees(t.lng,t.lat,t.height||0,Cesium.Ellipsoid.WGS84)):[]}transformWGS84ToWindow(e){let t=this.viewer.scene;return Cesium.SceneTransforms.wgs84ToWindowCoordinates(t,this.transformWGS84ToCartesian(e))}}const ui=Cesium.defaultValue,di=Cesium.DrawCommand,Wt=Cesium.Matrix4,mi=Cesium.Matrix3,cr=Cesium.SceneMode,Ee=Cesium.defined,ur=Cesium.DeveloperError,Ci=Cesium.loadCubeMap,pi=Cesium.CubeMap,hi=Cesium.Transforms,dr=Cesium.BoxGeometry,fi=Cesium.GeometryPipeline,Ai=Cesium.RenderState,gi=Cesium.BlendingState,Ei=Cesium.ShaderSource,Bi=Cesium.ShaderProgram,_i=Cesium.BufferUsage,xi=Cesium.VertexArray,yi=Cesium.VertexFormat,Ti=Cesium.Cartesian3,vi=Cesium.destroyObject,Mi=`uniform samplerCube u_cubeMap;

in vec3 v_texCoord;

void main()
{
    vec4 color = czm_textureCube(u_cubeMap, normalize(v_texCoord));
    out_FragColor = vec4(czm_gammaCorrect(color).rgb, czm_morphTime);
}
`,Pi=`in vec3 position;
      out vec3 v_texCoord;
      uniform mat3 u_rotateMatrix;
      void main()
      {
         vec3 p = czm_viewRotation * u_rotateMatrix * (czm_temeToPseudoFixed * (czm_entireFrustum.y * position));
         gl_Position = czm_projection * vec4(p, 1.0);
         v_texCoord = position.xyz;
      }`;Cesium.defined(Cesium.Matrix4.getRotation)||(Cesium.Matrix4.getRotation=Cesium.Matrix4.getMatrix3);function at(i){this.sources=i.sources,this._sources=void 0,this.show=ui(i.show,!0),this._command=new di({modelMatrix:Wt.clone(Wt.IDENTITY),owner:this}),this._cubeMap=void 0,this._attributeLocations=void 0,this._useHdr=void 0}const Di=new mi;at.prototype.update=function(i,e){const t=this;if(!this.show||i.mode!==cr.SCENE3D&&i.mode!==cr.MORPHING||!i.passes.render)return;const r=i.context;if(this._sources!==this.sources){this._sources=this.sources;const n=this.sources;if(!Ee(n.positiveX)||!Ee(n.negativeX)||!Ee(n.positiveY)||!Ee(n.negativeY)||!Ee(n.positiveZ)||!Ee(n.negativeZ))throw new ur("this.sources must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.");if(typeof n.positiveX!=typeof n.negativeX||typeof n.positiveX!=typeof n.positiveY||typeof n.positiveX!=typeof n.negativeY||typeof n.positiveX!=typeof n.positiveZ||typeof n.positiveX!=typeof n.negativeZ)throw new ur("this.sources must have positiveX, negativeX, positiveY, negativeY, positiveZ, and negativeZ properties.");typeof n.positiveX=="string"?Ci(r,this._sources).then(function(o){t._cubeMap=t._cubeMap&&t._cubeMap.destroy(),t._cubeMap=o}):(this._cubeMap=this._cubeMap&&this._cubeMap.destroy(),this._cubeMap=new pi({context:r,source:n}))}const a=this._command;if(a.modelMatrix=hi.eastNorthUpToFixedFrame(i.camera._positionWC),!Ee(a.vertexArray)){a.uniformMap={u_cubeMap:function(){return t._cubeMap},u_rotateMatrix:function(){return Wt.getRotation(a.modelMatrix,Di)}};const n=dr.createGeometry(dr.fromDimensions({dimensions:new Ti(2,2,2),vertexFormat:yi.POSITION_ONLY})),o=this._attributeLocations=fi.createAttributeLocations(n);a.vertexArray=xi.fromGeometry({context:r,geometry:n,attributeLocations:o,bufferUsage:_i.STATIC_DRAW}),a.renderState=Ai.fromCache({blending:gi.ALPHA_BLEND})}if(!Ee(a.shaderProgram)||this._useHdr!==e){const n=new Ei({defines:[e?"HDR":""],sources:[Mi]});a.shaderProgram=Bi.fromCache({context:r,vertexShaderSource:Pi,fragmentShaderSource:n,attributeLocations:this._attributeLocations}),this._useHdr=e}if(Ee(this._cubeMap))return a};at.prototype.isDestroyed=function(){return!1};at.prototype.destroy=function(){const i=this._command;return i.vertexArray=i.vertexArray&&i.vertexArray.destroy(),i.shaderProgram=i.shaderProgram&&i.shaderProgram.destroy(),this._cubeMap=this._cubeMap&&this._cubeMap.destroy(),vi(this)};const Ii={animation:!1,shouldAnimate:!0,homeButton:!1,geocoder:!1,baseLayerPicker:!1,timeline:!0,fullscreenButton:!1,infoBox:!1,sceneModePicker:!1,navigationInstructionsInitiallyVisible:!1,navigationHelpButton:!1,selectionIndicator:!1};class Li{constructor(e,t={},r={}){if(!e||typeof e=="string"&&!document.getElementById(e))throw new Error("Viewer：the id is empty");this.CesiumMap=r,this._viewer=null,this._initViewer(e,t)}get PositionUtils(){return new Fe(this._viewer)}get scene(){return this._viewer.scene}get camera(){return this._viewer.camera}get canvas(){return this._viewer.scene.canvas}get dataSources(){return this._viewer.dataSources}get imageryLayers(){return this._viewer.imageryLayers}get terrainProvider(){return this._viewer.terrainProvider}get entities(){return this._viewer.entities}get postProcessStages(){return this._viewer.scene.postProcessStages}get clock(){return this._viewer.clock}get viewerEvent(){return this._viewerEvent}_initViewer(e,t={}){if(!e||typeof e=="string"&&!document.getElementById(e))throw new Error("Viewer：the id is empty");Cesium.Ion.defaultAccessToken=this.CesiumMap.CESIUM_KEY,this._viewer=new Cesium.Viewer(e,{...Ii,...t}),t.hasOwnProperty("imageryProvider")&&t.imageryProvider==null&&this.imageryLayers.removeAll(),this._viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK),this._viewer._cesiumWidget._creditContainer.style.display="none",this.scene.globe.enableLighting=!1,this.scene.globe.showGroundAtmosphere=!1,this.scene.debugShowFramesPerSecond=!1}setSkyBox(e){var t=new Cesium.SkyBox(e);return t}setNearGroundSkyBox(e){var t=new at(e);return t}setDarkEffect(){var e=`uniform sampler2D colorTexture;
varying vec2 v_textureCoordinates;
uniform float scale;
uniform vec3 offset;
void main() {
 // vec4 color = texture2D(colorTexture, v_textureCoordinates);
 vec4 color = texture2D(colorTexture, v_textureCoordinates);
 // float gray = 0.2989*color.r+0.5870*color.g+0.1140*color.b;
 // gl_FragColor = vec4(gray,gray,2.0*(gray+1.0), 1.0);
 gl_FragColor = vec4(color.r*0.2,color.g * 0.4,color.b*0.6, 1.0);
}
`;return this.scene.postProcessStages.add(new Cesium.PostProcessStage({name:"darkEffect",fragmentShader:e,uniforms:{scale:1,offset:function(){return new Cesium.Cartesian3(.1,.2,.3)}}}))}setRainEffect(){var e=`uniform sampler2D colorTexture;
                varying vec2 v_textureCoordinates;
                
                float hash(float x){
                return fract(sin(x*23.3)*13.13);
                }
                
                void main(){
                    float time = czm_frameNumber / 60.0;
                    vec2 resolution = czm_viewport.zw;
                    vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
                    vec3 c=vec3(.6,.7,.8);
                    float a=-.4;
                    float si=sin(a),co=cos(a);
                    uv*=mat2(co,-si,si,co);
                    uv*=length(uv+vec2(0,4.9))*.3+1.;
                    float v=1.-sin(hash(floor(uv.x*100.))*2.);
                    float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
                    c*=v*b;
                    gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c, 1), 0.2);
                }
                `;return this.scene.postProcessStages.add(new Cesium.PostProcessStage({name:"rainEffect",fragmentShader:e}))}setSnowEffect(){var e=`uniform sampler2D colorTexture;
                    varying vec2 v_textureCoordinates;
                    
                    float snow(vec2 uv,float scale){
                        float time = czm_frameNumber / 60.0;
                        float w=smoothstep(1.,0.,-uv.y*(scale/10.));
                        if(w<.1)return 0.;
                        uv+=time/scale;
                        uv.y+=time*2./scale;
                        uv.x+=sin(uv.y+time*.5)/scale;
                        uv*=scale;
                        vec2 s=floor(uv),f=fract(uv),p;
                        float k=3.,d;
                        p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;
                        d=length(p);
                        k=min(d,k);
                        k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
                        return k*w;
                    }
                    
                    void main(){
                        vec2 resolution = czm_viewport.zw;
                        vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
                        vec3 finalColor=vec3(0);
                        float c = 0.0;
                        c+=snow(uv,30.)*.0;
                        c+=snow(uv,20.)*.0;
                        c+=snow(uv,15.)*.0;
                        c+=snow(uv,10.);
                        c+=snow(uv,8.);
                        c+=snow(uv,6.);
                        c+=snow(uv,5.);
                        finalColor=(vec3(c));
                        gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.3);
                        
                    }
                    `;return this.scene.postProcessStages.add(new Cesium.PostProcessStage({name:"snowEffect",fragmentShader:e}))}addBaseLayer(e,t=!1){if(!e&&e.length>0)return[];let r=[];return t&&this.imageryLayers.removeAll(),e.forEach(a=>{let n=this.imageryLayers.addImageryProvider(a);r.push(n)}),r}add3DTilesLayer(e,t=!1){if(!e&&e.length>0)return[];let r=[];return t&&this.scene.primitives.removeAll(),e.forEach(a=>{let n=this.scene.primitives.add(a);n.readyPromise.then(function(o){console.log(o);let s=Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(o._position));console.log(s),o.modelMatrix=s}),r.push(n)}),r}loadKml(e,t=!1,r){let a={camera:this.scene.camera,canvas:this.scene.canvas,clampToGround:!0},n=this.dataSources.add(Cesium.KmlDataSource.load(e,a));n.then(o=>{t&&this._viewer.flyTo(n);let s=o.entities.values;r&&r(s)})}loadGeoJson(e,t,r,a){a||(a={fill:new Cesium.Color.fromCssColorString("rgba(255,255,0,.9)"),stroke:new Cesium.Color.fromCssColorString("rgba(255,255,0,1)")}),this.dataSources.add(Cesium.GeoJsonDataSource.load(e,a)).then(o=>{let s=o.entities.values;s.forEach(l=>{delete t.GEOJSON,l.myData=t}),r&&r(s,o)})}removeAllDataSources(){this.dataSources.removeAll()}}const Si=637099681e-2,mr=[1289059486e-2,836237787e-2,5591021,348198983e-2,167804312e-2,0],qe=[75,60,45,30,15,0],wi=[[1410526172116255e-23,898305509648872e-20,-1.9939833816331,200.9824383106796,-187.2403703815547,91.6087516669843,-23.38765649603339,2.57121317296198,-.03801003308653,173379812e-1],[-7435856389565537e-24,8983055097726239e-21,-.78625201886289,96.32687599759846,-1.85204757529826,-59.36935905485877,47.40033549296737,-16.50741931063887,2.28786674699375,1026014486e-2],[-3030883460898826e-23,898305509983578e-20,.30071316287616,59.74293618442277,7.357984074871,-25.38371002664745,13.45380521110908,-3.29883767235584,.32710905363475,685681737e-2],[-1981981304930552e-23,8983055099779535e-21,.03278182852591,40.31678527705744,.65659298677277,-4.44255534477492,.85341911805263,.12923347998204,-.04625736007561,448277706e-2],[309191371068437e-23,8983055096812155e-21,6995724062e-14,23.10934304144901,-.00023663490511,-.6321817810242,-.00663494467273,.03430082397953,-.00466043876332,25551644e-1],[2890871144776878e-24,8983055095805407e-21,-3068298e-14,7.47137025468032,-353937994e-14,-.02145144861037,-1234426596e-14,.00010322952773,-323890364e-14,826088.5]],Cr=[[-.0015702102444,111320.7020616939,0x60e374c3105a3,-0x24bb4115e2e164,0x5cc55543bb0ae8,-0x7ce070193f3784,0x5e7ca61ddf8150,-0x261a578d8b24d0,0x665d60f3742ca,82.5],[.0008277824516172526,111320.7020463578,6477955746671607e-7,-4082003173641316e-6,1077490566351142e-5,-1517187553151559e-5,1205306533862167e-5,-5124939663577472e-6,9133119359512032e-7,67.5],[.00337398766765,111320.7020202162,4481351045890365e-9,-2339375119931662e-8,7968221547186455e-8,-1159649932797253e-7,9723671115602145e-8,-4366194633752821e-8,8477230501135234e-9,52.5],[.00220636496208,111320.7020209128,51751.86112841131,3796837749470245e-9,992013.7397791013,-122195221711287e-8,1340652697009075e-9,-620943.6990984312,144416.9293806241,37.5],[-.0003441963504368392,111320.7020576856,278.2353980772752,2485758690035394e-9,6070.750963243378,54821.18345352118,9540.606633304236,-2710.55326746645,1405.483844121726,22.5],[-.0003218135878613132,111320.7020701615,.00369383431289,823725.6402795718,.46104986909093,2351.343141331292,1.58060784298199,8.77738589078284,.37238884252424,7.45]];class Fi{constructor(){this.isWgs84=!1}getDistanceByMC(e,t){if(!e||!t||(e=this.convertMC2LL(e),!e))return 0;let r=this.toRadians(e.lng),a=this.toRadians(e.lat);if(t=this.convertMC2LL(t),!t)return 0;let n=this.toRadians(t.lng),o=this.toRadians(t.lat);return this.getDistance(r,n,a,o)}getDistanceByLL(e,t){if(!e||!t)return 0;e.lng=this.getLoop(e.lng,-180,180),e.lat=this.getRange(e.lat,-74,74),t.lng=this.getLoop(t.lng,-180,180),t.lat=this.getRange(t.lat,-74,74);let r=this.toRadians(e.lng),a=this.toRadians(e.lat),n=this.toRadians(t.lng),o=this.toRadians(t.lat);return this.getDistance(r,n,a,o)}convertMC2LL(e){if(!e)return{lng:0,lat:0};let t={};if(this.isWgs84){t.lng=e.lng/2003750834e-2*180;let n=e.lat/2003750834e-2*180;return t.lat=180/Math.PI*(2*Math.atan(Math.exp(n*Math.PI/180))-Math.PI/2),{lng:t.lng.toFixed(6),lat:t.lat.toFixed(6)}}let r={lng:Math.abs(e.lng),lat:Math.abs(e.lat)},a;for(let n=0;n<mr.length;n++)if(r.lat>=mr[n]){a=wi[n];break}return t=this.convertor(e,a),{lng:t.lng.toFixed(6),lat:t.lat.toFixed(6)}}convertLL2MC(e){if(!e)return{lng:0,lat:0};if(e.lng>180||e.lng<-180||e.lat>90||e.lat<-90)return e;if(this.isWgs84){let n={},o=6378137;n.lng=e.lng*Math.PI/180*o;let s=e.lat*Math.PI/180;return n.lat=o/2*Math.log((1+Math.sin(s))/(1-Math.sin(s))),{lng:parseFloat(n.lng.toFixed(2)),lat:parseFloat(n.lat.toFixed(2))}}e.lng=this.getLoop(e.lng,-180,180),e.lat=this.getRange(e.lat,-74,74);let t={lng:e.lng,lat:e.lat},r;for(let n=0;n<qe.length;n++)if(t.lat>=qe[n]){r=Cr[n];break}if(!r){for(let n=0;n<qe.length;n++)if(t.lat<=-qe[n]){r=Cr[n];break}}let a=this.convertor(e,r);return{lng:parseFloat(a.lng.toFixed(2)),lat:parseFloat(a.lat.toFixed(2))}}convertor(e,t){if(!e||!t)return{lng:0,lat:0};let r=t[0]+t[1]*Math.abs(e.lng),a=Math.abs(e.lat)/t[9],n=t[2]+t[3]*a+t[4]*a*a+t[5]*a*a*a+t[6]*a*a*a*a+t[7]*a*a*a*a*a+t[8]*a*a*a*a*a*a;return r*=e.lng<0?-1:1,n*=e.lat<0?-1:1,{lng:r,lat:n}}getDistance(e,t,r,a){return Si*Math.acos(Math.sin(r)*Math.sin(a)+Math.cos(r)*Math.cos(a)*Math.cos(t-e))}toRadians(e){return Math.PI*e/180}toDegrees(e){return 180*e/Math.PI}getRange(e,t,r){return t!=null&&(e=Math.max(e,t)),r!=null&&(e=Math.min(e,r)),e}getLoop(e,t,r){for(;e>r;)e-=r-t;for(;e<t;)e+=r-t;return e}lngLatToMercator(e){return this.convertLL2MC(e)}lngLatToPoint(e){let t=this.convertLL2MC(e);return{x:t.lng,y:t.lat}}mercatorToLngLat(e){return this.convertMC2LL(e)}pointToLngLat(e){let t={lng:e.x,lat:e.y};return this.convertMC2LL(t)}pointToPixel(e,t,r,a){if(!e)return;e=this.lngLatToMercator(e);let n=this.getZoomUnits(t),o=Math.round((e.lng-r.lng)/n+a.width/2),s=Math.round((r.lat-e.lat)/n+a.height/2);return{x:o,y:s}}pixelToPoint(e,t,r,a){if(!e)return;let n=this.getZoomUnits(t),o=r.lng+n*(e.x-a.width/2),s=r.lat-n*(e.y-a.height/2),l={lng:o,lat:s};return this.mercatorToLngLat(l)}getZoomUnits(e){return Math.pow(2,18-e)}}const $e=3.141592653589793*3e3/180,ae=3.141592653589793,pr=6378245,hr=.006693421622965943;class Oe{static BD09ToGCJ02(e,t){let r=+e-.0065,a=+t-.006,n=Math.sqrt(r*r+a*a)-2e-5*Math.sin(a*$e),o=Math.atan2(a,r)-3e-6*Math.cos(r*$e),s=n*Math.cos(o),l=n*Math.sin(o);return[s,l]}static GCJ02ToBD09(e,t){t=+t,e=+e;let r=Math.sqrt(e*e+t*t)+2e-5*Math.sin(t*$e),a=Math.atan2(t,e)+3e-6*Math.cos(e*$e),n=r*Math.cos(a)+.0065,o=r*Math.sin(a)+.006;return[n,o]}static WGS84ToGCJ02(e,t){if(t=+t,e=+e,this.out_of_china(e,t))return[e,t];{let r=this.delta(e,t);return[e+r[0],t+r[1]]}}static GCJ02ToWGS84(e,t){if(t=+t,e=+e,this.out_of_china(e,t))return[e,t];{let r=this.delta(e,t),a=e+r[0],n=t+r[1];return[e*2-a,t*2-n]}}static delta(e,t){let r=this.transformLng(e-105,t-35),a=this.transformLat(e-105,t-35);const n=t/180*ae;let o=Math.sin(n);o=1-hr*o*o;const s=Math.sqrt(o);return r=r*180/(pr/s*Math.cos(n)*ae),a=a*180/(pr*(1-hr)/(o*s)*ae),[r,a]}static transformLng(e,t){t=+t,e=+e;let r=300+e+2*t+.1*e*e+.1*e*t+.1*Math.sqrt(Math.abs(e));return r+=(20*Math.sin(6*e*ae)+20*Math.sin(2*e*ae))*2/3,r+=(20*Math.sin(e*ae)+40*Math.sin(e/3*ae))*2/3,r+=(150*Math.sin(e/12*ae)+300*Math.sin(e/30*ae))*2/3,r}static transformLat(e,t){t=+t,e=+e;let r=-100+2*e+3*t+.2*t*t+.1*e*t+.2*Math.sqrt(Math.abs(e));return r+=(20*Math.sin(6*e*ae)+20*Math.sin(2*e*ae))*2/3,r+=(20*Math.sin(t*ae)+40*Math.sin(t/3*ae))*2/3,r+=(160*Math.sin(t/12*ae)+320*Math.sin(t*ae/30))*2/3,r}static out_of_china(e,t){return t=+t,e=+e,!(e>73.66&&e<135.05&&t>3.86&&t<53.55)}}class Ri extends Cesium.WebMercatorTilingScheme{constructor(e){super(e);let t=new Fi;this._projection.project=function(r,a){return a=a||{},a=Oe.WGS84ToGCJ02(Cesium.Math.toDegrees(r.longitude),Cesium.Math.toDegrees(r.latitude)),a=Oe.GCJ02ToBD09(a[0],a[1]),a[0]=Math.min(a[0],180),a[0]=Math.max(a[0],-180),a[1]=Math.min(a[1],74.000022),a[1]=Math.max(a[1],-71.988531),a=t.lngLatToPoint({lng:a[0],lat:a[1]}),new Cesium.Cartesian2(a.x,a.y)},this._projection.unproject=function(r,a){return a=a||{},a=t.mercatorToLngLat({lng:r.x,lat:r.y}),a=Oe.BD09ToGCJ02(a.lng,a.lat),a=Oe.GCJ02ToWGS84(a[0],a[1]),new Cesium.Cartographic(Cesium.Math.toRadians(a[0]),Cesium.Math.toRadians(a[1]))},this.resolutions=e.resolutions||[]}tileXYToNativeRectangle(e,t,r,a){const n=this.resolutions[r],o=e*n,s=(e+1)*n,l=((t=-t)+1)*n,u=t*n;return Cesium.defined(a)?(a.west=o,a.south=u,a.east=s,a.north=l,a):new Cesium.Rectangle(o,u,s,l)}positionToTileXY(e,t,r){const a=this._rectangle;if(!Cesium.Rectangle.contains(a,e))return;const o=this._projection.project(e);if(!Cesium.defined(o))return;const s=this.resolutions[t],l=Math.floor(o.x/s),u=-Math.floor(o.y/s);return Cesium.defined(r)?(r.x=l,r.y=u,r):new Cesium.Cartesian2(l,u)}}const bi="//maponline{s}.bdimg.com/starpic/qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46&app=webearth2&udt=2022",Ni="//maponline{s}.bdimg.com/tile/qt=tile&x={x}&y={y}&z={z}&styles=sl&showtext=1&v=083&udt=2022",Gi="//api{s}.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&scale=1&customid={style}";class zi{constructor(e={}){if(this._url=e.style==="img"?bi:e.style==="vec"?Ni:Gi,this._tileWidth=256,this._tileHeight=256,this._maximumLevel=18,this._crs=e.crs||"BD09",e.crs==="WGS84"){let t=[];for(let r=0;r<19;r++)t[r]=256*Math.pow(2,18-r);this._tilingScheme=new Ri({resolutions:t,rectangleSouthwestInMeters:new Cesium.Cartesian2(-2003772637e-2,-1247410417e-2),rectangleNortheastInMeters:new Cesium.Cartesian2(2003772637e-2,1247410417e-2)})}else this._tilingScheme=new Cesium.WebMercatorTilingScheme({rectangleSouthwestInMeters:new Cesium.Cartesian2(-33554054,-33746824),rectangleNortheastInMeters:new Cesium.Cartesian2(33554054,33746824)});this._rectangle=this._tilingScheme.rectangle,this._credit=void 0,this._style=e.style||"normal"}get url(){return this._url}get token(){return this._token}get tileWidth(){if(!this.ready)throw new Cesium.DeveloperError("tileWidth must not be called before the imagery provider is ready.");return this._tileWidth}get tileHeight(){if(!this.ready)throw new Cesium.DeveloperError("tileHeight must not be called before the imagery provider is ready.");return this._tileHeight}get maximumLevel(){if(!this.ready)throw new Cesium.DeveloperError("maximumLevel must not be called before the imagery provider is ready.");return this._maximumLevel}get minimumLevel(){if(!this.ready)throw new Cesium.DeveloperError("minimumLevel must not be called before the imagery provider is ready.");return 0}get tilingScheme(){if(!this.ready)throw new Cesium.DeveloperError("tilingScheme must not be called before the imagery provider is ready.");return this._tilingScheme}get rectangle(){if(!this.ready)throw new Cesium.DeveloperError("rectangle must not be called before the imagery provider is ready.");return this._rectangle}get ready(){return!!this._url}get credit(){return this._credit}get hasAlphaChannel(){return!0}getTileCredits(e,t,r){}requestImage(e,t,r){if(!this.ready)throw new Cesium.DeveloperError("requestImage must not be called before the imagery provider is ready.");let a=this._tilingScheme.getNumberOfXTilesAtLevel(r),n=this._tilingScheme.getNumberOfYTilesAtLevel(r),o=this._url.replace("{z}",r).replace("{s}",String(1)).replace("{style}",this._style);return this._crs==="WGS84"?o=o.replace("{x}",String(e)).replace("{y}",String(-t)):o=o.replace("{x}",String(e-a/2)).replace("{y}",String(n/2-t-1)),Cesium.ImageryProvider.loadImage(this,o)}}class Ui extends Cesium.WebMercatorTilingScheme{constructor(e){super(e);let t=new Cesium.WebMercatorProjection;this._projection.project=function(r,a){return a=Oe.WGS84ToGCJ02(Cesium.Math.toDegrees(r.longitude),Cesium.Math.toDegrees(r.latitude)),a=t.project(new Cesium.Cartographic(Cesium.Math.toRadians(a[0]),Cesium.Math.toRadians(a[1]))),new Cesium.Cartesian2(a.x,a.y)},this._projection.unproject=function(r,a){let n=t.unproject(r);return a=Oe.GCJ02ToWGS84(Cesium.Math.toDegrees(n.longitude),Cesium.Math.toDegrees(n.latitude)),new Cesium.Cartographic(Cesium.Math.toRadians(a[0]),Cesium.Math.toRadians(a[1]))}}}const Vi="//webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",ki="//webrd{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",Oi="//webst{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}";class Wi extends Cesium.UrlTemplateImageryProvider{constructor(e={}){e.url=e.style==="img"?Vi:e.style==="cva"?Oi:ki,(!e.subdomains||!e.subdomains.length)&&(e.subdomains=["01","02","03","04"]),e.crs==="WGS84"&&(e.tilingScheme=new Ui),super(e)}}const Hi="//p{s}.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=400",Ki="//rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={reverseY}&styleid={style}&scene=0&version=347";class Zi extends Cesium.UrlTemplateImageryProvider{constructor(e={}){let t=e.style==="img"?Hi:Ki;e.url=t.replace("{style}",e.style||1),(!e.subdomains||!e.subdomains.length)&&(e.subdomains=["0","1","2"]),e.style==="img"&&(e.customTags={sx:(r,a,n,o)=>a>>4,sy:(r,a,n,o)=>(1<<o)-n>>4}),super(e)}}const Ji="//t{s}.tianditu.gov.cn/DataServer?T={style}_w&x={x}&y={y}&l={z}&tk={key}";class Yi extends Cesium.UrlTemplateImageryProvider{constructor(e={}){super({url:Ji.replace(/\{style\}/g,e.style||"vec").replace(/\{key\}/g,e.key||""),subdomains:["0","1","2","3","4","5","6","7"],tilingScheme:new Cesium.WebMercatorTilingScheme,maximumLevel:18})}}const ji="//mt{s}.google.cn/vt/lyrs=m@207000000&hl=zh-CN&gl=CN&src=app&x={x}&y={y}&z={z}&s=Galile",Xi="//mt{s}.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali",Qi="//mt{s}.google.cn/vt/lyrs=t@131,r@227000000&hl=zh-CN&gl=cn&x={x}&y={y}&z={z}&s=Galile";class qi extends Cesium.UrlTemplateImageryProvider{constructor(e={}){e.url=e.style==="img"?Xi:e.style==="ter"?Qi:ji,(!e.subdomains||!e.subdomains.length)&&(e.subdomains=["1","2","3"]),super(e)}}Cesium.AmapImageryProvider=Wi;Cesium.BaiduImageryProvider=zi;Cesium.TencentImageryProvider=Zi;Cesium.TdtImageryProvider=Yi;Cesium.GoogleImageryProvider=qi;class $i{constructor(){const{viewer:e,CesiumMap:t}=Ce();this.viewer=e,this.CesiumMap=t}createTdtImageryProvider(e){let t={style:e||"vec",key:this.CesiumMap.TDT_KEY};return new Cesium.TdtImageryProvider(t)}createBaiduImageryProvider(e){let t={style:e||"img",crs:"WGS84"};return new Cesium.BaiduImageryProvider(t)}createTencentImageryProvider(e){let t={style:e||1};return new Cesium.TencentImageryProvider(t)}createAmapImageryProvider(e){let t={style:e||"img",crs:"WGS84"};return new Cesium.AmapImageryProvider(t)}createGoogleImageryProvider(e){let t={style:e||"img",crs:"WGS84"};return new Cesium.GoogleImageryProvider(t)}createUrlImageryLayer(e){return new Cesium.UrlTemplateImageryProvider(e)}createUrlTerrain(e,t){return new Promise((r,a)=>{try{let n=Cesium.CesiumTerrainProvider.fromUrl(e,{requestVertexNormals:!0,...t});r(n)}catch(n){a(n)}})}createGeojsonArea(e,t="#081122"){let r=[];e.features[0].geometry.coordinates[0][0].forEach(u=>{r.push(u[0]),r.push(u[1])});var a=new Cesium.PolygonGeometry({polygonHierarchy:new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray([73,53,73,0,135,0,135,53]),[new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(r))])}),n=Cesium.PolygonGeometry.createGeometry(a);let o=[];o.push(new Cesium.GeometryInstance({geometry:n,attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(t))}}));function s(u,m,d,h,p){u.push(new Cesium.GeometryInstance({geometry:new Cesium.RectangleGeometry({rectangle:Cesium.Rectangle.fromDegrees(m,d,h,p)}),attributes:{color:Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(t))}}))}return s(o,-180,-90,73,90),s(o,135,-90,180,90),s(o,73,53,135,90),s(o,73,-90,135,0),this.viewer.scene.primitives.add(new Cesium.Primitive({geometryInstances:o,appearance:new Cesium.PerInstanceColorAppearance({flat:!0,translucent:!1})}))}createOverlayArea(e,t="rgba(0, 0, 0, 0.85)"){let r=[];e.features[0].geometry.coordinates.forEach(n=>{r.push({positions:Cesium.Cartesian3.fromDegreesArray(n.flat(1/0))})});let a=new Cesium.Entity({polygon:{hierarchy:{positions:Cesium.Cartesian3.fromDegreesArray([0,0,0,90,179,90,179,0]),holes:r},material:new Cesium.Color.fromCssColorString(t)}});return viewer.entities.add(a),a}}class ea{constructor(){const{viewer:e}=Ce();this.viewer=e,this._icrf=null,this.icrfActive=!1}get PositionUtils(){return new Fe}setView(e){this.viewer.camera.setView({destination:Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height),orientation:{heading:Cesium.Math.toRadians(e.heading||0),pitch:Cesium.Math.toRadians(e.pitch||-90),roll:Cesium.Math.toRadians(e.roll||0)}})}zoomTo(e,t){this.viewer.zoomTo(e,t)}setViewArea(e){this.viewer.camera.setView({destination:Cesium.Rectangle.fromDegrees(e)})}startIcrf(){let e=this.viewer;e.clock.shouldAnimate=!0,e.clock.multiplier=100;var t=e.clock.currentTime.secondsOfDay;this._icrf=function(){var r=1,a=e.clock.currentTime.secondsOfDay,n=(a-t)/1e3;t=a,e.scene.camera.rotate(Cesium.Cartesian3.UNIT_Z,r*n)},e.clock.onTick.addEventListener(this._icrf),this.icrfActive=!0}stopTcrf(){if(!this.icrfActive)return this.icrfActive=!1,!1;this.viewer.clock.onTick.removeEventListener(this._icrf),this.viewer.clock.multiplier=1,this.viewer.clock.shouldAnimate=!1,this._icrf=null}viewerFlyTo(e,t={},r){this.viewer.flyTo(e,{duration:3,...t}).then(()=>{r()})}cameraFlyTo(e,t,r=3){this.viewer.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height),orientation:{heading:Cesium.Math.toRadians(e.heading||0),pitch:Cesium.Math.toRadians(e.pitch||-90),roll:Cesium.Math.toRadians(e.roll||0)},complete:t,duration:r})}setCameraEotateHeading(e,t=30){if(e){let r=this.viewer,a=Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height),n=Cesium.Math.toRadians(-30),o=360/t,s=5e3,l=Cesium.JulianDate.fromDate(new Date);r.clock.startTime=l.clone(),r.clock.currentTime=l.clone(),r.clock.clockRange=Cesium.ClockRange.CLAMPED,r.clock.clockStep=Cesium.ClockStep.SYSTEM_CLOCK;let u=r.camera.heading,m=function(){let h=Cesium.JulianDate.secondsDifference(r.clock.currentTime,r.clock.startTime),p=Cesium.Math.toRadians(h*o)+u;r.scene.camera.setView({destination:a,orientation:{heading:p,pitch:n}}),r.scene.camera.moveBackward(s),Cesium.JulianDate.compare(r.clock.currentTime,r.clock.stopTime)>=0&&r.clock.onTick.removeEventListener(m)};r.clock.onTick.addEventListener(m)}}rotateIn(e,t=3.5){let r={lng:104.62079,lat:31.5603,height:1e5,heading:0,pitch:"-90",...e},a=this.viewer,n=null;a.camera.setView({destination:Cesium.Cartesian3.fromDegrees(-116.4074,39.9042,25e5),orientation:{heading:Cesium.Math.toRadians(0),pitch:Cesium.Math.toRadians(-45),roll:0}}),n=setTimeout(()=>{a.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(r.lng,r.lat,r.height),duration:t,orientation:{heading:Cesium.Math.toRadians(r.heading),pitch:Cesium.Math.toRadians(r.pitch),roll:0},easingFunction:Cesium.EasingFunction.QUADRATIC_IN_OUT,complete:function(){clearTimeout(n),n=null}})},1e3)}}class Jt{constructor(){const{viewer:e}=Ce();this.viewer=e}getSpaceDistance(e){for(var t=0,r=0;r<e.length-1;r++){var a=Cesium.Cartographic.fromCartesian(e[r]),n=Cesium.Cartographic.fromCartesian(e[r+1]),o=new Cesium.EllipsoidGeodesic;o.setEndPoints(a,n);var s=o.surfaceDistance;s=Math.sqrt(Math.pow(s,2)+Math.pow(n.height-a.height,2)),t=t+s}return t.toFixed(2)}getArea(e){for(var t=Math.PI/180,r=180/Math.PI,a=0,n=0;n<e.length-2;n++){var o=(n+1)%e.length,s=(n+2)%e.length,l=d(e[n],e[o],e[s]),u=this.getSpaceDistance([e[n],e[o]]),m=this.getSpaceDistance([e[o],e[s]]);a+=u*m*Math.abs(Math.sin(l))}return(a/1e6).toFixed(4);function d(C,f,g){var y=h(f,C),D=h(f,g),_=y-D;return _<0&&(_+=360),_}function h(C,f){var g=p(C).lat*t,y=p(C).lng*t,D=p(f).lat*t,_=p(f).lng*t,x=-Math.atan2(Math.sin(y-_)*Math.cos(D),Math.cos(g)*Math.sin(D)-Math.sin(g)*Math.cos(D)*Math.cos(y-_));return x<0&&(x+=Math.PI*2),x=x*r,x}function p(C){var f=Cesium.Cartographic.fromCartesian(C),g=Cesium.Math.toDegrees(f.longitude),y=Cesium.Math.toDegrees(f.latitude),D=f.height;return{lng:g,lat:y,hei:D}}}getPointsCenter(e){let t=[];e.forEach(C=>{t.push(`${C[1]},${C[0]}`)});var r=t.length,a=0,n=0,o=0;for(let C=0;C<t.length;C++){if(t[C]=="")continue;let f=t[C].split(",");var s,l,u,m,d;s=parseFloat(f[0])*Math.PI/180,l=parseFloat(f[1])*Math.PI/180,u=Math.cos(s)*Math.cos(l),m=Math.cos(s)*Math.sin(l),d=Math.sin(s),a+=u,n+=m,o+=d}a=a/r,n=n/r,o=o/r;var h=Math.atan2(n,a),p=Math.atan2(o,Math.sqrt(a*a+n*n));return{lat:p*180/Math.PI,lng:h*180/Math.PI}}canvasToImage(e,t,r){return new Promise((a,n)=>{let o={iconWidth:152,iconHeight:152,txtColor:"#fff",txtFontSize:"16px",...r};const s=document.createElement("canvas");var l=s.getContext("2d"),u=new Image;s.width=o.iconWidth,s.height=o.iconHeight,u.src=e,u.onload=()=>{l.drawImage(u,0,0),l.font=`400 ${o.txtFontSize}px Microsoft YaHei`,l.textBaseline="middle",l.textAlign="center";var m=o.txtLeft||s.width/2,d=o.txtTop||s.height/2+3;l.fillStyle=o.txtColor,l.fillText(t,m,d),u.src=s.toDataURL("image/png"),a(u)}})}computedRectangle(e,t,r=5e-4){let a,n,o,s,l=e.map(d=>Number(d.lng)),u=e.map(d=>Number(d.lat));a=Math.max.apply(null,l),n=Math.min.apply(null,l),o=Math.max.apply(null,u),s=Math.min.apply(null,u);var m=new Cesium.Rectangle.fromDegrees(n-r,s-r,a+r,o+r);t({maxLng:a,minLng:n,maxLat:o,minLat:s},m)}getPitch(e,t){let r=Cesium.Transforms.eastNorthUpToFixedFrame(e);const a=Cesium.Cartesian3.subtract(t,e,new Cesium.Cartesian3);let n=Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(r,r),a,a);Cesium.Cartesian3.normalize(n,n);let o=Cesium.Math.PI_OVER_TWO-Cesium.Math.acosClamped(n.z);return Cesium.Math.toDegrees(o)}getCartesian3Heading(e,t){const r=Cesium.Transforms.eastNorthUpToFixedFrame(e),a=Cesium.Cartesian3.subtract(t,e,new Cesium.Cartesian3),n=Cesium.Matrix4.multiplyByPointAsVector(Cesium.Matrix4.inverse(r,new Cesium.Matrix4),a,new Cesium.Cartesian3),o=Cesium.Cartesian3.normalize(n,new Cesium.Cartesian3);let s=Math.atan2(o.y,o.x)-Cesium.Math.PI_OVER_TWO;return s=Cesium.Math.TWO_PI-Cesium.Math.zeroToTwoPi(s),s=Cesium.Math.toDegrees(s),s=(s+360)%360,s}getWGS84Heading(e,t){const r=Cesium.Math.toRadians(e.lat),a=Cesium.Math.toRadians(t.lat),n=Cesium.Math.toRadians(t.lng-e.lng),o=Math.sin(n)*Math.cos(a),s=Math.cos(r)*Math.sin(a)-Math.sin(r)*Math.cos(a)*Math.cos(n);let l=Math.atan2(o,s);return l=Cesium.Math.toDegrees(l),l=(l+360)%360,l}}let Ue,ve,fr=[],Ve=new Cesium.CustomDataSource("dataSourcesRoaming");const oe=class oe{constructor(){const{viewer:e}=Ce();this.viewer=e,e.dataSources.add(Ve),this.roamingHandler=null,this._roamingHandlerFn=this._roamingHandlerFn.bind(this)}get PositionUtils(){return new Fe}get BaseFnUtils(){return new Jt}RoamingStart(e,t){if(!e)throw new Error("巡航路径未定义！");t={modelUrl:"",modelShow:!0,pathShow:!0,polylineShow:!0,interpolationOptions:null,...t};let r=this.BaseFnUtils.getSpaceDistance(e);const a=Cesium.JulianDate.fromDate(new Date),n=r/50,o=Cesium.JulianDate.addSeconds(a,n,new Cesium.JulianDate);viewer.clock.startTime=a,viewer.clock.stopTime=o,viewer.clock.currentTime=a,viewer.clock.clockRange=Cesium.ClockRange.LOOP_STOP,viewer.clock.multiplier=oe.roamingSpeed,viewer.clock.shouldAnimate=!0,viewer.timeline.zoomTo(a,o),ve=new Cesium.SampledPositionProperty;let s=0;return e.forEach((l,u)=>{let m=0;u>0&&(m=this.BaseFnUtils.getSpaceDistance([e[u-1],e[u]]));let d=m/r*n+s;s=d;const h=Cesium.JulianDate.addSeconds(a,d,new Cesium.JulianDate);fr.push(h);let p=this.PositionUtils.transformCartesianToWGS84(l),C=Cesium.Cartesian3.fromDegrees(p.lng,p.lat,oe.roamingHeight);ve.addSample(h,C)}),Ue=Ve.entities.add({availability:new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({start:a,stop:o})]),position:ve,orientation:new Cesium.VelocityOrientationProperty(ve),model:{uri:t.modelUrl,minimumPixelSize:21,show:t.modelShow},path:{resolution:1,material:new Cesium.PolylineGlowMaterialProperty({glowPower:.1,color:Cesium.Color.YELLOW}),width:5,show:t.pathShow}}),t.polylineShow&&Ve.entities.add({polyline:{positions:e,show:!0,material:Cesium.Color.TRANSPARENT,width:1,clampToGround:!0}}),t.interpolationOptions&&Ue.position.setInterpolationOptions({...t.interpolationOptions}),Ue}openGodView(){if(Ve)this.roamingHandler?this.StopTrackedEntity():this.viewer.zoomTo(Ve.entities,new Cesium.HeadingPitchRange(0,Cesium.Math.toRadians(-90)));else throw new Error("还为创建巡航对象！")}StopTrackedEntity(){let e=this;if(e.roamingHandler&&Ue){let t=this.viewer;t.zoomTo(Ve.entities,new Cesium.HeadingPitchRange(0,Cesium.Math.toRadians(-90))),t.scene.preRender.removeEventListener(e._roamingHandlerFn),e.roamingHandler=null}else throw new Error("还为创建巡航对象或者未在巡航状态！")}_roamingHandlerFn(e,t){let r=Ue.position.getValue(t);if(r){let a=ve.getValue(Cesium.JulianDate.addSeconds(t,.1,new Cesium.JulianDate)),n=0;a&&r&&(n=this.BaseFnUtils.getCartesian3Heading(r,a));const o=Cesium.Math.toRadians(n),s=Cesium.Math.toRadians(oe.roamingPitch),l=oe.roamingRange;viewer.camera.lookAt(r,new Cesium.HeadingPitchRange(o,s,l))}}RoamingTrackedEntity(){let e=this.viewer,t=this;Ue&&(t.roamingHandler=e.scene.preRender.addEventListener(t._roamingHandlerFn))}RoamingPause(){this.viewer.clock.shouldAnimate=!1}RoamingContinue(){this.viewer.clock.shouldAnimate=!0}RoamingSpeed(e){oe.roamingSpeed=e,this.viewer.clock.multiplier=e}RoamingPitch(e){oe.roamingPitch=e}RoamingHeight(e){oe.roamingHeight=e,fr.forEach(t=>{let r=ve.getValue(t),a=this.PositionUtils.transformCartesianToWGS84(r),n=Cesium.Cartesian3.fromDegrees(a.lng,a.lat,oe.roamingHeight);ve.removeSample(t),ve.addSample(t,n)})}RoamingRange(e){oe.roamingRange=e}};ze(oe,"roamingPitch",-40),ze(oe,"roamingHeight",1500),ze(oe,"roamingSpeed",.3),ze(oe,"roamingRange",50);let Ht=oe;const Kt="/CesiumSDK_Examples/assets/icon_marker-DbVZW7qG.png";class ta{constructor(){const{viewer:e}=Ce();this.viewer=e,this.clusterDataSource=new Cesium.CustomDataSource("cluster"),this.viewer.dataSources.add(this.clusterDataSource)}get PositionUtils(){return new Fe}get entities(){return this.viewer.entities}getEntityById(e){return this.viewer.entities.getById(e)}removeEntityById(e){this.viewer.entities.removeById(e)}removeAllEntity(){this.viewer.entities.removeAll()}getClusterDataSource(){return this.clusterDataSource}onClick(e){let t=this.viewer.scene;var r=new Cesium.ScreenSpaceEventHandler(t.canvas);this.handler=r,r.setInputAction(a=>{let n=t.drillPick(a.position).map(o=>o.id);if(n.length>0)e&&e(n,a,"Entity");else{let o=this.viewer.camera.getPickRay(a.position),s=this.viewer.imageryLayers.pickImageryLayerFeatures(o,this.viewer.scene);Cesium.defined(s)?s.then(l=>{l.length>0&&e&&e(l,a,"ImageryLayerFeatures")}):console.log("No features picked.")}},Cesium.ScreenSpaceEventType.LEFT_CLICK)}removeClick(){this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)}entityMove(e){var t=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);this.handler=t;let r,a;t.setInputAction(n=>{let o=this.viewer.scene.pick(n.position);o&&o.id&&o.id.myData.isMove&&(r=o,a=!0,this.viewer.scene.screenSpaceCameraController.enableRotate=!1)},Cesium.ScreenSpaceEventType.LEFT_DOWN),t.setInputAction(n=>{if(a===!0&&r!=null){let o=this.viewer.camera.getPickRay(n.endPosition),s=this.viewer.scene.globe.pick(o,this.viewer.scene),l=this.PositionUtils.transformCartesianToWGS84(s),u=CM.Position.transformWGS84ToWindow(l);u.y=u.y+r.id.billboard.height._value/2,l=CM.Position.transformWindowToWGS84(u),r.id.position=this.PositionUtils.transformWGS84ToCartesian({lng:l.lng,lat:l.lat,height:0})}},Cesium.ScreenSpaceEventType.MOUSE_MOVE),t.setInputAction(n=>{a=!1,this.viewer.scene.screenSpaceCameraController.enableRotate=!0,e&&r&&e(r.id),r=null},Cesium.ScreenSpaceEventType.LEFT_UP)}removeEntityMove(){this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN),this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP)}loadClusterMarker(e,t,r,a={w:40,h:40}){return this.clusterDataSource.entities.add({myData:t||{},position:Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height||1),billboard:{image:r||Kt,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,scale:1,width:a.w,height:a.h,eyeOffset:new Cesium.Cartesian3(0,-4,0)}})}loadCustomClusterMarker(e){return this.clusterDataSource.entities.add(e)}pointToClusterMarker(){return this.entities._entities._array.forEach(e=>{this.loadCustomClusterMarker(e)}),this.clusterDataSource}openCluster(e,t){e={enabled:!0,pixelRange:80,minimumClusterSize:2,...e};for(let r in e)this.clusterDataSource.clustering[r]=e[r];return t||(t=[{max:20,color:"#0000ff",width:72,height:72,fontColor:"#fff"},{max:12,color:"#F8C71F",width:56,height:56,fontColor:"#fff"},{max:0,color:"#FF1E1E",width:56,height:56,fontColor:"#fff"}]),this.clusterDataSource.clustering.clusterEvent.addEventListener(async(r,a)=>{a.label.show=!1,a.billboard.show=!0,a.billboard.verticalOrigin=Cesium.VerticalOrigin.BOTTOM;let n=t.findIndex(u=>r.length>=u.max),o=t[n];o.isImg?a.billboard.image=await s(o.imgUrl,o.fontColor,r.length,o.width,o.height):a.billboard.image=l(o.color,o.fontColor,r.length,o.width,o.height),a.billboard.width=o.width,a.billboard.height=o.height;function s(u,m,d,h,p){let C=document.createElement("canvas");C.width=h,C.height=p;let f=C.getContext("2d");return new Promise((g,y)=>{let D=document.createElement("img");D.src=u,D.onload=()=>{f.drawImage(D,0,0,h,p),f.fillStyle=m,f.font="14px Microsoft YaHei",f.textAlign="center",f.textBaseline="middle",f.fillText(d,h/2,p/2),g(C)}})}function l(u,m,d,h,p){let C=document.createElement("canvas");C.width=h,C.height=p;let f=C.getContext("2d"),g=-Math.PI/12,y=Math.PI/2,D=Math.PI/6;f.save(),f.scale(h/24,p/24),f.beginPath(),f.arc(12,12,6,0,2*Math.PI),f.fillStyle=u,f.fill(),f.closePath(),f.lineWidth=2;for(let _=0;_<3;_++)f.beginPath(),f.arc(12,12,8,g,g+y,!1),f.strokeStyle=new Cesium.Color.fromCssColorString(u).withAlpha(.4).toCssColorString(),f.stroke(),f.arc(12,12,11,g,g+y,!1),f.strokeStyle=new Cesium.Color.fromCssColorString(u).withAlpha(.2).toCssColorString(),f.stroke(),f.closePath(),g=g+y+D;return f.restore(),f.fillStyle=m,f.font="14px Microsoft YaHei",f.textAlign="center",f.textBaseline="middle",f.fillText(d,h/2-1,p/2+1),C}}),this.clusterDataSource}removeCluster(){this.clusterDataSource.clustering.enabled=!1}}class ra{constructor(){const{viewer:e}=Ce();this.viewer=e,this.popupDom=null,this.eventListener=null}get PositionUtils(){return new Fe}async createPopup(e,t,r=300,a=200,n=0,o=0){if(!e)return!1;t.hasOwnProperty("height")||(t.height=await this.PositionUtils.getHeigthByLonLat(t.lng,t.lat)),this.closePopup(),this.popupDom=document.getElementById(e),this.popupDom.style.width=r+"px",this.popupDom.style.height=a+"px";let s=this.PositionUtils.transformWGS84ToWindow(t),{x:l,y:u}=s;this.popupDom.style.top=u-a/2+n+"px",this.popupDom.style.left=l-r+o+"px",this.popupDom.style.display="block",this.eventListener=()=>{if(this.popupDom.style.display!=="none"){let m=this.PositionUtils.transformWGS84ToWindow(t);if(m){let{x:d,y:h}=m;this.popupDom.style.top=h-a/2+n+"px",this.popupDom.style.left=d-r+o+"px"}}},this.viewer.scene.postRender.addEventListener(this.eventListener)}closePopup(){this.popupDom&&this.popupDom.style.display!=="none"&&(this.popupDom.style.display="none",this.viewer.scene.postRender.removeEventListener(this.eventListener),this.eventListener=null)}}function ia(i){var e=document.createElement("div");return e.innerHTML=i,e.childNodes}class aa{constructor(){const{viewer:e}=Ce();this.viewer=e,this.handler=null,this.cesiumContainer=document.getElementById("cesiumContainer"),this.toolTipDom=null,this._positions=[],this._entities=[],this._drawData=null}get PositionUtils(){return new Fe}get BaseFnUtils(){return new Jt}_clean(){this.handler&&(this.handler.destroy(),this._destroyToolTip(),this.handler=null),this._entities.forEach(e=>{this.viewer.entities.remove(e)}),this._drawData=null,this._positions=[],this._entities=[]}_createdToolTip(e="右击完成绘制"){let t=`
            <div style="font-size:12px;position: absolute;padding:5px 10px;color: #fff;
            background: rgba(0,0,0,.7);user-select: none;pointer-events：none;
            border-radius: 4px;" class='cesium-toolTip' id='cesiumToolTip'>${e}</div>
        `;this.toolTipDom=ia(t)[1],this.toolTipDom&&(this.cesiumContainer.appendChild(this.toolTipDom),this.toolTipDom.style.display="none",this.cesiumContainer.addEventListener("mousemove",this._toolTipShow))}_updateToopTipContent(e){this.toolTipDom.innerHTML=e}_toolTipShow(e){let t=document.getElementById("cesiumToolTip");e&&t&&(t.style.top=e.offsetY-15+"px",t.style.left=e.offsetX+20+"px",t.style.display="block")}_destroyToolTip(){this.toolTipDom&&(this.cesiumContainer.removeEventListener("mousemove",this._toolTipShow),this.toolTipDom.parentNode.removeChild(this.toolTipDom),this.toolTipDom=null)}loadMarker(e,t,r,a={w:40,h:40}){return this.viewer.entities.add({myData:t||{},position:Cesium.Cartesian3.fromDegrees(e.lng,e.lat,e.height||1),billboard:{image:r||Kt,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,scale:1,width:a.w,height:a.h,eyeOffset:new Cesium.Cartesian3(0,-4,0),disableDepthTestDistance:Number.POSITIVE_INFINITY}})}_createPoint(e,t){let r={};t&&(r.label={text:t,font:"18px sans-serif",fillColor:Cesium.Color.GOLD,style:Cesium.LabelStyle.FILL_AND_OUTLINE,outlineWidth:2,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(20,-20)});var a=this.viewer.entities.add({position:e,point:{pixelSize:9,color:Cesium.Color.fromBytes(255,255,255,255),outlineColor:Cesium.Color.fromBytes(35,216,184,255),outlineWidth:2},...r});return this._entities.push(a),a}loadPolyline(e,t,r){var a=this.viewer.entities.add({myData:t,polyline:{positions:e,show:!0,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 1)"),width:3,clampToGround:!0,...r}});return a}_createPolyline(e){var t=this.viewer.entities.add({polyline:{positions:new Cesium.CallbackProperty(()=>this._positions,!1),show:!0,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 1)"),width:3,clampToGround:!0,...e}});return this._entities.push(t),t}Polyline(e,t,r){this._clean(),this._createdToolTip("左击选择点位，右击结束！"),this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas),this.handler.setInputAction(a=>{let n=this.PositionUtils.getClickPosition(a.position,2);if(!Cesium.defined(n))return!1;if(this._positions.push(n.clone()),t){let o=this._positions.concat();o.pop();let s=this.BaseFnUtils.getSpaceDistance(o.slice(o.length-2));this._createPoint(n,s+"米")}else this._createPoint(n)},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.handler.setInputAction(a=>{let n=this.PositionUtils.getClickPosition(a.endPosition,2);if(!Cesium.defined(n))return!1;Cesium.defined(this._drawData)||(this._drawData=this._createPolyline(r)),this._drawData&&(this._toolTipShow(),this._positions.pop(),this._positions.push(n))},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(a=>{if(!this._drawData)return;let n=this.PositionUtils.getClickPosition(a.position,2);if(!Cesium.defined(n))return!1;this._positions.pop();let o=this._positions.concat();if(t){let s=this.BaseFnUtils.getSpaceDistance(o.slice(o.length-2));typeof e=="function"&&(e(s),this.handler&&(this.handler.destroy(),this._destroyToolTip(),this.handler=null))}else{let s=this.loadPolyline(o,{},r);typeof e=="function"&&e(s,o),this._clean()}},Cesium.ScreenSpaceEventType.RIGHT_CLICK)}MeasureDistance(e){this.Polyline(e,!0)}loadHollowPolygon(e,t,r,a,n){return this.viewer.entities.add({myData:t,polygon:{hierarchy:new Cesium.PolygonHierarchy(e),clampToGround:!0,fill:!0,material:new Cesium.Color.fromCssColorString("rgba(0,0,0,0)"),outline:!1,...a},polyline:{positions:e.concat(e[0]),clampToGround:!0,...r},...n})}loadPolygon(e,t,r){return this.viewer.entities.add({myData:t,polygon:{hierarchy:new Cesium.PolygonHierarchy(e),clampToGround:!0,fill:!0,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),outline:!1,...r}})}_createPolygon(e){var t=this.viewer.entities.add({polygon:{hierarchy:new Cesium.CallbackProperty(()=>new Cesium.PolygonHierarchy(this._positions),!1),clampToGround:!0,show:!0,fill:!0,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),outlineColor:Cesium.Color.BLACK,outlineWidth:1,outline:!1,...e},label:{text:"labelText",font:"18px sans-serif",fillColor:Cesium.Color.GOLD,style:Cesium.LabelStyle.FILL_AND_OUTLINE,outlineWidth:2,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(20,-20)}});return this._entities.push(t),t}_createHollowPolygon(e,t,r){var a=this.viewer.entities.add({polygon:{hierarchy:new Cesium.CallbackProperty(()=>new Cesium.PolygonHierarchy(this._positions),!1),clampToGround:!0,show:!0,fill:!0,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),outlineColor:Cesium.Color.BLACK,outlineWidth:1,outline:!1,...t},polyline:{positions:new Cesium.CallbackProperty(()=>this._positions.concat(this._positions[0]),!1),clampToGround:!0,...e},...r});return this._entities.push(a),a}Polygon(e,t,r){let a;this._clean(),this._createdToolTip("左击选择点位，右击结束！"),this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas),this.handler.setInputAction(n=>{let o=this.PositionUtils.getClickPosition(n.position,2);if(!Cesium.defined(o))return!1;this._positions.push(o.clone()),this._createPoint(o)},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.handler.setInputAction(n=>{let o=this.PositionUtils.getClickPosition(n.endPosition,2);if(!Cesium.defined(o))return!1;this._positions.length==3&&(Cesium.defined(this._drawData)||(this._drawData=this._createPolygon(r),t&&(a=this.viewer.entities.add({position:new Cesium.CallbackProperty(()=>{var s=this._drawData.polygon.hierarchy.getValue(Cesium.JulianDate.now()).positions,l=Cesium.BoundingSphere.fromPoints(s).center;return l},!1),label:{text:"0",font:"18px sans-serif",fillColor:Cesium.Color.GOLD,style:Cesium.LabelStyle.FILL_AND_OUTLINE,outlineWidth:2,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,pixelOffset:new Cesium.Cartesian2(20,-20)}}),this._entities.push(a)))),this._toolTipShow(),this._positions.pop(),this._positions.push(o),a&&(a._label._text._value=this.BaseFnUtils.getArea(this._positions)+"平方米")},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(n=>{if(!this._drawData)return;let o=this.PositionUtils.getClickPosition(n.position,2);if(!Cesium.defined(o))return!1;this._positions.pop();let s=this._positions.concat();if(t){let l=this.BaseFnUtils.getArea(s);typeof e=="function"&&(e(l),this.handler&&(this.handler.destroy(),this._destroyToolTip(),this.handler=null))}else{let l=this.loadPolygon(s,{},r);typeof e=="function"&&e(l,s),this._clean()}},Cesium.ScreenSpaceEventType.RIGHT_CLICK)}HollowPolygon(e,t,r,a){r={material:new Cesium.Color.fromCssColorString("rgba(0,0,0,0.3)"),...r},this._clean(),this._createdToolTip("左击选择点位，右击结束！"),this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas),this.handler.setInputAction(n=>{let o=this.PositionUtils.getClickPosition(n.position,2);if(!Cesium.defined(o))return!1;this._positions.push(o.clone()),this._createPoint(o)},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.handler.setInputAction(n=>{let o=this.PositionUtils.getClickPosition(n.endPosition,2);if(!Cesium.defined(o))return!1;this._positions.length==3&&(Cesium.defined(this._drawData)||(this._drawData=this._createHollowPolygon(t,r,a))),this._toolTipShow(),this._positions.pop(),this._positions.push(o)},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(n=>{if(!this._drawData)return;let o=this.PositionUtils.getClickPosition(n.position,2);if(!Cesium.defined(o))return!1;this._positions.pop();let s=this._positions.concat(),l=this.loadHollowPolygon(s,{},t,r,a);typeof e=="function"&&e(l,s),this._clean()},Cesium.ScreenSpaceEventType.RIGHT_CLICK)}MeasureArea(e){this.Polygon(e,!0)}loadCicle(e,t,r){var a=Math.sqrt(Math.pow(e[0].x-e[e.length-1].x,2)+Math.pow(e[0].y-e[e.length-1].y,2)),n=this.viewer.entities.add({myData:t,position:e[0],name:"circle",type:"circle",ellipse:{semiMinorAxis:a,semiMajorAxis:a,material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),outline:!0,...r}});return n}_createCicle(){var e=this.viewer.entities.add({position:this._positions[0],name:"circle",type:"circle",ellipse:{semiMinorAxis:new Cesium.CallbackProperty(()=>{var t=Math.sqrt(Math.pow(this._positions[0].x-this._positions[this._positions.length-1].x,2)+Math.pow(this._positions[0].y-this._positions[this._positions.length-1].y,2));return t||t+1},!1),semiMajorAxis:new Cesium.CallbackProperty(()=>{var t=Math.sqrt(Math.pow(this._positions[0].x-this._positions[this._positions.length-1].x,2)+Math.pow(this._positions[0].y-this._positions[this._positions.length-1].y,2));return t||t+1},!1),material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),outline:!0}});return this._entities.push(e),e}Cicle(e){this._clean(),this._createdToolTip("左键点击选择起点！"),this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas),this.handler.setInputAction(t=>{let r=this.PositionUtils.getClickPosition(t.position,2);if(!Cesium.defined(r))return!1;this._positions.length==0&&(this._positions.push(r.clone()),this._createPoint(r),this._updateToopTipContent("右击点击结束绘制！"),this._positions.push(r))},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.handler.setInputAction(t=>{let r=this.PositionUtils.getClickPosition(t.endPosition,2);if(!Cesium.defined(r))return!1;!Cesium.defined(this._drawData)&&this._positions.length==2&&(this._drawData=this._createCicle()),this._drawData&&(this._toolTipShow(),this._positions.pop(),this._positions.push(r))},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(t=>{if(!this._drawData)return;let r=this.loadCicle(this._positions,{});typeof e=="function"&&e(r,this._positions),this._clean()},Cesium.ScreenSpaceEventType.RIGHT_CLICK)}loadRectangle(e,t,r){var a=this.viewer.entities.add({name:"rectangle",myData:t,rectangle:{coordinates:Cesium.Rectangle.fromCartesianArray(e),material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)"),...r}});return a}_createRectangle(){var e=this.viewer.entities.add({name:"rectangle",rectangle:{coordinates:new Cesium.CallbackProperty(()=>{var t=Cesium.Rectangle.fromCartesianArray(this._positions);return t},!1),material:new Cesium.Color.fromCssColorString("rgba(255, 134, 27, 0.5)")}});return this._entities.push(e),e}Rectangle(e,t){this._clean(),this._createdToolTip("左键点击选择起点！"),this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas),this.handler.setInputAction(r=>{let a=this.PositionUtils.getClickPosition(r.position,2);if(!Cesium.defined(a))return!1;this._positions.length==0&&(this._positions.push(a.clone()),this._createPoint(a),this._updateToopTipContent("右击结束绘制！"),this._positions.push(a))},Cesium.ScreenSpaceEventType.LEFT_CLICK),this.handler.setInputAction(r=>{let a=this.PositionUtils.getClickPosition(r.endPosition,2);if(!Cesium.defined(a))return!1;!Cesium.defined(this._drawData)&&this._positions.length==2&&(this._drawData=this._createRectangle()),this._drawData&&(this._toolTipShow(),this._positions.pop(),this._positions.push(a))},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(r=>{if(!this._drawData)return;let a=this.loadRectangle(this._positions,{});typeof e=="function"&&e(a,this._positions),this._clean()},Cesium.ScreenSpaceEventType.RIGHT_CLICK)}loadWall(e,t,r,a={}){return viewer.entities.add({myData:t,wall:{positions:Cesium.Cartesian3.fromDegreesArrayHeights(e),material:r,outline:!1,...a}})}loadCircleWaveMarker(e){if(!e.position||!e.material)throw new Error("坐标和材质为必传参数");let t={ellipseStyle:{semiMinorAxis:2e3,semiMajorAxis:2e3},myData:{},imgUrl:Kt,imgSize:{w:40,h:40},...e};return this.viewer.entities.add({myData:t.myData,position:Cesium.Cartesian3.fromDegrees(t.position.lng,t.position.lat,t.position.height||1),billboard:{image:t.imgUrl,horizontalOrigin:Cesium.HorizontalOrigin.CENTER,verticalOrigin:Cesium.VerticalOrigin.BOTTOM,heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND,scale:1,width:t.imgSize.w,height:t.imgSize.h,eyeOffset:new Cesium.Cartesian3(0,-4,0)},ellipse:{material:t.material,...t.ellipseStyle}})}startEditEntity(e,t){if(!e)return!1;this._drawData=e,this.handler=new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);let r,a,n;e.polyline&&e.polygon?(a=e.polyline,n=e.polygon,r=n.hierarchy._value.positions,r.forEach((u,m)=>{let d=this._createPoint(u);d.isEditPoint=!0,d.pointIndex=m}),n.hierarchy=new Cesium.CallbackProperty(()=>new Cesium.PolygonHierarchy(r),!1),a.positions=new Cesium.CallbackProperty(()=>r.concat(r[0]),!1)):e.polyline?(a=e.polyline,r=a.positions._value,r.forEach((u,m)=>{let d=this._createPoint(u);d.isEditPoint=!0,d.pointIndex=m}),a.positions=new Cesium.CallbackProperty(()=>r,!1)):e.polygon&&(a=e.polygon,r=a.hierarchy._value.positions,r.forEach((u,m)=>{let d=this._createPoint(u);d.isEditPoint=!0,d.pointIndex=m}),a.hierarchy=new Cesium.CallbackProperty(()=>new Cesium.PolygonHierarchy(r),!1));let o,s,l;this.handler.setInputAction(u=>{let m=this.viewer.scene.pick(u.position);m&&m.id.isEditPoint&&(o=m,s=!0,o&&(this.viewer.scene.screenSpaceCameraController.enableRotate=!1,l=o.id.pointIndex))},Cesium.ScreenSpaceEventType.LEFT_DOWN),this.handler.setInputAction(u=>{if(s===!0&&o!=null){let m=this.viewer.camera.getPickRay(u.endPosition),d=this.viewer.scene.globe.pick(m,this.viewer.scene),h=this.PositionUtils.transformCartesianToWGS84(d);o.id.position=this.PositionUtils.transformWGS84ToCartesian({lng:h.lng,lat:h.lat,height:1}),r[l]=d}},Cesium.ScreenSpaceEventType.MOUSE_MOVE),this.handler.setInputAction(u=>{s&&o!=null&&(s=!1,this.viewer.scene.screenSpaceCameraController.enableRotate=!0,o=null,t&&t(r))},Cesium.ScreenSpaceEventType.LEFT_UP)}stopEditEntity(e){if(this._drawData){if(this._drawData.polyline&&this._drawData.polygon){let t=this._drawData.polygon.hierarchy.getValue().positions;this._drawData.polygon.hierarchy=new Cesium.PolygonHierarchy(t),this._drawData.polyline.positions=t.concat(t[0])}else if(this._drawData.polyline)this._drawData.polyline.positions=this._drawData.polyline.positions.getValue();else if(this._drawData.polygon){let t=this._drawData.polygon.hierarchy.getValue().positions;this._drawData.polygon.hierarchy=new Cesium.PolygonHierarchy(t)}e&&e(this._drawData),this._clean()}}}class na{constructor(e){const t=require("./mapbox-gl");this.mapboxRenderer=new t.BasicRenderer({style:e.style}),this.ready=!1,this.readyPromise=this.mapboxRenderer._style.loadedPromise.then(()=>this.ready=!0),this.tilingScheme=new Cesium.WebMercatorTilingScheme,this.rectangle=this.tilingScheme.rectangle,this.tileSize=this.tileWidth=this.tileHeight=e.tileSize||512,this.maximumLevel=e.maximumLevel||Number.MAX_SAFE_INTEGER,this.minimumLevel=e.minimumLevel||0,this.tileDiscardPolicy=void 0,this.errorEvent=new Cesium.Event,this.credit=new Cesium.Credit(e.credit||"",!1),this.proxy=new Cesium.DefaultProxy(""),this.hasAlphaChannel=e.hasAlphaChannel!==void 0?e.hasAlphaChannel:!0,this.sourceFilter=e.sourceFilter}getTileCredits(e,t,r){return[]}createTile(){let e=document.createElement("canvas");return e.width=this.tileSize,e.height=this.tileSize,e.style.imageRendering="pixelated",e.getContext("2d").globalCompositeOperation="copy",e}requestImage(e,t,r,a=!0){if(r>this.maximumLevel||r<this.minimumLevel)return Promise.reject(void 0);this.mapboxRenderer.filterForZoom(r);const n=[];return this.mapboxRenderer.getVisibleSources().forEach(o=>{n.push({source:o,z:r,x:e,y:t,left:0,top:0,size:this.tileSize})}),new Promise((o,s)=>{let l=this.createTile();const u=this.mapboxRenderer.renderTiles(l.getContext("2d"),{srcLeft:0,srcTop:0,width:this.tileSize,height:this.tileSize,destLeft:0,destTop:0},n,m=>{if(m)switch(m){case"canceled":case"fully-canceled":s(void 0);break;default:s(void 0)}else a?(u.consumer.ctx=void 0,o(l),this.mapboxRenderer.releaseRender(u)):o(u)})})}pickFeatures(e,t,r,a,n){return this.requestImage(e,t,r,!1).then(o=>{let s=this.mapboxRenderer.getVisibleSources();s=this.sourceFilter?this.sourceFilter(s):s;const l=[];return a=Cesium.Math.toDegrees(a),n=Cesium.Math.toDegrees(n),s.forEach(u=>{l.push({data:this.mapboxRenderer.queryRenderedFeatures({source:u,renderedZoom:r,lng:a,lat:n,tileZ:r})})}),o.consumer.ctx=void 0,this.mapboxRenderer.releaseRender(o),l})}destroy(){this.mapboxRenderer._cancelAllPendingRenders(),Object.values(this.mapboxRenderer._style.sourceCaches).forEach(e=>e._tileCache.reset()),this.mapboxRenderer._gl.getExtension("WEBGL_lose_context").loseContext()}}Cesium.MVTImageryProvider=na;class oa{constructor(){const{viewer:e}=Ce();this.viewer=e,this.providerArr=[]}getAllProviderLayers(){return this.providerArr}loadMvtLayers(e,t,r){let a=new Cesium.MVTImageryProvider({style:e});return a.name=t,a.readyPromise.then(()=>{let n=this.viewer.imageryLayers.addImageryProvider(a);this.providerArr.push({name:t,provider:a,imageryLayer:n}),r&&r(n)})}destoryMvtAll(){this.providerArr.forEach(e=>{this.viewer.imageryLayers.remove(e.imageryLayer,!0),e.imageryLayer=null,e.provider.destroy()}),this.providerArr=[]}destoryMVT(e){e.forEach(t=>{let r=this.providerArr.findIndex(a=>a.name==t);r!=-1&&(this.viewer.imageryLayers.remove(this.providerArr[r].imageryLayer,!0),this.providerArr[r].imageryLayer=null,this.providerArr[r].provider.destroy(),this.providerArr.splice(r,1))})}}const sa={UNLOADED:0,LOADING:1,PARSING:2,READY:3,FAILED:4},fe=Object.freeze(sa);var Ir={};(function(i){Ir=i()})(function(){return function i(e,t,r){function a(s,l){if(!t[s]){if(!e[s]){var u=typeof require=="function"&&require;if(!l&&u)return u(s,!0);if(n)return n(s,!0);var m=new Error("Cannot find module '"+s+"'");throw m.code="MODULE_NOT_FOUND",m}var d=t[s]={exports:{}};e[s][0].call(d.exports,function(h){var p=e[s][1][h];return a(p||h)},d,d.exports,i,e,t,r)}return t[s].exports}for(var n=typeof require=="function"&&require,o=0;o<r.length;o++)a(r[o]);return a}({1:[function(i,e,t){var r=typeof Uint8Array<"u"&&typeof Uint16Array<"u"&&typeof Int32Array<"u";t.assign=function(o){for(var s=Array.prototype.slice.call(arguments,1);s.length;){var l=s.shift();if(l){if(typeof l!="object")throw new TypeError(l+"must be non-object");for(var u in l)l.hasOwnProperty(u)&&(o[u]=l[u])}}return o},t.shrinkBuf=function(o,s){return o.length===s?o:o.subarray?o.subarray(0,s):(o.length=s,o)};var a={arraySet:function(o,s,l,u,m){if(s.subarray&&o.subarray){o.set(s.subarray(l,l+u),m);return}for(var d=0;d<u;d++)o[m+d]=s[l+d]},flattenChunks:function(o){var s,l,u,m,d,h;for(u=0,s=0,l=o.length;s<l;s++)u+=o[s].length;for(h=new Uint8Array(u),m=0,s=0,l=o.length;s<l;s++)d=o[s],h.set(d,m),m+=d.length;return h}},n={arraySet:function(o,s,l,u,m){for(var d=0;d<u;d++)o[m+d]=s[l+d]},flattenChunks:function(o){return[].concat.apply([],o)}};t.setTyped=function(o){o?(t.Buf8=Uint8Array,t.Buf16=Uint16Array,t.Buf32=Int32Array,t.assign(t,a)):(t.Buf8=Array,t.Buf16=Array,t.Buf32=Array,t.assign(t,n))},t.setTyped(r)},{}],2:[function(i,e,t){var r=i("./common"),a=!0,n=!0;try{String.fromCharCode.apply(null,[0])}catch{a=!1}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch{n=!1}for(var o=new r.Buf8(256),s=0;s<256;s++)o[s]=s>=252?6:s>=248?5:s>=240?4:s>=224?3:s>=192?2:1;o[254]=o[254]=1,t.string2buf=function(u){var m,d,h,p,C,f=u.length,g=0;for(p=0;p<f;p++)d=u.charCodeAt(p),(d&64512)===55296&&p+1<f&&(h=u.charCodeAt(p+1),(h&64512)===56320&&(d=65536+(d-55296<<10)+(h-56320),p++)),g+=d<128?1:d<2048?2:d<65536?3:4;for(m=new r.Buf8(g),C=0,p=0;C<g;p++)d=u.charCodeAt(p),(d&64512)===55296&&p+1<f&&(h=u.charCodeAt(p+1),(h&64512)===56320&&(d=65536+(d-55296<<10)+(h-56320),p++)),d<128?m[C++]=d:d<2048?(m[C++]=192|d>>>6,m[C++]=128|d&63):d<65536?(m[C++]=224|d>>>12,m[C++]=128|d>>>6&63,m[C++]=128|d&63):(m[C++]=240|d>>>18,m[C++]=128|d>>>12&63,m[C++]=128|d>>>6&63,m[C++]=128|d&63);return m};function l(u,m){if(m<65537&&(u.subarray&&n||!u.subarray&&a))return String.fromCharCode.apply(null,r.shrinkBuf(u,m));for(var d="",h=0;h<m;h++)d+=String.fromCharCode(u[h]);return d}t.buf2binstring=function(u){return l(u,u.length)},t.binstring2buf=function(u){for(var m=new r.Buf8(u.length),d=0,h=m.length;d<h;d++)m[d]=u.charCodeAt(d);return m},t.buf2string=function(u,m){var d,h,p,C,f=m||u.length,g=new Array(f*2);for(h=0,d=0;d<f;){if(p=u[d++],p<128){g[h++]=p;continue}if(C=o[p],C>4){g[h++]=65533,d+=C-1;continue}for(p&=C===2?31:C===3?15:7;C>1&&d<f;)p=p<<6|u[d++]&63,C--;if(C>1){g[h++]=65533;continue}p<65536?g[h++]=p:(p-=65536,g[h++]=55296|p>>10&1023,g[h++]=56320|p&1023)}return l(g,h)},t.utf8border=function(u,m){var d;for(m=m||u.length,m>u.length&&(m=u.length),d=m-1;d>=0&&(u[d]&192)===128;)d--;return d<0||d===0?m:d+o[u[d]]>m?d:m}},{"./common":1}],3:[function(i,e,t){function r(a,n,o,s){for(var l=a&65535|0,u=a>>>16&65535|0,m=0;o!==0;){m=o>2e3?2e3:o,o-=m;do l=l+n[s++]|0,u=u+l|0;while(--m);l%=65521,u%=65521}return l|u<<16|0}e.exports=r},{}],4:[function(i,e,t){e.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],5:[function(i,e,t){function r(){for(var o,s=[],l=0;l<256;l++){o=l;for(var u=0;u<8;u++)o=o&1?3988292384^o>>>1:o>>>1;s[l]=o}return s}var a=r();function n(o,s,l,u){var m=a,d=u+l;o^=-1;for(var h=u;h<d;h++)o=o>>>8^m[(o^s[h])&255];return o^-1}e.exports=n},{}],6:[function(i,e,t){function r(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}e.exports=r},{}],7:[function(i,e,t){var r=30,a=12;e.exports=function(o,s){var l,u,m,d,h,p,C,f,g,y,D,_,x,F,G,q,R,S,M,w,V,N,O,K,b;l=o.state,u=o.next_in,K=o.input,m=u+(o.avail_in-5),d=o.next_out,b=o.output,h=d-(s-o.avail_out),p=d+(o.avail_out-257),C=l.dmax,f=l.wsize,g=l.whave,y=l.wnext,D=l.window,_=l.hold,x=l.bits,F=l.lencode,G=l.distcode,q=(1<<l.lenbits)-1,R=(1<<l.distbits)-1;e:do{x<15&&(_+=K[u++]<<x,x+=8,_+=K[u++]<<x,x+=8),S=F[_&q];t:for(;;){if(M=S>>>24,_>>>=M,x-=M,M=S>>>16&255,M===0)b[d++]=S&65535;else if(M&16){w=S&65535,M&=15,M&&(x<M&&(_+=K[u++]<<x,x+=8),w+=_&(1<<M)-1,_>>>=M,x-=M),x<15&&(_+=K[u++]<<x,x+=8,_+=K[u++]<<x,x+=8),S=G[_&R];r:for(;;){if(M=S>>>24,_>>>=M,x-=M,M=S>>>16&255,M&16){if(V=S&65535,M&=15,x<M&&(_+=K[u++]<<x,x+=8,x<M&&(_+=K[u++]<<x,x+=8)),V+=_&(1<<M)-1,V>C){o.msg="invalid distance too far back",l.mode=r;break e}if(_>>>=M,x-=M,M=d-h,V>M){if(M=V-M,M>g&&l.sane){o.msg="invalid distance too far back",l.mode=r;break e}if(N=0,O=D,y===0){if(N+=f-M,M<w){w-=M;do b[d++]=D[N++];while(--M);N=d-V,O=b}}else if(y<M){if(N+=f+y-M,M-=y,M<w){w-=M;do b[d++]=D[N++];while(--M);if(N=0,y<w){M=y,w-=M;do b[d++]=D[N++];while(--M);N=d-V,O=b}}}else if(N+=y-M,M<w){w-=M;do b[d++]=D[N++];while(--M);N=d-V,O=b}for(;w>2;)b[d++]=O[N++],b[d++]=O[N++],b[d++]=O[N++],w-=3;w&&(b[d++]=O[N++],w>1&&(b[d++]=O[N++]))}else{N=d-V;do b[d++]=b[N++],b[d++]=b[N++],b[d++]=b[N++],w-=3;while(w>2);w&&(b[d++]=b[N++],w>1&&(b[d++]=b[N++]))}}else if((M&64)===0){S=G[(S&65535)+(_&(1<<M)-1)];continue r}else{o.msg="invalid distance code",l.mode=r;break e}break}}else if((M&64)===0){S=F[(S&65535)+(_&(1<<M)-1)];continue t}else if(M&32){l.mode=a;break e}else{o.msg="invalid literal/length code",l.mode=r;break e}break}}while(u<m&&d<p);w=x>>3,u-=w,x-=w<<3,_&=(1<<x)-1,o.next_in=u,o.next_out=d,o.avail_in=u<m?5+(m-u):5-(u-m),o.avail_out=d<p?257+(p-d):257-(d-p),l.hold=_,l.bits=x}},{}],8:[function(i,e,t){var r=i("../utils/common"),a=i("./adler32"),n=i("./crc32"),o=i("./inffast"),s=i("./inftrees"),l=0,u=1,m=2,d=4,h=5,p=6,C=0,f=1,g=2,y=-2,D=-3,_=-4,x=-5,F=8,G=1,q=2,R=3,S=4,M=5,w=6,V=7,N=8,O=9,K=10,b=11,Z=12,ue=13,_e=14,xe=15,Ge=16,ye=17,De=18,We=19,pe=20,le=21,Ie=22,Le=23,He=24,Ke=25,Se=26,Te=27,qt=28,$t=29,k=30,er=31,jr=32,Xr=852,Qr=592,qr=15,$r=qr;function tr(A){return(A>>>24&255)+(A>>>8&65280)+((A&65280)<<8)+((A&255)<<24)}function ei(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function rr(A){var v;return!A||!A.state?y:(v=A.state,A.total_in=A.total_out=v.total=0,A.msg="",v.wrap&&(A.adler=v.wrap&1),v.mode=G,v.last=0,v.havedict=0,v.dmax=32768,v.head=null,v.hold=0,v.bits=0,v.lencode=v.lendyn=new r.Buf32(Xr),v.distcode=v.distdyn=new r.Buf32(Qr),v.sane=1,v.back=-1,C)}function ir(A){var v;return!A||!A.state?y:(v=A.state,v.wsize=0,v.whave=0,v.wnext=0,rr(A))}function ar(A,v){var c,I;return!A||!A.state||(I=A.state,v<0?(c=0,v=-v):(c=(v>>4)+1,v<48&&(v&=15)),v&&(v<8||v>15))?y:(I.window!==null&&I.wbits!==v&&(I.window=null),I.wrap=c,I.wbits=v,ir(A))}function nr(A,v){var c,I;return A?(I=new ei,A.state=I,I.window=null,c=ar(A,v),c!==C&&(A.state=null),c):y}function ti(A){return nr(A,$r)}var or=!0,Gt,zt;function ri(A){if(or){var v;for(Gt=new r.Buf32(512),zt=new r.Buf32(32),v=0;v<144;)A.lens[v++]=8;for(;v<256;)A.lens[v++]=9;for(;v<280;)A.lens[v++]=7;for(;v<288;)A.lens[v++]=8;for(s(u,A.lens,0,288,Gt,0,A.work,{bits:9}),v=0;v<32;)A.lens[v++]=5;s(m,A.lens,0,32,zt,0,A.work,{bits:5}),or=!1}A.lencode=Gt,A.lenbits=9,A.distcode=zt,A.distbits=5}function sr(A,v,c,I){var W,T=A.state;return T.window===null&&(T.wsize=1<<T.wbits,T.wnext=0,T.whave=0,T.window=new r.Buf8(T.wsize)),I>=T.wsize?(r.arraySet(T.window,v,c-T.wsize,T.wsize,0),T.wnext=0,T.whave=T.wsize):(W=T.wsize-T.wnext,W>I&&(W=I),r.arraySet(T.window,v,c-I,W,T.wnext),I-=W,I?(r.arraySet(T.window,v,c-I,I,0),T.wnext=I,T.whave=T.wsize):(T.wnext+=W,T.wnext===T.wsize&&(T.wnext=0),T.whave<T.wsize&&(T.whave+=W))),0}function ii(A,v){var c,I,W,T,de,P,j,B,E,Ye,H,L,je,Ut,J=0,z,te,ce,se,Xe,Qe,Y,me,$=new r.Buf8(4),ge,he,lr=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!A||!A.state||!A.output||!A.input&&A.avail_in!==0)return y;c=A.state,c.mode===Z&&(c.mode=ue),de=A.next_out,W=A.output,j=A.avail_out,T=A.next_in,I=A.input,P=A.avail_in,B=c.hold,E=c.bits,Ye=P,H=j,me=C;e:for(;;)switch(c.mode){case G:if(c.wrap===0){c.mode=ue;break}for(;E<16;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(c.wrap&2&&B===35615){c.check=0,$[0]=B&255,$[1]=B>>>8&255,c.check=n(c.check,$,2,0),B=0,E=0,c.mode=q;break}if(c.flags=0,c.head&&(c.head.done=!1),!(c.wrap&1)||(((B&255)<<8)+(B>>8))%31){A.msg="incorrect header check",c.mode=k;break}if((B&15)!==F){A.msg="unknown compression method",c.mode=k;break}if(B>>>=4,E-=4,Y=(B&15)+8,c.wbits===0)c.wbits=Y;else if(Y>c.wbits){A.msg="invalid window size",c.mode=k;break}c.dmax=1<<Y,A.adler=c.check=1,c.mode=B&512?K:Z,B=0,E=0;break;case q:for(;E<16;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(c.flags=B,(c.flags&255)!==F){A.msg="unknown compression method",c.mode=k;break}if(c.flags&57344){A.msg="unknown header flags set",c.mode=k;break}c.head&&(c.head.text=B>>8&1),c.flags&512&&($[0]=B&255,$[1]=B>>>8&255,c.check=n(c.check,$,2,0)),B=0,E=0,c.mode=R;case R:for(;E<32;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.head&&(c.head.time=B),c.flags&512&&($[0]=B&255,$[1]=B>>>8&255,$[2]=B>>>16&255,$[3]=B>>>24&255,c.check=n(c.check,$,4,0)),B=0,E=0,c.mode=S;case S:for(;E<16;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.head&&(c.head.xflags=B&255,c.head.os=B>>8),c.flags&512&&($[0]=B&255,$[1]=B>>>8&255,c.check=n(c.check,$,2,0)),B=0,E=0,c.mode=M;case M:if(c.flags&1024){for(;E<16;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.length=B,c.head&&(c.head.extra_len=B),c.flags&512&&($[0]=B&255,$[1]=B>>>8&255,c.check=n(c.check,$,2,0)),B=0,E=0}else c.head&&(c.head.extra=null);c.mode=w;case w:if(c.flags&1024&&(L=c.length,L>P&&(L=P),L&&(c.head&&(Y=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,I,T,L,Y)),c.flags&512&&(c.check=n(c.check,I,L,T)),P-=L,T+=L,c.length-=L),c.length))break e;c.length=0,c.mode=V;case V:if(c.flags&2048){if(P===0)break e;L=0;do Y=I[T+L++],c.head&&Y&&c.length<65536&&(c.head.name+=String.fromCharCode(Y));while(Y&&L<P);if(c.flags&512&&(c.check=n(c.check,I,L,T)),P-=L,T+=L,Y)break e}else c.head&&(c.head.name=null);c.length=0,c.mode=N;case N:if(c.flags&4096){if(P===0)break e;L=0;do Y=I[T+L++],c.head&&Y&&c.length<65536&&(c.head.comment+=String.fromCharCode(Y));while(Y&&L<P);if(c.flags&512&&(c.check=n(c.check,I,L,T)),P-=L,T+=L,Y)break e}else c.head&&(c.head.comment=null);c.mode=O;case O:if(c.flags&512){for(;E<16;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(B!==(c.check&65535)){A.msg="header crc mismatch",c.mode=k;break}B=0,E=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),A.adler=c.check=0,c.mode=Z;break;case K:for(;E<32;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}A.adler=c.check=tr(B),B=0,E=0,c.mode=b;case b:if(c.havedict===0)return A.next_out=de,A.avail_out=j,A.next_in=T,A.avail_in=P,c.hold=B,c.bits=E,g;A.adler=c.check=1,c.mode=Z;case Z:if(v===h||v===p)break e;case ue:if(c.last){B>>>=E&7,E-=E&7,c.mode=Te;break}for(;E<3;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}switch(c.last=B&1,B>>>=1,E-=1,B&3){case 0:c.mode=_e;break;case 1:if(ri(c),c.mode=pe,v===p){B>>>=2,E-=2;break e}break;case 2:c.mode=ye;break;case 3:A.msg="invalid block type",c.mode=k}B>>>=2,E-=2;break;case _e:for(B>>>=E&7,E-=E&7;E<32;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if((B&65535)!==(B>>>16^65535)){A.msg="invalid stored block lengths",c.mode=k;break}if(c.length=B&65535,B=0,E=0,c.mode=xe,v===p)break e;case xe:c.mode=Ge;case Ge:if(L=c.length,L){if(L>P&&(L=P),L>j&&(L=j),L===0)break e;r.arraySet(W,I,T,L,de),P-=L,T+=L,j-=L,de+=L,c.length-=L;break}c.mode=Z;break;case ye:for(;E<14;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(c.nlen=(B&31)+257,B>>>=5,E-=5,c.ndist=(B&31)+1,B>>>=5,E-=5,c.ncode=(B&15)+4,B>>>=4,E-=4,c.nlen>286||c.ndist>30){A.msg="too many length or distance symbols",c.mode=k;break}c.have=0,c.mode=De;case De:for(;c.have<c.ncode;){for(;E<3;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.lens[lr[c.have++]]=B&7,B>>>=3,E-=3}for(;c.have<19;)c.lens[lr[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,ge={bits:c.lenbits},me=s(l,c.lens,0,19,c.lencode,0,c.work,ge),c.lenbits=ge.bits,me){A.msg="invalid code lengths set",c.mode=k;break}c.have=0,c.mode=We;case We:for(;c.have<c.nlen+c.ndist;){for(;J=c.lencode[B&(1<<c.lenbits)-1],z=J>>>24,te=J>>>16&255,ce=J&65535,!(z<=E);){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(ce<16)B>>>=z,E-=z,c.lens[c.have++]=ce;else{if(ce===16){for(he=z+2;E<he;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(B>>>=z,E-=z,c.have===0){A.msg="invalid bit length repeat",c.mode=k;break}Y=c.lens[c.have-1],L=3+(B&3),B>>>=2,E-=2}else if(ce===17){for(he=z+3;E<he;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}B>>>=z,E-=z,Y=0,L=3+(B&7),B>>>=3,E-=3}else{for(he=z+7;E<he;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}B>>>=z,E-=z,Y=0,L=11+(B&127),B>>>=7,E-=7}if(c.have+L>c.nlen+c.ndist){A.msg="invalid bit length repeat",c.mode=k;break}for(;L--;)c.lens[c.have++]=Y}}if(c.mode===k)break;if(c.lens[256]===0){A.msg="invalid code -- missing end-of-block",c.mode=k;break}if(c.lenbits=9,ge={bits:c.lenbits},me=s(u,c.lens,0,c.nlen,c.lencode,0,c.work,ge),c.lenbits=ge.bits,me){A.msg="invalid literal/lengths set",c.mode=k;break}if(c.distbits=6,c.distcode=c.distdyn,ge={bits:c.distbits},me=s(m,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,ge),c.distbits=ge.bits,me){A.msg="invalid distances set",c.mode=k;break}if(c.mode=pe,v===p)break e;case pe:c.mode=le;case le:if(P>=6&&j>=258){A.next_out=de,A.avail_out=j,A.next_in=T,A.avail_in=P,c.hold=B,c.bits=E,o(A,H),de=A.next_out,W=A.output,j=A.avail_out,T=A.next_in,I=A.input,P=A.avail_in,B=c.hold,E=c.bits,c.mode===Z&&(c.back=-1);break}for(c.back=0;J=c.lencode[B&(1<<c.lenbits)-1],z=J>>>24,te=J>>>16&255,ce=J&65535,!(z<=E);){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(te&&(te&240)===0){for(se=z,Xe=te,Qe=ce;J=c.lencode[Qe+((B&(1<<se+Xe)-1)>>se)],z=J>>>24,te=J>>>16&255,ce=J&65535,!(se+z<=E);){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}B>>>=se,E-=se,c.back+=se}if(B>>>=z,E-=z,c.back+=z,c.length=ce,te===0){c.mode=Se;break}if(te&32){c.back=-1,c.mode=Z;break}if(te&64){A.msg="invalid literal/length code",c.mode=k;break}c.extra=te&15,c.mode=Ie;case Ie:if(c.extra){for(he=c.extra;E<he;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.length+=B&(1<<c.extra)-1,B>>>=c.extra,E-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=Le;case Le:for(;J=c.distcode[B&(1<<c.distbits)-1],z=J>>>24,te=J>>>16&255,ce=J&65535,!(z<=E);){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if((te&240)===0){for(se=z,Xe=te,Qe=ce;J=c.distcode[Qe+((B&(1<<se+Xe)-1)>>se)],z=J>>>24,te=J>>>16&255,ce=J&65535,!(se+z<=E);){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}B>>>=se,E-=se,c.back+=se}if(B>>>=z,E-=z,c.back+=z,te&64){A.msg="invalid distance code",c.mode=k;break}c.offset=ce,c.extra=te&15,c.mode=He;case He:if(c.extra){for(he=c.extra;E<he;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}c.offset+=B&(1<<c.extra)-1,B>>>=c.extra,E-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){A.msg="invalid distance too far back",c.mode=k;break}c.mode=Ke;case Ke:if(j===0)break e;if(L=H-j,c.offset>L){if(L=c.offset-L,L>c.whave&&c.sane){A.msg="invalid distance too far back",c.mode=k;break}L>c.wnext?(L-=c.wnext,je=c.wsize-L):je=c.wnext-L,L>c.length&&(L=c.length),Ut=c.window}else Ut=W,je=de-c.offset,L=c.length;L>j&&(L=j),j-=L,c.length-=L;do W[de++]=Ut[je++];while(--L);c.length===0&&(c.mode=le);break;case Se:if(j===0)break e;W[de++]=c.length,j--,c.mode=le;break;case Te:if(c.wrap){for(;E<32;){if(P===0)break e;P--,B|=I[T++]<<E,E+=8}if(H-=j,A.total_out+=H,c.total+=H,H&&(A.adler=c.check=c.flags?n(c.check,W,H,de-H):a(c.check,W,H,de-H)),H=j,(c.flags?B:tr(B))!==c.check){A.msg="incorrect data check",c.mode=k;break}B=0,E=0}c.mode=qt;case qt:if(c.wrap&&c.flags){for(;E<32;){if(P===0)break e;P--,B+=I[T++]<<E,E+=8}if(B!==(c.total&4294967295)){A.msg="incorrect length check",c.mode=k;break}B=0,E=0}c.mode=$t;case $t:me=f;break e;case k:me=D;break e;case er:return _;case jr:default:return y}return A.next_out=de,A.avail_out=j,A.next_in=T,A.avail_in=P,c.hold=B,c.bits=E,(c.wsize||H!==A.avail_out&&c.mode<k&&(c.mode<Te||v!==d))&&sr(A,A.output,A.next_out,H-A.avail_out),Ye-=A.avail_in,H-=A.avail_out,A.total_in+=Ye,A.total_out+=H,c.total+=H,c.wrap&&H&&(A.adler=c.check=c.flags?n(c.check,W,H,A.next_out-H):a(c.check,W,H,A.next_out-H)),A.data_type=c.bits+(c.last?64:0)+(c.mode===Z?128:0)+(c.mode===pe||c.mode===xe?256:0),(Ye===0&&H===0||v===d)&&me===C&&(me=x),me}function ai(A){if(!A||!A.state)return y;var v=A.state;return v.window&&(v.window=null),A.state=null,C}function ni(A,v){var c;return!A||!A.state||(c=A.state,(c.wrap&2)===0)?y:(c.head=v,v.done=!1,C)}function oi(A,v){var c=v.length,I,W,T;return!A||!A.state||(I=A.state,I.wrap!==0&&I.mode!==b)?y:I.mode===b&&(W=1,W=a(W,v,c,0),W!==I.check)?D:(T=sr(A,v,c,c),T?(I.mode=er,_):(I.havedict=1,C))}t.inflateReset=ir,t.inflateReset2=ar,t.inflateResetKeep=rr,t.inflateInit=ti,t.inflateInit2=nr,t.inflate=ii,t.inflateEnd=ai,t.inflateGetHeader=ni,t.inflateSetDictionary=oi,t.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":1,"./adler32":3,"./crc32":5,"./inffast":7,"./inftrees":9}],9:[function(i,e,t){var r=i("../utils/common"),a=15,n=852,o=592,s=0,l=1,u=2,m=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],d=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],h=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],p=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];e.exports=function(f,g,y,D,_,x,F,G){var q=G.bits,R=0,S=0,M=0,w=0,V=0,N=0,O=0,K=0,b=0,Z=0,ue,_e,xe,Ge,ye,De=null,We=0,pe,le=new r.Buf16(a+1),Ie=new r.Buf16(a+1),Le=null,He=0,Ke,Se,Te;for(R=0;R<=a;R++)le[R]=0;for(S=0;S<D;S++)le[g[y+S]]++;for(V=q,w=a;w>=1&&le[w]===0;w--);if(V>w&&(V=w),w===0)return _[x++]=1<<24|64<<16|0,_[x++]=1<<24|64<<16|0,G.bits=1,0;for(M=1;M<w&&le[M]===0;M++);for(V<M&&(V=M),K=1,R=1;R<=a;R++)if(K<<=1,K-=le[R],K<0)return-1;if(K>0&&(f===s||w!==1))return-1;for(Ie[1]=0,R=1;R<a;R++)Ie[R+1]=Ie[R]+le[R];for(S=0;S<D;S++)g[y+S]!==0&&(F[Ie[g[y+S]]++]=S);if(f===s?(De=Le=F,pe=19):f===l?(De=m,We-=257,Le=d,He-=257,pe=256):(De=h,Le=p,pe=-1),Z=0,S=0,R=M,ye=x,N=V,O=0,xe=-1,b=1<<V,Ge=b-1,f===l&&b>n||f===u&&b>o)return 1;for(;;){Ke=R-O,F[S]<pe?(Se=0,Te=F[S]):F[S]>pe?(Se=Le[He+F[S]],Te=De[We+F[S]]):(Se=96,Te=0),ue=1<<R-O,_e=1<<N,M=_e;do _e-=ue,_[ye+(Z>>O)+_e]=Ke<<24|Se<<16|Te|0;while(_e!==0);for(ue=1<<R-1;Z&ue;)ue>>=1;if(ue!==0?(Z&=ue-1,Z+=ue):Z=0,S++,--le[R]===0){if(R===w)break;R=g[y+F[S]]}if(R>V&&(Z&Ge)!==xe){for(O===0&&(O=V),ye+=M,N=R-O,K=1<<N;N+O<w&&(K-=le[N+O],!(K<=0));)N++,K<<=1;if(b+=1<<N,f===l&&b>n||f===u&&b>o)return 1;xe=Z&Ge,_[xe]=V<<24|N<<16|ye-x|0}}return Z!==0&&(_[ye+Z]=R-O<<24|64<<16|0),G.bits=V,0}},{"../utils/common":1}],10:[function(i,e,t){e.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],11:[function(i,e,t){function r(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}e.exports=r},{}],"/lib/inflate.js":[function(i,e,t){var r=i("./zlib/inflate"),a=i("./utils/common"),n=i("./utils/strings"),o=i("./zlib/constants"),s=i("./zlib/messages"),l=i("./zlib/zstream"),u=i("./zlib/gzheader"),m=Object.prototype.toString;function d(C){if(!(this instanceof d))return new d(C);this.options=a.assign({chunkSize:16384,windowBits:0,to:""},C||{});var f=this.options;f.raw&&f.windowBits>=0&&f.windowBits<16&&(f.windowBits=-f.windowBits,f.windowBits===0&&(f.windowBits=-15)),f.windowBits>=0&&f.windowBits<16&&!(C&&C.windowBits)&&(f.windowBits+=32),f.windowBits>15&&f.windowBits<48&&(f.windowBits&15)===0&&(f.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new l,this.strm.avail_out=0;var g=r.inflateInit2(this.strm,f.windowBits);if(g!==o.Z_OK)throw new Error(s[g]);this.header=new u,r.inflateGetHeader(this.strm,this.header)}d.prototype.push=function(C,f){var g=this.strm,y=this.options.chunkSize,D=this.options.dictionary,_,x,F,G,q,R,S=!1;if(this.ended)return!1;x=f===~~f?f:f===!0?o.Z_FINISH:o.Z_NO_FLUSH,typeof C=="string"?g.input=n.binstring2buf(C):m.call(C)==="[object ArrayBuffer]"?g.input=new Uint8Array(C):g.input=C,g.next_in=0,g.avail_in=g.input.length;do{if(g.avail_out===0&&(g.output=new a.Buf8(y),g.next_out=0,g.avail_out=y),_=r.inflate(g,o.Z_NO_FLUSH),_===o.Z_NEED_DICT&&D&&(typeof D=="string"?R=n.string2buf(D):m.call(D)==="[object ArrayBuffer]"?R=new Uint8Array(D):R=D,_=r.inflateSetDictionary(this.strm,R)),_===o.Z_BUF_ERROR&&S===!0&&(_=o.Z_OK,S=!1),_!==o.Z_STREAM_END&&_!==o.Z_OK)return this.onEnd(_),this.ended=!0,!1;g.next_out&&(g.avail_out===0||_===o.Z_STREAM_END||g.avail_in===0&&(x===o.Z_FINISH||x===o.Z_SYNC_FLUSH))&&(this.options.to==="string"?(F=n.utf8border(g.output,g.next_out),G=g.next_out-F,q=n.buf2string(g.output,F),g.next_out=G,g.avail_out=y-G,G&&a.arraySet(g.output,g.output,F,G,0),this.onData(q)):this.onData(a.shrinkBuf(g.output,g.next_out))),g.avail_in===0&&g.avail_out===0&&(S=!0)}while((g.avail_in>0||g.avail_out===0)&&_!==o.Z_STREAM_END);return _===o.Z_STREAM_END&&(x=o.Z_FINISH),x===o.Z_FINISH?(_=r.inflateEnd(this.strm),this.onEnd(_),this.ended=!0,_===o.Z_OK):(x===o.Z_SYNC_FLUSH&&(this.onEnd(o.Z_OK),g.avail_out=0),!0)},d.prototype.onData=function(C){this.chunks.push(C)},d.prototype.onEnd=function(C){C===o.Z_OK&&(this.options.to==="string"?this.result=this.chunks.join(""):this.result=a.flattenChunks(this.chunks)),this.chunks=[],this.err=C,this.msg=this.strm.msg};function h(C,f){var g=new d(f);if(g.push(C,!0),g.err)throw g.msg||s[g.err];return g.result}function p(C,f){return f=f||{},f.raw=!0,h(C,f)}t.Inflate=d,t.inflate=h,t.inflateRaw=p,t.ungzip=h},{"./utils/common":1,"./utils/strings":2,"./zlib/constants":4,"./zlib/gzheader":6,"./zlib/inflate":8,"./zlib/messages":10,"./zlib/zstream":11}]},{},[])("/lib/inflate.js")});const la=Ir;//! Use DXT1 compression.
var rt=1;//! Use DXT3 compression.
var Ar=2;//! Use DXT5 compression.
var Zt=4,gr=32;function Er(i,e,t,r){var a=i|e<<8,n=a>>11&31,o=a>>5&63,s=a&31;return t[r+0]=n<<3|n>>2,t[r+1]=o<<2|o>>4,t[r+2]=s<<3|s>>2,t[r+3]=255,a}function ca(i,e,t,r){for(var a=new Uint8Array(16),n=Er(e[t+0],e[t+1],a,0),o=Er(e[t+2],e[t+3],a,4),s=0;s<3;s++){var l=a[s],u=a[4+s];r&&n<=o?(a[8+s]=(l+u)/2,a[12+s]=0):(a[8+s]=(2*l+u)/3,a[12+s]=(l+2*u)/3)}a[11]=255,a[15]=r&&n<=o?0:255;for(var m=new Uint8Array(16),s=0;s<4;++s){var d=e[t+4+s];m[4*s+0]=d&3,m[4*s+1]=d>>2&3,m[4*s+2]=d>>4&3,m[4*s+3]=d>>6&3}for(var s=0;s<16;++s)for(var h=4*m[s],p=0;p<4;++p)i[4*s+p]=a[h+p]}function ua(i,e,t){for(var r=0;r<8;++r){var a=bytes[t+r],n=a&15,o=a&240;i[8*r+3]=n|n<<4,i[8*r+7]=o|o>>4}}function da(i,e,l){var r=e[l+0],a=e[l+1],n=new Uint8Array(8);if(n[0]=r,n[1]=a,r<=a){for(var o=1;o<5;++o)n[1+o]=((5-o)*r+o*a)/5;n[6]=0,n[7]=255}else for(var o=1;o<7;++o)n[1+o]=((7-o)*r+o*a)/7;for(var s=new Uint8Array(16),l=l+2,u=0,o=0;o<2;++o){for(var m=0,d=0;d<3;++d){var h=e[l++];m|=h<<8*d}for(var d=0;d<8;++d){var p=m>>3*d&7;s[u++]=p}}for(var o=0;o<16;++o)i[4*o+3]=n[s[o]]}function ma(i,e,t,r){var a=0;(r&(Ar|Zt))!=0&&(a=8),ca(i,e,t+a,(r&rt)!=0),(r&Ar)!=0?ua(i,e,t):(r&Zt)!=0&&da(i,e,t)}function Ca(i,e,t,r){for(var a=new Uint16Array(4),n=i,o=0,s=0,l=0,u=0,m=0,d=0,h=0,p=0,C=0,f=e/4,g=t/4,y=0;y<g;y++)for(var D=0;D<f;D++)l=4*((g-y)*f+D),a[0]=r[l],a[1]=r[l+1],u=a[0]&31,m=a[0]&2016,d=a[0]&63488,h=a[1]&31,p=a[1]&2016,C=a[1]&63488,a[2]=5*u+3*h>>3|5*m+3*p>>3&2016|5*d+3*C>>3&63488,a[3]=5*h+3*u>>3|5*p+3*m>>3&2016|5*C+3*d>>3&63488,o=r[l+2],s=y*4*e+D*4,n[s]=a[o&3],n[s+1]=a[o>>2&3],n[s+2]=a[o>>4&3],n[s+3]=a[o>>6&3],s+=e,n[s]=a[o>>8&3],n[s+1]=a[o>>10&3],n[s+2]=a[o>>12&3],n[s+3]=a[o>>14],o=r[l+3],s+=e,n[s]=a[o&3],n[s+1]=a[o>>2&3],n[s+2]=a[o>>4&3],n[s+3]=a[o>>6&3],s+=e,n[s]=a[o>>8&3],n[s+1]=a[o>>10&3],n[s+2]=a[o>>12&3],n[s+3]=a[o>>14];return n}/*! @brief Decompresses an image in memory.

 @param rgba		Storage for the decompressed pixels.
 @param width	The width of the source image.
 @param height	The height of the source image.
 @param blocks	The compressed DXT blocks.
 @param flags	Compression flags.

 The decompressed pixels will be written as a contiguous array of width*height
 16 rgba values, with each component as 1 byte each. In memory this is:

 { r1, g1, b1, a1, .... , rn, gn, bn, an } for n = width*height

 The flags parameter should specify either kDxt1, kDxt3 or kDxt5 compression,
 however, DXT1 will be used by default if none is specified. All other flags
 are ignored.

 Internally this function calls squish::Decompress for each block.
 */function pa(i,e,t,r,a){for(var n=(a&rt)!=0?8:16,o=0,s=0;s<t;s+=4)for(var l=0;l<e;l+=4){var u=new Uint8Array(64);ma(u,r,o,a);for(var m=0,d=0;d<4;++d)for(var h=0;h<4;++h){var p=l+h,C=s+d;if(p<e&&C<t)for(var f=4*(e*(t-C)+p),g=0;g<4;++g)i[f++]=u[m++];else m+=4}o+=n}}function Lr(i){}Lr.decode=function(i,e,t,r,a){if(!(i==null||r==null||t==0||e==0)){var n=0;a>11||a===5?n=Zt:n=rt|gr,n&rt&&n&gr?Ca(i,e,t,r):pa(i,e,t,r,n)}};var Sr=function(){var i="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",e="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",t=new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,3,2,0,0,5,3,1,0,1,12,1,0,10,22,2,12,0,65,0,65,0,65,0,252,10,0,0,11,7,0,65,0,253,15,26,11]),r=new Uint8Array([32,0,65,2,1,106,34,33,3,128,11,4,13,64,6,253,10,7,15,116,127,5,8,12,40,16,19,54,20,9,27,255,113,17,42,67,24,23,146,148,18,14,22,45,70,69,56,114,101,21,25,63,75,136,108,28,118,29,73,115]);if(typeof WebAssembly!="object")return{supported:!1};var a=i;WebAssembly.validate(t)&&(a=e);var n,o=WebAssembly.instantiate(s(a),{}).then(function(d){n=d.instance,n.exports.__wasm_call_ctors()});function s(d){for(var h=new Uint8Array(d.length),p=0;p<d.length;++p){var C=d.charCodeAt(p);h[p]=C>96?C-71:C>64?C-65:C>47?C+4:C>46?63:62}for(var f=0,p=0;p<d.length;++p)h[f++]=h[p]<60?r[h[p]]:(h[p]-60)*64+h[++p];return h.buffer.slice(0,f)}function l(d,h,p,C,f,g){var y=n.exports.sbrk,D=p+3&-4,_=y(D*C),x=y(f.length),F=new Uint8Array(n.exports.memory.buffer);F.set(f,x);var G=d(_,p,C,x,f.length);if(G==0&&g&&g(_,D,C),h.set(F.subarray(_,_+p*C)),y(_-y(0)),G!=0)throw new Error("Malformed buffer data: "+G)}var u={0:"",1:"meshopt_decodeFilterOct",2:"meshopt_decodeFilterQuat",3:"meshopt_decodeFilterExp",NONE:"",OCTAHEDRAL:"meshopt_decodeFilterOct",QUATERNION:"meshopt_decodeFilterQuat",EXPONENTIAL:"meshopt_decodeFilterExp"},m={0:"meshopt_decodeVertexBuffer",1:"meshopt_decodeIndexBuffer",2:"meshopt_decodeIndexSequence",ATTRIBUTES:"meshopt_decodeVertexBuffer",TRIANGLES:"meshopt_decodeIndexBuffer",INDICES:"meshopt_decodeIndexSequence"};return{ready:o,supported:!0,decodeVertexBuffer:function(d,h,p,C,f){l(n.exports.meshopt_decodeVertexBuffer,d,h,p,C,n.exports[u[f]])},decodeIndexBuffer:function(d,h,p,C){l(n.exports.meshopt_decodeIndexBuffer,d,h,p,C)},decodeIndexSequence:function(d,h,p,C){l(n.exports.meshopt_decodeIndexSequence,d,h,p,C)},decodeGltfBuffer:function(d,h,p,C,f,g){l(n.exports[m[f]],d,h,p,C,n.exports[u[g]])}}}();function Be(){}Be.s3tc=!0;Be.pvrtc=!1;Be.etc1=!1;const we={SV_Standard:1,SV_Compressed:2,SV_DracoCompressed:3},Vt={Standard:0,Draco:1,MeshOpt:2},ha={0:Uint32Array.BYTES_PER_ELEMENT,1:Float32Array.BYTES_PER_ELEMENT,2:Float64Array.BYTES_PER_ELEMENT},et={RGB:10,BGR:11},Me={SVC_Vertex:1,SVC_Normal:2,SVC_TexutreCoord:16,SVC_TexutreCoordIsW:32},X={Position:1,Normal:4,FirstTexcoord:16,SecondTexcoord:32,Color:64,SecondColor:128,Custom0:512,Custom1:1024};function fa(i,e){let t=new Uint8Array(i,e);return la.inflate(t).buffer}function wr(i,r,a){var r=0,a=i.byteLength,n="utf-8";i=i.subarray(r,r+a);var o=new TextDecoder(n);return o.decode(i)}function Ae(i,e,t){let r=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let a=new Uint8Array(i,t,r),n=wr(a);return t+=r,{string:n,bytesOffset:t,length:r}}function Aa(i,e,t,r){let a={},n=[],o=new Array(16);for(let l=0;l<16;l++)o[l]=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;a.matrix=o,a.skeletonNames=n;let s=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let l=0;l<s;l++){let u=Ae(i,e,t);n.push(u.string),t=u.bytesOffset}return r.push(a),t}function ga(i,e,t,r,a){let n={};n.rangeList=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,n.rangeMode=e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;let o={};o.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,o.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,o.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;let s=e.getFloat64(t,!0);if(t+=Float64Array.BYTES_PER_ELEMENT,n.boundingSphere={center:o,radius:s},a===3){const h={};h.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,h.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,h.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;const p={};p.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,p.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,p.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;const C={};C.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,C.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,C.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;const f={};f.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,f.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,f.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,n.obb={xExtent:p,yExtent:C,zExtent:f,obbCenter:h}}let l=Ae(i,e,t),u=l.string;t=l.bytesOffset;let m=u.indexOf("Geometry");if(m!==-1){let h=u.substring(m);u=u.replace(h,"")}n.childTile=u,n.geodes=[];let d=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let h=0;h<d;h++)t=Aa(i,e,t,n.geodes);return r.push(n),a===3&&(t=Ae(i,e,t).bytesOffset),t}function Ea(i,e,t,r){let a={},n=[];e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT;let o=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let l=0;l<o;l++)t=ga(i,e,t,n,r.version);a.pageLods=n;let s=t%4;return s!==0&&(t+=4-s),r.groupNode=a,t}function Fr(i,e,t,r){let a=e.getUint32(t,!0);if(r.verticesCount=a,t+=Uint32Array.BYTES_PER_ELEMENT,t<=0)return t;let n=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;let o=e.getUint16(t,!0);o=n*Float32Array.BYTES_PER_ELEMENT,t+=Uint16Array.BYTES_PER_ELEMENT;let s=a*n*Float32Array.BYTES_PER_ELEMENT,l=new Uint8Array(i,t,s);t+=s;let u=r.vertexAttributes,m=r.attrLocation;return m.aPosition=u.length,u.push({index:m.aPosition,typedArray:l,componentsPerAttribute:n,componentDatatype:5126,offsetInBytes:0,strideInBytes:o,normalize:!1}),t}function Rr(i,e,t,r){let a=e.getUint32(t,!0);if(t+=Uint32Array.BYTES_PER_ELEMENT,a<=0)return t;let n=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;let o=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;let s=a*n*Float32Array.BYTES_PER_ELEMENT,l=new Uint8Array(i,t,s);t+=s;let u=r.vertexAttributes,m=r.attrLocation;return m.aNormal=u.length,u.push({index:m.aNormal,typedArray:l,componentsPerAttribute:n,componentDatatype:5126,offsetInBytes:0,strideInBytes:o,normalize:!1}),t}function br(i,e,t,r){let a=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let n=r.verticesCount,o;if(a>0){e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT,t+=Uint8Array.BYTES_PER_ELEMENT*2;let u=a*Uint8Array.BYTES_PER_ELEMENT*4;o=new Uint8Array(i,t,u).slice(0,u),t+=u}else{o=new Uint8Array(4*n);for(let u=0;u<n;u++)o[u*4]=255,o[u*4+1]=255,o[u*4+2]=255,o[u*4+3]=255}let s=r.vertexAttributes,l=r.attrLocation;return l.aColor=s.length,s.push({index:l.aColor,typedArray:o,componentsPerAttribute:4,componentDatatype:5121,offsetInBytes:0,strideInBytes:4,normalize:!0}),r.vertexColor=o,t}function Nr(i,e,t,r){let a=e.getUint32(t,!0);if(t+=Uint32Array.BYTES_PER_ELEMENT,a<=0)return t;e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT,t+=Uint8Array.BYTES_PER_ELEMENT*2;let n=a*Uint8Array.BYTES_PER_ELEMENT*4,o=new Uint8Array(i,t,n);t+=n;let s=r.vertexAttributes,l=r.attrLocation;return l.aSecondColor=s.length,s.push({index:l.aSecondColor,typedArray:o,componentsPerAttribute:4,componentDatatype:5121,offsetInBytes:0,strideInBytes:4,normalize:!0}),t}function Gr(i,e,t,r){let a=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,t+=Uint16Array.BYTES_PER_ELEMENT;for(let n=0;n<a;n++){let o=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let s=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;let l=o*s*Float32Array.BYTES_PER_ELEMENT,u=new Uint8Array(i,t,l);t+=l;let m="aTexCoord"+n,d=r.vertexAttributes,h=r.attrLocation;h[m]=d.length,d.push({index:h[m],typedArray:u,componentsPerAttribute:s,componentDatatype:5126,offsetInBytes:0,strideInBytes:s*Float32Array.BYTES_PER_ELEMENT,normalize:!1})}return t}function zr(i,e,t,r){let a=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,t+=Uint16Array.BYTES_PER_ELEMENT;let n=r.vertexAttributes,o=r.attrLocation;for(let s=0;s<a;s++){let l=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let u=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;let m=l*u*Float32Array.BYTES_PER_ELEMENT;if(u===17||u===29){let d=new Uint8Array(i,t,m);r.instanceCount=l,r.instanceMode=u,r.instanceBuffer=d,r.instanceIndex=1;let h=u*l*4,p=d.slice(0,h);r.vertexColorInstance=p;let C;u===17?(C=Float32Array.BYTES_PER_ELEMENT*17,o.uv2=n.length,n.push({index:o.uv2,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:0,strideInBytes:C,instanceDivisor:1}),o.uv3=n.length,n.push({index:o.uv3,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:4*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv4=n.length,n.push({index:o.uv4,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:8*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.secondary_colour=n.length,n.push({index:o.secondary_colour,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:12*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv6=n.length,n.push({index:o.uv6,componentsPerAttribute:4,componentDatatype:5121,normalize:!0,offsetInBytes:16*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1})):u===29&&(C=Float32Array.BYTES_PER_ELEMENT*29,o.uv1=n.length,n.push({index:o.uv1,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:0,strideInBytes:C,instanceDivisor:1,byteLength:m}),o.uv2=n.length,n.push({index:o.uv2,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:4*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv3=n.length,n.push({index:o.uv3,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:8*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv4=n.length,n.push({index:o.uv4,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:12*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv5=n.length,n.push({index:o.uv5,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:16*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv6=n.length,n.push({index:o.uv6,componentsPerAttribute:4,componentDatatype:5126,normalize:!1,offsetInBytes:20*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv7=n.length,n.push({index:o.uv7,componentsPerAttribute:3,componentDatatype:5126,normalize:!1,offsetInBytes:24*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.secondary_colour=n.length,n.push({index:o.secondary_colour,componentsPerAttribute:4,componentDatatype:5121,normalize:!0,offsetInBytes:27*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}),o.uv9=n.length,n.push({index:o.uv9,componentsPerAttribute:4,componentDatatype:5121,normalize:!0,offsetInBytes:28*Float32Array.BYTES_PER_ELEMENT,strideInBytes:C,instanceDivisor:1}))}else{let d=l*u;r.instanceBounds=new Float32Array(d);for(let h=0;h<d;h++)r.instanceBounds[h]=e.getFloat32(t+h*Float32Array.BYTES_PER_ELEMENT,!0)}t+=m}return t}function Ba(i,e,t,r){const a=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let n=0;n<a;n++){const o=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;const s=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;const l=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;const u=o*s*ha[l],m=new Uint8Array(i,t,u);t+=u;const d=r.vertexAttributes,h=r.attrLocation,p="aCustom"+n;h[p]=d.length,d.push({index:h[p],typedArray:m,componentsPerAttribute:s,componentDatatype:5126,offsetInBytes:0,strideInBytes:0,normalize:!1})}return t}function _a(i,e,t,r){let a=e.getUint32(t,!0);if(r.verticesCount=a,t+=Uint32Array.BYTES_PER_ELEMENT,t<=0)return t;let n=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;let o=e.getUint16(t,!0);o=n*Int16Array.BYTES_PER_ELEMENT,t+=Uint16Array.BYTES_PER_ELEMENT;let s=e.getFloat32(t,!0);t+=Float32Array.BYTES_PER_ELEMENT;let l={};l.x=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,l.y=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,l.z=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,l.w=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,r.vertCompressConstant=s,r.minVerticesValue=l;let u=a*n*Int16Array.BYTES_PER_ELEMENT,m=new Uint8Array(i,t,u);t+=u;let d=r.vertexAttributes,h=r.attrLocation;return h.aPosition=d.length,d.push({index:h.aPosition,typedArray:m,componentsPerAttribute:n,componentDatatype:5122,offsetInBytes:0,strideInBytes:o,normalize:!1}),t}function xa(i,e,t,r){let a=e.getUint32(t,!0);if(t+=Uint32Array.BYTES_PER_ELEMENT,a<=0)return t;e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;let n=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT;let o=a*2*Int16Array.BYTES_PER_ELEMENT,s=new Uint8Array(i,t,o);t+=o;let l=r.vertexAttributes,u=r.attrLocation;return u.aNormal=l.length,l.push({index:u.aNormal,typedArray:s,componentsPerAttribute:2,componentDatatype:5122,offsetInBytes:0,strideInBytes:n,normalize:!1}),t}function ya(i,e,t,r){r.texCoordCompressConstant=[],r.minTexCoordValue=[];let a=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,t+=Uint16Array.BYTES_PER_ELEMENT;for(let n=0;n<a;n++){let o=e.getUint8(t,!0);t+=Uint8Array.BYTES_PER_ELEMENT,t+=Uint8Array.BYTES_PER_ELEMENT*3;let s=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let l=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;let u=e.getFloat32(t,!0);t+=Float32Array.BYTES_PER_ELEMENT,r.texCoordCompressConstant.push(u);let m={};m.x=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,m.y=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,m.z=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,m.w=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,r.minTexCoordValue.push(m);let d=s*l*Int16Array.BYTES_PER_ELEMENT,h=new Uint8Array(i,t,d);t+=d;let p=t%4;p!==0&&(t+=4-p);let C="aTexCoord"+n,f=r.vertexAttributes,g=r.attrLocation;if(g[C]=f.length,f.push({index:g[C],typedArray:h,componentsPerAttribute:l,componentDatatype:5122,offsetInBytes:0,strideInBytes:l*Int16Array.BYTES_PER_ELEMENT,normalize:!1}),o){d=s*Float32Array.BYTES_PER_ELEMENT;let y=new Uint8Array(i,t,d);t+=d,r.texCoordZMatrix=!0,C="aTexCoordZ"+n,g[C]=f.length,f.push({index:g[C],typedArray:y,componentsPerAttribute:1,componentDatatype:5126,offsetInBytes:0,strideInBytes:Float32Array.BYTES_PER_ELEMENT,normalize:!1})}}return t}function Ta(i,e,t,r){const a=e.getUint32(t,!0);if(t+=Uint32Array.BYTES_PER_ELEMENT,a<=0)return t;const n=e.getUint16(t,!0);t+=Uint16Array.BYTES_PER_ELEMENT,e.getUint16(t,!0),t+=Uint16Array.BYTES_PER_ELEMENT;const o=a*n*Float32Array.BYTES_PER_ELEMENT;return t+=o,t}function va(i,e,t,r,a){if(a===3&&(e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT),t=Fr(i,e,t,r),t=Rr(i,e,t,r),t=br(i,e,t,r),a!==3&&(t=Nr(i,e,t,r)),t=Gr(i,e,t,r),t=zr(i,e,t,r),a===3){t=Ba(i,e,t,r);const n=Ae(i,e,t);t=n.bytesOffset,r.customVertexAttribute=JSON.parse(n.string);const o="aCustom"+r.customVertexAttribute.TextureCoordMatrix,s="aCustom"+r.customVertexAttribute.VertexWeight;r.attrLocation[o]!==void 0&&(r.attrLocation.aTextureCoordMatrix=r.attrLocation[o],delete r.attrLocation[o]),r.attrLocation[s]!==void 0&&(r.attrLocation.aVertexWeight=r.attrLocation[s],delete r.attrLocation[s]);let l=t%4;l&&(l=4-l),t+=l,t=Ta(i,e,t)}return t}function Ma(i,e,t,r,a,n){let o=0,s;const l=a.vertexAttributes,u=a.attrLocation;switch(e){case X.Normal:case X.FirstTexcoord:case X.SecondTexcoord:o=Uint16Array.BYTES_PER_ELEMENT*2,(n&16)===0&&(e===X.FirstTexcoord||e===X.SecondTexcoord)&&(o=Float32Array.BYTES_PER_ELEMENT*2),s=new Uint8Array(i*o);break;case X.Color:case X.SecondColor:o=Uint8Array.BYTES_PER_ELEMENT*4,s=new Uint8Array(i*4);break;case X.Custom0:o=Float32Array.BYTES_PER_ELEMENT*t,s=new Uint8Array(i*t*4);break;case X.Custom1:o=Float32Array.BYTES_PER_ELEMENT*t,s=new Uint8Array(i*t*4);break;default:o=Uint16Array.BYTES_PER_ELEMENT*4,s=new Uint8Array(i*o);break}Sr.decodeVertexBuffer(s,i,o,r,r.length);let m,d;switch(e){case X.Position:u.aPosition=l.length,l.push({index:u.aPosition,typedArray:new Uint16Array(s.buffer,0,s.length/2),componentsPerAttribute:4,componentDatatype:5122,offsetInBytes:0,strideInBytes:0,normalize:!1}),a.verticesCount=i;break;case X.Normal:u.aNormal=l.length,l.push({index:u.aNormal,typedArray:new Int16Array(s.buffer,0,s.length/2),componentsPerAttribute:2,componentDatatype:5122,offsetInBytes:0,strideInBytes:0,normalize:!1});break;case X.FirstTexcoord:(n&16)===0?(d=5126,m=new Float32Array(s.buffer,0,s.length/4)):(d=5122,m=new Uint16Array(s.buffer,0,s.length/2)),u.aTexCoord0=l.length,l.push({index:u.aTexCoord0,typedArray:m,componentsPerAttribute:2,componentDatatype:d,offsetInBytes:0,strideInBytes:0,normalize:!1});break;case X.SecondTexcoord:(n&16)===0?(d=5126,m=new Float32Array(s.buffer,0,s.length/4)):(d=5122,m=new Uint16Array(s.buffer,0,s.length/2)),u.aTexCoord1=l.length,l.push({index:u.aTexCoord1,typedArray:m,componentsPerAttribute:2,componentDatatype:d,offsetInBytes:0,strideInBytes:0,normalize:!1});break;case X.Color:u.aColor=l.length,l.push({index:u.aColor,typedArray:s,componentsPerAttribute:4,componentDatatype:5121,offsetInBytes:0,strideInBytes:0,normalize:!0});break;case X.SecondColor:u.aSecondColor=l.length,l.push({index:u.aSecondColor,typedArray:s,componentsPerAttribute:4,componentDatatype:5120,offsetInBytes:0,strideInBytes:0,normalize:!1});break;case X.Custom0:u.aCustom0=l.length,l.push({index:u.aCustom0,typedArray:new Float32Array(s.buffer,0,s.length/4),componentsPerAttribute:t,componentDatatype:5126,offsetInBytes:0,strideInBytes:0,normalize:!1});break;case X.Custom1:u.aCustom1=l.length,l.push({index:u.aCustom1,typedArray:new Float32Array(s.buffer,0,s.length/4),componentsPerAttribute:t,componentDatatype:5126,offsetInBytes:0,strideInBytes:0,normalize:!1});break}}function Pa(i,e,t,r,a){const n=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT,r.compressOptions=n;const o=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT,r.minVerticesValue={x:0,y:0,z:0,w:0},r.minTexCoordValue=[{x:0,y:0},{x:0,y:0}],r.texCoordCompressConstant=[{x:0,y:0,z:0},{x:0,y:0,z:0}];for(let s=0;s<o;s++){const l=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT,r.vertCompressConstant=e.getFloat32(t,!0),t+=Float32Array.BYTES_PER_ELEMENT,r.minVerticesValue.x=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,r.minVerticesValue.y=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,r.minVerticesValue.z=e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT;const u=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const m=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const d=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const h=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const p=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const C=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const f=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT;const g=e.getFloat64(t,!0);t+=Float64Array.BYTES_PER_ELEMENT,r.minTexCoordValue[0].x=d,r.minTexCoordValue[0].y=h,r.minTexCoordValue[1].x=f,r.minTexCoordValue[1].y=g,r.texCoordCompressConstant[0].x=u,r.texCoordCompressConstant[0].y=m,r.texCoordCompressConstant[1].x=p,r.texCoordCompressConstant[1].y=C;const y=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT;for(let G=0;G<y;G++){const q=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT;let R=0;(q===X.Custom0||q===X.Custom1)&&(R=e.getInt32(t,!0),t+=Int32Array.BYTES_PER_ELEMENT);const S=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT;const M=new Uint8Array(i,t,S);t+=Uint8Array.BYTES_PER_ELEMENT*S;let w=t%4;w&&(w=4-w),t+=w,Ma(l,q,R,M,r,n)}let D=Ae(i,e,t);t=D.bytesOffset,r.customVertexAttribute=JSON.parse(D.string);let _="aCustom"+r.customVertexAttribute.TextureCoordMatrix,x="aCustom"+r.customVertexAttribute.VertexWeight;r.attrLocation[_]!==void 0&&(r.attrLocation.aTextureCoordMatrix=r.attrLocation[_],s===o-1&&delete r.attrLocation[_]),r.attrLocation[x]!==void 0&&(r.attrLocation.aVertexWeight=r.attrLocation[x],s===o-1&&delete r.attrLocation[x]);let F=t%4;F&&(F=4-F),t+=F}return t}function Da(i,e,t,r,a){const n=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT;for(let o=0;o<n;o++){const s={},l=e.getInt32(t,!0);if(t+=Int32Array.BYTES_PER_ELEMENT,l<1)continue;const u=e.getInt8(t,!0);t+=Int8Array.BYTES_PER_ELEMENT,e.getInt8(t,!0),t+=Int8Array.BYTES_PER_ELEMENT;const m=e.getInt8(t,!0);t+=Int8Array.BYTES_PER_ELEMENT,e.getInt8(t,!0),t+=Int8Array.BYTES_PER_ELEMENT;const d=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT;let h;m!==13?(h=new Uint8Array(i,t,d),t+=Uint8Array.BYTES_PER_ELEMENT*d):(h=new Uint32Array(i,t,d),t+=Uint32Array.BYTES_PER_ELEMENT*d);let p=t%4;p&&(p=4-p),t+=p;let C;m!==13?(C=new Uint8Array(l*Uint32Array.BYTES_PER_ELEMENT),Sr.decodeIndexBuffer(C,l,Uint32Array.BYTES_PER_ELEMENT,h)):C=h;const f=e.getInt32(t,!0);t+=Int32Array.BYTES_PER_ELEMENT,s.indexType=u;const g=u===0?new Uint16Array(l):new Uint32Array(l);s.indicesCount=l;const y=new Uint32Array(C.buffer,C.byteOffset,C.byteLength/4);g.set(y,0),s.indicesTypedArray=g,s.primitiveType=m;for(let D=0;D<f;D++){const _=Ae(i,e,t);t=_.bytesOffset,s.materialCode=_.string}r.push(s),p=t%4,p&&(p=4-p),t+=p}return t}function Ia(i,e,t,r){let a=e.getUint32(t,!0);return r.compressOptions=a,t+=Uint32Array.BYTES_PER_ELEMENT,(a&Me.SVC_Vertex)===Me.SVC_Vertex?t=_a(i,e,t,r):t=Fr(i,e,t,r),(a&Me.SVC_Normal)===Me.SVC_Normal?t=xa(i,e,t,r):t=Rr(i,e,t,r),t=br(i,e,t,r),t=Nr(i,e,t,r),(a&Me.SVC_TexutreCoord)===Me.SVC_TexutreCoord?t=ya(i,e,t,r):t=Gr(i,e,t,r),(a&Me.SVC_TexutreCoordIsW)===Me.SVC_TexutreCoordIsW&&(r.textureCoordIsW=!0),t=zr(i,e,t,r),t}function La(i,e,t,r,a){let n=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let o=0;o<n;o++){let s={};a===3&&(e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT);let l=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let u=e.getUint8(t,!0);t+=Uint8Array.BYTES_PER_ELEMENT,e.getUint8(t,!0),t+=Uint8Array.BYTES_PER_ELEMENT;let m=e.getUint8(t,!0);if(t+=Uint8Array.BYTES_PER_ELEMENT,t+=Uint8Array.BYTES_PER_ELEMENT,l>0){let p=null,C;u===1||u===3?(C=l*Uint32Array.BYTES_PER_ELEMENT,p=new Uint8Array(i,t,C)):(C=l*Uint16Array.BYTES_PER_ELEMENT,p=new Uint8Array(i,t,C),l%2!==0&&(C+=2)),s.indicesTypedArray=p,t+=C}s.indicesCount=l,s.indexType=u,s.primitiveType=m;let d=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let p=0;p<d;p++){let C=Ae(i,e,t),f=C.string;t=C.bytesOffset,s.materialCode=f}if(t%4!==0){let p=4-t%4;t+=p}r.push(s)}return t}function Sa(i,e,t,r,a){e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT;let n=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let o=0;o<n;o++){a===3&&(e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT);let s=Ae(i,e,t),l=s.string;t=s.bytesOffset;let u=s.length%4;u!==0&&(t+=4-u);let m=e.getUint32(t,!0);if(t+=Int32Array.BYTES_PER_ELEMENT,a===3)switch(m){case Vt.Standard:m=we.SV_Standard;break;case Vt.Draco:m=we.SV_DracoCompressed;break;case Vt.MeshOpt:m=we.SV_Compressed;break}let d={vertexAttributes:[],attrLocation:{},instanceCount:0,instanceMode:0,instanceIndex:-1};m===we.SV_Standard?t=va(i,e,t,d,a):m===we.SV_Compressed&&a===3?t=Pa(i,e,t,d):m===we.SV_Compressed&&(t=Ia(i,e,t,d));let h=[];m===we.SV_Compressed&&a===3?t=Da(i,e,t,h):t=La(i,e,t,h,a);let p;h.length===2&&h[1].primitiveType===13&&h[1].indicesCount>=3&&(p=S3MEdgeProcessor.createEdgeDataByIndices(d,h[1])),r[l]={vertexPackage:d,arrIndexPackage:h,edgeGeometry:p},a===3&&(e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT,e.getFloat64(t,!0),t+=Float64Array.BYTES_PER_ELEMENT)}if(a!==3){let o=e.getUint32(t,!0);t+=o,t+=Uint32Array.BYTES_PER_ELEMENT}return t}function wa(i,e,t,r){e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT;let a=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let n=0;n<a;n++){let o=Ae(i,e,t),s=o.string;t=o.bytesOffset;let l=o.length%4;l!==0&&(t+=4-l),e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT;let u=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let m=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let d=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let h=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let p=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let C=new Uint8Array(i,t,h);t+=h;let f=p===et.RGB||p===et.BGR?33776:33779;if(d===22&&(f=36196),!Be.s3tc&&(f===33776||f===33779)){let g=new Uint8Array(u*m*4);Lr.decode(g,u,m,C,p),C=g,d=0,f=p===et.RGB||p===et.RGB?273:4369}r[s]={id:s,width:u,height:m,compressType:d,nFormat:p,internalFormat:f,arrayBufferView:C}}return t}function Fa(i,e,t,r){let a=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let n=new Uint8Array(i,t,a),o=wr(n);return t+=a,r.materials=JSON.parse(o),t}let tt={red:0,green:0,blue:0,alpha:0},Ra=65536;function ba(i,e,t,r,a,n){if(n===3&&(r=e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT),(r&1)===1){e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT;let o=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let s=0;s<o;s++){let l=Ae(i,e,t),u=l.string;t=l.bytesOffset;let m=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let d={};if(a[u].pickInfo=d,a[u].vertexPackage.instanceIndex==-1){let p=new Float32Array(a[u].vertexPackage.verticesCount);for(let C=0;C<m;C++){let f=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let g=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let y=[];for(let D=0;D<g;D++){let _=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;let x=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT,p.fill(C,_,_+x),y.push({vertexColorOffset:_,vertexColorCount:x,batchId:C})}d[f]=y}Br(a[u].vertexPackage,p,void 0)}else{let p=a[u].vertexPackage.instanceCount,C=a[u].vertexPackage.instanceBuffer,f=a[u].vertexPackage.instanceMode,g=new Float32Array(p),y=[];for(let _=0;_<m;_++){let x=e.getUint32(t,!0);y.push(x),t+=Uint32Array.BYTES_PER_ELEMENT;let F=e.getUint32(t,!0);t+=Uint32Array.BYTES_PER_ELEMENT;for(let G=0;G<F;G++)e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT,n===3&&(e.getUint32(t,!0),t+=Uint32Array.BYTES_PER_ELEMENT)}let D=f===17?16:28;D*=Float32Array.BYTES_PER_ELEMENT;for(let _=0;_<p;_++){g[_]=_;let x=_*f*Float32Array.BYTES_PER_ELEMENT+D;Cesium.Color.unpack(C,x,tt);let F=n===2?y[_]:tt.red+tt.green*256+tt.blue*Ra;d[F]===void 0&&(d[F]={vertexColorCount:1,instanceIds:[],vertexColorOffset:_}),d[F].instanceIds.push(_)}Br(a[u].vertexPackage,g,1)}}}return t}function Br(i,e,t){let r=i.vertexAttributes,a=i.attrLocation,n=r.length,o=t===1?"instanceId":"batchId";a[o]=n,r.push({index:n,typedArray:e,componentsPerAttribute:1,componentDatatype:5126,offsetInBytes:0,strideInBytes:0,instanceDivisor:t})}Be.parseBuffer=function(i){let e=0,t={version:void 0,groupNode:void 0,geoPackage:{},matrials:void 0,texturePackage:{}},r=new DataView(i);t.version=r.getFloat32(e,!0),e+=Float32Array.BYTES_PER_ELEMENT,t.version>=2&&(r.getUint32(e,!0),e+=Uint32Array.BYTES_PER_ELEMENT),t.version>=3&&(r.getUint32(e,!0),e+=Uint32Array.BYTES_PER_ELEMENT),r.getUint32(e,!0),e+=Uint32Array.BYTES_PER_ELEMENT;let a=fa(i,e);r=new DataView(a),e=0;let n=r.getUint32(e,!0);return e+=Uint32Array.BYTES_PER_ELEMENT,e=Ea(a,r,e,t),e=Sa(a,r,e,t.geoPackage,t.version),e=wa(a,r,e,t.texturePackage),e=Fa(a,r,e,t),ba(a,r,e,n,t.geoPackage,t.version),t};const _r=4369,Na=6410;function nt(i,e,t){let r=i._gl;this.contextId=i.id,this.textureId=e,this.layerId=t.layerId,this.rootName=t.rootName,this.context=i,this.width=t.width,this.height=t.height,this.compressType=t.compressType,this.internalFormat=t.internalFormat,this.pixelFormat=t.pixelFormat,this.arrayBufferView=t.arrayBufferView,this.wrapS=Cesium.defaultValue(t.wrapS,Cesium.TextureWrap.CLAMP_TO_EDGE),this.wrapT=Cesium.defaultValue(t.wrapT,Cesium.TextureWrap.CLAMP_TO_EDGE),this._target=r.TEXTURE_2D,this._texture=void 0,this.refCount=1,this.arrayBufferView&&this.init()}nt.prototype.init=function(){let i=this.context._gl;this._texture||(this._texture=i.createTexture()),i.bindTexture(i.TEXTURE_2D,this._texture);let e=this.internalFormat;(e===Na||e===_r)&&i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0);let t=0,r=0,a=this.width,n=this.height,o=Ga(this.arrayBufferView,e,a,n);do{let s=Cesium.PixelFormat.compressedTextureSizeInBytes(e,a,n),l=new Uint8Array(this.arrayBufferView.buffer,this.arrayBufferView.byteOffset+r,s);e===_r?i.texImage2D(i.TEXTURE_2D,t++,i.RGBA,a,n,0,i.RGBA,i.UNSIGNED_BYTE,l):i.compressedTexImage2D(i.TEXTURE_2D,t++,e,a,n,0,l),a=Math.max(a>>1,1),n=Math.max(n>>1,1),r+=s}while(r<this.arrayBufferView.byteLength&&o);t>1?(i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR_MIPMAP_LINEAR)):(i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR)),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,this.wrapS),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,this.wrapT),i.texParameteri(this._target,this.context._textureFilterAnisotropic.TEXTURE_MAX_ANISOTROPY_EXT,1),i.bindTexture(i.TEXTURE_2D,null),this.arrayBufferView=void 0,this.ready=!0};function Ga(i,e,t,r){let a=i.length,n=t,o=r,s=0;for(;;){let l=Cesium.PixelFormat.compressedTextureSizeInBytes(e,n,o);if(s+=l,n=n>>1,o=o>>1,n===0&&o===0)break;n=Math.max(n,1),o=Math.max(o,1)}return s===a}nt.prototype.isDestroyed=function(){return!1};nt.prototype.destroy=function(){this.context._gl.deleteTexture(this._texture),this._texture=null,this.id=0,Cesium.destroyObject(this)};function ot(){this.ambientColor=new Cesium.Color,this.diffuseColor=new Cesium.Color,this.specularColor=new Cesium.Color(0,0,0,0),this.shininess=50,this.bTransparentSorting=!1,this.texMatrix=Cesium.Matrix4.clone(Cesium.Matrix4.IDENTITY,new Cesium.Matrix4),this.textures=[]}ot.prototype.isDestroyed=function(){return!1};ot.prototype.destroy=function(){let i=this.textures.length;for(let e=0;e<i;e++)this.textures[e].destroy();return this.textures.length=0,this.ambientColor=void 0,this.diffuseColor=void 0,this.specularColor=void 0,Cesium.destroyObject(this)};const za=`
    attribute vec4 aPosition;
#ifdef VertexColor
    attribute vec4 aColor;
#endif
#ifdef VertexNormal
    attribute vec3 aNormal;
#endif
#ifdef Instance
    attribute float instanceId;
#else
    attribute float batchId;
#endif 

#ifdef USE_VertexWeight
    attribute float aVertexWeight;
#endif

#ifdef USE_TextureCoordMatrix
    attribute vec2 aTextureCoordMatrix;
#endif

#ifdef TexCoord
    attribute vec4 aTexCoord0;
    varying vec4 vTexCoord;
    uniform mat4 uTexMatrix;
#ifdef COMPUTE_TEXCOORD
    uniform float uTexture0Width;
    varying vec4 vTexMatrix;
    varying vec4 vTexCoordTransform;
    varying vec2 vIsRGBA;
#endif
#endif

#ifdef TexCoord2
    attribute vec4 aTexCoord1;
    uniform float uTexture1Width;
    varying vec4 vTexMatrix2;
#endif
#ifdef InstanceBim
    attribute vec4 uv2;
    attribute vec4 uv3;
    attribute vec4 uv4;
    attribute vec4 secondary_colour;
    attribute vec4 uv6;   
#endif

#ifdef InstancePipe
    attribute vec4 uv1;
    attribute vec4 uv2;
    attribute vec4 uv3;
    attribute vec4 uv4;
    attribute vec4 uv5;
    attribute vec4 uv6;
    attribute vec4 uv7;
    attribute vec4 secondary_colour;
    attribute vec4 uv9;
#endif
    uniform vec4 uFillForeColor;
    uniform vec4 uSelectedColor;
    varying vec4 vSecondColor;
    varying vec4 vPositionMC;
    varying vec3 vPositionEC;
#ifdef VertexNormal
    varying vec3 vNormalEC;
#endif
    varying vec4 vColor;
    
    const float SHIFT_LEFT8 = 256.0;
    const float SHIFT_RIGHT8 = 1.0 / 256.0;
    const float SHIFT_RIGHT4 = 1.0 / 16.0;
    const float SHIFT_LEFT4 = 16.0;
    void getTextureMatrixFromZValue(in float nZ, inout float XTran, inout float YTran, inout float scale, inout float isRGBA)
    {
        if(nZ <= 0.0)
        {
            return;
        }
        float nDel8 = floor(nZ * SHIFT_RIGHT8);
        float nDel16 = floor(nDel8 * SHIFT_RIGHT8);
        float nDel20 = floor(nDel16 * SHIFT_RIGHT4);
        isRGBA = floor(nDel20);
        YTran = nZ - nDel8 * SHIFT_LEFT8;
        XTran = nDel8 - nDel16 * SHIFT_LEFT8;
        float nLevel = nDel16 - nDel20 * SHIFT_LEFT4;
        scale = 1.0 / pow(2.0, nLevel);
    }
    
    void operation(vec4 operationType, vec4 color, vec4 selectedColor, inout vec4 vertexColor)
    {
        float right_2 = operationType.x * 0.5;
        float right_4 = right_2 * 0.5;
        float right_8 = right_4 * 0.5;
        float right_16 = right_8 * 0.5;
        float isSetColor = fract(right_2);
        if(isSetColor > 0.1)
        {
            vertexColor *= color;
        }
        float isPicked = fract(floor(right_2)* 0.5);
        if(isPicked > 0.1)
        {
            vertexColor *= selectedColor;
        }
        float isHide = fract(floor(right_4)* 0.5);
        if(isHide > 0.1)
        {
            vertexColor.a = 0.0;
        }
    }
    
#ifdef COMPRESS_TEXCOORD
#ifdef TexCoord
    uniform vec2 decode_texCoord0_min;
#endif
#ifdef TexCoord2
    uniform vec2 decode_texCoord1_min;
#endif
#ifdef MeshOPT_Compress
    uniform vec3 decode_texCoord0_vNormConstant;
    uniform vec3 decode_texCoord1_vNormConstant;
#else
    uniform float decode_texCoord0_normConstant;
    uniform float decode_texCoord1_normConstant;
#endif
#endif

#ifdef COMPRESS_VERTEX
    uniform vec4 decode_position_min;
    uniform float decode_position_normConstant;
#endif

#ifdef COMPRESS_NORMAL
    uniform float normal_rangeConstant;
#endif
    void main()
    {
    #ifdef COMPRESS_VERTEX
        vec4 vertexPos = vec4(1.0);
        vertexPos = decode_position_min + vec4(aPosition.xyz, 1.0) * decode_position_normConstant;
    #else
        vec4 vertexPos = aPosition;
    #endif
    #ifdef TexCoord
    
    #ifdef COMPRESS_TEXCOORD
    #ifdef MeshOPT_Compress
        vec2 texCoord0;
        texCoord0.x = aTexCoord0.x * decode_texCoord0_vNormConstant.x;
        texCoord0.y = aTexCoord0.y * decode_texCoord0_vNormConstant.y;
        vTexCoord.xy = decode_texCoord0_min + texCoord0.xy;
    #else
        vTexCoord.xy = decode_texCoord0_min.xy + aTexCoord0.xy * decode_texCoord0_normConstant;
    #endif
    #else
        vTexCoord.xy = aTexCoord0.xy;
    #endif
    
    #ifdef COMPUTE_TEXCOORD
        vTexMatrix = vec4(0.0,0.0,1.0,0.0);
        vIsRGBA.x = 0.0;
        vTexCoordTransform.x = aTexCoord0.z;
    #ifdef USE_TextureCoordMatrix
        vTexCoordTransform.x = aTextureCoordMatrix.x;
    #endif
        if(vTexCoordTransform.x < -90000.0)
        {
            vTexMatrix.z = -1.0;
        }
        getTextureMatrixFromZValue(floor(vTexCoordTransform.x), vTexMatrix.x, vTexMatrix.y, vTexMatrix.z, vIsRGBA.x);
        vTexMatrix.w = log2(uTexture0Width * vTexMatrix.z);
    #endif
    #endif
    
    #ifdef TexCoord2
    
    #ifdef COMPRESS_TEXCOORD
    #ifdef MeshOPT_Compress
        vec2 texCoord1;
        texCoord1.x = aTexCoord1.x * decode_texCoord1_vNormConstant.x;
        texCoord1.y = aTexCoord1.y * decode_texCoord1_vNormConstant.y;
        vTexCoord.zw = decode_texCoord1_min + texCoord1.xy;
    #else
        vTexCoord.zw = decode_texCoord1_min.xy + aTexCoord1.xy * decode_texCoord1_normConstant;
    #endif
    #else
        vTexCoord.zw = aTexCoord1.xy;
    #endif
    
        vTexMatrix2 = vec4(0.0,0.0,1.0,0.0);
        vIsRGBA.y = 0.0;
        vTexCoordTransform.y = aTexCoord1.z;
    #ifdef USE_TextureCoordMatrix
        vTexCoordTransform.y = aTextureCoordMatrix.y;
    #endif
        if(vTexCoordTransform.y < -90000.0)
        {
            vTexMatrix2.z = -1.0;
        }
        getTextureMatrixFromZValue(floor(vTexCoordTransform.y), vTexMatrix2.x, vTexMatrix2.y, vTexMatrix2.z, vIsRGBA.y);
        vTexMatrix2.w = log2(uTexture1Width * vTexMatrix.z);
    #endif
    
        vec4 vertexColor = uFillForeColor;
    #ifdef VertexColor
        vertexColor *= aColor;
    #endif
    #ifdef VertexNormal
        vec3 normal = aNormal;
    #ifdef COMPRESS_NORMAL
    #ifdef MeshOPT_Compress
        normal.x = aNormal.x / 127.0;
        normal.y = aNormal.y / 127.0;
        normal.z = 1.0 - abs(normal.x) - abs(normal.y);
        normal = normalize(normal);
    #else
        normal = czm_octDecode(aNormal.xy, normal_rangeConstant).zxy;
    #endif
    #endif
    #endif
    #ifdef InstanceBim
        mat4 worldMatrix;
        worldMatrix[0] = uv2;
        worldMatrix[1] = uv3;
        worldMatrix[2] = uv4;
        worldMatrix[3] = vec4(0, 0, 0, 1);
        vertexPos = vec4(vertexPos.xyz,1.0) * worldMatrix;
        vertexColor *= secondary_colour; 
    #endif
    #ifdef InstancePipe
        mat4 worldMatrix;
        mat4 worldMatrix0;
        mat4 worldMatrix1;
        vec4 worldPos0;
        vec4 worldPos1;
        worldMatrix0[0] = uv1;
        worldMatrix0[1] = uv2;
        worldMatrix0[2] = uv3;
        worldMatrix0[3] = vec4( 0.0, 0.0, 0.0, 1.0 );
        worldMatrix1[0] = uv4;
        worldMatrix1[1] = uv5;
        worldMatrix1[2] = uv6;
        worldMatrix1[3] = vec4( 0.0, 0.0, 0.0, 1.0 );
        vec4 realVertex = vec4(vertexPos.xyz, 1.0);
        realVertex.x = realVertex.x * uv7.z;
        worldPos0 = realVertex * worldMatrix0;
        worldPos1 = realVertex * worldMatrix1;
        vertexColor *= secondary_colour; 
    #ifdef TexCoord
        if(aTexCoord0.y > 0.5)
        {
            vec4 tex4Vec = uTexMatrix * vec4(uv7.y, aTexCoord0.x, 0.0, 1.0);
            vTexCoord.xy = tex4Vec.xy;
            vertexPos = worldPos1;
            worldMatrix = worldMatrix1;
        }
        else
        {
            vec4 tex4Vec = uTexMatrix * vec4(uv7.x, aTexCoord0.x, 0.0, 1.0);
            vTexCoord.xy = tex4Vec.xy;
            vertexPos = worldPos0;
            worldMatrix = worldMatrix0;
        }
    #endif
    #ifdef VertexNormal
        normal.x = normal.x * uv7.z;
    #endif
    #endif
    #ifdef Instance  
        float index = instanceId;
    #else
        float index = batchId;
    #endif  
        vec4 operationType = batchTable_operation(index);
        operation(operationType, vec4(1.0), uSelectedColor, vertexColor);
        vSecondColor = batchTable_pickColor(index);
        vec4 positionMC = vec4(vertexPos.xyz, 1.0);
        vColor = vertexColor;
    #ifdef VertexNormal
        vNormalEC = czm_normal * normal;
    #endif
        vPositionMC = positionMC;
        vPositionEC = (czm_modelView * positionMC).xyz;
        gl_Position = czm_modelViewProjection * vec4(vertexPos.xyz, 1.0);
    }
`,Ua=`
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef GL_EXT_shader_texture_lod
#extension GL_EXT_shader_texture_lod : enable
#endif
    uniform vec4 uDiffuseColor;
#ifdef TexCoord
    varying vec4 vTexCoord;
#ifdef COMPUTE_TEXCOORD
    uniform sampler2D uTexture;
    uniform float uTexture0Width;
    varying vec4 vTexCoordTransform;
    varying vec4 vTexMatrix;
    varying vec2 vIsRGBA;
#endif
#endif

    varying vec4 vColor;
    varying vec4 vSecondColor;
    varying vec4 vPositionMC;
    varying vec3 vPositionEC;
#ifdef VertexNormal
    varying vec3 vNormalEC;
#endif
#ifdef TexCoord2
    uniform sampler2D uTexture2;
    uniform float uTexture1Width;
    varying vec4 vTexMatrix2;
#endif
#ifdef COMPUTE_TEXCOORD
    void calculateMipLevel(in vec2 inTexCoord, in float vecTile, in float fMaxMip, inout float mipLevel)
    {
        vec2 dx = dFdx(inTexCoord * vecTile);
        vec2 dy = dFdy(inTexCoord * vecTile);
        float dotX = dot(dx, dx);
        float dotY = dot(dy, dy);
        float dMax = max(dotX, dotY);
        float dMin = min(dotX, dotY);
        float offset = (dMax - dMin) / (dMax + dMin);
        offset = clamp(offset, 0.0, 1.0);
        float d = dMax * (1.0 - offset) + dMin * offset;
        mipLevel = 0.5 * log2(d);
        mipLevel = clamp(mipLevel, 0.0, fMaxMip - 1.62);
    }
    
    void calculateTexCoord(in vec3 inTexCoord, in float scale, in float XTran, in float YTran, in float fTile, in float mipLevel, inout vec2 outTexCoord)
    {
        if(inTexCoord.z < -9000.0)
        {
            outTexCoord = inTexCoord.xy;
        }
        else
        {
            vec2 fTexCoord = fract(inTexCoord.xy);
            float offset = 1.0 * pow(2.0, mipLevel) / fTile;
            fTexCoord = clamp(fTexCoord, offset, 1.0 - offset);
            outTexCoord.x = (fTexCoord.x + XTran) * scale;
            outTexCoord.y = (fTexCoord.y + YTran) * scale;
        }
    }
    
    vec4 getTexColorForS3M(sampler2D curTexture, vec3 oriTexCoord, float texTileWidth, float fMaxMipLev, float fTexCoordScale, vec2 vecTexCoordTranslate, float isRGBA)
    {
        vec4 color = vec4(1.0);
        float mipLevel = 0.0;
    #ifdef GL_OES_standard_derivatives
        calculateMipLevel(oriTexCoord.xy, texTileWidth, fMaxMipLev, mipLevel);
    #endif
        vec2 realTexCoord;
        calculateTexCoord(oriTexCoord, fTexCoordScale, vecTexCoordTranslate.x, vecTexCoordTranslate.y, texTileWidth, mipLevel, realTexCoord);
        if(isRGBA > 0.5)
        {
            vec2 rgbTexCoord;
            rgbTexCoord.x = (realTexCoord.x + vecTexCoordTranslate.x * fTexCoordScale) * 0.5;
            rgbTexCoord.y = (realTexCoord.y + vecTexCoordTranslate.y * fTexCoordScale) * 0.5;
            color = texture2D(curTexture, rgbTexCoord.xy, -10.0);
            vec2 vecAlphaTexCoord;
            vecAlphaTexCoord.x = rgbTexCoord.x;
            vecAlphaTexCoord.y = rgbTexCoord.y + fTexCoordScale * 0.5;
            color.a = texture2D(curTexture, vecAlphaTexCoord.xy, -10.0).r;
        }
        else
        {
            if(oriTexCoord.z < -9000.0)
            {
                color = texture2D(curTexture, realTexCoord.xy);
            }
            else
            {
                #ifdef GL_EXT_shader_texture_lod
                    color = texture2DLodEXT(curTexture, realTexCoord.xy, mipLevel);
                #else
                    color = texture2D(curTexture, realTexCoord.xy, mipLevel);
                #endif
            }
        }
        
        return color;
    }
    
    vec4 getTextureColor()
    {
        if(vTexMatrix.z < 0.0)
        {
            return vec4(1.0);
        }
        float texTileWidth0 = vTexMatrix.z * uTexture0Width;
        vec3 realTexCoord = vec3(vTexCoord.xy, vTexCoordTransform.x);
        vec4 FColor = getTexColorForS3M(uTexture, realTexCoord, texTileWidth0, vTexMatrix.w, vTexMatrix.z, vTexMatrix.xy, vIsRGBA.x);
    #ifdef TexCoord2
        float texTileWidth1 = vTexMatrix2.z * uTexture1Width;
        realTexCoord = vec3(vTexCoord.zw, vTexCoordTransform.y);
        vec4 SColor = getTexColorForS3M(uTexture2, realTexCoord, texTileWidth1, vTexMatrix2.w, vTexMatrix2.z, vTexMatrix2.xy, vIsRGBA.y);
        SColor.r = clamp(SColor.r, 0.0, 1.0);
        SColor.g = clamp(SColor.g, 0.0, 1.0);
        SColor.b = clamp(SColor.b, 0.0, 1.0);
        return FColor * SColor;
    #else
        return FColor;
    #endif
    }
#endif
    vec4 SRGBtoLINEAR4(vec4 srgbIn)
    {
    #ifndef HDR 
        vec3 linearOut = pow(srgbIn.rgb, vec3(2.2));
        return vec4(linearOut, srgbIn.a);
    #else
        return srgbIn;
    #endif
    }
    vec3 LINEARtoSRGB(vec3 linearIn)
    {
    #ifndef HDR 
        return pow(linearIn, vec3(1.0/2.2));
    #else
        return linearIn;
    #endif
    }
    vec3 applyTonemapping(vec3 linearIn) 
    {
    #ifndef HDR
        return czm_acesTonemapping(linearIn);
    #else
        return linearIn;
    #endif
    }
  
    vec3 computeNormal(in vec3 oriVertex)
    {
        vec3 normal = cross(vec3(dFdx(oriVertex.x), dFdx(oriVertex.y), dFdx(oriVertex.z)), vec3(dFdy(oriVertex.x), dFdy(oriVertex.y), dFdy(oriVertex.z)));
        normal = normalize(normal);
        return normal;
    }
    
    void main()
    {
        if(vColor.a < 0.1)
        {
            discard;
        } 
        vec4 baseColorWithAlpha = vColor;
    #ifdef COMPUTE_TEXCOORD
        baseColorWithAlpha *= SRGBtoLINEAR4(getTextureColor());
    #endif
    
        if(baseColorWithAlpha.a < 0.1)
        {
            discard;
        }
        vec3 normal = vec3(0.0);
    #ifdef VertexNormal
        normal = normalize(vNormalEC);
    #endif
        normal = length(normal) > 0.1 ? normal : computeNormal(vPositionMC.xyz);
        vec3 color = baseColorWithAlpha.rgb;
        vec3 dirVectorEC = normalize(czm_lightDirectionEC);
        float dotProduct = dot( normal, dirVectorEC );
        float dirDiffuseWeight = max( dotProduct, 0.0 );
        dirDiffuseWeight = dirDiffuseWeight * 0.5 + 0.5;
        color += color * uDiffuseColor.rgb * dirDiffuseWeight;
    #ifdef TexCoord
        color = LINEARtoSRGB(color);
    #endif
        gl_FragColor = vec4(color, baseColorWithAlpha.a);
    }
`;function Yt(){this.context=void 0,this.model=void 0,this.index=void 0}Yt.prototype.set=function(i,e,t){this.context=i,this.model=e,this.index=t};Yt.prototype.execute=function(){let i=this.context,e=this.index,t=this.model.vertexPackage,r=t.vertexAttributes[e];if(!Cesium.defined(r))throw new Cesium.DeveloperError("attribute is null");if(t.instanceIndex!==-1&&!Cesium.defined(this.model.instanceBuffer)){if(!Cesium.defined(t.instanceBuffer))throw new Cesium.DeveloperError("instance buffer is null");this.model.instanceBuffer=Cesium.Buffer.createVertexBuffer({context:i,typedArray:t.instanceBuffer,usage:Cesium.BufferUsage.STATIC_DRAW})}if(r.instanceDivisor===1&&!Cesium.defined(r.typedArray)){r.vertexBuffer=this.model.instanceBuffer;return}Cesium.defined(r.vertexBuffer)||(r.vertexBuffer=Cesium.Buffer.createVertexBuffer({context:i,typedArray:r.typedArray,usage:Cesium.BufferUsage.STATIC_DRAW}),r.typedArray=null,delete r.typedArray)};function jt(){this.model=void 0,this.context=void 0,this.index=0}jt.prototype.set=function(i,e,t){this.model=e,this.context=i,this.index=t};jt.prototype.execute=function(){let i=this.context,e=this.model.arrIndexPackage[this.index],t=this.model.vertexPackage.verticesCount;if(!Cesium.defined(e))throw new Cesium.DeveloperError("index package is null");if(Cesium.defined(e.indexBuffer))return;if(!Cesium.defined(e.indicesTypedArray))throw new Cesium.DeveloperError("index buffer is null");let r=Cesium.IndexDatatype.UNSIGNED_SHORT;(e.indexType===1||t>=Cesium.Math.SIXTY_FOUR_KILOBYTES)&&i.elementIndexUint&&(r=Cesium.IndexDatatype.UNSIGNED_INT),Cesium.defined(e.indexBuffer)||(e.indexBuffer=Cesium.Buffer.createIndexBuffer({context:i,typedArray:e.indicesTypedArray,usage:Cesium.BufferUsage.STATIC_DRAW,indexDatatype:r})),e.indicesTypedArray=null,delete e.indicesTypedArray};const Va={VertexNormal:"VertexNormal",VertexColor:"VertexColor",TexCoord:"TexCoord",TexCoord2:"TexCoord2",Instance:"Instance",COMPRESS_VERTEX:"COMPRESS_VERTEX",COMPRESS_NORMAL:"COMPRESS_NORMAL",COMPRESS_COLOR:"COMPRESS_COLOR",COMPRESS_TEXCOORD:"COMPRESS_TEXCOORD",UseLineColor:"USE_LINECOLOR",InstanceBim:"InstanceBim",InstancePipe:"InstancePipe",COMPUTE_TEXCOORD:"COMPUTE_TEXCOORD"},ne=Object.freeze(Va),ka={SVC_Vertex:1,SVC_Normal:2,SVC_VertexColor:4,SVC_SecondColor:8,SVC_TexutreCoord:16,SVC_TexutreCoordIsW:32},re=Object.freeze(ka),Oa={BIM:17,PIPELINE:29},xr=Object.freeze(Oa);function Xt(){this.model=void 0,this.context=void 0}Xt.prototype.set=function(i,e){this.model=e,this.context=i};function Wa(i,e){let t=e.length;for(let r=0;r<t;++r){let a=i.getExtension(e[r]);if(a)return a}}Xt.prototype.execute=function(){const i=this.context,e=this.model,t=e.layer,r=e.vs,a=e.fs,n=e.attributeLocations,o=e.material,s=e.vertexPackage;let l=e.batchTable?e.batchTable.getVertexShaderCallback()(r):r;i.texturelod===void 0&&(i.texturelod=Cesium.defaultValue(Wa(i._gl,["EXT_shader_texture_lod"]),!1));let u=new Cesium.ShaderSource({sources:[l]}),m=new Cesium.ShaderSource({sources:[a]});if(Cesium.defined(n.aNormal)&&(u.defines.push(ne.VertexNormal),m.defines.push(ne.VertexNormal)),Cesium.defined(n.aColor)&&u.defines.push(ne.VertexColor),o&&o.textures.length>0&&(u.defines.push(ne.COMPUTE_TEXCOORD),m.defines.push(ne.COMPUTE_TEXCOORD)),o&&o.textures.length===2&&(u.defines.push(ne.TexCoord2),m.defines.push(ne.TexCoord2)),Cesium.defined(n.aTexCoord0)&&(u.defines.push("TexCoord"),m.defines.push("TexCoord")),s.instanceIndex>-1&&u.defines.push(ne.Instance),s.instanceMode===xr.BIM&&u.defines.push(ne.InstanceBim),s.instanceMode===xr.PIPELINE&&u.defines.push(ne.InstancePipe),Cesium.defined(s.compressOptions)){let d=s.compressOptions;(d&re.SVC_Vertex)===re.SVC_Vertex&&u.defines.push(ne.COMPRESS_VERTEX),(d&re.SVC_Normal)===re.SVC_Normal&&u.defines.push(ne.COMPRESS_NORMAL),(d&re.SVC_VertexColor)===re.SVC_VertexColor&&u.defines.push(ne.COMPRESS_COLOR),(d&re.SVC_TexutreCoord)===re.SVC_TexutreCoord&&u.defines.push(ne.COMPRESS_TEXCOORD)}Cesium.defined(e.arrIndexPackage)&&e.arrIndexPackage.length>0&&e.arrIndexPackage[0].primitiveType===2&&m.defines.push(ne.UseLineColor),Cesium.defined(s.customVertexAttribute)&&Cesium.defined(s.customVertexAttribute.TextureCoordMatrix)&&u.defines.push("USE_TextureCoordMatrix"),Cesium.defined(s.customVertexAttribute)&&Cesium.defined(s.customVertexAttribute.VertexWeight)&&u.defines.push("USE_VertexWeight"),t._vertexCompressionType==="MESHOPT"&&u.defines.push("MeshOPT_Compress"),e.shaderProgram=Cesium.ShaderProgram.fromCache({context:i,vertexShaderSource:u,fragmentShaderSource:m,attributeLocations:n})};function Q(i){this.layer=i.layer,this.vertexPackage=i.vertexPackage,this.arrIndexPackage=i.arrIndexPackage,this.vertexBufferToCreate=new Cesium.Queue,this.indexBufferToCreate=new Cesium.Queue,this.shaderProgramToCreate=new Cesium.Queue;let e,t;for(e=0,t=this.vertexPackage.vertexAttributes.length;e<t;e++)this.vertexBufferToCreate.enqueue(e);for(e=0,t=this.arrIndexPackage.length;e<t;e++)this.indexBufferToCreate.enqueue(e);this.shaderProgramToCreate.enqueue(0),this.boundingVolume=i.boundingVolume,this.material=Cesium.defaultValue(i.material,new ot),this.geoName=i.geoName,this.modelMatrix=i.modelMatrix,this.geoMatrix=i.geoMatrix,this.invGeoMatrix=Cesium.Matrix4.inverse(this.geoMatrix,new Cesium.Matrix4),this.instanceCount=i.vertexPackage.instanceCount,this.attributeLocations=i.vertexPackage.attrLocation,this.shaderProgram=void 0,this.vertexArray=void 0,this.colorCommand=void 0,this.pickInfo=Cesium.defaultValue(i.pickInfo,{}),this.selectionInfoMap=new Cesium.AssociativeArray,this.batchTable=void 0,this.batchTableDirty=!1,this.idsOperationMap=new Cesium.AssociativeArray,this.pickColorIdentifier="vSecondColor",this.createBoundingBoxForInstance(),this.ready=!1}const yr=new Yt,Tr=new jt,vr=new Xt;function Ha(i,e){let t=i.layer.context,r=i.vertexBufferToCreate;for(;r.length;){let a=r.peek();if(yr.set(t,i,a),!e.jobScheduler.execute(yr,Cesium.JobType.BUFFER))break;r.dequeue()}}function Ka(i,e){let t=i.layer.context,r=i.indexBufferToCreate;for(;r.length;){let a=r.peek();if(Tr.set(t,i,a),!e.jobScheduler.execute(Tr,Cesium.JobType.BUFFER))break;r.dequeue()}}function Za(i,e){let t=i.layer.context,r=i.shaderProgramToCreate;for(;r.length&&(r.peek(),vr.set(t,i),!!e.jobScheduler.execute(vr,Cesium.JobType.PROGRAM));)r.dequeue()}function Ja(i,e){if(Cesium.defined(i.batchTable)||!i.pickInfo)return;const t=i.layer.context;let r=[];r.push({functionName:"batchTable_operation",componentDatatype:Cesium.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:4},{functionName:"batchTable_pickColor",componentDatatype:Cesium.ComponentDatatype.UNSIGNED_BYTE,componentsPerAttribute:4,normalize:!0});let a=i.pickInfo,n=Object.keys(a),o=i.instanceCount>0?i.instanceCount:n.length;i.batchTable=new Cesium.BatchTable(t,r,o)}Q.prototype.createBuffers=function(i){Ha(this,i),Ka(this,i)};Q.prototype.createShaderProgram=function(i){Za(this,i)};Q.prototype.createBatchTable=function(i){Ja(this)};let Ya=new Cesium.Cartesian3;Q.prototype.createBoundingBoxForInstance=function(){const i=this.vertexPackage;if(!Cesium.defined(i)||i.instanceIndex===-1||!Cesium.defined(i.instanceBounds))return;let e=i.instanceBounds,t=new Cesium.Cartesian3(e[0],e[1],e[2]),r=new Cesium.Cartesian3(e[3],e[4],e[5]),a=Cesium.Cartesian3.lerp(t,r,.5,Ya),n=Cesium.Cartesian3.distance(a,t),o=new Cesium.Cartesian3;Cesium.Matrix4.multiplyByPoint(this.modelMatrix,a,o),this.boundingVolume.center=o,this.boundingVolume.radius=n,i.instanceBounds=void 0};Q.prototype.initLayerSetting=function(i){Object.keys(i._objsOperationList).length>0&&this.updateObjsOperation(i._objsOperationList)};let ke=new Cesium.Cartesian4;Q.prototype.createPickIds=function(){const i=this.layer,e=i.context,t=this.pickInfo;if(!Cesium.defined(t))return;for(let o in t)t.hasOwnProperty(o)&&this.selectionInfoMap.set(o,t[o]);let r=this.batchTable,a=this.selectionInfoMap,n=a._hash;for(let o in n)if(n.hasOwnProperty(o)){let s=a.get(o),l;Cesium.defined(l)||(l=e.createPickId({primitive:i,id:o}));let u=l.color;ke.x=Cesium.Color.floatToByte(u.red),ke.y=Cesium.Color.floatToByte(u.green),ke.z=Cesium.Color.floatToByte(u.blue),ke.w=Cesium.Color.floatToByte(u.alpha);let m=s.instanceIds;if(this.instanceCount>0)m.map(function(d){r.setBatchedAttribute(d,1,ke)});else{let d=s[0].batchId;r.setBatchedAttribute(d,1,ke)}}this.pickInfo=void 0};Q.prototype.updateBatchTableAttributes=function(){let i=this,e=this.idsOperationMap;for(let t=0,r=e.length;t<r;t++){let a=e.values[t];a.dirty&&(a.dirty=!1,this.instanceCount>0?Array.isArray(a.instanceIds)&&a.instanceIds.map(function(n){i.batchTable.setBatchedAttribute(n,0,a.operationValue)}):Cesium.defined(a.batchId)&&this.batchTable.setBatchedAttribute(a.batchId,0,a.operationValue))}};Q.prototype.updateObjsOperation=function(i){if(!this.ready||this.selectionInfoMap.length<1)return;let e=this.selectionInfoMap._hash;for(let t in e){if(!e.hasOwnProperty(t))continue;let r=i[t];if(!Cesium.defined(r))continue;let a=e[t][0],n=a.batchId,o=a.instanceIds,s=this.idsOperationMap.get(t);Cesium.defined(s)||(s={batchId:n,instanceIds:o,operationValue:new Cesium.Cartesian4,dirty:!0}),s.dirty=!0,s.operationValue.x=s.operationValue.x&1|r,this.idsOperationMap.set(t,s),this.batchTableDirty=!0}};Q.prototype.createCommand=Cesium.DeveloperError.throwInstantiationError;Q.prototype.update=Cesium.DeveloperError.throwInstantiationError;Q.prototype.isDestroyed=Cesium.DeveloperError.throwInstantiationError;Q.prototype.destroy=Cesium.DeveloperError.throwInstantiationError;function Re(i){Q.call(this,i),this.vs=za,this.fs=Ua,this.useLineColor=!1}Re.prototype=Object.create(Q.prototype);Re.prototype.constructor=Q;function ja(){return Cesium.RenderState.fromCache({cull:{enabled:!1},depthTest:{enabled:!0,func:Cesium.DepthFunction.LESS_OR_EQUAL},blending:Cesium.BlendingState.ALPHA_BLEND})}function Xa(){return Cesium.RenderState.fromCache({cull:{enabled:!0},depthTest:{enabled:!0,func:Cesium.DepthFunction.LESS_OR_EQUAL},blending:Cesium.BlendingState.ALPHA_BLEND})}function Qa(i,e,t){const r={uGeoMatrix:function(){return t.geoMatrix},uTexMatrix:function(){return i.texMatrix},uFillForeColor:function(){return t.useLineColor?e.style3D.lineColor:e.style3D.fillForeColor},uInverseGeoMatrix:function(){return t.invGeoMatrix},uTexture:function(){return i.textures[0]},uTexture2:function(){return i.textures[1]},uTexture0Width:function(){return i.textures[0].width},uTexture1Width:function(){return i.textures[1].width},uDiffuseColor:function(){return i.diffuseColor},uSelectedColor:function(){return e._selectedColor}},a=t.vertexPackage,n=a.compressOptions;return(n&re.SVC_Vertex)===re.SVC_Vertex&&(r.decode_position_min=function(){return a.minVerticesValue},r.decode_position_normConstant=function(){return a.vertCompressConstant}),(n&re.SVC_Normal)===re.SVC_Normal&&(r.normal_rangeConstant=function(){return a.normalRangeConstant}),(n&re.SVC_TexutreCoord)===re.SVC_TexutreCoord&&(a.texCoordCompressConstant.length>0&&(r.decode_texCoord0_min=function(){return a.minTexCoordValue[0]},r.decode_texCoord0_normConstant=function(){return a.texCoordCompressConstant[0]},r.decode_texCoord0_vNormConstant=function(){return a.texCoordCompressConstant[0]}),a.texCoordCompressConstant.length>1&&(r.decode_texCoord1_min=function(){return a.minTexCoordValue[1]},r.decode_texCoord1_normConstant=function(){return a.texCoordCompressConstant[1]},r.decode_texCoord1_vNormConstant=function(){return a.texCoordCompressConstant[1]}),a.texCoordCompressConstant.length>2&&(r.decode_texCoord2_min=function(){return a.minTexCoordValue[2]},r.decode_texCoord2_normConstant=function(){return a.texCoordCompressConstant[2]}),a.texCoordCompressConstant.length>3&&(r.decode_texCoord3_min=function(){return a.minTexCoordValue[3]},r.decode_texCoord3_normConstant=function(){return a.texCoordCompressConstant[3]}),a.texCoordCompressConstant.length>4&&(r.decode_texCoord4_min=function(){return a.minTexCoordValue[4]},r.decode_texCoord4_normConstant=function(){return a.texCoordCompressConstant[4]}),a.texCoordCompressConstant.length>5&&(r.decode_texCoord5_min=function(){return a.minTexCoordValue[5]},r.decode_texCoord5_normConstant=function(){return a.texCoordCompressConstant[5]}),a.texCoordCompressConstant.length>6&&(r.decode_texCoord6_min=function(){return a.minTexCoordValue[6]},r.decode_texCoord6_normConstant=function(){return a.texCoordCompressConstant[6]}),a.texCoordCompressConstant.length>7&&(r.decode_texCoord7_min=function(){return a.minTexCoordValue[7]},r.decode_texCoord7_normConstant=function(){return a.texCoordCompressConstant[7]})),r}Re.prototype.createCommand=function(){if(Cesium.defined(this.colorCommand)||this.vertexBufferToCreate.length!==0||this.indexBufferToCreate.length!==0||this.shaderProgramToCreate.length!==0)return;let i=this.layer,e=i.context,t=this.vertexPackage,r=this.arrIndexPackage,a=t.vertexAttributes;if(r.length<1)return;let n=r[0],o=this.material;this.vertexArray=new Cesium.VertexArray({context:e,attributes:a,indexBuffer:n.indexBuffer});let s=Cesium.PrimitiveType.TRIANGLES;switch(n.primitiveType){case 1:s=Cesium.PrimitiveType.POINTS;break;case 2:s=Cesium.PrimitiveType.LINES;break;case 4:s=Cesium.PrimitiveType.TRIANGLES;break}this.useLineColor=s===Cesium.PrimitiveType.LINES,this.colorCommand=new Cesium.DrawCommand({primitiveType:s,modelMatrix:this.modelMatrix,boundingVolume:Cesium.BoundingSphere.clone(this.boundingVolume),pickId:this.pickColorIdentifier,vertexArray:this.vertexArray,shaderProgram:this.shaderProgram,pass:o.bTransparentSorting?Cesium.Pass.TRANSLUCENT:Cesium.Pass.OPAQUE,renderState:o.bTransparentSorting?Xa():ja(),instanceCount:t.instanceCount});let l=Qa(o,i,this);this.batchTable&&(l=this.batchTable.getUniformMapCallback()(l)),this.colorCommand.uniformMap=l,this.vertexPackage=void 0,this.arrIndexPackage=void 0,this.vs=void 0,this.fs=void 0,this.ready=!0};Re.prototype.update=function(i,e){if(!this.ready){this.createBatchTable(i),this.createPickIds(),this.createBuffers(i),this.createShaderProgram(i),this.createCommand(i),this.initLayerSetting(e);return}this.batchTableDirty&&(this.updateBatchTableAttributes(),this.batchTableDirty=!1),this.batchTable&&this.batchTable.update(i),i.commandList.push(this.colorCommand)};Re.prototype.isDestroyed=function(){return!1};Re.prototype.destroy=function(){return this.shaderProgram=this.shaderProgram&&!this.shaderProgram.isDestroyed()&&this.shaderProgram.destroy(),this.vertexArray=this.vertexArray&&!this.vertexArray.isDestroyed()&&this.vertexArray.destroy(),this.material=this.material&&!this.material.isDestroyed()&&this.material.destroy(),this.batchTable=this.batchTable&&!this.batchTable.isDestroyed()&&this.batchTable.destroy(),this.colorCommand=void 0,this.vertexPackage=null,this.arrIndexPackage=null,this.modelMatrix=void 0,this.pickInfo=void 0,this.selectionInfoMap=void 0,this.vs=void 0,this.fs=void 0,Cesium.destroyObject(this)};const qa=`
    attribute vec4 aPosition;
    attribute vec4 aColor;
#ifdef TexCoord
    attribute vec4 aTexCoord0;
    uniform float uTexture0Width;
    varying vec4 vTexCoord;
    varying vec4 vTexMatrix;
    varying vec4 vTexCoordTransform;
#endif
    
#ifdef VertexColor
    varying vec4 vColor;
#endif
    
    const float SHIFT_LEFT8 = 256.0;
    const float SHIFT_RIGHT8 = 1.0 / 256.0;
    const float SHIFT_RIGHT4 = 1.0 / 16.0;
    const float SHIFT_LEFT4 = 16.0;
    void getTextureMatrixFromZValue(in float nZ, inout float XTran, inout float YTran, inout float scale)
    {
        if(nZ <= 0.0)
        {
            return;
        }
        float nDel8 = floor(nZ * SHIFT_RIGHT8);
        float nDel16 = floor(nDel8 * SHIFT_RIGHT8);
        float nDel20 = floor(nDel16 * SHIFT_RIGHT4);
        YTran = nZ - nDel8 * SHIFT_LEFT8;
        XTran = nDel8 - nDel16 * SHIFT_LEFT8;
        float nLevel = nDel16 - nDel20 * SHIFT_LEFT4;
        scale = 1.0 / pow(2.0, nLevel);
    }
    
    void main()
    {
    #ifdef TexCoord
        vTexCoord.xy = aTexCoord0.xy;
        vTexMatrix = vec4(0.0,0.0,1.0,0.0);
        vTexCoordTransform.x = aTexCoord0.z;
        if(vTexCoordTransform.x < -90000.0)
        {
            vTexMatrix.z = -1.0;
        }
        getTextureMatrixFromZValue(floor(vTexCoordTransform.x), vTexMatrix.x, vTexMatrix.y, vTexMatrix.z);
        vTexMatrix.w = log2(uTexture0Width * vTexMatrix.z);
    #endif
    
        vec4 vertexPos = aPosition;

    #ifdef VertexColor
         vColor = aColor;
    #endif
    
        gl_Position = czm_modelViewProjection * vec4(vertexPos.xyz, 1.0);
    }
`,$a=`
#ifdef GL_OES_standard_derivatives
#extension GL_OES_standard_derivatives : enable
#endif
#ifdef GL_EXT_shader_texture_lod
#extension GL_EXT_shader_texture_lod : enable
#endif

#ifdef TexCoord
    uniform sampler2D uTexture;
    uniform float uTexture0Width;
    varying vec4 vTexCoord;
    varying vec4 vTexCoordTransform;
    varying vec4 vTexMatrix;
#endif

#ifdef VertexColor
    varying vec4 vColor;
#endif

#ifdef TexCoord
    void calculateMipLevel(in vec2 inTexCoord, in float vecTile, in float fMaxMip, inout float mipLevel)
    {
        vec2 dx = dFdx(inTexCoord * vecTile);
        vec2 dy = dFdy(inTexCoord * vecTile);
        float dotX = dot(dx, dx);
        float dotY = dot(dy, dy);
        float dMax = max(dotX, dotY);
        float dMin = min(dotX, dotY);
        float offset = (dMax - dMin) / (dMax + dMin);
        offset = clamp(offset, 0.0, 1.0);
        float d = dMax * (1.0 - offset) + dMin * offset;
        mipLevel = 0.5 * log2(d);
        mipLevel = clamp(mipLevel, 0.0, fMaxMip - 1.62);
    }

    void calculateTexCoord(in vec3 inTexCoord, in float scale, in float XTran, in float YTran, in float fTile, in float mipLevel, inout vec2 outTexCoord)
    {
        if(inTexCoord.z < -9000.0)
        {
            outTexCoord = inTexCoord.xy;
        }
        else
        {
            vec2 fTexCoord = fract(inTexCoord.xy);
            float offset = 1.0 * pow(2.0, mipLevel) / fTile;
            fTexCoord = clamp(fTexCoord, offset, 1.0 - offset);
            outTexCoord.x = (fTexCoord.x + XTran) * scale;
            outTexCoord.y = (fTexCoord.y + YTran) * scale;
        }
    }
    
    vec4 getTexColorForS3M(sampler2D curTexture, vec3 oriTexCoord, float texTileWidth, float fMaxMipLev, float fTexCoordScale, vec2 vecTexCoordTranslate)
    {
        vec4 color = vec4(1.0);
        float mipLevel = 0.0;
    #ifdef GL_OES_standard_derivatives
        calculateMipLevel(oriTexCoord.xy, texTileWidth, fMaxMipLev, mipLevel);
    #endif
        vec2 realTexCoord;
        calculateTexCoord(oriTexCoord, fTexCoordScale, vecTexCoordTranslate.x, vecTexCoordTranslate.y, texTileWidth, mipLevel, realTexCoord);
        if(oriTexCoord.z < -9000.0)
        {
            color = texture2D(curTexture, realTexCoord.xy);
        }
        else
        {
            #ifdef GL_EXT_shader_texture_lod
                color = texture2DLodEXT(curTexture, realTexCoord.xy, mipLevel);
            #else
                color = texture2D(curTexture, realTexCoord.xy, mipLevel);
            #endif
        }
        return color;
    }

    vec4 getTextureColor()
    {
        if(vTexMatrix.z < 0.0)
        {
            return vec4(1.0);
        }
        float texTileWidth0 = vTexMatrix.z * uTexture0Width;
        vec3 realTexCoord = vec3(vTexCoord.xy, vTexCoordTransform.x);
        return getTexColorForS3M(uTexture, realTexCoord, texTileWidth0, vTexMatrix.w, vTexMatrix.z, vTexMatrix.xy);
    }
#endif
    
    void main()
    {
        vec4 baseColorWithAlpha = vec4(1.0);
        
    #ifdef VertexColor
        vec4 baseColorWithAlpha = vColor;
    #endif
    
    #ifdef TexCoord
        baseColorWithAlpha *= getTextureColor();
    #endif  
      
        gl_FragColor = baseColorWithAlpha;
    }
`;function be(i){Q.call(this,i),this.vs=qa,this.fs=$a}be.prototype=Object.create(Q.prototype);be.prototype.constructor=Q;function en(){return Cesium.RenderState.fromCache({cull:{enabled:!0},depthTest:{enabled:!0,func:Cesium.DepthFunction.LESS_OR_EQUAL},blending:Cesium.BlendingState.ALPHA_BLEND})}function tn(i,e,t){return{uGeoMatrix:function(){return t.geoMatrix},uInverseGeoMatrix:function(){return t.invGeoMatrix},uTexture:function(){return i.textures[0]},uTexture0Width:function(){return i.textures[0].width}}}be.prototype.createCommand=function(){if(Cesium.defined(this.colorCommand)||this.vertexBufferToCreate.length!==0||this.indexBufferToCreate.length!==0||this.shaderProgramToCreate.length!==0)return;let i=this.layer,e=i.context,t=this.vertexPackage,r=this.arrIndexPackage,a=t.vertexAttributes;if(r.length<1)return;let n=r[0],o=this.material;this.vertexArray=new Cesium.VertexArray({context:e,attributes:a,indexBuffer:n.indexBuffer}),this.colorCommand=new Cesium.DrawCommand({primitiveType:n.primitiveType,modelMatrix:this.modelMatrix,boundingVolume:Cesium.BoundingSphere.clone(this.boundingVolume),vertexArray:this.vertexArray,shaderProgram:this.shaderProgram,pass:o.bTransparentSorting?Cesium.Pass.TRANSLUCENT:Cesium.Pass.OPAQUE,renderState:en(),instanceCount:t.instanceCount}),this.colorCommand.uniformMap=tn(o,i,this),this.vertexPackage=void 0,this.arrIndexPackage=void 0,this.vs=void 0,this.fs=void 0,this.ready=!0};be.prototype.update=function(i,e){if(!this.ready){this.createBuffers(i),this.createShaderProgram(i),this.createCommand(i),this.initLayerSetting(e);return}i.commandList.push(this.colorCommand)};be.prototype.isDestroyed=function(){return!1};be.prototype.destroy=function(){return this.shaderProgram=this.shaderProgram&&!this.shaderProgram.isDestroyed()&&this.shaderProgram.destroy(),this.vertexArray=this.vertexArray&&!this.vertexArray.isDestroyed()&&this.vertexArray.destroy(),this.material=this.material&&!this.material.isDestroyed()&&this.material.destroy(),this.colorCommand=void 0,this.vertexPackage=null,this.arrIndexPackage=null,this.modelMatrix=void 0,this.pickInfo=void 0,this.selectionInfoMap=void 0,this.vs=void 0,this.fs=void 0,Cesium.destroyObject(this)};let rn={OSGBFile:function(i){return new be(i)},OSGBCacheFile:function(i){return new Re(i)}};function Ur(){}function an(i,e,t){let r={},a=e.materials.material;for(let n=0,o=a.length;n<o;n++){let s=a[n].material,l=s.id,u=new ot;r[l]=u;let m=s.ambient;u.ambientColor=new Cesium.Color(m.r,m.g,m.b,m.a);let d=s.diffuse;u.diffuseColor=new Cesium.Color(d.r,d.g,d.b,d.a);let h=s.specular;u.specularColor=new Cesium.Color(h.r,h.g,h.b,h.a),u.shininess=s.shininess,u.bTransparentSorting=s.transparentsorting;let p=s.textureunitstates,C=p.length;for(let f=0;f<C;f++){let g=p[f].textureunitstate,y=g.id,D=g.addressmode.u===0?Cesium.TextureWrap.REPEAT:Cesium.TextureWrap.CLAMP_TO_EDGE,_=g.addressmode.v===0?Cesium.TextureWrap.REPEAT:Cesium.TextureWrap.CLAMP_TO_EDGE;u.texMatrix=Cesium.Matrix4.unpack(g.texmodmatrix);let x=e.texturePackage[y];if(Cesium.defined(x)&&x.arrayBufferView.byteLength>0){x.wrapS=D,x.wrapT=_;let F=t.fileName+y,G=i.textureCache.getTexture(F);if(!Cesium.defined(G)){if(Cesium.PixelFormat.isCompressedFormat(x.internalFormat))G=new nt(i,y,x);else{let q=Cesium.Math.isPowerOfTwo(x.width)&&Cesium.Math.isPowerOfTwo(x.height);G=new Cesium.Texture({context:i,source:{width:x.width,height:x.height,arrayBufferView:x.arrayBufferView},sampler:new Cesium.Sampler({minificationFilter:q?i._gl.LINEAR_MIPMAP_LINEAR:i._gl.LINEAR,wrapS:D,wrapT:_})}),q&&G.generateMipmap(Cesium.MipmapHint.NICEST)}i.textureCache.addTexture(F,G)}u.textures.push(G)}}}return r}function nn(i,e){let t=new Cesium.BoundingSphere,r=new Cesium.Cartesian3,a=i.vertexAttributes[0],n=a.componentsPerAttribute,o=Cesium.defined(i.compressOptions)&&(i.compressOptions&re.SVC_Vertex)===re.SVC_Vertex,s=1,l,u;o?(s=i.vertCompressConstant,l=new Cesium.Cartesian3(i.minVerticesValue.x,i.minVerticesValue.y,i.minVerticesValue.z),u=new Uint16Array(a.typedArray.buffer,a.typedArray.byteOffset,a.typedArray.byteLength/2)):u=new Float32Array(a.typedArray.buffer,a.typedArray.byteOffset,a.typedArray.byteLength/4);let m=[];for(let d=0;d<i.verticesCount;d++)Cesium.Cartesian3.fromArray(u,n*d,r),o&&(r=Cesium.Cartesian3.multiplyByScalar(r,s,r),r=Cesium.Cartesian3.add(r,l,r)),m.push(Cesium.Cartesian3.clone(r));return Cesium.BoundingSphere.fromPoints(m,t),Cesium.BoundingSphere.transform(t,e,t),m.length=0,t}let on=new Cesium.Cartesian3;function sn(i){let e=new Cesium.BoundingSphere,t=i.instanceBounds;if(!Cesium.defined(t))return e;let r=new Cesium.Cartesian3(t[0],t[1],t[2]),a=new Cesium.Cartesian3(t[3],t[4],t[5]),n=new Cesium.Cartesian3.lerp(r,a,.5,on),o=new Cesium.Cartesian3.distance(n,r);return e.center=n,e.radius=o,e}function ln(i,e){return i.instanceIndex>-1?sn(i):nn(i,e)}const cn=new Cesium.Matrix3;function un(i,e,t,r,a){let n={},o=r.geodes;for(let s=0,l=o.length;s<l;s++){let u=o[s],m=u.matrix,d=Cesium.Matrix4.multiply(i.modelMatrix,m,new Cesium.Matrix4),h;if(Cesium.defined(a.boundingVolume)){if(a.boundingVolume.sphere)h=new Cesium.BoundingSphere(a.boundingVolume.sphere.center,a.boundingVolume.sphere.radius),Cesium.BoundingSphere.transform(h,i.modelMatrix,h);else if(a.boundingVolume.box){const C=a.boundingVolume.box;let f=new Cesium.Cartesian3(C.center.x,C.center.y,C.center.z),g=new Cesium.Cartesian4(C.xExtent.x,C.xExtent.y,C.xExtent.z,0),y=new Cesium.Cartesian4(C.yExtent.x,C.yExtent.y,C.yExtent.z,0),D=new Cesium.Cartesian4(C.zExtent.x,C.zExtent.y,C.zExtent.z,0),_=new Cesium.Matrix3;Cesium.Matrix3.setColumn(_,0,g,_),Cesium.Matrix3.setColumn(_,1,y,_),Cesium.Matrix3.setColumn(_,2,D,_),f=Cesium.Matrix4.multiplyByPoint(i.modelMatrix,f,f);const x=Cesium.Matrix4.getMatrix3(i.modelMatrix,cn);_=Cesium.Matrix3.multiply(x,_,_),h=new Cesium.OrientedBoundingBox(f,_)}}let p=u.skeletonNames;for(let C=0,f=p.length;C<f;C++){let g=p[C],y=e.geoPackage[g],D=y.vertexPackage,_=y.arrIndexPackage,x=y.pickInfo,F;_.length>0&&(F=t[_[0].materialCode]);let G=ln(D,d);n[g]=rn[i.fileType]({layer:i,vertexPackage:D,arrIndexPackage:_,pickInfo:x,modelMatrix:d,geoMatrix:m,boundingVolume:G,material:F,edgeGeometry:y.edgeGeometry,geoName:g})}}if(!(Object.keys(n).length<1)){if(!Cesium.defined(a.boundingVolume)){let s=[];for(let l in n)n.hasOwnProperty(l)&&s.push(n[l].boundingVolume);a.boundingVolume={sphere:Cesium.BoundingSphere.fromBoundingSpheres(s)}}a.geoMap=n}}function dn(i,e,t){let r=e.groupNode,a=[];for(let n=0,o=r.pageLods.length;n<o;n++){let s={},l=r.pageLods[n];if(s.rangeMode=l.rangeMode,s.rangeDataList=l.childTile,s.rangeList=l.rangeList,l.obb)s.boundingVolume={box:{center:l.obb.obbCenter,xExtent:l.obb.xExtent,yExtent:l.obb.yExtent,zExtent:l.obb.zExtent}};else{let u=l.boundingSphere.center,m=l.boundingSphere.radius;s.rangeDataList!==""?s.boundingVolume={sphere:{center:new Cesium.Cartesian3(u.x,u.y,u.z),radius:m}}:s.isLeafTile=!0}un(i,e,t,l,s),Cesium.defined(s.geoMap)&&a.push(s)}return a}Ur.parse=function(i,e,t){if(!Cesium.defined(e))return;let r=an(i.context,e,t);return dn(i,e,r)};const mn={Distance:0,Pixel:1,GeometryError:2},Je=Object.freeze(mn);function ee(i,e,t,r,a,n){this.layer=i,this.parent=e;let o=r.replace(/\\/g,"/");this.fileExtension=Cesium.getExtensionFromUri(r),this.relativePath=pn(o,i),this.fileName=r,this.isLeafTile=a===0,this.isRootTile=!1,this.boundingVolume=this.createBoundingVolume(t,i.modelMatrix);let s=Cesium.Resource.createIfNeeded(i._baseResource);if(Cesium.defined(e))this.baseUri=e.baseUri;else{let l=new Cesium.Resource(o);this.baseUri=l.getBaseUri()}this.contentResource=s.getDerivedResource({url:this.relativePath}),this.serverKey=Cesium.RequestScheduler.getServerKey(this.contentResource.getUrlComponent()),this.request=void 0,this.cacheNode=void 0,this.distanceToCamera=0,this.centerZDepth=0,this.pixel=0,this.depth=e?e.depth+1:0,this.visibilityPlaneMask=0,this.visible=!1,this.children=[],this.renderEntities=[],this.lodRangeData=Cesium.defaultValue(a,16),this.lodRangeMode=Cesium.defaultValue(n,Je.Pixel),this.contentState=this.isLeafTile?fe.READY:fe.UNLOADED,this.touchedFrame=0,this.requestedFrame=0,this.processFrame=0,this.selectedFrame=0,this.updatedVisibilityFrame=0,this.foveatedFactor=0,this.priority=0,this.priorityHolder=this,this.wasMinPriorityChild=!1,this.shouldSelect=!1,this.selected=!1,this.finalResolution=!0,this.refines=!1}Object.defineProperties(ee.prototype,{renderable:{get:function(){let i=this.renderEntities,e=i.length;if(e===0)return!1;for(let t=0;t<e;t++)if(!i[t].ready)return!1;return!0}}});let Vr=new Cesium.Cartesian3;function Cn(i,e){let t=Cesium.Cartesian3.clone(i.center),r=i.radius;t=Cesium.Matrix4.multiplyByPoint(e,t,t);let a=Cesium.Matrix4.getScale(e,Vr),n=Cesium.Cartesian3.maximumComponent(a);return r*=n,new Cesium.TileBoundingSphere(t,r)}function pn(i,e){i=i.replace(/\+/g,"%2B");let t=e._basePath;if(!(e._basePath.indexOf("realspace")>-1))return i;let a=t.replace(/(.*realspace)/,"");return t.replace(/\/rest\/realspace/g,"").replace(a,"")+"/rest/realspace"+a+"data/path/"+i.replace(/^\.*/,"").replace(/^\//,"").replace(/\/$/,"")}const hn=new Cesium.Matrix3;function fn(i,e){if(Cesium.defined(i.center)){let u=new Cesium.Cartesian3(i.center.x,i.center.y,i.center.z),m=new Cesium.Cartesian4(i.xExtent.x,i.xExtent.y,i.xExtent.z,0),d=new Cesium.Cartesian4(i.yExtent.x,i.yExtent.y,i.yExtent.z,0),h=new Cesium.Cartesian4(i.zExtent.x,i.zExtent.y,i.zExtent.z,0),p=new Cesium.Matrix3;Cesium.Matrix3.setColumn(p,0,m,p),Cesium.Matrix3.setColumn(p,1,d,p),Cesium.Matrix3.setColumn(p,2,h,p),u=Cesium.Matrix4.multiplyByPoint(e,u,u);const C=Cesium.Matrix4.getMatrix3(e,hn);return p=Cesium.Matrix3.multiply(C,p,p),new Cesium.TileOrientedBoundingBox(u,p)}let t=new Cesium.Cartesian3(i.min.x,i.min.y,i.min.z);Cesium.Matrix4.multiplyByPoint(e,t,t);let r=new Cesium.Cartesian3(i.max.x,i.max.y,i.max.z);Cesium.Matrix4.multiplyByPoint(e,r,r);let a=Cesium.BoundingSphere.fromCornerPoints(t,r,new Cesium.BoundingSphere),n=a.center,o=a.radius,s=Cesium.Matrix4.getScale(e,Vr),l=Cesium.Cartesian3.maximumComponent(s);return o*=l,new Cesium.TileBoundingSphere(n,o)}ee.prototype.createBoundingVolume=function(i,e){if(Cesium.defined(i.sphere))return Cn(i.sphere,e);if(Cesium.defined(i.box))return fn(i.box,e)};ee.prototype.canTraverse=function(){return this.children.length===0||this.isLeafTile?!1:Cesium.defined(this.lodRangeData)?this.pixel>this.lodRangeData:!0};function Qt(i,e){return i.boundingVolume}ee.prototype.getPixel=function(i){let t=this.boundingVolume.boundingSphere,r=t.radius,a=t.center,n=Cesium.Cartesian3.distance(i.camera.positionWC,a),o=i.context.drawingBufferHeight,s=i.camera.frustum._fovy*.5;return o*.5/Math.tan(s)*r/n};ee.prototype.getGeometryError=function(i){const e=i.camera,t=this.layer.context.drawingBufferHeight,r=this.lodRangeData,a=this.boundingVolume.distanceToCamera(i);return r*t/(a*e.frustum.sseDenominator)};ee.prototype.distanceToTile=function(i){return Qt(this).distanceToCamera(i)};let An=new Cesium.Cartesian3;ee.prototype.distanceToTileCenter=function(i){const t=Qt(this).boundingVolume,r=Cesium.Cartesian3.subtract(t.center,i.camera.positionWC,An);return Cesium.Cartesian3.dot(i.camera.directionWC,r)};ee.prototype.visibility=function(i,e){let t=Qt(this);return i.cullingVolume.computeVisibilityWithPlaneMask(t,e)};let Pe=new Cesium.Cartesian3;function gn(i,e){let t=e.camera,a=i.boundingVolume.boundingSphere,n=a.radius,o=Cesium.Cartesian3.multiplyByScalar(t.directionWC,i.centerZDepth,Pe),s=Cesium.Cartesian3.add(t.positionWC,o,Pe),l=Cesium.Cartesian3.subtract(s,a.center,Pe);if(Cesium.Cartesian3.magnitude(l)>n){let d=Cesium.Cartesian3.normalize(l,Pe),h=Cesium.Cartesian3.multiplyByScalar(d,n,Pe),p=Cesium.Cartesian3.add(a.center,h,Pe),C=Cesium.Cartesian3.subtract(p,t.positionWC,Pe),f=Cesium.Cartesian3.normalize(C,Pe);i.foveatedFactor=1-Math.abs(Cesium.Cartesian3.dot(t.directionWC,f))}else i.foveatedFactor=0}ee.prototype.updateVisibility=function(i,e){let t=this.parent,r=Cesium.defined(t)?t.visibilityPlaneMask:Cesium.CullingVolume.MASK_INDETERMINATE;this.distanceToCamera=this.distanceToTile(i),this.centerZDepth=this.distanceToTileCenter(i),this.pixel=this.getPixel(i),this.geometryError=this.getGeometryError(i),this.visibilityPlaneMask=this.visibility(i,r),this.visible=this.visibilityPlaneMask!==Cesium.CullingVolume.MASK_OUTSIDE&&this.distanceToCamera>=e.visibleDistanceMin&&this.distanceToCamera<=e.visibleDistanceMax,this.priorityDeferred=gn(this,i)};function En(i){return function(){return i.priority}}function Bn(i){return function(e){i.contentState=fe.FAILED,i.contentReadyPromise.reject(e)}}function _n(i,e){let t=i.layer,r=e.length,a=Number.MAX_VALUE,n=0,o=Je.Pixel;for(let s=0;s<r;s++){let l=e[s],u=l.boundingVolume,m=l.rangeDataList;m=i.baseUri+m;let d=l.rangeList,h=l.rangeMode,p=l.geoMap;if(d!==0){let C=new ee(t,i,u,m,d,h);i.children.push(C),t._cache.add(C)}for(let C in p)p.hasOwnProperty(C)&&i.renderEntities.push(p[C]);a=Math.min(a,d),n=Math.max(n,d),o=h}i.isRootTile&&(i.lodRangeData=o===Je.Pixel?a/2:n*2,i.lodRangeMode=o)}function xn(i,e,t){i._cache.add(e),Be.s3tc=i.context.s3tc,Be.pvrtc=i.context.pvrtc,Be.etc1=i.context.etc1;let r=Be.parseBuffer(t);if(!r){e.contentState=fe.FAILED,e.contentReadyPromise.reject();return}let a=Ur.parse(i,r,e);_n(e,a),e.selectedFrame=0,e.contentState=fe.READY,e.contentReadyPromise.resolve(r)}ee.prototype.requestContent=function(){let i=this,e=this.layer,t=this.contentResource.clone(),r=new Cesium.Request({throttle:!0,throttleByServer:!0,type:Cesium.RequestType.TILES3D,priorityFunction:En(this),serverKey:this.serverKey});this.request=r,t.request=r;let a=t.fetchArrayBuffer();if(!Cesium.defined(a))return!1;this.contentState=fe.LOADING,this.contentReadyPromise=Cesium.defer();let n=Bn(this);return a.then(function(o){if(i.isDestroyed()){n();return}xn(e,i,o)}).catch(function(o){if(r.state===Cesium.RequestState.CANCELLED){i.contentState=fe.UNLOADED;return}n(o)}),!0};function kt(i,e,t){return Math.max(Cesium.Math.normalize(i,e,t)-Cesium.Math.EPSILON7,0)}function Ot(i,e,t){let r=i*Math.pow(10,e);return parseInt(r)*Math.pow(10,t)}ee.prototype.updatePriority=function(i,e){let t=i._minimumPriority,r=i._maximumPriority,a=4,n=4,o=kt(this.foveatedFactor,t.foveatedFactor,r.foveatedFactor),s=Ot(o,n,a);a=8;let l=kt(this.pixel,t.pixel,r.pixel),u=Ot(1-l,n,a);a=0;let m=kt(this.distanceToCamera,t.distance,r.distance),d=Ot(m,n,a);this.priority=s+u+d};ee.prototype.update=function(i,e){for(let t=0,r=this.renderEntities.length;t<r;t++)this.renderEntities[t].update(i,e)};ee.prototype.free=function(){this.contentState=fe.UNLOADED,this.request=void 0,this.cacheNode=void 0,this.priorityHolder=void 0,this.contentReadyPromise=void 0,this.priorityHolder=void 0;for(let i=0,e=this.renderEntities.length;i<e;i++)this.renderEntities[i].destroy();this.renderEntities.length=0,this.children.length=0};ee.prototype.isDestroyed=function(){return!1};ee.prototype.destroy=function(){return this.free(),Cesium.destroyObject(this)};function kr(){this._stack=[]}function yn(i,e){return e.distanceToCamera===0&&i.distanceToCamera===0?e.centerZDepth-i.centerZDepth:e.distanceToCamera-i.distanceToCamera}function Tn(i,e,t,r){let a,n=e.children,o=n.length;for(a=0;a<o;++a)Kr(r,i,n[a]);n.sort(yn);let s=!0,l=!1,u=-1,m=Number.MAX_VALUE;for(a=0;a<o;++a){let d=n[a];d.foveatedFactor<m&&(u=a,m=d.foveatedFactor),d.visible?(t.push(d),l=!0):(Or(i,d,r),Hr(i,d,r),Wr(i,d,r));let h=d.renderable;s=s&&h}if(l||(s=!1),u!==-1){let d=n[u];d.wasMinPriorityChild=!0;let h=(e.wasMinPriorityChild||e.isRootTile)&&m<=e.priorityHolder.foveatedFactor?e.priorityHolder:e;for(h.foveatedFactor=Math.min(d.foveatedFactor,h.foveatedFactor),h.distanceToCamera=Math.min(d.distanceToCamera,h.distanceToCamera),a=0;a<o;++a){let p=n[a];p.priorityHolder=h}}return s}function vn(i,e,t){e.selectedFrame===t.frameNumber||!e.renderable||(i._selectedTiles.push(e),e.selectedFrame=t.frameNumber)}function Or(i,e,t){e.requestedFrame===t.frameNumber||e.contentState!==fe.UNLOADED||(i._requestTiles.push(e),e.requestedFrame=t.frameNumber)}function Wr(i,e,t){e.processFrame===t.frameNumber||e.contentState!==fe.READY||e.renderable||(e.processFrame=t.frameNumber,i._processTiles.push(e))}function Hr(i,e,t){e.touchedFrame!==t.frameNumber&&(i._cache.touch(e),e.touchedFrame=t.frameNumber)}function Mn(i,e,t){e.updatedVisibilityFrame!==t.frameNumber&&(e.updatedVisibilityFrame=t.frameNumber,e.updateVisibility(t,i))}function Pn(i,e,t){Mn(e,t,i)}function Dn(i,e){i._maximumPriority.distance=Math.max(e.distanceToCamera,i._maximumPriority.distance),i._minimumPriority.distance=Math.min(e.distanceToCamera,i._minimumPriority.distance),i._maximumPriority.depth=Math.max(e.depth,i._maximumPriority.depth),i._minimumPriority.depth=Math.min(e.depth,i._minimumPriority.depth),i._maximumPriority.foveatedFactor=Math.max(e.foveatedFactor,i._maximumPriority.foveatedFactor),i._minimumPriority.foveatedFactor=Math.min(e.foveatedFactor,i._minimumPriority.foveatedFactor),i._maximumPriority.pixel=Math.max(e.pixel,i._maximumPriority.pixel),i._minimumPriority.pixel=Math.min(e.pixel,i._minimumPriority.pixel)}function Kr(i,e,t){Pn(i,e,t),t.wasMinPriorityChild=!1,t.priorityHolder=t,Dn(e,t),t.shouldSelect=!1,t.selected=!1}function In(i,e){return e.children.length===0?!1:e.lodRangeMode===Je.Pixel?e.pixel/i.lodRangeScale>e.lodRangeData:e.lodRangeMode===Je.GeometryError?e.geometryError>16:e.distanceToCamera*i.lodRangeScale<e.lodRangeData}function Ln(i,e,t){for(;e.length;){let r=e.pop(),a=r.parent,n=!Cesium.defined(a)||a.refines,o=!1;In(i,r)&&(o=Tn(i,r,e,t)&&n);let s=!o&&n;Or(i,r,t),Wr(i,r,t),s&&vn(i,r,t),Hr(i,r,t),r.refines=o}}function Sn(i,e,t){e.length=0;for(let r=0,a=i._rootTiles.length;r<a;r++){let n=i._rootTiles[r];Kr(t,i,n),n.visible&&e.push(n)}}function wn(i,e){let t=i._requestTiles,r=t.length;for(let a=0;a<r;++a)t[a].updatePriority(i,e)}kr.prototype.schedule=function(i,e){let t=this._stack;Sn(i,t,e),Ln(i,t,e),wn(i,e)};function Ne(){this._list=new Cesium.DoublyLinkedList,this._sentinel=this._list.add(),this._trimTiles=!1}Ne.prototype.reset=function(){this._list.splice(this._list.tail,this._sentinel)};Ne.prototype.touch=function(i){let e=i.cacheNode;Cesium.defined(e)&&this._list.splice(this._sentinel,e)};Ne.prototype.add=function(i){Cesium.defined(i.cacheNode)||(i.cacheNode=this._list.add(i))};Ne.prototype.unloadTile=function(i,e,t){let r=e.cacheNode;Cesium.defined(r)&&(this._list.remove(r),e.cacheNode=void 0,t(i,e))};Ne.prototype.unloadTiles=function(i,e){let t=this._trimTiles;this._trimTiles=!1;let r=this._list,a=i.maximumMemoryUsage*1024*1024,n=this._sentinel,o=r.head;for(;o&&o!==n&&(i.totalMemoryUsageInBytes>a||t);){let s=o.item;o=o.next,this.unloadTile(i,s,e)}};Ne.prototype.trim=function(){this._trimTiles=!0};const Fn={RESET:0,SetColor:1,SELECTED:2,HIDE:4,OFFSET:8,CLIP:16,BLOOM:32,ALL:255},it=Object.freeze(Fn);function Zr(){this._fillForeColor=new Cesium.Color,this._lineColor=new Cesium.Color,this._lineWidth=1,this._bottomAltitude=0,this._pointSize=1,this._pointColor=new Cesium.Color}Object.defineProperties(Zr.prototype,{fillForeColor:{get:function(){return this._fillForeColor},set:function(i){Cesium.Check.typeOf.object("fillForeColor value",i),Cesium.Color.clone(i,this._fillForeColor)}},bottomAltitude:{get:function(){return this._bottomAltitude},set:function(i){Cesium.Check.typeOf.number("bottomAltitude value",i),this._bottomAltitude!==i&&(this._bottomAltitude=i,this._dirty=!0)}},altitudeMode:{get:function(){return this._altitudeMode},set:function(i){Cesium.Check.typeOf.number("altitudeMode value",i),this._altitudeMode=i}},lineColor:{get:function(){return this._lineColor},set:function(i){Cesium.Check.typeOf.object("line color",i),Cesium.Color.clone(i,this._lineColor)}},lineWidth:{get:function(){return this._lineWidth},set:function(i){Cesium.Check.typeOf.number("line width",i),this._lineWidth=i}},pointSize:{get:function(){return this._pointSize},set:function(i){Cesium.Check.typeOf.number("point size",i),this._pointSize=i}},pointColor:{get:function(){return this._pointColor},set:function(i){Cesium.Check.typeOf.object("point color",i),Cesium.Color.clone(i,this._pointColor)}}});function ie(i){i=Cesium.defaultValue(i,Cesium.defaultValue.EMPTY_OBJECT),Cesium.Check.defined("options.url",i.url),Cesium.Check.defined("options.context",i.context),this.id=Cesium.createGuid(),this.name=i.name,this.context=i.context,this._url=void 0,this._basePath=void 0,this._baseResource=void 0,this.modelMatrix=new Cesium.Matrix4,this.invModelMatrix=new Cesium.Matrix4,this._visibleDistanceMax=Cesium.defaultValue(i.maxVisibleDistance,Number.MAX_VALUE),this._visibleDistanceMin=Cesium.defaultValue(i.minVisibleDistance,0),this._lodRangeScale=Cesium.defaultValue(i.lodRangeScale,1),this._selectedColor=new Cesium.Color(.7,.7,1,1),this.fileType=void 0,this._position=void 0,this._rectangle=void 0,this._rootTiles=[],this._schuduler=new kr,this._selections=[],this._objsOperationList={},this._requestTiles=[],this._processTiles=[],this._selectedTiles=[],this._cache=new Ne,this._maximumMemoryUsage=-1,this._totalMemoryUsageInBytes=0,this._vertexCompressionType=void 0,this._style3D=new Zr,this._maximumPriority={foveatedFactor:-Number.MAX_VALUE,depth:-Number.MAX_VALUE,distance:-Number.MAX_VALUE,pixel:-Number.MAX_VALUE},this._minimumPriority={foveatedFactor:Number.MAX_VALUE,depth:Number.MAX_VALUE,distance:Number.MAX_VALUE,pixel:Number.MAX_VALUE},this._readyPromise=Cesium.defer(),this.loadConfig(i.url)}Object.defineProperties(ie.prototype,{ready:{get:function(){return this._rootTiles.length>0}},readyPromise:{get:function(){return this._readyPromise}},rectangle:{get:function(){return this._rectangle}},visibleDistanceMax:{get:function(){return this._visibleDistanceMax},set:function(i){Cesium.Check.typeOf.number("max visible distance",i),this._visibleDistanceMax=i}},visibleDistanceMin:{get:function(){return this._visibleDistanceMin},set:function(i){Cesium.Check.typeOf.number("min visible distance",i),this._visibleDistanceMin=i}},lodRangeScale:{get:function(){return this._lodRangeScale},set:function(i){Cesium.Check.typeOf.number("set layer lod range scale",i),this._lodRangeScale=i}},totalMemoryUsageInBytes:{get:function(){return this._totalMemoryUsageInBytes},set:function(i){this._totalMemoryUsageInBytes=i}},maximumMemoryUsage:{get:function(){return this._maximumMemoryUsage},set:function(i){this._maximumMemoryUsage=i}},style3D:{get:function(){return this._style3D},set:function(i){this._style3D=i}}});Cesium.Scene.prototype.hookPickFunc=Cesium.Scene.prototype.pick;Cesium.Scene.prototype.pick=function(i,e,t){let r=this.hookPickFunc(i,e,t);if(r)r.primitive&&r.primitive instanceof ie&&r.primitive.setSelection(r.id);else for(let a=0,n=this.primitives.length;a<n;a++){let o=this.primitives.get(a);o instanceof ie&&o.releaseSelection()}return r};ie.prototype.loadConfig=function(i){let e=this;Promise.resolve(i).then(function(t){let r,a=Cesium.Resource.createIfNeeded(t);return r=a.getBaseUri(!0),e._url=a.url,e._basePath=r,e._baseResource=a,a.fetchJson()}).then(function(t){let r=t.extensions;e.fileType=r["s3m:FileType"],e._vertexCompressionType=r["s3m:VertexCompressionType"];let a=t.position.x,n=t.position.y,o=t.position.z;if(e._position=Cesium.Cartesian3.fromDegrees(a,n,o),e.modelMatrix=Cesium.Transforms.eastNorthUpToFixedFrame(e._position),e.invModelMatrix=Cesium.Matrix4.inverse(e.modelMatrix,e.invModelMatrix),e._rectangle=Cesium.Rectangle.fromDegrees(t.geoBounds.left,t.geoBounds.bottom,t.geoBounds.right,t.geoBounds.top),t.heightRange&&(e._minHeight=t.heightRange.min,e._maxHeight=t.heightRange.max),t.wDescript){let l=t.wDescript.range;e._minWValue=l.min,e._maxWValue=l.max}let s=t.tiles||t.rootTiles;for(let l=0,u=s.length;l<u;l++){let m=s[l],d=m.url,h={box:m.boundingbox},p=new ee(e,void 0,h,d);p.isRootTile=!0,e._cache.add(p),e._rootTiles.push(p)}e._readyPromise.resolve(e)}).catch(function(t){e._readyPromise.reject(t)})};ie.prototype._tranverseRenderEntity=function(i,e){let t=[];for(let r=0,a=this._rootTiles.length;r<a;r++){let n=this._rootTiles[r];t.push(n)}for(;t.length;){let r=t.pop();for(let a=0,n=r.renderEntities.length;a<n;a++){const o=r.renderEntities[a];o.ready&&e(o,i)}for(let a=0,n=r.children.length;a<n;a++)t.push(r.children[a])}};function Rn(i,e){i.updateObjsOperation(e.ids,e)}ie.prototype._updateObjsOperation=function(i){this._tranverseRenderEntity({ids:i},Rn)};ie.prototype._setObjsOperationType=function(i,e){Cesium.Check.defined("set Objs Operation ids",i),Cesium.Check.defined("set Objs Operation operationType",e),Array.isArray(i)||(i=[i]);let t=new Cesium.AssociativeArray,r;for(let a=0,n=i.length;a<n;a++){if(r=i[a],!Cesium.defined(r))continue;let o=Cesium.defaultValue(this._objsOperationList[r],0);o!==e&&(o=o|e,this._objsOperationList[r]=o,t.set(r,o))}t.length>0&&this._updateObjsOperation(t._hash)};ie.prototype._removeObjsOperationType=function(i,e){Cesium.Check.defined("set Objs Operation ids",i),Array.isArray(i)||(i=[i]);let t=it.ALL^e,r=new Cesium.AssociativeArray,a;for(let n=0,o=i.length;n<o;n++){a=i[n];let s=this._objsOperationList[a];Cesium.defined(s)&&(s&=t,s===it.RESET?delete this._objsOperationList[a]:this._objsOperationList[a]=s,r.set(a,s))}r.length>0&&this._updateObjsOperation(r._hash)};ie.prototype.releaseSelection=function(){this._selections.length<1||(this._removeObjsOperationType(this._selections,it.SELECTED),this._selections.length=0)};ie.prototype.setSelection=function(i){Cesium.Check.defined("setSelection ids",i),Array.isArray(i)||(i=[i]),this.releaseSelection(),this._selections=this._selections.concat(i),this._setObjsOperationType(i,it.SELECTED)};function bn(i,e){return i.priority-e.priority}function Nn(i){let e=i._requestTiles,t=e.length;e.sort(bn);for(let r=0;r<t;++r)e[r].requestContent()}function Gn(i,e){let t=i._processTiles,r=t.length;for(let a=0;a<r;++a)t[a].update(e,i)}function zn(i,e){let t=i._selectedTiles,r=t.length;for(let a=0;a<r;a++)t[a].update(e,i)}function Un(i,e){e.free()}function Jr(i){i._cache.unloadTiles(i,Un)}ie.prototype.prePassesUpdate=function(i){this.ready&&i.newFrame&&(this._cache.reset(),this._requestTiles.length=0,this._processTiles.length=0,this._selectedTiles.length=0)};ie.prototype.postPassesUpdate=function(i){this.ready&&Jr(this)};ie.prototype.update=function(i){this.ready&&(this._schuduler.schedule(this,i),Nn(this),Gn(this,i),zn(this,i))};ie.prototype.isDestroyed=function(){return!1};ie.prototype.destroy=function(){return this._cache.reset(),Jr(this),this._rootTiles.length=0,this._requestTiles.length=0,this._processTiles.length=0,this._selectedTiles.length=0,Cesium.destroyObject(this)};Cesium.S3MTilesLayer=ie;class Vn{constructor(){const{viewer:e}=Ce();this.viewer=e,this.handler=null}createS3MTilesLayer(e){if(!Cesium.S3MTilesLayer)throw new Error("S3MTilesLayer: 请先引入S3MTilesLayer插件");return new Cesium.S3MTilesLayer({context:this.viewer.scene._context,url:e})}OnClickS3MTiles(e){let t=this.viewer.scene;var r=new Cesium.ScreenSpaceEventHandler(t.canvas);this.handler=r,r.setInputAction(a=>{const n=viewer.scene.pick(a.position);n&&n.primitive&&n.primitive.TilesType=="S3M_Tiles"&&e&&e(n)},Cesium.ScreenSpaceEventType.LEFT_CLICK)}removeClick(){this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)}}function kn(){this.threeMesh=null,this.minWGS84=null,this.maxWGS84=null}class On{constructor(){const{viewer:e}=Ce();this.viewer=e,this.three={renderer:null,camera:null,scene:null},this._3Dobjects=[],this.minWGS84=[115.56936458615716,39.284100766866445],this.maxWGS84=[117.10745052365716,41.107831235616445]}_renderThreeObj(){let e=this;e.three.camera.fov=Cesium.Math.toDegrees(e.viewer.camera.frustum.fovy);let t=function(l){return new THREE.Vector3(l.x,l.y,l.z)};for(let l in e._3Dobjects){e.minWGS84=e._3Dobjects[l].minWGS84,e.maxWGS84=e._3Dobjects[l].maxWGS84;let u=Cesium.Cartesian3.fromDegrees((e.minWGS84[0]+e.maxWGS84[0])/2,(e.minWGS84[1]+e.maxWGS84[1])/2),m=Cesium.Cartesian3.fromDegrees((e.minWGS84[0]+e.maxWGS84[0])/2,(e.minWGS84[1]+e.maxWGS84[1])/2,1),d=t(Cesium.Cartesian3.fromDegrees(e.minWGS84[0],e.minWGS84[1])),h=t(Cesium.Cartesian3.fromDegrees(e.minWGS84[0],e.maxWGS84[1])),p=new THREE.Vector3().subVectors(d,h).normalize();e._3Dobjects[l].threeMesh.position.copy(u),e._3Dobjects[l].threeMesh.lookAt(m.x,m.y,m.z),e._3Dobjects[l].threeMesh.up.copy(p)}e.three.camera.matrixAutoUpdate=!1;let r=e.viewer.camera.viewMatrix,a=e.viewer.camera.inverseViewMatrix;e.three.camera.lookAt(0,0,0),e.three.camera.matrixWorld.set(a[0],a[4],a[8],a[12],a[1],a[5],a[9],a[13],a[2],a[6],a[10],a[14],a[3],a[7],a[11],a[15]),e.three.camera.matrixWorldInverse.set(r[0],r[4],r[8],r[12],r[1],r[5],r[9],r[13],r[2],r[6],r[10],r[14],r[3],r[7],r[11],r[15]);let n=document.getElementById("cesiumContainer").clientWidth,o=document.getElementById("cesiumContainer").clientHeight,s=n/o;e.three.camera.aspect=s,e.three.camera.updateProjectionMatrix(),e.three.renderer.setSize(n,o),e.three.renderer.clear(),e.three.renderer.render(e.three.scene,e.three.camera)}initThree(e){let t=this,r=45,a=window.innerWidth,n=window.innerHeight,o=a/n,s=1,l=10*1e3*1e3;t.three.scene=new THREE.Scene,t.three.camera=new THREE.PerspectiveCamera(r,o,s,l),t.three.renderer=new THREE.WebGLRenderer({alpha:!0});let u=new THREE.AmbientLight(16777215,2);return t.three.scene.add(u),document.getElementById(e).appendChild(t.three.renderer.domElement),t.three}add3Dobjects(e){let t=new kn;t.threeMesh=e,t.minWGS84=this.minWGS84,t.maxWGS84=this.maxWGS84,this._3Dobjects.push(t)}loop(){let e=()=>{requestAnimationFrame(e),this.viewer.render(),this._renderThreeObj()};e()}}var Wn=`vec3 _czm_permute289(vec3 x)\r
{\r
    return mod((34.0 * x + 1.0) * x, 289.0);\r
}

/**\r
 * DOC_TBA\r
 *\r
 * Implemented by Stefan Gustavson, and distributed under the MIT License.  {@link http:
 *\r
 * @name czm_cellular\r
 * @glslFunction\r
 *\r
 * @see Stefan Gustavson's chapter, <i>Procedural Textures in GLSL</i>, in <a href="http:
 */\r
vec2 czm_cellular(vec2 P)

{\r
#define K 0.142857142857 
#define Ko 0.428571428571 
#define jitter 1.0 
    vec2 Pi = mod(floor(P), 289.0);\r
    vec2 Pf = fract(P);\r
    vec3 oi = vec3(-1.0, 0.0, 1.0);\r
    vec3 of = vec3(-0.5, 0.5, 1.5);\r
    vec3 px = _czm_permute289(Pi.x + oi);\r
    vec3 p = _czm_permute289(px.x + Pi.y + oi); 
    vec3 ox = fract(p*K) - Ko;\r
    vec3 oy = mod(floor(p*K),7.0)*K - Ko;\r
    vec3 dx = Pf.x + 0.5 + jitter*ox;\r
    vec3 dy = Pf.y - of + jitter*oy;\r
    vec3 d1 = dx * dx + dy * dy; 
    p = _czm_permute289(px.y + Pi.y + oi); 
    ox = fract(p*K) - Ko;\r
    oy = mod(floor(p*K),7.0)*K - Ko;\r
    dx = Pf.x - 0.5 + jitter*ox;\r
    dy = Pf.y - of + jitter*oy;\r
    vec3 d2 = dx * dx + dy * dy; 
    p = _czm_permute289(px.z + Pi.y + oi); 
    ox = fract(p*K) - Ko;\r
    oy = mod(floor(p*K),7.0)*K - Ko;\r
    dx = Pf.x - 1.5 + jitter*ox;\r
    dy = Pf.y - of + jitter*oy;\r
    vec3 d3 = dx * dx + dy * dy; 
    
    vec3 d1a = min(d1, d2);\r
    d2 = max(d1, d2); 
    d2 = min(d2, d3); 
    d1 = min(d1a, d2); 
    d2 = max(d1a, d2); 
    d1.xy = (d1.x < d1.y) ? d1.xy : d1.yx; 
    d1.xz = (d1.x < d1.z) ? d1.xz : d1.zx; 
    d1.yz = min(d1.yz, d2.yz); 
    d1.y = min(d1.y, d1.z); 
    d1.y = min(d1.y, d2.x); 
    return sqrt(d1.xy);\r
}`,Hn=`vec4 _czm_mod289(vec4 x)\r
{\r
  return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}

vec3 _czm_mod289(vec3 x)\r
{\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}

vec2 _czm_mod289(vec2 x)\r
{\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}

float _czm_mod289(float x)\r
{\r
    return x - floor(x * (1.0 / 289.0)) * 289.0;\r
}

vec4 _czm_permute(vec4 x)\r
{\r
    return _czm_mod289(((x*34.0)+1.0)*x);\r
}

vec3 _czm_permute(vec3 x)\r
{\r
    return _czm_mod289(((x*34.0)+1.0)*x);\r
}

float _czm_permute(float x)\r
{\r
    return _czm_mod289(((x*34.0)+1.0)*x);\r
}

vec4 _czm_taylorInvSqrt(vec4 r)\r
{\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}

float _czm_taylorInvSqrt(float r)\r
{\r
    return 1.79284291400159 - 0.85373472095314 * r;\r
}

vec4 _czm_grad4(float j, vec4 ip)\r
{\r
    const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\r
    vec4 p,s;

    p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\r
    p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\r
    s = vec4(lessThan(p, vec4(0.0)));\r
    p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

    return p;\r
}

/**\r
 * DOC_TBA\r
 *\r
 * Implemented by Ian McEwan, Ashima Arts, and distributed under the MIT License.  {@link https:
 *\r
 * @name czm_snoise\r
 * @glslFunction\r
 *\r
 * @see <a href="https:
 * @see Stefan Gustavson's paper <a href="http:
 */\r
float czm_snoise(vec2 v)\r
{\r
    const vec4 C = vec4(0.211324865405187,  
                        0.366025403784439,  
                       -0.577350269189626,  
                        0.024390243902439); 
    
    vec2 i  = floor(v + dot(v, C.yy) );\r
    vec2 x0 = v -   i + dot(i, C.xx);

    
    vec2 i1;\r
    
    
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);\r
    
    
    
    vec4 x12 = x0.xyxy + C.xxzz;\r
    x12.xy -= i1;

    
    i = _czm_mod289(i); 
    vec3 p = _czm_permute( _czm_permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);\r
    m = m*m ;\r
    m = m*m ;

    
    
    vec3 x = 2.0 * fract(p * C.www) - 1.0;\r
    vec3 h = abs(x) - 0.5;\r
    vec3 ox = floor(x + 0.5);\r
    vec3 a0 = x - ox;

    
    
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    
    vec3 g;\r
    g.x  = a0.x  * x0.x  + h.x  * x0.y;\r
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;\r
    return 130.0 * dot(m, g);\r
}

float czm_snoise(vec3 v)\r
{\r
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\r
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    
    vec3 i  = floor(v + dot(v, C.yyy) );\r
    vec3 x0 =   v - i + dot(i, C.xxx) ;

    
    vec3 g = step(x0.yzx, x0.xyz);\r
    vec3 l = 1.0 - g;\r
    vec3 i1 = min( g.xyz, l.zxy );\r
    vec3 i2 = max( g.xyz, l.zxy );

    
    
    
    
    vec3 x1 = x0 - i1 + C.xxx;\r
    vec3 x2 = x0 - i2 + C.yyy; 
    vec3 x3 = x0 - D.yyy;      

    
    i = _czm_mod289(i);\r
    vec4 p = _czm_permute( _czm_permute( _czm_permute(\r
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\r
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))\r
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    
    
    float n_ = 0.142857142857; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);\r
    vec4 y_ = floor(j - 7.0 * x_ );    

    vec4 x = x_ *ns.x + ns.yyyy;\r
    vec4 y = y_ *ns.x + ns.yyyy;\r
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4( x.xy, y.xy );\r
    vec4 b1 = vec4( x.zw, y.zw );

    
    
    vec4 s0 = floor(b0)*2.0 + 1.0;\r
    vec4 s1 = floor(b1)*2.0 + 1.0;\r
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\r
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

    vec3 p0 = vec3(a0.xy,h.x);\r
    vec3 p1 = vec3(a0.zw,h.y);\r
    vec3 p2 = vec3(a1.xy,h.z);\r
    vec3 p3 = vec3(a1.zw,h.w);

    
    vec4 norm = _czm_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r
    p0 *= norm.x;\r
    p1 *= norm.y;\r
    p2 *= norm.z;\r
    p3 *= norm.w;

    
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\r
    m = m * m;\r
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),\r
                                dot(p2,x2), dot(p3,x3) ) );\r
}

float czm_snoise(vec4 v)\r
{\r
    const vec4  C = vec4( 0.138196601125011,  
                          0.276393202250021,  
                          0.414589803375032,  
                         -0.447213595499958); 

    
    #define F4 0.309016994374947451

    
    vec4 i  = floor(v + dot(v, vec4(F4)) );\r
    vec4 x0 = v -   i + dot(i, C.xxxx);

    

    
    vec4 i0;\r
    vec3 isX = step( x0.yzw, x0.xxx );\r
    vec3 isYZ = step( x0.zww, x0.yyz );\r
    
    i0.x = isX.x + isX.y + isX.z;\r
    i0.yzw = 1.0 - isX;\r
    
    i0.y += isYZ.x + isYZ.y;\r
    i0.zw += 1.0 - isYZ.xy;\r
    i0.z += isYZ.z;\r
    i0.w += 1.0 - isYZ.z;

    
    vec4 i3 = clamp( i0, 0.0, 1.0 );\r
    vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\r
    vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

    
    
    
    
    
    vec4 x1 = x0 - i1 + C.xxxx;\r
    vec4 x2 = x0 - i2 + C.yyyy;\r
    vec4 x3 = x0 - i3 + C.zzzz;\r
    vec4 x4 = x0 + C.wwww;

    
    i = _czm_mod289(i);\r
    float j0 = _czm_permute( _czm_permute( _czm_permute( _czm_permute(i.w) + i.z) + i.y) + i.x);\r
    vec4 j1 = _czm_permute( _czm_permute( _czm_permute( _czm_permute (\r
               i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\r
             + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\r
             + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\r
             + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    
    
    vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

    vec4 p0 = _czm_grad4(j0,   ip);\r
    vec4 p1 = _czm_grad4(j1.x, ip);\r
    vec4 p2 = _czm_grad4(j1.y, ip);\r
    vec4 p3 = _czm_grad4(j1.z, ip);\r
    vec4 p4 = _czm_grad4(j1.w, ip);

    
    vec4 norm = _czm_taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\r
    p0 *= norm.x;\r
    p1 *= norm.y;\r
    p2 *= norm.z;\r
    p3 *= norm.w;\r
    p4 *= _czm_taylorInvSqrt(dot(p4,p4));

    
    vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\r
    vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\r
    m0 = m0 * m0;\r
    m1 = m1 * m1;\r
    return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\r
                  + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\r
}`,Kn=`uniform vec4 asphaltColor;\r
uniform float bumpSize;\r
uniform float roughness;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  
  vec4 color = asphaltColor;\r
  vec2 st = materialInput.st;\r
  vec2 F = czm_cellular(st / bumpSize);\r
  color.rgb -= (F.x / F.y) * 0.1;

  
  float noise = czm_snoise(st / bumpSize);\r
  noise = pow(noise, 5.0) * roughness;\r
  color.rgb += noise;

  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,Zn=`uniform vec4 lightColor;\r
uniform vec4 darkColor;\r
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 F = czm_cellular(materialInput.st * frequency);\r
  float t = 1.0 - F.x * F.x;

  vec4 color = mix(lightColor, darkColor, t);\r
  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,Jn=`uniform vec4 brickColor;\r
uniform vec4 mortarColor;\r
uniform vec2 brickSize;\r
uniform vec2 brickPct;\r
uniform float brickRoughness;\r
uniform float mortarRoughness;

#define Integral(x, p) ((floor(x) * p) + max(fract(x) - (1.0 - p), 0.0))

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 st = materialInput.st;\r
  vec2 position = st / brickSize;\r
  if(fract(position.y * 0.5) > 0.5) {\r
      position.x += 0.5;\r
  }

  
  vec2 filterWidth = vec2(0.02);\r
  vec2 useBrick = (Integral(position + filterWidth, brickPct) -\r
                      Integral(position, brickPct)) / filterWidth;\r
  float useBrickFinal = useBrick.x * useBrick.y;\r
  vec4 color = mix(mortarColor, brickColor, useBrickFinal);

  
  vec2 brickScaled = vec2(st.x / 0.1, st.y / 0.006);\r
  float brickNoise = abs(czm_snoise(brickScaled) * brickRoughness / 5.0);\r
  color.rg += brickNoise * useBrickFinal;

  
  vec2 mortarScaled = st / 0.005;\r
  float mortarNoise = max(czm_snoise(mortarScaled) * mortarRoughness, 0.0);\r
  color.rgb += mortarNoise * (1.0 - useBrickFinal);

  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,Yn=`uniform vec4 cementColor;\r
uniform float grainScale;\r
uniform float roughness;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  float noise = czm_snoise(materialInput.st / grainScale);\r
  noise = pow(noise, 5.0) * roughness;

  vec4 color = cementColor;\r
  color.rgb += noise;

  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,jn=`uniform vec4 color;\r
uniform float time;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  float alpha = 1.0;\r
  if (time != 1.0)\r
  {\r
      float t = 0.5 + (0.5 * czm_snoise(materialInput.str / (1.0 / 10.0)));   

      if (t > time)\r
      {\r
          alpha = 0.0;\r
      }\r
  }

  material.diffuse = color.rgb;\r
  material.alpha = color.a * alpha;

  return material;\r
}`,Xn=`uniform vec4 lightColor;\r
uniform vec4 darkColor;\r
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 F = czm_cellular(materialInput.st * frequency);\r
  float t = 0.1 + (F.y - F.x);

  vec4 color = mix(lightColor, darkColor, t);\r
  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,Qn=`czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);\r
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);\r
  float cosAngIncidence = max(dot(normalWC, positionWC), 0.0);

  material.diffuse = mix(reflection.diffuse, refraction.diffuse, cosAngIncidence);

  return material;\r
}`,qn=`uniform vec4 grassColor;\r
uniform vec4 dirtColor;\r
uniform float patchiness;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec2 st = materialInput.st;\r
  float noise1 = (czm_snoise(st * patchiness * 1.0)) * 1.0;\r
  float noise2 = (czm_snoise(st * patchiness * 2.0)) * 0.5;\r
  float noise3 = (czm_snoise(st * patchiness * 4.0)) * 0.25;\r
  float noise = sin(noise1 + noise2 + noise3) * 0.1;

  vec4 color = mix(grassColor, dirtColor, noise);

  
  float verticalNoise = czm_snoise(vec2(st.x * 100.0, st.y * 20.0)) * 0.02;\r
  float horizontalNoise = czm_snoise(vec2(st.x * 20.0, st.y * 100.0)) * 0.02;\r
  float stripeNoise = min(verticalNoise, horizontalNoise);

  color.rgb += stripeNoise;

  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,$n=`uniform samplerCube cubeMap;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);\r
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);\r
  vec3 reflectedWC = reflect(positionWC, normalWC);\r
  material.diffuse = textureCube(cubeMap, reflectedWC).channels;

  return material;\r
}`,eo=`uniform samplerCube cubeMap;\r
uniform float indexOfRefractionRatio;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 normalWC = normalize(czm_inverseViewRotation * material.normal);\r
  vec3 positionWC = normalize(czm_inverseViewRotation * materialInput.positionToEyeEC);\r
  vec3 refractedWC = refract(positionWC, -normalWC, indexOfRefractionRatio);\r
  material.diffuse = textureCube(cubeMap, refractedWC).channels;

  return material;\r
}`,to=`uniform vec4 lightColor;\r
uniform vec4 darkColor;\r
uniform float frequency;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  vec3 scaled = materialInput.str * frequency;\r
  float t = abs(czm_snoise(scaled));

  vec4 color = mix(lightColor, darkColor, t);\r
  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`,ro=`uniform vec4 lightWoodColor;\r
uniform vec4 darkWoodColor;\r
uniform float ringFrequency;\r
uniform vec2 noiseScale;\r
uniform float grainFrequency;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);

  
  vec2 st = materialInput.st;

  vec2 noisevec;\r
  noisevec.x = czm_snoise(st * noiseScale.x);\r
  noisevec.y = czm_snoise(st * noiseScale.y);

  vec2 location = st + noisevec;\r
  float dist = sqrt(location.x * location.x + location.y * location.y);\r
  dist *= ringFrequency;

  float r = fract(dist + noisevec[0] + noisevec[1]) * 2.0;\r
  if(r > 1.0)\r
      r = 2.0 - r;

  vec4 color = mix(lightWoodColor, darkWoodColor, r);

  
  r = abs(czm_snoise(vec2(st.x * grainFrequency, st.y * grainFrequency * 0.02))) * 0.2;\r
  color.rgb += lightWoodColor.rgb * r;

  material.diffuse = color.rgb;\r
  material.alpha = color.a;

  return material;\r
}`;Cesium.ShaderSource._czmBuiltinsAndUniforms.czm_cellular=Wn;Cesium.ShaderSource._czmBuiltinsAndUniforms.czm_snoise=Hn;Cesium.Material.AsphaltType="Asphalt";Cesium.Material._materialCache.addMaterial(Cesium.Material.AsphaltType,{fabric:{type:Cesium.Material.AsphaltType,uniforms:{asphaltColor:new Cesium.Color(.15,.15,.15,1),bumpSize:.02,roughness:.2},source:Kn},translucent:function(i){return i.uniforms.asphaltColor.alpha<1}});Cesium.Material.BlobType="Blob";Cesium.Material._materialCache.addMaterial(Cesium.Material.BlobType,{fabric:{type:Cesium.Material.BlobType,uniforms:{lightColor:new Cesium.Color(1,1,1,.5),darkColor:new Cesium.Color(0,0,1,.5),frequency:10},source:Zn},translucent:function(i){var e=i.uniforms;return e.lightColor.alpha<1||e.darkColor.alpha<0}});Cesium.Material.BrickType="Brick";Cesium.Material._materialCache.addMaterial(Cesium.Material.BrickType,{fabric:{type:Cesium.Material.BrickType,uniforms:{brickColor:new Cesium.Color(.6,.3,.1,1),mortarColor:new Cesium.Color(.8,.8,.7,1),brickSize:new Cesium.Cartesian2(.3,.15),brickPct:new Cesium.Cartesian2(.9,.85),brickRoughness:.2,mortarRoughness:.1},source:Jn},translucent:function(i){var e=i.uniforms;return e.brickColor.alpha<1||e.mortarColor.alpha<1}});Cesium.Material.CementType="Cement";Cesium.Material._materialCache.addMaterial(Cesium.Material.CementType,{fabric:{type:Cesium.Material.CementType,uniforms:{cementColor:new Cesium.Color(.95,.95,.85,1),grainScale:.01,roughness:.3},source:Yn},translucent:function(i){return i.uniforms.cementColor.alpha<1}});Cesium.Material.ErosionType="Erosion";Cesium.Material._materialCache.addMaterial(Cesium.Material.ErosionType,{fabric:{type:Cesium.Material.ErosionType,uniforms:{color:new Cesium.Color(1,0,0,.5),time:1},source:jn},translucent:function(i){return i.uniforms.color.alpha<1}});Cesium.Material.FacetType="Facet";Cesium.Material._materialCache.addMaterial(Cesium.Material.FacetType,{fabric:{type:Cesium.Material.FacetType,uniforms:{lightColor:new Cesium.Color(.25,.25,.25,.75),darkColor:new Cesium.Color(.75,.75,.75,.75),frequency:10},source:Xn},translucent:function(i){var e=i.uniforms;return e.lightColor.alpha<1||e.darkColor.alpha<0}});Cesium.Material.FresnelType="Fresnel";Cesium.Material._materialCache.addMaterial(Cesium.Material.FresnelType,{fabric:{type:Cesium.Material.FresnelType,materials:{reflection:{type:Cesium.Material.ReflectionType},refraction:{type:Cesium.Material.RefractionType}},source:Qn},translucent:!1});Cesium.Material.GrassType="Grass";Cesium.Material._materialCache.addMaterial(Cesium.Material.GrassType,{fabric:{type:Cesium.Material.GrassType,uniforms:{grassColor:new Cesium.Color(.25,.4,.1,1),dirtColor:new Cesium.Color(.1,.1,.1,1),patchiness:1.5},source:qn},translucent:function(i){var e=i.uniforms;return e.grassColor.alpha<1||e.dirtColor.alpha<1}});Cesium.Material.ReflectionType="Reflection";Cesium.Material._materialCache.addMaterial(Cesium.Material.ReflectionType,{fabric:{type:Cesium.Material.ReflectionType,uniforms:{cubeMap:Cesium.Material.DefaultCubeMapId,channels:"rgb"},source:$n},translucent:!1});Cesium.Material.RefractionType="Refraction";Cesium.Material._materialCache.addMaterial(Cesium.Material.RefractionType,{fabric:{type:Cesium.Material.RefractionType,uniforms:{cubeMap:Cesium.Material.DefaultCubeMapId,channels:"rgb",indexOfRefractionRatio:.9},source:eo},translucent:!1});Cesium.Material.TyeDyeType="TieDye";Cesium.Material._materialCache.addMaterial(Cesium.Material.TyeDyeType,{fabric:{type:Cesium.Material.TyeDyeType,uniforms:{lightColor:new Cesium.Color(1,1,0,.75),darkColor:new Cesium.Color(1,0,0,.75),frequency:5},source:to},translucent:function(i){var e=i.uniforms;return e.lightColor.alpha<1||e.darkColor.alpha<0}});Cesium.Material.WoodType="Wood";Cesium.Material._materialCache.addMaterial(Cesium.Material.WoodType,{fabric:{type:Cesium.Material.WoodType,uniforms:{lightWoodColor:new Cesium.Color(.6,.3,.1,1),darkWoodColor:new Cesium.Color(.4,.2,.07,1),ringFrequency:3,noiseScale:new Cesium.Cartesian2(.7,.5),grainFrequency:27},source:ro},translucent:function(i){let e=i.uniforms;return e.lightWoodColor.alpha<1||e.darkWoodColor.alpha<1}});var io=`uniform vec4 color;\r
uniform float speed;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st ;\r
  vec2 center = vec2(0.5);\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  float r = 0.5 + sin(time) / 3.0;\r
  float dis = distance(st, center);\r
  float a = 0.0;\r
  if(dis < r) {\r
    a = 1.0 - smoothstep(0.0, r, dis);\r
  }\r
  material.alpha = pow(a,10.0) ;\r
  material.diffuse = color.rgb * a * 3.0;\r
  return material;\r
}`,ao=`uniform vec4 color;\r
uniform float speed;

vec3 circlePing(float r, float innerTail,  float frontierBorder, float timeResetSeconds,  float radarPingSpeed,  float fadeDistance){\r
  float t = fract(czm_frameNumber * speed / 1000.0);\r
  float time = mod(t, timeResetSeconds) * radarPingSpeed;\r
  float circle;\r
  circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);\r
  circle *= smoothstep(fadeDistance, 0.0, r);\r
  return vec3(circle);\r
}

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st * 2.0  - 1.0 ;\r
  vec2 center = vec2(0.);\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  vec3 flagColor;\r
  float r = length(st - center) / 4.;\r
  flagColor += circlePing(r, 0.25, 0.025, 4.0, 0.3, 1.0) * color.rgb;\r
  material.alpha = length(flagColor);\r
  material.diffuse = flagColor.rgb;\r
  return material;\r
}`,no=`uniform vec4 color;\r
uniform float speed;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  material.diffuse = 1.5 * color.rgb;\r
  vec2 st = materialInput.st;\r
  float dis = distance(st, vec2(0.5, 0.5));\r
  float per = fract(czm_frameNumber * speed / 1000.0);\r
  if(dis > per * 0.5){\r
    material.alpha = color.a;\r
  }else {\r
    discard;\r
  }\r
  return material;\r
}`,oo=`uniform vec4 color;\r
uniform float speed;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st * 2.0 - 1.0;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  float r = length(st) * 1.2;\r
  float a = pow(r, 2.0);\r
  float b = sin(r * 0.8 - 1.6);\r
  float c = sin(r - 0.010);\r
  float s = sin(a - time * 2.0 + b) * c;\r
  float d = abs(1.0 / (s * 10.8)) - 0.01;\r
  material.alpha = pow(d,10.0) ;\r
  material.diffuse = color.rgb * d;\r
  return material;\r
}`,so=`uniform vec4 color;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec2 center = st - vec2(0.5,0.5);\r
  float length = length(center) / 0.5;\r
  float time = 1. - abs(czm_frameNumber / 360. - 0.5);\r
  float param = 1. - step(length, 0.6); 
  float scale = param * length; 
  float alpha = param * (1.0 - abs(scale - 0.8) / 0.2); 
  float param1 = step(length, 0.7); 
  float scale1 = param1 * length; 
  alpha += param1 * (1.0 - abs(scale1 - 0.35) / 0.35); 
  material.diffuse = color.rgb * vec3(color.a);\r
  material.alpha = pow(alpha, 4.0);\r
  return material;\r
}`,lo=`uniform vec4 color;\r
uniform sampler2D image;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec2 center = st - vec2(0.5,0.5);\r
  float time = -czm_frameNumber * 3.1415926 / 180.;\r
  float sin_t = sin(time);\r
  float cos_t = cos(time);\r
  vec2 center_rotate = vec2(center.s * cos_t - center.t * sin_t + 0.5,center.s * sin_t + center.t * cos_t + 0.5);\r
  vec4 colorImage = texture(image,center_rotate);\r
  vec3 temp = colorImage.rgb * color.rgb;\r
  temp *= color.a;\r
  material.diffuse = temp;\r
  float length = 2. - length(center) / 0.5;\r
  material.alpha = colorImage.a * pow(length, 0.5);\r
  return material;\r
}`,co=`uniform vec4 color;\r
uniform float speed;

float circle(vec2 uv, float r, float blur) {\r
  float d = length(uv) * 2.0;\r
  float c = smoothstep(r+blur, r, d);\r
  return c;\r
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st - .5;\r
  material.diffuse = color.rgb;\r
  material.emission = vec3(0);\r
  float t =fract(czm_frameNumber * speed / 1000.0);\r
  float s = 0.3;\r
  float radius1 = smoothstep(.0, s, t) * 0.5;\r
  float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);\r
  float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);\r
  float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;\r
  float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);\r
  material.alpha = smoothstep(1.0, s, t) * (alpha1 + alpha2*0.1 + alpha3*0.1);\r
  material.alpha *= color.a;\r
  return material;\r
}`,uo=`uniform vec4 color;\r
uniform float speed;

#define PI 3.14159265359

vec2 rotate2D (vec2 _st, float _angle) {\r
  _st =  mat2(cos(_angle),-sin(_angle),  sin(_angle),cos(_angle)) * _st;\r
  return _st;\r
}

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st * 2.0 - 1.0;\r
  st *= 1.6;\r
  float time = czm_frameNumber * speed / 1000.0;\r
  float r = length(st);\r
  float w = .3;\r
  st = rotate2D(st,(r*PI*6.-time*2.));\r
  float a = smoothstep(-w,.2,st.x) * smoothstep(w,.2,st.x);\r
  float b = abs(1./(sin(pow(r,2.)*2.-time*1.3)*6.))*.4;\r
  material.alpha = a * b ;\r
  material.diffuse = color.rgb * a * b  * 3.0;\r
  return material;\r
}`,mo=`uniform vec4 color;\r
uniform float speed;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st  * 2.0 - 1.0;\r
  float time =czm_frameNumber * speed / 1000.0;\r
  float radius = length(st);\r
  float angle = atan(st.y/st.x);\r
  float radius1 = sin(time * 2.0) + sin(40.0*angle+time)*0.01;\r
  float radius2 = cos(time * 3.0);\r
  vec3 fragColor = 0.2 + 0.5 * cos( time + color.rgb + vec3(0,2,4));\r
  float inten1 = 1.0 - sqrt(abs(radius1 - radius));\r
  float inten2 = 1.0 - sqrt(abs(radius2 - radius));\r
  material.alpha = pow(inten1 + inten2 , 5.0) ;\r
  material.diffuse = fragColor * (inten1 + inten2);\r
  return material;\r
}`,Co=`uniform vec4 color;\r
uniform float speed;\r
uniform float count;\r
uniform float gradient;

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  material.diffuse = 1.5 * color.rgb;\r
  vec2 st = materialInput.st;\r
  float dis = distance(st, vec2(0.5, 0.5));\r
  float per = fract(czm_frameNumber * speed / 1000.0);\r
  if(count == 1.0){\r
    if(dis > per * 0.5){\r
      discard;\r
    }else {\r
      material.alpha = color.a  * dis / per / 2.0;\r
    }\r
  } else {\r
    vec3 str = materialInput.str;\r
    if(abs(str.z)  > 0.001){\r
      discard;\r
    }\r
    if(dis > 0.5){\r
      discard;\r
    } else {\r
      float perDis = 0.5 / count;\r
      float disNum;\r
      float bl = 0.0;\r
      for(int i = 0; i <= 10; i++){\r
        if(float(i) <= count){\r
          disNum = perDis * float(i) - dis + per / count;\r
          if(disNum > 0.0){\r
            if(disNum < perDis){\r
              bl = 1.0 - disNum / perDis;\r
            }\r
            else if(disNum - perDis < perDis){\r
              bl = 1.0 - abs(1.0 - disNum / perDis);\r
            }\r
            material.alpha = pow(bl,(1.0 + 10.0 * (1.0 - gradient)));\r
          }\r
        }\r
      }\r
    }\r
  }\r
  return material;\r
}`;Cesium.Material.CircleBlurType="CircleBlur";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleBlurType,{fabric:{type:Cesium.Material.CircleBlurType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:io},translucent:function(i){return!0}});Cesium.Material.CircleDiffuseType="CircleDiffuse";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleDiffuseType,{fabric:{type:Cesium.Material.CircleDiffuseType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:ao},translucent:function(i){return!0}});Cesium.Material.CircleFadeType="CircleFade";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleFadeType,{fabric:{type:Cesium.Material.CircleFadeType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:no},translucent:function(i){return!0}});Cesium.Material.CirclePulseType="CirclePulse";Cesium.Material._materialCache.addMaterial(Cesium.Material.CirclePulseType,{fabric:{type:Cesium.Material.CirclePulseType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:12},source:oo},translucent:function(i){return!0}});Cesium.Material.CircleRingType="CircleRing";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleRingType,{fabric:{type:Cesium.Material.CircleRingType,uniforms:{color:new Cesium.Color(1,0,0,.7)},source:so},translucent:function(i){return!0}});Cesium.Material.CircleRotateType="CircleRotate";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleRotateType,{fabric:{type:Cesium.Material.CircleRotateType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId},source:lo},translucent:function(i){return!0}});Cesium.Material.CircleScanType="CircleScan";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleScanType,{fabric:{type:Cesium.Material.CircleScanType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:1},source:co},translucent:function(i){return!0}});Cesium.Material.CircleSpiralType="CircleSpiral";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleSpiralType,{fabric:{type:Cesium.Material.CircleSpiralType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:uo},translucent:function(i){return!0}});Cesium.Material.CircleVaryType="CircleVary";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleVaryType,{fabric:{type:Cesium.Material.CircleVaryType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:mo},translucent:function(i){return!0}});Cesium.Material.CircleWaveType="CircleWave";Cesium.Material._materialCache.addMaterial(Cesium.Material.CircleWaveType,{fabric:{type:Cesium.Material.CircleWaveType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3,count:1,gradient:.1},source:Co},translucent:function(i){return!0}});var po=`uniform vec4 color;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  float powerRatio = 1. / (fract(czm_frameNumber / 30.0) +  1.) ;\r
  float alpha = pow(1. - st.t,powerRatio);\r
  vec4 temp = vec4(color.rgb, alpha * color.a);\r
  material.diffuse = temp.rgb;\r
  material.alpha = temp.a;\r
  return material;\r
}`,ho=`uniform vec4 color;\r
uniform sampler2D image;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  float time = fract(czm_frameNumber / 90.) ;\r
  vec2 new_st = fract(st- vec2(time,time));\r
  vec4 colorImage = texture(image, new_st);\r
  vec3 diffuse = colorImage.rgb;\r
  float alpha = colorImage.a;\r
  diffuse *= color.rgb;\r
  alpha *= color.a;\r
  material.diffuse = diffuse;\r
  material.alpha = alpha * pow(1. - st.t,color.a);\r
  return material;\r
}`;Cesium.Material.CylinderFadeType="CylinderFade";Cesium.Material._materialCache.addMaterial(Cesium.Material.CylinderFadeType,{fabric:{type:Cesium.Material.CylinderFadeType,uniforms:{color:new Cesium.Color(1,0,0,.7)},source:po},translucent:function(i){return!0}});Cesium.Material.CylinderParticlesType="CylinderParticles";Cesium.Material._materialCache.addMaterial(Cesium.Material.CylinderParticlesType,{fabric:{type:Cesium.Material.CylinderParticlesType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId},source:ho},translucent:function(i){return!0}});var fo=`uniform vec4 color;\r
uniform float speed;

#define pi 3.1415926535\r
#define PI2RAD 0.01745329252\r
#define TWO_PI (2. * PI)

float rands(float p){\r
  return fract(sin(p) * 10000.0);\r
}

float noise(vec2 p){\r
  float time = fract( czm_frameNumber * speed / 1000.0);\r
  float t = time / 20000.0;\r
  if(t > 1.0) t -= floor(t);\r
  return rands(p.x * 14. + p.y * sin(t) * 0.5);\r
}

vec2 sw(vec2 p){\r
  return vec2(floor(p.x), floor(p.y));\r
}

vec2 se(vec2 p){\r
  return vec2(ceil(p.x), floor(p.y));\r
}

vec2 nw(vec2 p){\r
  return vec2(floor(p.x), ceil(p.y));\r
}

vec2 ne(vec2 p){\r
  return vec2(ceil(p.x), ceil(p.y));\r
}

float smoothNoise(vec2 p){\r
  vec2 inter = smoothstep(0.0, 1.0, fract(p));\r
  float s = mix(noise(sw(p)), noise(se(p)), inter.x);\r
  float n = mix(noise(nw(p)), noise(ne(p)), inter.x);\r
  return mix(s, n, inter.y);\r
}

float fbm(vec2 p){\r
  float z = 2.0;\r
  float rz = 0.0;\r
  vec2 bp = p;\r
  for(float i = 1.0; i < 6.0; i++){\r
    rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;\r
    z *= 2.0;\r
    p *= 2.0;\r
  }\r
  return rz;\r
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec2 st2 = materialInput.st;\r
  float time = fract( czm_frameNumber * speed / 1000.0);\r
  if (st.t < 0.5) {\r
    discard;\r
  }\r
  st *= 4.;\r
  float rz = fbm(st);\r
  st /= exp(mod( time * 2.0, pi));\r
  rz *= pow(15., 0.9);\r
  vec4 temp = vec4(0);\r
  temp = mix( color / rz, vec4(color.rgb, 0.1), 0.2);\r
  if (st2.s < 0.05) {\r
    temp = mix(vec4(color.rgb, 0.1), temp, st2.s / 0.05);\r
  }\r
  if (st2.s > 0.95){\r
    temp = mix(temp, vec4(color.rgb, 0.1), (st2.s - 0.95) / 0.05);\r
  }\r
  material.diffuse = temp.rgb;\r
  material.alpha = temp.a * 2.0;\r
  return material;\r
}`,Ao=`uniform vec4 color;\r
uniform float speed;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  float alpha = abs(smoothstep(0.5,1.,fract( -st.t - time)));\r
  alpha += .1;\r
  material.alpha = alpha;\r
  material.diffuse = color.rgb;\r
  return material;\r
}`;Cesium.Material.EllipsoidElectricType="EllipsoidElectric";Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidElectricType,{fabric:{type:Cesium.Material.EllipsoidElectricType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:1},source:fo},translucent:function(i){return!0}});Cesium.Material.EllipsoidTrailType="EllipsoidTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.EllipsoidTrailType,{fabric:{type:Cesium.Material.EllipsoidTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:Ao},translucent:function(i){return!0}});var go=`uniform vec4 color;\r
uniform float speed;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  float time = fract( czm_frameNumber  *  speed / 1000.0);\r
  vec2 st = materialInput.st;\r
  float scalar = smoothstep(0.0,1.0,time);\r
  material.diffuse = color.rgb * scalar;\r
  material.alpha = color.a * scalar ;\r
  return material;\r
}`,Eo=`uniform vec4 color;\r
uniform float speed;\r
uniform float percent;\r
uniform float gradient;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  float t =fract(czm_frameNumber * speed / 1000.0);\r
  t *= (1.0 + percent);\r
  float alpha = smoothstep(t- percent, t, st.s) * step(-t, -st.s);\r
  alpha += gradient;\r
  material.diffuse = color.rgb;\r
  material.alpha = alpha;\r
  return material;\r
}`,Bo=`uniform sampler2D image;\r
uniform float speed;\r
uniform vec4 color;\r
uniform vec2 repeat;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = repeat * materialInput.st;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\r
  if (color.a == 0.0){\r
    if (colorImage.rgb == vec3(1.0) || colorImage.rgb == vec3(0.0)){\r
      discard;\r
    }\r
    material.alpha = colorImage.a;\r
    material.diffuse = colorImage.rgb;\r
  } else {\r
    material.alpha = colorImage.a * color.a;\r
    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\r
  }\r
  return material;\r
}`,_o=`uniform sampler2D image;\r
uniform vec4 color;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec4 colorImage = texture(image,st);\r
  vec3 fragColor = color.rgb;\r
  material.alpha = colorImage.a * color.a * 3.;\r
  material.diffuse = max(fragColor.rgb  +  colorImage.rgb , fragColor.rgb);\r
  return material;\r
}`,xo=`uniform sampler2D image;\r
uniform vec4 color;\r
uniform float speed;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  vec4 colorImage = texture(image,st);\r
  vec3 fragColor = color.rgb;\r
  if(st.t > 0.45 && st.t < 0.55 ) {\r
    fragColor = vec3(1.0);\r
  }\r
  if(color.a == 0.0){\r
    material.alpha = colorImage.a * 1.5 * fract(st.s - time);\r
    material.diffuse = colorImage.rgb;\r
  }else{\r
    material.alpha = colorImage.a * color.a * 1.5 * smoothstep(.0,1., fract(st.s - time));\r
    material.diffuse = max(fragColor.rgb * material.alpha , fragColor.rgb);\r
  }\r
  return material;\r
}`,yo=`uniform vec4 color;\r
uniform float speed;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
   czm_material material = czm_getDefaultMaterial(materialInput);\r
   vec2 st = materialInput.st;\r
   float time = fract(czm_frameNumber * speed / 1000.0);\r
   material.diffuse = color.rgb;\r
   material.alpha = color.a * fract(st.s-time);\r
   return material;\r
}`,To=`#ifdef GL_OES_standard_derivatives\r
#extension GL_OES_standard_derivatives : enable\r
#endif\r

uniform vec4 color;\r
uniform float dashLength;\r
uniform float dashPattern;

uniform float maskLength;\r
uniform float outlineWidth;\r
uniform vec4 outlineColor;

in float v_polylineAngle;\r
in float v_width; 
mat2 rotate(float rad) {\r
    float c = cos(rad);\r
    float s = sin(rad);\r
    return mat2(\r
    c, s,\r
    -s, c\r
    );\r
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
    
    czm_material material = czm_getDefaultMaterial(materialInput);

    
    
    vec2 st = materialInput.st;\r
    
    float halfInteriorWidth =  0.5 * (v_width - outlineWidth) / v_width;\r
    
    float b = step(0.5 - halfInteriorWidth, st.t);\r
    b *= 1.0 - step(0.5 + halfInteriorWidth, st.t);\r
    
    float d1 = abs(st.t - (0.5 - halfInteriorWidth));\r
    float d2 = abs(st.t - (0.5 + halfInteriorWidth));\r
    float dist = min(d1, d2);\r
    
    vec4 currentColor = mix(outlineColor, color, b);\r
    
    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist);\r
    
    vec4 gapColor = czm_gammaCorrect(outColor);\r

    
    
    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;\r
    
    float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));\r
    
    float maskIndex = floor(dashPosition * maskLength);\r
    
    float maskTest = floor(dashPattern / pow(2.0, maskIndex));\r
    
    vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;\r
    if (fragColor.a < 0.005) {\r
        discard;\r
    }\r
    
    fragColor = czm_gammaCorrect(fragColor);\r
    material.emission = fragColor.rgb;\r
    material.alpha = fragColor.a;\r
    return material;\r
}`,vo=`#ifdef GL_OES_standard_derivatives\r
#extension GL_OES_standard_derivatives : enable\r
#endif

uniform vec4 color;\r
uniform float repeatFactor;
uniform bool antiClockWise; 

float getPointOnLine(vec2 p0, vec2 p1, float x)\r
{\r
    float slope = (p0.y - p1.y) / (p0.x - p1.x);
    return slope * (x - p0.x) + p0.y;
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;

    if (antiClockWise) {  
        st.s = 1.0 - st.s;\r
    }

    float arrowWidth = 1.0 / repeatFactor;

    
    st.s = mod(st.s, arrowWidth) / arrowWidth;

    
    #if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\r
    float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;\r
    #else\r
    float base = 0.995;\r
    #endif

    vec2 center = vec2(1.0, 0.5);

    
    center.s += 0.01;

    
    float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);\r
    float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);

    float halfWidth = 0.15;
    
    float s = step(0.5 - halfWidth, st.t);\r
    s *= 1.0 - step(0.5 + halfWidth, st.t);\r
    s *= 1.0 - step(base, st.s);

    
    float t = step(base, st.s);\r
    t *= 1.0 - step(ptOnUpperLine, st.t);\r
    t *= step(ptOnLowerLine, st.t);

    
    float dist;\r
    if (st.s < base)\r
    {\r
        float d1 = abs(st.t - (0.5 - halfWidth));\r
        float d2 = abs(st.t - (0.5 + halfWidth));\r
        dist = min(d1, d2);\r
    }\r
    else\r
    {\r
        float d1 = czm_infinity;\r
        if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\r
        {\r
            d1 = abs(st.s - base);\r
        }\r
        float d2 = abs(st.t - ptOnUpperLine);\r
        float d3 = abs(st.t - ptOnLowerLine);\r
        dist = min(min(d1, d2), d3);\r
    }

    vec4 outsideColor = vec4(0.0);
    
    vec4 currentColor = mix(outsideColor, color, clamp(s + t, 0.0, 1.0));\r
    
    vec4 outColor = czm_antialias(outsideColor, color, currentColor, dist);

    outColor = czm_gammaCorrect(outColor);\r
    material.diffuse = outColor.rgb;
    material.alpha = outColor.a;

    return material;
}`,Mo=`#ifdef GL_OES_standard_derivatives\r
#extension GL_OES_standard_derivatives : enable\r
#endif

uniform vec4 color;\r
uniform vec4 gapColor;\r
uniform float dashLength;\r
uniform float dashPattern;

in float v_polylineAngle;\r
in float v_width;

const float maskLength = 16.0;

mat2 rotate(float rad) {\r
        float c = cos(rad);\r
    float s = sin(rad);\r
    return mat2(\r
            c, s,\r
        -s, c\r
    );\r
}

float getPointOnLine(vec2 p0, vec2 p1, float x)\r
{\r
        float slope = (p0.y - p1.y) / (p0.x - p1.x);\r
    return slope * (x - p0.x) + p0.y;\r
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
        czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

    
    float dashPosition = fract(pos.x / (dashLength * czm_pixelRatio));\r
    
    float maskIndex = floor(dashPosition * maskLength);\r
    
    float maskTest = floor(dashPattern / pow(2.0, maskIndex));\r
    vec4 fragColor = (mod(maskTest, 2.0) < 1.0) ? gapColor : color;

    vec2 st = materialInput.st;

#ifdef GL_OES_standard_derivatives\r
    float base = 1.0 - abs(fwidth(st.s)) * 10.0 * czm_pixelRatio;\r
#else\r
    float base = 0.975; 
#endif

    vec2 center = vec2(1.0, 0.5);\r
    float ptOnUpperLine = getPointOnLine(vec2(base, 1.0), center, st.s);\r
    float ptOnLowerLine = getPointOnLine(vec2(base, 0.0), center, st.s);

    float halfWidth = 0.15;\r
    float s = step(0.5 - halfWidth, st.t);\r
    s *= 1.0 - step(0.5 + halfWidth, st.t);\r
    s *= 1.0 - step(base, st.s);

    float t = step(base, materialInput.st.s);\r
    t *= 1.0 - step(ptOnUpperLine, st.t);\r
    t *= step(ptOnLowerLine, st.t);

    
    float dist;\r
    if (st.s < base)\r
    {\r
        if (fragColor.a < 0.005) {   
            discard;\r
        }\r
        float d1 = abs(st.t - (0.5 - halfWidth));\r
        float d2 = abs(st.t - (0.5 + halfWidth));\r
        dist = min(d1, d2);\r
    }\r
    else\r
    {\r
        fragColor = color;\r
        float d1 = czm_infinity;\r
        if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\r
        {\r
            d1 = abs(st.s - base);\r
        }\r
        float d2 = abs(st.t - ptOnUpperLine);\r
        float d3 = abs(st.t - ptOnLowerLine);\r
        dist = min(min(d1, d2), d3);\r
    }

    vec4 outsideColor = vec4(0.0);\r
    vec4 currentColor = mix(outsideColor, fragColor, clamp(s + t, 0.0, 1.0));\r
    vec4 outColor = czm_antialias(outsideColor, fragColor, currentColor, dist);

    outColor = czm_gammaCorrect(outColor);\r
    material.diffuse = outColor.rgb;\r
    material.alpha = outColor.a;\r
    return material;\r
}`,Po=`#ifdef GL_OES_standard_derivatives\r
#extension GL_OES_standard_derivatives : enable\r
#endif

uniform vec4 color;\r
uniform vec4 directionColor; 
uniform vec4 outlineColor; 
uniform float outlineWidth; 

in float v_width; 
in float v_polylineAngle; 

const float fragLength = 100.0; 
const float startPosition = 0.45; 
const float endPosition = 0.55; 

mat2 rotate(float rad) {\r
    float c = cos(rad);\r
    float s = sin(rad);\r
    return mat2(\r
    c, s,\r
    -s, c\r
    );\r
}

float getPointOnLine(vec2 p0, vec2 p1, float x)\r
{\r
    float slope = (p0.y - p1.y) / (p0.x - p1.x); 
    return slope * (x - p0.x) + p0.y; 
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
    
    czm_material material = czm_getDefaultMaterial(materialInput);\r
    vec2 st = materialInput.st;

    
    float halfInteriorWidth =  0.5 * (v_width - outlineWidth) / v_width;\r
    float b = step(0.5 - halfInteriorWidth, st.t);\r
    b *= 1.0 - step(0.5 + halfInteriorWidth, st.t);

    
    float d1 = abs(st.t - (0.5 - halfInteriorWidth));\r
    float d2 = abs(st.t - (0.5 + halfInteriorWidth));\r
    float dist = min(d1, d2);

    vec4 currentColor = mix(outlineColor, color, b);\r
    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist);\r
    outColor = czm_gammaCorrect(outColor);

    
    vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;

    
    float maskS = fract(pos.x / (fragLength * czm_pixelRatio));

    float maskT = st.t;\r
    
    bool isDirection = (maskS > startPosition) && (maskS <= endPosition);

    vec4 fragColor;\r
    if (isDirection) {\r
        
        float arrowWidth = (endPosition - startPosition) / 2.0;\r
        float midS = startPosition + arrowWidth;

        float t = 1.0;\r
        if (maskS < midS) {\r
            
            vec2 center = vec2(midS, 0.5);\r
            float ptOnUpperLine = getPointOnLine(vec2(startPosition, 1.0), center, maskS); 
            float ptOnLowerLine = getPointOnLine(vec2(startPosition, 0.0), center, maskS); 

            t *= 1.0 - step(ptOnUpperLine, maskT); 
            t *= step(ptOnLowerLine, maskT); 
            t = 1.0 - t; 
        } else {\r
            
            vec2 center = vec2(endPosition, 0.5);\r
            float ptOnUpperLine = getPointOnLine(vec2(midS, 1.0), center, maskS); 
            float ptOnLowerLine = getPointOnLine(vec2(midS, 0.0), center, maskS); 

            t *= 1.0 - step(ptOnUpperLine, maskT); 
            t *= step(ptOnLowerLine, maskT); 
        }

        vec4 outsideColor = outColor;\r
        vec4 currentColor = mix(outsideColor, directionColor, clamp(t, 0.0, 1.0));\r
        fragColor = currentColor;\r
    } else {\r
        fragColor = outColor;\r
    }

    fragColor = czm_gammaCorrect(fragColor);\r
    material.diffuse = fragColor.rgb;\r
    material.alpha = fragColor.a;\r
    return material;\r
}`,Do=`uniform vec4 color; 
uniform float startType; 
uniform float endType; 
uniform vec4 outlineColor; 
uniform bool outlineShow;\r
uniform float lineWidth;

const float SHAPE_TYPE_NORMAL = 0.0; 
const float SHAPE_TYPE_ARROW= 1.0; 
const float SHAPE_TYPE_CIRCLE = 2.0; 
const float SHAPE_TYPE_END = 3.0; 

const float ratio = 2.5; 

float outlineWidth = 0.005; 

float getArrowPointOnLine(vec2 p0, vec2 p1, float x){\r
    float slope = (p0.y - p1.y) / (p0.x - p1.x);\r
    return slope * (x - p0.x) + p0.y;\r
}

float getCirclePointOnLine(vec2 center, float radius, float x, float upper) {\r
    
    float dx = x - center.x;\r
    \r
    
    float dy = sqrt(radius * radius - dx * dx);

    dy = dy * 0.5 / radius;\r
    \r
    
    if (upper == 1.0) {\r
        return center.y + dy; 
    } else {\r
        return center.y - dy; 
    }\r
}

czm_material czm_getMaterial(czm_materialInput materialInput)\r
{\r
    czm_material material = czm_getDefaultMaterial(materialInput);

    vec2 st = materialInput.st;

    #if (__VERSION__ == 300 || defined(GL_OES_standard_derivatives))\r
        float base = 1.0 - abs(fwidth(st.s)) * lineWidth * ratio * czm_pixelRatio;\r
    #else\r
        
        float base = 0.975;\r
    #endif

    float reverseBase = 1.0 - base;\r
    float halfB = reverseBase / 2.0;\r
    float baseLeft = reverseBase;

    if(startType == SHAPE_TYPE_END) {\r
      baseLeft = halfB;\r
    }

    if(endType == SHAPE_TYPE_END) {\r
      base += halfB;\r
    }

    
    float circleOffset = 0.01 * baseLeft;

    float halfWidth = 0.08;

  
  if(st.s < baseLeft) {

    if(outlineShow) {\r
      halfWidth += outlineWidth;\r
    }

    float ptOnUpperLineLeft = 0.5 + halfWidth;\r
    float ptOnLowerLineLeft = 0.5 - halfWidth;

    if(startType == SHAPE_TYPE_CIRCLE && st.s < baseLeft - circleOffset) {\r
      float r = baseLeft / 2.0;\r
      vec2 leftCenter = vec2(r, 0.5);

      ptOnUpperLineLeft = getCirclePointOnLine(leftCenter, r, st.s, 1.0);\r
      ptOnLowerLineLeft = getCirclePointOnLine(leftCenter, r, st.s, 0.0);\r
    } else if(startType == SHAPE_TYPE_END) {\r
      ptOnUpperLineLeft = 1.0;\r
      ptOnLowerLineLeft = 0.0;\r
    } else if(startType == SHAPE_TYPE_ARROW) {\r
      vec2 leftCenter = vec2(0.0, 0.5);\r
      ptOnUpperLineLeft = getArrowPointOnLine(vec2(baseLeft, 1.0), leftCenter, st.s);\r
      ptOnLowerLineLeft = getArrowPointOnLine(vec2(baseLeft, 0.0), leftCenter, st.s);\r
    }

    float t = 1.0 - step(ptOnUpperLineLeft, st.t);\r
    t *= step(ptOnLowerLineLeft, st.t);

    float d1 = czm_infinity;\r
    if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\r
    {\r
        d1 = abs(st.s - baseLeft);\r
    }\r
    float d2 = abs(st.t - ptOnUpperLineLeft);\r
    float d3 = abs(st.t - ptOnLowerLineLeft);\r
    float dist = min(min(d1, d2), d3);

    float dtUpper = abs(st.t - ptOnUpperLineLeft);\r
    dtUpper = step(dtUpper, outlineWidth);

    float dtLower = abs(st.t - ptOnLowerLineLeft);\r
    dtLower = step(dtLower, outlineWidth);

    vec4 contentColor;\r
    if(outlineShow) {\r
      contentColor = mix(color, outlineColor, clamp(dtUpper + dtLower, 0.0, 1.0));\r
    } else {\r
      contentColor = color;\r
    }

    vec4 outsideColor = vec4(0.0);\r
    vec4 currentColor = mix(outsideColor, contentColor, clamp(t, 0.0, 1.0));\r
    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist, 0.05);

    outColor = czm_gammaCorrect(outColor);\r
    material.diffuse = outColor.rgb;\r
    material.alpha = outColor.a;\r
    \r
    return material;\r
  } else if(st.s <= base) {

    float fuzzFactor = 0.1; 
    if(lineWidth > 10.0) {\r
      fuzzFactor = 0.05; 
    }

    if(outlineShow) {\r
      halfWidth += outlineWidth;\r
    }

    float ptOnUpperLineRight = 0.5 + halfWidth;\r
    float ptOnLowerLineRight = 0.5 - halfWidth;

    float s = step(0.5 - halfWidth, st.t);\r
    s *= 1.0 - step(0.5 + halfWidth, st.t);\r
    s *= 1.0 - step(base, st.s);

    float t = step(base, materialInput.st.s);\r
    t *= 1.0 - step(ptOnUpperLineRight, st.t);\r
    t *= step(ptOnLowerLineRight, st.t);

    
    float d1 = abs(st.t - (0.5 - halfWidth));\r
    float d2 = abs(st.t - (0.5 + halfWidth));\r
    float dist = min(d1, d2);

    float dtUpper = abs(st.t - (0.5 + halfWidth));\r
    dtUpper = step(dtUpper, outlineWidth);

    float dtLower = abs(st.t - (0.5 - halfWidth));\r
    dtLower = step(dtLower, outlineWidth);

    vec4 contentColor;\r
    if(outlineShow) {\r
      contentColor = mix(color, outlineColor, clamp(dtUpper + dtLower, 0.0, 1.0));\r
    } else {\r
      contentColor = color;\r
    }

    vec4 outsideColor = vec4(contentColor.r, contentColor.g, contentColor.b, 0.0);\r
    vec4 currentColor = mix(outsideColor, contentColor, clamp(s + t, 0.0, 1.0));

    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist, fuzzFactor);\r

    float delta = outlineWidth * 10.0;

    outColor = czm_gammaCorrect(outColor);\r
    material.diffuse = outColor.rgb;\r
    material.alpha = outColor.a;\r
    return material;\r
  } else {

    if(outlineShow) {\r
      halfWidth += outlineWidth;\r
    }

    float ptOnUpperLineRight = 0.5 + halfWidth;\r
    float ptOnLowerLineRight = 0.5 - halfWidth;

    if(endType == SHAPE_TYPE_CIRCLE && st.s > base + circleOffset) {\r
      float r = reverseBase / 2.0;\r
      vec2 rightCenter = vec2(1.0 - r, 0.5);

      ptOnUpperLineRight = getCirclePointOnLine(rightCenter, r, st.s, 1.0);\r
      ptOnLowerLineRight = getCirclePointOnLine(rightCenter, r, st.s, 0.0);\r
    } else if(endType == SHAPE_TYPE_END) {\r
      ptOnUpperLineRight = 1.0;\r
      ptOnLowerLineRight = 0.0;\r
    } else if(endType == SHAPE_TYPE_ARROW) {\r
      vec2 rightCenter = vec2(1.0, 0.5);

      ptOnUpperLineRight = getArrowPointOnLine(vec2(base, 1.0), rightCenter, st.s);\r
      ptOnLowerLineRight = getArrowPointOnLine(vec2(base, 0.0), rightCenter, st.s);\r
    }

    float s = step(0.5 - halfWidth, st.t);\r
    s *= 1.0 - step(0.5 + halfWidth, st.t);\r
    s *= 1.0 - step(base, st.s);

    float t = step(base, materialInput.st.s);\r
    t *= 1.0 - step(ptOnUpperLineRight, st.t);\r
    t *= step(ptOnLowerLineRight, st.t);

    

    float d1 = czm_infinity;\r
    if (st.t < 0.5 - halfWidth && st.t > 0.5 + halfWidth)\r
    {\r
        d1 = abs(st.s - base);\r
    }\r
    float d2 = abs(st.t - ptOnUpperLineRight);\r
    float d3 = abs(st.t - ptOnLowerLineRight);\r
    float dist = min(min(d1, d2), d3);

    float dtUpper = abs(st.t - ptOnUpperLineRight);\r
    dtUpper = step(dtUpper, outlineWidth);

    float dtLower = abs(st.t - ptOnLowerLineRight);\r
    dtLower = step(dtLower, outlineWidth);

    vec4 contentColor;\r
    if(outlineShow) {\r
      contentColor = mix(color, outlineColor, clamp(dtUpper + dtLower, 0.0, 1.0));\r
    } else {\r
      contentColor = color;\r
    }

    vec4 outsideColor = vec4(contentColor.r, contentColor.g, contentColor.b, 0.0);\r
    vec4 currentColor = mix(outsideColor, contentColor, clamp(s + t, 0.0, 1.0));

    vec4 outColor = czm_antialias(outlineColor, color, currentColor, dist, 0.05);

    outColor = czm_gammaCorrect(outColor);\r
    material.diffuse = outColor.rgb;\r
    material.alpha = outColor.a;\r
    return material;\r
  }\r
}`;Cesium.Material.PolylineFlickerType="PolylineFlicker";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineFlickerType,{fabric:{type:Cesium.Material.PolylineFlickerType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:1},source:go},translucent:function(i){return!0}});Cesium.Material.PolylineFlowType="PolylineFlow";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineFlowType,{fabric:{type:Cesium.Material.PolylineFlowType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:1,percent:.03,gradient:.1},source:Eo},translucent:function(i){return!0}});Cesium.Material.PolylineImageTrailType="PolylineImageTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineImageTrailType,{fabric:{type:Cesium.Material.PolylineImageTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId,speed:1,repeat:new Cesium.Cartesian2(1,1)},source:Bo},translucent:function(i){return!0}});Cesium.Material.PolylineLightingType="PolylineLighting";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightingType,{fabric:{type:Cesium.Material.PolylineLightingType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId},source:_o},translucent:function(i){return!0}});Cesium.Material.PolylineLightingTrailType="PolylineLightingTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineLightingTrailType,{fabric:{type:Cesium.Material.PolylineLightingTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId,speed:3},source:xo},translucent:function(i){return!0}});Cesium.Material.PolylineTrailType="PolylineTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailType,{fabric:{type:Cesium.Material.PolylineTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId,speed:1,repeat:new Cesium.Cartesian2(1,1)},source:yo},translucent:function(i){return!0}});Cesium.Material.PolylineFenceType="PolylineFence";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineFenceType,{fabric:{type:Cesium.Material.PolylineFenceType,uniforms:{color:new Cesium.Color(1,1,1,1),outlineColor:new Cesium.Color(1,1,1,1),dashLength:10,dashPattern:15,outlineWidth:16,maskLength:20},source:To},translucent:function(i){return!0}});Cesium.Material.PolylineMultiArrowType="PolylineMultiArrow";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineMultiArrowType,{strict:!0,fabric:{type:Cesium.Material.PolylineMultiArrowType,uniforms:{color:Cesium.Color.WHITE,repeatFactor:1,antiClockWise:!0},source:vo},translucent:function(i){return!0}});Cesium.Material.PolylineDashArrowType="PolylineDashArrow";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineDashArrowType,{strict:!0,fabric:{type:Cesium.Material.PolylineDashArrowType,uniforms:{color:Cesium.Color.WHITE,gapColor:Cesium.Color.TRANSPARENT,dashLength:16,dashPattern:255},source:Mo},translucent:function(i){return!0}});Cesium.Material.PolylineDirectionType="PolylineDirection";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineDirectionType,{fabric:{type:Cesium.Material.PolylineDirectionType,uniforms:{color:new Cesium.Color(0,1,1,1),directionColor:new Cesium.Color(1,1,1,1),outlineColor:new Cesium.Color(1,1,1,1),outlineWidth:0},source:Po},translucent:function(i){return!0}});Cesium.Material.PolylineCustomEndpointType="PolylineCustomEndpoint";Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineCustomEndpointType,{strict:!0,fabric:{type:Cesium.Material.PolylineCustomEndpointType,uniforms:{color:Cesium.Color.WHITE,startType:0,endType:0,outlineColor:Cesium.Color.WHITE,outlineShow:!1,lineWidth:3},source:Do},translucent:function(i){return!0}});var Io=`uniform vec4 color;\r
uniform float speed;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st * 2.0 - 1.0;\r
  float t = czm_frameNumber * speed / 1000.0 ;\r
  vec3 col = vec3(0.0);\r
  vec2 p = vec2(sin(t), cos(t));\r
  float d = length(st - dot(p, st) * p);\r
  if (dot(st, p) < 0.) {\r
    d = length(st);\r
  }

  col = .006 / d * color.rgb;

  if(distance(st,vec2(0)) >  0.99 ){\r
    col =color.rgb;\r
  }

  material.alpha  = pow(length(col),2.0);\r
  material.diffuse = col * 3.0 ;\r
  return material;\r
}`,Lo=`uniform vec4 color;\r
uniform float speed;

#define PI 3.14159265359

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec2 scrPt = st * 2.0 - 1.0;\r
  float time = czm_frameNumber * speed / 1000.0 ;\r
  vec3 col = vec3(0.0);\r
  mat2 rot;\r
  float theta = -time * 1.0 * PI - 2.2;\r
  float cosTheta, sinTheta;\r
  cosTheta = cos(theta);\r
  sinTheta = sin(theta);\r
  rot[0][0] = cosTheta;\r
  rot[0][1] = -sinTheta;\r
  rot[1][0] = sinTheta;\r
  rot[1][1] = cosTheta;\r
  vec2 scrPtRot = rot * scrPt;\r
  float angle = 1.0 - (atan(scrPtRot.y, scrPtRot.x) / 6.2831 + 0.5);\r
  float falloff = 1.0 - length(scrPtRot);\r
  float ringSpacing = 0.23;\r
  if(mod(length(scrPtRot), ringSpacing) < 0.015 && length(scrPtRot) / ringSpacing < 5.0) {\r
    col += vec3(0, 0.5, 0);\r
  }\r
  col += vec3(0, 0.8, 0) * step(mod(length(scrPtRot), ringSpacing), 0.01) * step(length(scrPtRot), 1.0);\r
  material.alpha =pow(length(col + vec3(.5)),5.0);\r
  material.diffuse =  (0.5 +  pow(angle, 2.0) * falloff ) *   color.rgb    ;\r
  return material;\r
}`,So=`uniform vec4 color;\r
uniform float speed;

#define PI 3.14159265359

float rand(vec2 co){\r
  return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\r
}

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  vec2 pos = st - vec2(0.5);\r
  float time = czm_frameNumber * speed / 1000.0 ;\r
  float r = length(pos);\r
  float t = atan(pos.y, pos.x) - time * 2.5;\r
  float a = (atan(sin(t), cos(t)) + PI)/(2.0*PI);\r
  float ta = 0.5;\r
  float v = smoothstep(ta-0.05,ta+0.05,a) * smoothstep(ta+0.05,ta-0.05,a);\r
  vec3 flagColor = color.rgb * v;\r
  float blink = pow(sin(time*1.5)*0.5+0.5, 0.8);\r
  flagColor = color.rgb *  pow(a, 8.0*(.2+blink))*(sin(r*500.0)*.5+.5) ;\r
  flagColor = flagColor * pow(r, 0.4);\r
  material.alpha = length(flagColor) * 1.3;\r
  material.diffuse = flagColor * 3.0;\r
  return material;\r
}`,wo=`uniform vec4 color;\r
uniform float speed;\r
uniform float repeat;\r
uniform float thickness;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  float sp = 1.0 / repeat;\r
  vec2 st = materialInput.st;\r
  float dis = distance(st, vec2(0.5));\r
  float t = czm_frameNumber * speed / 1000.0;\r
  float m = mod(dis - fract(t), sp);\r
  float a = step(sp * (1.0 - thickness), m);\r
  material.diffuse = color.rgb;\r
  material.alpha   = a * color.a;\r
  return material;\r
}`;Cesium.Material.RadarLineType="RadarLine";Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarLineType,{fabric:{type:Cesium.Material.RadarLineType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:Io},translucent:function(i){return!0}});Cesium.Material.RadarSweepType="RadarSweep";Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarSweepType,{fabric:{type:Cesium.Material.RadarSweepType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:Lo},translucent:function(i){return!0}});Cesium.Material.RadarWaveType="RadarWave";Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarWaveType,{fabric:{type:Cesium.Material.RadarWaveType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3},source:So},translucent:function(i){return!0}});Cesium.Material.RadarOuterType="RadarOuter";Cesium.Material._materialCache.addMaterial(Cesium.Material.RadarOuterType,{fabric:{type:Cesium.Material.RadarOuterType,uniforms:{color:new Cesium.Color(1,0,0,.7),speed:3,repeat:30,thickness:.3},source:wo},translucent:function(i){return!0}});var Fo=`uniform vec4 color;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st;\r
  material.diffuse = color.rgb * 2.0;\r
  material.alpha = color.a * (1.0-fract(st.t)) * 0.8;\r
  return material;\r
}`,Ro=`uniform sampler2D image;\r
uniform vec4 color;\r
uniform float speed;\r
uniform vec2 repeat;\r
czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  vec2 st = materialInput.st * repeat;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  vec4 colorImage = texture(image, vec2(fract(st.s - time), st.t));\r
  material.alpha =  colorImage.a * color.a ;\r
  material.diffuse = colorImage.rgb * color.rgb * 3.0 ;\r
  return material;\r
}`,bo=`uniform sampler2D image;\r
uniform float speed;\r
uniform vec4 color;\r
uniform vec2 repeat;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
  czm_material material = czm_getDefaultMaterial(materialInput);\r
  float perDis = 1.0 / repeat.y / 3.0  ;\r
  vec2 st = materialInput.st * repeat;\r
  float time = fract(czm_frameNumber * speed / 1000.0);\r
  vec4 colorImage = texture(image, vec2(st.s, fract(st.t - time)));\r
  material.alpha =  colorImage.a * smoothstep(.2 ,1. ,distance(st.t * perDis ,1. + perDis ));\r
  material.diffuse = max(color.rgb * material.alpha * 1.5, color.rgb);\r
  material.emission = max(color.rgb * material.alpha * 1.5, color.rgb);\r
  return material;\r
}`,No=`uniform sampler2D image;\r
 uniform float speed;\r
 uniform vec4 color;

czm_material czm_getMaterial(czm_materialInput materialInput){\r
   czm_material material = czm_getDefaultMaterial(materialInput);\r
   vec2 st = materialInput.st;\r
   float time = fract(czm_frameNumber * speed / 1000.0);\r
   vec4 colorImage = texture(image, vec2(fract(st.t - time), st.t));\r
   if(color.a == 0.0){\r
    material.alpha = colorImage.a;\r
    material.diffuse = colorImage.rgb;\r
   }else{\r
    material.alpha = colorImage.a * color.a;\r
    material.diffuse = max(color.rgb * material.alpha * 3.0, color.rgb);\r
   }\r
   return material;\r
}`;Cesium.Material.WallDiffuseType="WallDiffuse";Cesium.Material._materialCache.addMaterial(Cesium.Material.WallDiffuseType,{fabric:{type:Cesium.Material.WallDiffuseType,uniforms:{color:new Cesium.Color(1,0,0,.7)},source:Fo},translucent:function(i){return!0}});Cesium.Material.WallImageTrailType="WallImageTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.WallImageTrailType,{fabric:{type:Cesium.Material.WallImageTrailType,uniforms:{image:Cesium.Material.DefaultImageId,color:new Cesium.Color(1,0,0,.7),speed:3,repeat:new Cesium.Cartesian2(1,1)},source:Ro},translucent:function(i){return!0}});Cesium.Material.WallLineTrailType="WallLineTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.WallLineTrailType,{fabric:{type:Cesium.Material.WallLineTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId,repeat:new Cesium.Cartesian2(1,1),speed:3},source:bo},translucent:function(i){return!0}});Cesium.Material.WallTrailType="WallTrail";Cesium.Material._materialCache.addMaterial(Cesium.Material.WallTrailType,{fabric:{type:Cesium.Material.WallTrailType,uniforms:{color:new Cesium.Color(1,0,0,.7),image:Cesium.Material.DefaultImageId,speed:1},source:No},translucent:function(i){return!0}});class U{constructor(e={}){this._definitionChanged=new Cesium.Event,this._color=void 0,this._speed=void 0,this.color=e.color||Cesium.Color.fromBytes(0,255,255,255),this.speed=e.speed||1}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(e){return null}getValue(e,t){return t=Cesium.defaultValue(t,{}),t}equals(e){return this===e}}class st extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleBlurType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof st&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(st.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class lt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleDiffuseType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof lt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(lt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class ct extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleFadeType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof ct&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(ct.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class ut extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CirclePulseType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof ut&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(ut.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class dt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleScanType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof dt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(dt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class mt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleSpiralType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof mt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(mt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class Ct extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.CircleVaryType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof Ct&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(Ct.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class pt extends U{constructor(e={}){super(e),this.count=Math.max(e.count||3,1),this.gradient=Cesium.Math.clamp(e.gradient||.1,0,1)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(e){return Cesium.Material.CircleWaveType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t.count=Cesium.Property.getValueOrUndefined(this._count,e),t.gradient=Cesium.Property.getValueOrUndefined(this._gradient,e),t}equals(e){return this===e||e instanceof pt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)&&Cesium.Property.equals(this._count,e._count)&&Cesium.Property.equals(this._gradient,e._gradient)}}Object.defineProperties(pt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),count:Cesium.createPropertyDescriptor("count"),gradient:Cesium.createPropertyDescriptor("gradient")});class ht extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.EllipsoidElectricType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof ht&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(ht.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class ft extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.EllipsoidTrailType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof ft&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(ft.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class At extends U{constructor(e={}){super(e),this.color=e.color||Cesium.Color.WHITE,this._startType=void 0,this._startTypeSubscription=void 0,this.startType=e.startType,this._endType=void 0,this._endTypeSubscription=void 0,this.endType=e.endType,this._outlineShow=void 0,this._outlineShowSubscription=void 0,this.outlineShow=e.outlineShow||!1,this._lineWidth=void 0,this._lineWidthSubscription=void 0,this.lineWidth=e.lineWidth,this._outlineColor=void 0,this._outlineColorSubscription=void 0,this.outlineColor=e.outlineColor||(this.outlineShow?Cesium.Color.WHITE:this.color)}getType(e){return Cesium.Material.PolylineCustomEndpointType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.startType=Cesium.Property.getValueOrUndefined(this._startType,e),t.endType=Cesium.Property.getValueOrUndefined(this._endType,e),t.outlineShow=Cesium.Property.getValueOrUndefined(this._outlineShow,e),t.lineWidth=Cesium.Property.getValueOrUndefined(this._lineWidth,e),t.outlineColor=Cesium.Property.getValueOrUndefined(this._outlineColor,e),t}equals(e){return this===e||e instanceof At&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._startType,e._startType)&&Cesium.Property.equals(this._endType,e._endType)&&Cesium.Property.equals(this._outlineShow,e._outlineShow)&&Cesium.Property.equals(this._lineWidth,e._lineWidth)&&Cesium.Property.equals(this._outlineColor,e._outlineColor)}}Object.defineProperties(At.prototype,{color:Cesium.createPropertyDescriptor("color"),startType:Cesium.createPropertyDescriptor("startType"),endType:Cesium.createPropertyDescriptor("endType"),outlineShow:Cesium.createPropertyDescriptor("outlineShow"),lineWidth:Cesium.createPropertyDescriptor("lineWidth"),outlineColor:Cesium.createPropertyDescriptor("outlineColor")});class gt extends U{constructor(e={}){super(e),this._outlineWidth=void 0,this._outlineWidthSubscription=void 0,this.outlineWidth=e.outlineWidth,this._outlineColor=void 0,this._outlineColorSubscription=void 0,this.outlineColor=e.outlineColor}getType(e){return Cesium.Material.PolylineDirectionType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.outlineWidth=Cesium.Property.getValueOrUndefined(this._outlineWidth,e),t.outlineColor=Cesium.Property.getValueOrUndefined(this._outlineColor,e),t}equals(e){return this===e||e instanceof gt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._outlineWidth,e._outlineWidth)&&Cesium.Property.equals(this._outlineColor,e._outlineColor)}}Object.defineProperties(gt.prototype,{color:Cesium.createPropertyDescriptor("color"),outlineWidth:Cesium.createPropertyDescriptor("outlineWidth"),outlineColor:Cesium.createPropertyDescriptor("outlineColor")});class Et extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.PolylineDashArrowType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t}equals(e){return this===e||e instanceof Et&&Cesium.Property.equals(this._color,e._color)}}Object.defineProperties(Et.prototype,{color:Cesium.createPropertyDescriptor("color")});class Bt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.PolylineEmissionType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t}equals(e){return this===e||e instanceof Bt&&Cesium.Property.equals(this._color,e._color)}}Object.defineProperties(Bt.prototype,{color:Cesium.createPropertyDescriptor("color")});class _t extends U{constructor(e={}){super(e),this.color=e.color||Cesium.Color.WHITE,this._outlineColor=void 0,this._outlineColorSubscription=void 0,this.outlineColor=e.outlineColor||new Cesium.Color(1,1,1,0),this._outlineWidth=void 0,this._outlineWidthSubscription=void 0,this.outlineWidth=e.outlineWidth??10,this._maskLength=void 0,this._maskLengthSubscription=void 0,this.maskLength=e.maskLength??20}getType(e){return Cesium.Material.PolylineFenceType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.outlineColor=Cesium.Property.getValueOrUndefined(this._outlineColor,e),t.outlineWidth=Cesium.Property.getValueOrUndefined(this._outlineWidth,e),t.maskLength=Cesium.Property.getValueOrUndefined(this._maskLength,e),t}equals(e){return this===e||e instanceof _t&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._outlineColor,e._outlineColor)&&Cesium.Property.equals(this._outlineWidth,e._outlineWidth)&&Cesium.Property.equals(this._maskLength,e._maskLength)}}Object.defineProperties(_t.prototype,{color:Cesium.createPropertyDescriptor("color"),outlineColor:Cesium.createPropertyDescriptor("outlineColor"),outlineWidth:Cesium.createPropertyDescriptor("outlineWidth"),maskLength:Cesium.createPropertyDescriptor("maskLength")});class xt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.PolylineFlickerType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof xt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(xt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class yt extends U{constructor(e={}){super(e),this._percent=void 0,this._percentSubscription=void 0,this._gradient=void 0,this._gradientSubscription=void 0,this.percent=e.percent||.03,this.gradient=e.gradient||.1}getType(e){return Cesium.Material.PolylineFlowType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t.percent=Cesium.Property.getValueOrUndefined(this._percent,e),t.gradient=Cesium.Property.getValueOrUndefined(this._gradient,e),t}equals(e){return this===e||e instanceof yt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)&&Cesium.Property.equals(this._percent,e._percent)&&Cesium.Property.equals(this._gradient,e._gradient)}}Object.defineProperties(yt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),percent:Cesium.createPropertyDescriptor("percent"),gradient:Cesium.createPropertyDescriptor("gradient")});class Tt extends U{constructor(e={}){var t,r;super(e),this._image=void 0,this._imageSubscription=void 0,this._repeat=void 0,this._repeatSubscription=void 0,this.image=e.image,this.repeat=new Cesium.Cartesian2(((t=e.repeat)==null?void 0:t.x)||1,((r=e.repeat)==null?void 0:r.y)||1)}getType(e){return Cesium.Material.PolylineImageTrailType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t.repeat=Cesium.Property.getValueOrUndefined(this._repeat,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof Tt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._image,e._image)&&Cesium.Property.equals(this._repeat,e._repeat)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(Tt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),image:Cesium.createPropertyDescriptor("image"),repeat:Cesium.createPropertyDescriptor("repeat")});const Yr="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAACYCAYAAACS0lH9AAAACXBIWXMAAAsTAAALEwEAmpwYAAAJ0GlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgMTE2LjE2NDY1NSwgMjAyMS8wMS8yNi0xNTo0MToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDplODY0YmNmNy1lZGIyLWIyNDQtYWI0NC04OWZkNmMwOTQ4MDYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjIyOGMxMDUtODFmZS00MjAxLWIwOTEtZDkwMGI0NTI0NWMwIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9IjcxNzA5OEJGODAwODNEREJGRDQyQzAzMzQ5NDlDRDFDIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9IiIgdGlmZjpJbWFnZVdpZHRoPSI1MTIiIHRpZmY6SW1hZ2VMZW5ndGg9IjE1MiIgdGlmZjpQaG90b21ldHJpY0ludGVycHJldGF0aW9uPSIyIiB0aWZmOlNhbXBsZXNQZXJQaXhlbD0iMyIgdGlmZjpYUmVzb2x1dGlvbj0iMS8xIiB0aWZmOllSZXNvbHV0aW9uPSIxLzEiIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjEiIGV4aWY6RXhpZlZlcnNpb249IjAyMzEiIGV4aWY6Q29sb3JTcGFjZT0iNjU1MzUiIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI1MTIiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSIxNTIiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTIzVDEwOjAyOjQxKzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmZmYTk5ZjhhLTdiZmQtNDcxNi04MTgwLWJmZTUyMmFmNGUzNSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNvbnZlcnRlZCIgc3RFdnQ6cGFyYW1ldGVycz0iZnJvbSBpbWFnZS9qcGVnIHRvIGltYWdlL3BuZyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iZGVyaXZlZCIgc3RFdnQ6cGFyYW1ldGVycz0iY29udmVydGVkIGZyb20gaW1hZ2UvanBlZyB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjYyMjhjMTA1LTgxZmUtNDIwMS1iMDkxLWQ5MDBiNDUyNDVjMCIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxMDowODo0NCswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOmZmYTk5ZjhhLTdiZmQtNDcxNi04MTgwLWJmZTUyMmFmNGUzNSIgc3RSZWY6ZG9jdW1lbnRJRD0iNzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUMiIHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD0iNzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUMiLz4gPHBob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHJkZjpCYWc+IDxyZGY6bGk+NzE3MDk4QkY4MDA4M0REQkZENDJDMDMzNDk0OUNEMUM8L3JkZjpsaT4gPC9yZGY6QmFnPiA8L3Bob3Rvc2hvcDpEb2N1bWVudEFuY2VzdG9ycz4gPHRpZmY6Qml0c1BlclNhbXBsZT4gPHJkZjpTZXE+IDxyZGY6bGk+ODwvcmRmOmxpPiA8cmRmOmxpPjg8L3JkZjpsaT4gPHJkZjpsaT44PC9yZGY6bGk+IDwvcmRmOlNlcT4gPC90aWZmOkJpdHNQZXJTYW1wbGU+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+h9EbuwAAA01JREFUeJzt3TuOFVkQBNDoJhmEkDBgZv8L5GMgIcRvHg5ryDTiHKn98Co67q16T4/HYwIAVHm+DgAA7FMAAKCQAgAAhSbJ03UIAGCXBQAACikAAFDIEQAAFLIAAEAhBQAACikAAFBoogQAQB0PfwAopAAAQCGvAQJAIQsAABSyAABAIQsAABSyAABAIQUAAAo5AgCAQr4ECACFPPwBoJACAACFHAEAQCEPfwAoZAEAgEIe/gBQyAIAAIU8/AGgkAUAAAr5LQAAKOS/fwAoZAEAgELuAABAIQsAABRSAACgkAIAAIXcAQCAQhYAAChkAQCAQgoAABRSAACgkIc/ABSaJC+uQwAAu7wFAACFFAAAKDR//wCAIhYAACjkEiAAFLIAAEChSfLyOgQAsMuXAAGgkLcAAKCQAgAAhbwFAACFFAAAKOQIAAAKTZJ/rkMAALsUAAAo5AgAAAr5EiAAFFIAAKCQOwAAUEgBAIBCk+TVdQgAYNckeXMdAgDYNUneXocAAHZNkvfXIQCAXZPkv+sQAMCuSfLvdQgAYNckeXcdAgDY5RIgABSaJK+vQwAAu/wWAAAUmiRP1yEAgF2T5HEdAgDYNUl+XocAAHZNkm/XIQCAXZPky3UIAGDXJPl8HQIA2DVJPl6HAAB2TZIP1yEAgF2T5NN1CABgl0uAAFBokny9DgEA7Jok369DAAC7JsmP6xAAwC4FAAAK+S0AACikAABAoUny6zoEALDLHQAAKKQAAEAhRwAAUGiS/L4OAQDsUgAAoJAjAAAopAAAQKFJ8v91CABgly8BAkChSfK4DgEA7PIWAAAUsgAAQCFvAQBAIQsAABRSAACgkEuAAFDo+ToAALDPlwABoJACAACFFAAAKOQtAAAoZAEAgEIWAAAopAAAQCEFAAAKuQMAAIUsAABQyKeAAaCQBQAACrkDAACFHAEAQCELAAAUsgAAQCELAAAUsgAAQCELAAAUsgAAQCEFAAAKOQIAgEIWAAAo5LcAAKCQAgAAhRwBAEAhCwAAFLIAAEAhCwAAFLIAAEAhBQAACvkSIAAUsgAAQCEFAAAKKQAAUMhrgABQyAIAAIUUAAAo5AgAAApZAACgkAIAAIUUAAAo5A4AABT6A6gaPQ6/wRIfAAAAAElFTkSuQmCC";class vt extends U{constructor(e={}){super(e),this._image=void 0,this._imageSubscription=void 0,this.image=Yr}getType(e){return Cesium.Material.PolylineLightingType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t}equals(e){return this===e||e instanceof vt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._image,e._image)}}Object.defineProperties(vt.prototype,{color:Cesium.createPropertyDescriptor("color"),image:Cesium.createPropertyDescriptor("image")});class Mt extends U{constructor(e={}){super(e),this._image=void 0,this._imageSubscription=void 0,this.image=Yr}getType(e){return Cesium.Material.PolylineLightingTrailType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof Mt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(Mt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),image:Cesium.createPropertyDescriptor("image")});class Pt extends U{constructor(e={}){super(e),this._repeatFactor=void 0,this._repeatFactorSubscription=void 0,this.repeatFactor=e.repeatFactor,this._antiClockWise=void 0,this._antiClockWiseSubscription=void 0,this.antiClockWise=e.antiClockWise}getType(e){return Cesium.Material.PolylineMultiArrowType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.repeatFactor=Cesium.Property.getValueOrUndefined(this._repeatFactor,e),t.antiClockWise=Cesium.Property.getValueOrUndefined(this._antiClockWise,e),t}equals(e){return this===e||e instanceof Pt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._repeatFactor,e._repeatFactor)&&Cesium.Property.equals(this._antiClockWise,e._antiClockWise)}}Object.defineProperties(Pt.prototype,{color:Cesium.createPropertyDescriptor("color"),repeatFactor:Cesium.createPropertyDescriptor("repeatFactor"),antiClockWise:Cesium.createPropertyDescriptor("antiClockWise")});class Dt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.PolylineTrailType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=this._speed,t}equals(e){return this===e||e instanceof Dt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(Dt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class It extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.RadarLineType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof It&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(It.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class Lt extends U{constructor(e={}){super(e),this._repeat=void 0,this._repeatSubscription=void 0,this._thickness=void 0,this._thicknessSubscription=void 0,this.repeat=e.repeat||30,this.thickness=e.thickness||.3}getType(e){return Cesium.Material.RadarOuterType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t.repeat=Cesium.Property.getValueOrUndefined(this._repeat,e),t.thickness=Cesium.Property.getValueOrUndefined(this._thickness,e),t}equals(e){return this===e||e instanceof Lt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)&&Cesium.Property.equals(this._repeat,e._repeat)&&Cesium.Property.equals(this._thickness,e._thickness)}}Object.defineProperties(Lt.prototype,{color:Cesium.createPropertyDescriptor("color"),repeat:Cesium.createPropertyDescriptor("repeat"),thickness:Cesium.createPropertyDescriptor("thickness"),speed:Cesium.createPropertyDescriptor("speed")});class St extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.RadarSweepType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof St&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(St.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class wt extends U{constructor(e={}){super(e)}getType(e){return Cesium.Material.RadarWaveType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof wt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(wt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed")});class Ft extends U{constructor(e={}){var t,r;super(e),this._image=void 0,this._imageSubscription=void 0,this._repeat=void 0,this._repeatSubscription=void 0,this.image=e.image,this.repeat=new Cesium.Cartesian2(((t=e.repeat)==null?void 0:t.x)||1,((r=e.repeat)==null?void 0:r.y)||1)}getType(e){return Cesium.Material.WallImageTrailType}getValue(e,t){return t=Cesium.defaultValue(t,{}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t.repeat=Cesium.Property.getValueOrUndefined(this._repeat,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof Ft&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._image,e._image)&&Cesium.Property.equals(this._repeat,e._repeat)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(Ft.prototype,{image:Cesium.createPropertyDescriptor("image"),color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),repeat:Cesium.createPropertyDescriptor("repeat")});const Go="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVwAAAArCAYAAAA0RjDhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGx2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgMTE2LjE2NDY1NSwgMjAyMS8wMS8yNi0xNTo0MToyMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTAyLTIzVDE3OjE0OjMyKzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTAyLTI0VDE0OjIwOjE2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wMi0yNFQxNDoyMDoxNiswODowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1NzQzY2I0NC0zMzk3LTQ5OTAtYjg4OC0yNDFlNmExYmQyYWYiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo5YWYxZDY1MC1jNWRlLTVmNDgtYWYzNi1hZDE4ZWRkN2QzYTAiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiMmZjZmU2Zi1hZWQwLTRjMWQtYjZmOS1lNjAwMjJiNmEwOGUiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOmIyZmNmZTZmLWFlZDAtNGMxZC1iNmY5LWU2MDAyMmI2YTA4ZSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxNzoxNDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjNjM2JjM2I5LTkwNDEtNDk1ZS04MTc5LTdkZjc3NDIwZDczOSIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yM1QxNzoxNDozMiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3NDNjYjQ0LTMzOTctNDk5MC1iODg4LTI0MWU2YTFiZDJhZiIgc3RFdnQ6d2hlbj0iMjAyMS0wMi0yNFQxNDoyMDoxNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIxLjIgKE1hY2ludG9zaCkiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+eAiLkwAAAL9JREFUeJzt3LENACEQBLFDov+W+Sp+CLArIJrgkHadcwaA/+3bDwB4heACRAQXICK4AJE9M37NAAJ7ZtbtRwC8wEkBICK4ABHBBYgILkBEcAEiggsQEVyAiOACRAQXICK4ABHBBYgILkBEcAEiggsQEVyAiAFygIgBcoCIkwJARHABIoILEBFcgIjgAkQEFyAiuAARwQWICC5ARHABIoILEBFcgIjgAkQEFyBiDxcgYg8XIOKkABARXICI4AJEPi0OBqe6wuNbAAAAAElFTkSuQmCC";class Rt extends U{constructor(e={}){var t,r;super(e),this._image=void 0,this._imageSubscription=void 0,this._repeat=void 0,this._repeatSubscription=void 0,this.image=Go,this.repeat=new Cesium.Cartesian2(((t=e.repeat)==null?void 0:t.x)||1,((r=e.repeat)==null?void 0:r.y)||1)}getType(e){return Cesium.Material.WallLineTrailType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t.repeat=Cesium.Property.getValueOrUndefined(this._repeat,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof Rt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)&&Cesium.Property.equals(this._repeat,e._repeat)}}Object.defineProperties(Rt.prototype,{color:Cesium.createPropertyDescriptor("color"),image:Cesium.createPropertyDescriptor("image"),repeat:Cesium.createPropertyDescriptor("repeat"),speed:Cesium.createPropertyDescriptor("speed")});const zo="/CesiumSDK_Examples/assets/fence-DHzFKkrI.png";class bt extends U{constructor(e={}){super(e),this._image=void 0,this._imageSubscription=void 0,this.image=zo}getType(e){return Cesium.Material.WallTrailType}getValue(e,t){return t||(t={}),t.color=Cesium.Property.getValueOrUndefined(this._color,e),t.image=Cesium.Property.getValueOrUndefined(this._image,e),t.speed=Cesium.Property.getValueOrUndefined(this._speed,e),t}equals(e){return this===e||e instanceof bt&&Cesium.Property.equals(this._color,e._color)&&Cesium.Property.equals(this._speed,e._speed)}}Object.defineProperties(bt.prototype,{color:Cesium.createPropertyDescriptor("color"),speed:Cesium.createPropertyDescriptor("speed"),image:Cesium.createPropertyDescriptor("image")});class Nt{constructor(e){e=e||{},this._definitionChanged=new Cesium.Event,this._baseWaterColor=void 0,this._baseWaterColorSubscription=void 0,this.baseWaterColor=e.baseWaterColor||new Cesium.Color(.2,.3,.6,1),this._blendColor=void 0,this._blendColorSubscription=void 0,this.blendColor=e.blendColor||new Cesium.Color(0,1,.699,1),this._specularMap=void 0,this._specularMapSubscription=void 0,this.specularMap=e.specularMap||Cesium.Material.DefaultImageId,this._normalMap=void 0,this._normalMapSubscription=void 0,this.normalMap=e.normalMap||Cesium.Material.DefaultImageId,this.frequency=Cesium.defaultValue(e.frequency,1e3),this.animationSpeed=Cesium.defaultValue(e.animationSpeed,.01),this.amplitude=Cesium.defaultValue(e.amplitude,10),this.specularIntensity=Cesium.defaultValue(e.specularIntensity,.5)}get isConstant(){return!1}get definitionChanged(){return this._definitionChanged}getType(e){return Cesium.Material.WaterType}getValue(e,t){return t||(t={}),t.baseWaterColor=Cesium.Property.getValueOrUndefined(this._baseWaterColor,e),t.blendColor=Cesium.Property.getValueOrUndefined(this._blendColor,e),t.specularMap=Cesium.Property.getValueOrUndefined(this._specularMap,e),t.normalMap=Cesium.Property.getValueOrUndefined(this._normalMap,e),t.frequency=this.frequency,t.animationSpeed=this.animationSpeed,t.amplitude=this.amplitude,t.specularIntensity=this.specularIntensity,t}equals(e){return this===e||e instanceof Nt&&Cesium.Property.equals(this._baseWaterColor,e._baseWaterColor)}}Object.defineProperties(Nt.prototype,{baseWaterColor:Cesium.createPropertyDescriptor("baseWaterColor"),blendColor:Cesium.createPropertyDescriptor("blendColor"),specularMap:Cesium.createPropertyDescriptor("specularMap"),normalMap:Cesium.createPropertyDescriptor("normalMap")});const Uo=Object.freeze(Object.defineProperty({__proto__:null,CircleBlurMaterialProperty:st,CircleDiffuseMaterialProperty:lt,CircleFadeMaterialProperty:ct,CirclePulseMaterialProperty:ut,CircleScanMaterialProperty:dt,CircleSpiralMaterialProperty:mt,CircleVaryMaterialProperty:Ct,CircleWaveMaterialProperty:pt,EllipsoidElectricMaterialProperty:ht,EllipsoidTrailMaterialProperty:ft,PolylineCustomEndpointMaterialProperty:At,PolylineDashArrowMaterialProperty:Et,PolylineDirectionMaterialProperty:gt,PolylineEmissionMaterialProperty:Bt,PolylineFenceMaterialProperty:_t,PolylineFlickerMaterialProperty:xt,PolylineFlowMaterialProperty:yt,PolylineImageTrailMaterialProperty:Tt,PolylineLightingMaterialProperty:vt,PolylineLightingTrailMaterialProperty:Mt,PolylineMultiArrowMaterialProperty:Pt,PolylineTrailMaterialProperty:Dt,RadarLineMaterialProperty:It,RadarOuterMaterialProperty:Lt,RadarSweepMaterialProperty:St,RadarWaveMaterialProperty:wt,WallImageTrailMaterialProperty:Ft,WallLineTrailMaterialProperty:Rt,WallTrailMaterialProperty:bt,WaterMaterialProperty:Nt},Symbol.toStringTag,{value:"Module"})),Ze=class Ze{constructor(e,t={}){this.id=e,this.options=t,this._init()}get _viewer(){return this.Viewer._viewer}_init(){this.Viewer=new Li(this.id,this.options,Ze),ci(this._viewer,Ze),this.Animation=new ea,this.Roaming=new Ht,this.Imagery=new $i,this.BaseFn=new Jt,this.Entity=new ta,this.Position=new Fe,this.Popup=new ra,this.Draw=new aa,this.Material=Uo,this.CesiumThree=new On,this.MVT=oa,this.S3MTiles=Vn}};ze(Ze,"TDT_KEY","");let Mr=Ze;export{Mr as C};
