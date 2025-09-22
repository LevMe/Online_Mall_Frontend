<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { api } from '../../services/index.js'
import { useUserStore } from '../../store/user.js'
import { useCartStore } from '../../store/cart.js'
import ConfirmationModal from '../common/ConfirmationModal.vue'

const router = useRouter()
const userStore = useUserStore()
const cartStore = useCartStore()

const searchKeyword = ref('')
const showLogoutConfirm = ref(false)

// 登录后获取购物车数据
onMounted(async () => {
  // 核心修改：增加一个条件，确保只有普通用户登录时才获取购物车信息
  if (userStore.isLoggedIn && userStore.userInfo?.role !== 'ADMIN') {
    try {
      const cartData = await api.getCart()
      cartStore.setCart(cartData)
    } catch (error) {
      console.error('Header onMounted: 获取购物车失败', error)
    }
  }
})

const handleSearch = () => {
  if (!searchKeyword.value.trim()) return
  router.push({
    name: 'productList',
    query: { keyword: searchKeyword.value },
  })
}

const handleLogoutClick = () => {
  showLogoutConfirm.value = true
}

const confirmLogout = () => {
  userStore.clearUser()
  cartStore.clearCart()
  router.push({ name: 'home' })
  showLogoutConfirm.value = false
}
</script>

<template>
  <header class="app-header">
    <div class="container">
      <div class="logo">
        <RouterLink to="/">CoolStore</RouterLink>
      </div>

      <!-- 优化后的搜索栏 -->
      <form class="search-bar" @submit.prevent="handleSearch">
        <div class="search-input-wrapper">
          <svg
            class="search-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M10 18a7.952 7.952 0 0 0 4.897-1.688l4.396 4.396 1.414-1.414-4.396-4.396A7.952 7.952 0 0 0 18 10c0-4.411-3.589-8-8-8s-8 3.589-8 8 3.589 8 8 8zm0-14c3.309 0 6 2.691 6 6s-2.691 6-6 6-6-2.691-6-6 2.691-6 6-6z"
            ></path>
          </svg>
          <input type="text" placeholder="搜索商品、品牌..." v-model="searchKeyword" />
        </div>
      </form>

      <div class="header-right">
        <nav class="header-nav">
          <RouterLink :to="{ name: 'user-support' }" class="header-link">客户服务</RouterLink>
          <RouterLink v-if="userStore.isLoggedIn" :to="{ name: 'orders' }" class="header-link"
            >我的订单</RouterLink
          >
        </nav>

        <div class="user-area">
          <div v-if="userStore.isLoggedIn" class="user-profile">
            <span>{{ userStore.userInfo?.username }}</span>
            <a href="#" @click.prevent="handleLogoutClick" class="logout-btn">(退出)</a>
          </div>
          <div v-else>
            <RouterLink :to="{ name: 'auth' }" class="login-btn">登录/注册</RouterLink>
          </div>

          <div class="separator"></div>

          <RouterLink :to="{ name: 'cart' }" class="cart-icon">
            🛒
            <span v-if="cartStore.totalItems > 0" class="cart-badge">{{
              cartStore.totalItems
            }}</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </header>

  <ConfirmationModal
    :show="showLogoutConfirm"
    title="确认退出"
    message="您确定要退出当前账户吗？"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm = false"
  />
</template>

<style scoped>
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 40px;
  height: 60px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header .container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: 20px;
}

.logo a {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

/* --- 搜索框新样式 --- */
.search-bar {
  flex-grow: 1;
  display: flex;
  justify-content: center;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  /* max-width: 500px; */
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #999;
  pointer-events: none;
}

.search-bar input {
  width: 100%;
  padding: 10px 16px 10px 42px; /* 增加左内边距以容纳图标 */
  border: 1px solid #e0e0e0;
  border-radius: 20px; /* 圆角更大，呈药丸形 */
  font-size: 14px;
  background-color: #f5f5f5;
  transition: all 0.2s ease-in-out;
}

.search-bar input:focus {
  outline: none;
  border-color: #007aff;
  background-color: #fff;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.search-bar input::placeholder {
  color: #aaa;
}
/* --- 搜索框新样式结束 --- */

.header-right {
  display: flex;
  align-items: center;
  gap: 30px;
  flex-shrink: 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-link {
  font-size: 14px;
  text-decoration: none;
  color: #555;
  transition: color 0.2s;
}
.header-link:hover {
  color: #007aff;
}

.user-area {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.logout-btn {
  color: #888;
  font-size: 12px;
  text-decoration: none;
}
.logout-btn:hover {
  color: #e53935;
}

.login-btn {
  font-size: 14px;
  text-decoration: none;
  color: #333;
}

.separator {
  width: 1px;
  height: 16px;
  background-color: #e5e5e5;
}

.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
  text-decoration: none;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -10px;
  background-color: #e53935;
  color: white;
  border-radius: 50%;
  padding: 2px 5px;
  font-size: 10px;
  line-height: 1;
  font-weight: bold;
}
</style>
