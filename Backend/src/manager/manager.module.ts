import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerInfo } from './manager.entity';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { AdminInfo } from 'src/admin/admin.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerInfo, AdminInfo]), AuthModule],
  providers: [ManagerService],
  controllers: [ManagerController],
  exports: [ManagerService],
})
export class ManagerModule {}
