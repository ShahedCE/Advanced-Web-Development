import {
  IsEmail,
  IsMobilePhone,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { CustomerProfileDto } from 'src/customer_profile/dtos/customer_profile.dto';

export class CreateCustomerDto {
  // Full name (optional)
  @IsString()
  @IsOptional()
  full_name?: string;

  // Email (optional, must be valid format if provided)
  @IsEmail({}, { message: 'Invalid email address' })
  @IsOptional()
  email?: string;

  // Phone (required, must be valid Bangladeshi number)
  @IsNotEmpty({ message: 'Phone number is required' })
  @IsMobilePhone(
    'bn-BD',
    {},
    { message: 'Mobile number must be a valid Bangladeshi number' },
  )
  @IsNumberString({}, { message: 'Phone number must contain only digits' })
  phone: string; // Use string here for better phone handling

  // Password (required)
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  profile: CustomerProfileDto | null;
}
