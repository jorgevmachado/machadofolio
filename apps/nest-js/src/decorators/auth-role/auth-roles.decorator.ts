import { type ERole } from '@repo/business';

import { SetMetadata } from '@nestjs/common';

export const AuthRoles = (...roles: Array<ERole>) => SetMetadata('role', roles);
