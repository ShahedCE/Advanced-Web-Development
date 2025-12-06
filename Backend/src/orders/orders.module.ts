import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';
import { PusherService } from 'src/pusher/pusher.service'; // ✅ Import PusherService
import { Order } from './order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Customer])],
  providers: [OrdersService, PusherService], // ✅ Add PusherService here
  controllers: [OrdersController],
})
export class OrdersModule {}
