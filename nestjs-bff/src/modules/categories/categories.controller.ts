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
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryApiResponseDto,
  CategoryListApiResponseDto,
  CategoryDeleteResponseDto,
  ListCategoriesQueryDto,
} from './dto/category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all product categories (public)' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: CategoryListApiResponseDto,
  })
  async listCategories(@Query() query: ListCategoriesQueryDto) {
    return this.categoriesService.listCategoriesPublic(query);
  }

  @Get('tree')
  @ApiOperation({ summary: 'Get category tree (hierarchical structure) (public)' })
  @ApiResponse({
    status: 200,
    description: 'Category tree retrieved successfully',
  })
  async getCategoryTree() {
    const categories = await this.categoriesService.getCategoryTreePublic();
    return { categories };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'pcat_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryApiResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async getCategory(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    return this.categoriesService.getCategory(id, authHeader);
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product category' })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createCategory(
    @Body() dto: CreateCategoryDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.categoriesService.createCategory(dto, authHeader);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'pcat_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryApiResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @Headers('authorization') authHeader: string,
  ) {
    return this.categoriesService.updateCategory(id, dto, authHeader);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', description: 'Category ID', example: 'pcat_01ABC123...' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    type: CategoryDeleteResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async deleteCategory(@Param('id') id: string, @Headers('authorization') authHeader: string) {
    return this.categoriesService.deleteCategory(id, authHeader);
  }
}
