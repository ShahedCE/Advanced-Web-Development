import { IsString, IsNotEmpty, IsOptional, IsEmail, MinLength, Matches, IS_LENGTH, MaxLength, IsEnum } from 'class-validator';

export class UpdateManagerDto {

  @IsOptional()
  @IsString()
    @IsNotEmpty({ message: 'Fullname is required' })
   @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
      message: 'Fullname should contain only alphabets and spaces',
    })
  fullname?: string;

  // Add password
  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password?: string;

  //  Add status
  @IsOptional()
  @IsEnum(['active', 'inactive'], { message: 'Status must be active or inactive' })
  status?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Must give a phone number'})
  @MinLength(9,{message:'Give a valid phone number'})
  @MaxLength(14,{message:'Phone number can not be large than 14 digit'})
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({message: 'Address field can not be empty'})
  address?: string;

 //Already validated
  @IsOptional()
  @IsString({ message: 'filepath must be a string' })
  profile_picture?: string;

}
