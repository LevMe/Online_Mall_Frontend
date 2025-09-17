<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../services/index.js'
import ProductCard from '../../components/common/ProductCard.vue'
import CategorySidebar from '../../components/common/CategorySidebar.vue'

const products = ref([])
const totalPages = ref(1)
const currentPage = ref(1)
const pageSize = ref(Number(useRoute().query.pageSize) || 10)

const route = useRoute()
const router = useRouter()

const fetchProducts = async (query) => {
  try {
    const data = await api.getProducts(query)
    products.value = data.items
    totalPages.value = Math.ceil(data.total / data.pageSize)
    currentPage.value = data.page
    pageSize.value = data.pageSize
  } catch (error) {
    console.error('获取商品列表失败:', error)
  }
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value || page === currentPage.value) return
  router.push({ query: { ...route.query, pageNo: page } })
}

// 新增：计算要显示的页码
const visiblePageNumbers = computed(() => {
  const maxVisiblePages = 5 // 最多显示5个页码按钮
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

/* --- 全新的分页组件样式 (Apple 风格) --- */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px; /* 按钮之间的间距 */
  margin-top: 40px;
}

.pagination button {
  /* 基础样式重置 */
  border: none;
  background-color: transparent;
  cursor: pointer;
  padding: 0;
  margin: 0;

  /* 尺寸和字体 */
  width: 36px;
  height: 36px;
  font-size: 16px;
  border-radius: 8px; /* 圆角 */

  /* 过渡效果 */
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;
}

/* 左右箭头按钮 */
.page-arrow {
  color: #007aff; /* 苹果蓝 */
}
.page-arrow:hover:not(:disabled) {
  background-color: #f0f0f5;
}
.page-arrow:disabled {
  color: #d1d1d6; /* 禁用的灰色 */
  cursor: not-allowed;
}

/* 数字页码按钮 */
.page-number {
  color: #333;
}
.page-number:hover {
  background-color: #f0f0f5; /* 悬浮时的浅灰色背景 */
}
.page-number.active {
  background-color: #007aff; /* 当前页的蓝色背景 */
  color: #fff; /* 当前页的白色文字 */
  font-weight: 600;
}
</style>
