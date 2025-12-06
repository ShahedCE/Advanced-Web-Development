import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { customerService } from 'src/customer/customer.service';
import { CreateCustomerDto } from 'src/customer/dtos/create_customer.dto';
import { EmailService } from 'src/email/email.service';
import { logInDto } from './dto/login.dto';
import { HashingProvider } from './provider/hashing.provider';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(customerService)
    private readonly customerservice: customerService,
    private readonly hashingProvider: HashingProvider,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  public async signup(createCustomerDto: CreateCustomerDto) {
    await this.customerservice.createCustomer(createCustomerDto);

    const customer = await this.customerservice.findCustomerByPhone(
      createCustomerDto.phone,
    );
 console.log(customer);
    /*const emailTo = customer?.email ?? createCustomerDto?.email;
    const name = customer?.full_name ?? createCustomerDto?.full_name;

    if (emailTo) {
      try {
        await this.emailService.sendWelcomeEmail(emailTo, name);
      } catch (e) {
        console.warn('email failed:', e.message);
      }
    }*/

    return {
      message: 'Dear Customer, your information has been saved successfully',
    };
  }

  public async login(logindto: logInDto) {
    const customer = await this.customerservice.findCustomerByPhone(
      logindto.phone,
    );

    const isequal = await this.hashingProvider.comparePassword(
      logindto.password,
      customer.password,
    );

    if (!isequal) {
      throw new UnauthorizedException('Invalid phone or password');
    }

    const payload_service = {
      phone: customer.phone,
      name: customer.full_name,
      sub: customer.id,
    };

    const token = await this.jwtService.signAsync(payload_service, {
      secret: 'mySuperSecretKey123!',
    });

    //void this.emailService.sendLoginNotice(customer.email, customer.full_name);

    return {
      message: 'Dear Customer you are successfully logged in',
      token: token,
      customerId: customer.id,
    };
  }
}
