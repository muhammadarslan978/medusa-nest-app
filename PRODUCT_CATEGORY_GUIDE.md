# Product & Category Management Guide

This guide explains how to manage product categories, collections, and products in Medusa v2 using the NestJS BFF APIs.

---

## Table of Contents

1. [Overview](#overview)
2. [Entity Relationships](#entity-relationships)
3. [Correct Setup Order](#correct-setup-order)
4. [Product Categories](#product-categories)
5. [Collections](#collections)
6. [Products](#products)
7. [Product Variants & Pricing](#product-variants--pricing)
8. [Inventory Management](#inventory-management)
9. [Sales Channel Linking](#sales-channel-linking)
10. [Complete Example: Mobile Phone Store](#complete-example-mobile-phone-store)

---

## Overview

Medusa v2 organizes products using three main organizational structures:

| Entity          | Purpose                           | Example                            |
| --------------- | --------------------------------- | ---------------------------------- |
| **Categories**  | Hierarchical product organization | Electronics → Phones → Smartphones |
| **Collections** | Marketing/seasonal groupings      | "Summer Sale", "New Arrivals"      |
| **Tags**        | Flexible labeling                 | "bestseller", "featured", "sale"   |

### Key Differences

```
CATEGORIES (Hierarchical)          COLLECTIONS (Flat)           TAGS (Labels)
├── Electronics                    ┌─────────────────┐          • bestseller
│   ├── Phones                     │ Summer Sale     │          • featured
│   │   ├── Smartphones            │ - Product A     │          • new-arrival
│   │   └── Feature Phones         │ - Product B     │          • on-sale
│   └── Laptops                    └─────────────────┘
└── Clothing                       ┌─────────────────┐
    ├── Men                        │ New Arrivals    │
    └── Women                      │ - Product C     │
                                   └─────────────────┘
```

---

## Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRODUCT ENTITY RELATIONSHIPS                        │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │  CATEGORY   │ (Many-to-Many)
                              │  Phones     │◄────────────────┐
                              └─────────────┘                 │
                                    │                         │
                                    │ parent                  │
                                    ▼                         │
                              ┌─────────────┐                 │
                              │  CATEGORY   │                 │
                              │ Smartphones │◄────────┐       │
                              └─────────────┘         │       │
                                                      │       │
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│ COLLECTION  │ 1:Many  │   PRODUCT   │ M:M     │  CATEGORIES │
│ Summer Sale │◄────────│  iPhone 15  │─────────│             │
└─────────────┘         └──────┬──────┘         └─────────────┘
                               │
                               │ 1:Many
                               ▼
                        ┌─────────────┐
                        │  VARIANTS   │
                        │ 128GB, 256GB│
                        └──────┬──────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
       │   PRICES    │  │  INVENTORY  │  │   OPTIONS   │
       │ PKR 250,000 │  │  100 units  │  │ Storage,    │
       │ USD 999     │  │             │  │ Color       │
       └─────────────┘  └─────────────┘  └─────────────┘
```

---

## Correct Setup Order

**IMPORTANT:** Follow this exact order to avoid errors and ensure proper relationships.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SETUP ORDER (MUST FOLLOW)                           │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Categories (Parent → Child)
       ├── Create parent categories first
       └── Then create child categories with parent_category_id

Step 2: Collections (Optional)
       └── Create marketing collections

Step 3: Products
       ├── Create product with options (Size, Color, Storage)
       ├── Assign to categories
       └── Assign to collection (optional)

Step 4: Link Product to Sales Channel
       └── Products must be linked to be visible in storefront

Step 5: Set Inventory Levels
       └── Add stock quantity at each stock location
```

---

## Product Categories

Categories provide **hierarchical organization** for products. A product can belong to **multiple categories**.

### Category Fields

| Field                | Type    | Required | Description                                                |
| -------------------- | ------- | -------- | ---------------------------------------------------------- |
| `name`               | string  | Yes      | Category display name                                      |
| `handle`             | string  | No       | URL-friendly slug (auto-generated if not provided)         |
| `description`        | string  | No       | Category description                                       |
| `is_active`          | boolean | No       | Whether category is visible (default: true)                |
| `is_internal`        | boolean | No       | Internal category, hidden from storefront (default: false) |
| `parent_category_id` | string  | No       | Parent category ID for nesting                             |
| `metadata`           | object  | No       | Custom key-value data                                      |

### Create Parent Category

```bash
POST /api/v1/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Electronics",
  "handle": "electronics",
  "description": "Electronic devices and accessories",
  "is_active": true,
  "is_internal": false
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "pcat_01ABC123...",
    "name": "Electronics",
    "handle": "electronics",
    "description": "Electronic devices and accessories",
    "is_active": true,
    "is_internal": false,
    "rank": 0,
    "parent_category_id": null,
    "parent_category": null,
    "category_children": []
  }
}
```

### Create Child Category

```bash
POST /api/v1/categories
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Smartphones",
  "handle": "smartphones",
  "parent_category_id": "pcat_01ABC123...",
  "is_active": true
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "pcat_01DEF456...",
    "name": "Smartphones",
    "handle": "smartphones",
    "parent_category_id": "pcat_01ABC123...",
    "parent_category": {
      "id": "pcat_01ABC123...",
      "name": "Electronics"
    },
    "category_children": []
  }
}
```

### Category Hierarchy Example

```
Electronics (pcat_01ABC123)
├── Phones (pcat_01DEF456)
│   ├── Smartphones (pcat_01GHI789)
│   └── Feature Phones (pcat_01JKL012)
├── Laptops (pcat_01MNO345)
│   ├── Gaming Laptops (pcat_01PQR678)
│   └── Business Laptops (pcat_01STU901)
└── Accessories (pcat_01VWX234)
```

### Category API Endpoints

| Method   | Endpoint           | Description                    |
| -------- | ------------------ | ------------------------------ |
| `GET`    | `/categories`      | List all categories            |
| `GET`    | `/categories/tree` | Get hierarchical category tree |
| `GET`    | `/categories/:id`  | Get category by ID             |
| `POST`   | `/categories`      | Create category                |
| `PUT`    | `/categories/:id`  | Update category                |
| `DELETE` | `/categories/:id`  | Delete category                |

---

## Collections

Collections are **flat groupings** for marketing purposes. A product can belong to **one collection**.

### Collection Fields

| Field      | Type   | Required | Description             |
| ---------- | ------ | -------- | ----------------------- |
| `title`    | string | Yes      | Collection display name |
| `handle`   | string | No       | URL-friendly slug       |
| `metadata` | object | No       | Custom key-value data   |

### Create Collection

```bash
POST /api/v1/collections
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "Summer Sale 2026",
  "handle": "summer-sale-2026"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "pcol_01XYZ789...",
    "title": "Summer Sale 2026",
    "handle": "summer-sale-2026",
    "created_at": "2026-01-16T05:00:00.000Z",
    "updated_at": "2026-01-16T05:00:00.000Z"
  }
}
```

### Collection API Endpoints

| Method   | Endpoint                    | Description                       |
| -------- | --------------------------- | --------------------------------- |
| `GET`    | `/collections`              | List all collections              |
| `GET`    | `/collections/:id`          | Get collection by ID              |
| `POST`   | `/collections`              | Create collection                 |
| `PUT`    | `/collections/:id`          | Update collection                 |
| `DELETE` | `/collections/:id`          | Delete collection                 |
| `POST`   | `/collections/:id/products` | Add/remove products to collection |

---

## Products

Products are the core entities that customers purchase.

### Product Fields

| Field           | Type   | Required | Description                                  |
| --------------- | ------ | -------- | -------------------------------------------- |
| `title`         | string | Yes      | Product name                                 |
| `handle`        | string | No       | URL-friendly slug                            |
| `subtitle`      | string | No       | Short tagline                                |
| `description`   | string | No       | Full description                             |
| `status`        | enum   | No       | `draft`, `proposed`, `published`, `rejected` |
| `thumbnail`     | string | No       | Main image URL                               |
| `images`        | array  | No       | Additional image URLs                        |
| `collection_id` | string | No       | Collection to assign                         |
| `categories`    | array  | No       | Category IDs to assign                       |
| `options`       | array  | No       | Product options (Size, Color, etc.)          |
| `variants`      | array  | No       | Product variants with prices                 |
| `metadata`      | object | No       | Custom key-value data                        |

### Product Status Flow

```
┌─────────┐     ┌──────────┐     ┌───────────┐
│  DRAFT  │ ──► │ PROPOSED │ ──► │ PUBLISHED │
└─────────┘     └──────────┘     └───────────┘
                     │
                     ▼
               ┌──────────┐
               │ REJECTED │
               └──────────┘
```

| Status      | Description                   |
| ----------- | ----------------------------- |
| `draft`     | Work in progress, not visible |
| `proposed`  | Submitted for review          |
| `published` | Live and visible to customers |
| `rejected`  | Review rejected               |

### Create Product (Simple)

```bash
POST /api/v1/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "title": "iPhone 15 Pro",
  "handle": "iphone-15-pro",
  "description": "The latest iPhone with A17 Pro chip",
  "status": "published",
  "thumbnail": "https://example.com/iphone15.jpg",
  "categories": [
    {"id": "pcat_01GHI789..."}
  ],
  "collection_id": "pcol_01XYZ789...",
  "options": [
    {
      "title": "Storage",
      "values": ["128GB", "256GB", "512GB", "1TB"]
    },
    {
      "title": "Color",
      "values": ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"]
    }
  ],
  "variants": [
    {
      "title": "128GB / Natural Titanium",
      "sku": "IPHONE15PRO-128-NAT",
      "options": {
        "Storage": "128GB",
        "Color": "Natural Titanium"
      },
      "prices": [
        {"currency_code": "pkr", "amount": 450000},
        {"currency_code": "usd", "amount": 999}
      ]
    },
    {
      "title": "256GB / Natural Titanium",
      "sku": "IPHONE15PRO-256-NAT",
      "options": {
        "Storage": "256GB",
        "Color": "Natural Titanium"
      },
      "prices": [
        {"currency_code": "pkr", "amount": 500000},
        {"currency_code": "usd", "amount": 1099}
      ]
    }
  ]
}
```

### Product API Endpoints

| Method   | Endpoint                   | Description           |
| -------- | -------------------------- | --------------------- |
| `GET`    | `/products`                | List all products     |
| `GET`    | `/products/:id`            | Get product by ID     |
| `GET`    | `/products/handle/:handle` | Get product by handle |
| `POST`   | `/products`                | Create product        |
| `PUT`    | `/products/:id`            | Update product        |
| `DELETE` | `/products/:id`            | Delete product        |

---

## Product Variants & Pricing

Each product can have multiple **variants** based on options (Size, Color, Storage, etc.).

### Variant Structure

```
Product: iPhone 15 Pro
├── Option: Storage [128GB, 256GB, 512GB, 1TB]
├── Option: Color [Natural, Blue, White, Black]
│
└── Variants (combinations):
    ├── 128GB / Natural Titanium → PKR 450,000
    ├── 128GB / Blue Titanium → PKR 450,000
    ├── 256GB / Natural Titanium → PKR 500,000
    ├── 256GB / Blue Titanium → PKR 500,000
    └── ... (16 total combinations)
```

### Variant Fields

| Field              | Type    | Required | Description                     |
| ------------------ | ------- | -------- | ------------------------------- |
| `title`            | string  | Yes      | Variant display name            |
| `sku`              | string  | No       | Stock Keeping Unit              |
| `barcode`          | string  | No       | Barcode/UPC                     |
| `ean`              | string  | No       | European Article Number         |
| `options`          | object  | Yes      | Option values for this variant  |
| `prices`           | array   | Yes      | Prices in different currencies  |
| `manage_inventory` | boolean | No       | Track inventory (default: true) |
| `allow_backorder`  | boolean | No       | Allow orders when out of stock  |

### Price Structure

```json
{
  "prices": [
    {
      "currency_code": "pkr",
      "amount": 450000
    },
    {
      "currency_code": "usd",
      "amount": 999
    },
    {
      "currency_code": "eur",
      "amount": 949
    }
  ]
}
```

**Note:** Prices are in the **smallest currency unit** (cents for USD, paisa for PKR if applicable). For PKR, use the full amount since it has 0 decimal places.

---

## Inventory Management

After creating a product, you must **set inventory levels** at each stock location.

### Inventory Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   PRODUCT   │ ──► │   VARIANT   │ ──► │  INVENTORY  │
│  iPhone 15  │     │ 128GB/Blue  │     │    ITEM     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                    ┌──────────────────────────────────────┐
                    │         LOCATION LEVELS              │
                    ├──────────────────────────────────────┤
                    │ Main Warehouse: 100 units            │
                    │ Islamabad Store: 25 units            │
                    │ Karachi Store: 50 units              │
                    └──────────────────────────────────────┘
```

### Set Inventory Level

When you create a product with `manage_inventory: true`, Medusa automatically creates an **inventory item** for each variant. You need to add **location levels** to specify stock quantities.

```bash
# Step 1: Get inventory items
GET /api/v1/inventory
Authorization: Bearer <admin_token>

# Step 2: Add stock at a location
POST /api/v1/inventory/{inventory_item_id}/location-levels
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "location_id": "sloc_01XYZ...",
  "stocked_quantity": 100
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "iitem_01ABC...",
    "title": "128GB / Natural Titanium",
    "stocked_quantity": 100,
    "reserved_quantity": 0,
    "location_levels": [
      {
        "id": "ilev_01DEF...",
        "location_id": "sloc_01XYZ...",
        "stocked_quantity": 100,
        "reserved_quantity": 0,
        "available_quantity": 100
      }
    ]
  }
}
```

### Update Inventory Level

```bash
POST /api/v1/inventory/{inventory_item_id}/location-levels/{location_id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "stocked_quantity": 150
}
```

---

## Sales Channel Linking

**CRITICAL:** Products must be linked to a sales channel to be visible in the storefront.

### Why Link to Sales Channel?

```
Without Link                          With Link
─────────────                         ─────────
Product exists in database            Product visible in storefront
Customer cannot see it                Customer can browse & buy
API returns empty results             API returns product data
```

### Link Product to Sales Channel

```bash
POST /api/v1/store/sales-channels/{sales_channel_id}/products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "add": ["prod_01ABC...", "prod_01DEF..."]
}
```

### Bulk Link Multiple Products

```bash
POST /api/v1/store/sales-channels/sc_01XYZ.../products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "add": [
    "prod_01ABC...",
    "prod_01DEF...",
    "prod_01GHI..."
  ]
}
```

### Remove Product from Sales Channel

```bash
POST /api/v1/store/sales-channels/sc_01XYZ.../products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "remove": ["prod_01ABC..."]
}
```

---

## Complete Example: Mobile Phone Store

Here's a complete example of setting up a mobile phone store with categories, collections, and products.

### Step 1: Create Category Hierarchy

```bash
TOKEN="your_admin_token"
BASE_URL="http://localhost:3001/api/v1"

# 1.1 Create root category: Electronics
ELECTRONICS=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "handle": "electronics",
    "is_active": true
  }')
ELECTRONICS_ID=$(echo $ELECTRONICS | jq -r '.data.id')
echo "Electronics ID: $ELECTRONICS_ID"

# 1.2 Create child category: Phones
PHONES=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Phones\",
    \"handle\": \"phones\",
    \"parent_category_id\": \"$ELECTRONICS_ID\",
    \"is_active\": true
  }")
PHONES_ID=$(echo $PHONES | jq -r '.data.id')
echo "Phones ID: $PHONES_ID"

# 1.3 Create brand categories under Phones
APPLE=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Apple\",
    \"handle\": \"apple-phones\",
    \"parent_category_id\": \"$PHONES_ID\",
    \"is_active\": true
  }")
APPLE_ID=$(echo $APPLE | jq -r '.data.id')
echo "Apple ID: $APPLE_ID"

SAMSUNG=$(curl -s -X POST "$BASE_URL/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Samsung\",
    \"handle\": \"samsung-phones\",
    \"parent_category_id\": \"$PHONES_ID\",
    \"is_active\": true
  }")
SAMSUNG_ID=$(echo $SAMSUNG | jq -r '.data.id')
echo "Samsung ID: $SAMSUNG_ID"
```

**Result:**

```
Electronics
└── Phones
    ├── Apple
    └── Samsung
```

### Step 2: Create Collections

```bash
# 2.1 Create "New Arrivals" collection
NEW_ARRIVALS=$(curl -s -X POST "$BASE_URL/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Arrivals",
    "handle": "new-arrivals"
  }')
NEW_ARRIVALS_ID=$(echo $NEW_ARRIVALS | jq -r '.data.id')
echo "New Arrivals ID: $NEW_ARRIVALS_ID"

# 2.2 Create "Best Sellers" collection
BEST_SELLERS=$(curl -s -X POST "$BASE_URL/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Sellers",
    "handle": "best-sellers"
  }')
BEST_SELLERS_ID=$(echo $BEST_SELLERS | jq -r '.data.id')
echo "Best Sellers ID: $BEST_SELLERS_ID"
```

### Step 3: Create Products

```bash
# 3.1 Create iPhone 15 Pro
IPHONE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"iPhone 15 Pro\",
    \"handle\": \"iphone-15-pro\",
    \"description\": \"iPhone 15 Pro with A17 Pro chip, titanium design\",
    \"status\": \"published\",
    \"collection_id\": \"$NEW_ARRIVALS_ID\",
    \"categories\": [{\"id\": \"$APPLE_ID\"}],
    \"options\": [
      {\"title\": \"Storage\", \"values\": [\"128GB\", \"256GB\", \"512GB\"]},
      {\"title\": \"Color\", \"values\": [\"Natural Titanium\", \"Blue Titanium\"]}
    ],
    \"variants\": [
      {
        \"title\": \"128GB / Natural Titanium\",
        \"sku\": \"IP15P-128-NAT\",
        \"options\": {\"Storage\": \"128GB\", \"Color\": \"Natural Titanium\"},
        \"prices\": [{\"currency_code\": \"pkr\", \"amount\": 450000}]
      },
      {
        \"title\": \"256GB / Natural Titanium\",
        \"sku\": \"IP15P-256-NAT\",
        \"options\": {\"Storage\": \"256GB\", \"Color\": \"Natural Titanium\"},
        \"prices\": [{\"currency_code\": \"pkr\", \"amount\": 500000}]
      }
    ]
  }")
IPHONE_ID=$(echo $IPHONE | jq -r '.data.product.id')
echo "iPhone ID: $IPHONE_ID"

# 3.2 Create Samsung Galaxy S24
SAMSUNG_PHONE=$(curl -s -X POST "$BASE_URL/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Samsung Galaxy S24 Ultra\",
    \"handle\": \"samsung-galaxy-s24-ultra\",
    \"description\": \"Samsung Galaxy S24 Ultra with AI features\",
    \"status\": \"published\",
    \"collection_id\": \"$BEST_SELLERS_ID\",
    \"categories\": [{\"id\": \"$SAMSUNG_ID\"}],
    \"options\": [
      {\"title\": \"Storage\", \"values\": [\"256GB\", \"512GB\", \"1TB\"]},
      {\"title\": \"Color\", \"values\": [\"Titanium Black\", \"Titanium Gray\"]}
    ],
    \"variants\": [
      {
        \"title\": \"256GB / Titanium Black\",
        \"sku\": \"SGS24U-256-BLK\",
        \"options\": {\"Storage\": \"256GB\", \"Color\": \"Titanium Black\"},
        \"prices\": [{\"currency_code\": \"pkr\", \"amount\": 420000}]
      },
      {
        \"title\": \"512GB / Titanium Black\",
        \"sku\": \"SGS24U-512-BLK\",
        \"options\": {\"Storage\": \"512GB\", \"Color\": \"Titanium Black\"},
        \"prices\": [{\"currency_code\": \"pkr\", \"amount\": 480000}]
      }
    ]
  }")
SAMSUNG_PHONE_ID=$(echo $SAMSUNG_PHONE | jq -r '.data.product.id')
echo "Samsung ID: $SAMSUNG_PHONE_ID"
```

### Step 4: Link Products to Sales Channel

```bash
# Get your sales channel ID
SALES_CHANNEL_ID="sc_01KF0HA17R96P1CSEW8SB5RVF4"

# Link both products
curl -s -X POST "$BASE_URL/store/sales-channels/$SALES_CHANNEL_ID/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"add\": [\"$IPHONE_ID\", \"$SAMSUNG_PHONE_ID\"]
  }"
```

### Step 5: Set Inventory Levels

```bash
# Get inventory items for the products
INVENTORY_ITEMS=$(curl -s "$BASE_URL/inventory-items" \
  -H "Authorization: Bearer $TOKEN")

# For each inventory item, set stock at your warehouse
STOCK_LOCATION_ID="sloc_01KF0HK8XGXK0WN093WF1ADCY2"

# Example: Set 50 units for first variant
INVENTORY_ITEM_ID=$(echo $INVENTORY_ITEMS | jq -r '.data.inventory_items[0].id')

curl -s -X POST "$BASE_URL/inventory-items/$INVENTORY_ITEM_ID/location-levels" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"location_id\": \"$STOCK_LOCATION_ID\",
    \"stocked_quantity\": 50
  }"
```

### Final Result

```
ROX STORE
│
├── Categories
│   └── Electronics
│       └── Phones
│           ├── Apple
│           │   └── iPhone 15 Pro (in "New Arrivals")
│           └── Samsung
│               └── Galaxy S24 Ultra (in "Best Sellers")
│
├── Collections
│   ├── New Arrivals
│   │   └── iPhone 15 Pro
│   └── Best Sellers
│       └── Galaxy S24 Ultra
│
├── Sales Channel: Rox Mobile App
│   ├── iPhone 15 Pro ✓
│   └── Galaxy S24 Ultra ✓
│
└── Inventory (Main Warehouse)
    ├── iPhone 15 Pro 128GB: 50 units
    ├── iPhone 15 Pro 256GB: 50 units
    ├── Galaxy S24 256GB: 50 units
    └── Galaxy S24 512GB: 50 units
```

---

## Quick Reference: API Endpoints

**Base URL:** `http://localhost:3001/api/v1`

### Categories

| Method   | Endpoint           | Description                    |
| -------- | ------------------ | ------------------------------ |
| `GET`    | `/categories`      | List all categories            |
| `GET`    | `/categories/tree` | Get hierarchical category tree |
| `GET`    | `/categories/:id`  | Get category by ID             |
| `POST`   | `/categories`      | Create category                |
| `PUT`    | `/categories/:id`  | Update category                |
| `DELETE` | `/categories/:id`  | Delete category                |

### Collections

| Method   | Endpoint                    | Description                       |
| -------- | --------------------------- | --------------------------------- |
| `GET`    | `/collections`              | List all collections              |
| `GET`    | `/collections/:id`          | Get collection by ID              |
| `POST`   | `/collections`              | Create collection                 |
| `PUT`    | `/collections/:id`          | Update collection                 |
| `DELETE` | `/collections/:id`          | Delete collection                 |
| `POST`   | `/collections/:id/products` | Add/remove products to collection |

### Products

| Method   | Endpoint                             | Description                |
| -------- | ------------------------------------ | -------------------------- |
| `GET`    | `/products`                          | List all products          |
| `GET`    | `/products/:id`                      | Get product by ID          |
| `GET`    | `/products/handle/:handle`           | Get product by handle      |
| `GET`    | `/products/category/:categoryId`     | Get products by category   |
| `GET`    | `/products/collection/:collectionId` | Get products by collection |
| `POST`   | `/products`                          | Create product             |
| `PUT`    | `/products/:id`                      | Update product             |
| `PUT`    | `/products/:id/categories`           | Update product categories  |
| `DELETE` | `/products/:id`                      | Delete product             |

### Inventory

| Method   | Endpoint                                     | Description                     |
| -------- | -------------------------------------------- | ------------------------------- |
| `GET`    | `/inventory`                                 | List all inventory items        |
| `GET`    | `/inventory/:id`                             | Get inventory item by ID        |
| `GET`    | `/inventory/location/:locationId`            | Get inventory by stock location |
| `PUT`    | `/inventory/:id`                             | Update inventory item details   |
| `POST`   | `/inventory/:id/location-levels`             | Add stock at a location         |
| `POST`   | `/inventory/:id/location-levels/:locationId` | Update stock level at location  |
| `DELETE` | `/inventory/:id/location-levels/:locationId` | Remove stock level at location  |

### Sales Channel Products

| Method | Endpoint                             | Description                    |
| ------ | ------------------------------------ | ------------------------------ |
| `POST` | `/store/sales-channels/:id/products` | Add/remove products to channel |

### Store Configuration (Related)

| Method | Endpoint                                    | Description                    |
| ------ | ------------------------------------------- | ------------------------------ |
| `GET`  | `/store/stock-locations`                    | List stock locations           |
| `POST` | `/store/stock-locations`                    | Create stock location          |
| `POST` | `/store/stock-locations/:id/sales-channels` | Link location to sales channel |

---

## Common Errors & Solutions

### Error: "Product options are not provided"

**Cause:** Creating a product without options when variants are expected.

**Solution:** Always include options when creating variants:

```json
{
  "options": [
    {"title": "Size", "values": ["S", "M", "L"]}
  ],
  "variants": [...]
}
```

### Error: "Product not visible in storefront"

**Cause:** Product not linked to sales channel.

**Solution:** Link product to sales channel:

```bash
POST /store/sales-channels/{id}/products
{"add": ["prod_01..."]}
```

### Error: "Out of stock" when stock exists

**Cause:** Stock location not linked to sales channel.

**Solution:** Link stock location to sales channel:

```bash
POST /store/stock-locations/{id}/sales-channels
{"add": ["sc_01..."]}
```

### Error: "Category not found"

**Cause:** Using wrong ID format or deleted category.

**Solution:** Verify category ID starts with `pcat_` and exists:

```bash
GET /categories/{id}
```

---

## Best Practices

1. **Create categories before products** - Categories must exist to assign products
2. **Use meaningful handles** - Handles appear in URLs, make them SEO-friendly
3. **Set status to draft initially** - Review before publishing
4. **Always link to sales channel** - Products won't be visible otherwise
5. **Set inventory at all locations** - Customers see "out of stock" without inventory
6. **Use consistent naming** - Follow a naming convention for SKUs
7. **Add multiple currencies** - Support international customers

---

_Updated on: January 16, 2026_
_Medusa Version: 2.9.0+_
_NestJS BFF Version: 1.0.0_

---

## Swagger Documentation

All APIs are documented with Swagger. Access the interactive documentation at:

**URL:** `http://localhost:3001/docs`

You can test all endpoints directly from the Swagger UI by providing your admin Bearer token.
