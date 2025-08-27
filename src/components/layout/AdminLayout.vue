<script setup>
// 导入侧边栏组件
import AdminSidebar from './AdminSidebar.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />
    <main class="admin-main-content">
      <!-- 
        和 App.vue 类似，这里也需要一个 router-view。
        这个出口专门用于渲染 /admin/... 的子路由组件，
        例如商品管理、用户管理等。
      -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh; /* 确保布局至少和视窗一样高 */
  background-color: #f0f2f5; /* 后台系统常用的浅灰色背景 */
}

.admin-main-content {
  flex-grow: 1; /* 占据剩余的所有空间 */
  padding: 30px;
  overflow: auto; /* 如果内容超出，允许滚动 */
}
</style>
