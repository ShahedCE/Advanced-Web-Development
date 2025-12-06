import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { CreateCustomerDto } from 'src/customer/dtos/create_customer.dto';
import { logInDto } from './dto/login.dto';
import { authorizeGuards } from './guards/authorize.guards';

@Controller('authentication')
export class AuthenticationController {

constructor(private readonly authenticationService: AuthenticationService) {

}

//@UseGuards(authorizeGuards)
@Post("signup")
async signup(@Body() createCustomerDto: CreateCustomerDto) {
        console.log('Received DTO:', createCustomerDto);

    return await this.authenticationService.signup(createCustomerDto);
}


@Post("login")
async login(@Body() logindto: logInDto) {

    return await this.authenticationService.login(logindto);

}







}


