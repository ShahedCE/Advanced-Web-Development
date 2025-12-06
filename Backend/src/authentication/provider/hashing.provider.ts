import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {

    abstract hashpassword(password: string|Buffer): Promise<string>;
    abstract comparePassword(plainpassword: string|Buffer, hashpassword: string|Buffer): Promise<boolean>;


}
