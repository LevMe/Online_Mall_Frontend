<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../../services/index.js'
import ProductFormModal from '../../components/admin/ProductFormModal.vue'
import { useNotificationStore } from '../../store/notification.js'

// 1. 导入 ConfirmationModal 组件
import ConfirmationModal from '../../components/common/ConfirmationModal.vue'

// --- 响应式状态 ---
const allProducts = ref([])
const categories = ref([])
const isLoading = ref(true)
const isFormModalVisible = ref(false) // 表单模态框
const notificationStore = useNotificationStore()
const productBeingEdited = ref(null)

// 2. 新增：删除确认模态框的状态
const isDeleteConfirmVisible = ref(false)
const productToDelete = ref(null) // 存储待删除的商品对象

// --- 分页状态 ---
const currentPage = ref(1)
const itemsPerPage = ref(5)

// --- 计算属性 ---
const totalPages = computed(() => Math.ceil(allProducts.value.length / itemsPerPage.value))
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return allProducts.value.slice(start, start + itemsPerPage.value)
})

// --- 方法 ---

// 打开“添加”模态框
const openAddModal = () => {
  productBeingEdited.value = null
  isFormModalVisible.value = true
}

// 打开“编辑”模态框
const openEditModal = (product) => {
  productBeingEdited.value = product
  isFormModalVisible.value = true
}

// 统一的表单提交处理器
const handleFormSubmit = async (productData) => {
  // ... (此部分逻辑保持不变)
  if (productBeingEdited.value) {
    try {
      const updatedProduct = await api.updateProduct(productBeingEdited.value.id, productData)
      const index = allProducts.value.findIndex((p) => p.id === updatedProduct.id)
      if (index !== -1) allProducts.value[index] = updatedProduct
      notificationStore.showNotification('商品更新成功！', 'success')
    } catch (error) {
      notificationStore.showNotification('更新失败，请重试', 'error')
    }
  } else {
    try {
      const newProduct = await api.addProduct(productData)
      allProducts.value.unshift(newProduct)
      notificationStore.showNotification('商品添加成功！', 'success')
    } catch (error) {
      notificationStore.showNotification('添加失败，请重试', 'error')
    }
  }
  isFormModalVisible.value = false
}

// 3. 新增：打开删除确认模态框
const openDeleteConfirm = (product) => {
  productToDelete.value = product
  isDeleteConfirmVisible.value = true
}

// 4. 新增：处理确认删除的逻辑
const handleConfirmDelete = async () => {
  if (!productToDelete.value) return

  try {
    await api.deleteProduct(productToDelete.value.id)
    // 从前端列表中移除该商品
    allProducts.value = allProducts.value.filter((p) => p.id !== productToDelete.value.id)
    notificationStore.showNotification('商品删除成功！', 'success')
  } catch (error) {
    notificationStore.showNotification('删除失败，请重试', 'error')
  } finally {
    // 关闭模态框并重置状态
    isDeleteConfirmVisible.value = false
    productToDelete.value = null
  }
}

const getCategoryName = (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  return category ? category.name : '未分类'
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

onMounted(async () => {
  try {
    const [productsData, categoriesData] = await Promise.all([
      api.getProducts(),
      api.getCategories(),
    ])
    allProducts.value = productsData
    categories.value = categoriesData
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="product-management">
    <div class="header">
      <h1>商品管理</h1>
      <button class="btn btn-primary" @click="openAddModal">添加新商品</button>
    </div>

    <div v-if="isLoading" class="loading-state">正在加载...</div>

    <div velse class="table-container">
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
              <!-- 5. 将“删除”按钮的点击事件绑定到 openDeleteConfirm 函数 -->
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

  <!-- 添加/编辑商品的表单模态框 -->
  <ProductFormModal
    :show="isFormModalVisible"
    :categories="categories"
    :product-to-edit="productBeingEdited"
    @close="isFormModalVisible = false"
    @submit="handleFormSubmit"
  />

  <!-- 6. 添加删除确认模态框 -->
  <ConfirmationModal
    :show="isDeleteConfirmVisible"
    title="确认删除"
    :message="`您确定要删除商品 '${productToDelete?.name}' 吗？此操作不可撤销。`"
    @confirm="handleConfirmDelete"
    @cancel="isDeleteConfirmVisible = false"
  />
</template>

<style scoped>
/* 所有样式保持不变 */
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
