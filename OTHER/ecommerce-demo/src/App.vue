<template>
  <div class="container">
    <h1>E-Commerce Demo</h1>

    <SearchFilter
      :categories="categories"
      @filter-change="applyFilters"
    />

    <div class="layout">
      <ProductList
        :products="filteredProducts"
        @add-to-cart="addToCart"
      />

      <Cart
        :cart="cart"
        @remove-from-cart="removeFromCart"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { products } from './assets/products'

import ProductList from './components/ProductList.vue'
import SearchFilter from './components/SearchFilter.vue'
import Cart from './components/Cart.vue'

const cart = ref([])

const filters = ref({
  search: '',
  category: ''
})

const categories = [...new Set(products.map(p => p.category))]

const filteredProducts = computed(() => {
  return products.filter(product => {

    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(filters.value.search.toLowerCase())

    const matchesCategory =
      !filters.value.category ||
      product.category === filters.value.category

    return matchesSearch && matchesCategory
  })
})

function applyFilters(newFilters) {
  filters.value = newFilters
}

function addToCart(product) {
  const existing = cart.value.find(item => item.id === product.id)

  if (existing) {
    existing.quantity++
  } else {
    cart.value.push({
      ...product,
      quantity: 1
    })
  }
}

function removeFromCart(id) {
  cart.value = cart.value.filter(item => item.id !== id)
}
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f4f4f4;
}

.container {
  padding: 30px;
}

.layout {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 30px;
}
</style>