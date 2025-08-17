import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private usersService: UsersService) {}

  async intercept(
    ctx: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = ctx.switchToHttp().getRequest();
    const userId = request.session?.userId;

    if (userId) {
      const user = await this.usersService.findById(userId);
      request.currentUser = user;
    }

    return next.handle();
  }
}
