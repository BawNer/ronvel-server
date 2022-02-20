import { AuthGuard } from "@app/users/guards/auth.guards";
import { Body, Controller, Get, Post, Param, UseGuards } from "@nestjs/common";
import { ExecuteOrderDto } from "./dto/executeOrder.dto";
import { MmogaService } from "./mmoga.service";
import { OrderResponseInterface } from "./types/orderResponse.interface";
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

  @Post('execute')
  @UseGuards(AuthGuard)
  async execute(): Promise<OrdersResponseInterface> {
    return await this.mmogaService.execute()
  }

  // @Post('execute/:orderId')
  // @UseGuards(AuthGuard)
  // async executeOrder(@Param('orderId') orderId: number): Promise<OrderResponseInterface> {
  //   return 'as' as any
  // }
}