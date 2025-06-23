<!--
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:54:02
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-23 10:59:09
 * @FilePath: \CesiumSDK_Examples\src\views\customMap\index.vue
 * @Description: 
 * 
-->
<template>
  <div class="map-box">
    <div id="cesiumContainer"></div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import CesiumMap from "cesium-plugins-fn";
import "cesium-plugins-fn/dist/lib/MapLayer/index.js";

onMounted(() => {
  initMap();
});

/**初始化map*/
const initMap = () => {
  CesiumMap.TDT_KEY = "09e77297bedca973c872b9284afced93";
  let CM = new CesiumMap("cesiumContainer", {
    imageryProvider: null,
    contextOptions: {
      webgl: {
        alpha: true,
        depth: true,
        stencil: true,
        antialias: true,
        premultipliedAlpha: true,
        //通过canvas.toDataURL()实现截图需要将该项设置为true
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: true,
      },
    },
  });
  window.CM = CM;
  window.viewer = CM.Viewer._viewer;

  loadImagery();
};

const loadImagery = () => {
  let img = CM.Imagery.createTdtImageryProvider("img");

  let img_map = CM.Imagery.createUrlImageryLayer({
    url: `${window.location.origin}/data/town/img_map/{z}/{x}/{y}.png`,
  });
  CM.Viewer.addBaseLayer([img, img_map]);

  CM.Animation.cameraFlyTo(
    {
      // heading: "115",
      height: "5000",
      lat: "29.55748093",
      lng: "104.46401596",
      // lat: "29.452244",
      // lng: "104.421574",
      // pitch: "-20",
      // roll: "0"
    },
    () => {
      console.log("自定义地图加载完成");
    },
    1
  );
};
</script>

<style scoped lang="scss">
.map-box {
  width: 100%;
  height: 100%;
  position: relative;
  #cesiumContainer {
    width: 100%;
    height: 100%;
    background: #787878;
  }
}
</style>
