import { IAuthUser } from 'src/apis/users/interfaces/users-service-authUser.interface';

export interface IPointsTransactionsServiceCreate {
  impUid: string;
  amount: number;
  user: IAuthUser['user'];
}
