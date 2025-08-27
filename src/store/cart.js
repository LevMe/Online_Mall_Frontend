// src/store/cart.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // --- State ---
  const items = ref([]) // 存放购物车商品的数组

  // --- Getters ---
  // 计算购物车中商品的总数量
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  })

  // 计算购物车中商品的总价格
  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + item.product.price * item.quantity, 0)
  })

  // --- Actions ---
  /**
   * 用从 API 获取的数据完全替换购物车内容
   * @param {Array} newItems - 新的购物车商品数组
   */
  function setCart(newItems) {
    items.value = newItems
  }

  /**
   * 清空购物车（用于退出登录等场景）
   */
  function clearCart() {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalPrice,
    setCart,
    clearCart,
  }
})
