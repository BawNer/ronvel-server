import { CategoriesService } from "@app/categories/categories.service";
import { MmogaService } from "@app/mmoga/mmoga.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository } from "typeorm";
import { AccountEntity } from "./account.entity";
import { CreateAccountDto } from "./dto/createAccount.dto";
import { UpdateAccountDto } from "./dto/updateAccount.dto";
import { AddCategoryHelper } from "./helpers/addCategory.helper";
import { VerificateAccountHelper } from "./helpers/verificateAccount.helper";

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    private readonly categoriesService: CategoriesService
  ) {}

  async findAll(): Promise<AccountEntity[]> {
    const accounts = await this.accountRepository.find()
    return accounts
  }
  async findAllByStatus(status: string): Promise<AccountEntity[]> {
    const accounts = await this.accountRepository.find({status})
    return accounts
  }

  async createAccount(createAccountDto: CreateAccountDto): Promise<AccountEntity[]> {
    const resultsAccount: AccountEntity[] = []
    const categories = await this.categoriesService.findAllCategories()
    const mergeCategoiesWitAccount = new AddCategoryHelper(categories, createAccountDto)
    const accounts: any = mergeCategoiesWitAccount.merge()
    for (const account of accounts) {
      const newAccount = new AccountEntity()
      const fields: CreateAccountDto = {
        categoryId: !account.categoryId ? null : account.categoryId,
        status: 'pending',
        info: JSON.stringify({ game: account.game, account: account.account })
      }
      Object.assign(newAccount, fields)
      const result = await this.accountRepository.save(newAccount)
      resultsAccount.push(result)
    }
    return resultsAccount
  }

  async createAccountWithcategory (createAccountDto: CreateAccountDto, categoryId: number): Promise<AccountEntity[]> {
    const resultsAccount: AccountEntity[] = []
    const categories = await this.categoriesService.findAllCategories()
    const mergeCategoiesWitAccount = new AddCategoryHelper(categories, createAccountDto)
    const accounts: any = mergeCategoiesWitAccount.mergeWithCategory(categoryId)
    for (const account of accounts) {
      const newAccount = new AccountEntity()
      const fields: CreateAccountDto = {
        categoryId: account.categoryId,
        status: 'pending',
        info: JSON.stringify({ game: account.game, account: account.account })
      }
      Object.assign(newAccount, fields)
      const result = await this.accountRepository.save(newAccount)
      resultsAccount.push(result)
    }
    return resultsAccount
  }

  async createAccountFromRawText(createAccountDto: CreateAccountDto): Promise<AccountEntity[]> {
    const accounts = JSON.parse(createAccountDto.info)
    const result: AccountEntity[] = []
    for (const account of accounts) {
      if (account.login.length == 0 || account.password.length == 0) {
        continue
      }
      const newAccount = new AccountEntity()
      const fields: CreateAccountDto = {
        categoryId: createAccountDto.categoryId,
        status: 'pending',
        info: JSON.stringify({
          account: {
            login: account.login,
            password: account.password
          }
        })
      }
      Object.assign(newAccount, fields)
      result.push(await this.accountRepository.save(newAccount))
    }

    return result
  }

  async updateAccount(updateAccountDto: UpdateAccountDto, id: number): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne(id)

    if (!account) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    delete account.category

    Object.assign(account, updateAccountDto)


    return await this.accountRepository.save(account)
  }

  async findById (id: number): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne(id)
    if (!account) {
      throw new HttpException('bad credintails', HttpStatus.FORBIDDEN)
    }
    return Object.assign(new AccountEntity(), account)
  }

  async deleteAccount(id: number): Promise<DeleteResult> {
    const account = await this.accountRepository.findOne(id)
    if (!account) {
      throw new HttpException('Credentials are not valid', HttpStatus.UNPROCESSABLE_ENTITY)
    }

    return await this.accountRepository.delete(id)
  }

  async deleteAllAccounts(): Promise<DeleteResult[]> {
    const deleteResult = []
    const accounts = await this.findAll()
    for (const account of accounts) {
      const deletedAccount = await this.accountRepository.delete({ id: account.id })
      deleteResult.push(deletedAccount)
    }
    
    return deleteResult
  }

  async deleteAccountsByCategory(categoryId: number): Promise<DeleteResult> {
    return await this.accountRepository.delete({categoryId})
  }

  async deleteAccountsByStatus(status: string): Promise<DeleteResult> {
    return await this.accountRepository.delete({status})
  }
}