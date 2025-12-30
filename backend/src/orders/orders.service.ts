// ไฟล์: src/orders/orders.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { items } = createOrderDto;

    let totalPrice = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`ไม่พบสินค้า ID: ${item.productId}`);
      }

      // คำนวณราคา
      totalPrice += Number(product.price) * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const order = await this.prisma.order.create({
      data: {
        userId: userId,
        totalPrice: totalPrice, // <--- ตรงกับใน Database แล้ว
        status: 'PENDING',
        items: {
          create: orderItemsData,
        },
      },
      include: { items: true },
    });

    return order;
  }

  async findAll(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
  }
}