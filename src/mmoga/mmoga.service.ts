import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import mmogaConfig from './mmoga.config'
import { OrdersResponseInterface } from "./types/ordersResponse.interface";
const md5 = require('md5')
const { parseStringPromise } = require('xml2js')
import axios from 'axios'
import { CategoriesService } from "@app/categories/categories.service";
import { MmogaHelper } from "./helpers/mmoga.helper";
import { AccountService } from "@app/accounts/account.service";
import { VerificateAccountHelper } from "@app/accounts/helpers/verificateAccount.helper";
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
@Injectable()
export class MmogaService {
  protected mmogaHelper = new MmogaHelper()
  protected isDeamonExecuteOrder = null
  protected cron = new CronJob('10 */45 * * * *', async () => {
    console.log('cron task start')
    await this.execute()
    console.log('cron task end')
  })
  constructor (
    private readonly categoriesService: CategoriesService,
    private readonly accountService: AccountService,
    private readonly scheduleRegistry: SchedulerRegistry
  ) {
    this.scheduleRegistry.addCronJob('mmogaDeamon', this.cron)
    this.scheduleRegistry.getCronJob('mmogaDeamon').stop()
  }

  getStateDeamon(): boolean {
    if (this.isDeamonExecuteOrder === null || this.isDeamonExecuteOrder == 'false') {
      return false
    }
    return true
  }

  async changeDeamonState(status: string) {
    if (this.isDeamonExecuteOrder != status) {
      this.isDeamonExecuteOrder = status
      if (status == 'true') {
        const task = this.scheduleRegistry.getCronJob('mmogaDeamon')
        console.log('task starteed')
        task.start()
      } else {
        const task = this.scheduleRegistry.getCronJob('mmogaDeamon')
        console.log('task stopped')
        task.stop()
      }
      return `Deamon status has been changed to ${this.isDeamonExecuteOrder}`
    }
    throw new HttpException('status already exist', HttpStatus.CONFLICT)
  }

  async executeOrder(orderId: string, accountId: number): Promise<OrdersResponseInterface> {

    const endOrder = []
    const categories = await this.categoriesService.findAllCategories()
    const account = await this.accountService.findById(accountId)
    const {orders} = await this.getAllOrders('progressing')
    const order = orders.filter(c => c.categoryId === account.categoryId)
    if (account.status === 'pending') {
     for (let i = 0; i < order.length; i++) {
        if (order[i].id[0] === orderId ) {
          for (const category of categories) {
            if (category.id === account.categoryId) {
              const filters = this.mmogaHelper.makeObj(category.rule)
              if (filters.validate == 'true') {
                // validate account
                const accountInfo = JSON.parse(account.info)
                const deamon = new VerificateAccountHelper()
		let status = ''
		try {
			status = await deamon.verificate(accountInfo.account.login, accountInfo.account.password, accountInfo.account.lastmatch)
		}
		catch(err) {
			console.log(err)
			status = await deamon.verificate(accountInfo.account.login, accountInfo.account.password, accountInfo.account.lastmatch)
		
		}
		console.log(status, 'From mmoga service')
               // const status = await deamon.verificate(accountInfo.account.login, accountInfo.account.password, accountInfo.account.lastmatch)
                if (status === 'pending') {
                  for (let i = 0; i < orders.length; i++) {
                    if (account.categoryId === orders[i]?.categoryId) {
                      try {
                        await this.provide(orders[i], account)
                        await this.accountService.updateAccount({ categoryId: account.categoryId, status: 'closed' }, account.id)
                        delete orders[i].categoryId /* ?????????????? ?????????????????? ?? ???????????? */
                        endOrder.push({
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
                } else {
                  await this.accountService.updateAccount({ categoryId: account.categoryId, status }, account.id)
                  throw new HttpException('Account not valid', HttpStatus.CONFLICT)
                }
              } else {
                for (let i = 0; i < orders.length; i++) {
                  if (account.categoryId == orders[i]?.categoryId) {
                    try {
                      await this.provide(orders[i], account)
                      await this.accountService.updateAccount({ categoryId: account.categoryId, status: 'closed' }, account.id)
                      delete orders[i].categoryId /* ?????????????? ?????????????????? ?? ???????????? */
                      endOrder.push({
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
            }
          }
        }
      } 
    }
    
    return { orders: endOrder }
  }

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
      .then(json => {
        typeof json['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ns1:getOrdersResponse'][0].return[0].item !== 'undefined' ? 
        orders = json['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['ns1:getOrdersResponse'][0].return[0].item : orders = []
      })
    }).catch(err => console.log(err.response.data, requestArgs, xml))

    if (orders.length > 0) {
      orders = this.mmogaHelper.mergeWithCategory(orders, categories)
    }

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

    const moreParams = {
      mule: {
        account: JSON.parse(account.info).account.login,
        password: JSON.parse(account.info).account.password
      }
    }

    const requestArgs = {
      id: order.id[0],
      key: mmogaConfig.key,
      checksum: md5(`${mmogaConfig.key}${order.id[0]}${JSON.stringify(moreParams)}${mmogaConfig.password}`),
      price: order.unitPriceFromXML[0]
    }

    const xml = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:urn="urn:mmogaSvc">
        <soapenv:Header/>
            <soapenv:Body>
                <urn:setComplete>
                    <id>${requestArgs.id}</id>
                    <key>${requestArgs.key}</key>
                    <moreParams>${JSON.stringify(moreParams)}</moreParams>
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
      console.log(order)
      if (!order.orderNum[0].length) {
        await this.setOrderNum(order)
      }
      if (order.unitPrice[0] !== order.unitPriceFromXML[0]) {
        await this.setOrderPrice(order)
      }
      return await this.setComplete(order, account)
    } catch (err) {
      console.log('ERRORRR')
      console.log(account)
      console.log(err.response.data)
      throw new HttpException(err.response.data, HttpStatus.CONFLICT)
    }
    
  }

  async execute(): Promise<OrdersResponseInterface> {
    const { orders } = await this.getAllOrders('progressing')
    const accounts = await this.accountService.findAllByStatus('pending')
    const categories = await this.categoriesService.findAllCategories()
    const closedOrders = []
    for await (const account of accounts) {
      for await (const category of categories) {
        if (category.id === account.categoryId) {
          const filters = this.mmogaHelper.makeObj(category.rule)
          if (filters.validate == 'true') {
            // validate account
            const accountInfo = JSON.parse(account.info)
            const status = await new VerificateAccountHelper().verificate(accountInfo.account.login, accountInfo.account.password, accountInfo.account.lastmatch)
            console.log(status, 'MMOGA SERVICE')
	    if (status == 'pending') {
              for (let i = 0; i < orders.length; i++) {
console.log(account.categoryId, orders[i].categoryId)
                if (account.categoryId == orders[i].categoryId) {
			console.log('Finded!')
                  try {
                    await this.provide(orders[i], account)
                    await this.accountService.updateAccount({ categoryId: account.categoryId, status: 'closed' }, account.id)
                    delete orders[i].categoryId /* ?????????????? ?????????????????? ?? ???????????? */
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
            } else {
		    console.log('Not found!')
              await this.accountService.updateAccount({ categoryId: account.categoryId, status }, account.id)
            }
          } else {
            for (let i = 0; i < orders.length; i++) {
              if (account.categoryId === orders[i]?.categoryId) {
                try {
                  await this.provide(orders[i], account)
                  await this.accountService.updateAccount({ categoryId: account.categoryId, status: 'closed' }, account.id)
                  delete orders[i].categoryId /* ?????????????? ?????????????????? ?? ???????????? */
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
        }
      }
      
    }

    return { orders: closedOrders }
  }
}
