'use strict';
import clear from 'rollup-plugin-clear';

// 可以告诉 Rollup 如何查找外部模块（node_modules 中的模块）
import resolve from 'rollup-plugin-node-resolve';

// 将 CommonJS 转换成 ES2015 模块rollup-plugin-commonjs 应该用在其他插件转换你的模块之前 - 这是为了防止其他插件的改变破坏 CommonJS 的检测
import commonjs from 'rollup-plugin-commonjs';

// 为了代码的向下兼容性，我们需要使用babel配合rollup打包
import babel from 'rollup-plugin-babel';

// 打包图片文件
import image from '@rollup/plugin-image';

//代码压缩
import { terser } from 'rollup-plugin-terser';

// 使用 rollup-plugin-postcss 处理css，它支持css文件的加载、css加前缀、css压缩、对scss/less的支持等等
import postcss from 'rollup-plugin-postcss';

// 在打包时从代码中删除 debugger、assert.equal 和 console.*
import strip from 'rollup-plugin-strip';

// 打包时复制复制文件和文件夹
import copy from 'rollup-plugin-copy';

import json from 'rollup-plugin-json';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/CesiumSdk.js',
    format: 'umd', //umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
    name: 'CesiumMap', //当format为iife和umd时必须提供，将作为全局变量挂在window(浏览器环境)下：window.A=...
  },
  //有些场景下，虽然我们使用了 resolve 插件，但可能我们仍然想要某些库保持外部引用状态，
  //这时我们就需要使用 external 属性，来告诉 rollup.js 哪些是外部的类库
  external: ['cesium-navigation-es6'],
  plugins: [
    clear({ targets: ['dist'] }), //清除dist目录
    json(),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**', // 防止打包node_modules下的文件
      runtimeHelpers: true,
    }),
    image(),
    postcss(),
    strip({
      labels: ['unittest'],
    }),
    terser(),
    copy({
      targets: [{ src: 'src/lib/*', dest: 'dist/lib' }],
    }),
  ],
};
