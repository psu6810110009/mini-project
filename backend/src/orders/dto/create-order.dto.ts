import { IsNumber, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 1. สร้าง Class ย่อยสำหรับ "รายการสินค้าแต่ละบรรทัด"
class OrderItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}

// 2. Class หลักสำหรับ "ใบสั่งซื้อ"
export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // ตรวจสอบข้อมูลใน Array ทุกตัว
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}