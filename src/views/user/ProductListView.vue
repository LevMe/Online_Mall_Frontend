<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
import CategorySidebar from '../../components/common/CategorySidebar.vue'

const products = ref([])
const totalPages = ref(1)
const currentPage = ref(1)

const route = useRoute()
const router = useRouter()

const fetchProducts = async (query) => {
  try {
    // API 调用现在会把 query 对象（包含 pageNo）作为参数传给后端
    const data = await api.getProducts(query)
    products.value = data.items
    // 后端返回的 page 字段代表当前页码，我们用它来更新 totalPages
    totalPages.value = Math.ceil(data.total / data.pageSize)
    currentPage.value = data.page
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

// 点击分页按钮时，更新路由中的 pageNo 参数
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  // 使用正确的参数名 pageNo
  router.push({ query: { ...route.query, pageNo: page } })
}

// 监听路由 query 的变化，一旦变化（例如 pageNo 改变），就重新获取数据
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

        <div v-if="totalPages > 1" class="pagination">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
          <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
            下一页
          </button>
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
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

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.pagination button {
  padding: 8px 16px;
  margin: 0 10px;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  cursor: pointer;
}

.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
</style>
