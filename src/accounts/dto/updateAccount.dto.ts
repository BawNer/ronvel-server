import { IsNotEmpty } from "class-validator";

export class UpdateAccountDto {
  @IsNotEmpty()
  readonly categoryId: number

  @IsNotEmpty()
  readonly status: string
}