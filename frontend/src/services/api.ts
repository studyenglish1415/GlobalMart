import axios, { AxiosInstance } from 'axios'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
      timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
    })

    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  async register(email: string, password: string, firstName?: string, lastName?: string) {
    return this.api.post('/auth/register', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
  }

  async login(email: string, password: string) {
    return this.api.post('/auth/login', { email, password })
  }

  async getProfile() {
    return this.api.get('/auth/me')
  }

  async logout() {
    localStorage.removeItem('access_token')
  }

  async getProducts(params?: any) {
    return this.api.get('/products', { params })
  }

  async getProductById(id: number) {
    return this.api.get(`/products/${id}`)
  }

  async getCategories() {
    return this.api.get('/products/categories')
  }

  async getBrands() {
    return this.api.get('/products/brands')
  }

  async getCart() {
    return this.api.get('/cart')
  }

  async addToCart(productItemId: number, quantity: number) {
    return this.api.post('/cart/items', { product_item_id: productItemId, quantity })
  }

  async updateCartItem(itemId: number, quantity: number) {
    return this.api.patch(`/cart/items/${itemId}`, { quantity })
  }

  async removeFromCart(itemId: number) {
    return this.api.delete(`/cart/items/${itemId}`)
  }

  async clearCart() {
    return this.api.delete('/cart')
  }

  async getOrders(page?: number, limit?: number) {
    return this.api.get('/orders', { params: { page, limit } })
  }

  async getOrderById(id: number) {
    return this.api.get(`/orders/${id}`)
  }

  async createOrder(addressId: number, paymentMethodId: number, couponCode?: string) {
    return this.api.post('/orders', {
      address_id: addressId,
      payment_method_id: paymentMethodId,
      coupon_code: couponCode,
    })
  }

  async getOrderStatusHistory(orderId: number) {
    return this.api.get(`/orders/${orderId}/status-history`)
  }

  async getAddresses() {
    return this.api.get('/addresses')
  }

  async getAddressById(id: number) {
    return this.api.get(`/addresses/${id}`)
  }

  async createAddress(data: any) {
    return this.api.post('/addresses', data)
  }

  async updateAddress(id: number, data: any) {
    return this.api.patch(`/addresses/${id}`, data)
  }

  async deleteAddress(id: number) {
    return this.api.delete(`/addresses/${id}`)
  }

  async getProductReviews(productId: number, page?: number, limit?: number) {
    return this.api.get(`/reviews/product/${productId}`, { params: { page, limit } })
  }

  async getReviewById(id: number) {
    return this.api.get(`/reviews/${id}`)
  }

  async createReview(productId: number, rating: number, comment: string) {
    return this.api.post('/reviews', { product_id: productId, rating, comment })
  }

  async deleteReview(id: number) {
    return this.api.delete(`/reviews/${id}`)
  }

  async validateCoupon(code: string, cartTotal: number) {
    return this.api.post('/coupons/validate', { code, cart_total: cartTotal })
  }

  async getCoupon(code: string) {
    return this.api.get(`/coupons/${code}`)
  }

  async getUsers() {
    return this.api.get('/users')
  }
}

export default new ApiService()
