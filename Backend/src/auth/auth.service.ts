import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AdminInfo } from 'src/admin/admin.entity';
import { ManagerInfo } from 'src/manager/manager.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminInfo) private adminRepo: Repository<AdminInfo>,
    @InjectRepository(ManagerInfo) private managerRepo: Repository<ManagerInfo>,
    private jwtService: JwtService, 
    ) {}

  async signIn(username_or_email: string, password: string) {
  
  const admin = await this.adminRepo.findOne({ where: { fullname: username_or_email } });
  let role = 'Admin';
 //if no admin exists
 if(admin){
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }
 const payload = { sub: admin.id, username: admin.fullname,role }; // sub = userId conventionally
    return {
      access_token: await this.jwtService.signAsync(payload), //generate token with payload and secret
    }
 }

else if (!admin) {
  const manager = await this.managerRepo.findOne({ where: { email: username_or_email } });
  role = 'Manager';
  
  //if no manager
  if(!manager){
  throw new UnauthorizedException('Invalid Username or Email');
  }

  //if manager exissts
  const isPasswordValid = await bcrypt.compare(password, manager.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }
    const payload={ sub: manager.id, email: manager.email, role};

    return {
              access_token: await this.jwtService.signAsync(payload),//encoding payload
    }

   }

  }


}

   
