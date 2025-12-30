import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    // ⚠️ หมายเหตุ: เรา Hardcode userId = 1 ไว้ก่อน 
    // (ต้องมั่นใจว่าใน DB มี User ID 1 อยู่แล้วนะครับ ไม่งั้นจะ Error 500)
    return this.ordersService.create(1, createOrderDto);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}