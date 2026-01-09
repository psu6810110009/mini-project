import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ✅ 1. สั่งซื้อ (ใช้ ID จริงจาก Token)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.userId; // 👈 ดึง ID คนที่ล็อกอินอยู่มาใช้
    return this.ordersService.create(userId, createOrderDto);
  }

  // ✅ 2. เพิ่ม Route สำหรับดูประวัติของตัวเอง (ตามที่ React เรียกหา)
  @UseGuards(AuthGuard('jwt'))
  @Get('my-orders') // 👉 ตรงกับ /orders/my-orders
  findMyOrders(@Request() req) {
    const userId = req.user.userId;
    return this.ordersService.findUserOrders(userId); // 👈 ต้องไปสร้างฟังก์ชันนี้ใน Service ด้วย
  }

  // (อันนี้สำหรับ Admin ดูทั้งหมด)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }
}