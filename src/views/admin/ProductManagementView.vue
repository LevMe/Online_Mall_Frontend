<script setup>
// ... (保留所有已有的响应式状态和方法)
import { ref, onMounted, computed } from 'vue'
import { api } from '../../services/index.js'
import ProductFormModal from '../../components/admin/ProductFormModal.vue'
import { useNotificationStore } from '../../store/notification.js'
import ConfirmationModal from '../../components/common/ConfirmationModal.vue'

// --- 响应式状态 ---
const allProducts = ref([])
const categories = ref([])
const isLoading = ref(true)
const isFormModalVisible = ref(false)
const notificationStore = useNotificationStore()
const productBeingEdited = ref(null)
const isDeleteConfirmVisible = ref(false)
const productToDelete = ref(null)

// --- 分页状态 ---
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalProducts = ref(0) // 新增：用于存储总数

// --- 计算属性 ---
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage.value))
// paginatedProducts 现在直接使用 allProducts，因为数据已经是分页好的
const paginatedProducts = computed(() => allProducts.value)

// --- 方法 ---
const fetchProducts = async (page) => {
  isLoading.value = true
  try {
    const [productsResponse, categoriesData] = await Promise.all([
      api.getAdminProducts({ pageNo: page, pageSize: itemsPerPage.value }), // 调用正确的API
      api.getCategories(),
    ])
    allProducts.value = productsResponse.items
    totalProducts.value = productsResponse.total // 更新总数
    categories.value = categoriesData
  } catch (error) {
    notificationStore.showNotification(error.message || '获取数据失败', 'error')
  } finally {
    isLoading.value = false
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchProducts(page) // 翻页时重新获取数据
  }
}

// --- 生命周期钩子 ---
onMounted(() => {
  fetchProducts(currentPage.value) // 页面加载时获取第一页数据
})

// ... (保留 handleFormSubmit, openDeleteConfirm 等其他方法)
const openAddModal = () => {
  productBeingEdited.value = null
  isFormModalVisible.value = true
}

const openEditModal = (product) => {
  productBeingEdited.value = { ...product } // 传递副本以防意外修改
  isFormModalVisible.value = true
}

const handleFormSubmit = async (productData) => {
  try {
    if (isEditMode.value) {
      // 编辑模式
      await api.updateProduct(productBeingEdited.value.id, productData)
      notificationStore.showNotification('商品更新成功！', 'success')
    } else {
      // 添加模式
      await api.addProduct(productData)
      notificationStore.showNotification('商品添加成功！', 'success')
    }
  } catch (error) {
    notificationStore.showNotification(error.message || '操作失败，请重试', 'error')
  } finally {
    isFormModalVisible.value = false
    fetchProducts(currentPage.value) // 重新加载当前页数据
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
    fetchProducts(currentPage.value) // 重新加载当前页数据
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
      <button class="btn btn-primary" @click="openAddModal">添加新商品</button>
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
/* 样式保持不变 */
.product-management {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
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
