# Product Setup Guide for Rox Mobile App

This guide walks you through setting up Apple and Samsung product categories with mock products.

## Prerequisites

- Medusa backend running on `http://localhost:9000`
- NestJS BFF running on `http://localhost:3001`
- Admin JWT token

## Get Admin Token

```bash
# Login to get admin token
curl -X POST http://localhost:9000/auth/user/emailpass \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@medusa.local","password":"supersecret123"}'

# Save the token
export TOKEN="your_token_here"
```

---

## Step 1: Create Parent Categories

### 1.1 Create Apple Category

```bash
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple",
    "handle": "apple",
    "description": "All Apple products including iPhones, MacBooks, iPads, and accessories",
    "is_active": true,
    "metadata": {
      "brand": "Apple",
      "country": "USA"
    }
  }'

# Save the returned ID as APPLE_CAT_ID
export APPLE_CAT_ID="pcat_01..."
```

### 1.2 Create Samsung Category

```bash
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung",
    "handle": "samsung",
    "description": "All Samsung products including Galaxy phones, tablets, and accessories",
    "is_active": true,
    "metadata": {
      "brand": "Samsung",
      "country": "South Korea"
    }
  }'

# Save the returned ID as SAMSUNG_CAT_ID
export SAMSUNG_CAT_ID="pcat_01..."
```

---

## Step 2: Create Child Categories

### 2.1 Apple Subcategories

```bash
# iPhones
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhones",
    "handle": "iphones",
    "description": "Apple iPhone smartphones",
    "is_active": true,
    "parent_category_id": "'$APPLE_CAT_ID'"
  }'
export IPHONES_CAT_ID="pcat_01..."

# MacBooks
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBooks",
    "handle": "macbooks",
    "description": "Apple MacBook laptops",
    "is_active": true,
    "parent_category_id": "'$APPLE_CAT_ID'"
  }'
export MACBOOKS_CAT_ID="pcat_01..."

# Apple Accessories
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Apple Accessories",
    "handle": "apple-accessories",
    "description": "Apple accessories including AirPods, chargers, and cases",
    "is_active": true,
    "parent_category_id": "'$APPLE_CAT_ID'"
  }'
export APPLE_ACC_CAT_ID="pcat_01..."
```

### 2.2 Samsung Subcategories

```bash
# Galaxy Phones
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Galaxy Phones",
    "handle": "galaxy-phones",
    "description": "Samsung Galaxy smartphones",
    "is_active": true,
    "parent_category_id": "'$SAMSUNG_CAT_ID'"
  }'
export GALAXY_PHONES_CAT_ID="pcat_01..."

# Samsung Accessories
curl -X POST http://localhost:3001/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Samsung Accessories",
    "handle": "samsung-accessories",
    "description": "Samsung accessories including Galaxy Buds, chargers, and cases",
    "is_active": true,
    "parent_category_id": "'$SAMSUNG_CAT_ID'"
  }'
export SAMSUNG_ACC_CAT_ID="pcat_01..."
```

---

## Step 3: Create Collections

```bash
# New Arrivals
curl -X POST http://localhost:3001/api/v1/collections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Arrivals",
    "handle": "new-arrivals"
  }'
export NEW_ARRIVALS_COL_ID="pcol_01..."

# Best Sellers
curl -X POST http://localhost:3001/api/v1/collections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Best Sellers",
    "handle": "best-sellers"
  }'
export BEST_SELLERS_COL_ID="pcol_01..."

# Flagship Phones
curl -X POST http://localhost:3001/api/v1/collections \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Flagship Phones",
    "handle": "flagship-phones"
  }'
export FLAGSHIP_COL_ID="pcol_01..."
```

---

## Step 4: Create Products

### 4.1 iPhone 15 Pro Max

```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "iPhone 15 Pro Max",
    "subtitle": "The most powerful iPhone ever",
    "handle": "iphone-15-pro-max",
    "description": "iPhone 15 Pro Max features a titanium design, A17 Pro chip, 48MP camera system with 5x optical zoom.",
    "status": "published",
    "categories": ["'$IPHONES_CAT_ID'"],
    "collection_id": "'$FLAGSHIP_COL_ID'",
    "options": [
      {"title": "Storage", "values": ["256GB", "512GB", "1TB"]},
      {"title": "Color", "values": ["Natural Titanium", "Blue Titanium", "Black Titanium"]}
    ],
    "variants": [
      {
        "title": "256GB / Natural Titanium",
        "sku": "IPHONE15PM-256-NAT",
        "options": {"Storage": "256GB", "Color": "Natural Titanium"},
        "prices": [
          {"currency_code": "pkr", "amount": 549999},
          {"currency_code": "usd", "amount": 1199}
        ],
        "manage_inventory": true
      },
      {
        "title": "512GB / Blue Titanium",
        "sku": "IPHONE15PM-512-BLU",
        "options": {"Storage": "512GB", "Color": "Blue Titanium"},
        "prices": [
          {"currency_code": "pkr", "amount": 649999},
          {"currency_code": "usd", "amount": 1399}
        ],
        "manage_inventory": true
      }
    ],
    "metadata": {"brand": "Apple", "warranty_months": 12}
  }'
export IPHONE15PM_ID="prod_01..."
```

### 4.2 Samsung Galaxy S24 Ultra

```bash
curl -X POST http://localhost:3001/api/v1/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Samsung Galaxy S24 Ultra",
    "subtitle": "The ultimate Galaxy experience",
    "handle": "samsung-galaxy-s24-ultra",
    "description": "Galaxy S24 Ultra features a titanium frame, 200MP camera, S Pen, and Galaxy AI.",
    "status": "published",
    "categories": ["'$GALAXY_PHONES_CAT_ID'"],
    "collection_id": "'$FLAGSHIP_COL_ID'",
    "options": [
      {"title": "Storage", "values": ["256GB", "512GB", "1TB"]},
      {"title": "Color", "values": ["Titanium Black", "Titanium Gray", "Titanium Violet"]}
    ],
    "variants": [
      {
        "title": "256GB / Titanium Black",
        "sku": "S24U-256-BLK",
        "options": {"Storage": "256GB", "Color": "Titanium Black"},
        "prices": [
          {"currency_code": "pkr", "amount": 499999},
          {"currency_code": "usd", "amount": 1299}
        ],
        "manage_inventory": true
      },
      {
        "title": "512GB / Titanium Violet",
        "sku": "S24U-512-VIO",
        "options": {"Storage": "512GB", "Color": "Titanium Violet"},
        "prices": [
          {"currency_code": "pkr", "amount": 549999},
          {"currency_code": "usd", "amount": 1419}
        ],
        "manage_inventory": true
      }
    ],
    "metadata": {"brand": "Samsung", "warranty_months": 12}
  }'
export S24_ULTRA_ID="prod_01..."
```

---

## Step 5: Link Products to Sales Channel

```bash
curl -X POST http://localhost:3001/api/v1/store/sales-channels/sc_01KF0HA17R96P1CSEW8SB5RVF4/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "add": ["'$IPHONE15PM_ID'", "'$S24_ULTRA_ID'"]
  }'
```

### 5 step completed

## Step 6: Set Inventory Levels

### 6.1 Get or Create Stock Location

```bash
# List existing stock locations
curl http://localhost:3001/api/v1/store/stock-locations \
  -H "Authorization: Bearer $TOKEN"

# Or create a new one
curl -X POST http://localhost:3001/api/v1/store/stock-locations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Warehouse",
    "address": {
      "address_1": "123 Warehouse Street",
      "city": "Islamabad",
      "country_code": "pk"
    }
  }'
export STOCK_LOC_ID="sloc_01..."
```

### 6.2 Link Stock Location to Sales Channel

```bash
curl -X POST http://localhost:3001/api/v1/store/stock-locations/$STOCK_LOC_ID/sales-channels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "add": ["sc_01KF0HA17R96P1CSEW8SB5RVF4"]
  }'
```

### 6.3 Get Inventory Items

```bash
curl http://localhost:3001/api/v1/inventory \
  -H "Authorization: Bearer $TOKEN"

# Note the inventory_item IDs for each variant
```

### 6.4 Set Stock Levels

```bash
# For each inventory item, add stock at the location
curl -X POST http://localhost:3001/api/v1/inventory/{inventory_item_id}/location-levels \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location_id": "'$STOCK_LOC_ID'",
    "stocked_quantity": 50
  }'
```

---

## Verify Setup

### Check Categories

```bash
curl http://localhost:3001/api/v1/categories/tree \
  -H "Authorization: Bearer $TOKEN"
```

### Check Products

```bash
curl http://localhost:3001/api/v1/products
```

### Check Inventory

```bash
curl http://localhost:3001/api/v1/inventory \
  -H "Authorization: Bearer $TOKEN"
```

---

## Category Structure

```
├── Apple (pcat_...)
│   ├── iPhones
│   ├── MacBooks
│   └── Apple Accessories
│
└── Samsung (pcat_...)
    ├── Galaxy Phones
    └── Samsung Accessories
```

## Collections

- **New Arrivals** - Latest products
- **Best Sellers** - Top selling items
- **Flagship Phones** - Premium smartphones

---

_Generated for Rox Mobile App (sc_01KF0HA17R96P1CSEW8SB5RVF4)_
