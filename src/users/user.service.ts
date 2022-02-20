import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/loginUser.dto";
import { UserEntity } from "./user.entity";
import { compare } from 'bcrypt'
import { sign } from "jsonwebtoken";
import { UserResponseInterface } from "./types/userResponse.interface";
import { JWT_SECRET } from "@app/config";
import { CreateUserDto } from "./dto/createUser.dto";
import { updateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor (
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const userByLogin = await this.userRepository.findOne({
      login: createUserDto.login
    })

    const userByName = await this.userRepository.findOne({
      username: createUserDto.username
    })

    if ( userByLogin || userByName ) {
      throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const newUser = new UserEntity()
    Object.assign(newUser, createUserDto)
    return await this.userRepository.save(newUser)
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({login: loginUserDto.login}, { select: ['id', 'login', 'username', 'password'] })

    if (!user) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    const isPasswordCorrect = await compare(loginUserDto.password, user.password)

    if (!isPasswordCorrect) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete user.password

    return user
  }

  async updateUser(updateUserDto: updateUserDto, uid: number): Promise<UserEntity> {
    const user = await this.findById(uid)

    Object.assign(user, updateUserDto)

    return await this.userRepository.save(user)
  }

  async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id)
  }

  genereteJwt(user: UserEntity): string {
    return sign({
      id: user.id,
      username: user.username,
      login: user.login
    }, JWT_SECRET)
  }
 
  buildUserResposne(user: UserEntity): UserResponseInterface {
    return {
      user: {
        ...user,
        token: this.genereteJwt(user)
      }
    }
  }
}