'use client'
import React from 'react';

import { Auth, useUser, type AuthForm, useAlert, useLoading } from '@repo/ui';
import { authService } from '../shared';
import { EGender } from '@repo/services';

export default function ProfilePage() {
    const { user } = useUser();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading()

    const handleOnSubmit = async (authForm: AuthForm ) => {
        const { valid, fields } = authForm;
        if(!valid) {
            addAlert({ type: 'error', message: 'Please fill in all required fields.' });
            return;
        }
        try {
            console.log('# => handleOnSubmit => fields => ', fields);
            console.log('# => handleOnSubmit => fields => ', fields);
            const { name, avatar, gender, date_of_birth } = fields;
            console.log('# => handleOnSubmit => fields => avatar => ', avatar)
            show();
            await authService.update({
                id: user.id,
                name,
                gender: gender as EGender,
                date_of_birth: date_of_birth ? new Date(date_of_birth) : undefined,
            });
            addAlert({ type: 'success', message: 'Profile updated successfully!' });
        } catch (error: any) {
            const message =
                error?.statusCode !== 500 && error?.message
                    ? error.message
                    : 'Something went wrong while updating the user, please try again later';

            addAlert({ type: 'error', message });
            console.error(error)
        } finally {
            hide();
        }
    }
    return (
        <Auth
            user={user}
            type="update"
            onSubmit={handleOnSubmit}
        />
    )
}