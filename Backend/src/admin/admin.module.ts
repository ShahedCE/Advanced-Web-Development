import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminInfo } from "./admin.entity";
import { ManagerInfo } from "src/manager/manager.entity";
import { AuthModule } from "src/auth/auth.module";
import { PusherModule } from "src/pusher/pusher.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([AdminInfo, ManagerInfo]),
    PusherModule,
    // MailerModule.forRoot(...) <-- REMOVE THIS
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
