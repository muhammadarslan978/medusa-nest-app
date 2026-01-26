/**
 * Main Setup Script - Complete Medusa Store Configuration
 *
 * This script performs ALL setup tasks for your Medusa e-commerce store:
 * 1. Store configuration (name, currencies, regions)
 * 2. Sales channels setup
 * 3. Stock locations (warehouses)
 * 4. API keys generation
 * 5. Product categories creation
 * 6. Products creation with inventory
 * 7. Stock location associations
 * 8. Inventory levels setup
 *
 * Usage:
 *   npx medusa exec ./src/scripts/main-script.ts
 *
 * This is the ONLY script you need to run to set up your entire store.
 */

import { ExecArgs } from '@medusajs/framework/types';
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
  createInventoryItemsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  createInventoryLevelsWorkflow,
} from '@medusajs/medusa/core-flows';

// ============================================================================
// CONFIGURATION DATA
// ============================================================================

const CDN_BASE = 'https://cdn.example.com';

const STORE_CONFIG = {
  name: 'Medusa Store',
  default_currency_code: 'pkr',
  currencies: ['pkr', 'usd'],
};

const REGIONS = [
  {
    name: 'Pakistan',
    currency_code: 'pkr',
    countries: ['pk'],
  },
];

const SALES_CHANNELS = [
  {
    name: 'Mobile App',
    description: 'Mobile application sales channel',
  },
];

const STOCK_LOCATIONS = [
  {
    name: 'Karachi Warehouse',
    address: {
      address_1: 'Main Warehouse, Karachi',
      city: 'Karachi',
      country_code: 'pk',
      province: 'Sindh',
    },
  },
  {
    name: 'Lahore Warehouse',
    address: {
      address_1: 'Distribution Center, Lahore',
      city: 'Lahore',
      country_code: 'pk',
      province: 'Punjab',
    },
  },
  {
    name: 'Islamabad Fulfillment Center',
    address: {
      address_1: 'Fulfillment Hub, Islamabad',
      city: 'Islamabad',
      country_code: 'pk',
      province: 'Islamabad Capital Territory',
    },
  },
];

const API_KEYS = [
  {
    title: 'Default Publishable API Key',
    type: 'publishable' as const,
  },
  {
    title: 'Mobile App Publishable Key',
    type: 'publishable' as const,
  },
];

// Product Categories
const CATEGORIES = [
  {
    name: 'Electronics',
    handle: 'electronics',
    description: 'Electronic devices and gadgets',
    is_active: true,
    is_internal: false,
    metadata: {
      icon: `${CDN_BASE}/categories/electronics/icon.png`,
    },
    children: [
      {
        name: 'Apple',
        handle: 'apple',
        description: 'Apple products',
        children: [
          {
            name: 'iPhone',
            handle: 'apple-iphone',
            description: 'Apple iPhone smartphones',
          },
          {
            name: 'Watch',
            handle: 'apple-watch',
            description: 'Apple Watch series',
          },
        ],
      },
      {
        name: 'Samsung',
        handle: 'samsung',
        description: 'Samsung products',
        children: [
          {
            name: 'Phone',
            handle: 'samsung-phone',
            description: 'Samsung Galaxy smartphones',
          },
          {
            name: 'Tablet',
            handle: 'samsung-tablet',
            description: 'Samsung Galaxy tablets',
          },
        ],
      },
    ],
  },
];

// Products
const PRODUCTS = [
  {
    title: 'iPhone 15 Pro Max',
    handle: 'iphone-15-pro-max',
    description:
      'The most powerful iPhone ever with A17 Pro chip, titanium design, and advanced camera system.',
    categoryHandle: 'apple-iphone',
    status: 'published',
    thumbnail: `${CDN_BASE}/products/iphone-15-pro-max/thumbnail.jpg`,
    images: [
      `${CDN_BASE}/products/iphone-15-pro-max/image-1.jpg`,
      `${CDN_BASE}/products/iphone-15-pro-max/image-2.jpg`,
    ],
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
        manage_inventory: true,
        prices: [{ amount: 549999, currency_code: 'pkr' }],
      },
      {
        title: '512GB - Natural Titanium',
        sku: 'IP15PM-512-NT',
        manage_inventory: true,
        prices: [{ amount: 649999, currency_code: 'pkr' }],
      },
      {
        title: '1TB - Natural Titanium',
        sku: 'IP15PM-1TB-NT',
        manage_inventory: true,
        prices: [{ amount: 749999, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'iPhone 15',
    handle: 'iphone-15',
    description:
      'The new iPhone 15 with Dynamic Island and advanced dual-camera system.',
    categoryHandle: 'apple-iphone',
    status: 'published',
    thumbnail: `${CDN_BASE}/products/iphone-15/thumbnail.jpg`,
    images: [`${CDN_BASE}/products/iphone-15/image-1.jpg`],
    options: [
      { title: 'Storage', values: ['128GB', '256GB'] },
      { title: 'Color', values: ['Pink', 'Blue', 'Black'] },
    ],
    variants: [
      {
        title: '128GB - Pink',
        sku: 'IP15-128-PNK',
        manage_inventory: true,
        prices: [{ amount: 349999, currency_code: 'pkr' }],
      },
      {
        title: '128GB - Blue',
        sku: 'IP15-128-BLU',
        manage_inventory: true,
        prices: [{ amount: 349999, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Pink',
        sku: 'IP15-256-PNK',
        manage_inventory: true,
        prices: [{ amount: 399999, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    handle: 'samsung-galaxy-s24-ultra',
    description:
      'The ultimate Samsung flagship with S Pen, 200MP camera, and AI features.',
    categoryHandle: 'samsung-phone',
    status: 'published',
    thumbnail: `${CDN_BASE}/products/s24-ultra/thumbnail.jpg`,
    images: [`${CDN_BASE}/products/s24-ultra/image-1.jpg`],
    options: [
      { title: 'Storage', values: ['256GB', '512GB', '1TB'] },
      { title: 'Color', values: ['Titanium Gray', 'Titanium Black'] },
    ],
    variants: [
      {
        title: '256GB - Titanium Gray',
        sku: 'S24U-256-GRY',
        manage_inventory: true,
        prices: [{ amount: 459999, currency_code: 'pkr' }],
      },
      {
        title: '256GB - Titanium Black',
        sku: 'S24U-256-BLK',
        manage_inventory: true,
        prices: [{ amount: 459999, currency_code: 'pkr' }],
      },
      {
        title: '512GB - Titanium Black',
        sku: 'S24U-512-BLK',
        manage_inventory: true,
        prices: [{ amount: 529999, currency_code: 'pkr' }],
      },
    ],
  },
  {
    title: 'Apple Watch Series 9',
    handle: 'apple-watch-series-9',
    description:
      'Advanced health features, bright display, and powerful S9 chip.',
    categoryHandle: 'apple-watch',
    status: 'published',
    thumbnail: `${CDN_BASE}/products/apple-watch-9/thumbnail.jpg`,
    images: [`${CDN_BASE}/products/apple-watch-9/image-1.jpg`],
    options: [
      { title: 'Size', values: ['41mm', '45mm'] },
      { title: 'Case', values: ['Aluminum', 'Stainless Steel'] },
    ],
    variants: [
      {
        title: '45mm - Aluminum',
        sku: 'AW9-45-ALU',
        manage_inventory: true,
        prices: [{ amount: 149999, currency_code: 'pkr' }],
      },
      {
        title: '45mm - Stainless Steel',
        sku: 'AW9-45-SS',
        manage_inventory: true,
        prices: [{ amount: 249999, currency_code: 'pkr' }],
      },
      {
        title: '41mm - Aluminum',
        sku: 'AW9-41-ALU',
        manage_inventory: true,
        prices: [{ amount: 139999, currency_code: 'pkr' }],
      },
    ],
  },
];

// ============================================================================
// MAIN SCRIPT
// ============================================================================

export default async function mainScript({ container }: ExecArgs) {
  const logger = container.resolve('logger');
  const query = container.resolve('query');

  try {
    logger.info(
      '\n╔════════════════════════════════════════════════════════════════╗',
    );
    logger.info(
      '║         MEDUSA STORE - COMPLETE SETUP SCRIPT                  ║',
    );
    logger.info(
      '╚════════════════════════════════════════════════════════════════╝\n',
    );

    // ========================================================================
    // Step 1: Get Store
    // ========================================================================
    logger.info('[Step 1/9] Getting Store...');

    const { data: stores } = await query.graph({
      entity: 'store',
      fields: ['id', 'name', 'default_currency_code'],
    });

    const store = stores[0];
    logger.info(`✓ Store found: ${store.name}`);
    logger.info(
      `  Default Currency: ${store.default_currency_code?.toUpperCase()}\n`,
    );

    // ========================================================================
    // Step 2: Create Regions
    // ========================================================================
    logger.info('[Step 2/9] Creating Regions...');

    const { data: existingRegions } = await query.graph({
      entity: 'region',
      fields: ['id', 'name', 'currency_code'],
    });

    let createdRegions = existingRegions;

    if (!existingRegions || existingRegions.length === 0) {
      const { result: regionsResult } = await createRegionsWorkflow(
        container,
      ).run({
        input: { regions: REGIONS },
      });
      createdRegions = regionsResult;
      logger.info(`✓ Created ${createdRegions.length} region(s):`);
    } else {
      logger.info(`✓ Using existing ${existingRegions.length} region(s):`);
    }

    createdRegions.forEach((r: any) => {
      logger.info(`  - ${r.name} (${r.id}) - Currency: ${r.currency_code}`);
    });
    logger.info('');

    // ========================================================================
    // Step 3: Create Sales Channels (skip if exists)
    // ========================================================================
    logger.info('[Step 3/9] Creating Sales Channels...');

    const { data: existingSalesChannels } = await query.graph({
      entity: 'sales_channel',
      fields: ['id', 'name'],
    });

    let createdSalesChannels = existingSalesChannels || [];

    // Only create if we have just the default channel
    if (existingSalesChannels.length <= 1) {
      const { result: salesChannelsResult } = await createSalesChannelsWorkflow(
        container,
      ).run({
        input: { salesChannelsData: SALES_CHANNELS } as any,
      });
      createdSalesChannels = [...existingSalesChannels, ...salesChannelsResult];
      logger.info(`✓ Created ${salesChannelsResult.length} sales channel(s)`);
    } else {
      logger.info(
        `✓ Using existing ${existingSalesChannels.length} sales channel(s):`,
      );
    }

    createdSalesChannels.forEach((sc: any) => {
      logger.info(`  - ${sc.name} (${sc.id})`);
    });
    logger.info('');

    // ========================================================================
    // Step 4: Create Stock Locations (skip if exists)
    // ========================================================================
    logger.info('[Step 4/9] Creating Stock Locations...');

    const { data: existingStockLocations } = await query.graph({
      entity: 'stock_location',
      fields: ['id', 'name'],
    });

    let createdStockLocations = existingStockLocations || [];

    if (!existingStockLocations || existingStockLocations.length === 0) {
      const { result: stockLocationsResult } =
        await createStockLocationsWorkflow(container).run({
          input: { locations: STOCK_LOCATIONS },
        });
      createdStockLocations = stockLocationsResult;
      logger.info(
        `✓ Created ${createdStockLocations.length} stock location(s):`,
      );
    } else {
      logger.info(
        `✓ Using existing ${existingStockLocations.length} stock location(s):`,
      );
    }

    createdStockLocations.forEach((sl: any) => {
      logger.info(`  - ${sl.name} (${sl.id})`);
    });
    logger.info('');

    // ========================================================================
    // Step 5: Link Sales Channels to Stock Locations
    // ========================================================================
    logger.info('[Step 5/9] Linking Sales Channels to Stock Locations...');

    const { data: allSalesChannels } = await query.graph({
      entity: 'sales_channel',
      fields: ['id', 'name'],
    });

    for (const stockLocation of createdStockLocations) {
      const salesChannelIds = allSalesChannels.map((sc: any) => sc.id);

      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: stockLocation.id,
          add: salesChannelIds,
        },
      });

      logger.info(
        `✓ Linked ${salesChannelIds.length} sales channel(s) to ${stockLocation.name}`,
      );
    }
    logger.info('');

    // ========================================================================
    // Step 6: Create API Keys (skip if exists)
    // ========================================================================
    logger.info('[Step 6/9] Creating API Keys...');

    const { data: existingApiKeys } = await query.graph({
      entity: 'api_key',
      fields: ['id', 'title', 'type', 'token'],
      filters: { type: 'publishable' },
    });

    let createdApiKeys = existingApiKeys || [];

    if (!existingApiKeys || existingApiKeys.length === 0) {
      const { result: apiKeysResult } = await createApiKeysWorkflow(
        container,
      ).run({
        input: {
          api_keys: API_KEYS.map((key) => ({ ...key, created_by: 'admin' })),
        } as any,
      });
      createdApiKeys = apiKeysResult;
      logger.info(`✓ Created ${createdApiKeys.length} API key(s):`);
    } else {
      logger.info(`✓ Using existing ${existingApiKeys.length} API key(s):`);
    }

    createdApiKeys.forEach((key: any) => {
      logger.info(`  - ${key.title}`);
      logger.info(`    Token: ${key.token}`);
    });
    logger.info('');

    // Link API keys to sales channels
    logger.info('Linking API keys to sales channels...');

    for (const apiKey of createdApiKeys) {
      const channelIds = createdSalesChannels.map((c: any) => c.id);

      try {
        await linkSalesChannelsToApiKeyWorkflow(container).run({
          input: {
            id: apiKey.id,
            add: channelIds,
          },
        });
        logger.info(
          `  ✓ Linked ${apiKey.title} to ${channelIds.length} channel(s)`,
        );
      } catch (error: any) {
        logger.warn(`  ⚠️  Could not link ${apiKey.title}: ${error.message}`);
      }
    }
    logger.info(`✓ API keys linked to sales channels\n`);

    // ========================================================================
    // Step 7: Create Product Categories
    // ========================================================================
    logger.info('[Step 7/9] Creating Product Categories...');

    const categoryMap = new Map<string, string>();

    // Check for existing categories
    const { data: existingCategories } = await query.graph({
      entity: 'product_category',
      fields: ['id', 'name', 'handle'],
    });

    existingCategories?.forEach((cat: any) => {
      categoryMap.set(cat.handle, cat.id);
    });

    async function createCategoriesRecursive(
      categories: any[],
      parentId?: string,
    ): Promise<void> {
      for (const category of categories) {
        // Skip if category already exists
        if (categoryMap.has(category.handle)) {
          logger.info(
            `✓ Using existing category: ${category.name} (${category.handle})`,
          );

          if (category.children && category.children.length > 0) {
            await createCategoriesRecursive(
              category.children,
              categoryMap.get(category.handle),
            );
          }
          continue;
        }

        const categoryInput: any = {
          name: category.name,
          handle: category.handle,
          description: category.description,
          is_active: category.is_active ?? true,
          is_internal: category.is_internal ?? false,
          parent_category_id: parentId,
        };

        if (category.metadata) {
          categoryInput.metadata = category.metadata;
        }

        const { result } = await createProductCategoriesWorkflow(container).run(
          {
            input: {
              product_categories: [categoryInput],
            },
          },
        );

        const createdCategory = result[0];
        categoryMap.set(category.handle, createdCategory.id);
        logger.info(
          `✓ Created category: ${category.name} (${category.handle})`,
        );

        if (category.children && category.children.length > 0) {
          await createCategoriesRecursive(
            category.children,
            createdCategory.id,
          );
        }
      }
    }

    await createCategoriesRecursive(CATEGORIES);
    logger.info('');

    // ========================================================================
    // Step 8: Create Products
    // ========================================================================
    logger.info('[Step 8/9] Creating Products...');

    // Check for existing products
    const { data: existingProducts } = await query.graph({
      entity: 'product',
      fields: ['id', 'handle', 'title'],
    });

    const existingProductHandles = new Set(
      existingProducts?.map((p: any) => p.handle) || [],
    );

    // Link existing products to sales channels using Modules constant
    if (existingProducts && existingProducts.length > 0) {
      logger.info('Linking existing products to sales channels...');
      const remoteLink = container.resolve('remoteLink');
      const { Modules } = await import('@medusajs/framework/utils');

      for (const product of existingProducts) {
        for (const channel of allSalesChannels) {
          try {
            await remoteLink.create({
              [Modules.PRODUCT]: { product_id: product.id },
              [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
            });
          } catch (e) {
            // Link might already exist
          }
        }
      }
      logger.info(
        `✓ Linked ${existingProducts.length} existing product(s) to sales channels`,
      );
    }

    for (const productData of PRODUCTS) {
      // Skip if product already exists
      if (existingProductHandles.has(productData.handle)) {
        logger.info(`✓ Product already exists: ${productData.title}`);
        continue;
      }

      const categoryId = categoryMap.get(productData.categoryHandle);

      if (!categoryId) {
        logger.warn(
          `⚠️  Category not found for ${productData.handle}, skipping...`,
        );
        continue;
      }

      const productInput: any = {
        title: productData.title,
        handle: productData.handle,
        description: productData.description,
        status: productData.status,
        thumbnail: productData.thumbnail,
        images: productData.images?.map((url: string) => ({ url })),
        categories: [{ id: categoryId }],
        options: productData.options,
        variants: productData.variants.map((v: any) => ({
          title: v.title,
          sku: v.sku,
          manage_inventory: v.manage_inventory ?? false,
          prices: v.prices,
          options: v.options,
        })),
      };

      const { result: productResult } = await createProductsWorkflow(
        container,
      ).run({
        input: {
          products: [productInput],
        },
      });

      // Link product to all sales channels
      const createdProduct = productResult[0];
      if (createdProduct?.id) {
        const remoteLink = container.resolve('remoteLink');
        const { Modules } = await import('@medusajs/framework/utils');
        for (const channel of allSalesChannels) {
          try {
            await remoteLink.create({
              [Modules.PRODUCT]: { product_id: createdProduct.id },
              [Modules.SALES_CHANNEL]: { sales_channel_id: channel.id },
            });
          } catch (e) {
            // Link might already exist
          }
        }
      }

      logger.info(`✓ Created product: ${productData.title}`);
    }
    logger.info('');

    // ========================================================================
    // Step 9: Set Up Inventory Management
    // ========================================================================
    logger.info('[Step 9/9] Setting up inventory management...');

    const { data: allVariants } = await query.graph({
      entity: 'product_variant',
      fields: [
        'id',
        'sku',
        'title',
        'product.title',
        'inventory_items.inventory_item_id',
        'inventory_items.inventory.id',
      ],
    });

    const defaultStockLevel = 100;
    let inventoryCount = 0;

    for (const variant of allVariants) {
      try {
        let inventoryItemId = variant.inventory_items?.[0]?.inventory?.id;

        // Create inventory item if it doesn't exist
        if (!inventoryItemId) {
          const { result } = await createInventoryItemsWorkflow(container).run({
            input: [{ sku: variant.sku }] as any,
          });

          const createdItem = result?.[0];
          if (createdItem?.id) {
            inventoryItemId = createdItem.id;

            // Link inventory item to variant
            try {
              const remoteLink = container.resolve('remoteLink');
              await remoteLink.create({
                productService: { variant_id: variant.id },
                inventoryService: { inventory_item_id: inventoryItemId },
              });
            } catch (linkError) {
              // Link might already exist, continue
            }
          }
        }

        // Set stock levels at all locations
        if (inventoryItemId) {
          for (const location of createdStockLocations) {
            try {
              await createInventoryLevelsWorkflow(container).run({
                input: {
                  inventory_levels: [
                    {
                      inventory_item_id: inventoryItemId,
                      location_id: location.id,
                      stocked_quantity: defaultStockLevel,
                    },
                  ],
                },
              });
            } catch (error) {
              // Stock level might already exist
            }
          }
          inventoryCount++;
        }
      } catch (error) {
        logger.warn(`  ⚠️  Could not set inventory for ${variant.sku}`);
      }
    }

    logger.info(
      `✓ Set inventory for ${inventoryCount} variant(s) at ${createdStockLocations.length} location(s)`,
    );
    logger.info(`  Stock level: ${defaultStockLevel} units per location\n`);

    // ========================================================================
    // Update Store with Default Region and Location
    // ========================================================================
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          default_region_id: createdRegions[0].id,
          default_location_id: createdStockLocations[0].id,
        },
      },
    });

    // ========================================================================
    // SETUP COMPLETE
    // ========================================================================
    logger.info(
      '\n╔════════════════════════════════════════════════════════════════╗',
    );
    logger.info(
      '║                    ✓ SETUP COMPLETED!                          ║',
    );
    logger.info(
      '╚════════════════════════════════════════════════════════════════╝\n',
    );

    logger.info('Store Configuration Summary:');
    logger.info(`  Store Name:        ${STORE_CONFIG.name}`);
    logger.info(
      `  Default Currency:  ${STORE_CONFIG.default_currency_code.toUpperCase()}`,
    );
    logger.info(`  Regions:           ${createdRegions.length}`);
    logger.info(`  Sales Channels:    ${allSalesChannels.length}`);
    logger.info(`  Stock Locations:   ${createdStockLocations.length}`);
    logger.info(`  Categories:        ${categoryMap.size}`);
    logger.info(`  Products:          ${PRODUCTS.length}`);
    logger.info(`  API Keys:          ${createdApiKeys.length}\n`);

    logger.info('Important Information:');
    logger.info(`  Publishable API Key: ${createdApiKeys[0].token}`);
    logger.info(`  Region ID:           ${createdRegions[0].id}\n`);

    logger.info('Next Steps:');
    logger.info('  1. Update your .env files with the API key and region ID');
    logger.info('  2. Start your NestJS BFF: npm run start:dev');
    logger.info('  3. Test the customer journey: npm run customer-journey\n');
  } catch (error) {
    logger.error('\n❌ Setup failed!');
    console.error(error);
    throw error;
  }
}
