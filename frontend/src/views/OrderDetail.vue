<template>
  <div class="order-detail">
    <h1>Order Details</h1>
    <p>Order ID: {{ route.params.id }}</p>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
</style>
