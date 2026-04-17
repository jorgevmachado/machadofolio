import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';

import UserContext, { initialUserData } from './UserContext';
import UserProvider from './UserProvider';
import useUser from './useUser';

describe('User Hook', () => {
    describe('UserContext', () => {
        function DummyComponent() {
            const { user, update } = useUser();

            React.useEffect(() => { update({ ...user, name: 'Sem Provider' }); }, [update, user]);

            return (
                <div data-testid="user-name">{user.name}</div>
            );
        }
        it('must use default context value and update does nothing.', () => {
            render(<DummyComponent />);
            expect(screen.getByTestId('user-name')).toHaveTextContent('');
        });
    });

    describe('<UserProvider/>', () => {
        it('should provide the value of context for children.', () => {
            render(
                <UserProvider user={{ ...initialUserData, name: 'Jane Doe', id: '1' }}>
                    <UserContext.Consumer>
                        {({ user }) => (
                            <div>User: {user.name}</div>
                        )}
                    </UserContext.Consumer>
                </UserProvider>
            );

            expect(screen.getByText('User: Jane Doe')).toBeInTheDocument();
        });

        it('should update the user when update is called.', async () => {
            render(
                <UserProvider user={initialUserData}>
                    <UserContext.Consumer>
                        {({ user, update }) => (
                            <>
                                <div data-testid="username">{user.name}</div>
                                <button onClick={() => update({ ...user, name: 'New Name' })}>Update</button>
                            </>
                        )}
                    </UserContext.Consumer>
                </UserProvider>
            );

            expect(screen.getByTestId('username')).toHaveTextContent('');
            screen.getByText('Update').click();
            await waitFor(() => {
                expect(screen.getByTestId('username')).toHaveTextContent('New Name');
            })

        });
    });

    describe('useUser', () => {
        function UserComponent() {
            const { user, update } = useUser();
            return (
                <div>
                    <span data-testid="user-name">{user.name}</span>
                    <button onClick={() => update({ ...user, name: 'New Name' })}>Change Name</button>
                </div>
            );
        }

        it('consome o contexto corretamente e atualiza', async () => {
            render(
                <UserProvider user={{ ...initialUserData, name: 'Name' }}>
                    <UserComponent />
                </UserProvider>
            );

            expect(screen.getByTestId('user-name')).toHaveTextContent('Name');
            screen.getByText('Change Name').click();
            await waitFor(() => {
                expect(screen.getByTestId('user-name')).toHaveTextContent('New Name');
            });
        });
    });
});
