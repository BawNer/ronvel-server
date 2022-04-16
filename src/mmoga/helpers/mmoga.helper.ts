export class MmogaHelper {

  public makeObj(rule: string): any {
    const rules: string[] = rule.split(',')
    const filters = {}
    rules.forEach(filter => {
      const key = filter.split(':').shift()
      const value = filter.split(':').pop()
      filters[key] = value
    })
    return filters
  }

  public skinRange(orderSkinPart: string[]): string[] | boolean {
    
    const firstSkinInput = orderSkinPart.indexOf('Skins')
    if (orderSkinPart.indexOf('Rare') == -1 && orderSkinPart[firstSkinInput - 1]) {
      return orderSkinPart[firstSkinInput-1].split("-")
    } else {
      return false
    }
  }

  public mutateOrderProperty(order: any, category: any): any {
    if (order.hasOwnProperty('weight')) {
      if (order.weight < category.weight) {
        return {
          ...order,
          categoryId: category.id,
          weight: category.weight
        }
      }
    } else {
      return {
        ...order,
        categoryId: category.id,
        weight: category.weight
      }
    }
  }

  public mergeSkins(order, skinOrderPart, category, filter) {
    const skinRange = this.skinRange(skinOrderPart)
    const skin = filter.skins.split('').slice(1).join('')
    let returnableValue = order

    if (Number.isInteger(+skin) && Array.isArray(skinRange)) {
      const skinFlag = filter.skins.split('').shift()
      switch(skinFlag) {
        case '>':
          if (+skinRange[0] > +skin || +skinRange[1] > +skin) {
            returnableValue = this.mutateOrderProperty(order, category)
          }
        break;
        case '<': 
          if (+skinRange[0] < +skin) {
            returnableValue = this.mutateOrderProperty(order, category)
          }
        break;
        case '=': 
          if (+skinRange[0] == +skin || +skinRange[1] == +skin) {
            returnableValue = this.mutateOrderProperty(order, category)
          }
        break;
      }
    } else {
      if (skinOrderPart.indexOf(skin) !== -1) {
        returnableValue = this.mutateOrderProperty(order, category)
      }
    }

    return returnableValue
  }

  public mergeSkinsWithRegion(order, skinOrderPart, accountOrderPart, category, filter) {
    const region = filter.region
    let returnableValue = order
    
    if (accountOrderPart.indexOf(region) !== -1 || (region == 'NA' && accountOrderPart.indexOf('Random') !== -1)) {
      returnableValue = this.mergeSkins(order, skinOrderPart, category, filter)
    }

    return returnableValue
  }

  public mergeRegion(order, accountOrderPart, category, filter) {
    const region = filter.region
    let returnableValue = order

    if (accountOrderPart.indexOf(region) !== -1 || (region == 'NA' && accountOrderPart.indexOf('Random') !== -1)) {
      returnableValue = this.mutateOrderProperty(order, category)
    }

    return returnableValue
  }

  public mergeRegionWithSkinRange(order, skinOrderPart, accountOrderPart, category, filter) {
    const region = filter.region
    const skinRange = this.skinRange(skinOrderPart)
    const skinRangeFilter = filter.skinRange.split('-')
    let returnableValue = order

    if ((accountOrderPart.indexOf(region) !== -1 || (region == 'NA' && accountOrderPart.indexOf('Random') !== -1)) && Array.isArray(skinRange)) {
      if (+skinRangeFilter[0] <= +skinRange[0] && +skinRangeFilter[1] >= +skinRange[1]) {
        returnableValue = this.mutateOrderProperty(order, category)
      }
    }

    return returnableValue
  }

  public mergeSkinRange(order, skinOrderPart, category, filter) {
    const skinRange = this.skinRange(skinOrderPart)
    const skinRangeFilter = filter.skinRange.split('-')
    let returnableValue = order

    if (Array.isArray(skinRange)) {
      if ( +skinRangeFilter[0] <= +skinRange[0] && +skinRangeFilter[1] >= +skinRange[1]) {
        returnableValue = this.mutateOrderProperty(order, category)
      }
    }

    return returnableValue
  }

  public mergeWithCategory(orders, categories) {
    orders.forEach(order => {
      const game = order.game[0]
      const orderParts = game.split(',')
      const accountOrderPart = orderParts[0].split(' ')
      const skinOrderPart = orderParts[1].split(' ')
      

      categories.forEach(category => {
        const filter = this.makeObj(category.rule)
        
        if (filter.strictMode == 'false') {

          if (
            filter.hasOwnProperty('skins') &&
            !filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('skinRange')
          ) {
            Object.assign(order, this.mergeSkins(order, skinOrderPart, category, filter))
          } else if (
            filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('skinRange')
          ) {
            Object.assign(order, this.mergeSkinsWithRegion(order, skinOrderPart, accountOrderPart, category, filter))
          } else if (
            !filter.hasOwnProperty('skins') &&
            filter.hasOwnProperty('region') &&
            !filter.hasOwnProperty('skinRange')) {
              Object.assign(order, this.mergeRegion(order, accountOrderPart, category, filter))
            } else if (
              !filter.hasOwnProperty('skins') &&
              filter.hasOwnProperty('region') &&
              filter.hasOwnProperty('skinRange')
            ) {
              Object.assign(order, this.mergeRegionWithSkinRange(order, skinOrderPart, accountOrderPart, category, filter))
            } else if (
              !filter.hasOwnProperty('skins') &&
              !filter.hasOwnProperty('region') &&
              filter.hasOwnProperty('skinRange')
            ) {
              Object.assign(order, this.mergeSkinRange(order, skinOrderPart, category, filter))
            }
        } else {
          if (game.split(' ').join('').toLowerCase() == category.name.split(' ').join('').toLowerCase()) {
            Object.assign(order, this.mutateOrderProperty(order, category))
          }
        }

      })  
    })

    return orders
  }
}