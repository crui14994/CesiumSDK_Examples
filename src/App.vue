<!--
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:43:34
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-08-05 10:19:34
 * @FilePath: \CesiumSDK_Examples\src\App.vue
 * @Description: 
 * 
-->

<template>
  <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <template v-for="(item, index) in navList" :key="index">
      <el-menu-item v-if="!item.children" :index="item.path">{{ item.name }}</el-menu-item>

      <el-sub-menu v-else :index="item.path">
        <template #title>{{ item.name }}</template>
        <el-menu-item v-for="(child, index) in item.children" :key="index" :index="child.path">{{
          child.name
        }}</el-menu-item>
      </el-sub-menu>
    </template>
  </el-menu>
  <div class="content-box">
    <RouterView />
  </div>
</template>

<script setup>
  import { RouterView } from 'vue-router';

  import { ref } from 'vue';

  const navList = ref([
    {
      name: '初始化地图',
      path: '/',
    },
    {
      name: '图层相关',
      children: [
        {
          name: '自定义图层',
          path: '/customMap',
        },
      ],
    },
  ]);
  const activeIndex = ref('/');
</script>

<style scoped>
  .el-menu-demo {
    position: fixed;
    top: 0;
    z-index: 10;
    width: 100%;
  }
  .content-box {
    height: 100vh;
    padding-top: 60px;
  }
</style>
