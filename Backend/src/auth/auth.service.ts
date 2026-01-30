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
    @InjectRepository(AdminInfo) private readonly adminRepo: Repository<AdminInfo>,
    @InjectRepository(ManagerInfo) private readonly managerRepo: Repository<ManagerInfo>,
    @InjectRepository(Customer) private readonly customerRepo: Repository<Customer>,
     
    //  @InjectRepository(Customer_profile)private readonly profileRepo: Repository<Customer_profile>
    
    private jwtService: JwtService, 
    ) {}

  async signIn(identifier: string, password: string) {

  let user: any = null;
  let role: 'admin' | 'manager' | 'customer'| null=null;

  // 1️⃣ Try ADMIN
  user = await this.adminRepo.findOne({
    where: { fullname: identifier },
  });

  if (user) role = 'admin';

  //  Try MANAGER
  if (!user) {
    user = await this.managerRepo.findOne({
      where: { email: identifier },
    });
    if (user) role = 'manager';
  }

  //Try CUSTOMER
  if (!user) {
    user = await this.customerRepo.findOne({
      where: { phone: identifier },
    });
    if (user) role = 'customer';
  }

  // ❌ No user found
  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }
  // Password check (ONCE)
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException('Invalid password');
  }

  //  JWT payload (BACKEND SECURITY)
  const payload = {
    sub: user.id,
    role,
  };

  const access_token = await this.jwtService.signAsync(payload);

  // 📦 FRONTEND RESPONSE
  return {
    access_token,
    user: {
      id: user.id,
      full_name: user.fullname ?? user.full_name ?? null,
      email: user.email ?? null,
      phone: user.phone ?? null,
      role,
    },
  };
}

}




   
