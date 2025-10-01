import axios from 'axios'
import { useUserStore } from '../store/user'

// 1. 创建并配置 axios 实例
const apiClient = axios.create({
  baseURL: '/api/v1', // 使用 Vite 代理
  timeout: 5000,
})

// 2. 添加请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      // 在请求头中添加 Authorization
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 3. 添加响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 检查响应体结构是否符合 { code, message, data }
    if (response.data && typeof response.data.code !== 'undefined') {
      if (response.data.code === 200 || response.data.code === 201) {
        // 业务成功，直接返回 data 部分
        return response.data.data
      } else {
        // 业务失败，构造一个 Error 对象并拒绝 Promise
        const error = new Error(response.data.message || 'Error')
        error.code = response.data.code
        return Promise.reject(error)
      }
    }
    // 如果响应体结构不匹配，则直接返回原始响应数据
    return response.data
  },
  (error) => {
    // 处理网络错误或HTTP状态码非2xx的情况
    const message = error.response?.data?.message || error.message || '网络错误，请稍后再试'
    return Promise.reject(new Error(message))
  },
)

export const api = {
  // --- 商品与分类 ---
  getProducts: (params = {}) => {
    // 将返回的数据结构从 items 数组调整为完整的响应对象
    return apiClient.get('/products', { params })
  },
  getRecommendations: (params = {}) => {
    return apiClient.get('/products/recommendations', { params })
  },
  getCategories: () => {
    return apiClient.get('/categories')
  },
  getProductById: (id) => {
    return apiClient.get(`/products/${id}`)
  },

  // --- 用户认证 ---
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials)
  },
  register: (userData) => {
    return apiClient.post('/users/register', userData)
  },

  // --- 购物车 ---
  getCart: () => {
    return apiClient.get('/cart')
  },
  addToCart: (productId, quantity) => {
    return apiClient.post('/cart/items', { productId, quantity })
  },
  updateCartItem: (cartItemId, quantity) => {
    return apiClient.put(`/cart/items/${cartItemId}`, { quantity })
  },
  deleteCartItem: (cartItemId) => {
    return apiClient.delete('/cart/items', {
      data: { cartItemIds: [cartItemId] },
    })
  },

  // --- 跟踪用户点击行为 ---
  // --- 用户行为 ---
  trackBehavior: (productId, eventType = 'click') => {
    return apiClient.post('/behaviors/track', {
      productId,
      eventType,
      timestamp: new Date().toISOString(), // 直接生成当前时间的 ISO 字符串
    })
  },

  // --- 订单 ---
  createOrder: () => {
    return apiClient.post('/orders')
  },
  getOrders: () => {
    return apiClient.get('/orders')
  },

  // --- 结算 (模拟) ---
  checkout: () => {
    console.warn('调用了模拟的 checkout API。请与后端确认实际接口。')
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ message: '结算成功' })
      }, 600)
    })
  },

  // --- 管理员模块 ---
  getAdminProducts: (params = {}) => {
    return apiClient.get('/admin/products', { params })
  },
  addProduct: (productData) => {
    return apiClient.post('/admin/products', productData)
  },
  updateProduct: (productId, productData) => {
    return apiClient.put(`/admin/products/${productId}`, productData)
  },
  deleteProduct: (productId) => {
    return apiClient.delete(`/admin/products/${productId}`)
  },
  getUsers: (params = {}) => {
    return apiClient.get('/admin/users', { params })
  },
  createUser: (userData) => {
    return apiClient.post('/admin/users', userData)
  },
  updateUser: (userId, userData) => {
    return apiClient.put(`/admin/users/${userId}`, userData)
  },
  deleteUser: (userId) => {
    return apiClient.delete(`/admin/users/${userId}`)
  },
  /**
   * 获取所有用户行为记录
   */
  getBehaviors: () => {
    return apiClient.get('/admin/behaviors')
  },
  /**
   * 触发推荐模型离线训练
   */
  triggerTraining: () => {
    return apiClient.post('/admin/recommendations/trigger-training')
  },
}
