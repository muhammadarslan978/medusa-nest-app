/**
 * Store Configuration Script for Pakistan
 *
 * This script sets up the complete store configuration including:
 * - Store name and settings
 * - Currencies (PKR as default)
 * - Sales channels
 * - Regions (Pakistan)
 * - Stock locations (warehouses in Pakistan)
 * - Shipping options
 * - API keys for storefronts
 *
 * Usage:
 *   npx medusa exec ./src/scripts/store-configuration.ts
 */

import { ExecArgs } from '@medusajs/framework/types';
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from '@medusajs/medusa/core-flows';

// ============================================================================
// Configuration Constants for Pakistan
// ============================================================================

const STORE_CONFIG = {
  name: 'Rox Store Pakistan',
  defaultCurrency: 'pkr',
};

const CURRENCIES = [
  { code: 'pkr', name: 'Pakistani Rupee' },
  { code: 'usd', name: 'US Dollar' },
];

const SALES_CHANNELS = [
  {
    name: 'Mobile App',
    description: 'iOS and Android mobile application',
    is_disabled: false,
  },
];

const REGIONS = [
  {
    name: 'Pakistan',
    currency_code: 'pkr',
    countries: ['pk'],
    automatic_taxes: true,
    is_tax_inclusive: true,
  },
];

const STOCK_LOCATIONS = [
  {
    name: 'Lahore Warehouse',
    address: {
      address_1: 'Plot 123, Industrial Area',
      address_2: 'Near Thokar Niaz Baig',
      city: 'Lahore',
      country_code: 'pk',
      province: 'Punjab',
      postal_code: '54000',
      phone: '+92-42-35761234',
    },
  },
  {
    name: 'Karachi Warehouse',
    address: {
      address_1: 'Block 7, SITE Industrial Area',
      address_2: 'Near Port Qasim',
      city: 'Karachi',
      country_code: 'pk',
      province: 'Sindh',
      postal_code: '75500',
      phone: '+92-21-32456789',
    },
  },
  {
    name: 'Islamabad Fulfillment Center',
    address: {
      address_1: 'I-9 Industrial Area',
      address_2: 'Sector I-9/3',
      city: 'Islamabad',
      country_code: 'pk',
      province: 'Islamabad Capital Territory',
      postal_code: '44000',
      phone: '+92-51-2876543',
    },
  },
];

const SHIPPING_OPTIONS = [
  {
    name: 'Standard Delivery',
    price: 25000, // PKR 250.00 (in cents/paisa)
    is_return: false,
  },
  {
    name: 'Express Delivery',
    price: 50000, // PKR 500.00
    is_return: false,
  },
  {
    name: 'Same Day Delivery',
    price: 100000, // PKR 1000.00
    is_return: false,
  },
  {
    name: 'Free Shipping (Orders above PKR 5000)',
    price: 0,
    is_return: false,
  },
];

const API_KEYS = [
  {
    title: 'Mobile App Publishable Key',
    type: 'publishable' as const,
    created_by: 'system',
  },
];

// ============================================================================
// Main Configuration Function
// ============================================================================

export default async function storeConfiguration({ container }: ExecArgs) {
  const logger = container.resolve('logger');

  logger.info('='.repeat(60));
  logger.info('Starting Store Configuration for Pakistan');
  logger.info('='.repeat(60));

  try {
    // ========================================================================
    // Step 1: Get existing store
    // ========================================================================
    logger.info('\n[Step 1] Getting existing store...');

    const storeModule = container.resolve('store');
    const stores = await storeModule.listStores();

    if (!stores.length) {
      throw new Error('No store found. Please run migrations first.');
    }

    const store = stores[0];
    logger.info(`Found store: ${store.id}`);

    // ========================================================================
    // Step 2: Update store name and add currencies
    // ========================================================================
    logger.info('\n[Step 2] Updating store settings...');

    const supportedCurrencies = CURRENCIES.map((c, index) => ({
      currency_code: c.code,
      is_default: index === 0, // First currency (PKR) is default
    }));

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          name: STORE_CONFIG.name,
          supported_currencies: supportedCurrencies,
        },
      },
    });

    logger.info(`✓ Store updated: ${STORE_CONFIG.name}`);
    logger.info(
      `✓ Currencies added: ${CURRENCIES.map((c) => c.code).join(', ')}`,
    );

    // ========================================================================
    // Step 3: Create Sales Channels
    // ========================================================================
    logger.info('\n[Step 3] Creating sales channels...');

    const { result: salesChannelsResult } = await createSalesChannelsWorkflow(
      container,
    ).run({
      input: {
        salesChannelsData: SALES_CHANNELS,
      },
    });

    const createdSalesChannels = salesChannelsResult;
    logger.info(`✓ Created ${createdSalesChannels.length} sales channels:`);
    createdSalesChannels.forEach((sc) => {
      logger.info(`  - ${sc.name} (${sc.id})`);
    });

    // Get default sales channel
    const defaultSalesChannel = store.default_sales_channel_id
      ? { id: store.default_sales_channel_id }
      : createdSalesChannels[0];

    // ========================================================================
    // Step 4: Create Regions
    // ========================================================================
    logger.info('\n[Step 4] Creating regions...');

    const { result: regionsResult } = await createRegionsWorkflow(
      container,
    ).run({
      input: {
        regions: REGIONS,
      },
    });

    const createdRegions = regionsResult;
    logger.info(`✓ Created ${createdRegions.length} regions:`);
    createdRegions.forEach((r) => {
      logger.info(`  - ${r.name} (${r.id}) - Currency: ${r.currency_code}`);
    });

    // ========================================================================
    // Step 5: Create Stock Locations
    // ========================================================================
    logger.info('\n[Step 5] Creating stock locations...');

    const { result: stockLocationsResult } = await createStockLocationsWorkflow(
      container,
    ).run({
      input: {
        locations: STOCK_LOCATIONS,
      },
    });

    const createdStockLocations = stockLocationsResult;
    logger.info(`✓ Created ${createdStockLocations.length} stock locations:`);
    createdStockLocations.forEach((loc) => {
      logger.info(`  - ${loc.name} (${loc.id})`);
    });

    // ========================================================================
    // Step 6: Link Stock Locations to Sales Channels
    // ========================================================================
    logger.info('\n[Step 6] Linking stock locations to sales channels...');

    const allSalesChannelIds = [
      defaultSalesChannel.id,
      ...createdSalesChannels.map((sc) => sc.id),
    ].filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates

    for (const location of createdStockLocations) {
      await linkSalesChannelsToStockLocationWorkflow(container).run({
        input: {
          id: location.id,
          add: allSalesChannelIds,
        },
      });
      logger.info(
        `✓ Linked ${location.name} to ${allSalesChannelIds.length} sales channels`,
      );
    }

    // ========================================================================
    // Step 7: Create Shipping Profile and Options
    // ========================================================================
    logger.info('\n[Step 7] Setting up shipping...');

    // Get or create shipping profile
    const fulfillmentModule = container.resolve('fulfillment');

    let shippingProfiles = await fulfillmentModule.listShippingProfiles();
    let shippingProfile = shippingProfiles[0];

    if (!shippingProfile) {
      const [createdProfile] = await fulfillmentModule.createShippingProfiles([
        {
          name: 'Default Shipping Profile',
          type: 'default',
        },
      ]);
      shippingProfile = createdProfile;
      logger.info(`✓ Created shipping profile: ${shippingProfile.id}`);
    } else {
      logger.info(`✓ Using existing shipping profile: ${shippingProfile.id}`);
    }

    // Get fulfillment providers
    const fulfillmentProviders =
      await fulfillmentModule.listFulfillmentProviders();
    const manualProvider =
      fulfillmentProviders.find((p) => p.id.includes('manual')) ||
      fulfillmentProviders[0];

    if (!manualProvider) {
      logger.warn(
        '⚠ No fulfillment provider found. Skipping shipping options.',
      );
    } else {
      // Get service zones or create fulfillment set
      let fulfillmentSets = await fulfillmentModule.listFulfillmentSets();
      let fulfillmentSet = fulfillmentSets[0];

      if (!fulfillmentSet) {
        const [createdSet] = await fulfillmentModule.createFulfillmentSets([
          {
            name: 'Pakistan Fulfillment',
            type: 'shipping',
          },
        ]);
        fulfillmentSet = createdSet;
        logger.info(`✓ Created fulfillment set: ${fulfillmentSet.id}`);
      }

      // Create service zone for Pakistan
      let serviceZones = await fulfillmentModule.listServiceZones({
        fulfillment_set: { id: fulfillmentSet.id },
      });

      let serviceZone = serviceZones[0];

      if (!serviceZone) {
        const [createdZone] = await fulfillmentModule.createServiceZones([
          {
            name: 'Pakistan Zone',
            fulfillment_set_id: fulfillmentSet.id,
            geo_zones: [
              {
                type: 'country',
                country_code: 'pk',
              },
            ],
          },
        ]);
        serviceZone = createdZone;
        logger.info(`✓ Created service zone: ${serviceZone.id}`);
      }

      // Create shipping options
      for (const option of SHIPPING_OPTIONS) {
        try {
          await createShippingOptionsWorkflow(container).run({
            input: [
              {
                name: option.name,
                price_type: 'flat',
                service_zone_id: serviceZone.id,
                shipping_profile_id: shippingProfile.id,
                provider_id: manualProvider.id,
                type: {
                  label: option.name,
                  description: option.name,
                  code: option.name.toLowerCase().replace(/\s+/g, '-'),
                },
                prices: [
                  {
                    amount: option.price,
                    currency_code: 'pkr',
                  },
                ],
              },
            ],
          });
          logger.info(
            `✓ Created shipping option: ${option.name} - PKR ${option.price / 100}`,
          );
        } catch (error) {
          logger.warn(
            `⚠ Could not create shipping option ${option.name}: ${(error as Error).message}`,
          );
        }
      }
    }

    // ========================================================================
    // Step 8: Create API Keys
    // ========================================================================
    logger.info('\n[Step 8] Creating API keys...');

    const { result: apiKeysResult } = await createApiKeysWorkflow(
      container,
    ).run({
      input: {
        api_keys: API_KEYS,
      },
    });

    const createdApiKeys = apiKeysResult;
    logger.info(`✓ Created ${createdApiKeys.length} API keys:`);

    // Link API keys to sales channels
    for (let i = 0; i < createdApiKeys.length; i++) {
      const apiKey = createdApiKeys[i];
      const salesChannelToLink =
        createdSalesChannels[i] || createdSalesChannels[0];

      await linkSalesChannelsToApiKeyWorkflow(container).run({
        input: {
          id: apiKey.id,
          add: [salesChannelToLink.id, defaultSalesChannel.id].filter(
            (id, index, arr) => arr.indexOf(id) === index,
          ),
        },
      });

      logger.info(`  - ${apiKey.title}`);
      logger.info(`    ID: ${apiKey.id}`);
      logger.info(`    Token: ${apiKey.token}`);
      logger.info(`    Linked to: ${salesChannelToLink.name}`);
    }

    // ========================================================================
    // Step 9: Update Store Defaults
    // ========================================================================
    logger.info('\n[Step 9] Setting store defaults...');

    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          default_region_id: createdRegions[0].id,
          default_location_id: createdStockLocations[0].id,
        },
      },
    });

    logger.info(`✓ Default region: ${createdRegions[0].name}`);
    logger.info(`✓ Default location: ${createdStockLocations[0].name}`);

    // ========================================================================
    // Summary
    // ========================================================================
    logger.info('\n' + '='.repeat(60));
    logger.info('STORE CONFIGURATION COMPLETE');
    logger.info('='.repeat(60));
    logger.info(`
Store Name:        ${STORE_CONFIG.name}
Default Currency:  PKR (Pakistani Rupee)
Default Region:    Pakistan
Regions:           ${createdRegions.length}
Sales Channels:    ${createdSalesChannels.length + 1} (including default)
Stock Locations:   ${createdStockLocations.length}
API Keys:          ${createdApiKeys.length}

PUBLISHABLE API KEYS (save these for your frontend):
${createdApiKeys.map((k) => `  ${k.title}: ${k.token}`).join('\n')}
`);

    logger.info('='.repeat(60));
    logger.info('Next Steps:');
    logger.info('1. Add the publishable API key to your frontend .env');
    logger.info('2. Create products and assign to sales channels');
    logger.info('3. Set up inventory levels at stock locations');
    logger.info('4. Configure payment providers');
    logger.info('='.repeat(60));
  } catch (error) {
    logger.error('Store configuration failed:', error as Error);
    throw error;
  }
}
