<template>
  <div class="card">
    <img :src="product.image" alt="product" />

    <h3>{{ product.name }}</h3>

    <p>{{ product.category }}</p>

    <p class="price">${{ product.price }}</p>

    <button @click="$emit('add-to-cart', product)">
      Add to Cart
    </button>
  </div>
</template>

<script setup>
defineProps({
  product: Object
})
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  width: 220px;
  text-align: center;
  background: white;
}

img {
  width: 100%;
  border-radius: 8px;
}

.price {
  font-weight: bold;
  color: green;
}

button {
  background: #42b883;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 6px;
}

button:hover {
  background: #36996f;
}
</style>