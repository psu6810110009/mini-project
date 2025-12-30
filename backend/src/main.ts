import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'; // 1. เพิ่มบรรทัดนี้

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิดให้คนอื่นเข้าถึงได้ (CORS)
  app.enableCors();

  // --- 2. ส่วนตั้งค่า Swagger (เริ่ม) ---
  const config = new DocumentBuilder()
    .setTitle('Mini Project API')           // ชื่อเอกสาร
    .setDescription('คู่มือการใช้งาน API')    // คำอธิบาย
    .setVersion('1.0')
    .addBearerAuth()                        // เพิ่มปุ่มใส่ Token (รูปกุญแจ)
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // เข้าผ่านลิงก์ /api
  // --- ส่วนตั้งค่า Swagger (จบ) ---

  // ใช้ Port ที่ Server ให้มา หรือถ้าไม่มีให้ใช้ 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();