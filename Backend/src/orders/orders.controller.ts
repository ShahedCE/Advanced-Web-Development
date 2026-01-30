import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create order
  @Post('placeorder')
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req,
  ): Promise<Order> {
    // যদি customerId না থাকে কিন্তু ইউজার লগইন থাকে
    if (!createOrderDto.customerId && req.user) {
      createOrderDto.customerId = req.user.id; // JWT থেকে ইউজারের ID
    }

    // Optional: যদি কাস্টমার না থাকে, লগইন চেক করতে পারো
    // if (!createOrderDto.customerId) throw new UnauthorizedException('Login required to place order');

    return await this.ordersService.create(createOrderDto);
  }

  // Fetch all orders
  @Get()
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  // Fetch single order by id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order | null> {
    return await this.ordersService.findOne(Number(id));
  }
}
