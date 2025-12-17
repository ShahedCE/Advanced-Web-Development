import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminInfo } from 'src/admin/admin.entity';
import { ManagerInfo } from 'src/manager/manager.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminInfo) private adminRepo: Repository<AdminInfo>,
    @InjectRepository(ManagerInfo) private managerRepo: Repository<ManagerInfo>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
     
    //  @InjectRepository(Customer_profile)private readonly profileRepo: Repository<Customer_profile>
    
    private jwtService: JwtService, 
    ) {}

  async signIn(username_or_email: string, password: string) {
  
  const admin = await this.adminRepo.findOne({ where: { fullname: username_or_email } });
  
  let role = 'admin';
 //if no admin exists
 if(admin){
  console.log(admin.fullname);
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password Admin');
    }
 const payload = { sub: admin.id, username: admin.fullname,role:role }; // sub = userId conventionally
 console.log(payload.role);
    return {
      access_token: await this.jwtService.signAsync(payload),role:role //generate token with payload and secret
    }
 }

//FOR MANAGER
  const manager = await this.managerRepo.findOne({ where: { email: username_or_email } });
  role = 'manager';
if (manager){ 
  //if manager exissts
  console.log(manager.email);
  const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password Manager');
    }
    const payload={ sub: manager.id, username: manager.email, role:role};
  console.log(payload.role);
    return {
              access_token: await this.jwtService.signAsync(payload,),role:role//encoding payload
    }
   }

   //FOR CUSTOMER

   const customer = await this.customerRepo.findOne({ where: { phone: username_or_email}})
   role="customer";
   if(!customer){
    //if no customer
  throw new UnauthorizedException('Invalid Username or Email or Phone Number');
  }
  //if customer
  console.log(customer.phone);
   const isPasswordValid = await bcrypt.compare(password, customer.password);

   if(!isPasswordValid){
    throw new UnauthorizedException('Invalid Password Customer');
   }

   const payload={ sub: customer.id , username: customer.phone, role:role}; //for backend secuirity
     console.log(payload.role);

   
  return {
    access_token: await this.jwtService.signAsync(payload),role:role //to pass in the frontend
  }
    

  }
}




   
