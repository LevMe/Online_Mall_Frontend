<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  userToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const isEditMode = computed(() => !!props.userToEdit)
const modalTitle = computed(() => (isEditMode.value ? '编辑用户' : '添加新用户'))
const submitButtonText = computed(() => (isEditMode.value ? '更新' : '保存'))

const form = ref({})

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (isEditMode.value) {
        form.value = { ...props.userToEdit }
      } else {
        form.value = {
          username: '',
          password: '',
          email: '',
          role: 'USER',
        }
      }
    }
  },
)

const handleSubmit = () => {
  emit('submit', form.value)
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-wrapper">
      <div class="modal-overlay" @click="emit('close')"></div>
      <div class="modal-content">
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="username">用户名 *</label>
            <input type="text" id="username" v-model="form.username" required />
          </div>

          <div class="form-group" v-if="!isEditMode">
            <label for="password">密码 *</label>
            <input type="password" id="password" v-model="form.password" required />
          </div>

          <div class="form-group">
            <label for="email">邮箱 *</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>

          <div class="form-group">
            <label for="role">角色 *</label>
            <select id="role" v-model="form.role" required>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="emit('close')">取消</button>
            <button type="submit" class="btn btn-primary">{{ submitButtonText }}</button>
          </div>
        </form>
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
  z-index: 999;
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
  width: 550px;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 8px;
  z-index: 1000;
}
.modal-content h3 {
  margin-top: 0;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
}
.btn {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-primary {
  background-color: #1890ff;
  color: white;
}
.btn-secondary {
  background-color: #f0f0f0;
  color: #333;
}
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
