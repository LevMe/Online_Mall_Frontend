<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { api } from '../../services/index.js'

// 1. 导入所有需要的 stores
import { useUserStore } from '../../store/user.js'
import { useCartStore } from '../../store/cart.js'
import { useNotificationStore } from '../../store/notification.js'

const route = useRoute()
const router = useRouter()

// 2. 获取 store 实例
const userStore = useUserStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

const product = ref(null)
const isLoading = ref(true)
const isAdding = ref(false) // 用于防止重复点击“加入购物车”
const quantity = ref(1) // 新增：用于控制商品数量

onMounted(async () => {
  const productId = route.params.id
  try {
    // 1. 获取商品详情 (保持不变)
    const data = await api.getProductById(productId)
    product.value = data

    // 2. 【新增】如果用户已登录，则上报点击行为
    if (userStore.isLoggedIn) {
      try {
        await api.trackBehavior(productId, 'click')
        console.log(`Behavior tracked for product ${productId}`) // (可选) 开发时方便调试
      } catch (trackError) {
        // 即便上报失败，也不应该影响用户查看商品，所以在控制台记录错误即可
        console.error('Failed to track behavior:', trackError)
      }
    }
  } catch (error) {
    console.error('获取商品详情失败:', error)
  } finally {
    isLoading.value = false
  }
})

// 3. 重写“加入购物车”的处理函数
const handleAddToCart = async () => {
  // 检查用户是否登录
  if (!userStore.isLoggedIn) {
    // 如果未登录，提示并跳转到登录页
    alert('请先登录后再添加商品') // 临时 alert
    router.push({ name: 'auth' })
    return
  }

  // 如果正在添加中，则直接返回，防止重复提交
  if (isAdding.value) return

  isAdding.value = true
  try {
    // 调用 API 将商品加入购物车，使用 ref 中的数量
    const updatedCart = await api.addToCart(product.value.id, quantity.value)

    // 使用返回的最新购物车数据更新 cart store
    cartStore.setCart(updatedCart)

    // 显示成功通知
    notificationStore.showNotification('已成功添加到购物车', 'success')
  } catch (error) {
    console.error('添加购物车失败:', error)
    // 显示失败通知
    notificationStore.showNotification(`添加失败: ${error.message || error}`, 'error')
  } finally {
    // 无论成功或失败，操作完成后都将 isAdding 状态重置
    isAdding.value = false
  }
}
</script>

<template>
  <main class="product-detail-page">
    <div class="container">
      <div v-if="isLoading" class="loading">正在加载商品信息...</div>

      <div v-else-if="product" class="product-content">
        <div class="product-image">
          <!-- API返回的是一个imageUrls数组，我们显示第一张图片 -->
          <img
            :src="product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : ''"
            :alt="product.name"
          />
        </div>
        <div class="product-info">
          <h1>{{ product.name }}</h1>
          <p class="price">¥ {{ product.price.toFixed(2) }}</p>
          <p class="description">
            {{ product.description }}
          </p>

          <!-- 新增：数量选择器 -->
          <div class="quantity-selector">
            <label for="quantity">数量：</label>
            <button @click="quantity > 1 ? quantity-- : null" class="quantity-btn">-</button>
            <input type="number" id="quantity" v-model.number="quantity" min="1" />
            <button @click="quantity++" class="quantity-btn">+</button>
          </div>

          <!-- 
            将按钮的 disabled 状态与 isAdding 绑定。
            按钮的文本也会根据 isAdding 的状态变化。
          -->
          <button @click="handleAddToCart" class="add-to-cart-btn" :disabled="isAdding">
            {{ isAdding ? '正在添加...' : '加入购物车' }}
          </button>

          <!-- 新增：商品规格参数表格 -->
          <div v-if="product.specs && Object.keys(product.specs).length > 0" class="product-specs">
            <h2>商品规格</h2>
            <table>
              <tbody>
                <tr v-for="(value, key) in product.specs" :key="key">
                  <td class="spec-key">{{ key }}</td>
                  <td class="spec-value">{{ value }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h2>抱歉，商品不存在</h2>
        <p>您要找的商品可能已下架或链接有误。</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.add-to-cart-btn:disabled {
  background-color: #a5a5a5;
  cursor: not-allowed;
}

.product-detail-page {
  padding: 60px 0;
  background-color: #fff;
  min-height: calc(100vh - 140px);
}
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}
.loading,
.not-found {
  text-align: center;
  padding: 50px;
  color: #666;
}
.product-content {
  display: flex;
  gap: 40px;
}
.product-image {
  flex: 1;
}
.product-image img {
  width: 100%;
  border-radius: 8px;
}
.product-info {
  flex: 1;
}
.product-info h1 {
  margin-top: 0;
  font-size: 32px;
}
.price {
  font-size: 28px;
  font-weight: bold;
  color: #000;
  margin: 20px 0;
}
.description {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 30px;
}
/* 新增：数量选择器样式 */
.quantity-selector {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 10px;
}
.quantity-selector label {
  font-size: 16px;
  color: #333;
}
.quantity-selector input {
  width: 60px;
  text-align: center;
  font-size: 16px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  cursor: pointer;
  font-size: 18px;
}

.add-to-cart-btn {
  display: inline-block;
  padding: 15px 30px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  background-color: #007aff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.add-to-cart-btn:hover {
  background-color: #0056b3;
}
/* 新增：规格表格样式 */
.product-specs {
  margin-top: 40px;
}
.product-specs h2 {
  font-size: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.product-specs table {
  width: 100%;
  border-collapse: collapse;
}
.product-specs td {
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.spec-key {
  font-weight: bold;
  color: #555;
  width: 120px;
}
</style>
