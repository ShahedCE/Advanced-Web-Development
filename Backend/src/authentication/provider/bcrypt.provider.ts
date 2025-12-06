import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {

    async hashpassword(password: string | Buffer): Promise<string> {
        // Implementation for hashing the password using bcrypt

        // let salt = await bcrypt.genSalt;

        // return await bcrypt.hash(password, salt);
    // Generate salt with 10 rounds (default is 10)
    const salt = await bcrypt.genSalt(10); // 10 is the number of rounds
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;

    }

    async comparePassword(plainpassword: string | Buffer, hashpassword: string | Buffer): Promise<boolean> {
        // Implementation for comparing the plain password with the hashed password using bcrypt

       return await bcrypt.compare(plainpassword, hashpassword.toString())
         // Placeholder
    }




}
