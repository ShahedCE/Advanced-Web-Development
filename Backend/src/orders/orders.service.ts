import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';
import { PusherService } from 'src/pusher/pusher.service';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,
    private readonly pusherService: PusherService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Step 1: Create order entity
    const order = this.orderRepo.create({
      service: createOrderDto.service,
      date: createOrderDto.date,
      time: createOrderDto.time,
      address: createOrderDto.address,
      instructions: createOrderDto.instructions,
      phone: createOrderDto.phone,
      email: createOrderDto.email,
      paymentMethod: createOrderDto.paymentMethod,
      totalAmount: createOrderDto.totalAmount,
    });

    // Step 2: Attach customer if exists
    if (createOrderDto.customerId) {
      const customer = await this.customerRepo.findOne({
        where: { id: createOrderDto.customerId },
      });
      if (!customer) throw new NotFoundException('Customer not found');
      order.customer = customer;
    }

    // Step 3: Save order
    const savedOrder = await this.orderRepo.save(order);
    console.log('✅ Order saved in DB:', savedOrder);

    // Step 4: Trigger Pusher notification
    const notificationData = {
      id: savedOrder.id,
      service: savedOrder.service,
      date: savedOrder.date,
      time: savedOrder.time,
      address: savedOrder.address,
      instructions: savedOrder.instructions,
      phone: savedOrder.phone,
      email: savedOrder.email,
      paymentMethod: savedOrder.paymentMethod,
      totalAmount: savedOrder.totalAmount,
      customerId: savedOrder.customer?.id || null,
    };

    console.log('🔔 Sending Pusher notification:', notificationData);
    await this.pusherService.triggerOrderNotification(notificationData);
    console.log('✅ Pusher event triggered successfully');

    return savedOrder;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderRepo.find({ relations: ['customer'] });
  }

  async findOne(id: number): Promise<Order | null> {
    return await this.orderRepo.findOne({
      where: { id },
      relations: ['customer'],
    });
  }
}
