<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="placeholder-page">
    <div class="container">
      <h1>我的订单</h1>
      <p>您可以在这里查看您的历史订单记录和物流状态。</p>
      <div class="wip-notice">（此功能正在开发中，需要后端提供订单相关接口）</div>
      <RouterLink to="/" class="go-home-btn">返回首页</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.placeholder-page {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
  min-height: calc(100vh - 140px);
  background-color: #f9f9f9;
}
.container {
  background-color: #fff;
  padding: 50px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 600px;
}
h1 {
  font-size: 28px;
  margin-bottom: 15px;
}
p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}
.wip-notice {
  background-color: #fffbe6;
  color: #8a6d3b;
  border: 1px solid #ffe58f;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 30px;
}
.go-home-btn {
  display: inline-block;
  padding: 12px 25px;
  background-color: #007aff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
}
</style>
