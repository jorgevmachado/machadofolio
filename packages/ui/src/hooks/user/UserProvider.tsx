import React, { useEffect, useState } from 'react';

import { type UserEntity } from '@repo/business';

import UserContext from './UserContext';

type UserProviderProps = {
    user: UserEntity;
    children: React.ReactNode;
}

export default function UserProvider({ user, children }: UserProviderProps) {
    const [_user, _setUser] = useState<UserEntity>(user);

    useEffect(() => { _setUser(user); }, [user]);

    const update = (user: UserEntity) => { _setUser(user); };

    return (
        <UserContext.Provider value={{ user: _user, update }}>
            {children}
        </UserContext.Provider>
    );
}