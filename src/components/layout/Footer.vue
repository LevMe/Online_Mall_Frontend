<script setup></script>

<template>
  <footer class="app-footer">
    <div class="container">
      <p>&copy; 2025 CoolStore. All Rights Reserved.</p>
      <div class="links">
        <a href="#">关于我们</a>
        <a href="#">联系方式</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: #f8f8f8;
  border-top: 1px solid #e5e5e5;
  padding: 20px 40px;
  color: #666;
}

.app-footer .container {
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center;
}

.links a {
  margin-left: 20px;
  text-decoration: none;
  color: #666;
}
</style>
