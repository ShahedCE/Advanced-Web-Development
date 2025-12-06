import { IsEmail, IsMobilePhone, IsNotEmpty, IsNumberString, IsString } from "class-validator";
import { CustomerProfileDto } from "src/customer_profile/dtos/customer_profile.dto";


export class UpdateCustomerPutDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsMobilePhone('bn-BD')
  @IsNumberString()
  phone: string;

  profile: CustomerProfileDto | null;
}
