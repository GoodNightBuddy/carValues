import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findById(id: string) {
    if (!id) return null;
    const user = this.repo.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  findByEmail(email: string) {
    return this.repo.find({
      where: { email },
    });
  }

  async update(id: string, attrs: Partial<User>) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: string) {
    const user = await this.repo.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    return this.repo.remove(user);
  }
}
