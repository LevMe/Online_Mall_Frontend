// src/store/user.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 使用 defineStore 创建一个 store，第一个参数是 store 的唯一 ID
export const useUserStore = defineStore('user', () => {
  // --- State ---
  // 使用 ref 创建响应式状态
  // 从 localStorage 读取初始 token，避免刷新后状态丢失
  const token = ref(localStorage.getItem('authToken') || null)
  const userInfo = ref(null) // 初始用户信息为空

  // --- Getters ---
  // 使用 computed 创建计算属性，类似于 store 的 getters
  const isLoggedIn = computed(() => !!token.value)

  // --- Actions ---
  // 定义 actions，用于修改 state

  /**
   * 设置用户 token 和信息
   * @param {string} newToken - 新的认证 token
   * @param {Object} userData - 用户信息
   */
  function setUser(newToken, userData) {
    token.value = newToken
    userInfo.value = userData
    // 将 token 持久化存储到 localStorage
    localStorage.setItem('authToken', newToken)
  }

  /**
   * 清除用户 token 和信息（退出登录）
   */
  function clearUser() {
    token.value = null
    userInfo.value = null
    // 从 localStorage 移除 token
    localStorage.removeItem('authToken')
  }

  // 返回 state, getters, 和 actions，以便组件中使用
  return {
    token,
    userInfo,
    isLoggedIn,
    setUser,
    clearUser,
  }
})
