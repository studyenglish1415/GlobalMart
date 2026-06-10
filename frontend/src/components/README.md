# Frontend Development Guide

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env.development
```

4. **Update configuration:**
Ensure `.env.development` points to your backend API:
```env
VITE_API_URL=http://localhost:3000
```

### Development

**Start development server:**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Project Structure

```
src/
├── main.ts                 # Application entry point
├── App.vue                 # Root component
├── components/             # Reusable components
├── views/                  # Page components
│   ├── Home.vue
│   ├── Products.vue
│   ├── ProductDetail.vue
│   ├── Cart.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Orders.vue
│   └── OrderDetail.vue
├── router/                 # Vue Router configuration
├── stores/                 # Pinia store (state management)
│   ├── auth.ts            # Authentication store
│   └── cart.ts            # Shopping cart store
├── services/               # API client services
│   └── api.ts
├── assets/                 # Static assets
│   └── style.css          # Global styles
└── env.d.ts               # Environment type definitions

index.html                  # HTML entry point
vite.config.js             # Vite configuration
tsconfig.json              # TypeScript configuration
```

## Technology Stack

- **Vue.js 3** - UI Framework
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Component Development

### Creating a New Vue Component

```vue
<template>
  <div class="component">
    <!-- Template -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Reactive data
const count = ref(0)

// Computed properties
const doubled = computed(() => count.value * 2)

// Methods
const increment = () => count.value++
</script>

<style scoped>
/* Component styles */
</style>
```

## State Management with Pinia

### Using a Store

```typescript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
authStore.setUser(userData)
```

### Creating a New Store

```typescript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMyStore = defineStore('mystore', () => {
  const data = ref([])

  function addItem(item) {
    data.value.push(item)
  }

  return { data, addItem }
})
```

## API Integration

### Using the API Service

```typescript
import api from '@/services/api'

// Call API
const response = await api.getProducts()
const products = response.data
```

### Adding New API Endpoints

Edit `src/services/api.ts` and add new methods:

```typescript
async getProductById(id: number) {
  return this.api.get(`/products/${id}`)
}
```

## Styling

- Global styles: `src/assets/style.css`
- Component styles: Use `<style scoped>` in Vue components
- Utility CSS classes available in global styles

## Building for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

Build output will be in the `dist/` directory.

## Environment Variables

Create `.env.production` for production settings:

```env
VITE_APP_TITLE=GlobalMart
VITE_API_URL=https://api.globalmart.com
VITE_API_TIMEOUT=30000
```

## Routing

Routes are defined in `src/router/index.ts`. To add a new route:

```typescript
{
  path: '/new-page',
  name: 'NewPage',
  component: () => import('../views/NewPage.vue'),
}
```

## Common Patterns

### Using Router

```typescript
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Navigate
router.push('/')
```

### Handling Forms

```vue
<form @submit.prevent="submitForm">
  <input v-model="formData.name" />
  <button type="submit">Submit</button>
</form>

<script setup lang="ts">
import { ref } from 'vue'

const formData = ref({
  name: '',
})

const submitForm = () => {
  // Handle submission
}
</script>
```

## Debugging

1. Use Vue DevTools browser extension
2. Check browser console for errors
3. Use Pinia DevTools to inspect store state
4. Network tab to debug API calls

## Performance Tips

1. Use `v-show` for frequent toggles
2. Use `v-if` for conditional rendering
3. Implement code splitting with route-based lazy loading
4. Use computed properties for expensive calculations
5. Optimize images and assets

## Deployment

1. Build the project: `npm run build`
2. Deploy `dist/` directory to static hosting
3. Configure server to serve `index.html` for all routes
4. Update `VITE_API_URL` in environment variables

## Troubleshooting

1. **Port already in use:** Change port in `vite.config.js`
2. **Module not found:** Run `npm install` again
3. **Hot reload not working:** Check Vite config
4. **API NOT accessible:** Verify backend is running and URL is correct

## Support

- [Vue.js Documentation](https://vuejs.org)
- [Vue Router Guide](https://router.vuejs.org)
- [Pinia Documentation](https://pinia.vuejs.org)
- [Vite Guide](https://vitejs.dev)
