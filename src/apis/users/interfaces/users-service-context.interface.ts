import { Request, Response } from 'express';
import { IAuthUser } from './users-service-authUser.interface';

export interface IContext {
  req: Request & IAuthUser;
  res: Response;
}
