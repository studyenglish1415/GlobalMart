<template>
  <div class="grid">
    <ProductCard
      v-for="product in products"
      :key="product.id"
      :product="product"
      @add-to-cart="$emit('add-to-cart', $event)"
    />
  </div>
</template>

<script setup>
import ProductCard from './ProductCard.vue'

defineProps({
  products: Array
})
</script>

<style scoped>
.grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
</style>