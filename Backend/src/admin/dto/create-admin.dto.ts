import { IsString, IsEmail, Matches, IsNotEmpty, MinLength, MaxLength, IsNumber, Min, Max, IsIn, IsOptional} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAdminDto {

 /* @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @Matches(/^[A-Za-z\s]+$/, {message: 'Name should contain only alphabets and spaces',})
  name: string;

  @Type(() => Number)
  @IsNumber({},{ message: 'ID must be a number.' })
  @IsNotEmpty({ message: 'ID is required.' })
  id: number;

  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @Matches(/@.*\.xyz$/, { message: 'Email must contain "@" and end with ".xyz" domain',})
  email: string;

  //valid NID formation
  @IsString()
  @IsNotEmpty({ message: 'NID is required' })
  @MinLength(13, { message: 'NID must be at least 10 digits' })
  @MaxLength(17, { message: 'NID must be at most 17 digits' })
  @Matches(/^\d+$/, { message: 'NID must contain only digits' })
  nid: string;
*/
  @IsString()
  @IsNotEmpty({ message: 'Fullname is required' })
 @Matches(/^[A-Za-z][A-Za-z\s]*$/, {
    message: 'Fullname should contain only alphabets and spaces',
  })
  fullname: string;

  
   @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Age must be a number.' })
  @Min(18, { message: 'Age must be at least 18' }) // optional constraint
  @Max(100, { message: 'Age must be at most 100' }) // optional
  @IsNotEmpty({ message: 'Age is required.' })
  age: number;

  @IsString()
  @IsIn(['active', 'inactive'], {
    message: 'Status must be either "active" or "inactive"',
  })

   @IsOptional()
  status: 'active'| 'inactive';

  @IsString()
  @IsNotEmpty({message: 'Password can not be empty'})
  @MinLength(6,{message: "Password must have atleast 6 characters"})
  password: string;


//no validation needed already validated
 @IsOptional()
  @IsString({ message: 'filepath must be a string' })
  filepath: string;



}
