import { map,Observable } from 'rxjs';

import { User as UserConstructor } from '@repo/business';

import { User } from '../../auth/entities/user.entity'

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

@Injectable()
export class SanitizeUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => {
      if(Array.isArray(data) && data.length > 0) {
        return data.map(this.sanitizeData.bind(this));
      }
      return this.sanitizeData(data);
    }));
  }

  private sanitizeData(data: any) {
    if(this.isObjectPropertyUser(data)) {
      return this.sanitizePropertyUser(data);
    }
    if(this.isObjectUser(data)) {
      return this.sanitizeObjectUser(data as User);
    }

    return data;
  }

  private isObjectPropertyUser(data: any) {
    return data && typeof data === 'object' && Object.prototype.hasOwnProperty.call(data, 'user');
  }

  private sanitizePropertyUser(data: any) {
    const { user, ...rest } = data;
    const cleanUser = this.sanitizeObjectUser(user as User);
    return { ...rest, user: cleanUser };
  }

  private isObjectUser(data: any) {
    return data && typeof data === 'object' && 'password' in data;
  }

  private sanitizeObjectUser(data: User) {
    return new UserConstructor({ ...data, clean: true });
  }
}
