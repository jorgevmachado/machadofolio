import { EGender } from '@repo/services/personal-data/enum';

import { ERole, EStatus } from '@repo/business/enum';

import { type User } from '../entities/user.entity';

import { FINANCE_MOCK } from './finance.mock';

export const USER_MOCK: User = {
    id: 'eaca4c08-e62d-495a-ae1c-918199da8d52',
    cpf: '49892120450',
    salt: '$2a$10$5pv7wQmv3rnXyB9YMqgocO',
    role: ERole.USER,
    name: 'John Doe',
    email: 'john.doe@mail.com',
    status: EStatus.ACTIVE,
    gender: EGender.MALE,
    finance: FINANCE_MOCK,
    password: '$2a$10$5pv7wQmv3rnXyB9YMqgocOAicud4eH9FQcN8beudNS9WMb.sSE5WS',
    whatsapp: '11998765432',
    created_at: new Date('2024-09-09T00:00:00.000Z'),
    updated_at: new Date('2024-09-09T00:00:00.000Z'),
    date_of_birth: new Date('1990-01-01T00:00:00.000Z'),
    recover_token: undefined,
    confirmation_token: '9bd0aceff9012467fce99a8c2efdfacd3a27255d87f0b516adfd5e889ad3668e',
};

export const USER_PASSWORD: string = '@Password1';