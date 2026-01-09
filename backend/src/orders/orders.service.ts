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
      
      // ✅ แก้ไขตรงนี้: เติม : any[] เพื่อให้ push ข้อมูลใส่ได้
      const orderItemsData: any[] = []; 

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

        // 3. 📉 ตัดสต็อกสินค้า
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });

        // คำนวณราคารวม
        totalPrice += Number(product.price) * item.quantity;

        // เก็บข้อมูลไว้สร้าง OrderItem (จะได้บันทึกราคาจริง ไม่ใช่ 0)
        orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: Number(product.price) // ✅ บันทึกราคา ณ ตอนที่ซื้อ
        });
      }

      // 4. สร้างใบ Order และบันทึกรายการสินค้า
      return tx.order.create({
        data: {
          userId: userId,
          totalPrice: totalPrice,
          status: OrderStatus.PAID,
          items: {
            create: orderItemsData // ✅ ใช้ข้อมูลที่เตรียมไว้
          },
        },
        include: { items: true },
      });
    });
  }

  // ✅ ฟังก์ชันดึงประวัติการสั่งซื้อ "เฉพาะ User คนนั้น"
  async findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: {
        userId: userId, // 👈 กรองเอาเฉพาะ userId ของคนนั้น
      },
      include: {
        items: {
          include: {
            product: true, // ดึงรูปภาพและชื่อสินค้ามาโชว์ด้วย
          },
        },
      },
      orderBy: {
        createdAt: 'desc', // เรียงจาก ล่าสุด -> เก่าสุด
      },
    });
  }

  // ดึงข้อมูลออเดอร์ทั้งหมด (สำหรับ Admin)
  async findAll() {
    return this.prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}