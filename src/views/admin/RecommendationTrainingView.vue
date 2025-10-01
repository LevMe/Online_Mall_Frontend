<script setup>
import { ref, onMounted } from 'vue'
import { api } from '../../services/index.js'
import { useNotificationStore } from '../../store/notification.js'

const behaviors = ref([])
const isLoading = ref(true)
const isTraining = ref(false)
const notificationStore = useNotificationStore()

// 获取用户行为数据
const fetchBehaviors = async () => {
  isLoading.value = true
  try {
    const data = await api.getBehaviors()
    behaviors.value = data
  } catch (error) {
    notificationStore.showNotification(error.message || '获取行为数据失败', 'error')
  } finally {
    isLoading.value = false
  }
}

// 格式化时间戳
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A'
  return new Date(timestamp).toLocaleString()
}

// 触发模型训练
const handleTriggerTraining = async () => {
  isTraining.value = true
  try {
    const response = await api.triggerTraining()
    notificationStore.showNotification(response || '已成功触发训练任务', 'success', 5000)
  } catch (error) {
    notificationStore.showNotification(error.message || '触发训练失败', 'error')
  } finally {
    isTraining.value = false
  }
}

onMounted(fetchBehaviors)
</script>

<template>
  <div class="recommendation-management">
    <div class="header">
      <h1>推荐系统管理</h1>
      <p>查看用户行为日志并手动触发模型离线训练。</p>
    </div>

    <div v-if="isLoading" class="loading-state">正在加载用户行为记录...</div>

    <div v-else class="table-container">
      <table>
        <thead>
          <tr>
            <th>用户ID</th>
            <th>商品ID</th>
            <th>行为类型</th>
            <th>时间戳</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="behaviors.length === 0">
            <td colspan="4" class="no-data">暂无用户行为记录</td>
          </tr>
          <tr v-for="(behavior, index) in behaviors" :key="index">
            <td>{{ behavior.userId }}</td>
            <td>{{ behavior.productId }}</td>
            <td>
              <span class="tag" :class="`tag-${behavior.eventType}`">{{ behavior.eventType }}</span>
            </td>
            <td>{{ formatTimestamp(behavior.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-actions">
      <button class="btn btn-primary" @click="handleTriggerTraining" :disabled="isTraining">
        {{ isTraining ? '正在触发...' : '手动触发离线训练' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.recommendation-management {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header {
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.header h1 {
  margin: 0;
  font-size: 24px;
}
.header p {
  margin: 5px 0 0;
  color: #666;
}

.loading-state,
.no-data {
  text-align: center;
  padding: 40px;
  color: #999;
}

.table-container {
  width: 100%;
  overflow-x: auto;
  max-height: 60vh; /* 限制表格最大高度，超出部分可滚动 */
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
  position: sticky;
  top: 0;
}

.tag {
  padding: 3px 8px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
}
.tag-click {
  background-color: #1890ff;
}
.tag-addToCart {
  background-color: #52c41a;
}
.tag-purchase {
  background-color: #f5222d;
}

.footer-actions {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #1890ff;
  color: white;
}
.btn-primary:hover {
  background-color: #40a9ff;
}
.btn:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}
</style>
