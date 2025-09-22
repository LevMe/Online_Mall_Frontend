<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../../services/index.js'
import ProductFormModal from '../../components/admin/ProductFormModal.vue'
import { useNotificationStore } from '../../store/notification.js'
import ConfirmationModal from '../../components/common/ConfirmationModal.vue'

// ... (其他响应式状态保持不变)
const allProducts = ref([])
const categories = ref([])
const isLoading = ref(true)
const isFormModalVisible = ref(false)
const notificationStore = useNotificationStore()
const productBeingEdited = ref(null)
const isDeleteConfirmVisible = ref(false)
const productToDelete = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalProducts = ref(0)

// 新增：用于绑定搜索框的响应式状态
const searchKeyword = ref('')

// ... (计算属性和大部分方法保持不变)
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))
const paginatedProducts = computed(() => allProducts.value)

// 修改 fetchProducts 方法以支持搜索
const fetchProducts = async (page) => {
  isLoading.value = true
  try {
    const params = {
      pageNo: page,
      pageSize: itemsPerPage.value,
      keyword: searchKeyword.value, // 将搜索关键词添加到请求参数中
    }
    // 使用 Promise.all 并行获取商品和分类数据
    const [productsResponse, categoriesData] = await Promise.all([
      api.getAdminProducts(params),
      api.getCategories(),
    ])
    allProducts.value = productsResponse.items
    totalProducts.value = productsResponse.total
    categories.value = categoriesData
  } catch (error) {
    notificationStore.showNotification(error.message || '获取数据失败', 'error')
  } finally {
    isLoading.value = false
  }
}

// 新增：处理搜索的方法
const handleSearch = () => {
  currentPage.value = 1 // 每次搜索都回到第一页
  fetchProducts(currentPage.value)
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(page)
  }
}

onMounted(() => {
  fetchProducts(currentPage.value)
})

// ... (handleFormSubmit, openDeleteConfirm 等其他方法保持不变)
const openAddModal = () => {
  productBeingEdited.value = null
  isFormModalVisible.value = true
}

const openEditModal = (product) => {
  productBeingEdited.value = { ...product }
  isFormModalVisible.value = true
}

const handleFormSubmit = async (productData) => {
  try {
    if (isEditMode.value) {
      await api.updateProduct(productBeingEdited.value.id, productData)
      notificationStore.showNotification('商品更新成功！', 'success')
    } else {
      await api.addProduct(productData)
      notificationStore.showNotification('商品添加成功！', 'success')
    }
  } catch (error) {
    notificationStore.showNotification(error.message || '操作失败，请重试', 'error')
  } finally {
    isFormModalVisible.value = false
    fetchProducts(currentPage.value)
  }
}

const openDeleteConfirm = (product) => {
  productToDelete.value = product
  isDeleteConfirmVisible.value = true
}

const handleConfirmDelete = async () => {
  if (!productToDelete.value) return

  try {
    await api.deleteProduct(productToDelete.value.id)
    notificationStore.showNotification('商品删除成功！', 'success')
  } catch (error) {
    notificationStore.showNotification(error.message || '删除失败，请重试', 'error')
  } finally {
    isDeleteConfirmVisible.value = false
    productToDelete.value = null
    fetchProducts(currentPage.value)
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : '未分类'
}

const isEditMode = computed(() => !!productBeingEdited.value)
</script>

<template>
  <div class="product-management">
    <div class="header">
      <h1>商品管理</h1>
      <div class="actions-group">
        <div class="search-bar">
          <input
            type="text"
            v-model="searchKeyword"
            placeholder="按商品名称搜索..."
            @keyup.enter="handleSearch"
          />
          <button class="btn btn-secondary" @click="handleSearch">搜索</button>
        </div>
        <button class="btn btn-primary" @click="openAddModal">添加新商品</button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">正在加载...</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>商品名称</th>
            <th>价格</th>
            <th>库存</th>
            <th>分类</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product.id">
            <td>{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>¥ {{ product.price.toFixed(2) }}</td>
            <td>{{ product.stock }}</td>
            <td>{{ getCategoryName(product.categoryId) }}</td>
            <td class="actions">
              <button class="btn btn-secondary" @click="openEditModal(product)">编辑</button>
              <button class="btn btn-danger" @click="openDeleteConfirm(product)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="pagination">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">上一页</button>
        <span>第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
          下一页
        </button>
      </div>
    </div>
  </div>

  <ProductFormModal
    :show="isFormModalVisible"
    :categories="categories"
    :product-to-edit="productBeingEdited"
    @close="isFormModalVisible = false"
    @submit="handleFormSubmit"
  />

  <ConfirmationModal
    :show="isDeleteConfirmVisible"
    title="确认删除"
    :message="`您确定要删除商品 '${productToDelete?.name}' 吗？此操作不可撤销。`"
    @confirm="handleConfirmDelete"
    @cancel="isDeleteConfirmVisible = false"
  />
</template>

<style scoped>
/* 使用与 UserManagementView.vue 相同的样式 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.actions-group {
  display: flex;
  align-items: center;
  gap: 16px;
}
.search-bar {
  display: flex;
  gap: 8px;
}
.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.product-management {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header h1 {
  margin: 0;
  font-size: 24px;
}
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}
.btn-primary {
  background-color: #1890ff;
  color: white;
}
.btn-primary:hover {
  background-color: #40a9ff;
}
.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
.btn-danger {
  background-color: #f5222d;
  color: white;
}
.table-container {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}
thead th {
  background-color: #fafafa;
  font-weight: 600;
}
.actions button {
  margin-right: 8px;
}
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}
.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
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
