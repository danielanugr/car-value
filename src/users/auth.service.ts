import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //See if user with the email exists
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    //Hash User Password
    //Generate a salt
    const salt = randomBytes(8).toString('hex');
    //Hash the password with the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //Join the hashed password and salt together
    const result = salt + '.' + hash.toString('hex');

    //Create a new User and save it
    const user = await this.usersService.create(email, result);
    //Return user

    return user;
  }

  async signin() {}
}
