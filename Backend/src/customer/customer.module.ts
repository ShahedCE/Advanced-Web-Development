import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // <-- এটি যুক্ত করুন
import { CustomerController } from './customer.controller';
import { customerService } from './customer.service';
import { Customer } from './customer.entity';
import { Customer_profile } from 'src/customer_profile/customer_profile.entity';
import { HashingProvider } from 'src/authentication/provider/hashing.provider';
import { BcryptProvider } from 'src/authentication/provider/bcrypt.provider';
import { authorizeGuards } from 'src/authentication/guards/authorize.guards'; // <-- guard import

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer, Customer_profile]),
    JwtModule.register({
      secret: 'mySuperSecretKey123!',       // আপনার JWT secret
      signOptions: { expiresIn: '1h' },     // টোকেনের মেয়াদ
    }),
  ],
  controllers: [CustomerController],
  providers: [
    customerService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    authorizeGuards, // <-- guard provider যোগ করতে হবে
  ],
  exports: [customerService, authorizeGuards], // export guard যদি অন্য module-এ ব্যবহার করতে চান
})
export class CustomerModule {}
