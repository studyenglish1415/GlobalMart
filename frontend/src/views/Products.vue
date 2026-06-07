<template>
  <div class="products">
    <h1>Products</h1>
    
    <div class="filters">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Search products..."
      />
    </div>

    <div class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.name" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p class="price">${{ product.price }}</p>
        <router-link :to="`/products/${product.id}`" class="btn-primary">
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const products = ref([
  { id: 1, name: 'Product 1', price: 29.99, image: 'https://via.placeholder.com/300' },
  { id: 2, name: 'Product 2', price: 39.99, image: 'https://via.placeholder.com/300' },
  { id: 3, name: 'Product 3', price: 49.99, image: 'https://via.placeholder.com/300' },
  { id: 4, name: 'Product 4', price: 59.99, image: 'https://via.placeholder.com/300' },
])

const searchQuery = ref('')

const filteredProducts = computed(() => {
  return products.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<style scoped>
.filters {
  margin-bottom: 2rem;
}

.filters input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  padding: 1rem 1rem 0;
  margin: 0;
}

.price {
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  color: #007bff;
  font-weight: bold;
}

.btn-primary {
  display: block;
  margin: 1rem;
  text-align: center;
}
</style>
