import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import {
  SetInventoryLevelDto,
  UpdateInventoryLevelDto,
  UpdateInventoryItemDto,
  InventoryItemApiResponseDto,
  InventoryItemListApiResponseDto,
  ListInventoryItemsQueryDto,
} from './dto/inventory.dto';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all inventory items' })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
    type: InventoryItemListApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listInventoryItems(
    @Query() query: ListInventoryItemsQueryDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.listInventoryItems(query, authHeader);
  }

  @Get('location/:locationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get inventory items at a specific stock location' })
  @ApiParam({ name: 'locationId', description: 'Stock location ID', example: 'sloc_01ABC...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory items retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInventoryByLocation(
    @Param('locationId') locationId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.getInventoryByLocation(locationId, authHeader);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an inventory item by ID' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 'iitem_01ABC...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory item retrieved successfully',
    type: InventoryItemApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async getInventoryItem(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    return this.inventoryService.getInventoryItem(id, authHeader);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 'iitem_01ABC...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory item updated successfully',
    type: InventoryItemApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async updateInventoryItem(
    @Param('id') id: string,
    @Body() dto: UpdateInventoryItemDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.updateInventoryItem(id, dto, authHeader);
  }

  @Post(':id/location-levels')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add inventory level at a stock location' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 'iitem_01ABC...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory level added successfully',
    type: InventoryItemApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Inventory item not found' })
  async addLocationLevel(
    @Param('id') id: string,
    @Body() dto: SetInventoryLevelDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.addLocationLevel(id, dto, authHeader);
  }

  @Post(':id/location-levels/:locationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update inventory level at a stock location' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 'iitem_01ABC...' })
  @ApiParam({ name: 'locationId', description: 'Stock location ID', example: 'sloc_01XYZ...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory level updated successfully',
    type: InventoryItemApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Inventory item or location not found' })
  async updateLocationLevel(
    @Param('id') id: string,
    @Param('locationId') locationId: string,
    @Body() dto: UpdateInventoryLevelDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.updateLocationLevel(id, locationId, dto, authHeader);
  }

  @Delete(':id/location-levels/:locationId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete inventory level at a stock location' })
  @ApiParam({ name: 'id', description: 'Inventory item ID', example: 'iitem_01ABC...' })
  @ApiParam({ name: 'locationId', description: 'Stock location ID', example: 'sloc_01XYZ...' })
  @ApiResponse({
    status: 200,
    description: 'Inventory level deleted successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Inventory item or location not found' })
  async deleteLocationLevel(
    @Param('id') id: string,
    @Param('locationId') locationId: string,
    @Headers('authorization') authHeader: string,
  ) {
    return this.inventoryService.deleteLocationLevel(id, locationId, authHeader);
  }
}
