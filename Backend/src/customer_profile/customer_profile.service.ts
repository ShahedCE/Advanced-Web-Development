import { Injectable } from '@nestjs/common';
import { Customer_profile } from './customer_profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerProfileService {


    constructor(
        @InjectRepository(Customer_profile)
        private profileRepo: Repository<Customer_profile>,
         
    ) {}

    findAll() {

        return this.profileRepo.find(

            {relations:{
                customer:true
            }}
        )
    }

    async findByNumber(number: string) {

    return await this.profileRepo.findOne({
      where: { phone: number }, 
      relations: {
        customer: true,
      }
    })
    
            
    }




    
}


