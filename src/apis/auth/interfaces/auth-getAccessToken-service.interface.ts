import { User } from 'src/apis/users/entities/user.entity';
import { IAuthUser } from 'src/apis/users/interfaces/users-service-authUser.interface';

export interface IAuthServiceGetAccessToken {
  user: User | IAuthUser['user'];
}
