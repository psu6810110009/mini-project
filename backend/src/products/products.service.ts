import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // 1. เพิ่มสินค้าใหม่
  create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: createProductDto,
    });
  }

  // 2. ดูสินค้าทั้งหมด
  findAll() {
    return this.prisma.product.findMany();
  }

  // 3. ดูสินค้าทีละชิ้น (ตาม id)
  findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  // 4. แก้ไขสินค้า
  update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // 5. ลบสินค้า
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}