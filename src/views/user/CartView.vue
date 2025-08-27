<script setup>
import { onMounted } from 'vue'
import { api } from '../../services/index.js'

// 导入需要的 stores
import { useCartStore } from '../../store/cart.js'
import { useNotificationStore } from '../../store/notification.js'

const cartStore = useCartStore()
const notificationStore = useNotificationStore()

// 组件挂载时，从 API 获取最新的购物车数据，确保数据同步
onMounted(async () => {
  try {
    const cartData = await api.getCart()
    cartStore.setCart(cartData)
  } catch (error) {
    console.error('获取购物车失败:', error)
  }
})

// 处理数量变更的函数
const handleUpdateQuantity = async (item, newQuantity) => {
  // 确保数量至少为 1
  const quantity = Math.max(1, newQuantity)
  try {
    const updatedCart = await api.updateCartItem(item.id, quantity)
    cartStore.setCart(updatedCart)
    notificationStore.showNotification('购物车已更新', 'success')
  } catch (error) {
    notificationStore.showNotification('更新失败', 'error')
  }
}

// 处理删除商品的函数
const handleDeleteItem = async (itemId) => {
  try {
    const updatedCart = await api.deleteCartItem(itemId)
    cartStore.setCart(updatedCart)
    notificationStore.showNotification('商品已从购物车移除', 'success')
  } catch (error) {
    notificationStore.showNotification('移除失败', 'error')
  }
}
</script>

<template>
  <main class="cart-page">
    <div class="container">
      <h1>我的购物车</h1>
      <!-- 当购物车不为空时 -->
      <div v-if="cartStore.items.length > 0" class="cart-content">
        <div class="cart-items">
          <!-- 遍历购物车商品 -->
          <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
            <img :src="item.product.imageUrl" :alt="item.product.name" class="item-image" />
            <div class="item-details">
              <h3>{{ item.product.name }}</h3>
              <p class="item-price">¥ {{ item.product.price.toFixed(2) }}</p>
            </div>
            <div class="item-quantity">
              <input
                type="number"
                :value="item.quantity"
                @change="handleUpdateQuantity(item, parseInt($event.target.value))"
                min="1"
              />
            </div>
            <div class="item-total">¥ {{ (item.product.price * item.quantity).toFixed(2) }}</div>
            <button @click="handleDeleteItem(item.id)" class="delete-btn">×</button>
          </div>
        </div>
        <div class="cart-summary">
          <h2>订单摘要</h2>
          <div class="summary-row">
            <span>商品总计</span>
            <span>¥ {{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <button class="checkout-btn">前往结算</button>
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
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}
h1 {
  margin-bottom: 30px;
}
.cart-content {
  display: flex;
  gap: 30px;
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
  height: fit-content; /* 高度自适应内容 */
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
