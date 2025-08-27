// src/main.js

import { createApp } from 'vue'

// 导入我们之前清空的全局样式
import './assets/styles/main.css'

// 导入根组件 App.vue
import App from './App.vue'

// 导入我们创建的 router 和 pinia 实例
import router from './router'
import pinia from './store'

// 创建 Vue 应用实例
const app = createApp(App)

// 挂载 Pinia
app.use(pinia)
// 挂载 Vue Router
app.use(router)

// 将应用挂载到 index.html 的 #app 元素上
app.mount('#app')
