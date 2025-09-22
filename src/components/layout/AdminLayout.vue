<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <aside class="admin-sidebar">
    <div class="sidebar-header">
      <h2>商城后台</h2>
    </div>
    <nav class="sidebar-nav">
      <ul>
        <li>
          <RouterLink :to="{ name: 'adminProductList' }">商品管理</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'adminUserList' }">用户管理</RouterLink>
        </li>
        <li>
          <RouterLink :to="{ name: 'home' }" class="back-to-store">返回商城</RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.admin-sidebar {
  width: 220px;
  flex-shrink: 0; /* 防止侧边栏被压缩 */
  background-color: #001529; /* 深蓝色，专业的后台风格 */
  color: #fff;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 20px;
  text-align: center;
  font-size: 20px;
  border-bottom: 1px solid #002140;
}

.sidebar-header h2 {
  margin: 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
}

.sidebar-nav a {
  display: block;
  padding: 12px 20px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.sidebar-nav a:hover {
  background-color: #1890ff;
  color: #fff;
}

/* 为当前激活的后台路由链接设置高亮样式 */
.sidebar-nav a.router-link-active {
  background-color: #1890ff;
  color: #fff;
}

.back-to-store {
  margin-top: 40px; /* 与其他导航项拉开距离 */
  border-top: 1px solid #002140;
  padding-top: 20px !important;
}
</style>
