import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      // ดึง Token จาก Header ที่ชื่อ Authorization: Bearer ...
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretKey123', // ต้องตรงกับตอนสร้าง Token ใน Module
    });
  }

  // เมื่อ Token ถูกต้อง ฟังก์ชันนี้จะทำงาน
  async validate(payload: any) {
    // คืนค่า User id และ Role ไปให้ Controller ใช้งานต่อ
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}