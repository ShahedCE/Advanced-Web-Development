import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingProvider } from 'src/authentication/provider/hashing.provider';
import { Customer_profile } from 'src/customer_profile/customer_profile.entity';
import { IsNull, Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dtos/create_customer.dto';
import { UpdateCustomerDto } from './dtos/update_customer.dto';
import { UpdateCustomerPutDto } from './dtos/update_customer_put.dto';

@Injectable()
export class customerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepo: Repository<Customer>,

    @InjectRepository(Customer_profile)
    private readonly profileRepo: Repository<Customer_profile>,

    private readonly hasingProvider: HashingProvider,
  ) {}

  //------------------------------------------------- GET METHODS ------------------------------------------------------------
  public async getAllCustomers() {
    try {
      const customers = await this.customerRepo.find({
        relations: { profile: true },
      });

      if (!customers || customers.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No customers found',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Customers retrieved successfully',
        data: customers,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database connection problem',
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } //......................................................................................................................

  public async getCustomersWithNullFullName() {
    try {
      const customers = await this.customerRepo.find({
        where: [{ full_name: IsNull() }, { full_name: '' }],
      });

      if (!customers || customers.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'No customers found with null or empty full name',
            error: 'Not Found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Customers retrieved successfully',
        data: customers,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Database connection problem',
          error: error.message || 'Internal Server Error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  } //......................................................................................................................

  public TrackCustomerParcelById() {
    return 'Track All Customer Parcel successfully By Id';
  } //......................................................................................................................

  public getCustomerDetailInfo() {
    return 'Customer details retrieved successfully';
  } //......................................................................................................................

  // public async findCustomerByPhone(phone: string) {
  //   const customer = await this.customerRepo.findOne({ where: { phone, } });

  //   if (!customer) {
  //     throw new NotFoundException(`Customer with phone number ${phone} not found`);
  //   }

  //   return customer;
  // }

  public async findCustomerByPhone(phone: string) {
    // Customer খুঁজুন এবং প্রোফাইল রিলেশনসহ লোড করুন
    const customer = await this.customerRepo.findOne({
      where: { phone },
      relations: ['profile'], // যদি Customer entity-তে profile relation থাকে
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with phone number ${phone} not found`,
      );
    }

    return customer; // এখন customer সাথে তার profile থাকবে
  }

  //......................................................................................................................

  public async getCustomerById(id: number) {
    const customer = await this.customerRepo.findOne({ where: { id } });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  } //......................................................................................................................

  //------------------------------------------------- POST METHODS ------------------------------------------------------------
  public async createCustomer(customer: CreateCustomerDto) {
    const existingCustomer = await this.customerRepo.findOne({
      where: [{ phone: customer.phone }],
    });

    if (existingCustomer) {
      throw new HttpException(
        {
          statusCode: HttpStatus.CONFLICT,
          message: 'Customer with this phone or email already exists',
          error: 'Conflict',
        },
        HttpStatus.CONFLICT,
      );
    }

    customer.profile = customer.profile ?? {};
    const profileEntity = this.profileRepo.create(customer.profile);
    await this.profileRepo.save(profileEntity);

    const cus = this.customerRepo.create({
      ...customer,
      password: await this.hasingProvider.hashpassword(customer.password),
      profile: profileEntity,
    });

    const savedCustomer = await this.customerRepo.save(cus);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Customer created successfully!!!!!!!!!!!',
      data: savedCustomer,
    };
  } //......................................................................................................................

  //------------------------------------------------- PUT METHODS ------------------------------------------------------------
  public async replaceCustomer(id: number, updateData: UpdateCustomerPutDto) {
    const existingCustomer = await this.customerRepo.findOne({ where: { id } });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const replacedCustomer = this.customerRepo.create({
      ...updateData,
      id: existingCustomer.id,
    });

    await this.customerRepo.save(replacedCustomer);
    return 'Customer replaced successfully';
  } //......................................................................................................................

  //------------------------------------------------- PATCH METHODS ------------------------------------------------------------
  public async updateCustomerById(id: number, updateData: UpdateCustomerDto) {
    const existingCustomer = await this.customerRepo.findOne({ where: { id } });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    const updatedCustomer = this.customerRepo.merge(
      existingCustomer,
      updateData,
    );
    await this.customerRepo.save(updatedCustomer);

    return 'Customer updated successfully';
  } //......................................................................................................................

  public async updateCustomerByPhone(
    phone: string,
    updateData: UpdateCustomerDto,
  ) {
    const existingCustomer = await this.customerRepo.findOne({
      where: { phone },
    });
    if (!existingCustomer) {
      throw new NotFoundException(
        `Customer with phone number ${phone} not found`,
      );
    }

    const updatedCustomer = this.customerRepo.merge(
      existingCustomer,
      updateData,
    );
    await this.customerRepo.save(updatedCustomer);

    return 'Customer updated successfully by phone';
  } //......................................................................................................................

  //------------------------------------------------- DELETE METHODS ------------------------------------------------------------
  public async deleteCustomerById(id: number) {
    const existingCustomer = await this.customerRepo.findOne({ where: { id } });
    if (!existingCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    await this.customerRepo.delete(id);
    return `Customer with ID ${id} has been deleted successfully`;
  } //......................................................................................................................
}
