// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/user/HomeView.vue'
import ProductListView from '../views/user/ProductListView.vue'
// 导入我们将要创建的详情页视图
import ProductDetailView from '../views/user/ProductDetailView.vue'
import AuthView from '../views/user/AuthView.vue'
import CartView from '../views/user/CartView.vue'
import AdminLayout from '../components/layout/AdminLayout.vue'
import ProductManagementView from '../views/admin/ProductManagementView.vue'
import CheckoutSuccessView from '../views/user/CheckoutSuccessView.vue'

const routes = [
  // ... home 和 productList 路由保持不变 ...
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/products',
    name: 'productList',
    component: ProductListView,
  },
  // --- 添加动态路由 ---
  // `:id` 是一个动态路径参数。
  // 当用户访问 /product/1, /product/2 等 URL 时，都会匹配到这个路由。
  // 我们可以在组件中通过 `route.params.id` 来获取这个值。
  {
    path: '/product/:id',
    name: 'productDetail',
    component: ProductDetailView,
  },

  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },

  {
    path: '/cart',
    name: 'cart',
    component: CartView,
  },

  {
    path: '/admin', // 所有后台页面的父路径
    component: AdminLayout, // 使用 AdminLayout 作为这些页面的布局
    // 在这里可以添加一个路由元信息（meta），用于未来的权限检查
    meta: { requiresAdmin: true },
    // `children` 数组定义了所有嵌套在 AdminLayout 中的子路由
    children: [
      {
        // 当访问 /admin/products 时，ProductManagementView 会被渲染到
        // AdminLayout 的 <router-view> 中
        path: 'products',
        name: 'adminProductList',
        component: ProductManagementView,
      },
      // 未来可以添加更多后台子路由
      // { path: 'users', name: 'adminUserList', component: ... }
    ],
  },

  {
    path: '/checkout-success',
    name: 'checkoutSuccess',
    component: CheckoutSuccessView,
  },
]

// ... router 实例创建部分保持不变 ...
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- 路由守卫（权限控制） ---
// 这是一个简单的示例，用于检查路由是否需要管理员权限
router.beforeEach((to, from, next) => {
  // 检查目标路由是否标记了 requiresAdmin
  if (to.meta.requiresAdmin) {
    // 在真实应用中，这里应该检查 userStore.userInfo.isAdmin === true
    // 我们先用一个 alert 来模拟权限检查
    const isAdmin = confirm('这是一个后台页面，您是否是管理员？') // 临时使用 confirm
    if (isAdmin) {
      next() // 如果是管理员，则放行
    } else {
      alert('您没有权限访问此页面！')
      next({ name: 'home' }) // 如果不是，则重定向到首页
    }
  } else {
    next() // 如果路由不需要权限，则直接放行
  }
})

export default router
