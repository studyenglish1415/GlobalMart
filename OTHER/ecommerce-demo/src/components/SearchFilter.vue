<template>
  <div class="filters">
    <input
      type="text"
      placeholder="Search product..."
      v-model="search"
      @input="update"
    />

    <select v-model="category" @change="update">
      <option value="">All Categories</option>
      <option
        v-for="cat in categories"
        :key="cat"
        :value="cat"
      >
        {{ cat }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  categories: Array
})

const emit = defineEmits(['filter-change'])

const search = ref('')
const category = ref('')

function update() {
  emit('filter-change', {
    search: search.value,
    category: category.value
  })
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

input,
select {
  padding: 10px;
  font-size: 16px;
}
</style>