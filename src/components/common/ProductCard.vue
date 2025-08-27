<script setup>
// 使用 defineProps 来声明该组件期望接收的外部数据
// 'product' 是一个对象，包含了商品的详细信息
defineProps({
  product: {
    type: Object,
    required: true, // 标记为必需的 prop
  },
})
</script>

<!-- src/components/common/ProductCard.vue -->
<template>
  <!-- 
    将整个卡片用 RouterLink 包裹起来。
    :to 属性绑定一个对象，指定了目标路由的名称和参数。
    我们将商品的 id 作为动态参数 :id 传递给 'productDetail' 路由。
  -->
  <RouterLink :to="{ name: 'productDetail', params: { id: product.id } }" class="product-card-link">
    <div class="product-card">
      <div class="card-image">
        <img
          :src="product.imageUrl"
          :alt="product.name"
          onerror="this.onerror=null;this.src='https://placehold.co/300x300/EFEFEF/333?text=Image+Error';"
        />
      </div>
      <div class="card-content">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-price">¥ {{ product.price.toFixed(2) }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<!-- <style> 部分需要添加一个新样式 -->
<style scoped>
/* ... 其他样式保持不变 ... */

/* 为 RouterLink 添加样式，去除默认的下划线 */
.product-card-link {
  text-decoration: none;
  color: inherit; /* 继承父元素的颜色 */
  display: block; /* 让链接占据整个卡片区域 */
}
</style>

<style scoped>
.product-card {
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  overflow: hidden; /* 确保子元素的圆角效果正确 */
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
  cursor: pointer;
  background-color: #fff;
}

.product-card:hover {
  transform: translateY(-5px); /* 鼠标悬浮时轻微上移 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

.card-image img {
  width: 100%;
  height: auto;
  display: block; /* 消除图片底部的空白间隙 */
  aspect-ratio: 1 / 1; /* 保持图片为正方形 */
  object-fit: cover; /* 确保图片内容被裁剪以适应容器，而不是被拉伸 */
}

.card-content {
  padding: 15px;
}

.product-name {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #333;
  /* 限制名称显示为两行，超出部分显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 48px; /* 假设行高为 24px */
}

.product-price {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #000;
}
</style>
