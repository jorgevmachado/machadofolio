import { Observable } from 'rxjs';

import { CanActivate, ConflictException, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class PokemonInitializeGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const hasPokemon = Boolean(user?.pokemon_trainer);

    if (!hasPokemon) {
      throw new ConflictException(
          'Pokemon Trainer is not initialized, please start it to access this feature.',
      );
    }

    return true;
  }
}
