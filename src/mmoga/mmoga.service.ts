import { HttpCode, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import mmogaConfig from './mmoga.config'
import { OrdersResponseInterface } from "./types/ordersResponse.interface";
const md5 = require('md5')
const { parseStringPromise } = require('xml2js')
import axios from 'axios'
import { CategoriesService } from "@app/categories/categories.service";
import { MmogaHelper } from "./helpers/mmoga.helper";
import { AccountService } from "@app/accounts/account.service";

@Injectable()
export class MmogaService {
  protected mmogaHelper = new MmogaHelper()
  constructor (
    private readonly categoriesService: CategoriesService,
    private readonly accountService: AccountService
  ) {}

  async getAllOrders(status: string): Promise<OrdersResponseInterface> {

    const categories = await this.categoriesService.findAllCategories()
    let orders = []

    const requestArgs = {
      key: mmogaConfig.key,
      checksum: md5(`${mmogaConfig.key}${status}${mmogaConfig.password}`)
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:mmogaSvc">
        <soapenv:Header/>
            <soapenv:Body>
                <urn:getOrders>
                    <status>${status}</status>
                    <key>${requestArgs.key}</key>
                    <checksum>${requestArgs.checksum}</checksum>
                </urn:getOrders>
            </soapenv:Body>
    </soapenv:Envelope>
    `

    await axios.post(mmogaConfig.url, xml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    }).then(res => {
      parseStringPromise(res.data)
      .then(json => orders = json['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ns1:getOrdersResponse'][0].return[0].item)
    }).catch(err => console.log(err))

    orders.forEach(order => {
      const game = order.game[0]
      const orderParts = game.split(',')
      const accountOrderPart = orderParts[0].split(' ')
      const skinOrderPart = orderParts[1].split(' ')
      const skinRange = this.mmogaHelper.skinRange(skinOrderPart)

      categories.forEach(category => {
        const filter = this.mmogaHelper.makeObj(category.rule)
        const skinFilterRangeEndpoint = +filter?.skins.split('').slice(1).join('') // filter endpoint range if number, NaN if string

        if (
          filter.hasOwnProperty('skins') &&
          !filter.hasOwnProperty('region') &&
          accountOrderPart.indexOf('Region') === -1
        ) {
          if (
            skinRange &&
            Number.isInteger(skinFilterRangeEndpoint) // true = number; false = string
          ) {
            const switchMap = filter.skins.split('').shift()
            switch (switchMap) {
              case '>':
                if (+skinRange[0] > skinFilterRangeEndpoint || +skinRange[1] > skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
              case '<':
                if (+skinRange[0] < skinFilterRangeEndpoint && +skinRange[1] > skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
              case '=':
                if (+skinRange[0] == skinFilterRangeEndpoint || +skinRange[1] == skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
            }
          } else {
            if (skinOrderPart.indexOf(filter.skins) !== -1) {
              Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
            }
          }
          // filter with region and skins
        } else if (
          filter.hasOwnProperty('skins') &&
          filter.hasOwnProperty('region')
        ) {
          if (
            skinRange &&
            Number.isInteger(skinFilterRangeEndpoint) && // true = number; false = string
            accountOrderPart.indexOf(filter.region) !== -1
          ) {
            const switchMap = filter.skins.split('').shift()
            switch (switchMap) {
              case '>':
                if (+skinRange[0] > skinFilterRangeEndpoint || +skinRange[1] > skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
              case '<':
                if (+skinRange[0] < skinFilterRangeEndpoint && +skinRange[1] > skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
              case '=':
                if (+skinRange[0] == skinFilterRangeEndpoint || +skinRange[1] == skinFilterRangeEndpoint) {
                  Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
                }
                break;
            }
          } else {
            if (skinOrderPart.indexOf(filter.skins) !== -1 && accountOrderPart.indexOf(filter.region) !== -1) {
              Object.assign(order, this.mmogaHelper.mutateOrderProperty(order, category))
            }
          }
        }
      })
    })

    return { orders }
  }

  async setOrderNum(order) {
    const orderNum = (Math.random() * Math.pow(36, 6) | 0).toString(36)

    const requestArgs = {
      id: order.id[0],
      key: mmogaConfig.key,
      checksum: md5(`${mmogaConfig.key}${order.id[0]}${orderNum}${mmogaConfig.password}`),
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:mmogaSvc">
        <soapenv:Header/>
            <soapenv:Body>
                <urn:setOrderNum>
                    <id>${requestArgs.id}</id>
                    <orderNum>${orderNum}</orderNum>
                    <key>${requestArgs.key}</key>
                    <checksum>${requestArgs.checksum}</checksum>
                </urn:setOrderNum>
            </soapenv:Body>
    </soapenv:Envelope>
    `

    return await axios.post(mmogaConfig.url, xml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })

  }

  async setOrderPrice(order) {

    const requestArgs = {
      id: order.id[0],
      key: mmogaConfig.key,
      checksum: md5(`${mmogaConfig.key}${order.id[0]}${order.unitPriceFromXML[0]}${mmogaConfig.password}`),
      price: order.unitPriceFromXML[0]
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:mmogaSvc">
        <soapenv:Header/>
            <soapenv:Body>
                <urn:setPrice>
                    <id>${requestArgs.id}</id>
                    <price>${requestArgs.price}</price>
                    <key>${requestArgs.key}</key>
                    <checksum>${requestArgs.checksum}</checksum>
                </urn:setPrice>
            </soapenv:Body>
    </soapenv:Envelope>
    `

    return await axios.post(mmogaConfig.url, xml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }

  async setComplete(order, account) {

    const moreParams = JSON.stringify({
      mule: {
        account: {
          account: JSON.parse(account.info).account.login,
          password: JSON.parse(account.info).account.password
        }
      }
    })

    const requestArgs = {
      id: order.id[0],
      key: mmogaConfig.key,
      checksum: md5(`${mmogaConfig.key}${order.id[0]}${moreParams}${mmogaConfig.password}`),
      price: order.unitPriceFromXML[0]
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:mmogaSvc">
        <soapenv:Header/>
            <soapenv:Body>
                <urn:setComplete>
                    <id>${requestArgs.id}</id>
                    <key>${requestArgs.key}</key>
                    <moreParams>${moreParams}</moreParams>
                    <checksum>${requestArgs.checksum}</checksum>
                </urn:setComplete>
            </soapenv:Body>
    </soapenv:Envelope>
    `

    return await axios.post(mmogaConfig.url, xml, {
      headers: {
        'Content-Type': 'text/xml'
      }
    })
  }

  async provide(order, account) {

    try {
      await this.setOrderNum(order)
      await this.setOrderPrice(order)
      return await this.setComplete(order, account)
    } catch (err) {
      throw new HttpException('fail', HttpStatus.CONFLICT)
    }
    
  }

  async execute (): Promise<OrdersResponseInterface> {
    const { orders } = await this.getAllOrders('progressing')
    const accounts = await this.accountService.findAllByStatus('pending')
    const closedOrders = []
    for (const account of accounts) {
      for (let i = 0; i < orders.length; i++) {
        if (account.categoryId === orders[i]?.categoryId) {
          try {
            await this.provide(orders[i], account)
            await this.accountService.updateAccount({categoryId: account.categoryId, status: 'closed'}, account.id)
            delete orders[i].categoryId /* удаляем категорию у заказа */
            closedOrders.push({
              orderId: orders[i].id[0],
              accountId: account.id,
              summ: orders[i].unitPriceFromXML[0],
              status: 'closed'
            })
            break;
          } catch (err) {
            throw new HttpException('fail', HttpStatus.CONFLICT)
          }
        }
      }
    }

    return { orders: closedOrders }
  }
}