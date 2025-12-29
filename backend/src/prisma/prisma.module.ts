import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService], // <--- บรรทัดนี้สำคัญมาก!
})
export class PrismaModule {}