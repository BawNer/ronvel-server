export class MmogaHelper {

  public makeObj(rule: string): any {
    const rules: string[] = rule.split('').indexOf(',') !== -1 ? rule.split(',') : [rule]
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
    if (orderSkinPart.indexOf('Rare') === -1 && orderSkinPart[firstSkinInput - 1]) {
      return orderSkinPart[firstSkinInput-1].split(" ").join('').split("-")
    } else {
      return false
    }
  }

  public mutateOrderProperty(order: any, category: any): any {
    if (order.hasOwnProperty('weight')) {
      if (order.weight < category.weight) {
        return {
          categoryId: category.id,
          weight: category.weight
        }
      }
    } else {
      return {
        categoryId: category.id,
        weight: category.weight
      }
    }
  }
}