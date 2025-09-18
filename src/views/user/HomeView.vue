<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
import CategorySidebar from '../../components/common/CategorySidebar.vue'
import { useRoute, useRouter } from 'vue-router'

// --- 移植过来的分页逻辑 ---
const products = ref([])
const totalPages = ref(1)
const currentPage = ref(1)

const route = useRoute()
const router = useRouter()

// 获取数据的函数，现在会处理分页
const fetchProducts = async (query) => {
  try {
    const data = await api.getProducts(query)
    products.value = data.items
    totalPages.value = Math.ceil(data.total / data.pageSize)
    currentPage.value = data.page
  } catch (error) {
    console.error('获取商品失败:', error)
  }
}

// 跳转页面的函数
const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  // 首页跳转时，我们只改变 pageNo 参数
  router.push({ query: { ...route.query, pageNo: page } })
}

// 计算要显示的页码
const visiblePageNumbers = computed(() => {
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})

// 监听路由变化，以便在点击分页按钮时刷新数据
watch(
  () => route.query,
  (newQuery) => {
    // 确保在首页时，即使没有其他 query 参数，也能正确请求
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
        <div class="product-grid">
          <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <nav v-if="totalPages > 1" class="pagination" aria-label="商品分页">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="page-arrow"
          >
            &lt;
          </button>

          <button
            v-for="page in visiblePageNumbers"
            :key="page"
            @click="goToPage(page)"
            :class="['page-number', { active: page === currentPage }]"
          >
            {{ page }}
          </button>

          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="page-arrow"
          >
            &gt;
          </button>
        </nav>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* --- 页面基础样式 (保持不变) --- */
.page-with-sidebar {
  padding: 40px 0;
  background-color: #f9f9f9;
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
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

/* --- 分页组件样式 (与 ProductListView 保持一致) --- */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 40px;
}

.pagination button {
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;
  width: 36px;
  height: 36px;
  font-size: 16px;
  border-radius: 8px;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

.page-arrow {
  color: #007aff;
}
.page-arrow:hover:not(:disabled) {
  background-color: #f0f0f5;
}
.page-arrow:disabled {
  color: #d1d1d6;
  cursor: not-allowed;
}

.page-number {
  color: #333;
}
.page-number:hover {
  background-color: #f0f0f5;
}
.page-number.active {
  background-color: #007aff;
  color: #fff;
  font-weight: 600;
}
</style>
