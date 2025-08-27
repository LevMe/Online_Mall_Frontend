// src/services/index.js

import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
})

// --- 模拟数据 ---
const mockCategories = [
  { id: 1, name: '电子产品' },
  { id: 2, name: '家居生活' },
]

let mockProducts = [
  {
    id: 1,
    name: '高性能笔记本电脑',
    price: 7999,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Laptop',
    categoryId: 1,
    stock: 50,
  },
  {
    id: 2,
    name: '无线降噪耳机',
    price: 1299,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Headphones',
    categoryId: 1,
    stock: 120,
  },
  {
    id: 3,
    name: '智能运动手表',
    price: 2499,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Watch',
    categoryId: 1,
    stock: 80,
  },
  {
    id: 4,
    name: '4K 超清显示器',
    price: 3999,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Monitor',
    categoryId: 1,
    stock: 30,
  },
  {
    id: 5,
    name: '机械键盘',
    price: 899,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Keyboard',
    categoryId: 1,
    stock: 200,
  },
  {
    id: 6,
    name: '人体工学椅',
    price: 1599,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Chair',
    categoryId: 2,
    stock: 45,
  },
  {
    id: 7,
    name: '简约实木餐桌',
    price: 2599,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Table',
    categoryId: 2,
    stock: 25,
  },
  // 为了更好地演示分页，我们再添加一些数据
  {
    id: 8,
    name: '智能扫地机器人',
    price: 1999,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Robot',
    categoryId: 2,
    stock: 60,
  },
  {
    id: 9,
    name: '高清网络摄像头',
    price: 499,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Webcam',
    categoryId: 1,
    stock: 150,
  },
  {
    id: 10,
    name: '便携式投影仪',
    price: 3299,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Projector',
    categoryId: 1,
    stock: 40,
  },
  {
    id: 11,
    name: '香薰加湿器',
    price: 299,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Humidifier',
    categoryId: 2,
    stock: 300,
  },
  {
    id: 12,
    name: '电动牙刷',
    price: 399,
    imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=Toothbrush',
    categoryId: 2,
    stock: 180,
  },
]
// --- 模拟后端的购物车数据库 ---
let mockCart = [
  // 初始时，可以放一个商品用于测试
  {
    id: 1, // 购物车项的唯一ID
    productId: 6,
    quantity: 1,
    // 在真实后端，通常会连表查询返回完整的商品信息
    product: mockProducts.find((p) => p.id === 6),
  },
]
let nextCartItemId = 2 // 用于自增ID

let nextProductId = mockProducts.length + 1 // 用于商品ID自增
// --- 模拟数据结束 ---

export const api = {
  /**
   * 获取商品列表
   * @param {Object} params - 查询参数, 例如 { categoryId: 1, keyword: '电脑' }
   * @returns {Promise<Array>}
   */
  getProducts: (params = {}) => {
    // 模拟后端 API 的筛选逻辑
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProducts = [...mockProducts]

        // 模拟按分类筛选
        if (params.categoryId) {
          filteredProducts = filteredProducts.filter(
            (p) => p.categoryId === Number(params.categoryId),
          )
        }

        // 模拟按关键词搜索 (模糊匹配商品名称)
        if (params.keyword) {
          filteredProducts = filteredProducts.filter((p) => p.name.includes(params.keyword))
        }

        resolve(filteredProducts)
      }, 300) // 模拟网络延迟
    })
  },

  /**
   * 获取所有分类
   * @returns {Promise<Array>}
   */
  getCategories: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCategories)
      }, 100)
    })
  },

  /**
   * 根据 ID 获取单个商品
   * @param {string | number} id - 商品 ID
   * @returns {Promise<Object|null>} 返回商品对象或 null
   */
  getProductById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 在模拟数据中查找 ID 匹配的商品
        const product = mockProducts.find((p) => p.id === Number(id))
        // 如果找到了，返回商品；否则返回 null
        resolve(product || null)
      }, 200) // 模拟网络延迟
    })
  },

  /**
   * 用户登录
   * @param {Object} credentials - 包含 email 和 password 的对象
   * @returns {Promise<Object>} 返回包含 token 和 user 信息的对象
   */
  login: (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟验证逻辑
        if (credentials.email === 'test@example.com' && credentials.password === 'password123') {
          resolve({
            token: 'a-fake-jwt-token-string',
            user: { name: '测试用户', email: 'test@example.com' },
          })
        } else {
          reject(new Error('邮箱或密码错误'))
        }
      }, 500)
    })
  },

  /**
   * 用户注册
   * @param {Object} userData - 包含 name, email, password 的对象
   * @returns {Promise<Object>} 返回成功的消息
   */
  register: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟注册成功
        console.log('模拟注册成功:', userData)
        resolve({ message: '注册成功！' })
      }, 500)
    })
  },

  /**
   * 获取当前用户的购物车
   * @returns {Promise<Array>}
   */
  getCart: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 返回当前模拟购物车的深拷贝，防止直接修改
        resolve(JSON.parse(JSON.stringify(mockCart)))
      }, 300)
    })
  },

  /**
   * 添加商品到购物车
   * @param {number} productId - 商品ID
   * @param {number} quantity - 数量
   * @returns {Promise<Object>} 返回更新后的整个购物车
   */
  addToCart: (productId, quantity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 检查商品是否已在购物车中
        const existingItem = mockCart.find((item) => item.productId === productId)

        if (existingItem) {
          // 如果存在，则增加数量
          existingItem.quantity += quantity
        } else {
          // 如果不存在，则添加新项
          const product = mockProducts.find((p) => p.id === productId)
          if (product) {
            mockCart.push({
              id: nextCartItemId++,
              productId,
              quantity,
              product,
            })
          }
        }
        // 返回更新后的整个购物车
        resolve(JSON.parse(JSON.stringify(mockCart)))
      }, 400)
    })
  },

  // 我们先把未来会用到的 update 和 delete 函数也加上
  /**
   * 更新购物车中某一项的数量
   * @param {number} cartItemId - 购物车项的ID
   * @param {number} quantity - 新的数量
   * @returns {Promise<Object>} 返回更新后的整个购物车
   */
  updateCartItem: (cartItemId, quantity) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = mockCart.find((i) => i.id === cartItemId)
        if (item) {
          item.quantity = quantity
        }
        resolve(JSON.parse(JSON.stringify(mockCart)))
      }, 200)
    })
  },

  /**
   * 从购物车删除一项
   * @param {number} cartItemId - 购物车项的ID
   * @returns {Promise<Object>} 返回更新后的整个购物车
   */
  deleteCartItem: (cartItemId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockCart = mockCart.filter((i) => i.id !== cartItemId)
        resolve(JSON.parse(JSON.stringify(mockCart)))
      }, 300)
    })
  },

  /**
   * 添加一个新商品
   * @param {Object} productData - 不包含ID的商品数据
   * @returns {Promise<Object>} 返回创建成功的新商品对象
   */
  addProduct: (productData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟后端行为：创建一个新商品对象，并为其分配一个新 ID
        const newProduct = {
          id: nextProductId++,
          ...productData,
        }
        // 将新商品添加到我们的模拟数据库中
        mockProducts.unshift(newProduct) // 使用 unshift 添加到数组开头，方便在UI上立即看到
        resolve(newProduct)
      }, 500) // 模拟网络延迟
    })
  },

  /**
   * 更新一个已存在的商品
   * @param {number} productId - 商品的ID
   * @param {Object} productData - 要更新的商品数据
   * @returns {Promise<Object>} 返回更新后的商品对象
   */
  updateProduct: (productId, productData) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 在模拟数据库中找到该商品的索引
        const productIndex = mockProducts.findIndex((p) => p.id === productId)

        if (productIndex !== -1) {
          // 使用新数据更新找到的商品
          // Object.assign 用于合并对象，将 productData 的属性覆盖到原对象上
          mockProducts[productIndex] = Object.assign(mockProducts[productIndex], productData)
          resolve(mockProducts[productIndex])
        } else {
          // 如果没找到，则返回一个错误
          reject(new Error('商品未找到'))
        }
      }, 500) // 模拟网络延迟
    })
  },

  /**
   * 删除一个商品
   * @param {number} productId - 要删除的商品的ID
   * @returns {Promise<Object>} 返回一个包含成功消息的对象
   */
  deleteProduct: (productId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const initialLength = mockProducts.length
        // 过滤掉要删除的商品，生成一个新数组
        mockProducts = mockProducts.filter((p) => p.id !== productId)

        // 检查长度是否变化，以判断是否删除成功
        if (mockProducts.length < initialLength) {
          resolve({ message: '删除成功' })
        } else {
          reject(new Error('商品未找到，无法删除'))
        }
      }, 500) // 模拟网络延迟
    })
  },

  /**
   * 模拟结算，清空购物车
   * @returns {Promise<Object>}
   */
  checkout: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 在模拟后端，将购物车数组清空
        mockCart = []
        resolve({ message: '结算成功，购物车已清空' })
      }, 600) // 模拟支付处理延迟
    })
  },
}
