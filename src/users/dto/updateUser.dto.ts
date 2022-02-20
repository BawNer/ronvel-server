import { IsNotEmpty } from "class-validator";

export class updateUserDto {
  @IsNotEmpty()
  readonly password: string

  readonly username?: string
  readonly login?: string
}