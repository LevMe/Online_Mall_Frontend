<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { api } from '../../services/index.js'
import { useNotificationStore } from '../../store/notification.js'

const orders = ref([])
const isLoading = ref(true)
const notificationStore = useNotificationStore()

onMounted(async () => {
  try {
    const data = await api.getOrders()
    orders.value = data
  } catch (error) {
    notificationStore.showNotification(error.message || '获取订单失败', 'error')
  } finally {
    isLoading.value = false
  }
})

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return ''
  const date = new Date(dateTimeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <main class="order-page">
    <div class="container">
      <h1>我的订单</h1>

      <div v-if="isLoading" class="loading-state">
        <p>正在加载订单记录...</p>
      </div>

      <div v-else-if="orders.length > 0" class="order-list">
        <div v-for="order in orders" :key="order.id" class="order-card">
          <div class="order-header">
            <span>订单号: {{ order.id }}</span>
            <span class="order-status">{{ order.status }}</span>
          </div>
          <div class="order-body">
            <div v-for="item in order.items" :key="item.productId" class="order-item">
              <img :src="item.productImageUrl" :alt="item.productName" />
              <div class="item-info">
                <p>{{ item.productName }}</p>
                <p class="item-spec">单价: ¥{{ item.price.toFixed(2) }} x {{ item.quantity }}</p>
              </div>
            </div>
          </div>
          <div class="order-footer">
            <span>下单时间: {{ formatDateTime(order.createdAt) }}</span>
            <span class="total-amount"
              >总计: <strong>¥ {{ order.totalAmount.toFixed(2) }}</strong></span
            >
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>您还没有任何订单记录。</p>
        <RouterLink to="/" class="go-shopping-btn">去逛逛</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.order-page {
  padding: 40px 0;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
}
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}
h1 {
  margin-bottom: 30px;
}
.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.order-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}
.order-header {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  color: #666;
  font-size: 14px;
}
.order-status {
  font-weight: bold;
  color: #007aff;
}
.order-body {
  padding: 10px 20px;
}
.order-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.order-item + .order-item {
  border-top: 1px solid #f0f0f0;
}
.order-item img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}
.item-info p {
  margin: 0;
}
.item-spec {
  color: #999;
  font-size: 12px;
}
.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
}
.total-amount strong {
  font-size: 18px;
  color: #e53935;
}
.loading-state,
.empty-state {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 8px;
  color: #666;
}
.go-shopping-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007aff;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
}
</style>
