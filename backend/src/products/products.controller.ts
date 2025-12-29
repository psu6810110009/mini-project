import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // เพิ่มสินค้า (ต้อง Login ก่อนถึงจะเพิ่มได้)
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // ดูสินค้าทั้งหมด (ใครๆ ก็ดูได้ ไม่ต้อง Login)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // ดูสินค้าเจาะจงชิ้น
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id); // ใส่ + เพื่อแปลง string เป็น number
  }

  // แก้ไข (ต้อง Login)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  // ลบ (ต้อง Login)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}