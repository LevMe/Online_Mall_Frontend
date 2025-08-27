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

onMounted(async () => {
  if (userStore.isLoggedIn) {
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

      <!-- 分类导航已移除 -->

      <form class="search-bar" @submit.prevent="handleSearch">
        <input type="text" placeholder="搜索商品..." v-model="searchKeyword" />
      </form>

      <div class="user-area">
        <div v-if="userStore.isLoggedIn" class="user-profile">
          <span>欢迎, {{ userStore.userInfo?.name }}</span>
          <a href="#" @click.prevent="handleLogoutClick" class="logout-btn">退出</a>
          <RouterLink :to="{ name: 'cart' }" class="cart-icon">
            🛒<span v-if="cartStore.totalItems > 0">{{ cartStore.totalItems }}</span>
          </RouterLink>
        </div>
        <div v-else>
          <RouterLink :to="{ name: 'auth' }" class="login-btn">登录</RouterLink>
        </div>
      </div>
    </div>
  </header>

  <ConfirmationModal
    :show="showLogoutConfirm"
    title="确认退出"
    message="您确定要退出当前账户吗？"
    @confirm="confirmLogout"
    @cancel="showLogoutConfirm.value = false"
  />
</template>

<style scoped>
/* 样式基本不变，微调 search-bar 的 margin */
.search-bar {
  flex-grow: 1;
  margin: 0 50px; /* 调整左右边距 */
}

/* --- 以下为原有样式 --- */
.user-area a {
  margin-left: 15px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
}
.user-profile {
  display: flex;
  align-items: center;
  gap: 15px;
}
.user-profile span {
  font-size: 14px;
}
.logout-btn {
  color: #e53935;
}
.cart-icon {
  position: relative;
  cursor: pointer;
  font-size: 20px;
}
.cart-icon span {
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
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  padding: 0 40px;
  height: 60px;
}
.app-header .container {
  display: flex;
  align-items: center;
  height: 100%;
}
.logo a {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}
.search-bar input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}
</style>
