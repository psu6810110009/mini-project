import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // เพิ่มสินค้า (ต้อง Login)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // ดูสินค้าทั้งหมด
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ดูสินค้าเจาะจงชิ้น
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // ✅ แก้ไข (รวมร่าง: ใช้ PUT ให้ตรงกับ Frontend + ใส่ Guard เพื่อความปลอดภัย)
  @UseGuards(AuthGuard('jwt')) // บังคับ Login
  @Put(':id')                  // รับ Method PUT
  update(@Param('id') id: string, @Body() data: any) { 
    // ถ้ามี UpdateProductDto จะเปลี่ยนจาก any เป็น UpdateProductDto ก็ได้ครับ
    return this.productsService.update(+id, data);
  }

  // ลบ (ต้อง Login)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}