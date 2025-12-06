import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ManagerInfo } from 'src/manager/manager.entity';
import { PusherService } from 'src/pusher/pusher.service';
import { MoreThan, Repository } from 'typeorm';
import { AdminInfo } from './admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UpdateAdminDto } from './dto/updateadmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminInfo) private adminRepo: Repository<AdminInfo>,
    @InjectRepository(ManagerInfo) private managerRepo: Repository<ManagerInfo>,
    private pusherService: PusherService,
    private mailerService: MailerService,
  ) {}

  async createAdmin(adminData: CreateAdminDto): Promise<AdminInfo> {
    //<AdminInfo> is the Type of one object
    const existuser = await this.adminRepo.findOne({
      where: { fullname: adminData.fullname },
    });

    if (existuser) {
      throw new BadRequestException(
        'Username already exists. Please try another one.',
      );
    }
    return this.adminRepo.save(adminData);
  }

  async changeStatus(
    id: number,
    status: 'active' | 'inactive',
  ): Promise<{ message: string }> {
    const result = await this.adminRepo.update(id, { status });

    if (result.affected === 0) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return { message: `Status updated to '${status}' for Admin ID ${id}` };
  }

  async getInactiveAdmins(): Promise<AdminInfo[]> {
    //<AdminInfo[]> is the Type of many object
    return this.adminRepo.find({ where: { status: 'inactive' } });
  }

  async getAdminOlderThan(age: number): Promise<AdminInfo[]> {
    return this.adminRepo.find({ where: { age: MoreThan(age) } });
  }

  async getAllAdmins(): Promise<AdminInfo[]> {
    return this.adminRepo.find();
  }

  async getAdminById(id: number): Promise<AdminInfo> {
    const admin = await this.adminRepo.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
  }

  async updateAdmin(
    id: number,
    updateData: UpdateAdminDto,
  ): Promise<{ message: string; updated: AdminInfo }> {
    const admin = await this.adminRepo.findOne({ where: { id } });

    if (!admin) {
      throw new NotFoundException(`Admin with ${id} not found`);
    }
    // If new password
    if (updateData.password && updateData.password.trim() !== '') {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    } else {
      updateData.password = admin.password; // keeping the old password
    }
    Object.assign(admin, updateData);
    const updated = await this.adminRepo.save(admin);

    return { message: 'Admin Information Updated Successfully', updated };
  }

  async findByUsername(fullname: string): Promise<AdminInfo | null> {
    return await this.adminRepo.findOne({ where: { fullname } });
  }

  async deleteAdmin(adminid: number): Promise<string> {
    const admin = await this.adminRepo.findOne({ where: { id: adminid } });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminid} not found`);
    }
    await this.adminRepo.remove(admin);

    return `Admin with ID ${adminid} deleted successfully`;
  }

  ///////////////MANAGER/////////////////////

  async CreateManager(adminid: number, managerData: CreateManagerDto) {
    const admin = await this.adminRepo.findOne({ where: { id: adminid } });
    if (!admin) throw new NotFoundException('Admin not found');

    const existsemail = await this.managerRepo.findOne({
      where: { email: managerData.email },
    });
    if (existsemail) throw new BadRequestException('Email already exists.');

    // Create & save manager first
    const manager = this.managerRepo.create({ ...managerData, admin });
    const savedManager = await this.managerRepo.save(manager);

    // Trigger notification AFTER saving (don't await it to avoid blocking)
    this.pusherService
      .notifyManagerAdded(savedManager.fullname)
      .then(() => console.log('Pusher notification sent'))
      .catch((err) => console.error('Pusher notification error:', err));

    return savedManager;
  }

  async getManagersByAdminId(adminid: number): Promise<ManagerInfo[]> {
    const admin = await this.adminRepo.findOne({
      where: { id: adminid },
      relations: ['managers'],
    });

    if (!admin) {
      throw new NotFoundException('Admin Not Found');
    }
    return admin.managers;
  }

  // Dashboard Stats for Admin
  async getDashboardStats(adminId: number) {
    // total managers under this admin
    const total = await this.managerRepo.count({
      where: { admin: { id: adminId } },
    });

    // active managers
    const active = await this.managerRepo.count({
      where: { admin: { id: adminId }, status: 'active' },
    });
    // inactive managers
    const inactive = await this.managerRepo.count({
      where: { admin: { id: adminId }, status: 'inactive' },
    });

    // optionally: last 3 managers created
    const recentManagers = await this.managerRepo.find({
      where: { admin: { id: adminId } },
      order: { created_at: 'DESC' },
      take: 3,
    });

    return {
      stats: { total, active, inactive },
      recentManagers: recentManagers.map((m) => ({
        // creating new array of object with diff names
        name: m.fullname,
        email: m.email,
        createdAt: m.created_at.toDateString(),
      })),
    };
  }

  async deleteManagerById(mid: number): Promise<string> {
    const manager = await this.managerRepo.findOne({ where: { id: mid } });
    if (!manager) {
      throw new NotFoundException(`Manager with ID ${mid} not found`);
    }
    await this.managerRepo.remove(manager);

    return `Manager with ID ${mid} deleted successfully`;
  }

  // Fetch manager by ID
  async getManagerById(id: number): Promise<ManagerInfo> {
    const manager = await this.managerRepo.findOne({ where: { id } });

    if (!manager) {
      throw new NotFoundException(`Manager with ID ${id} not found`);
    }

    return manager;
  }

  async getAdminByManagerId(managerid: number): Promise<AdminInfo> {
    const manager = await this.managerRepo.findOne({
      where: { id: managerid },
      relations: ['admin'],
    });
    if (!manager) {
      throw new NotFoundException('Manager Not Found');
    }
    return manager.admin;
  }

  //Sending mail
  async sendWelcomeEmail(toEmail: string, username: string) {
    await this.mailerService.sendMail({
      to: toEmail,
      subject: 'ABC Laundry Service',
      text: `Hello ${username}, Welcome to our Laundry Service!`,
    });
  }

  /*

getAdminByID(id: number): object {
    const admin = this.admins.find(a => {
    if (a == null) return false;
   // Convert both sides to number for safe comparison
    return Number(a.id) === id;
  });
  if (admin) return admin;
  return { message: 'Admin not found!!!' };
}
*/
}
