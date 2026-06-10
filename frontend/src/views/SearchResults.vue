<template>
  <div class="container">
    <div class="search-header">
      <input type="text" v-model="searchQuery" placeholder="Search products..." @keyup.enter="performSearch" />
      <button @click="performSearch">Search</button>
      <button class="filter-btn" @click="showFilter = !showFilter">Filter {{ showFilter ? '▲' : '▼' }}</button>
    </div>

    <transition name="slide">
      <div v-if="showFilter" class="filter-panel">
        <h4>Filters <span class="badge-future">Coming soon</span></h4>
        <p>Category, price range, and brand filters will be available after backend integration.</p>
      </div>
    </transition>

    <div class="results-info" v-if="searchQuery">
      <span>{{ filteredProducts.length }} result{{ filteredProducts.length !== 1 ? 's' : '' }} for "<strong>{{ searchQuery }}</strong>"</span>
    </div>

    <div v-if="filteredProducts.length" class="product-grid">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
    <div v-else class="no-results">
      <div>🔍</div>
      <p>No products found for "{{ searchQuery }}"</p>
      <router-link to="/">Browse all products</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const searchQuery = ref(route.query.q || '')
const showFilter = ref(false)
const allProducts = ref([])

const filteredProducts = computed(() => {
  if (!searchQuery.value.trim()) return allProducts.value
  return allProducts.value.filter(p =>
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
  }
}

watch(() => route.query.q, (q) => { searchQuery.value = q || '' })

onMounted(() => {
  allProducts.value = [
    { id: 1, name: 'BMW Series 3', price: 35999, rating: 4.8, image: '/images/BMW_SERIES_3.jpg' },
    { id: 2, name: 'BMW Series 5', price: 48999, rating: 4.9, image: '/images/BMW_SERIES_5.jpg' },
    { id: 3, name: 'BMW X3', price: 42999, rating: 4.7, image: '/images/BMW_X3.jpg' },
    { id: 4, name: 'BMW X5', price: 58999, rating: 4.9, image: '/images/BMW_X5.jpeg' },
    { id: 5, name: 'Huawei Phone', price: 4999, rating: 4.5, image: '/images/Huawei.png' },
    { id: 6, name: 'Xiaomi 14', price: 3999, rating: 4.6, image: '/images/xiaomi14.jpg' },
    { id: 7, name: 'Xiaomi 15', price: 4499, rating: 4.7, image: '/images/xiaomi15.jpg' },
    { id: 8, name: 'iPhone 16', price: 6999, rating: 4.9, image: '/images/iphone16.png' },
    { id: 9, name: 'iPhone 18', price: 8999, rating: 5.0, image: '/images/iphone18.jpg' },
    { id: 10, name: 'AirPods', price: 1299, rating: 4.8, image: '/images/airpods.jpeg' },
    { id: 11, name: 'Mi Refrigerator', price: 2499, rating: 4.4, image: '/images/MiFridge.jpg' },
    { id: 12, name: 'Hat', price: 199, rating: 4.2, image: '/images/hat.jpeg' },
    { id: 13, name: 'Jeans', price: 499, rating: 4.3, image: '/images/jeanes.jpg' },
    { id: 14, name: 'Shoes', price: 899, rating: 4.6, image: '/images/shoes.jpg' },
    { id: 15, name: 'T-Shirt', price: 199, rating: 4.1, image: '/images/t_shirt.jpg' }
  ]
})
</script>

<style scoped>
.container { max-width: 1200px; margin: 0 auto; padding: 32px 20px; }
.search-header { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
.search-header input { flex: 1; min-width: 200px; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 10px; }
.search-header input:focus { border-color: #ff6b6b; }
.search-header button { padding: 12px 24px; background: #ff6b6b; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; }
.search-header button:hover { background: #e95c5c; }
.filter-btn { background: #f1f5f9 !important; color: #374151 !important; }
.filter-panel { background: #f8fafc; padding: 16px 20px; border-radius: 10px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
.filter-panel h4 { margin-bottom: 6px; display: flex; align-items: center; gap: 10px; }
.badge-future { background: #e0f2fe; color: #0369a1; font-size: 0.72rem; padding: 2px 8px; border-radius: 20px; }
.filter-panel p { color: #64748b; font-size: 0.9rem; }
.results-info { margin-bottom: 20px; color: #64748b; }
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
.no-results { text-align: center; padding: 80px 20px; color: #64748b; }
.no-results div { font-size: 48px; margin-bottom: 16px; }
.no-results a { color: #ff6b6b; font-weight: 600; text-decoration: none; }
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
