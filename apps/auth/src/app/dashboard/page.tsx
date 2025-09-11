'use client';
import { Avatar, Button, Card, Text } from '@repo/ds';

import { useUser } from '@repo/ui';

import './page.scss';

export default function Dashboard() {
    const { user: currentUser } = useUser()

    const user = {
        ...currentUser,
        avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728950400&semt=ais_hybrid'
    }

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <Text tag="h1" variant="giant" color="primary-80" weight="bold">Dashboard de Autenticação</Text>
                <Avatar src={user.avatar} name={user.name} title={user.name} size="large" />
            </header>
            <section className="dashboard-cards">
                <Card className="dashboard-card">
                    <Text tag="h2" variant="large" color="primary-60" weight="bold">Autenticações Recentes</Text>
                    <Text variant="medium" color="neutral-80">5 tentativas hoje</Text>
                </Card>
                <Card className="dashboard-card">
                    <Text tag="h2" variant="large" color="primary-60" weight="bold">Status</Text>
                    <Text variant="medium" color="neutral-80">Tudo funcionando normalmente</Text>
                </Card>
                <Card className="dashboard-card">
                    <Text tag="h2" variant="large" color="primary-60" weight="bold">Estatísticas</Text>
                    <Text variant="medium" color="neutral-80">99% sucesso nas autenticações</Text>
                </Card>
            </section>
            <section className="dashboard-widgets">
                <Card className="dashboard-widget">
                    <Text tag="h3" variant="medium" color="primary-60" weight="bold">Widget Personalizado</Text>
                    <Button context="primary">Ver detalhes</Button>
                </Card>
            </section>
        </div>
    );
}
