// src/store/index.js

// 从 pinia 库中导入 createPinia 方法
import { createPinia } from 'pinia'

// 创建一个 pinia 实例
const pinia = createPinia()

// 将这个实例导出，以便在 main.js 中挂载
export default pinia
