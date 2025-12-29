import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto'; // <--- อย่าลืมบรรทัดนี้!

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // เส้นทางสมัครสมาชิก: POST /auth/register
  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  // เส้นทางล็อกอิน: POST /auth/login  <--- ส่วนที่คุณน่าจะขาดไป
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}