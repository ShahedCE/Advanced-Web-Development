import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create_customer.dto';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}