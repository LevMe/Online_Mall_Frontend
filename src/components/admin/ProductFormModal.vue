<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  categories: { type: Array, required: true },
  productToEdit: { type: Object, default: null },
})

const emit = defineEmits(['close', 'submit'])

const isEditMode = computed(() => !!props.productToEdit)
const modalTitle = computed(() => (isEditMode.value ? '编辑商品' : '添加新商品'))
const submitButtonText = computed(() => (isEditMode.value ? '更新' : '保存'))

const form = ref({})
const specsString = ref('') // 用于绑定 textarea 的响应式变量

// 监听模态框的显示/隐藏
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      if (isEditMode.value) {
        // 编辑模式：用传入的数据填充表单
        form.value = { ...props.productToEdit }
        // 将 specs 对象转换为格式化的 JSON 字符串
        specsString.value = props.productToEdit.specs
          ? JSON.stringify(props.productToEdit.specs, null, 2)
          : ''
      } else {
        // 添加模式：重置为空表单
        form.value = {
          name: '',
          price: null,
          stock: null,
          categoryId: null,
          description: '',
          mainImageUrl: 'https://placehold.co/600x400/EFEFEF/333?text=New+Product',
        }
        specsString.value = ''
      }
    }
  },
)

const handleSubmit = () => {
  if (form.value.name && form.value.price != null && form.value.categoryId != null) {
    const finalData = { ...form.value }
    try {
      // 尝试将 specs 字符串解析回 JSON 对象
      finalData.specs = specsString.value ? JSON.parse(specsString.value) : null
      emit('submit', finalData)
    } catch (error) {
      alert('商品规格的JSON格式不正确，请检查！')
    }
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
        <h3>{{ modalTitle }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">商品名称 *</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="price">价格 *</label>
              <input type="number" id="price" v-model.number="form.price" required min="0" />
            </div>
            <div class="form-group">
              <label for="stock">库存 *</label>
              <input type="number" id="stock" v-model.number="form.stock" required min="0" />
            </div>
          </div>

          <div class="form-group">
            <label for="category">分类 *</label>
            <select id="category" v-model.number="form.categoryId" required>
              <option :value="null" disabled>请选择一个分类</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="mainImageUrl">主图 URL</label>
            <input type="text" id="mainImageUrl" v-model="form.mainImageUrl" />
          </div>

          <div class="form-group">
            <label for="description">商品描述</label>
            <textarea id="description" v-model="form.description" rows="3"></textarea>
          </div>

          <div class="form-group">
            <label for="specs">商品规格 (JSON格式)</label>
            <textarea id="specs" v-model="specsString" rows="4"></textarea>
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
.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-group {
  flex: 1;
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
