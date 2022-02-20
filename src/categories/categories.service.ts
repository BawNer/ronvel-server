import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { CategoriesEntity } from "./categories.entity";
import { CreateCategoriesDto } from "./dto/createCategories.dto";
import { CategoriesResponseInterface } from "./types/categoriesResponse.interface";

@Injectable()
export class CategoriesService {

  constructor (
    @InjectRepository(CategoriesEntity)
    private readonly categoriesRepository: Repository<CategoriesEntity>
  ) {}

  async findAllCategories(): Promise<CategoriesEntity[]> {
    return await this.categoriesRepository.find()
  }

  async createCategory(createCategoriesDto: CreateCategoriesDto): Promise<CategoriesEntity> {
    const category = await this.categoriesRepository.findOne({ name: createCategoriesDto.name })
    if (category) {
      throw new HttpException('Resource already existing', HttpStatus.CONFLICT)
    }
    const newCategory = new CategoriesEntity()
    Object.assign(newCategory, createCategoriesDto)
    return await this.categoriesRepository.save(newCategory)
  }

  async updateCategory(createCategoriesDto: CreateCategoriesDto, id: number): Promise<CategoriesEntity> {
    const category = await this.categoriesRepository.findOne(id)
    if (!category) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    Object.assign(category, createCategoriesDto)
    return await this.categoriesRepository.save(category)
  }

  async deleteCategory(categoryId: number): Promise<DeleteResult> {
    const category = this.categoriesRepository.findOne({id: categoryId})
    if (!category) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    return await this.categoriesRepository.delete({id: categoryId})
  }

  async buildCategoriesResponse(category: CategoriesEntity[]): Promise<CategoriesResponseInterface> {
    return {
      categories: [
        ...category
      ]
    }
  }
}