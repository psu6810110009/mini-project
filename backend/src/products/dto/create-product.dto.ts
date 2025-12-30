export class CreateProductDto {
  name: string;
  description?: string; // เครื่องหมาย ? แปลว่า "มีหรือไม่ก็ได้"
  price: number;
  stock: number;
  imageUrl?: string;
}
