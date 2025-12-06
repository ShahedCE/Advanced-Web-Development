import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, Matches, IS_LENGTH, MaxLength } from 'class-validator';

export class CreateManagerDto {
  @IsString()
    @IsNotEmpty({ message: 'Fullname is required' })
   @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
      message: 'Fullname should contain only alphabets and spaces',
    })
  fullname: string;


   @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;


  @IsString()
  @IsNotEmpty({message: 'Password can not be empty'})
  @MinLength(6,{message: "Password must have atleast 6 characters"})
  password: string;

 
  @IsString()
  @IsNotEmpty({ message: 'Must give a phone number'})
  @MinLength(9,{message:'Give a valid phone number'})
  @MaxLength(14,{message:'Phone number can not be large than 14 digit'})
  phone: string;


  @IsString()
  @IsNotEmpty({message: 'Address field can not be empty'})
  address: string;

 //Already validated
  @IsOptional()
  @IsString({ message: 'filepath must be a string' })
  profile_picture?: string;

  @IsOptional()
  status?: 'active' | 'inactive' | 'suspended';
}
