<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="checkout-success-page">
    <div class="container">
      <div class="success-icon">✓</div>
      <h1>支付成功！</h1>
      <p>感谢您的购买，我们会尽快为您安排发货。</p>
      <RouterLink to="/" class="go-home-btn">返回首页</RouterLink>
    </div>
  </main>
</template>

<style scoped>
.checkout-success-page {
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
}
.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  border-radius: 50%;
  background-color: #4caf50;
  color: white;
  font-size: 50px;
  line-height: 80px;
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
