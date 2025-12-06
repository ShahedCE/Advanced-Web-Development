import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt'; // <-- import করা
import { CustomerProfileController } from './customer_profile.controller';
import { CustomerProfileService } from './customer_profile.service';
import { Customer_profile } from './customer_profile.entity';
import { Customer } from 'src/customer/customer.entity';
import { authorizeGuards } from 'src/authentication/guards/authorize.guards'; // <-- guard import

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer_profile, Customer]),
    JwtModule.register({  
      secret: 'mySuperSecretKey123!', 
      signOptions: { expiresIn: '1h' }, 
    }),
  ],
  controllers: [CustomerProfileController],
  providers: [CustomerProfileService, authorizeGuards], 
  exports: [authorizeGuards], // 
})
export class CustomerProfileModule {}
