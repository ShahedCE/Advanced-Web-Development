import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CustomerProfileService } from './customer_profile.service';
import { authorizeGuards } from 'src/authentication/guards/authorize.guards';

@Controller('customer-profile')
export class CustomerProfileController {

    constructor(private readonly customerProfileService: CustomerProfileService) {}
    @UseGuards(authorizeGuards)
    @Get("all_profile")
    
    findAllCustomerProfile() {

        return this.customerProfileService.findAll();
    }


    @UseGuards(authorizeGuards)
    @Get('by-number/:number')
    findProfileByNumber(@Param('number') number: string) {
        return this.customerProfileService.findByNumber(number);
    }






}
