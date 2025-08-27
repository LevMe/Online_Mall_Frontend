<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
  /* 关键改动：让侧边栏和主内容区从顶部对齐 */
  align-items: flex-start;
}

.main-content {
  flex-grow: 1;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
</style>
