import { ConflictException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IUsersServiceCreate } from './interfaces/users-service-create.interface';
import { IUsersServiceFindOneByEmail } from './interfaces/users-service-findByEmail.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, //
  ) {}

  async findOneByEmail({ email }: IUsersServiceFindOneByEmail): Promise<User> {
    return await this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async create({
    email,
    password,
    name,
    age,
  }: IUsersServiceCreate): Promise<User> {
    const user = await this.findOneByEmail({ email });
    if (user) throw new ConflictException('이미 등록된 이메일입니다.');

    // hash작업도 중복되서 많이 사용된다면 따로 service를 만들어서 import해서 사용하는게 맞다.
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.usersRepository.save({
      email: email,
      password: hashedPassword,
      name: name,
      age: age,
    });
  }
}
