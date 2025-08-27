<script setup>
import { useNotificationStore } from '../../store/notification.js'
const notificationStore = useNotificationStore()
</script>

<template>
  <Transition name="notification-fade">
    <div
      v-if="notificationStore.isVisible"
      class="notification-wrapper"
      :class="`notification--${notificationStore.type}`"
    >
      <p>{{ notificationStore.message }}</p>
    </div>
  </Transition>
</template>

<style scoped>
.notification-wrapper {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 25px;
  border-radius: 6px;
  color: #fff;
  font-size: 16px;
  z-index: 1001; /* 比模态框更高一级 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.notification--success {
  background-color: #4caf50; /* 绿色 */
}

.notification--error {
  background-color: #f44336; /* 红色 */
}

/* Transition 动画 */
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
