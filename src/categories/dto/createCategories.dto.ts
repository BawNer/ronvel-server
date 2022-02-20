import { IsNotEmpty } from "class-validator";

export class CreateCategoriesDto {
  @IsNotEmpty()
  readonly name: string

  @IsNotEmpty()
  readonly rule: string

  @IsNotEmpty()
  readonly weight: number
}