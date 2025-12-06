import {Controller, Get, Query, 
         Post, Body, Param, ParseIntPipe,
         ValidationPipe, UsePipes, UseInterceptors,
        UploadedFile, Delete, Patch,
        BadRequestException,
        Put,
        NotFoundException,
        UseGuards,
        Req} from '@nestjs/common';
import {AdminService} from "./admin.service";
import { CreateAdminDto } from './dto/create-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminInfo } from './admin.entity';
import { UpdateAdminDto } from './dto/updateadmin.dto';
import { LoginAdminDto } from './dto/loginadmin.dto';
import * as bcrypt from'bcrypt';
import { CreateManagerDto } from './dto/create-manager.dto';

import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin')
export class AdminController{ //class
constructor(private readonly adminService:AdminService)
{}

//Create Admin
//@UseGuards(AuthGuard)
@Post('createadmin')
@UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('file', { //upload a single file using Multer
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);//acceptable/accept
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);//reject
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)
async createAdmin(
  @Body() adminData: CreateAdminDto,
  @UploadedFile() file?: Express.Multer.File,
): Promise<AdminInfo> {

  if (!file){
    throw new BadRequestException('Image is required to create Admin');
  }
    (adminData as any).filepath = file.filename;  
    //Salt
    const salt = await bcrypt.genSalt();
 
    adminData.password= await bcrypt.hash(adminData.password,salt);   //Pass Hash
    
  const admin = await this.adminService.createAdmin(adminData); // Save admin to DB
  // Sending welcome email
  await this.adminService.sendWelcomeEmail(admin.email, admin.fullname);
  // Return the saved admin
  return admin;
}

//Delete Admin by id
@UseGuards(AuthGuard)
@Delete('deleteadmin/:id')
async deleteAdmin(@Param('id', ParseIntPipe) id: number): Promise<{message:string}>{
    const result = await this.adminService.deleteAdmin(id);
    return {message:result};
}

//PATCH Update Status
@UseGuards(AuthGuard)
@Patch('updatestatus')
async changeStatus(@Body() body:{id : number, status: 'active' | 'inactive'}) {
  return this.adminService.changeStatus(body.id,body.status);
}

//Get Inactive Admin
@UseGuards(AuthGuard)
@Get('inactive')
async getInactiveAdmins():Promise<AdminInfo[]>{
  return this.adminService.getInactiveAdmins();
}
//Older Than any age
@UseGuards(AuthGuard)
@Get('olderthan/:age')
async getAdminOlderThan(@Param('age', ParseIntPipe) age: number):Promise<AdminInfo[]>{
  return this.adminService.getAdminOlderThan(age);
}

//Get All Admins
@UseGuards(AuthGuard)
@Get('alladmin')
async getAllAdmins(): Promise<AdminInfo[]>{
  return this.adminService.getAllAdmins();
}

//Get Admin By Id
@UseGuards(AuthGuard)
@Get('getadmin/:id')
async getAdminById(@Param('id',ParseIntPipe) id : number): Promise<AdminInfo>{
  return this.adminService.getAdminById(id);
}

//Update Admins any data
@UseGuards(AuthGuard)
@Put('updateadmin/:id')
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file && file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else if (!file) {
        cb(null, true); // no file uploaded, skip filter
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)
@UsePipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true,transform:true, }))
async updateAdmin(
  @Param('id', ParseIntPipe) id: number,
  @Body() adminData: UpdateAdminDto,
  @UploadedFile() file?: Express.Multer.File,
): Promise<{ message: string; updated: AdminInfo }> {

  if (file) {
    adminData.filepath = file.filename; // add file to data if uploaded
  }

  return  this.adminService.updateAdmin(id, adminData);
}

//...........................................MANAGER.......................................//

  //MANAGERS ROUTES FOR ADMIN + CRUD
  
  //Create Manager
  @UseGuards(AuthGuard)
  @Post('createmanager')
@UsePipes(new ValidationPipe())
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
    storage: diskStorage({
      destination: './uploads/manager',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)
  async CreateManager(
    @Req() req: any,
    @Body() managerData:CreateManagerDto,
    @UploadedFile() file? : Express.Multer.File, 
  )
  {
    if (!file){
    throw new BadRequestException('Image is required to create Admin');
  }
    (managerData as any).profile_picture = file.filename; 

    const salt=await bcrypt.genSalt();
    managerData.password= await bcrypt.hash(managerData.password,salt);

    const adminid= req.user.sub; // retreive admin id from JWT token
   const manager= await this.adminService.CreateManager(adminid,managerData);
  
  // Send welcome email
  await this.adminService.sendWelcomeEmail(manager.email, manager.fullname);
  // Return the saved admin
  return manager;
   
  }  


@UseGuards(AuthGuard) 
@Get('getmanagers')
async getManagers(@Req() req) {
  const adminId = req.user.sub; // Extract admin ID from JWT payload
  const managers = await this.adminService.getManagersByAdminId(adminId);

  if (!managers || managers.length === 0) {
    throw new NotFoundException('Managers not found.');
  }

  return managers;
}

//Fetching Data for Admin Dashboard for Recent activities
  // New Dashboard Stats
  @UseGuards(AuthGuard)
  @Get('dashboard_stats')
  async getDashboardStats(@Req() req) {
    const adminId = req.user.sub;

    return this.adminService.getDashboardStats(adminId);
  }
    // ✅ GET manager by ID
  @UseGuards(AuthGuard)
  @Get('getmanager/:id')
  async getManagerById(@Param('id') id: string) {
    return this.adminService.getManagerById(+id); // +id converts to number
  }

@UseGuards(AuthGuard)
@Get('getadminbymanager/:managerid')
async getAdminByManagerId(@Param('managerid', ParseIntPipe) managerid: number){

  const admin=await this.adminService.getAdminByManagerId(managerid);
  if(!admin){
    throw new NotFoundException('Admin or Manager not found');
  }
return admin;
}



  @UseGuards(AuthGuard)
@Delete('deletemanager/:managerid')
async deleteManagerById(@Param('managerid',ParseIntPipe) managerid:number){

  const result= await this.adminService.deleteManagerById(managerid);

  return {message: result};
}



}







/*
@Post('addadmin')
@UsePipes(new ValidationPipe())

@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, cb) => {
      if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
        cb(null, true);
      } else {
        cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);//400
      }
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
        storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)

async addAdmin(
  @Body() admindata: CreateAdminDto,
  @UploadedFile() file: Express.Multer.File,
) {

  console.log(admindata); // validated admin data
  console.log(file);      // uploaded file info

  if(file){
    (admindata as any).picture= file.filename;
  }

const result = this.adminService.addAdmin(admindata);

return {
  data: result,
  uploadedFile: file?.filename,
};

}
}

/*async addAdmin(
  @Body() admindata: CreateAdminDto,
  @UploadedFile() file: Express.Multer.File,
) {
  try {
    if (file) {
      (admindata as any).picture = file.filename;
    }
       console.log('Saved file path:', file.path);

    const result = await this.adminService.addAdmin(admindata);

    return {
      message: 'Admin added successfully',
      data: result,
      uploadedFile: file?.filename,
    };

  } catch (err) {

    // Delete file if any error happens
    if (file && fs.existsSync(`./uploads/${file.filename}`)) {
      fs.unlinkSync(`./uploads/${file.filename}`);
    }

    throw new BadRequestException('Invalid data or file upload failed');
  }
}*/

//.......
/*
@Get()
getAdmin(){
    return this.adminService.getAdmin();
}

@Get('getadmin/:id')
getAdminByID(@Param('id', ParseIntPipe) id:number):object
{
return this.adminService.getAdminByID(id);
}
/* By Query
@Patch('updatestatus')
async changeStatus(
  @Query('id', PasrseIntPipe) id: string,
  @Query('status') status: 'active' | 'inactive'
) {
  return this.adminService.changeStatus(parsedId, status);
}



@Post('adminlogin')
async LoginAdmin(@Body() loginData:LoginAdminDto){
    const admin = await this.adminService.findByUsername(loginData.fullname);

    if (!admin) {
      throw new BadRequestException('Invalid username or password');
    }
    // Password Compare
    const isMatch = await bcrypt.compare(loginData.password, admin.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid username or password');
    }

    return { message: 'Login successful', admin };
  }

*/