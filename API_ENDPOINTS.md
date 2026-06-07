# GlobalMart API Endpoints Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}

Response: { user, access_token }
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { user, access_token }
```

### Get Profile (Protected)
```
GET /auth/me
Authorization: Bearer <access_token>

Response: { id, email, first_name, last_name, ... }
```

---

## Products Endpoints

### List Products
```
GET /products?page=1&limit=10&search=&categoryId=1&brandId=1&sortBy=created_at&order=DESC

Query Parameters:
- page: number (default: 1)
- limit: number (default: 10, max: 100)
- search: string (optional)
- categoryId: number (optional)
- brandId: number (optional)
- sortBy: string (default: created_at)
- order: ASC | DESC (default: DESC)

Response: { products: [], total, page, limit, pages }
```

### Get Product Details
```
GET /products/:id

Response: { id, name, description, price, category, brand, items: [variants], images: [] }
```

### Get Categories
```
GET /products/categories

Response: [{ id, name }, ...]
```

### Get Brands
```
GET /products/brands

Response: [{ id, name }, ...]
```

---

## Cart Endpoints (Protected)

### Get Cart
```
GET /cart
Authorization: Bearer <access_token>

Response: { id, user_id, items: [{ id, product_item_id, quantity, product_item: {...} }] }
```

### Add Item to Cart
```
POST /cart/items
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_item_id": 1,
  "quantity": 2
}

Response: { id, cart_id, product_item_id, quantity }
```

### Update Cart Item
```
PATCH /cart/items/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "quantity": 3
}

Response: { id, quantity, ... }
```

### Remove Item from Cart
```
DELETE /cart/items/:id
Authorization: Bearer <access_token>

Response: success message
```

### Clear Cart
```
DELETE /cart
Authorization: Bearer <access_token>

Response: { message: "Cart cleared" }
```

---

## Orders Endpoints (Protected)

### List User Orders
```
GET /orders?page=1&limit=10
Authorization: Bearer <access_token>

Response: { orders: [], total, page, limit, pages }
```

### Get Order Details
```
GET /orders/:id
Authorization: Bearer <access_token>

Response: { id, user_id, total_price, status, items: [], address: {}, payment: {}, ... }
```

### Create Order
```
POST /orders
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "address_id": 1,
  "payment_method_id": 1,
  "coupon_code": "SAVE10" (optional)
}

Response: { id, total_price, status, ... }
```

### Get Order Status History
```
GET /orders/:id/status-history
Authorization: Bearer <access_token>

Response: [{ id, status, comment, created_at }, ...]
```

---

## Addresses Endpoints (Protected)

### Get All Addresses
```
GET /addresses
Authorization: Bearer <access_token>

Response: [{ id, address_line_1, address_line_2, city, state, postal_code, country, label }, ...]
```

### Get Address by ID
```
GET /addresses/:id
Authorization: Bearer <access_token>

Response: { id, address_line_1, ... }
```

### Create Address
```
POST /addresses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "address_line_1": "123 Main St",
  "address_line_2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "USA",
  "label": "Home" (optional)
}

Response: { id, ... }
```

### Update Address
```
PATCH /addresses/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "address_line_1": "456 Oak Ave",
  ...
}

Response: { id, ... }
```

### Delete Address
```
DELETE /addresses/:id
Authorization: Bearer <access_token>

Response: success message
```

---

## Reviews Endpoints

### Get Product Reviews
```
GET /reviews/product/:productId?page=1&limit=10

Response: { reviews: [{ id, rating, comment, user: {}, created_at }], total, page, limit, pages }
```

### Get Review Details
```
GET /reviews/:id

Response: { id, product_id, rating, comment, user: {}, images: [], created_at }
```

### Create Review (Protected)
```
POST /reviews
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "product_id": 1,
  "rating": 5,
  "comment": "Great product!"
}

Response: { id, ... }
```

### Delete Review (Protected)
```
DELETE /reviews/:id
Authorization: Bearer <access_token>

Response: success message
```

---

## Coupons Endpoints

### Validate Coupon
```
POST /coupons/validate
Content-Type: application/json

{
  "code": "SAVE10",
  "cart_total": 100
}

Response:
{
  "code": "SAVE10",
  "discount_percent": 10,
  "discount_amount": 10,
  "final_total": 90
}
```

### Get Coupon Details
```
GET /coupons/:code

Response: { id, code, discount_percent, min_order_value, expiry_date, is_active, ... }
```

---

## Users Endpoints (Protected)

### Get All Users (Admin)
```
GET /users
Authorization: Bearer <access_token>

Response: [{ id, email, first_name, last_name, created_at }, ...]
```

---

## Error Responses

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "BadRequest"
}
```

Common Error Codes:
- 400: BadRequestException (invalid input, cart empty, etc.)
- 401: UnauthorizedException (invalid credentials, expired token)
- 403: ForbiddenException (unauthorized action, can't delete other user's review)
- 404: NotFoundException (resource not found)
- 409: ConflictException (user already exists)
- 500: Internal Server Error
