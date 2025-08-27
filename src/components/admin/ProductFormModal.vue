<script setup>
import { ref, watch, computed } from 'vue'

// --- Props & Emits ---
const props = defineProps({
  show: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  // 1. 新增 prop：用于接收待编辑的商品对象
  productToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

// --- Computed Properties ---
// 2. 根据是否存在 productToEdit 来判断当前是否为编辑模式
const isEditMode = computed(() => !!props.productToEdit)
// 3. 动态计算模态框的标题
const modalTitle = computed(() => (isEditMode.value ? '编辑商品' : '添加新商品'))
// 4. 动态计算提交按钮的文本
const submitButtonText = computed(() => (isEditMode.value ? '更新' : '保存'))

// --- 响应式状态 ---
const form = ref({})

// --- 监听器 ---
// 5. 监听 show prop 的变化，以便在模态框打开时设置表单的初始状态
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (isEditMode.value) {
        // 如果是编辑模式，用传入的商品数据填充表单 (创建副本以避免直接修改 prop)
        form.value = { ...props.productToEdit }
      } else {
        // 如果是添加模式，重置表单为初始空状态
        form.value = {
          name: '',
          price: null,
          stock: null,
          categoryId: null,
          imageUrl: 'https://placehold.co/300x300/EFEFEF/333?text=New+Product',
        }
      }
    }
  },
)

// --- 方法 ---
const handleSubmit = () => {
  if (form.value.name && form.value.price && form.value.categoryId) {
    // 提交时，将表单数据和当前是否为编辑模式的信息一起传递出去
    emit('submit', form.value)
  } else {
    alert('请填写所有必填项！')
  }
}
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" class="modal-wrapper">
      <div class="modal-overlay" @click="emit('close')"></div>
      <div class="modal-content">
        <!-- 使用动态标题 -->
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="handleSubmit">
          <!-- 表单结构保持不变 -->
          <div class="form-group">
            <label for="name">商品名称</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="price">价格</label>
            <input type="number" id="price" v-model.number="form.price" required min="0" />
          </div>
          <div class="form-group">
            <label for="stock">库存</label>
            <input type="number" id="stock" v-model.number="form.stock" required min="0" />
          </div>
          <div class="form-group">
            <label for="category">分类</label>
            <select id="category" v-model.number="form.categoryId" required>
              <option :value="null" disabled>请选择一个分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" @click="emit('close')">取消</button>
            <!-- 使用动态按钮文本 -->
            <button type="submit" class="btn btn-primary">{{ submitButtonText }}</button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* 样式保持不变 */
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
  width: 500px;
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
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
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
