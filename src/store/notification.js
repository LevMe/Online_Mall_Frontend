// src/store/notification.js

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  // --- State ---
  const isVisible = ref(false)
  const message = ref('')
  const type = ref('success') // 'success' 或 'error'
  let timeoutId = null // 用于存储 setTimeout 的 ID

  // --- Actions ---
  /**
   * 显示通知
   * @param {string} newMessage - 要显示的消息
   * @param {string} newType - 'success' 或 'error'
   * @param {number} duration - 显示时长（毫秒）
   */
  function showNotification(newMessage, newType = 'success', duration = 3000) {
    // 如果当前有通知正在显示，先清除
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    message.value = newMessage
    type.value = newType
    isVisible.value = true

    // 设置一个定时器，在指定时间后自动隐藏通知
    timeoutId = setTimeout(() => {
      isVisible.value = false
    }, duration)
  }

  return {
    isVisible,
    message,
    type,
    showNotification,
  }
})
