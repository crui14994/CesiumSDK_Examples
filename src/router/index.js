/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:43:34
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-20 15:13:04
 * @FilePath: \CesiumSDK_Examples\src\router\index.js
 * @Description:
 *
 */
import { createRouter, createWebHistory } from "vue-router";

// 动态导入 views 下所有文件夹中的 index.vue 文件
const viewModules = import.meta.glob("../views/*/index.vue");

// 生成路由配置
const routes = Object.keys(viewModules).map((path) => {
  const folderName = path.match(/\.\/views\/(.*?)\/index\.vue/)?.[1];
  
  return {
    path: folderName=="Init" ? "/" :`/${folderName.toLowerCase()}`,
    name: folderName,
    component: viewModules[path],
  };
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
