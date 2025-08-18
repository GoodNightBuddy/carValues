import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { User } from '../user.entity';

// declare global {
//   namespace Express {
//     interface Request {
//       currentUser?: User;
//     }
//   }
// }

declare module 'express-serve-static-core' {
  interface Request {
    currentUser?: User;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.session.userId;

    if (userId) {
      const user = await this.usersService.findById(userId);
      req.currentUser = user;
    }

    next();
  }
}
