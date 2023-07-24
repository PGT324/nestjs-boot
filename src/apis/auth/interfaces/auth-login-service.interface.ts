import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser } from 'src/apis/users/interfaces/users-service-authUser.interface';
import { IContext } from 'src/apis/users/interfaces/users-service-context.interface';

export interface IAuthServiceLogin {
  email: string;
  password: string;
  context: IContext;
}

export interface IAuthServiceSetRefreshToken {
  user: User;
  context: IContext;
}

export interface IAuthServiceRestoreAccessToken {
  user: IAuthUser['user'];
}
