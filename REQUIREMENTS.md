# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products
- Index: `/products` [GET]
- Show: `/products/:id` [GET]
- Create: `/products` [POST] [token required]
- [OPTIONAL] Products by category: `/products/category/:category` [GET]

#### Users
- Index: `/users` [GET] [token required]
- Show: `/users/:id` [GET] [token required]
- Create: `/users` [POST]
- Authenticate: `/users/authenticate` [POST]

#### Orders
- Index: `/orders` [GET] [token required]
- Show: `/orders/:id` [GET] [token required]
- Create: `/orders` [POST] [token required]
- Add Product to Order: `/orders/:id/products` [POST] [token required]
- Current Order by user: `/orders/user/:userId/current` [GET] [token required]
- [OPTIONAL] Completed Orders by user: `/orders/user/:userId/completed` [GET] [token required]

## Data Shapes

#### Product
```typescript
{
  id: number
  name: string
  price: number
  category?: string
}
```

#### User
```typescript
{
  id: number
  first_name: string
  last_name: string
  password: string (hashed)
}
```

#### Order
```typescript
{
  id: number
  user_id: number
  status: string (active or complete)
}
```

#### Order Product (for products in an order)
```typescript
{
  id: number
  order_id: number
  product_id: number
  quantity: number
}
```

## Database Schema

### Table: users
- id: `SERIAL PRIMARY KEY`
- first_name: `VARCHAR(100) NOT NULL`
- last_name: `VARCHAR(100) NOT NULL`
- password: `VARCHAR(255) NOT NULL` (hashed with bcrypt)

### Table: products
- id: `SERIAL PRIMARY KEY`
- name: `VARCHAR(255) NOT NULL`
- price: `NUMERIC(10, 2) NOT NULL`
- category: `VARCHAR(100)` (optional)

### Table: orders
- id: `SERIAL PRIMARY KEY`
- user_id: `INTEGER NOT NULL` [foreign key to users table]
- status: `VARCHAR(50) NOT NULL DEFAULT 'active'`

### Table: order_products (junction table)
- id: `SERIAL PRIMARY KEY`
- order_id: `INTEGER NOT NULL` [foreign key to orders table]
- product_id: `INTEGER NOT NULL` [foreign key to products table]
- quantity: `INTEGER NOT NULL DEFAULT 1`

## Request/Response Examples

### Create User
**Request:**
```json
POST /users
{
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Authenticate User
**Request:**
```json
POST /users/authenticate
{
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Create Product (requires token)
**Request:**
```json
POST /products
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Laptop",
  "price": 999.99,
  "category": "Electronics"
}
```

### Create Order (requires token)
**Request:**
```json
POST /orders
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "user_id": 1,
  "status": "active"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "status": "active"
}
```

### Add Product to Order (requires token)
**Request:**
```json
POST /orders/1/products
Headers: {
  "Authorization": "Bearer <token>"
}
Body: {
  "product_id": 1,
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "order_id": 1,
  "product_id": 1,
  "quantity": 2
}
```

