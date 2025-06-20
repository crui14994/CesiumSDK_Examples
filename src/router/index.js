/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:43:34
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-20 14:56:18
 * @FilePath: \CesiumSDK_Examples\src\router\index.js
 * @Description: 
 * 
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Init',
      component: () => import('../views/Init/index.vue'),
    },
    
  ],
})

export default router
