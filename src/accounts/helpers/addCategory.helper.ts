import { CategoriesEntity } from "@app/categories/categories.entity";
import { CreateAccountDto } from "../dto/createAccount.dto";

export class AddCategoryHelper {
  protected accounts: []
  constructor (
    protected readonly categories: CategoriesEntity[],
    protected payload: CreateAccountDto
  ) {
    this.accounts = JSON.parse(payload.info)
  }

  protected mutateAccountProperty(account: any, category: any): object {
    if (!account.hasOwnProperty('category')) {
      return {
        categoryId: category.id
      }
    } else {
      if (account.weight < category.weight) {
        return {
          categoryId: category.id
        }
      }
    }
  }

  protected makeObj(rule: string): any {
    const rules: string[] = rule.split(',')
    const filters = {}
    rules.forEach(filter => {
      const key = filter.split(':').shift()
      const value = filter.split(':').pop()
      filters[key] = value
    })

    return filters
  }

  public merge() {
    this.accounts.forEach((account: any) => {
      this.categories.forEach(category => {
        const filter = this.makeObj(category.rule)
        const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
        const accountProperty = account.account
        if (
          filter.hasOwnProperty('skins') &&
          !filter.hasOwnProperty('region')
        ) {
          if (Number.isInteger(skinFilterRangeEndpoint)) {
            switch (filter.skins.split('').shift()) {
              case '>':
                accountProperty.skinCount >= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                break;
              case '<':
                accountProperty.skinCount <= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                break;
              case '=':
                accountProperty.skinCount == skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                break;
            }
          } else {
            if (accountProperty.skins.indexOf(filter.skins) !== -1) {
              Object.assign(account, this.mutateAccountProperty(account, category))
            }
          }
        } else
          if (
            filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region')
          ) {
            if (Number.isInteger(skinFilterRangeEndpoint) && accountProperty.region.index === filter.region) {
              switch (filter.skins.split('').shift()) {
                case '>':
                  accountProperty.skinCount >= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                  break;
                case '<':
                  accountProperty.skinCount <= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                  break;
                case '=':
                  accountProperty.skinCount == skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                  break;
              }
            } else {
              if (accountProperty.skins.indexOf(filter.skins) !== -1 && accountProperty.region.index === filter.region) {
                Object.assign(account, this.mutateAccountProperty(account, category))
              }
            }
          }
      })
    })
    return this.accounts
  }
}