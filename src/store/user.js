import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  // --- State ---
  // 从 localStorage 初始化 state，防止刷新页面后状态丢失
  const token = ref(localStorage.getItem('authToken') || null)
  // userInfo 现在是一个对象，我们也需要持久化它
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) || null)

  // --- Getters ---
  const isLoggedIn = computed(() => !!token.value)

  // --- Actions ---
  /**
   * 设置用户 token 和信息
   * @param {string} newToken - 后端返回的认证 token
   * @param {Object} newInfo - 后端返回的 userInfo 对象
   */
  function setUser(newToken, newInfo) {
    token.value = newToken
    userInfo.value = newInfo
    // 将 token 和 userInfo 持久化到 localStorage
    localStorage.setItem('authToken', newToken)
    localStorage.setItem('userInfo', JSON.stringify(newInfo))
  }

  /**
   * 清除用户 token 和信息（退出登录）
   */
  function clearUser() {
    token.value = null
    userInfo.value = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setUser,
    clearUser,
  }
})
