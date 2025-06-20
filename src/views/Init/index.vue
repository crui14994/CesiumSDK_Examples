<!--
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:54:02
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-20 16:43:07
 * @FilePath: \CesiumSDK_Examples\src\views\init\index.vue
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

  let img = CM.Imagery.createTdtImageryProvider("img");
  let cva = CM.Imagery.createTdtImageryProvider("cva");
  CM.Viewer.addBaseLayer([img, cva]);
};
</script>

<style scoped lang="scss">
.map-box {
  width: 100vw;
  height: 100vh;
  position: relative;
  #cesiumContainer {
    width: 100%;
    height: 100%;
    background: #787878;
    // :deep(.cesium-viewer) {
    //   .cesium-viewer-animationContainer {
    //     display: none;
    //   }

    //   .cesium-viewer-timelineContainer {
    //     display: none;
    //   }
    // }
  }
}
</style>
