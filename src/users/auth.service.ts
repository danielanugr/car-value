import {
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
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
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //Join the hashed password and salt together
    const result = salt + '.' + hash.toString('hex');

    //Create a new User and save it
    const user = await this.usersService.create(email, result);
    //Return user

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await thisusersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid Password');
    }

    return user;
  }
}
