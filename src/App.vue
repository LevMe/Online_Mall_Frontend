<script setup>
import Header from './components/layout/Header.vue'
import Footer from './components/layout/Footer.vue'
import Notification from './components/common/Notification.vue'
// 1. 导入我们新创建的 BackToTop 组件
import BackToTop from './components/common/BackToTop.vue'
</script>

<template>
  <Header />
  <router-view></router-view>
  <Footer />

  <!-- 全局组件 -->
  <Notification />
  <!-- 2. 在模板的末尾添加 BackToTop 组件 -->
  <BackToTop />
</template>

<style>
/* 全局样式入口，我们约定将样式内容放在 main.css 中 */
</style>
