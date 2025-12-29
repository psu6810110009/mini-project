import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  // Inject ทั้ง Prisma และ JwtService
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // --- ฟังก์ชัน 1: Register ---
  async register(createAuthDto: CreateAuthDto) {
    const { email, password, fullName } = createAuthDto;

    // เช็คว่ามีอีเมลนี้หรือยัง
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new ConflictException('Email นี้ถูกใช้งานแล้ว');
    }

    // เข้ารหัส Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง User ใหม่
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        role: 'USER',
      },
    });

    return { message: 'สมัครสมาชิกสำเร็จ', userId: user.id };
  } // <--- ปิดปีกกาของ register ตรงนี้ก่อน!

  // --- ฟังก์ชัน 2: Login (แยกออกมาใหม่อยู่ตรงนี้) ---
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // 1. หา User จาก Email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // 2. ถ้าไม่เจอ User หรือ รหัสผ่านไม่ตรง
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    // 3. สร้าง Payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. แจก Token
    return {
      access_token: this.jwtService.sign(payload),
      user: {
         id: user.id,
         email: user.email,
         fullName: user.fullName,
         role: user.role
      }
    };
  }
}