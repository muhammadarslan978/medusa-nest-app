import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { CollectionsService } from './collections.service';
import {
  CreateCollectionDto,
  UpdateCollectionDto,
  UpdateCollectionProductsDto,
  CollectionApiResponseDto,
  CollectionListApiResponseDto,
  CollectionDeleteResponseDto,
  ListCollectionsQueryDto,
} from './dto/collection.dto';

@ApiTags('Collections')
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all product collections' })
  @ApiResponse({
    status: 200,
    description: 'Collections retrieved successfully',
    type: CollectionListApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async listCollections(
    @Query() query: ListCollectionsQueryDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.collectionsService.listCollections(query, authHeader);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a collection by ID' })
  @ApiParam({ name: 'id', description: 'Collection ID', example: 'pcol_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Collection retrieved successfully',
    type: CollectionApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async getCollection(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    return this.collectionsService.getCollection(id, authHeader);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product collection' })
  @ApiResponse({
    status: 201,
    description: 'Collection created successfully',
    type: CollectionApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createCollection(
    @Body() dto: CreateCollectionDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.collectionsService.createCollection(dto, authHeader);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a collection' })
  @ApiParam({ name: 'id', description: 'Collection ID', example: 'pcol_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Collection updated successfully',
    type: CollectionApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async updateCollection(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.collectionsService.updateCollection(id, dto, authHeader);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a collection' })
  @ApiParam({ name: 'id', description: 'Collection ID', example: 'pcol_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Collection deleted successfully',
    type: CollectionDeleteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async deleteCollection(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    return this.collectionsService.deleteCollection(id, authHeader);
  }

  @Post(':id/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add or remove products from a collection' })
  @ApiParam({ name: 'id', description: 'Collection ID', example: 'pcol_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Collection products updated successfully',
    type: CollectionApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  async updateCollectionProducts(
    @Param('id') id: string,
    @Body() dto: UpdateCollectionProductsDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.collectionsService.updateCollectionProducts(id, dto, authHeader);
  }
}
