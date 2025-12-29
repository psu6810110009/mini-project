import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common'; // <--- รวมของครบที่บรรทัดนี้
import { AuthGuard } from '@nestjs/passport'; // <--- เพิ่มบรรทัดนี้ด้วย
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 1. สมัครสมาชิก
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  // 2. ล็อกอิน
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // 3. ดูข้อมูลส่วนตัว (ต้องมี Token)
  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}