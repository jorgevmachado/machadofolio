import React from 'react';

import { EGender } from '@repo/services';

import { ERole, EStatus, type UserEntity } from '@repo/business';


export type UserContextProps = {
    user: UserEntity;
    update: (user: UserEntity) => void;
}

export const initialUserData: UserEntity = {
    id: '',
    cpf: '',
    role: ERole.USER,
    name: '',
    email: '',
    gender: EGender.OTHER,
    status: EStatus.INACTIVE,
    whatsapp: '',
    created_at: new Date(),
    updated_at: new Date(),
    date_of_birth: new Date(),
}

export default React.createContext<UserContextProps>({
    user: initialUserData,
    update: () => {}
})