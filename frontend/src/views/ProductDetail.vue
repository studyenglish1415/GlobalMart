<template>
  <div class="product-detail">
    <h1>Product Detail</h1>
    <p>Product ID: {{ route.params.id }}</p>
    <p>Product details will be loaded here</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
</style>
