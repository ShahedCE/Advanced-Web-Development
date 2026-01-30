import { Controller, Post, Body, Param, ParseIntPipe, Get, Put, UseGuards,Request, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, BadRequestException, Patch } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage, MulterError } from 'multer';
import { UpdateManagerDto } from './dto/update-manager.dto';
import { ManagerInfo } from './manager.entity';
import { NotFoundError } from 'rxjs';
import { UpdateManagerPasswordDto } from './dto/updatepassword.dto';
import * as bcrypt from'bcrypt';


@Controller('manager')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

@UseGuards(AuthGuard)
  @Get('managerprofile/:id')
  async getManagerProfile(@Param('id') id: string) {
    return this.managerService.getManagerProfile(+id); // +id converts to number
  }
  
@UseGuards(AuthGuard)
@Put('updateprofile/:mid')
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
      destination: './uploads/manager',
      filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
      },
    }),
  }),
)

@UsePipes(new ValidationPipe({ whitelist: true, skipMissingProperties: true,transform:true, }))
async updateManager(
  @Param('mid', ParseIntPipe) mid: number,
  @Body() managerData: UpdateManagerDto,
  @UploadedFile() file?: Express.Multer.File,
 ) :Promise<{message: string, updated: ManagerInfo}>  { 
   
  if(file){
    managerData.profile_picture=file.filename;
  }
      
return this.managerService.updateManager(mid, managerData);
}

@UseGuards(AuthGuard)
@Patch('updatepassword/:mid')
@UsePipes(new ValidationPipe({whitelist: true,transform: true}))
async UpdatePassword(@Param('mid', ParseIntPipe) mid: number,
                     @Body() managerpasswords: UpdateManagerPasswordDto  ){

  return this.managerService.UpdatePassword( mid,managerpasswords);

}



}
 

