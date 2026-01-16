import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { MedusaService } from '../../medusa/medusa.service';
import {
  UpdateStoreDto,
  AddStoreCurrencyDto,
  StoreResponseDto,
  CreateSalesChannelDto,
  UpdateSalesChannelDto,
  SalesChannelProductsDto,
  SalesChannelResponseDto,
  SalesChannelListResponseDto,
  CreateRegionDto,
  UpdateRegionDto,
  RegionResponseDto,
  RegionListResponseDto,
  CreateStockLocationDto,
  UpdateStockLocationDto,
  StockLocationSalesChannelsDto,
  StockLocationResponseDto,
  StockLocationListResponseDto,
  CreateApiKeyDto,
  UpdateApiKeyDto,
  ApiKeySalesChannelsDto,
  ApiKeyResponseDto,
  ApiKeyListResponseDto,
  CurrencyListResponseDto,
  DeleteResponseDto,
  PaginationQueryDto,
} from './dto/store.dto';

// ============================================================================
// Medusa Response Interfaces
// ============================================================================

interface MedusaStore {
  id: string;
  name: string;
  default_sales_channel_id?: string;
  default_region_id?: string;
  default_location_id?: string;
  metadata?: Record<string, unknown>;
  supported_currencies?: {
    id: string;
    currency_code: string;
    is_default: boolean;
    currency?: {
      code: string;
      symbol: string;
      name: string;
    };
  }[];
  created_at: string;
  updated_at: string;
}

interface MedusaSalesChannel {
  id: string;
  name: string;
  description?: string;
  is_disabled: boolean;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MedusaRegion {
  id: string;
  name: string;
  currency_code: string;
  automatic_taxes?: boolean;
  countries?: { iso_2: string; name: string }[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MedusaStockLocation {
  id: string;
  name: string;
  address?: {
    address_1: string;
    address_2?: string;
    city: string;
    country_code: string;
    province?: string;
    postal_code?: string;
    phone?: string;
  };
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MedusaApiKey {
  id: string;
  title: string;
  token: string;
  redacted: string;
  type: string;
  last_used_at?: string;
  revoked_at?: string;
  sales_channels?: { id: string; name: string }[];
  created_at: string;
  updated_at: string;
}

interface MedusaCurrency {
  code: string;
  name: string;
  symbol: string;
  symbol_native: string;
  decimal_digits: number;
}

// ============================================================================
// Store Service
// ============================================================================

@Injectable()
export class StoreService {
  constructor(private readonly medusaService: MedusaService) {}

  /**
   * Validates that an authorization header is present
   */
  private validateAuth(authHeader: string): void {
    if (!authHeader) {
      throw new UnauthorizedException('Admin authorization header is required');
    }
  }

  /**
   * Creates standard request options with auth header
   */
  private createRequestOptions(
    authHeader: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: Record<string, unknown>,
  ) {
    return {
      method,
      headers: { Authorization: authHeader },
      ...(body && { body }),
    };
  }

  // ==========================================================================
  // Store Operations
  // ==========================================================================

  /**
   * Get store details
   */
  async getStore(authHeader: string): Promise<StoreResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ stores: MedusaStore[] }>(
      '/stores',
      this.createRequestOptions(authHeader),
    );

    if (!response.stores || response.stores.length === 0) {
      throw new NotFoundException('Store not found');
    }

    return this.transformStore(response.stores[0]);
  }

  /**
   * Update store settings
   */
  async updateStore(dto: UpdateStoreDto, authHeader: string): Promise<StoreResponseDto> {
    this.validateAuth(authHeader);

    const storesResponse = await this.medusaService.adminRequest<{ stores: MedusaStore[] }>(
      '/stores',
      this.createRequestOptions(authHeader),
    );

    if (!storesResponse.stores || storesResponse.stores.length === 0) {
      throw new NotFoundException('Store not found');
    }

    const storeId = storesResponse.stores[0].id;

    const response = await this.medusaService.adminRequest<{ store: MedusaStore }>(
      `/stores/${storeId}`,
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        default_sales_channel_id: dto.default_sales_channel_id,
        default_region_id: dto.default_region_id,
        default_location_id: dto.default_location_id,
        metadata: dto.metadata,
      }),
    );

    return this.transformStore(response.store);
  }

  /**
   * Add currency to store
   * Medusa v2 uses supported_currencies array in store update
   */
  async addStoreCurrency(dto: AddStoreCurrencyDto, authHeader: string): Promise<StoreResponseDto> {
    this.validateAuth(authHeader);

    const storesResponse = await this.medusaService.adminRequest<{ stores: MedusaStore[] }>(
      '/stores',
      this.createRequestOptions(authHeader),
    );

    if (!storesResponse.stores || storesResponse.stores.length === 0) {
      throw new NotFoundException('Store not found');
    }

    const store = storesResponse.stores[0];
    const existingCurrencies = store.supported_currencies || [];

    // Check if currency already exists
    const currencyExists = existingCurrencies.some((c) => c.currency_code === dto.currency_code);

    if (currencyExists) {
      return this.transformStore(store);
    }

    // Build new currencies array
    const newCurrencies = [
      ...existingCurrencies.map((c) => ({
        currency_code: c.currency_code,
        is_default: dto.is_default && c.currency_code === dto.currency_code ? false : c.is_default,
      })),
      {
        currency_code: dto.currency_code,
        is_default: dto.is_default || false,
      },
    ];

    // If new currency is default, remove default from others
    if (dto.is_default) {
      newCurrencies.forEach((c) => {
        if (c.currency_code !== dto.currency_code) {
          c.is_default = false;
        }
      });
    }

    const response = await this.medusaService.adminRequest<{ store: MedusaStore }>(
      `/stores/${store.id}`,
      this.createRequestOptions(authHeader, 'POST', {
        supported_currencies: newCurrencies,
      }),
    );

    return this.transformStore(response.store);
  }

  /**
   * Remove currency from store
   * Medusa v2 uses supported_currencies array in store update
   */
  async removeStoreCurrency(currencyCode: string, authHeader: string): Promise<StoreResponseDto> {
    this.validateAuth(authHeader);

    const storesResponse = await this.medusaService.adminRequest<{ stores: MedusaStore[] }>(
      '/stores',
      this.createRequestOptions(authHeader),
    );

    if (!storesResponse.stores || storesResponse.stores.length === 0) {
      throw new NotFoundException('Store not found');
    }

    const store = storesResponse.stores[0];
    const existingCurrencies = store.supported_currencies || [];

    // Filter out the currency to remove
    const newCurrencies = existingCurrencies
      .filter((c) => c.currency_code !== currencyCode)
      .map((c) => ({
        currency_code: c.currency_code,
        is_default: c.is_default,
      }));

    // Ensure at least one currency remains
    if (newCurrencies.length === 0) {
      throw new NotFoundException('Cannot remove the last currency from store');
    }

    // Ensure there's still a default currency
    const hasDefault = newCurrencies.some((c) => c.is_default);
    if (!hasDefault && newCurrencies.length > 0) {
      newCurrencies[0].is_default = true;
    }

    const response = await this.medusaService.adminRequest<{ store: MedusaStore }>(
      `/stores/${store.id}`,
      this.createRequestOptions(authHeader, 'POST', {
        supported_currencies: newCurrencies,
      }),
    );

    return this.transformStore(response.store);
  }

  // ==========================================================================
  // Sales Channel Operations
  // ==========================================================================

  /**
   * List all sales channels
   */
  async listSalesChannels(
    query: PaginationQueryDto,
    authHeader: string,
  ): Promise<SalesChannelListResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      sales_channels: MedusaSalesChannel[];
      count: number;
      offset: number;
      limit: number;
    }>('/sales-channels', {
      ...this.createRequestOptions(authHeader),
      query: { offset: query.offset, limit: query.limit },
    });

    return {
      sales_channels: response.sales_channels.map(this.transformSalesChannel),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single sales channel
   */
  async getSalesChannel(id: string, authHeader: string): Promise<SalesChannelResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ sales_channel: MedusaSalesChannel }>(
      `/sales-channels/${id}`,
      this.createRequestOptions(authHeader),
    );

    return this.transformSalesChannel(response.sales_channel);
  }

  /**
   * Create a new sales channel
   */
  async createSalesChannel(
    dto: CreateSalesChannelDto,
    authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ sales_channel: MedusaSalesChannel }>(
      '/sales-channels',
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        description: dto.description,
        is_disabled: dto.is_disabled,
        metadata: dto.metadata,
      }),
    );

    return this.transformSalesChannel(response.sales_channel);
  }

  /**
   * Update a sales channel
   */
  async updateSalesChannel(
    id: string,
    dto: UpdateSalesChannelDto,
    authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ sales_channel: MedusaSalesChannel }>(
      `/sales-channels/${id}`,
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        description: dto.description,
        is_disabled: dto.is_disabled,
        metadata: dto.metadata,
      }),
    );

    return this.transformSalesChannel(response.sales_channel);
  }

  /**
   * Delete a sales channel
   */
  async deleteSalesChannel(id: string, authHeader: string): Promise<DeleteResponseDto> {
    this.validateAuth(authHeader);

    await this.medusaService.adminRequest(
      `/sales-channels/${id}`,
      this.createRequestOptions(authHeader, 'DELETE'),
    );

    return { id, object: 'sales_channel', deleted: true };
  }

  /**
   * Manage products in a sales channel
   */
  async manageSalesChannelProducts(
    id: string,
    dto: SalesChannelProductsDto,
    authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ sales_channel: MedusaSalesChannel }>(
      `/sales-channels/${id}/products`,
      this.createRequestOptions(authHeader, 'POST', {
        add: dto.add,
        remove: dto.remove,
      }),
    );

    return this.transformSalesChannel(response.sales_channel);
  }

  // ==========================================================================
  // Region Operations
  // ==========================================================================

  /**
   * List all regions
   */
  async listRegions(query: PaginationQueryDto, authHeader: string): Promise<RegionListResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      regions: MedusaRegion[];
      count: number;
      offset: number;
      limit: number;
    }>('/regions', {
      ...this.createRequestOptions(authHeader),
      query: { offset: query.offset, limit: query.limit },
    });

    return {
      regions: response.regions.map(this.transformRegion),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single region
   */
  async getRegion(id: string, authHeader: string): Promise<RegionResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ region: MedusaRegion }>(
      `/regions/${id}`,
      this.createRequestOptions(authHeader),
    );

    return this.transformRegion(response.region);
  }

  /**
   * Create a new region
   */
  async createRegion(dto: CreateRegionDto, authHeader: string): Promise<RegionResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ region: MedusaRegion }>(
      '/regions',
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        currency_code: dto.currency_code,
        countries: dto.countries,
        payment_providers: dto.payment_providers,
        automatic_taxes: dto.automatic_taxes,
        metadata: dto.metadata,
      }),
    );

    return this.transformRegion(response.region);
  }

  /**
   * Update a region
   */
  async updateRegion(
    id: string,
    dto: UpdateRegionDto,
    authHeader: string,
  ): Promise<RegionResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ region: MedusaRegion }>(
      `/regions/${id}`,
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        currency_code: dto.currency_code,
        countries: dto.countries,
        automatic_taxes: dto.automatic_taxes,
        metadata: dto.metadata,
      }),
    );

    return this.transformRegion(response.region);
  }

  /**
   * Delete a region
   */
  async deleteRegion(id: string, authHeader: string): Promise<DeleteResponseDto> {
    this.validateAuth(authHeader);

    await this.medusaService.adminRequest(
      `/regions/${id}`,
      this.createRequestOptions(authHeader, 'DELETE'),
    );

    return { id, object: 'region', deleted: true };
  }

  // ==========================================================================
  // Stock Location Operations
  // ==========================================================================

  /**
   * List all stock locations
   */
  async listStockLocations(
    query: PaginationQueryDto,
    authHeader: string,
  ): Promise<StockLocationListResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      stock_locations: MedusaStockLocation[];
      count: number;
      offset: number;
      limit: number;
    }>('/stock-locations', {
      ...this.createRequestOptions(authHeader),
      query: { offset: query.offset, limit: query.limit },
    });

    return {
      stock_locations: response.stock_locations.map(this.transformStockLocation),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single stock location
   */
  async getStockLocation(id: string, authHeader: string): Promise<StockLocationResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      stock_location: MedusaStockLocation;
    }>(`/stock-locations/${id}`, this.createRequestOptions(authHeader));

    return this.transformStockLocation(response.stock_location);
  }

  /**
   * Create a new stock location
   */
  async createStockLocation(
    dto: CreateStockLocationDto,
    authHeader: string,
  ): Promise<StockLocationResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      stock_location: MedusaStockLocation;
    }>(
      '/stock-locations',
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        address: dto.address,
        metadata: dto.metadata,
      }),
    );

    return this.transformStockLocation(response.stock_location);
  }

  /**
   * Update a stock location
   */
  async updateStockLocation(
    id: string,
    dto: UpdateStockLocationDto,
    authHeader: string,
  ): Promise<StockLocationResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      stock_location: MedusaStockLocation;
    }>(
      `/stock-locations/${id}`,
      this.createRequestOptions(authHeader, 'POST', {
        name: dto.name,
        address: dto.address,
        metadata: dto.metadata,
      }),
    );

    return this.transformStockLocation(response.stock_location);
  }

  /**
   * Delete a stock location
   */
  async deleteStockLocation(id: string, authHeader: string): Promise<DeleteResponseDto> {
    this.validateAuth(authHeader);

    await this.medusaService.adminRequest(
      `/stock-locations/${id}`,
      this.createRequestOptions(authHeader, 'DELETE'),
    );

    return { id, object: 'stock_location', deleted: true };
  }

  /**
   * Manage sales channels for a stock location
   */
  async manageStockLocationSalesChannels(
    id: string,
    dto: StockLocationSalesChannelsDto,
    authHeader: string,
  ): Promise<StockLocationResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      stock_location: MedusaStockLocation;
    }>(
      `/stock-locations/${id}/sales-channels`,
      this.createRequestOptions(authHeader, 'POST', {
        add: dto.add,
        remove: dto.remove,
      }),
    );

    return this.transformStockLocation(response.stock_location);
  }

  // ==========================================================================
  // API Key Operations
  // ==========================================================================

  /**
   * List all API keys
   */
  async listApiKeys(query: PaginationQueryDto, authHeader: string): Promise<ApiKeyListResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      api_keys: MedusaApiKey[];
      count: number;
      offset: number;
      limit: number;
    }>('/api-keys', {
      ...this.createRequestOptions(authHeader),
      query: { offset: query.offset, limit: query.limit },
    });

    return {
      api_keys: response.api_keys.map(this.transformApiKey),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  /**
   * Get a single API key
   */
  async getApiKey(id: string, authHeader: string): Promise<ApiKeyResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ api_key: MedusaApiKey }>(
      `/api-keys/${id}`,
      this.createRequestOptions(authHeader),
    );

    return this.transformApiKey(response.api_key);
  }

  /**
   * Create a new API key
   */
  async createApiKey(dto: CreateApiKeyDto, authHeader: string): Promise<ApiKeyResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ api_key: MedusaApiKey }>(
      '/api-keys',
      this.createRequestOptions(authHeader, 'POST', {
        title: dto.title,
        type: dto.type,
      }),
    );

    return this.transformApiKey(response.api_key);
  }

  /**
   * Update an API key
   */
  async updateApiKey(
    id: string,
    dto: UpdateApiKeyDto,
    authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ api_key: MedusaApiKey }>(
      `/api-keys/${id}`,
      this.createRequestOptions(authHeader, 'POST', {
        title: dto.title,
      }),
    );

    return this.transformApiKey(response.api_key);
  }

  /**
   * Delete (revoke) an API key
   */
  async deleteApiKey(id: string, authHeader: string): Promise<DeleteResponseDto> {
    this.validateAuth(authHeader);

    await this.medusaService.adminRequest(
      `/api-keys/${id}`,
      this.createRequestOptions(authHeader, 'DELETE'),
    );

    return { id, object: 'api_key', deleted: true };
  }

  /**
   * Revoke an API key
   */
  async revokeApiKey(id: string, authHeader: string): Promise<ApiKeyResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ api_key: MedusaApiKey }>(
      `/api-keys/${id}/revoke`,
      this.createRequestOptions(authHeader, 'POST'),
    );

    return this.transformApiKey(response.api_key);
  }

  /**
   * Manage sales channels for an API key
   */
  async manageApiKeySalesChannels(
    id: string,
    dto: ApiKeySalesChannelsDto,
    authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{ api_key: MedusaApiKey }>(
      `/api-keys/${id}/sales-channels`,
      this.createRequestOptions(authHeader, 'POST', {
        add: dto.add,
        remove: dto.remove,
      }),
    );

    return this.transformApiKey(response.api_key);
  }

  // ==========================================================================
  // Currency Operations
  // ==========================================================================

  /**
   * List all available currencies
   */
  async listCurrencies(
    query: PaginationQueryDto,
    authHeader: string,
  ): Promise<CurrencyListResponseDto> {
    this.validateAuth(authHeader);

    const response = await this.medusaService.adminRequest<{
      currencies: MedusaCurrency[];
      count: number;
      offset: number;
      limit: number;
    }>('/currencies', {
      ...this.createRequestOptions(authHeader),
      query: { offset: query.offset, limit: query.limit || 200 },
    });

    return {
      currencies: response.currencies.map((c) => ({
        code: c.code,
        name: c.name,
        symbol: c.symbol,
        symbol_native: c.symbol_native,
        decimal_digits: c.decimal_digits,
      })),
      count: response.count,
      offset: response.offset,
      limit: response.limit,
    };
  }

  // ==========================================================================
  // Transform Methods
  // ==========================================================================

  private transformStore(store: MedusaStore): StoreResponseDto {
    return {
      id: store.id,
      name: store.name,
      default_sales_channel_id: store.default_sales_channel_id,
      default_region_id: store.default_region_id,
      default_location_id: store.default_location_id,
      metadata: store.metadata,
      supported_currencies:
        store.supported_currencies?.map((sc) => ({
          id: sc.id,
          currency_code: sc.currency_code,
          is_default: sc.is_default,
          symbol: sc.currency?.symbol,
          name: sc.currency?.name,
        })) || [],
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }

  private transformSalesChannel(channel: MedusaSalesChannel): SalesChannelResponseDto {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      is_disabled: channel.is_disabled,
      metadata: channel.metadata,
      created_at: channel.created_at,
      updated_at: channel.updated_at,
    };
  }

  private transformRegion(region: MedusaRegion): RegionResponseDto {
    return {
      id: region.id,
      name: region.name,
      currency_code: region.currency_code,
      automatic_taxes: region.automatic_taxes,
      countries: region.countries,
      metadata: region.metadata,
      created_at: region.created_at,
      updated_at: region.updated_at,
    };
  }

  private transformStockLocation(location: MedusaStockLocation): StockLocationResponseDto {
    return {
      id: location.id,
      name: location.name,
      address: location.address,
      metadata: location.metadata,
      created_at: location.created_at,
      updated_at: location.updated_at,
    };
  }

  private transformApiKey(apiKey: MedusaApiKey): ApiKeyResponseDto {
    return {
      id: apiKey.id,
      title: apiKey.title,
      token: apiKey.token,
      redacted: apiKey.redacted,
      type: apiKey.type,
      last_used_at: apiKey.last_used_at,
      revoked_at: apiKey.revoked_at,
      sales_channels: apiKey.sales_channels,
      created_at: apiKey.created_at,
      updated_at: apiKey.updated_at,
    };
  }
}
