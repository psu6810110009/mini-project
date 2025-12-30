import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. เปิดให้คนอื่นเข้าถึงได้ (CORS)
  app.enableCors(); 

  // 2. ใช้ Port ที่ Server ให้มา หรือถ้าไม่มีให้ใช้ 3000
  await app.listen(process.env.PORT || 3000);
}
bootstrap();