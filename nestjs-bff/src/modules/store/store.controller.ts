import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { StoreService } from './store.service';
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

@ApiTags('store')
@ApiBearerAuth()
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // ==========================================================================
  // Store Endpoints
  // ==========================================================================

  @Get()
  @ApiOperation({ summary: 'Get store details' })
  @ApiResponse({ status: 200, description: 'Store details retrieved', type: StoreResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getStore(@Headers('authorization') authHeader: string): Promise<StoreResponseDto> {
    return this.storeService.getStore(authHeader);
  }

  @Put()
  @ApiOperation({ summary: 'Update store settings' })
  @ApiResponse({ status: 200, description: 'Store updated', type: StoreResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateStore(
    @Body() dto: UpdateStoreDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StoreResponseDto> {
    return this.storeService.updateStore(dto, authHeader);
  }

  @Post('currencies')
  @ApiOperation({ summary: 'Add currency to store' })
  @ApiResponse({ status: 201, description: 'Currency added', type: StoreResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async addStoreCurrency(
    @Body() dto: AddStoreCurrencyDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StoreResponseDto> {
    return this.storeService.addStoreCurrency(dto, authHeader);
  }

  @Delete('currencies/:code')
  @ApiOperation({ summary: 'Remove currency from store' })
  @ApiParam({ name: 'code', description: 'Currency code (e.g., usd)' })
  @ApiResponse({ status: 200, description: 'Currency removed', type: StoreResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async removeStoreCurrency(
    @Param('code') code: string,
    @Headers('authorization') authHeader: string,
  ): Promise<StoreResponseDto> {
    return this.storeService.removeStoreCurrency(code, authHeader);
  }

  // ==========================================================================
  // Sales Channel Endpoints
  // ==========================================================================

  @Get('sales-channels')
  @ApiOperation({ summary: 'List all sales channels' })
  @ApiResponse({
    status: 200,
    description: 'Sales channels list',
    type: SalesChannelListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listSalesChannels(
    @Query() query: PaginationQueryDto,
    @Headers('authorization') authHeader: string,
  ): Promise<SalesChannelListResponseDto> {
    return this.storeService.listSalesChannels(query, authHeader);
  }

  @Get('sales-channels/:id')
  @ApiOperation({ summary: 'Get a sales channel by ID' })
  @ApiParam({ name: 'id', description: 'Sales channel ID' })
  @ApiResponse({ status: 200, description: 'Sales channel details', type: SalesChannelResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sales channel not found' })
  async getSalesChannel(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    return this.storeService.getSalesChannel(id, authHeader);
  }

  @Post('sales-channels')
  @ApiOperation({ summary: 'Create a new sales channel' })
  @ApiResponse({ status: 201, description: 'Sales channel created', type: SalesChannelResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSalesChannel(
    @Body() dto: CreateSalesChannelDto,
    @Headers('authorization') authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    return this.storeService.createSalesChannel(dto, authHeader);
  }

  @Put('sales-channels/:id')
  @ApiOperation({ summary: 'Update a sales channel' })
  @ApiParam({ name: 'id', description: 'Sales channel ID' })
  @ApiResponse({ status: 200, description: 'Sales channel updated', type: SalesChannelResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sales channel not found' })
  async updateSalesChannel(
    @Param('id') id: string,
    @Body() dto: UpdateSalesChannelDto,
    @Headers('authorization') authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    return this.storeService.updateSalesChannel(id, dto, authHeader);
  }

  @Delete('sales-channels/:id')
  @ApiOperation({ summary: 'Delete a sales channel' })
  @ApiParam({ name: 'id', description: 'Sales channel ID' })
  @ApiResponse({ status: 200, description: 'Sales channel deleted', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Sales channel not found' })
  async deleteSalesChannel(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<DeleteResponseDto> {
    return this.storeService.deleteSalesChannel(id, authHeader);
  }

  @Post('sales-channels/:id/products')
  @ApiOperation({ summary: 'Add or remove products from a sales channel' })
  @ApiParam({ name: 'id', description: 'Sales channel ID' })
  @ApiResponse({ status: 200, description: 'Products updated', type: SalesChannelResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async manageSalesChannelProducts(
    @Param('id') id: string,
    @Body() dto: SalesChannelProductsDto,
    @Headers('authorization') authHeader: string,
  ): Promise<SalesChannelResponseDto> {
    return this.storeService.manageSalesChannelProducts(id, dto, authHeader);
  }

  // ==========================================================================
  // Region Endpoints
  // ==========================================================================

  @Get('regions')
  @ApiOperation({ summary: 'List all regions' })
  @ApiResponse({ status: 200, description: 'Regions list', type: RegionListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listRegions(
    @Query() query: PaginationQueryDto,
    @Headers('authorization') authHeader: string,
  ): Promise<RegionListResponseDto> {
    return this.storeService.listRegions(query, authHeader);
  }

  @Get('regions/:id')
  @ApiOperation({ summary: 'Get a region by ID' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region details', type: RegionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async getRegion(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<RegionResponseDto> {
    return this.storeService.getRegion(id, authHeader);
  }

  @Post('regions')
  @ApiOperation({ summary: 'Create a new region' })
  @ApiResponse({ status: 201, description: 'Region created', type: RegionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createRegion(
    @Body() dto: CreateRegionDto,
    @Headers('authorization') authHeader: string,
  ): Promise<RegionResponseDto> {
    return this.storeService.createRegion(dto, authHeader);
  }

  @Put('regions/:id')
  @ApiOperation({ summary: 'Update a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region updated', type: RegionResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async updateRegion(
    @Param('id') id: string,
    @Body() dto: UpdateRegionDto,
    @Headers('authorization') authHeader: string,
  ): Promise<RegionResponseDto> {
    return this.storeService.updateRegion(id, dto, authHeader);
  }

  @Delete('regions/:id')
  @ApiOperation({ summary: 'Delete a region' })
  @ApiParam({ name: 'id', description: 'Region ID' })
  @ApiResponse({ status: 200, description: 'Region deleted', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Region not found' })
  async deleteRegion(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<DeleteResponseDto> {
    return this.storeService.deleteRegion(id, authHeader);
  }

  // ==========================================================================
  // Stock Location Endpoints
  // ==========================================================================

  @Get('stock-locations')
  @ApiOperation({ summary: 'List all stock locations' })
  @ApiResponse({
    status: 200,
    description: 'Stock locations list',
    type: StockLocationListResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listStockLocations(
    @Query() query: PaginationQueryDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StockLocationListResponseDto> {
    return this.storeService.listStockLocations(query, authHeader);
  }

  @Get('stock-locations/:id')
  @ApiOperation({ summary: 'Get a stock location by ID' })
  @ApiParam({ name: 'id', description: 'Stock location ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock location details',
    type: StockLocationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Stock location not found' })
  async getStockLocation(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<StockLocationResponseDto> {
    return this.storeService.getStockLocation(id, authHeader);
  }

  @Post('stock-locations')
  @ApiOperation({ summary: 'Create a new stock location' })
  @ApiResponse({
    status: 201,
    description: 'Stock location created',
    type: StockLocationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createStockLocation(
    @Body() dto: CreateStockLocationDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StockLocationResponseDto> {
    return this.storeService.createStockLocation(dto, authHeader);
  }

  @Put('stock-locations/:id')
  @ApiOperation({ summary: 'Update a stock location' })
  @ApiParam({ name: 'id', description: 'Stock location ID' })
  @ApiResponse({
    status: 200,
    description: 'Stock location updated',
    type: StockLocationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Stock location not found' })
  async updateStockLocation(
    @Param('id') id: string,
    @Body() dto: UpdateStockLocationDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StockLocationResponseDto> {
    return this.storeService.updateStockLocation(id, dto, authHeader);
  }

  @Delete('stock-locations/:id')
  @ApiOperation({ summary: 'Delete a stock location' })
  @ApiParam({ name: 'id', description: 'Stock location ID' })
  @ApiResponse({ status: 200, description: 'Stock location deleted', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Stock location not found' })
  async deleteStockLocation(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<DeleteResponseDto> {
    return this.storeService.deleteStockLocation(id, authHeader);
  }

  @Post('stock-locations/:id/sales-channels')
  @ApiOperation({ summary: 'Add or remove sales channels from a stock location' })
  @ApiParam({ name: 'id', description: 'Stock location ID' })
  @ApiResponse({
    status: 200,
    description: 'Sales channels updated',
    type: StockLocationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async manageStockLocationSalesChannels(
    @Param('id') id: string,
    @Body() dto: StockLocationSalesChannelsDto,
    @Headers('authorization') authHeader: string,
  ): Promise<StockLocationResponseDto> {
    return this.storeService.manageStockLocationSalesChannels(id, dto, authHeader);
  }

  // ==========================================================================
  // API Key Endpoints
  // ==========================================================================

  @Get('api-keys')
  @ApiOperation({ summary: 'List all API keys' })
  @ApiResponse({ status: 200, description: 'API keys list', type: ApiKeyListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listApiKeys(
    @Query() query: PaginationQueryDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyListResponseDto> {
    return this.storeService.listApiKeys(query, authHeader);
  }

  @Get('api-keys/:id')
  @ApiOperation({ summary: 'Get an API key by ID' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'API key details', type: ApiKeyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async getApiKey(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    return this.storeService.getApiKey(id, authHeader);
  }

  @Post('api-keys')
  @ApiOperation({ summary: 'Create a new API key' })
  @ApiResponse({ status: 201, description: 'API key created', type: ApiKeyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createApiKey(
    @Body() dto: CreateApiKeyDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    return this.storeService.createApiKey(dto, authHeader);
  }

  @Put('api-keys/:id')
  @ApiOperation({ summary: 'Update an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'API key updated', type: ApiKeyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async updateApiKey(
    @Param('id') id: string,
    @Body() dto: UpdateApiKeyDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    return this.storeService.updateApiKey(id, dto, authHeader);
  }

  @Delete('api-keys/:id')
  @ApiOperation({ summary: 'Delete an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'API key deleted', type: DeleteResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async deleteApiKey(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<DeleteResponseDto> {
    return this.storeService.deleteApiKey(id, authHeader);
  }

  @Post('api-keys/:id/revoke')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'API key revoked', type: ApiKeyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'API key not found' })
  async revokeApiKey(
    @Param('id') id: string,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    return this.storeService.revokeApiKey(id, authHeader);
  }

  @Post('api-keys/:id/sales-channels')
  @ApiOperation({ summary: 'Add or remove sales channels from an API key' })
  @ApiParam({ name: 'id', description: 'API key ID' })
  @ApiResponse({ status: 200, description: 'Sales channels updated', type: ApiKeyResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async manageApiKeySalesChannels(
    @Param('id') id: string,
    @Body() dto: ApiKeySalesChannelsDto,
    @Headers('authorization') authHeader: string,
  ): Promise<ApiKeyResponseDto> {
    return this.storeService.manageApiKeySalesChannels(id, dto, authHeader);
  }

  // ==========================================================================
  // Currency Endpoints
  // ==========================================================================

  @Get('currencies')
  @ApiOperation({ summary: 'List all available currencies' })
  @ApiResponse({ status: 200, description: 'Currencies list', type: CurrencyListResponseDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listCurrencies(
    @Query() query: PaginationQueryDto,
    @Headers('authorization') authHeader: string,
  ): Promise<CurrencyListResponseDto> {
    return this.storeService.listCurrencies(query, authHeader);
  }
}
