<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="placeholder-page">
    <div class="container">
      <h1>客户服务中心</h1>
      <p>我们很乐意为您提供帮助。您可以通过以下方式联系我们：</p>
      <ul class="contact-list">
        <li><strong>在线客服:</strong> 点击右下角图标开始咨询 (演示)</li>
        <li><strong>服务邮箱:</strong> support@coolstore.com</li>
        <li><strong>服务热线:</strong> 400-123-4567 (9:00 - 18:00)</li>
      </ul>
      <div>
        <RouterLink to="/" class="go-home-btn">返回首页</RouterLink>
      </div>
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
.contact-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
  text-align: left;
  display: inline-block;
}
.contact-list li {
  margin-bottom: 10px;
  font-size: 16px;
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
