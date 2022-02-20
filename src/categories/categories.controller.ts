import { AuthGuard } from "@app/users/guards/auth.guards";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { CategoriesEntity } from "./categories.entity";
import { CategoriesService } from "./categories.service";
import { CreateCategoriesDto } from "./dto/createCategories.dto";
import { CategoriesResponseInterface } from "./types/categoriesResponse.interface";

@Controller('categories')
export class CategoriesController {
  constructor (
    private readonly categoriesService: CategoriesService
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  async findCategories(): Promise<CategoriesResponseInterface> {
    const categories = await this.categoriesService.findAllCategories()
    return await this.categoriesService.buildCategoriesResponse(categories)
  }

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createCategory(@Body('category') createCategoriesDto: CreateCategoriesDto): Promise<{ category: CategoriesEntity }> {
    const newCategory = await this.categoriesService.createCategory(createCategoriesDto)
    return { category: newCategory }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCategory (@Body('category') createCategoriesDto: CreateCategoriesDto, @Param('id') categoryId: number): Promise<{ category: CategoriesEntity }> {
    const updateCategory = await this.categoriesService.updateCategory(createCategoriesDto, categoryId)
    return { category: updateCategory }
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param('id') categoryId: number) {
    return await this.categoriesService.deleteCategory(categoryId)
  }
}