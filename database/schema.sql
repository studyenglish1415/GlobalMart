-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    birth_date DATE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT
);

-- Create categories table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name TEXT,
    parent_id INTEGER REFERENCES category(id) ON DELETE SET NULL
);

-- Create brands table
CREATE TABLE brand (
    id SERIAL PRIMARY KEY,
    name TEXT,
    country TEXT
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    brand_id INTEGER REFERENCES brand(id),
    category_id INTEGER REFERENCES category(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    active BOOLEAN DEFAULT true,
    currency TEXT
);

-- Create product items (variants)
CREATE TABLE product_item (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT,
    price NUMERIC(10, 2),
    weight NUMERIC(10, 2)
);

-- Create product images
CREATE TABLE product_image (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT
);

-- Create attributes
CREATE TABLE attributes (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name TEXT
);

-- Create attribute variants
CREATE TABLE attributes_variants (
    id SERIAL PRIMARY KEY,
    attribute_id INTEGER NOT NULL REFERENCES attributes(id) ON DELETE CASCADE,
    value TEXT
);

-- Create product variant relationships (var_product_id table)
CREATE TABLE var_product_id (
    product_id INTEGER REFERENCES products(id),
    attribute_id INTEGER REFERENCES attributes(id),
    attribute_value_id INTEGER REFERENCES attributes_variants(id)
);

-- Create carts
CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create cart items
CREATE TABLE cart_item (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    var_product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0)
);

-- Create addresses
CREATE TABLE address (
    id SERIAL PRIMARY KEY,
    country TEXT,
    city TEXT,
    add_line1 TEXT,
    add_line2 TEXT,
    zip_code TEXT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Create orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT,
    currency TEXT,
    total_price NUMERIC(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create order items
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    var_product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    address_id INTEGER REFERENCES address(id)
);

-- Create order status history
CREATE TABLE order_status_history (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payment methods
CREATE TABLE payment_method (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

-- Create payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    payment_method_id INTEGER REFERENCES payment_method(id),
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT,
    transaction_id TEXT
);

-- Create refunds
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reviews
CREATE TABLE review (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT
);

-- Create review images
CREATE TABLE review_images (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES review(id) ON DELETE CASCADE,
    image_url TEXT
);

-- Create coupons
CREATE TABLE coupon (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT,
    discount_desc TEXT,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create coupon usage
CREATE TABLE coupon_usage (
    id SERIAL PRIMARY KEY,
    coupon_id INTEGER NOT NULL REFERENCES coupon(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    order_id INTEGER REFERENCES orders(id)
);

-- Create user sessions
CREATE TABLE users_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_review_product ON review(product_id);
CREATE INDEX idx_review_user ON review(user_id);
CREATE INDEX idx_cart_user ON carts(user_id);
