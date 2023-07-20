import { Args, Context, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IContext } from './interfaces/users-service-context.interface';
import { GqlAuthAccessGuard } from '../auth/guard/graphql-auth.guard';

@Resolver()
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService, //
  ) {}

  // RestAPI일때의 인가방식 => graphql Request는 조금 다르기 때문에 바꿔주는 함수가 하나 필요하다.
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => String)
  fetchUser(@Context() context: IContext): string {
    //유저정보 꺼내오기
    console.log('=================');
    console.log(context.req.user); // 유저 ID
    console.log('=================');
    return '인가에 성공하였습니다';
  }

  @Mutation(() => User)
  createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('name') name: string,
    @Args({ name: 'age', type: () => Int }) age: number,
  ): Promise<User> {
    return this.usersService.create({ email, password, name, age });
  }
}
