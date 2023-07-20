import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { IAuthServiceLogin } from './interfaces/auth-login-service.interface';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { IAuthServiceGetAccessToken } from './interfaces/auth-getAccessToken-service.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService, //
  ) {}

  async login({ email, password }: IAuthServiceLogin): Promise<string> {
    //1. 이메일 일치유저 DB에서 찾기
    const user = await this.usersService.findOneByEmail({ email: email });

    //2. 일치 유저 없으면 에러
    if (!user) {
      throw new UnprocessableEntityException('이메일이 없습니다.');
    }

    //3. 일치 유저 있는데 비번이 틀렸다면 에러
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated) {
      throw new UnprocessableEntityException('암호가 틀렸습니다!');
    }

    //4. 일치 유저 있고, 비번도 맞고
    // => accessToken(=JWT)를 만들어서 브라우저에 전달
    return this.getAccessToken({ user });
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id },
      { secret: '나의비밀번호', expiresIn: '1h' },
    );
  }
}
