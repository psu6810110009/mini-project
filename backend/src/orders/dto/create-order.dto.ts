import { IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Class ย่อย (สินค้าแต่ละรายการ)
class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  @Min(1) // 👈 เพิ่มตรงนี้: ต้องสั่งอย่างน้อย 1 ชิ้น (ห้ามติดลบ หรือ 0)
  quantity: number;
}

// 2. Class หลัก
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}