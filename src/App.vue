<!--
 * @Author: caorui 778943319@qq.com
 * @Date: 2025-06-20 14:43:34
 * @LastEditors: caorui 778943319@qq.com
 * @LastEditTime: 2025-06-23 11:08:23
 * @FilePath: \CesiumSDK_Examples\src\App.vue
 * @Description: 
 * 
-->

<template>
  <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <!-- <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item> -->

    <template v-for="(item,index) in navList" :key="index"> 
      <el-menu-item v-if="!item.children" :index="item.path" >{{item.name}}</el-menu-item>

      
    </template>
  </el-menu>
  <div class="content-box">
    <RouterView />
  </div>
</template>


<script setup>
import { RouterLink, RouterView } from "vue-router";

import { ref } from "vue";

const navList = ref([
  {
    name: "初始化地图",
    path: "/",
  },
  {
    name: "自定义图层",
    path: "/customMap",
  },
]);
const activeIndex = ref("/");
</script>

<style scoped>
.el-menu-demo {
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
}
.content-box{
  height: 100vh;
  padding-top: 60px;
}
</style>
