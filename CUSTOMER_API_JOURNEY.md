# Customer API Journey

Complete guide showing the correct order of API calls for customer interactions with the Medusa + NestJS BFF e-commerce platform.

---

## Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   NestJS BFF    │────▶│  Medusa Backend │
│   (Mobile/Web)  │     │   :3001/api/v1  │     │     :9000       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌─────────────────┐
                        │ Payment Services│
                        │ (JazzCash/EP)   │
                        └─────────────────┘
```

**Base URL:** `http://localhost:3001/api/v1`

---

## Customer Journey Flow

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Browse  │──▶│  Create  │──▶│   Add    │──▶│ Checkout │──▶│ Shipping │──▶│  Payment │──▶│  Order   │
│ Products │   │   Cart   │   │  Items   │   │  Address │   │  Select  │   │          │   │ Complete │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
```

---

## Phase 1: Product Discovery

### 1.1 Browse Products

```http
GET /api/v1/products
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Number of products per page (default: 20) |
| offset | number | Pagination offset |
| q | string | Search query |
| category_id | string | Filter by category |
| collection_id | string | Filter by collection |

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_01ABC",
        "title": "iPhone 15 Pro",
        "handle": "iphone-15-pro",
        "description": "Latest iPhone",
        "thumbnail": "https://...",
        "variants": [
          {
            "id": "variant_01XYZ",
            "title": "256GB - Black",
            "prices": [
              { "amount": 450000, "currency_code": "PKR" }
            ]
          }
        ],
        "categories": [...],
        "collection": {...}
      }
    ],
    "count": 50,
    "limit": 20,
    "offset": 0
  }
}
```

### 1.2 Get Single Product

```http
GET /api/v1/products/:id
```

### 1.3 Get Product by Handle (Slug)

```http
GET /api/v1/products/handle/:handle
```

### 1.4 Browse by Category

```http
GET /api/v1/products/category/:categoryId
```

### 1.5 Browse by Collection

```http
GET /api/v1/products/collection/:collectionId
```

### 1.6 Get Categories (for navigation)

```http
GET /api/v1/categories
Authorization: Bearer <token>
```

### 1.7 Get Category Tree (hierarchical)

```http
GET /api/v1/categories/tree
Authorization: Bearer <token>
```

### 1.8 Get Collections

```http
GET /api/v1/collections
Authorization: Bearer <token>
```

---

## Phase 2: Authentication (Optional)

### 2.1 Register New Customer

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "securePassword123",
  "first_name": "Muhammad",
  "last_name": "Ali"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {
      "id": "cus_01ABC",
      "email": "customer@example.com",
      "first_name": "Muhammad",
      "last_name": "Ali"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 2.2 Login Customer

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "customer@example.com",
  "password": "securePassword123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "customer": {...},
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

> ⚠️ **Save the token** - needed for authenticated requests.

### 2.3 Get Customer Profile

```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

### 2.4 Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

## Phase 3: Cart Management

### 3.1 Create Cart

```http
POST /api/v1/cart
Content-Type: application/json

{
  "region_id": "reg_01ABC"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cart_01ABC",
    "items": [],
    "region_id": "reg_01ABC",
    "subtotal": 0,
    "tax_total": 0,
    "shipping_total": 0,
    "total": 0
  }
}
```

> ⚠️ **Save `cart_id`** - needed for all cart operations.

### 3.2 Get Cart

```http
GET /api/v1/cart/:cartId
```

### 3.3 Add Item to Cart

```http
POST /api/v1/cart/:cartId/line-items
Content-Type: application/json

{
  "variant_id": "variant_01XYZ",
  "quantity": 1
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cart_01ABC",
    "items": [
      {
        "id": "item_01DEF",
        "title": "iPhone 15 Pro - 256GB Black",
        "variant_id": "variant_01XYZ",
        "quantity": 1,
        "unit_price": 450000,
        "subtotal": 450000
      }
    ],
    "subtotal": 450000,
    "total": 450000
  }
}
```

### 3.4 Update Item Quantity

```http
PUT /api/v1/cart/:cartId/line-items/:lineItemId
Content-Type: application/json

{
  "quantity": 2
}
```

### 3.5 Remove Item from Cart

```http
DELETE /api/v1/cart/:cartId/line-items/:lineItemId
```

---

## Phase 4: Checkout Process

### 4.1 Update Shipping Address

```http
POST /api/v1/checkout/:cartId/shipping-address
Content-Type: application/json

{
  "first_name": "Muhammad",
  "last_name": "Ali",
  "address_1": "123 Main Street",
  "address_2": "",
  "city": "Lahore",
  "country_code": "pk",
  "postal_code": "54000",
  "phone": "03001234567",
  "email": "customer@example.com"
}
```

### 4.2 Get Shipping Options

```http
GET /api/v1/checkout/:cartId/shipping-options
```

**Response:**

```json
{
  "success": true,
  "data": {
    "shipping_options": [
      {
        "id": "so_01ABC",
        "name": "Standard Delivery",
        "amount": 500
      },
      {
        "id": "so_02DEF",
        "name": "Express Delivery",
        "amount": 1000
      }
    ]
  }
}
```

### 4.3 Select Shipping Option

```http
POST /api/v1/checkout/:cartId/shipping-option
Content-Type: application/json

{
  "option_id": "so_01ABC"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "cart_01ABC",
    "subtotal": 450000,
    "shipping_total": 500,
    "tax_total": 0,
    "total": 450500
  }
}
```

### 4.4 Initialize Payment Sessions

```http
POST /api/v1/checkout/:cartId/payment-sessions
```

**Response:**

```json
{
  "success": true,
  "data": {
    "payment_sessions": [
      {
        "provider_id": "jazzcash",
        "status": "pending"
      },
      {
        "provider_id": "easypaisa",
        "status": "pending"
      },
      {
        "provider_id": "card",
        "status": "pending"
      }
    ]
  }
}
```

---

## Phase 5: Payment

### 5.1 Get Available Payment Providers

```http
GET /api/v1/payments/providers
```

**Response:**

```json
{
  "success": true,
  "providers": [
    { "id": "jazzcash", "name": "JazzCash" },
    { "id": "easypaisa", "name": "EasyPaisa" },
    { "id": "card", "name": "Credit/Debit Card" }
  ]
}
```

### 5.2 Initiate JazzCash Payment

```http
POST /api/v1/payments/jazzcash/initiate
Content-Type: application/json

{
  "mobileNumber": "03001234567",
  "paymentFor": "order",
  "amount": 450500,
  "cnicLastDigits": "1234",
  "userName": "Muhammad Ali",
  "userEmail": "customer@example.com",
  "ppmpf_1": "",
  "ppmpf_2": "",
  "ppmpf_3": "",
  "ppmpf_5": "",
  "additionalInfo": {
    "mobileNumber": "03001234567",
    "userMobile": "03001234567",
    "userName": "Muhammad Ali",
    "userId": "cus_01ABC",
    "requestId": "cart_01ABC",
    "bundleName": "Order",
    "bundleCode": "ORD001"
  }
}
```

**Response:**

```json
{
  "success": true,
  "transactionId": "JC-ABC123-XYZ789",
  "data": {
    "redirectUrl": "https://jazzcash.com.pk/pay/..."
  }
}
```

### 5.3 Initiate EasyPaisa Payment

```http
POST /api/v1/payments/easypaisa/initiate
Content-Type: application/json

{
  "orderId": "cart_01ABC",
  "price": "450500",
  "mobileNumber": "03001234567",
  "email": "customer@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "transactionId": "EP-ABC123-XYZ789",
  "data": {
    "redirectUrl": "https://easypaisa.com.pk/pay/..."
  }
}
```

### 5.4 Initiate Card Payment

```http
POST /api/v1/payments/card/initiate
Content-Type: application/json

{
  "amount": 450500,
  "billReference": "cart_01ABC",
  "description": "Order Payment",
  "mobileNumber": "03001234567",
  "userName": "Muhammad Ali"
}
```

**Response:**

```json
{
  "success": true,
  "transactionId": "CARD-ABC123-XYZ789",
  "data": {
    "redirectUrl": "https://payment-gateway.com/pay/..."
  }
}
```

### 5.5 Customer Redirected to Payment Gateway

Customer is redirected to the `redirectUrl` to complete payment.

### 5.6 Verify Payment (after return)

**JazzCash:**

```http
POST /api/v1/payments/jazzcash/verify
Content-Type: application/json

{
  "transactionId": "JC-ABC123-XYZ789",
  "orderId": "cart_01ABC"
}
```

**EasyPaisa:**

```http
POST /api/v1/payments/easypaisa/verify
Content-Type: application/json

{
  "orderId": "cart_01ABC",
  "transactionId": "EP-ABC123-XYZ789"
}
```

**Card:**

```http
POST /api/v1/payments/card/verify
Content-Type: application/json

{
  "transactionId": "CARD-ABC123-XYZ789",
  "billReference": "cart_01ABC"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "captured",
    "transactionId": "JC-ABC123-XYZ789",
    "amount": 450500
  }
}
```

---

## Phase 6: Complete Order

### 6.1 Complete Checkout

```http
POST /api/v1/checkout/:cartId/complete
Content-Type: application/json

{
  "payment_provider_id": "jazzcash"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "type": "order",
    "order": {
      "id": "order_01ABC",
      "display_id": 1001,
      "status": "pending",
      "payment_status": "captured",
      "fulfillment_status": "not_fulfilled",
      "email": "customer@example.com",
      "items": [...],
      "shipping_address": {...},
      "shipping_total": 500,
      "subtotal": 450000,
      "total": 450500
    }
  }
}
```

---

## Phase 7: Order Management

### 7.1 Get Order Confirmation (No Auth Required)

```http
GET /api/v1/orders/confirmation/:orderId
```

### 7.2 Get Customer Orders (Auth Required)

```http
GET /api/v1/orders
Authorization: Bearer <token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "orders": [
      {
        "id": "order_01ABC",
        "display_id": 1001,
        "status": "pending",
        "payment_status": "captured",
        "fulfillment_status": "not_fulfilled",
        "total": 450500,
        "created_at": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

### 7.3 Get Single Order (Auth Required)

```http
GET /api/v1/orders/:orderId
Authorization: Bearer <token>
```

---

## Complete API Sequence Summary

| Step | Phase     | Action                     | API Endpoint                         | Method | Auth |
| ---- | --------- | -------------------------- | ------------------------------------ | ------ | ---- |
| 1    | Discovery | Browse products            | `/products`                          | GET    | No   |
| 2    | Discovery | View product               | `/products/:id`                      | GET    | No   |
| 3    | Discovery | Browse categories          | `/categories`                        | GET    | Yes  |
| 4    | Discovery | Browse collections         | `/collections`                       | GET    | Yes  |
| 5    | Auth      | Register (optional)        | `/auth/register`                     | POST   | No   |
| 6    | Auth      | Login (optional)           | `/auth/login`                        | POST   | No   |
| 7    | Cart      | Create cart                | `/cart`                              | POST   | No   |
| 8    | Cart      | Add items                  | `/cart/:id/line-items`               | POST   | No   |
| 9    | Cart      | Update quantity            | `/cart/:id/line-items/:itemId`       | PUT    | No   |
| 10   | Cart      | Remove item                | `/cart/:id/line-items/:itemId`       | DELETE | No   |
| 11   | Checkout  | Add shipping address       | `/checkout/:cartId/shipping-address` | POST   | No   |
| 12   | Checkout  | Get shipping options       | `/checkout/:cartId/shipping-options` | GET    | No   |
| 13   | Checkout  | Select shipping            | `/checkout/:cartId/shipping-option`  | POST   | No   |
| 14   | Checkout  | Init payment sessions      | `/checkout/:cartId/payment-sessions` | POST   | No   |
| 15   | Payment   | Get providers              | `/payments/providers`                | GET    | No   |
| 16   | Payment   | Initiate payment           | `/payments/{provider}/initiate`      | POST   | No   |
| 17   | Payment   | _Customer pays on gateway_ | -                                    | -      | -    |
| 18   | Payment   | Verify payment             | `/payments/{provider}/verify`        | POST   | No   |
| 19   | Order     | Complete checkout          | `/checkout/:cartId/complete`         | POST   | No   |
| 20   | Order     | View confirmation          | `/orders/confirmation/:id`           | GET    | No   |
| 21   | Order     | View orders                | `/orders`                            | GET    | Yes  |

---

## Flow Diagram

```
Customer                         BFF API                      Payment Gateway
   │                               │                               │
   │──── GET /products ───────────▶│                               │
   │◀─── Product List ─────────────│                               │
   │                               │                               │
   │──── POST /cart ──────────────▶│                               │
   │◀─── Cart ID ──────────────────│                               │
   │                               │                               │
   │──── POST /cart/:id/line-items▶│                               │
   │◀─── Updated Cart ─────────────│                               │
   │                               │                               │
   │──── POST /checkout/:id/       │                               │
   │     shipping-address ────────▶│                               │
   │◀─── OK ───────────────────────│                               │
   │                               │                               │
   │──── GET /checkout/:id/        │                               │
   │     shipping-options ────────▶│                               │
   │◀─── Shipping Options ─────────│                               │
   │                               │                               │
   │──── POST /checkout/:id/       │                               │
   │     shipping-option ─────────▶│                               │
   │◀─── Updated Cart ─────────────│                               │
   │                               │                               │
   │──── POST /checkout/:id/       │                               │
   │     payment-sessions ────────▶│                               │
   │◀─── Payment Sessions ─────────│                               │
   │                               │                               │
   │──── POST /payments/jazzcash/  │                               │
   │     initiate ────────────────▶│                               │
   │◀─── Redirect URL ─────────────│                               │
   │                               │                               │
   │─────────────────── Redirect ─────────────────────────────────▶│
   │                               │                               │
   │                               │◀─── Webhook (payment done) ───│
   │                               │                               │
   │◀────────────────── Redirect Back ────────────────────────────│
   │                               │                               │
   │──── POST /payments/jazzcash/  │                               │
   │     verify ──────────────────▶│                               │
   │◀─── Payment Verified ─────────│                               │
   │                               │                               │
   │──── POST /checkout/:id/       │                               │
   │     complete ────────────────▶│                               │
   │◀─── Order Created ────────────│                               │
   │                               │                               │
   │──── GET /orders/confirmation/ │                               │
   │     :orderId ────────────────▶│                               │
   │◀─── Order Details ────────────│                               │
```

---

## Error Handling

All API responses follow this format:

**Success:**

```json
{
  "success": true,
  "data": {...}
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

---

## Common HTTP Status Codes

| Code | Description                           |
| ---- | ------------------------------------- |
| 200  | Success                               |
| 201  | Created                               |
| 400  | Bad Request - Invalid input           |
| 401  | Unauthorized - Token required/invalid |
| 404  | Not Found                             |
| 500  | Internal Server Error                 |

---

## Headers

### Required Headers

```
Content-Type: application/json
```

### Authenticated Requests

```
Authorization: Bearer <token>
```

### Publishable API Key (for Medusa Store API)

```
x-publishable-api-key: pk_xxx
```
