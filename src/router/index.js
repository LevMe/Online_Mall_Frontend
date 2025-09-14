// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

// --- 视图组件 ---
import HomeView from '../views/user/HomeView.vue'
import ProductListView from '../views/user/ProductListView.vue'
import ProductDetailView from '../views/user/ProductDetailView.vue'
import AuthView from '../views/user/AuthView.vue'
import CartView from '../views/user/CartView.vue'
import CheckoutSuccessView from '../views/user/CheckoutSuccessView.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import ProductManagementView from '../views/admin/ProductManagementView.vue'
import UserSupportView from '@/views/user/UserSupportView.vue'
import OrderView from '@/views/user/OrderView.vue'

const routes = [
  // --- 用户前台路由 ---
  { path: '/', name: 'home', component: HomeView },
  { path: '/products', name: 'productList', component: ProductListView },
  { path: '/product/:id', name: 'productDetail', component: ProductDetailView },
  { path: '/auth', name: 'auth', component: AuthView },
  { path: '/user-support', name: 'user-support', component: UserSupportView },
  {
    path: '/orders',
    name: 'orders',
    component: OrderView,
    meta: { requiresAuth: true }, // 需要登录才能访问
  },
  {
    path: '/cart',
    name: 'cart',
    component: CartView,
    meta: { requiresAuth: true }, // 需要登录才能访问
  },
  {
    path: '/checkout-success',
    name: 'checkoutSuccess',
    component: CheckoutSuccessView,
    meta: { requiresAuth: true }, // 需要登录才能访问
  },

  // --- 后台管理路由 ---
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAdmin: true }, // 需要管理员权限
    children: [
      {
        path: 'products',
        name: 'adminProductList',
        component: ProductManagementView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 全局路由守卫 ---
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 检查需要登录的路由
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 用户未登录，重定向到登录页
    next({ name: 'auth' })
  }
  // 检查需要管理员权限的路由
  else if (to.meta.requiresAdmin) {
    if (!userStore.isLoggedIn) {
      next({ name: 'auth' }) // 未登录，去登录
    } else {
      // TODO: 这里需要根据后端返回的用户信息判断角色
      // 目前API的 a/auth/login 响应中 userInfo 不包含角色信息
      // 暂时只判断是否登录
      console.warn('管理员权限检查未完全实现，缺少用户角色信息。')
      next() // 已登录，暂时放行
    }
  }
  // 其他情况，直接放行
  else {
    next()
  }
})

export default router
