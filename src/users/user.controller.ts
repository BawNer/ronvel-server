import { Body, Controller, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { User } from "./decorators/user.decorator";
import { CreateUserDto } from "./dto/createUser.dto";
import { LoginUserDto } from "./dto/loginUser.dto";
import { updateUserDto } from "./dto/updateUser.dto";
import { AuthGuard } from "./guards/auth.guards";
import { UserResponseInterface } from "./types/userResponse.interface";
import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Post('users')
  @UsePipes(new ValidationPipe())
  async createUser(@Body('user') createUserdto: CreateUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.createUser(createUserdto)
    return await this.userService.buildUserResposne(user)
  }

  @Post('users/login')
  @UsePipes(new ValidationPipe())
  async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
    const user = await this.userService.loginUser(loginUserDto)
    return await this.userService.buildUserResposne(user)
  }

  @Put('user')
  @UseGuards(AuthGuard)
  async updateUser(@Body('user') updateUserDto: updateUserDto, @User('id') uid: number): Promise<UserResponseInterface> {
    const user = await this.userService.updateUser(updateUserDto, uid)
    return await this.userService.buildUserResposne(user)
  }
}