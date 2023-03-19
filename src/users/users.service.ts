import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.repository.create({ email, password });
    return await this.repository.save(user);
  }

  async findOne(id: number) {
    return await this.repository.findOneBy({ id });
  }

  async find(email: string) {
    return await this.repository.findBy({ email });
  }

  async update(id: number, payload: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, payload);
    return await this.repository.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repository.remove(user);
  }
}
