// src/store/cart.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  // --- State ---
  // API 返回的数据结构为 { items: [], totalPrice: 0 }
  // 我们直接用一个 ref 来存储整个购物车对象
  const cart = ref({
    items: [],
    totalPrice: 0,
  })

  // --- Getters ---
  // 从 cart.items 中派生出商品数组
  const items = computed(() => cart.value.items)

  // 从 cart.totalPrice 直接获取总价
  const totalPrice = computed(() => cart.value.totalPrice)

  // 计算购物车中商品的总数量
  const totalItems = computed(() => {
    return cart.value.items.reduce((total, item) => total + item.quantity, 0)
  })

  // --- Actions ---
  /**
   * 用从 API 获取的数据完全替换购物车内容
   * @param {Object} newCart - 新的购物车对象 { items, totalPrice }
   */
  function setCart(newCart) {
    cart.value = newCart || { items: [], totalPrice: 0 }
  }

  /**
   * 清空购物车（用于退出登录等场景）
   */
  function clearCart() {
    cart.value = {
      items: [],
      totalPrice: 0,
    }
  }

  return {
    items,
    totalItems,
    totalPrice,
    setCart,
    clearCart,
  }
})
