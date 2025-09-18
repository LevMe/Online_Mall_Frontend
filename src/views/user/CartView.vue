<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '../../services/index.js'
import { useCartStore } from '../../store/cart.js'
import { useNotificationStore } from '../../store/notification.js'

const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const router = useRouter()

// 用于控制结算按钮的加载状态
const isCheckingOut = ref(false)

// 组件挂载时，从 API 获取最新的购物车数据
onMounted(async () => {
  try {
    const cartData = await api.getCart()
    cartStore.setCart(cartData)
  } catch (error) {
    console.error('获取购物车失败:', error)
    notificationStore.showNotification(error.message || '获取购物车失败', 'error')
  }
})

// 更新购物车数据并通知用户的辅助函数
const refreshCart = async () => {
  try {
    const cartData = await api.getCart()
    cartStore.setCart(cartData)
  } catch (error) {
    notificationStore.showNotification('刷新购物车失败', 'error')
  }
}

// 处理数量变更的函数
const handleUpdateQuantity = async (item, newQuantity) => {
  const quantity = Math.max(1, newQuantity)
  try {
    // 调用更新接口
    await api.updateCartItem(item.cartItemId, quantity)
    // 更新成功后，重新获取整个购物车数据
    await refreshCart()
    notificationStore.showNotification('购物车已更新', 'success')
  } catch (error) {
    notificationStore.showNotification(error.message || '更新失败', 'error')
  }
}

// 处理删除商品的函数
const handleDeleteItem = async (cartItemId) => {
  try {
    await api.deleteCartItem(cartItemId)
    await refreshCart()
    notificationStore.showNotification('商品已从购物车移除', 'success')
  } catch (error) {
    notificationStore.showNotification(error.message || '移除失败', 'error')
  }
}

// 处理结算的函数
const handleCheckout = async () => {
  if (isCheckingOut.value) return
  isCheckingOut.value = true

  try {
    // 调用创建订单 API
    await api.createOrder()
    // 订单创建成功后，后端会自动清空购物车，前端也需要同步状态
    cartStore.clearCart()
    // 跳转到成功页面
    router.push({ name: 'checkoutSuccess' })
    notificationStore.showNotification('订单创建成功！', 'success')
  } catch (error) {
    notificationStore.showNotification(error.message || '结算失败，请稍后再试', 'error')
  } finally {
    isCheckingOut.value = false
  }
}
</script>

<template>
  <main class="cart-page">
    <div class="container">
      <h1>我的购物车</h1>
      <!-- 根据 store 中的 items 长度判断 -->
      <div v-if="cartStore.items.length > 0" class="cart-content">
        <div class="cart-items">
          <!-- 遍历购物车商品 -->
          <div v-for="item in cartStore.items" :key="item.cartItemId" class="cart-item">
            <!-- 数据字段名与 API 保持一致 -->
            <img :src="item.imageUrl" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h3>{{ item.name }}</h3>
              <p class="item-price">¥ {{ item.price.toFixed(2) }}</p>
            </div>
            <div class="item-quantity">
              <input
                type="number"
                :value="item.quantity"
                @change="handleUpdateQuantity(item, parseInt($event.target.value))"
                min="1"
              />
            </div>
            <div class="item-total">¥ {{ (item.price * item.quantity).toFixed(2) }}</div>
            <button @click="handleDeleteItem(item.cartItemId)" class="delete-btn">×</button>
          </div>
        </div>
        <div class="cart-summary">
          <h2>订单摘要</h2>
          <div class="summary-row">
            <span>商品总计</span>
            <!-- 直接使用 store 中的 totalPrice -->
            <span>¥ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <button @click="handleCheckout" :disabled="isCheckingOut" class="checkout-btn">
            {{ isCheckingOut ? '正在处理...' : '前往结算' }}
          </button>
        </div>
      </div>
      <!-- 当购物车为空时 -->
      <div v-else class="empty-cart">
        <p>您的购物车是空的。</p>
        <RouterLink to="/" class="go-shopping-btn">去逛逛</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.cart-page {
  padding: 40px 0;
  background-color: #f9f9f9;
  min-height: calc(100vh - 140px);
}
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}
h1 {
  margin-bottom: 30px;
}
.cart-content {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}
.cart-items {
  flex: 3;
}
.cart-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 15px;
}
.item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 20px;
}
.item-details {
  flex-grow: 1;
}
.item-details h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
}
.item-price {
  color: #666;
  margin: 0;
}
.item-quantity input {
  width: 60px;
  text-align: center;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.item-total {
  width: 120px;
  text-align: right;
  font-weight: bold;
}
.delete-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  margin-left: 20px;
}
.cart-summary {
  flex: 1;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  height: fit-content;
  position: sticky;
  top: 40px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 18px;
}
.checkout-btn {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  color: #fff;
  background-color: #007aff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.checkout-btn:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}
.empty-cart {
  text-align: center;
  padding: 50px;
  background-color: #fff;
  border-radius: 8px;
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
