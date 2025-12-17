import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { jwtConstants } from './constants';
import { AdminInfo } from '../admin/admin.entity';
import { ManagerInfo } from '../manager/manager.entity';
import { AuthGuard } from './auth.guard';
import { Customer } from 'src/customer/customer.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([AdminInfo, ManagerInfo, Customer]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  providers: [AuthService, AuthGuard], // AuthGuard include
  controllers: [AuthController],
  exports: [AuthService, AuthGuard], // AuthGuard export
})
export class AuthModule {}
