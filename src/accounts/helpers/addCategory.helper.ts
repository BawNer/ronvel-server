import { CategoriesEntity } from "@app/categories/categories.entity";
import { MmogaHelper } from "@app/mmoga/helpers/mmoga.helper";
import { CreateAccountDto } from "../dto/createAccount.dto";
import { FilterInteface } from "../types/categoryFilters.interface";

export class AddCategoryHelper {
  protected accounts: []
  protected mmogaHelper: MmogaHelper
  constructor(
    protected readonly categories: CategoriesEntity[],
    protected payload: CreateAccountDto,
  ) {
    this.accounts = JSON.parse(payload.info)
  }

  protected mutateAccount (account: any, category: any): object {
    if (!account.hasOwnProperty('weight')) {
      return {
        categoryId: category.id,
        weight: category.weight
      }
    } else {
      if (account.weight < category.weight) {
        return {
          categoryId: category.id,
          weight: category.weight
        }
      }
    }
  }

  protected makeObj (rule: string): any {
    const rules: string[] = rule.split(',')
    const filters = {}
    rules.forEach(filter => {
      const key = filter.split(':').shift()
      const value = filter.split(':').pop()
      filters[key] = value
    })

    return filters
  }

  protected mergeAccount(account, category) {
    return Object.assign(account, this.mutateAccount(account, category))
  }

  protected mergeSkins(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    let returnableValue = args.account

    if (Number.isInteger(+skin)) {
      const flag = args.filter.skins.split('').shift()
      switch (flag) {
        case '>': if (fields.skinCount > +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '<': if (fields.skinCount < +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '=': if (fields.skinCount == +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      }
    } else if (fields.skins.indexOf(skin) !== -1) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsWithRegion(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const region = args.filter.region
    let returnableValue = args.account

    if (Number.isInteger(+skin) && fields.region.index == region) {
      const flag = args.filter.skins.split('').shift()
      switch (flag) {
        case '>': if (fields.skinCount > +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '<': if (fields.skinCount < +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '=': if (fields.skinCount == +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      }
    } else if (fields.skins.indexOf(skin) !== -1 && fields.region.index == region) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsWithValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const valorantPt = args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    let returnableValue = args.account

    if (Number.isInteger(+skin)) {
      const skinFlag = args.filter.skins.split('').shift()
      if (skinFlag == '>' && valorantFlag == '>') {
        if (fields.skinCount > skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '<') {
        if (fields.skinCount < skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '>' && valorantFlag == '<') {
        if (fields.skinCount > skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '>') {
        if (fields.skinCount < skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      }
    } else if (fields.skins.indexOf(skin) !== -1) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeSkinsWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const ban = args.filter.ban
    let returnableValue = args.account

    if (Number.isInteger(+skin) && ban == fields.ban) {
      const flag = args.filter.skins.split('').shift()
      switch (flag) {
        case '>': if (fields.skinCount > +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '<': if (fields.skinCount < +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '=': if (fields.skinCount == +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      }
    } else if (fields.skins.indexOf(skin) !== -1 && ban == fields.ban) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsWithRegionWithValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const valorantPt = args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    const region = args.filter.region
    let returnableValue = args.account

    if (Number.isInteger(+skin) && fields.region.index == region) {
      const skinFlag = args.filter.skins.split('').shift()
      if (skinFlag == '>' && valorantFlag == '>') {
        if (fields.skinCount > skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '<') {
        if (fields.skinCount < skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '>' && valorantFlag == '<') {
        if (fields.skinCount > skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '>') {
        if (fields.skinCount < skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      }
    } else if (fields.skins.indexOf(skin) !== -1 && fields.region.index == region) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeSkinsWithRegionWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const region = args.filter.region
    const ban = args.filter.ban
    let returnableValue = args.account

    if (Number.isInteger(+skin) && ban == fields.ban && region == fields.region.index) {
      const flag = args.filter.skins.split('').shift()
      switch (flag) {
        case '>': if (fields.skinCount > +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '<': if (fields.skinCount < +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '=': if (fields.skinCount == +skin) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      }
    } else if (fields.skins.indexOf(skin) !== -1 && ban == fields.ban && region == fields.region.index) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsWithRegionWithValorantPointsWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skin = args.filter.skins.split('').slice(1).join('')
    const valorantPt = args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    const region = args.filter.region
    const ban = args.filter.ban
    let returnableValue = args.account

    if (Number.isInteger(+skin) && fields.region.index == region && fields.ban == ban) {
      const skinFlag = args.filter.skins.split('').shift()
      if (skinFlag == '>' && valorantFlag == '>') {
        if (fields.skinCount > skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '<') {
        if (fields.skinCount < skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '>' && valorantFlag == '<') {
        if (fields.skinCount > skin && fields.valorantPoints < valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      } else if (skinFlag == '<' && valorantFlag == '>') {
        if (fields.skinCount < skin && fields.valorantPoints > valorantPt) {
          returnableValue = this.mergeAccount(args.account, args.category)
        }
      }
    } else if (fields.skins.indexOf(skin) !== -1 && fields.region.index == region && fields.ban == ban) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeRegion (
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    let returnableValue = args.account

    if (fields.region.index == region) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeRegionWithValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    let returnableValue = args.account

    if (fields.region.index == region) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeRegionWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    let returnableValue = args.account

    if (fields.region.index == region) {
      returnableValue = this.mergeBan(args)
    }

    return returnableValue
  }

  protected mergeRegionWithSkinRange(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    let returnableValue = args.account

    if (fields.region.index == region) {
      returnableValue = this.mergeSkinRange(args)
    }

    return returnableValue
  }

  protected mergeRegionWithValorantPointsWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    const ban = args.filter.ban
    let returnableValue = args.account

    if (fields.region.index == region && fields.ban == ban) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeRegionWithValorantPointsWithSkinRange(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    const skinRange = args.filter.skinRange.split('-')
    let returnableValue = args.account

    if (fields.region.index == region) {
      if (fields.skinCount >= skinRange[0] && fields.skinCount <= skinRange[1]) {
        returnableValue = this.mergeValorantPoints(args)
      }
    }

    return returnableValue
  }

  protected mergeRegionWithSkinRangeWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    const ban = args.filter.ban
    let returnableValue = args.account

    if (fields.region.index == region && fields.ban == ban) {
      returnableValue = this.mergeSkinRange(args)
    }

    return returnableValue
  }

  protected mergeRegionWithValorantPointsWithSkinRangeWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region
    const ban = args.filter.ban
    const skinRange = args.filter.skinRange.split('-')
    let returnableValue = args.account

    if (fields.region.index == region && fields.ban == ban) {
      if (fields.skinCount >= skinRange[0] && fields.skinCount <= skinRange[1]) {
        returnableValue = this.mergeValorantPoints(args)
      }
    }

    return returnableValue
  }

  protected mergeSkinRange (
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skinRange = args.filter.skinRange.split('-')
    let returnableValue = args.account

    if (skinRange[0] <= fields.skinCount && skinRange[1] >= fields.skinCount) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinRangeWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const ban = args.filter.ban
    let returnableValue = args.account

    if (fields.ban == ban) {
      returnableValue = this.mergeSkinRange(args)
    }

    return returnableValue
  }

  protected mergeSkinRangeWithValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skinRange = args.filter.skinRange.split('-')
    let returnableValue = args.account

    if (skinRange[0] <= fields.skinCount && skinRange[1] >= fields.skinCount) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeSkinRangeWithBanWithBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skinRange = args.filter.skinRange.split('-')
    const ban = args.filter.ban
    let returnableValue = args.account

    if ((skinRange[0] <= fields.skinCount && skinRange[1] >= fields.skinCount) && fields.ban == ban) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  protected mergeValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const valorantPt = +args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    let returnableValue = args.account

    switch (valorantFlag) {
      case '>': if (fields.valorantPoints > valorantPt) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      case '<': if (fields.valorantPoints < valorantPt) { returnableValue = this.mergeAccount(args.account, args.category) } break;
    }

    return returnableValue
  }

  protected mergeBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const ban = args.filter.ban
    let returnableValue = args.account

    if (ban == fields.ban) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeBanWithValorantPoints(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const ban = args.filter.ban
    let returnableValue = args.account

    if (ban == fields.ban) {
      returnableValue = this.mergeValorantPoints(args)
    }

    return returnableValue
  }

  public merge () {
    this.accounts.forEach((account: any) => {
      this.categories.forEach(category => {
        const filter = this.makeObj(category.rule)
        if (filter.strictMode == 'false') {

          if (
            filter.hasOwnProperty('skins') &&
            !filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints') &&
            !filter.hasOwnProperty('skinRange')
          ) {
            account = this.mergeSkins({
              account,
              filter,
              category,
            })
          } else if (
            !filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints') &&
            !filter.hasOwnProperty('skinRange')
          ) {
            account = this.mergeRegion({
              account,
              filter,
              category,
            })
          } else if (
              filter.hasOwnProperty('skins') &&
              filter.hasOwnProperty('region') &&
              !filter.hasOwnProperty('ban') &&
              !filter.hasOwnProperty('valorantPoints') &&
              !filter.hasOwnProperty('skinRange')
            ) {
              account = this.mergeSkinsWithRegion({
                account,
                filter,
                category
              })
            } else if (
                filter.hasOwnProperty('skins') &&
                filter.hasOwnProperty('region') &&
                filter.hasOwnProperty('ban') &&
                !filter.hasOwnProperty('valorantPoints') &&
                !filter.hasOwnProperty('skinRange')
              ) {
                account = this.mergeSkinsWithRegionWithBan({
                  account,
                  filter,
                  category
                })
              } else if (
                  filter.hasOwnProperty('skins') &&
                  !filter.hasOwnProperty('region') &&
                  filter.hasOwnProperty('ban') &&
                  !filter.hasOwnProperty('valorantPoints') &&
                  !filter.hasOwnProperty('skinRange')
                ) {
                  account = this.mergeSkinsWithBan({
                    account,
                    filter,
                    category
                  })
                } else if (
                    !filter.hasOwnProperty('skins') &&
                    filter.hasOwnProperty('region') &&
                    filter.hasOwnProperty('ban') &&
                    !filter.hasOwnProperty('valorantPoints') &&
                    !filter.hasOwnProperty('skinRange')
                  ) {
                    account = this.mergeRegionWithBan({
                      account,
                      filter,
                      category
                    })
                  } else if (
                      filter.hasOwnProperty('skins') &&
                      filter.hasOwnProperty('region') &&
                      filter.hasOwnProperty('ban') &&
                      filter.hasOwnProperty('valorantPoints') &&
                      !filter.hasOwnProperty('skinRange')
                    ) {
                      account = this.mergeSkinsWithRegionWithValorantPointsWithBan({
                        account,
                        filter,
                        category
                      })
                    } else if (
                        !filter.hasOwnProperty('skins') &&
                        filter.hasOwnProperty('region') &&
                        filter.hasOwnProperty('ban') &&
                        filter.hasOwnProperty('valorantPoints') &&
                        !filter.hasOwnProperty('skinRange')
                      ) {
                        account = this.mergeRegionWithValorantPointsWithBan({
                          account,
                          filter,
                          category
                        })
                      } else if (
                          !filter.hasOwnProperty('skins') &&
                          !filter.hasOwnProperty('region') &&
                          filter.hasOwnProperty('ban') &&
                          filter.hasOwnProperty('valorantPoints') &&
                          !filter.hasOwnProperty('skinRange')
                        ) {
                          account = this.mergeBanWithValorantPoints({
                            account,
                            filter,
                            category
                          })
                        } else if (
                            !filter.hasOwnProperty('skins') &&
                            !filter.hasOwnProperty('region') &&
                            !filter.hasOwnProperty('ban') &&
                            filter.hasOwnProperty('valorantPoints') &&
                            !filter.hasOwnProperty('skinRange')
                          ) {
                            account = this.mergeValorantPoints({
                              account,
                              filter,
                              category
                            })
                          } else if (
                            !filter.hasOwnProperty('skins') &&
                            !filter.hasOwnProperty('region') &&
                            !filter.hasOwnProperty('ban') &&
                            !filter.hasOwnProperty('valorantPoints') &&
                            filter.hasOwnProperty('skinRange')
                          ) {
                            account = this.mergeSkinRange({
                              account,
                              filter,
                              category
                            })
                          }
                          else
                            if (
                              !filter.hasOwnProperty('skins') &&
                              filter.hasOwnProperty('region') &&
                              !filter.hasOwnProperty('ban') &&
                              !filter.hasOwnProperty('valorantPoints') &&
                              filter.hasOwnProperty('skinRange')
                            ) {
                              account = this.mergeRegionWithSkinRange({
                                account,
                                filter,
                                category
                              })
                            }
                            else
                              if (
                                !filter.hasOwnProperty('skins') &&
                                filter.hasOwnProperty('region') &&
                                filter.hasOwnProperty('ban') &&
                                !filter.hasOwnProperty('valorantPoints') &&
                                filter.hasOwnProperty('skinRange')
                              ) {
                                account = this.mergeRegionWithSkinRangeWithBan({
                                  account,
                                  filter,
                                  category
                                })
                              }
                              else
                                if (
                                  !filter.hasOwnProperty('skins') &&
                                  filter.hasOwnProperty('region') &&
                                  filter.hasOwnProperty('ban') &&
                                  filter.hasOwnProperty('valorantPoints') &&
                                  filter.hasOwnProperty('skinRange')
                                ) {
                                  account = this.mergeRegionWithValorantPointsWithSkinRangeWithBan({
                                    account,
                                    filter,
                                    category
                                  })
                                }
        } else {
          Object.assign(account, { categoryId: null, weight: -1 })
        }
      })
    })
    return this.accounts
  }

  public mergeWithCategory(categoryId) {
    this.accounts.forEach((account: any) => {
      this.categories.forEach(category => {
        if (category.id == categoryId) {
          account = Object.assign(account, this.mutateAccount(account, category))
        }
      })
    })
    return this.accounts
  }
}