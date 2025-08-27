<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// --- 响应式状态 ---
// 控制按钮是否可见
const isVisible = ref(false)

// --- 方法 ---
// 检查滚动位置以决定是否显示按钮
const handleScroll = () => {
  // 当页面向下滚动超过 300px 时，显示按钮
  if (window.scrollY > 300) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
}

// 平滑滚动到页面顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth', // 使用平滑滚动效果
  })
}

// --- 生命周期钩子 ---
// 在组件挂载到 DOM 后，添加全局滚动事件监听器
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

// 在组件从 DOM 卸载前，移除监听器，以防止内存泄漏
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <!-- 使用 Transition 组件为按钮的出现和消失添加淡入淡出效果 -->
  <Transition name="fade">
    <button v-if="isVisible" @click="scrollToTop" class="back-to-top-btn" aria-label="回到顶部">
      ↑
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top-btn {
  position: fixed; /* 固定在视窗的某个位置 */
  bottom: 140px;
  right: 250px;
  width: 50px;
  height: 50px;
  border-radius: 50%; /* 圆形按钮 */
  background-color: rgba(0, 122, 255, 0.8); /* 带透明度的苹果蓝 */
  color: white;
  border: none;
  font-size: 24px;
  line-height: 50px; /* 垂直居中箭头 */
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 998; /* 确保它在大多数内容的上方 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition:
    background-color 0.3s,
    transform 0.3s;
}

.back-to-top-btn:hover {
  background-color: #007aff; /* 鼠标悬浮时颜色加深 */
  transform: scale(1.1); /* 轻微放大效果 */
}

/* Transition 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
