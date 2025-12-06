import { IsNotEmpty, IsMobilePhone, IsNumberString, MinLength } from 'class-validator';

export class logInDto {


    // Phone (required, must be valid Bangladeshi number)
    @IsNotEmpty({ message: 'Phone number is required' })
    @IsMobilePhone('bn-BD', {}, { message: 'Mobile number must be a valid Bangladeshi number' })
    @IsNumberString({}, { message: 'Phone number must contain only digits' })
    phone: string; 


    // Password (required)
    @IsNotEmpty({ message: 'Password is required' })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;

 } 