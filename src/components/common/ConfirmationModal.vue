<script setup>
// defineProps 用于接收父组件传递的数据
// defineEmits 用于声明该组件会触发哪些自定义事件
defineProps({
  // 控制模态框是否显示
  show: {
    type: Boolean,
    default: false,
  },
  // 模态框的标题
  title: {
    type: String,
    default: '确认操作',
  },
  // 模态框的提示信息
  message: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <!-- 使用 Transition 组件为模态框的出现和消失添加淡入淡出效果 -->
  <Transition name="modal-fade">
    <!-- 只有当 show prop 为 true 时，才渲染这个模态框 -->
    <div v-if="show" class="modal-wrapper">
      <!-- 遮罩层，点击后会触发 cancel 事件 -->
      <div class="modal-overlay" @click="emit('cancel')"></div>

      <!-- 模态框内容 -->
      <div class="modal-content">
        <h3>{{ title }}</h3>
        <p>{{ message }}</p>
        <div class="modal-actions">
          <!-- 点击“取消”按钮，触发 cancel 事件 -->
          <button class="btn btn-secondary" @click="emit('cancel')">取消</button>
          <!-- 点击“确认”按钮，触发 confirm 事件 -->
          <button class="btn btn-primary" @click="emit('confirm')">确认</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* 确保在最上层 */
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 400px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.modal-content h3 {
  margin-top: 0;
  font-size: 20px;
}

.modal-content p {
  margin: 15px 0;
  font-size: 16px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #007aff;
  color: white;
}
.btn-primary:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #e5e5e5;
  color: #333;
}
.btn-secondary:hover {
  background-color: #d5d5d5;
}

/* Transition 动画效果 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
