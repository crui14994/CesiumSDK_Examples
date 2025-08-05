// 创建一个单独的文件来统一管理公共变量，避免在每个模块初始化时重复传递

let viewerInstance = null;
let cesiumMapInstance = null;

export const setContext = (viewer, CesiumMap) => {
  viewerInstance = viewer;
  cesiumMapInstance = CesiumMap;
};

export const getContext = () => ({
  viewer: viewerInstance,
  CesiumMap: cesiumMapInstance,
});
