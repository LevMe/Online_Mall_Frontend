<script setup>
// 导入我们已经创建好的侧边栏组件
import AdminSidebar from './AdminSidebar.vue'
</script>

<template>
  <div class="admin-layout">
    <AdminSidebar />

    <main class="admin-main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: calc(100vh - 60px); /* 减去Header的高度 */
}

.admin-main-content {
  flex-grow: 1; /* 占据剩余的所有空间 */
  padding: 30px;
  background-color: #f0f2f5; /* 后台系统常用的浅灰色背景 */
}
</style>
