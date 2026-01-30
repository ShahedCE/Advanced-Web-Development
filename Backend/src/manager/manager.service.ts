import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagerInfo } from './manager.entity';
import { UpdateManagerDto } from './dto/update-manager.dto';
import * as bcrypt from 'bcrypt'
import { UpdateManagerPasswordDto } from './dto/updatepassword.dto';

@Injectable()
export class ManagerService {

  constructor(
    @InjectRepository(ManagerInfo) private managerRepo: Repository<ManagerInfo>,
  ) {}


    // Fetch manager by ID
  async getManagerProfile(id: number): Promise<ManagerInfo> {
    const manager = await this.managerRepo.findOne({ where: { id } });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }

    return manager;
  }
async updateManager( mid: number,updateData:UpdateManagerDto): Promise <{message: string, updated: ManagerInfo}>{
  const manager= await this.managerRepo.findOne({where: {id: mid} });

  if(!manager){
    throw new NotFoundException(`Manager with id ${mid} not found`);
  }

  if(updateData.password){ 
     const salt=await bcrypt.genSalt();
      updateData.password= await bcrypt.hash(updateData.password,salt);
  }
  
  Object.assign(manager,updateData);
  const updated= await this.managerRepo.save(manager);

  return {message: 'Manager Updated Successfully', updated};
}



async UpdatePassword(mid: number, managerpasswords: UpdateManagerPasswordDto ): Promise<{message: string}>{

const manager= await this.managerRepo.findOne({where: {id: mid} });
if(!manager){
  throw new NotFoundException(`Manager with id ${mid} not found`);
}

if(managerpasswords.prev_password==managerpasswords.newpassword){
  throw new BadRequestException('Please give a new password to update');
}

const isMatch= await bcrypt.compare(managerpasswords.prev_password, manager.password);

 if(isMatch){ //const isPasswordValid = await bcrypt.compare(password, admin.password);
    const salt= await bcrypt.genSalt();

   managerpasswords.newpassword = await bcrypt.hash(managerpasswords.newpassword, salt); }
else{
    throw new BadRequestException(`Previous password doesn't match`);
  }
  
   manager.password = managerpasswords.newpassword;
  await this.managerRepo.save(manager);

  return ({message: `Manager password with Id ${mid} updated successfully`});

}


/*
  async createManager(managerData: CreateManagerDto, adminId: number): Promise<ManagerInfo> {
    const admin = await this.adminRepo.findOne({ where: { id: adminId } });
    if (!admin) throw new NotFoundException('Admin not found');

    const manager = this.managerRepo.create({ ...managerData, admin });
    return await this.managerRepo.save(manager);
  }

  async getManagersByAdmin(adminId: number): Promise<ManagerInfo[]> {
    const admin = await this.adminRepo.findOne({
      where: { id: adminId },
      relations: ['managers'],
    });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin.managers;
  }*/
}
