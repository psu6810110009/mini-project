import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt'; // <--- เพิ่ม
import { PassportModule } from '@nestjs/passport'; // <--- เพิ่ม
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'secretKey123', // กุญแจลับสำหรับเซ็นชื่อบน Token (ของจริงควรเก็บใน .env)
      signOptions: { expiresIn: '1h' }, // Token หมดอายุใน 1 ชั่วโมง
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
