/**
 * Category & Product Configuration Script
 *
 * This script sets up categories and products for the store:
 *
 * Category Structure:
 * ├── PriceOye
 * │   ├── Apple
 * │   │   ├── Phone (iPhone 15 Pro, iPhone 15, iPhone 14)
 * │   │   ├── Mac (MacBook Pro M3, MacBook Air M2, iMac 24")
 * │   │   └── Accessories (AirPods Pro, Apple Watch, MagSafe Charger)
 * │   └── Samsung
 * │       ├── Phone (Galaxy S24 Ultra, Galaxy S24, Galaxy A54)
 * │       ├── Tablet (Galaxy Tab S9, Galaxy Tab A9)
 * │       └── Accessories (Galaxy Buds, Galaxy Watch, Samsung Charger)
 * │
 * └── Merchantize
 *     ├── Clothing
 *     │   ├── Men (T-Shirts, Jeans, Jackets)
 *     │   └── Women (Dresses, Tops, Pants)
 *     └── Footwear
 *         ├── Sports (Running Shoes, Training Shoes)
 *         └── Casual (Sneakers, Loafers)
 *
 * Usage:
 *   npx medusa exec ./src/scripts/category-product-configuration.ts
 */

import { ExecArgs } from '@medusajs/framework/types';
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  batchProductsWorkflow,
} from '@medusajs/medusa/core-flows';

// ============================================================================
// Category Configuration
// ============================================================================

interface CategoryConfig {
  name: string;
  handle: string;
  description?: string;
  is_active?: boolean;
  is_internal?: boolean;
  children?: CategoryConfig[];
}

const CATEGORIES: CategoryConfig[] = [
  {
    name: 'PriceOye',
    handle: 'priceoye',
    description: 'Electronics and gadgets at best prices',
    is_active: true,
    children: [
      {
        name: 'Apple',
        handle: 'apple',
        description: 'Apple products and accessories',
        children: [
          {
            name: 'Phone',
            handle: 'apple-phone',
            description: 'iPhones and accessories',
          },
          {
            name: 'Mac',
            handle: 'apple-mac',
            description: 'MacBooks and iMacs',
          },
          {
            name: 'Accessories',
            handle: 'apple-accessories',
            description: 'Apple accessories and peripherals',
          },
        ],
      },
      {
        name: 'Samsung',
        handle: 'samsung',
        description: 'Samsung products and accessories',
        children: [
          {
            name: 'Phone',
            handle: 'samsung-phone',
            description: 'Samsung Galaxy phones',
          },
          {
            name: 'Tablet',
            handle: 'samsung-tablet',
            description: 'Samsung Galaxy tablets',
          },
          {
            name: 'Accessories',
            handle: 'samsung-accessories',
            description: 'Samsung accessories',
          },
        ],
      },
    ],
  },
  {
    name: 'Merchantize',
    handle: 'merchantize',
    description: 'Fashion and lifestyle products',
    is_active: true,
    children: [
      {
        name: 'Clothing',
        handle: 'clothing',
        description: 'Apparel for men and women',
        children: [
          {
            name: 'Men',
            handle: 'clothing-men',
            description: "Men's clothing",
          },
          {
            name: 'Women',
            handle: 'clothing-women',
            description: "Women's clothing",
          },
        ],
      },
      {
        name: 'Footwear',
        handle: 'footwear',
        description: 'Shoes and sandals',
        children: [
          {
            name: 'Sports',
            handle: 'footwear-sports',
            description: 'Sports and athletic shoes',
          },
          {
            name: 'Casual',
            handle: 'footwear-casual',
            description: 'Casual and everyday shoes',
          },
        ],
      },
    ],
  },
];

// ============================================================================
// Product Configuration
// ============================================================================

interface ProductVariant {
  title: string;
  sku: string;
  prices: { amount: number; currency_code: string }[];
  options?: Record<string, string>;
  manage_inventory?: boolean;
}

interface ProductConfig {
  title: string;
  handle: string;
  description: string;
  categoryHandle: string;
  status: 'draft' | 'published';
  options?: { title: string; values: string[] }[];
  variants: ProductVariant[];
  images?: { url: string }[];
}

const PRODUCTS: ProductConfig[] = [
  // ========================================================================
  // PriceOye > Apple > Phone
  // ========================================================================
  {
    title: 'iPhone 15 Pro Max',
    handle: 'iphone-15-pro-max',
    description:
      'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
    categoryHandle: 'apple-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['256GB', '512GB', '1TB'] },
      {
        title: 'Color',
        values: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
      },
    ],
    variants: [
      {
        title: '256GB - Natural Titanium',
        sku: 'IP15PM-256-NT',
        prices: [{ amount: 54999900, currency_code: 'pkr' }],
      },
      {
        title: '512GB - Natural Titanium',
        sku: 'IP15PM-512-NT',
        prices: [{ amount: 62999900, currency_code: 'pkr' }],
      },
      {
        title: '1TB - Natural Titanium',
        sku: 'IP15PM-1TB-NT',
        prices: [{ amount: 72999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Blue Titanium',
        sku: 'IP15PM-256-BT',
        prices: [{ amount: 54999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Black Titanium',
        sku: 'IP15PM-256-BLK',
        prices: [{ amount: 54999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'iPhone 15',
    handle: 'iphone-15',
    description:
      'Dynamic Island, 48MP camera, and USB-C. The new standard for iPhone.',
    categoryHandle: 'apple-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['128GB', '256GB', '512GB'] },
      { title: 'Color', values: ['Pink', 'Blue', 'Green', 'Black'] },
    ],
    variants: [
      {
        title: '128GB - Pink',
        sku: 'IP15-128-PNK',
        prices: [{ amount: 37999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Pink',
        sku: 'IP15-256-PNK',
        prices: [{ amount: 42999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Blue',
        sku: 'IP15-128-BLU',
        prices: [{ amount: 37999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Black',
        sku: 'IP15-128-BLK',
        prices: [{ amount: 37999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'iPhone 14',
    handle: 'iphone-14',
    description:
      'A15 Bionic chip, advanced dual-camera system, and all-day battery life.',
    categoryHandle: 'apple-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['128GB', '256GB'] },
      { title: 'Color', values: ['Midnight', 'Starlight', 'Red'] },
    ],
    variants: [
      {
        title: '128GB - Midnight',
        sku: 'IP14-128-MID',
        prices: [{ amount: 29999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Midnight',
        sku: 'IP14-256-MID',
        prices: [{ amount: 34999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Starlight',
        sku: 'IP14-128-STR',
        prices: [{ amount: 29999900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // PriceOye > Apple > Mac
  // ========================================================================
  {
    title: 'MacBook Pro 14" M3 Pro',
    handle: 'macbook-pro-14-m3-pro',
    description:
      'Supercharged by M3 Pro chip with up to 18-core GPU. Liquid Retina XDR display.',
    categoryHandle: 'apple-mac',
    status: 'published',
    options: [
      { title: 'Memory', values: ['18GB', '36GB'] },
      { title: 'Storage', values: ['512GB', '1TB'] },
    ],
    variants: [
      {
        title: '18GB RAM - 512GB',
        sku: 'MBP14-M3P-18-512',
        prices: [{ amount: 89999900, currency_code: 'pkr' }],
      },
      {
        title: '18GB RAM - 1TB',
        sku: 'MBP14-M3P-18-1TB',
        prices: [{ amount: 99999900, currency_code: 'pkr' }],
      },
      {
        title: '36GB RAM - 1TB',
        sku: 'MBP14-M3P-36-1TB',
        prices: [{ amount: 119999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'MacBook Air 15" M2',
    handle: 'macbook-air-15-m2',
    description:
      'Strikingly thin design with M2 chip. 15.3-inch Liquid Retina display.',
    categoryHandle: 'apple-mac',
    status: 'published',
    options: [
      { title: 'Memory', values: ['8GB', '16GB'] },
      { title: 'Storage', values: ['256GB', '512GB'] },
    ],
    variants: [
      {
        title: '8GB RAM - 256GB',
        sku: 'MBA15-M2-8-256',
        prices: [{ amount: 54999900, currency_code: 'pkr' }],
      },
      {
        title: '8GB RAM - 512GB',
        sku: 'MBA15-M2-8-512',
        prices: [{ amount: 62999900, currency_code: 'pkr' }],
      },
      {
        title: '16GB RAM - 512GB',
        sku: 'MBA15-M2-16-512',
        prices: [{ amount: 72999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'iMac 24" M3',
    handle: 'imac-24-m3',
    description:
      'All-in-one desktop with M3 chip and stunning 4.5K Retina display.',
    categoryHandle: 'apple-mac',
    status: 'published',
    options: [
      { title: 'Memory', values: ['8GB', '16GB', '24GB'] },
      { title: 'Color', values: ['Silver', 'Blue', 'Green'] },
    ],
    variants: [
      {
        title: '8GB RAM - Silver',
        sku: 'IMAC24-M3-8-SLV',
        prices: [{ amount: 59999900, currency_code: 'pkr' }],
      },
      {
        title: '16GB RAM - Silver',
        sku: 'IMAC24-M3-16-SLV',
        prices: [{ amount: 74999900, currency_code: 'pkr' }],
      },
      {
        title: '8GB RAM - Blue',
        sku: 'IMAC24-M3-8-BLU',
        prices: [{ amount: 59999900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // PriceOye > Apple > Accessories
  // ========================================================================
  {
    title: 'AirPods Pro (2nd Gen)',
    handle: 'airpods-pro-2',
    description:
      'Active Noise Cancellation, Adaptive Audio, and USB-C charging case.',
    categoryHandle: 'apple-accessories',
    status: 'published',
    variants: [
      {
        title: 'Default',
        sku: 'APP2-USB-C',
        prices: [{ amount: 8999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Apple Watch Series 9',
    handle: 'apple-watch-series-9',
    description: 'S9 chip, Double Tap gesture, and brighter Always-On display.',
    categoryHandle: 'apple-accessories',
    status: 'published',
    options: [
      { title: 'Size', values: ['41mm', '45mm'] },
      { title: 'Material', values: ['Aluminum', 'Stainless Steel'] },
    ],
    variants: [
      {
        title: '41mm - Aluminum',
        sku: 'AW9-41-ALU',
        prices: [{ amount: 17999900, currency_code: 'pkr' }],
      },
      {
        title: '45mm - Aluminum',
        sku: 'AW9-45-ALU',
        prices: [{ amount: 19999900, currency_code: 'pkr' }],
      },
      {
        title: '45mm - Stainless Steel',
        sku: 'AW9-45-SS',
        prices: [{ amount: 32999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'MagSafe Charger',
    handle: 'magsafe-charger',
    description:
      'Wireless charger that perfectly aligns with iPhone for faster charging.',
    categoryHandle: 'apple-accessories',
    status: 'published',
    variants: [
      {
        title: 'Default',
        sku: 'MAGSAFE-1M',
        prices: [{ amount: 1799900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // PriceOye > Samsung > Phone
  // ========================================================================
  {
    title: 'Samsung Galaxy S24 Ultra',
    handle: 'samsung-galaxy-s24-ultra',
    description: 'Galaxy AI, 200MP camera, S Pen built-in, and titanium frame.',
    categoryHandle: 'samsung-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['256GB', '512GB', '1TB'] },
      {
        title: 'Color',
        values: ['Titanium Black', 'Titanium Gray', 'Titanium Violet'],
      },
    ],
    variants: [
      {
        title: '256GB - Titanium Black',
        sku: 'S24U-256-BLK',
        prices: [{ amount: 52999900, currency_code: 'pkr' }],
      },
      {
        title: '512GB - Titanium Black',
        sku: 'S24U-512-BLK',
        prices: [{ amount: 59999900, currency_code: 'pkr' }],
      },
      {
        title: '1TB - Titanium Black',
        sku: 'S24U-1TB-BLK',
        prices: [{ amount: 69999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Titanium Gray',
        sku: 'S24U-256-GRY',
        prices: [{ amount: 52999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung Galaxy S24',
    handle: 'samsung-galaxy-s24',
    description: 'Compact flagship with Galaxy AI and 50MP camera.',
    categoryHandle: 'samsung-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['128GB', '256GB'] },
      {
        title: 'Color',
        values: ['Onyx Black', 'Marble Gray', 'Cobalt Violet'],
      },
    ],
    variants: [
      {
        title: '128GB - Onyx Black',
        sku: 'S24-128-BLK',
        prices: [{ amount: 34999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Onyx Black',
        sku: 'S24-256-BLK',
        prices: [{ amount: 39999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Cobalt Violet',
        sku: 'S24-128-VIO',
        prices: [{ amount: 34999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung Galaxy A54 5G',
    handle: 'samsung-galaxy-a54-5g',
    description:
      'Mid-range champion with 5G, Super AMOLED display, and 50MP camera.',
    categoryHandle: 'samsung-phone',
    status: 'published',
    options: [
      { title: 'Storage', values: ['128GB', '256GB'] },
      {
        title: 'Color',
        values: ['Awesome Graphite', 'Awesome Lime', 'Awesome Violet'],
      },
    ],
    variants: [
      {
        title: '128GB - Awesome Graphite',
        sku: 'A54-128-GRP',
        prices: [{ amount: 14999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Awesome Graphite',
        sku: 'A54-256-GRP',
        prices: [{ amount: 17999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Awesome Lime',
        sku: 'A54-128-LIM',
        prices: [{ amount: 14999900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // PriceOye > Samsung > Tablet
  // ========================================================================
  {
    title: 'Samsung Galaxy Tab S9 Ultra',
    handle: 'samsung-galaxy-tab-s9-ultra',
    description:
      '14.6" Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, S Pen included.',
    categoryHandle: 'samsung-tablet',
    status: 'published',
    options: [
      { title: 'Storage', values: ['256GB', '512GB'] },
      { title: 'Connectivity', values: ['WiFi', 'WiFi + 5G'] },
    ],
    variants: [
      {
        title: '256GB - WiFi',
        sku: 'TABS9U-256-WIFI',
        prices: [{ amount: 44999900, currency_code: 'pkr' }],
      },
      {
        title: '512GB - WiFi',
        sku: 'TABS9U-512-WIFI',
        prices: [{ amount: 52999900, currency_code: 'pkr' }],
      },
      {
        title: '256GB - WiFi + 5G',
        sku: 'TABS9U-256-5G',
        prices: [{ amount: 52999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung Galaxy Tab A9+',
    handle: 'samsung-galaxy-tab-a9-plus',
    description: 'Affordable tablet with 11" LCD display and quad speakers.',
    categoryHandle: 'samsung-tablet',
    status: 'published',
    options: [{ title: 'Storage', values: ['64GB', '128GB'] }],
    variants: [
      {
        title: '64GB - WiFi',
        sku: 'TABA9P-64-WIFI',
        prices: [{ amount: 8999900, currency_code: 'pkr' }],
      },
      {
        title: '128GB - WiFi',
        sku: 'TABA9P-128-WIFI',
        prices: [{ amount: 10999900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // PriceOye > Samsung > Accessories
  // ========================================================================
  {
    title: 'Samsung Galaxy Buds2 Pro',
    handle: 'samsung-galaxy-buds2-pro',
    description: 'Hi-Fi sound with 24-bit audio, ANC, and 360 Audio.',
    categoryHandle: 'samsung-accessories',
    status: 'published',
    options: [{ title: 'Color', values: ['Graphite', 'White', 'Bora Purple'] }],
    variants: [
      {
        title: 'Graphite',
        sku: 'BUDS2P-GRP',
        prices: [{ amount: 6999900, currency_code: 'pkr' }],
      },
      {
        title: 'White',
        sku: 'BUDS2P-WHT',
        prices: [{ amount: 6999900, currency_code: 'pkr' }],
      },
      {
        title: 'Bora Purple',
        sku: 'BUDS2P-PRP',
        prices: [{ amount: 6999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung Galaxy Watch 6',
    handle: 'samsung-galaxy-watch-6',
    description:
      'Advanced health monitoring with BioActive Sensor and Wear OS.',
    categoryHandle: 'samsung-accessories',
    status: 'published',
    options: [
      { title: 'Size', values: ['40mm', '44mm'] },
      { title: 'Connectivity', values: ['Bluetooth', 'LTE'] },
    ],
    variants: [
      {
        title: '40mm - Bluetooth',
        sku: 'GW6-40-BT',
        prices: [{ amount: 12999900, currency_code: 'pkr' }],
      },
      {
        title: '44mm - Bluetooth',
        sku: 'GW6-44-BT',
        prices: [{ amount: 14999900, currency_code: 'pkr' }],
      },
      {
        title: '44mm - LTE',
        sku: 'GW6-44-LTE',
        prices: [{ amount: 18999900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung 45W Super Fast Charger',
    handle: 'samsung-45w-charger',
    description: 'Super Fast Charging 2.0 for compatible Galaxy devices.',
    categoryHandle: 'samsung-accessories',
    status: 'published',
    variants: [
      {
        title: 'Default',
        sku: 'SAM-45W-CHG',
        prices: [{ amount: 899900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // Merchantize > Clothing > Men
  // ========================================================================
  {
    title: 'Premium Cotton T-Shirt',
    handle: 'premium-cotton-tshirt-men',
    description: '100% premium cotton t-shirt with comfortable fit.',
    categoryHandle: 'clothing-men',
    status: 'published',
    options: [
      { title: 'Size', values: ['S', 'M', 'L', 'XL', 'XXL'] },
      { title: 'Color', values: ['Black', 'White', 'Navy', 'Gray'] },
    ],
    variants: [
      {
        title: 'M - Black',
        sku: 'TS-M-BLK',
        prices: [{ amount: 149900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Black',
        sku: 'TS-L-BLK',
        prices: [{ amount: 149900, currency_code: 'pkr' }],
      },
      {
        title: 'M - White',
        sku: 'TS-M-WHT',
        prices: [{ amount: 149900, currency_code: 'pkr' }],
      },
      {
        title: 'L - White',
        sku: 'TS-L-WHT',
        prices: [{ amount: 149900, currency_code: 'pkr' }],
      },
      {
        title: 'XL - Navy',
        sku: 'TS-XL-NVY',
        prices: [{ amount: 149900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Slim Fit Denim Jeans',
    handle: 'slim-fit-denim-jeans-men',
    description: 'Classic slim fit jeans with stretch comfort.',
    categoryHandle: 'clothing-men',
    status: 'published',
    options: [
      { title: 'Waist', values: ['30', '32', '34', '36', '38'] },
      { title: 'Color', values: ['Dark Blue', 'Light Blue', 'Black'] },
    ],
    variants: [
      {
        title: '32 - Dark Blue',
        sku: 'JN-32-DBL',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '34 - Dark Blue',
        sku: 'JN-34-DBL',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '32 - Black',
        sku: 'JN-32-BLK',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '36 - Light Blue',
        sku: 'JN-36-LBL',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Leather Bomber Jacket',
    handle: 'leather-bomber-jacket-men',
    description: 'Premium faux leather bomber jacket with quilted lining.',
    categoryHandle: 'clothing-men',
    status: 'published',
    options: [
      { title: 'Size', values: ['M', 'L', 'XL', 'XXL'] },
      { title: 'Color', values: ['Black', 'Brown'] },
    ],
    variants: [
      {
        title: 'M - Black',
        sku: 'LBJ-M-BLK',
        prices: [{ amount: 899900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Black',
        sku: 'LBJ-L-BLK',
        prices: [{ amount: 899900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Brown',
        sku: 'LBJ-L-BRN',
        prices: [{ amount: 899900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // Merchantize > Clothing > Women
  // ========================================================================
  {
    title: 'Floral Summer Dress',
    handle: 'floral-summer-dress-women',
    description: 'Elegant floral print dress perfect for summer occasions.',
    categoryHandle: 'clothing-women',
    status: 'published',
    options: [
      { title: 'Size', values: ['XS', 'S', 'M', 'L', 'XL'] },
      {
        title: 'Color',
        values: ['Blue Floral', 'Pink Floral', 'Yellow Floral'],
      },
    ],
    variants: [
      {
        title: 'S - Blue Floral',
        sku: 'FSD-S-BLU',
        prices: [{ amount: 449900, currency_code: 'pkr' }],
      },
      {
        title: 'M - Blue Floral',
        sku: 'FSD-M-BLU',
        prices: [{ amount: 449900, currency_code: 'pkr' }],
      },
      {
        title: 'M - Pink Floral',
        sku: 'FSD-M-PNK',
        prices: [{ amount: 449900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Yellow Floral',
        sku: 'FSD-L-YLW',
        prices: [{ amount: 449900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Silk Blouse Top',
    handle: 'silk-blouse-top-women',
    description:
      'Luxurious silk blend blouse for professional and casual wear.',
    categoryHandle: 'clothing-women',
    status: 'published',
    options: [
      { title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { title: 'Color', values: ['Cream', 'Blush', 'Navy'] },
    ],
    variants: [
      {
        title: 'S - Cream',
        sku: 'SBT-S-CRM',
        prices: [{ amount: 299900, currency_code: 'pkr' }],
      },
      {
        title: 'M - Cream',
        sku: 'SBT-M-CRM',
        prices: [{ amount: 299900, currency_code: 'pkr' }],
      },
      {
        title: 'M - Blush',
        sku: 'SBT-M-BLS',
        prices: [{ amount: 299900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Navy',
        sku: 'SBT-L-NVY',
        prices: [{ amount: 299900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'High-Waist Palazzo Pants',
    handle: 'high-waist-palazzo-pants-women',
    description: 'Comfortable high-waist palazzo pants with wide leg.',
    categoryHandle: 'clothing-women',
    status: 'published',
    options: [
      { title: 'Size', values: ['S', 'M', 'L', 'XL'] },
      { title: 'Color', values: ['Black', 'Beige', 'Olive'] },
    ],
    variants: [
      {
        title: 'M - Black',
        sku: 'PPT-M-BLK',
        prices: [{ amount: 249900, currency_code: 'pkr' }],
      },
      {
        title: 'L - Black',
        sku: 'PPT-L-BLK',
        prices: [{ amount: 249900, currency_code: 'pkr' }],
      },
      {
        title: 'M - Beige',
        sku: 'PPT-M-BGE',
        prices: [{ amount: 249900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // Merchantize > Footwear > Sports
  // ========================================================================
  {
    title: 'Pro Runner Sports Shoes',
    handle: 'pro-runner-sports-shoes',
    description: 'Lightweight running shoes with responsive cushioning.',
    categoryHandle: 'footwear-sports',
    status: 'published',
    options: [
      { title: 'Size', values: ['40', '41', '42', '43', '44', '45'] },
      { title: 'Color', values: ['Black/Red', 'White/Blue', 'Gray/Green'] },
    ],
    variants: [
      {
        title: '42 - Black/Red',
        sku: 'PRS-42-BR',
        prices: [{ amount: 599900, currency_code: 'pkr' }],
      },
      {
        title: '43 - Black/Red',
        sku: 'PRS-43-BR',
        prices: [{ amount: 599900, currency_code: 'pkr' }],
      },
      {
        title: '42 - White/Blue',
        sku: 'PRS-42-WB',
        prices: [{ amount: 599900, currency_code: 'pkr' }],
      },
      {
        title: '44 - Gray/Green',
        sku: 'PRS-44-GG',
        prices: [{ amount: 599900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'CrossFit Training Shoes',
    handle: 'crossfit-training-shoes',
    description: 'Versatile training shoes for gym and CrossFit workouts.',
    categoryHandle: 'footwear-sports',
    status: 'published',
    options: [
      { title: 'Size', values: ['40', '41', '42', '43', '44'] },
      { title: 'Color', values: ['Black', 'Navy', 'Orange'] },
    ],
    variants: [
      {
        title: '42 - Black',
        sku: 'CFT-42-BLK',
        prices: [{ amount: 699900, currency_code: 'pkr' }],
      },
      {
        title: '43 - Black',
        sku: 'CFT-43-BLK',
        prices: [{ amount: 699900, currency_code: 'pkr' }],
      },
      {
        title: '42 - Navy',
        sku: 'CFT-42-NVY',
        prices: [{ amount: 699900, currency_code: 'pkr' }],
      },
    ],
  },

  // ========================================================================
  // Merchantize > Footwear > Casual
  // ========================================================================
  {
    title: 'Classic Canvas Sneakers',
    handle: 'classic-canvas-sneakers',
    description: 'Timeless canvas sneakers for everyday casual wear.',
    categoryHandle: 'footwear-casual',
    status: 'published',
    options: [
      { title: 'Size', values: ['39', '40', '41', '42', '43', '44'] },
      { title: 'Color', values: ['White', 'Black', 'Navy', 'Red'] },
    ],
    variants: [
      {
        title: '41 - White',
        sku: 'CCS-41-WHT',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '42 - White',
        sku: 'CCS-42-WHT',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '42 - Black',
        sku: 'CCS-42-BLK',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
      {
        title: '43 - Navy',
        sku: 'CCS-43-NVY',
        prices: [{ amount: 349900, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Premium Leather Loafers',
    handle: 'premium-leather-loafers',
    description: 'Handcrafted leather loafers for a sophisticated look.',
    categoryHandle: 'footwear-casual',
    status: 'published',
    options: [
      { title: 'Size', values: ['40', '41', '42', '43', '44'] },
      { title: 'Color', values: ['Brown', 'Black', 'Tan'] },
    ],
    variants: [
      {
        title: '42 - Brown',
        sku: 'PLL-42-BRN',
        prices: [{ amount: 549900, currency_code: 'pkr' }],
      },
      {
        title: '43 - Brown',
        sku: 'PLL-43-BRN',
        prices: [{ amount: 549900, currency_code: 'pkr' }],
      },
      {
        title: '42 - Black',
        sku: 'PLL-42-BLK',
        prices: [{ amount: 549900, currency_code: 'pkr' }],
      },
      {
        title: '44 - Tan',
        sku: 'PLL-44-TAN',
        prices: [{ amount: 549900, currency_code: 'pkr' }],
      },
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

interface CategoryMap {
  [handle: string]: string;
}

async function createCategoriesRecursive(
  container: ExecArgs['container'],
  categories: CategoryConfig[],
  parentId: string | null,
  categoryMap: CategoryMap,
  logger: any,
): Promise<void> {
  for (const category of categories) {
    try {
      const { result } = await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: [
            {
              name: category.name,
              handle: category.handle,
              description: category.description,
              is_active: category.is_active ?? true,
              is_internal: category.is_internal ?? false,
              parent_category_id: parentId,
            },
          ],
        },
      });

      const createdCategory = result[0];
      categoryMap[category.handle] = createdCategory.id;

      const indent = parentId ? '  ' : '';
      logger.info(
        `${indent}✓ Created category: ${category.name} (${createdCategory.id})`,
      );

      if (category.children && category.children.length > 0) {
        await createCategoriesRecursive(
          container,
          category.children,
          createdCategory.id,
          categoryMap,
          logger,
        );
      }
    } catch (error) {
      logger.warn(
        `⚠ Could not create category ${category.name}: ${(error as Error).message}`,
      );
    }
  }
}

// ============================================================================
// Main Configuration Function
// ============================================================================

export default async function categoryProductConfiguration({
  container,
}: ExecArgs) {
  const logger = container.resolve('logger');

  logger.info('='.repeat(60));
  logger.info('Starting Category & Product Configuration');
  logger.info('='.repeat(60));

  try {
    // ========================================================================
    // Step 1: Get Store and Sales Channel
    // ========================================================================
    logger.info('\n[Step 1] Getting store configuration...');

    const storeModule = container.resolve('store');
    const stores = await storeModule.listStores();

    if (!stores.length) {
      throw new Error(
        'No store found. Please run store-configuration.ts first.',
      );
    }

    const store = stores[0];
    const salesChannelId = store.default_sales_channel_id;

    if (!salesChannelId) {
      throw new Error('No default sales channel found.');
    }

    logger.info(`✓ Store: ${store.name}`);
    logger.info(`✓ Sales Channel: ${salesChannelId}`);

    // ========================================================================
    // Step 2: Get or Create Categories
    // ========================================================================
    logger.info('\n[Step 2] Getting/Creating categories...');

    const categoryMap: CategoryMap = {};

    // First, fetch all existing categories and build the map
    const query = container.resolve('query') as any;
    const { data: existingCategories } = await query.graph({
      entity: 'product_category',
      fields: ['id', 'name', 'handle'],
    });

    for (const cat of existingCategories) {
      categoryMap[cat.handle] = cat.id;
      logger.info(`✓ Found existing category: ${cat.name} (${cat.handle})`);
    }

    // Only create categories that don't exist
    if (Object.keys(categoryMap).length === 0) {
      await createCategoriesRecursive(
        container,
        CATEGORIES,
        null,
        categoryMap,
        logger,
      );
    }

    logger.info(
      `\n✓ Total categories available: ${Object.keys(categoryMap).length}`,
    );

    // ========================================================================
    // Step 3: Get Shipping Profile
    // ========================================================================
    logger.info('\n[Step 3] Getting shipping profile...');

    const fulfillmentModule = container.resolve('fulfillment');
    const shippingProfiles = await fulfillmentModule.listShippingProfiles();

    if (!shippingProfiles.length) {
      throw new Error(
        'No shipping profile found. Please run store-configuration.ts first.',
      );
    }

    const shippingProfileId = shippingProfiles[0].id;
    logger.info(`✓ Shipping Profile: ${shippingProfileId}`);

    // ========================================================================
    // Step 4: Create Products
    // ========================================================================
    logger.info('\n[Step 4] Creating products...');

    let createdCount = 0;
    let skippedCount = 0;

    for (const product of PRODUCTS) {
      const categoryId = categoryMap[product.categoryHandle];

      if (!categoryId) {
        logger.warn(
          `⚠ Category not found for product ${product.title}: ${product.categoryHandle}`,
        );
        skippedCount++;
        continue;
      }

      try {
        // For products without options, create simple variant
        if (!product.options || product.options.length === 0) {
          const productData: any = {
            title: product.title,
            handle: product.handle,
            description: product.description,
            status: product.status,
            categories: [{ id: categoryId }],
            sales_channels: [{ id: salesChannelId }],
            shipping_profile_id: shippingProfileId,
            variants: product.variants.map((v) => ({
              title: v.title,
              sku: v.sku,
              manage_inventory: true,
              prices: v.prices,
            })),
          };

          await createProductsWorkflow(container).run({
            input: {
              products: [productData],
            },
          });
        } else {
          // For products with options, we need to map variant options correctly
          const productData: any = {
            title: product.title,
            handle: product.handle,
            description: product.description,
            status: product.status,
            categories: [{ id: categoryId }],
            sales_channels: [{ id: salesChannelId }],
            shipping_profile_id: shippingProfileId,
            options: product.options.map((opt) => ({
              title: opt.title,
              values: opt.values,
            })),
            variants: product.variants.map((v) => {
              // Parse variant title to extract option values
              // Format: "256GB - Natural Titanium" or "M - Black"
              const titleParts = v.title.split(' - ');
              const optionValues: Record<string, string> = {};

              product.options!.forEach((opt, index) => {
                if (titleParts[index]) {
                  optionValues[opt.title] = titleParts[index].trim();
                }
              });

              return {
                title: v.title,
                sku: v.sku,
                manage_inventory: true,
                prices: v.prices,
                options: optionValues,
              };
            }),
          };

          await createProductsWorkflow(container).run({
            input: {
              products: [productData],
            },
          });
        }

        logger.info(`✓ Created product: ${product.title}`);
        createdCount++;
      } catch (error) {
        logger.warn(
          `⚠ Could not create product ${product.title}: ${(error as Error).message}`,
        );
        skippedCount++;
      }
    }

    // ========================================================================
    // Summary
    // ========================================================================
    logger.info('\n' + '='.repeat(60));
    logger.info('CATEGORY & PRODUCT CONFIGURATION COMPLETE');
    logger.info('='.repeat(60));
    logger.info(`
Categories Created: ${Object.keys(categoryMap).length}
Products Created:   ${createdCount}
Products Skipped:   ${skippedCount}

Category Structure:
├── PriceOye
│   ├── Apple
│   │   ├── Phone (3 products)
│   │   ├── Mac (3 products)
│   │   └── Accessories (3 products)
│   └── Samsung
│       ├── Phone (3 products)
│       ├── Tablet (2 products)
│       └── Accessories (3 products)
│
└── Merchantize
    ├── Clothing
    │   ├── Men (3 products)
    │   └── Women (3 products)
    └── Footwear
        ├── Sports (2 products)
        └── Casual (2 products)
`);

    logger.info('='.repeat(60));
    logger.info('Next Steps:');
    logger.info('1. Set inventory levels at stock locations');
    logger.info('2. Add product images via admin dashboard');
    logger.info('3. Review and adjust prices as needed');
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Category & Product configuration failed:', error as Error);
    throw error;
  }
}
