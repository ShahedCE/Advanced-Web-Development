import { IsString, IsEmail, Matches, IsNotEmpty,  IsNumber, MinLength} from 'class-validator';
import { Type } from 'class-transformer';

export class LoginAdminDto{

  @IsString()
  @IsNotEmpty({ message: 'Fullname is required' })
 @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
    message: 'Fullname should contain only alphabets and spaces',
  })
  fullname: string;

    @IsString()
    @IsNotEmpty({message: 'Password can not be empty'})
    @MinLength(6,{message: "Password must have atleast 6 characters"})
    password: string;
  




}