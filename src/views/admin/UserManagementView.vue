<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from '../../services/index.js'
import UserFormModal from '@/views/admin/UserFormModal.vue'
import { useNotificationStore } from '../../store/notification.js'
import ConfirmationModal from '../../components/common/ConfirmationModal.vue'

const allUsers = ref([])
const isLoading = ref(true)
const isFormModalVisible = ref(false)
const notificationStore = useNotificationStore()
const userBeingEdited = ref(null)
const isDeleteConfirmVisible = ref(false)
const userToDelete = ref(null)

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalUsers = ref(0)

const totalPages = computed(() => Math.ceil(totalUsers.value / itemsPerPage.value))

const openAddModal = () => {
  userBeingEdited.value = null
  isFormModalVisible.value = true
}

const openEditModal = (user) => {
  userBeingEdited.value = { ...user }
  isFormModalVisible.value = true
}

const handleFormSubmit = async (userData) => {
  try {
    if (userBeingEdited.value) {
      const updatedUser = await api.updateUser(userBeingEdited.value.id, userData)
      const index = allUsers.value.findIndex((u) => u.id === updatedUser.id)
      if (index !== -1) {
        allUsers.value.splice(index, 1, updatedUser)
      }
      notificationStore.showNotification('用户更新成功！', 'success')
    } else {
      const newUser = await api.createUser(userData)
      allUsers.value.unshift(newUser)
      notificationStore.showNotification('用户添加成功！', 'success')
    }
  } catch (error) {
    notificationStore.showNotification(error.message || '操作失败，请重试', 'error')
  } finally {
    isFormModalVisible.value = false
    fetchUsers(currentPage.value)
  }
}

const openDeleteConfirm = (user) => {
  userToDelete.value = user
  isDeleteConfirmVisible.value = true
}

const handleConfirmDelete = async () => {
  if (!userToDelete.value) return

  try {
    await api.deleteUser(userToDelete.value.id)
    allUsers.value = allUsers.value.filter((u) => u.id !== userToDelete.value.id)
    notificationStore.showNotification('用户删除成功！', 'success')
  } catch (error) {
    notificationStore.showNotification(error.message || '删除失败，请重试', 'error')
  } finally {
    isDeleteConfirmVisible.value = false
    userToDelete.value = null
    fetchUsers(currentPage.value)
  }
}

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    fetchUsers(page)
  }
}

const fetchUsers = async (page) => {
  isLoading.value = true
  try {
    const response = await api.getUsers({ pageNo: page, pageSize: itemsPerPage.value })
    allUsers.value = response.items
    totalUsers.value = response.total
  } catch (error) {
    notificationStore.showNotification(error.message || '获取用户数据失败', 'error')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchUsers(currentPage.value)
})
</script>

<template>
  <div class="user-management">
    <div class="header">
      <h1>用户管理</h1>
      <button class="btn btn-primary" @click="openAddModal">添加新用户</button>
    </div>

    <div v-if="isLoading" class="loading-state">正在加载...</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>邮箱</th>
            <th>角色</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in allUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td class="actions">
              <button class="btn btn-secondary" @click="openEditModal(user)">编辑</button>
              <button class="btn btn-danger" @click="openDeleteConfirm(user)">删除</button>
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

  <UserFormModal
    :show="isFormModalVisible"
    :user-to-edit="userBeingEdited"
    @close="isFormModalVisible = false"
    @submit="handleFormSubmit"
  />

  <ConfirmationModal
    :show="isDeleteConfirmVisible"
    title="确认删除"
    :message="`您确定要删除用户 '${userToDelete?.username}' 吗？此操作不可撤销。`"
    @confirm="handleConfirmDelete"
    @cancel="isDeleteConfirmVisible = false"
  />
</template>

<style scoped>
.user-management {
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
