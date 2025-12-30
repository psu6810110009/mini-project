import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from '../prisma/prisma.module'; // <--- เพิ่มบรรทัดนี้

@Module({
  imports: [PrismaModule], // <--- ใส่ตรงนี้ด้วย
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}