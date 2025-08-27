<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user.js'
import { api } from '../../services/index.js'

const router = useRouter()
const userStore = useUserStore()

// 控制当前显示的是登录表单还是注册表单
const isRegisterMode = ref(false)

// 表单数据模型
const form = ref({
  name: '',
  email: 'test@example.com', // 预填方便测试
  password: 'password123',
})

const errorMessage = ref('') // 用于显示错误信息

// 处理表单提交的函数
const handleSubmit = async () => {
  errorMessage.value = '' // 重置错误信息
  try {
    if (isRegisterMode.value) {
      // --- 注册逻辑 ---
      await api.register(form.value)
      // 注册成功后，自动切换到登录模式并提示用户
      isRegisterMode.value = false
      alert('注册成功，请登录！') // 临时使用 alert，后续会替换为全局通知
    } else {
      // --- 登录逻辑 ---
      const response = await api.login(form.value)
      // 调用 user store 的 action 来更新全局状态
      userStore.setUser(response.token, response.user)
      // 登录成功后，跳转回首页
      router.push({ name: 'home' })
    }
  } catch (error) {
    errorMessage.value = error.message || '操作失败，请稍后再试'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <h1>{{ isRegisterMode ? '创建账户' : '欢迎回来' }}</h1>
      <form @submit.prevent="handleSubmit">
        <!-- 注册模式下显示姓名输入框 -->
        <div v-if="isRegisterMode" class="form-group">
          <label for="name">姓名</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="form.password" required />
        </div>
        <!-- 显示错误信息 -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <button type="submit" class="submit-btn">
          {{ isRegisterMode ? '注册' : '登录' }}
        </button>
      </form>
      <p class="toggle-mode">
        {{ isRegisterMode ? '已有账户？' : '还没有账户？' }}
        <a href="#" @click.prevent="isRegisterMode = !isRegisterMode">
          {{ isRegisterMode ? '立即登录' : '立即注册' }}
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
  background-color: #f9f9f9;
}

.auth-container {
  width: 400px;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.error-message {
  color: #e53935;
  margin-bottom: 15px;
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  color: #fff;
  background-color: #007aff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #0056b3;
}

.toggle-mode {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.toggle-mode a {
  color: #007aff;
  text-decoration: none;
  font-weight: bold;
}
</style>
