import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { authorizeGuards } from 'src/authentication/guards/authorize.guards';
import { customerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create_customer.dto';
import { UpdateCustomerDto } from './dtos/update_customer.dto';
import { UpdateCustomerPutDto } from './dtos/update_customer_put.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('customer')
export class CustomerController {
  constructor(private customer_service: customerService) {}

  //------------------------------------------------- GET METHODS ------------------------------------------------------------
    @UseGuards(AuthGuard)
@Get('all_customers')
  async getAllCustomers() {
    return await this.customer_service.getAllCustomers();
  } //..................................................................

  @Get('null')
  async getCustomersWithNullFullName() {
    return await this.customer_service.getCustomersWithNullFullName();
  } //..................................................................

    @UseGuards(AuthGuard)
@Get('track')
  TrackCustomerParcelById() {
    return 'Track All Customer Parcel successfully By Id';
  } //..................................................................

    @UseGuards(AuthGuard)
  @Get('Details')
  getCustomerDetails() {
    return 'Customer details retrieved successfully';
  } //..................................................................
  @UseGuards(AuthGuard)
  @Get('phone/:phone')
  async getCustomerByPhone(@Param('phone') phone: string) {
    return await this.customer_service.findCustomerByPhone(phone);
  } //..................................................................

  @Get('id/:id')
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    return await this.customer_service.getCustomerById(id);
  } //..................................................................

  //------------------------------------------------- POST METHODS ------------------------------------------------------------
   @UseGuards(AuthGuard)
 @Post('add_customers')
  async createCustomer(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    customer: CreateCustomerDto,
  ) {
    return await this.customer_service.createCustomer(customer);
  }
  //------------------------------------------------- PUT METHODS ------------------------------------------------------------
  @Put(':id')
  replaceCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) customer: UpdateCustomerPutDto,
  ) {
    return this.customer_service.replaceCustomer(id, customer);
  } //..................................................................

  //------------------------------------------------- PATCH METHODS ------------------------------------------------------------
  @Patch(':id')
  async updateCustomerById(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) customer: UpdateCustomerDto,
  ) {
    return await this.customer_service.updateCustomerById(+id, customer);
  } //..................................................................
  @Patch('by-phone/:phone')
  async updateCustomerByPhone(
    @Param('phone') phone: string,
    @Body(new ValidationPipe()) customer: UpdateCustomerDto,
  ) {
    return await this.customer_service.updateCustomerByPhone(phone, customer);
  } //..................................................................

  //------------------------------------------------- DELETE METHODS ------------------------------------------------------------
  @Delete(':id')
  async deleteCustomerById(@Param('id') id: number) {
    console.log('Deleting customer with ID: ${id}');
    return await this.customer_service.deleteCustomerById(+id);
  } //..................................................................
}
