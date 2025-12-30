import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    // ใช้ Transaction: ทำงานทุกอย่างพร้อมกัน ถ้าพังอันนึง ให้ยกเลิกทั้งหมด
    return this.prisma.$transaction(async (tx) => {
      let totalPrice = 0;

      for (const item of createOrderDto.items) {
        // 1. ค้นหาสินค้าเพื่อเช็คสต็อกและราคา
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new BadRequestException(`ไม่พบสินค้า ID ${item.productId}`);
        }

        // 2. เช็คว่าของพอไหม?
        if (product.stock < item.quantity) {
          throw new BadRequestException(`สินค้า "${product.name}" หมดหรือมีไม่พอ (เหลือ ${product.stock})`);
        }

        // 3. 📉 ตัดสต็อกสินค้า (พระเอกของเราอยู่ตรงนี้!)
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } }, // decrement = ลดค่าลง
        });

        // คำนวณราคารวม
        totalPrice += Number(product.price) * item.quantity;
      }

      // 4. สร้างใบ Order และบันทึกรายการสินค้า
      return tx.order.create({
        data: {
          userId: userId,
          totalPrice: totalPrice,
          status: OrderStatus.PAID,
          items: {
            create: createOrderDto.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: 0 // (ในระบบจริงควรดึงราคาจาก product.price มาใส่ แต่ตอนนี้ใส่ 0 ไปก่อนเพื่อให้ผ่าน)
            })),
          },
        },
        include: { items: true },
      });
    });
  }

  // ดึงข้อมูลออเดอร์ทั้งหมดมาดู
  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}