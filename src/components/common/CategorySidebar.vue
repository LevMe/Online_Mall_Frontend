<script setup>
import { ref, onMounted } from 'vue'
// 导入 useRoute 来访问当前路由信息
import { RouterLink, useRoute } from 'vue-router'
import { api } from '../../services/index.js'

const categories = ref([])
const route = useRoute()

onMounted(async () => {
  try {
    categories.value = await api.getCategories()
  } catch (error) {
    console.error('获取分类失败:', error)
  }
})
</script>

<template>
  <aside class="category-sidebar">
    <h2>商品分类</h2>
    <ul>
      <li v-for="category in categories" :key="category.id">
        <RouterLink
          :to="{ name: 'productList', query: { categoryId: category.id } }"
          :class="{ 'is-active': Number(route.query.categoryId) === category.id }"
        >
          {{ category.name }}
        </RouterLink>
      </li>
    </ul>
  </aside>
</template>

<style scoped>
.category-sidebar {
  width: 200px;
  flex-shrink: 0;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: fit-content;
}

h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 为 li 添加下边距，解决视觉上粘连的问题 */
li {
  margin-bottom: 5px;
}

li a {
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;
  border-radius: 4px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

li a:hover {
  background-color: #f0f2f5;
  color: #007aff;
}

/* 确保我们的自定义 active class 生效 */
li a.is-active {
  background-color: #007aff;
  color: #fff;
  font-weight: bold;
}
</style>
