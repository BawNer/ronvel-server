import { AuthGuard } from "@app/users/guards/auth.guards";
import { Controller, Get, Post, Param, UseGuards, Body } from "@nestjs/common";
import { MmogaService } from "./mmoga.service";
import { OrdersResponseInterface } from "./types/ordersResponse.interface";


@Controller('mmoga')
export class MmogaController {
  constructor(
    private readonly mmogaService: MmogaService
  ) {}

  @Get('orders/:status')
  @UseGuards(AuthGuard)
  async getAllOrders(@Param('status') status: string): Promise<OrdersResponseInterface> {
    return await this.mmogaService.getAllOrders(status)
  }

  @Post('orders/execute')
  @UseGuards(AuthGuard)
  async execute(): Promise<OrdersResponseInterface> {
    return await this.mmogaService.execute()
  }

  @Post('orders/deamon/:status')
  @UseGuards(AuthGuard)
  async changeStateDeamon(@Param('status') status: string): Promise<string> {
    return await this.mmogaService.changeDeamonState(status)
  }

  @Get('orders/deamon/status') 
  @UseGuards(AuthGuard)
  getStateDeamon(): boolean {
    return this.mmogaService.getStateDeamon()
  }

  @Post('execute/:orderId')
  @UseGuards(AuthGuard)
  async executeOrder(@Param('orderId') orderId: string, @Body('accountId') accountId: number): Promise<OrdersResponseInterface> {
    return await this.mmogaService.executeOrder(orderId, accountId)
  }
}