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
    let returnableValue = args.account

    if (args.condition) {
      const skinCount = +args.filter.skins.split('').slice(1).join('')
      switch (args.filter.skins.split('').shift()) {
        case '>': if (fields.skinCount > skinCount) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '<': if (fields.skinCount < skinCount) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        case '=': if (fields.skinCount == skinCount) { returnableValue = this.mergeAccount(args.account, args.category) } break;
        default: returnableValue = args.account;
      }
    } else if (args.payload) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeValorant(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const valorantPt = +args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    let returnableValue = args.account

    switch (valorantFlag) {
      case '>': if (fields.valorantPoints > valorantPt) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      case '<': if (fields.valorantPoints < valorantPt) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      case '=': if (fields.valorantPoints == valorantPt) { returnableValue = this.mergeAccount(args.account, args.category) } break;
      default: returnableValue = args.account;
    }

    return returnableValue
  }

  protected mergeRegion(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const region = args.filter.region.split('').slice(1).join('')
    let returnableValue = args.account

    if (fields.region.index === region) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsRange(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const skinsRange = args.filter.split('-')
    let returnableValue = args.account

    if (skinsRange[0] <= fields.skinCount && skinsRange[1] >= fields.skinCount) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeBan(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const ban = args.filter.ban.split('').slice(1).join('')
    let returnableValue = args.account

    if (ban == fields.ban) {
      returnableValue = this.mergeAccount(args.account, args.category)
    }

    return returnableValue
  }

  protected mergeSkinsWithValorant(
    args: FilterInteface
  ) {
    const fields = args.account.account
    const valorantPt = +args.filter.valorantPoints.split('').slice(1).join('')
    const valorantFlag = args.filter.valorantPoints.split('').shift()
    let returnableValue = args.account

    if (args.condition) {
      const skinCount = +args.filter.skins.split('').slice(1).join('')
      const skinFlag = args.filter.skins.split('').shift()
      
      if (valorantFlag == '>' && skinFlag == '>' && fields.skinCount > skinCount && fields.valorantPoints > valorantPt) {
        returnableValue = this.mergeAccount(args.account, args.category)
      } else if (valorantFlag == '>' && skinFlag == '<' && fields.skinCount > skinCount && fields.valorantPoints < valorantPt) {
        returnableValue = this.mergeAccount(args.account, args.category)
      } else if (valorantFlag == '<' && skinFlag == '<' && fields.skinCount < skinCount && fields.valorantPoints < valorantPt) {
        returnableValue = this.mergeAccount(args.account, args.category)
      } else if (valorantFlag == '<' && skinFlag == '>' && fields.skinCount < skinCount && fields.valorantPoints > valorantPt) {
        returnableValue = this.mergeAccount(args.account, args.category)
      }
    } else if (args.payload) {
      returnableValue = this.mergeValorant(args)
    }

    return returnableValue
  }

  protected mergeAction (
    condition,
    elseCondition,
    account,
    filter,
    category,
    skinFilterRangeEndpoint?,
    skinsRange?
  ) {
    const accountProperty = account.account
    if (!filter.hasOwnProperty('valorantPoints') && !filter.hasOwnProperty('skinsRange')) {
      if (condition) {
        switch (filter.skins.split('').shift()) {
          case '>':
            return accountProperty.skinCount >= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccount(account, category)) : false
          case '<':
            return accountProperty.skinCount <= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccount(account, category)) : false
          case '=':
            return accountProperty.skinCount == skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccount(account, category)) : false
        }
      } else {
        if (elseCondition) {
          return Object.assign(account, this.mutateAccount(account, category))
        }
      }
    } else {
      if (condition && filter.hasOwnProperty('skins') && !filter.hasOwnProperty('skinsRange')) {
        const skinProp = filter.skins.split('').shift()
        const valorantProp = filter.valorantPoints.split('').shift()
        const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number

        if (skinProp === '>' && valorantProp === '>') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '>' && valorantProp === '<') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '<') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '>') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '<') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '>') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '=') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '>' && valorantProp === '=') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '=') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccount(account, category)) : false
        }

      } else if (filter.hasOwnProperty('valorantPoints') && !filter.hasOwnProperty('skinsRange')) {
        const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number
        const valorantProp = filter.valorantPoints.split('').shift()
        if (condition) {
          switch (valorantProp) {
            case '>':
              return accountProperty.valorantPoints >= valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false
            case '<':
              return accountProperty.valorantPoints <= valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false
            case '=':
              return accountProperty.valorantPoints == valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false
          }
        }
      } else if (!filter.hasOwnProperty('valorantPoints') && filter.hasOwnProperty('skinsRange')) {
        const minRange = +skinsRange[0]
        const maxRange = +skinsRange[1]
        if (accountProperty.skinCount >= minRange && accountProperty.skinCount <= maxRange) {
          return Object.assign(account, this.mutateAccount(account, category))
        } else {
          return account
        }
      } else if (filter.hasOwnProperty('valorantPoints') && filter.hasOwnProperty('skinsRange')) {
        const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number
        const valorantProp = filter.valorantPoints.split('').shift()
        const minRange = +skinsRange[0]
        const maxRange = +skinsRange[1]
        if (condition) {
          switch (valorantProp) {
            case '>':
              return accountProperty.valorantPoints >= valorantPoints && (accountProperty.skinCount >= minRange && accountProperty.skinCount <= maxRange)? Object.assign(account, this.mutateAccount(account, category)) : false
            case '<':
              return accountProperty.valorantPoints <= valorantPoints && (accountProperty.skinCount >= minRange && accountProperty.skinCount <= maxRange)? Object.assign(account, this.mutateAccount(account, category)) : false
            case '=':
              return accountProperty.valorantPoints == valorantPoints && (accountProperty.skinCount >= minRange && accountProperty.skinCount <= maxRange)? Object.assign(account, this.mutateAccount(account, category)) : false
          }
        }
      }
    }
  }

  public merge () {
    this.accounts.forEach((account: any) => {
      this.categories.forEach(category => {
        const filter = this.makeObj(category.rule)
        const accountProperty = account.account
        if (filter.strictMode.split('').slice(1).join('') === 'false') {

          if (
            filter.hasOwnProperty('skins') &&
            !filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints') &&
            !filter.hasOwnProperty('skinsRange')
          ) {
            account = this.mergeSkins({
              condition: Number.isInteger(+filter.skins.split('').slice(1).join('')),
              account: account,
              filter: filter,
              category: category,
              payload: account.account.skins.indexOf(filter.skins.split('').slice(1).join('')) !== -1
            })
          } else if (
            !filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints') &&
            !filter.hasOwnProperty('skinsRange')
          ) {
            account = this.mergeRegion({
              account: account,
              filter: filter,
              category: category
            })
          } else
            if (
              filter.hasOwnProperty('skins') &&
              filter.hasOwnProperty('region') &&
              !filter.hasOwnProperty('ban') &&
              !filter.hasOwnProperty('valorantPoints') &&
              !filter.hasOwnProperty('skinsRange')
            ) {
              console.log(account)
              account = Object.assign(this.mergeSkins({
                condition: Number.isInteger(+filter.skins.split('').slice(1).join('')),
                account: account,
                filter: filter,
                category: category,
                payload: account.account.skins.indexOf(filter.skins.split('').slice(1).join('')) !== -1
              }), this.mergeRegion({
                account: account,
                filter: filter,
                category: category
              }))
            } else
              if (
                filter.hasOwnProperty('skins') &&
                filter.hasOwnProperty('region') &&
                filter.hasOwnProperty('ban') &&
                !filter.hasOwnProperty('valorantPoints') &&
                !filter.hasOwnProperty('skinsRange')
              ) {
                const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                const region = filter.region.split('').slice(1).join('')
                const ban = filter.ban.split('').slice(1).join('')
                account = this.mergeAction(
                  (Number.isInteger(skinFilterRangeEndpoint) && accountProperty.region.index === region && ban === 'No'),
                  (accountProperty.skins.indexOf(filter.skins) !== -1 && accountProperty.region.index === region && ban === 'No'),
                  account,
                  filter,
                  category,
                  skinFilterRangeEndpoint
                )
              } else
                if (
                  filter.hasOwnProperty('skins') &&
                  !filter.hasOwnProperty('region') &&
                  filter.hasOwnProperty('ban') &&
                  !filter.hasOwnProperty('valorantPoints') &&
                  !filter.hasOwnProperty('skinsRange')
                ) {
                  const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                  const ban = filter.ban.split('').slice(1).join('')
                  account = this.mergeAction(
                    (Number.isInteger(skinFilterRangeEndpoint) && ban === 'No'),
                    (accountProperty.skins.indexOf(filter.skins) !== -1 && ban === 'No'),
                    account,
                    filter,
                    category,
                    skinFilterRangeEndpoint
                  )
                } else
                  if (
                    !filter.hasOwnProperty('skins') &&
                    filter.hasOwnProperty('region') &&
                    filter.hasOwnProperty('ban') &&
                    !filter.hasOwnProperty('valorantPoints') &&
                    !filter.hasOwnProperty('skinsRange')
                  ) {
                    const region = filter.region.split('').slice(1).join('')
                    const ban = filter.ban.split('').slice(1).join('')
                    account = this.mergeAction(
                      (accountProperty.region.index === region && ban === 'No'),
                      (accountProperty.region.index !== region && ban === 'No'),
                      account,
                      filter,
                      category
                    )
                  } else
                    if (
                      filter.hasOwnProperty('skins') &&
                      filter.hasOwnProperty('region') &&
                      filter.hasOwnProperty('ban') &&
                      filter.hasOwnProperty('valorantPoints') &&
                      !filter.hasOwnProperty('skinsRange')
                    ) {
                      const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                      const region = filter.region.split('').slice(1).join('')
                      const ban = filter.ban.split('').slice(1).join('')
                      account = this.mergeAction(
                        (Number.isInteger(skinFilterRangeEndpoint) && accountProperty.region.index === region && ban === 'No'),
                        (accountProperty.skins.indexOf(filter.skins) !== -1 && accountProperty.region.index !== region && ban === 'No'),
                        account,
                        filter,
                        category,
                        skinFilterRangeEndpoint
                      )
                    } else
                      if (
                        !filter.hasOwnProperty('skins') &&
                        filter.hasOwnProperty('region') &&
                        filter.hasOwnProperty('ban') &&
                        filter.hasOwnProperty('valorantPoints') &&
                        !filter.hasOwnProperty('skinsRange')
                      ) {
                        const region = filter.region.split('').slice(1).join('')
                        const ban = filter.ban.split('').slice(1).join('')
                        account = this.mergeAction(
                          (accountProperty.region.index === region && ban === 'No'),
                          (accountProperty.region.index === region && ban === 'No'),
                          account,
                          filter,
                          category
                        )
                      } else
                        if (
                          !filter.hasOwnProperty('skins') &&
                          !filter.hasOwnProperty('region') &&
                          filter.hasOwnProperty('ban') &&
                          filter.hasOwnProperty('valorantPoints') &&
                          !filter.hasOwnProperty('skinsRange')
                        ) {
                          const ban = filter.ban.split('').slice(1).join('')
                          account = this.mergeAction(
                            (ban === 'No'),
                            (ban === 'No'),
                            account,
                            filter,
                            category
                          )
                        } else
                          if (
                            !filter.hasOwnProperty('skins') &&
                            !filter.hasOwnProperty('region') &&
                            !filter.hasOwnProperty('ban') &&
                            filter.hasOwnProperty('valorantPoints') &&
                            !filter.hasOwnProperty('skinsRange')
                          ) {
                            const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number
                            const valorantProp = filter.valorantPoints.split('').shift()

                            switch (valorantProp) {
                              case '>':
                                accountProperty.valorantPoints >= valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false; break;
                              case '<':
                                accountProperty.valorantPoints <= valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false; break;
                              case '=':
                                accountProperty.valorantPoints == valorantPoints ? Object.assign(account, this.mutateAccount(account, category)) : false; break;
                            }
                          } else
                          if (
                            !filter.hasOwnProperty('skins') &&
                            !filter.hasOwnProperty('region') &&
                            !filter.hasOwnProperty('ban') &&
                            !filter.hasOwnProperty('valorantPoints') &&
                            filter.hasOwnProperty('skinsRange')
                          ) {
                            const skinsRange = filter.skinsRange.split('-') // splitter "-"

                            account = this.mergeAction(
                              true,
                              true,
                              account,
                              filter,
                              category,
                              null,
                              skinsRange
                            )
                          }
                          else
                            if (
                              !filter.hasOwnProperty('skins') &&
                              filter.hasOwnProperty('region') &&
                              !filter.hasOwnProperty('ban') &&
                              !filter.hasOwnProperty('valorantPoints') &&
                              filter.hasOwnProperty('skinsRange')
                            ) {
                              const skinsRange = filter.skinsRange.split('-') // splitter "-"
                              const region = filter.region.split('').slice(1).join('')
                              account = this.mergeAction(
                                accountProperty.region.index === region,
                                accountProperty.region.index !== region,
                                account,
                                filter,
                                category,
                                null,
                                skinsRange
                              )
                            }
                            else
                              if (
                                !filter.hasOwnProperty('skins') &&
                                filter.hasOwnProperty('region') &&
                                filter.hasOwnProperty('ban') &&
                                !filter.hasOwnProperty('valorantPoints') &&
                                filter.hasOwnProperty('skinsRange')
                              ) {
                                const skinsRange = filter.skinsRange.split('-') // splitter "-"
                                const region = filter.region.split('').slice(1).join('')
                                const ban = filter.ban.split('').slice(1).join('')
                                account = this.mergeAction(
                                  (accountProperty.region.index === region && ban === 'No'),
                                  (accountProperty.region.index === region && ban === 'No'),
                                  account,
                                  filter,
                                  category,
                                  null,
                                  skinsRange
                                )
                              }
                              else
                                if (
                                  !filter.hasOwnProperty('skins') &&
                                  filter.hasOwnProperty('region') &&
                                  filter.hasOwnProperty('ban') &&
                                  filter.hasOwnProperty('valorantPoints') &&
                                  filter.hasOwnProperty('skinsRange')
                                ) {
                                  const skinsRange = filter.skinsRange.split('-') // splitter "-"
                                  const region = filter.region.split('').slice(1).join('')
                                  const ban = filter.ban.split('').slice(1).join('')
                                  account = this.mergeAction(
                                    (accountProperty.region.index === region && ban === 'No'),
                                    (accountProperty.region.index === region && ban === 'No'),
                                    account,
                                    filter,
                                    category,
                                    null,
                                    skinsRange
                                  )
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