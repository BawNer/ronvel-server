import { CategoriesEntity } from "@app/categories/categories.entity";
import { MmogaHelper } from "@app/mmoga/helpers/mmoga.helper";
import { CreateAccountDto } from "../dto/createAccount.dto";

export class AddCategoryHelper {
  protected accounts: []
  protected mmogaHelper: MmogaHelper
  constructor (
    protected readonly categories: CategoriesEntity[],
    protected payload: CreateAccountDto,
  ) {
    this.accounts = JSON.parse(payload.info)
  }

  protected mutateAccountProperty(account: any, category: any): object {
    if (!account.hasOwnProperty('categoryWeight')) {
      return {
        categoryId: category.id,
        categoryWeight: category.weight
      }
    } else {
      if (account.categoryWeight < category.weight) {
        return {
          categoryId: category.id,
          categoryWeight: category.weight
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

  protected mergeAction(
    condition,
    elseCondition,
    account,
    filter,
    category,
    skinFilterRangeEndpoint?
  ) {
    const accountProperty = account.account
    if (!filter.hasOwnProperty('valorantPoints')) {
      if (condition) {
        switch (filter.skins.split('').shift()) {
          case '>':
            return accountProperty.skinCount >= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
          case '<':
            return accountProperty.skinCount <= skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
          case '=':
            return accountProperty.skinCount == skinFilterRangeEndpoint ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
        }
      } else {
        if (elseCondition) {
          return Object.assign(account, this.mutateAccountProperty(account, category))
        }
      }
    } else {
      if (condition && filter.hasOwnProperty('skins')) {
        const skinProp = filter.skins.split('').shift()
        const valorantProp = filter.valorantPoints.split('').shift()
        const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number

        if (skinProp === '>' && valorantProp === '>') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '>' && valorantProp === '<') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '<') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '>') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '<') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints < valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '>') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints > valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '=' && valorantProp === '=') {
          return (accountProperty.skinCount == skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '>' && valorantProp === '=') {
          return (accountProperty.skinCount > skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        } else if (skinProp === '<' && valorantProp === '=') {
          return (accountProperty.skinCount < skinFilterRangeEndpoint) && (accountProperty.valorantPoints == valorantPoints) ?
            Object.assign(account, this.mutateAccountProperty(account, category)) : false
        }

      } else {
        const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number
        const valorantProp = filter.valorantPoints.split('').shift()
        if (condition) {
          switch (valorantProp) {
            case '>':
              return accountProperty.valorantPoints >= valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
            case '<':
              return accountProperty.valorantPoints <= valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
            case '=':
              return accountProperty.valorantPoints == valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
          }
        }
      }
    }
  }

  public merge() {
    this.accounts.forEach((account: any) => {
      this.categories.forEach(category => {
        const filter = this.makeObj(category.rule)
        const accountProperty = account.account

          if (
            filter.hasOwnProperty('skins') &&
            !filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints')
          ) {
            const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
            account = this.mergeAction(
              Number.isInteger(skinFilterRangeEndpoint),
              (accountProperty.skins.indexOf(filter.skins) !== -1),
              account,
              filter,
              category,
              skinFilterRangeEndpoint
            )
          } else if (
            !filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('ban') &&
            !filter.hasOwnProperty('valorantPoints')
          ) {
            const region = filter.region.split('=').pop()
            accountProperty.region.index === region ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
          } else
            if (
              filter.hasOwnProperty('skins') &&
              filter.hasOwnProperty('region') &&
              !filter.hasOwnProperty('ban') &&
              !filter.hasOwnProperty('valorantPoints')
            ) {
              const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
              const region = filter.region.split('=').pop()
              account = this.mergeAction(
                (accountProperty.region.index === region),
                (accountProperty.region.index === region),
                account,
                filter,
                category,
                skinFilterRangeEndpoint
              )
            } else
              if (
                filter.hasOwnProperty('skins') &&
                filter.hasOwnProperty('region') &&
                filter.hasOwnProperty('ban') &&
                !filter.hasOwnProperty('valorantPoints')
              ) {
                const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                const region = filter.region.split('=').pop()
                const ban = filter.ban.split('=').pop()
                account = this.mergeAction(
                  (Number.isInteger(skinFilterRangeEndpoint) && accountProperty.region.index === region && ban === 'No'),
                  (accountProperty.skins.indexOf(filter.skins) !== -1 && accountProperty.region.index === region && ban === 'Yes'),
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
                  !filter.hasOwnProperty('valorantPoints')
                ) {
                  const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                  const ban = filter.ban.split('=').pop()
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
                    !filter.hasOwnProperty('valorantPoints')
                  ) {
                    const region = filter.region.split('=').pop()
                    const ban = filter.ban.split('=').pop()
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
                      filter.hasOwnProperty('valorantPoints')
                    ) {
                      const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string
                      const region = filter.region.split('=').pop()
                      const ban = filter.ban.split('=').pop()
                      account = this.mergeAction(
                        (Number.isInteger(skinFilterRangeEndpoint) && accountProperty.region.index === region && ban === 'No'),
                        (accountProperty.skins.indexOf(filter.skins) !== -1 && accountProperty.region.index !== region && ban === 'Yes'),
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
                        filter.hasOwnProperty('valorantPoints')
                      ) {
                        const region = filter.region.split('=').pop()
                        const ban = filter.ban.split('=').pop()
                        account = this.mergeAction(
                          (accountProperty.region.index === region && ban === 'No'),
                          (accountProperty.region.index === region && ban === 'Yes'),
                          account,
                          filter,
                          category
                        )
                      } else
                        if (
                          !filter.hasOwnProperty('skins') &&
                          !filter.hasOwnProperty('region') &&
                          filter.hasOwnProperty('ban') &&
                          filter.hasOwnProperty('valorantPoints')
                        ) {
                          const ban = filter.ban.split('=').pop()
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
                            filter.hasOwnProperty('valorantPoints')
                          ) {
                            const valorantPoints = +filter.valorantPoints.split('').slice(1).join('') // number
                            const valorantProp = filter.valorantPoints.split('').shift()

                            switch (valorantProp) {
                              case '>':
                                return accountProperty.valorantPoints >= valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                              case '<':
                                return accountProperty.valorantPoints <= valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                              case '=':
                                return accountProperty.valorantPoints == valorantPoints ? Object.assign(account, this.mutateAccountProperty(account, category)) : false
                            }
                          } 
      })
    })
    return this.accounts
  }
}