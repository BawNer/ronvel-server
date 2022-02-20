import { MmogaService } from "@app/mmoga/mmoga.service";
import { AuthGuard } from "@app/users/guards/auth.guards";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { DeleteResult } from "typeorm";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { UpdateAccountDto } from "./dto/updateAccount.dto";
import { AccountResponseInterface } from "./types/accountResponse.interface";
import { AccountsResponseInterface } from "./types/accountsResponse.interface";

@Controller()
export class AccountControler {
  constructor(
    private readonly accountService: AccountService
  )
  {}

  @Get('accounts')
  @UseGuards(AuthGuard)
  async findAll(): Promise<AccountsResponseInterface> {
    const accounts = await this.accountService.findAll()
    return {accounts}
  }

  @Get('accounts/:status')
  @UseGuards(AuthGuard)
  async findAllByStatus(@Param('status') status: string): Promise<AccountsResponseInterface> {
    const accounts = await this.accountService.findAllByStatus(status)
    return { accounts }
  }


  @Post('account')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async createAccount(@Body('account') createAccountDto: CreateAccountDto): Promise<AccountsResponseInterface> {
    const accounts = await this.accountService.createAccount(createAccountDto)
    return {accounts}
  }

  @Put('account/:id')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async updateAccount(@Param('id') id: number, @Body('account') updateAccountDto: UpdateAccountDto): Promise<AccountResponseInterface> {
    const account = await this.accountService.updateAccount(updateAccountDto, id)
    return {account}
  }

  @Delete('account/:id')
  @UseGuards(AuthGuard)
  async deleteAccount(@Param('id') id: number) {
    return await this.accountService.deleteAccount(id)
  }
}