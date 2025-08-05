/*
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-08-05 10:10:31
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-08-05 10:37:33
 * @FilePath: \CesiumSDK_Examples\eslint.config.js
 * @Description: 
 * 
 */
import js from '@eslint/js';
import globals from 'globals';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['**/dist/**', '**/public/**', '.prettier.config.cjs', '**/styles/**']),
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    plugins: { js },
    extends: ['js/recommended']
  },
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // 添加自定义全局变量声明
        Cesium: 'readonly', // 只读全局变量
        CM: 'writable', // 可写全局变量
        viewer: 'writable', // 可写全局变量

        // 添加 Element Plus 全局组件声明
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElNotification: 'readonly',
        ElLoading: 'readonly',
      },
      // 添加 JSX 解析支持
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  pluginVue.configs['flat/essential'],
  {
    // 添加规则覆盖配置
    rules: {
      'vue/multi-word-component-names': 'off', // 关闭组件名校验
      'vue/no-mutating-props': 'off', // 关闭禁止修改 props 的规则
      'no-unused-vars': [
        'error',
        {
          args: 'none', // 允许函数参数不被使用
          vars: 'all', // 其他变量仍需要被使用
          ignoreRestSiblings: true, // 允许解构剩余操作符的未使用变量
          caughtErrors: 'none', // 允许 catch 错误参数不被使用
        },
      ],
    },
  },
]);
