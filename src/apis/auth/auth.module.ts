import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule, //module로 불러오면 해당 module에 가서도 export해주어야 됨.
  ],
  providers: [
    JwtAccessStrategy,
    AuthResolver,
    AuthService, //
  ],
})
export class AuthModule {}
