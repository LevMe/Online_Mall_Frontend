<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
// 1. 导入侧边栏组件
import CategorySidebar from '../../components/common/CategorySidebar.vue'

const products = ref([])

onMounted(async () => {
  try {
    const data = await api.getProducts()
    products.value = data
  } catch (error) {
    console.error('获取商品失败:', error)
  }
})
</script>

<template>
  <main class="page-with-sidebar">
    <div class="container">
      <!-- 2. 添加侧边栏 -->
      <CategorySidebar />
      <div class="main-content">
        <div class="product-grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-with-sidebar {
  padding: 40px 0;
  background-color: #f9f9f9;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  /* 3. 使用 Flexbox 创建两栏布局 */
  display: flex;
  gap: 40px; /* 定义侧边栏和主内容区的间距 */
}

.main-content {
  flex-grow: 1; /* 主内容区占据所有剩余空间 */
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
