/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:43:34
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-20 14:58:48
 * @FilePath: \CesiumSDK_Examples\vite.config.js
 * @Description: 
 * 
 */
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: "sass" })],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 8080,
    open: false,
    cors: true,
    proxy: {
      "/api": {
        target: "https://demo.chysny.com:9705",
        ws: true, //代理websockets
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
