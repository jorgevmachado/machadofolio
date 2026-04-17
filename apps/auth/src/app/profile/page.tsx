'use client'
import React, { useEffect, useState } from 'react';

import { useSearchParams } from 'next/navigation';

import { type EGender } from '@repo/services';

import { type UserEntity } from '@repo/business';

import { Button } from '@repo/ds';

import { Auth, type AuthForm, useAlert, useLoading, useUser } from '@repo/ui';

import { authService } from '../../shared';

type ButtonGoBackProps = {
    label: string;
    onClick: () => void;
}
export default function ProfilePage() {
    const searchParams = useSearchParams();
    const { user, update } = useUser();
    const { addAlert } = useAlert();
    const { show, hide } = useLoading();
    const [buttonGoBack, setButtonGoBack] = useState<ButtonGoBackProps | undefined>(undefined);

    const uploadAvatar = async (file: File) => {
        show()
        try {
            return await authService.upload(file);
        } catch (error) {
            console.error('# => uploadAvatar => error => ', error);
        } finally {
            hide();
        }
    }

    const updateUser = async (fields: AuthForm['fields'], userToUpdate: UserEntity) => {
        show();
        try {
            userToUpdate.id = user.id;
            userToUpdate.name = fields.name ?? user.name;
            userToUpdate.gender = fields.gender as EGender ?? user.gender;
            userToUpdate.date_of_birth = fields.date_of_birth ? new Date(fields.date_of_birth) : user.date_of_birth;
            await authService.update({
                id: userToUpdate.id,
                name: userToUpdate.name,
                gender: userToUpdate.gender,
                date_of_birth: userToUpdate.date_of_birth,
            });
            addAlert({ type: 'success', message: 'Profile updated successfully!' });
            update(userToUpdate);
        } catch (error) {
            console.error('# => updateUser => error => ', error);
            addAlert({ type: 'error', message: 'Unable to update your profile at this time, please try again later' });
        } finally {
            hide();
        }
    }

    const handeOnSubmit = async ({ valid, file, fields, message }: AuthForm) => {
        if(!valid) {
            addAlert({ type: 'error', message: message ?? 'Please fill in all required fields.' });
            return;
        }
        const currentUser = {...user };
        if(user.avatar !== fields.avatar && file) {
            currentUser.avatar = await uploadAvatar(file);
        }
        await updateUser(fields, currentUser);
    }

    const redirectToPage = (url: string) => {
        window.location.href = url;
    }

    const handleBackButton = () => {
        const source = searchParams.get('source');
        const redirectTo = searchParams.get('redirectTo');
        if(!source) {
            return;
        }

        setButtonGoBack({
            label: `Back to ${source} System`,
            onClick: () => redirectToPage(redirectTo ?? 'http://localhost:4002/'),
        });
    }

    useEffect(() => {
        handleBackButton();
    }, []);

    return (
        <>
            {buttonGoBack && (
                <Button appearance="borderless" context="primary" onClick={buttonGoBack.onClick}>{buttonGoBack.label}</Button>
            )}

            <Auth
                user={user}
                type="update"
                onSubmit={handeOnSubmit}
            />
        </>
    )
}