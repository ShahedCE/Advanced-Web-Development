import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { HashingProvider } from './provider/hashing.provider';
import { BcryptProvider } from './provider/bcrypt.provider';
import { JwtModule } from '@nestjs/jwt';
import { EmailModule } from '../email/email.module'; 

@Module({
  imports: [
    CustomerModule,
    EmailModule, 
    JwtModule.register({
      secret: 'mySuperSecretKey123!', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  providers: [
    AuthenticationService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
  ],
  controllers: [AuthenticationController],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
