# Database Documentation

## Overview

GlobalMart uses PostgreSQL as its primary database. The schema includes comprehensive tables for e-commerce operations including products, users, orders, payments, and more.

## Tables

### Users & Authentication

#### `users`
Stores user account information.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| email | TEXT | NOT NULL, UNIQUE |
| password_hash | TEXT | NOT NULL |
| first_name | TEXT | |
| last_name | TEXT | |
| birth_date | DATE | |
| phone | TEXT | |
| created_at | TIMESTAMP | DEFAULT now() |
| status | TEXT | |

#### `users_sessions`
Manages user authentication sessions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | NOT NULL, FK users |
| token | TEXT | NOT NULL |
| expires_at | TIMESTAMP | NOT NULL |

#### `address`
User delivery addresses.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| country | TEXT | |
| city | TEXT | |
| add_line1 | TEXT | |
| add_line2 | TEXT | |
| zip_code | TEXT | |
| user_id | INTEGER | NOT NULL, FK users |

### Products & Catalog

#### `products`
Main product information.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | TEXT | NOT NULL |
| description | TEXT | |
| brand_id | INTEGER | FK brand |
| category_id | INTEGER | FK category |
| created_at | TIMESTAMP | DEFAULT now() |
| active | BOOLEAN | DEFAULT true |
| currency | TEXT | |

#### `product_item`
Product variants/SKUs.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | NOT NULL, FK products |
| sku | TEXT | |
| price | NUMERIC(10,2) | |
| weight | NUMERIC(10,2) | |

#### `product_image`
Product images.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | NOT NULL, FK products |
| image_url | TEXT | |

#### `category`
Product categories (hierarchical).

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | TEXT | |
| parent_id | INTEGER | FK category |

#### `brand`
Product brands.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | TEXT | |
| country | TEXT | |

#### `attributes` & `attributes_variants`
Product attributes and their values (e.g., Color, Size).

**attributes:**
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | NOT NULL, FK products |
| name | TEXT | |

**attributes_variants:**
| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| attribute_id | INTEGER | NOT NULL, FK attributes |
| value | TEXT | |

### Shopping & Orders

#### `carts`
Shopping carts.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | NOT NULL, FK users |
| created_at | TIMESTAMP | DEFAULT now() |

#### `cart_item`
Items in shopping cart.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| cart_id | INTEGER | NOT NULL, FK carts |
| var_product_id | INTEGER | NOT NULL |
| quantity | INTEGER | NOT NULL, CHECK > 0 |

#### `orders`
Customer orders.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| user_id | INTEGER | NOT NULL, FK users |
| status | TEXT | |
| currency | TEXT | |
| total_price | NUMERIC(10,2) | |
| created_at | TIMESTAMP | DEFAULT now() |

#### `order_items`
Items in orders.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| order_id | INTEGER | NOT NULL, FK orders |
| var_product_id | INTEGER | NOT NULL |
| quantity | INTEGER | NOT NULL, CHECK > 0 |
| address_id | INTEGER | FK address |

#### `order_status_history`
Order status tracking.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| order_id | INTEGER | NOT NULL, FK orders |
| status | TEXT | |
| created_at | TIMESTAMP | DEFAULT now() |

### Payments & Refunds

#### `payment_method`
Available payment methods.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| name | TEXT | NOT NULL |

#### `payments`
Payment transactions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| payment_method_id | INTEGER | FK payment_method |
| order_id | INTEGER | NOT NULL, FK orders |
| amount | NUMERIC(10,2) | NOT NULL |
| status | TEXT | |
| transaction_id | TEXT | |

#### `refunds`
Refund requests.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| payment_id | INTEGER | NOT NULL, FK payments |
| amount | NUMERIC(10,2) | |
| reason | TEXT | |
| created_at | TIMESTAMP | DEFAULT now() |

### Reviews & Ratings

#### `review`
Product reviews.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| product_id | INTEGER | NOT NULL, FK products |
| user_id | INTEGER | NOT NULL, FK users |
| rating | INTEGER | CHECK 1-5 |
| comment | TEXT | |

#### `review_images`
Review images.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| review_id | INTEGER | NOT NULL, FK review |
| image_url | TEXT | |

### Promotions & Discounts

#### `coupon`
Discount coupons.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| code | TEXT | NOT NULL, UNIQUE |
| discount_type | TEXT | |
| discount_desc | TEXT | |
| expires_at | TIMESTAMP | |

#### `coupon_usage`
Coupon application tracking.

| Column | Type | Constraints |
|--------|------|-------------|
| id | SERIAL | PRIMARY KEY |
| coupon_id | INTEGER | NOT NULL, FK coupon |
| user_id | INTEGER | NOT NULL, FK users |
| order_id | INTEGER | FK orders |

## Setup Instructions

### Create Database

```sql
CREATE DATABASE globalmart;
```

### Run Schema

```bash
psql -U postgres -d globalmart -f schema.sql
```

### Initialize in Application

NestJS will handle migrations via TypeORM:

```bash
npm run migration:run
```

## Query Examples

### Get Products with Reviews

```sql
SELECT p.*, AVG(r.rating) as avg_rating, COUNT(r.id) as review_count
FROM products p
LEFT JOIN review r ON p.id = r.product_id
GROUP BY p.id;
```

### Get User Orders with Items

```sql
SELECT o.*, oi.*, pi.*, p.name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN product_item pi ON oi.var_product_id = pi.id
JOIN products p ON pi.product_id = p.id
WHERE o.user_id = $1
ORDER BY o.created_at DESC;
```

### Calculate Order Total

```sql
SELECT SUM(pi.price * oi.quantity) as total
FROM order_items oi
JOIN product_item pi ON oi.var_product_id = pi.id
WHERE oi.order_id = $1;
```

## Indexes

Indexes are created for:
- `products.brand_id`
- `products.category_id`
- `users.email`
- `orders.user_id`
- `review.product_id`
- `review.user_id`
- `carts.user_id`

## Relationships Diagram

```
users ──┬── address
        ├── carts ── cart_item
        ├── orders ──┬── order_items ── product_item
        │            ├── payments ── refunds
        │            └── order_status_history
        ├── review ── review_images
        └── coupon_usage

products ──┬── product_item
           ├── product_image
           ├── category
           ├── brand
           ├── attributes ── attributes_variants
           └── review
```

## Performance Optimization Tips

1. **Add Pagination:** Implement LIMIT/OFFSET for large result sets
2. **Use Full-Text Search:** For product search functionality
3. **Archive Old Data:** Move old orders/reviews to archive tables
4. **Regular Maintenance:** VACUUM and ANALYZE regularly
5. **Connection Pooling:** Use PgBouncer for production

## Backup & Recovery

### Backup Database

```bash
pg_dump -U postgres globalmart > backup.sql
```

### Restore Database

```bash
psql -U postgres -d globalmart -f backup.sql
```

## Support

For database optimization and troubleshooting:
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeORM Documentation](https://typeorm.io/)
