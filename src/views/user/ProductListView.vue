<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
import CategorySidebar from '../../components/common/CategorySidebar.vue'

const products = ref([])
const route = useRoute()

const fetchProducts = async (query) => {
  try {
    const data = await api.getProducts(query)
    products.value = data
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

watch(
  () => route.query,
  (newQuery) => {
    fetchProducts(newQuery)
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <main class="page-with-sidebar">
    <div class="container">
      <CategorySidebar />
      <div class="main-content">
        <h1 v-if="route.query.keyword">搜索结果: "{{ route.query.keyword }}"</h1>

        <div v-if="products.length > 0" class="product-grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
        <div v-else class="no-results">
          <p>抱歉，没有找到相关的商品。</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.page-with-sidebar {
  padding: 40px 0;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
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

h1 {
  margin-top: 0;
  margin-bottom: 20px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.no-results {
  text-align: center;
  padding: 50px;
  color: #666;
  background-color: #fff;
  border-radius: 8px;
}
</style>
