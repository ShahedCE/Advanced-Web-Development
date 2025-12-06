import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateManagerPasswordDto{ 

    @IsString() 
  @IsNotEmpty({message: 'Must Give Previous Password'}) 
  @MinLength(6,{message: "Password must have atleast 6 characters"}) 
  prev_password: string;

  @IsOptional()
  @IsString() 
    @MinLength(6,{message: "Password must have atleast 6 characters"}) 
  @IsNotEmpty({message: 'New Password can not be empty'}) 

  newpassword: string;

}
