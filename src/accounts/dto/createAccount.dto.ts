import { IsNotEmpty } from "class-validator"

export class CreateAccountDto {
  readonly status: string
  readonly categoryId: number

  @IsNotEmpty()
  readonly info: string

}