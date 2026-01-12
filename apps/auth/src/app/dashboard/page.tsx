'use client';
import React from 'react';

import { useRouter } from 'next/navigation';

import { capitalize ,normalize } from '@repo/services';

import { Accordion ,Avatar ,Button ,Card ,Text } from '@repo/ds';

import { useUser } from '@repo/ui';

import './page.scss';

export default function Dashboard() {
  const router = useRouter();

  const { user: currentUser } = useUser();

  const status = capitalize(currentUser?.status?.toLowerCase() ?? 'incomplete');
  const user = {
    ...currentUser ,
    avatar: !currentUser?.avatar ?
      'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728950400&semt=ais_hybrid' :
      currentUser.avatar ,
    status: normalize(status) ,
    successRate: Math.round(
      (currentUser.authentication_success / currentUser.total_authentications) *
      100
    ) ,
  };

  function handleOnClick(
    e: React.MouseEvent<HTMLButtonElement> ,widget: string
  ) {
    e.preventDefault();
    return router.push(`/systems/${ widget }`);
  }

  return (
    <div className="dashboard">
      <header id="avatar" className="dashboard-header">
        <Text id="avatar-text" tag="h1" variant="giant" color="primary-80"
          weight="bold">Dashboard de Autenticação</Text>
        <Avatar src={ user.avatar } name={ user.name } title={ user.name }
          size="large"/>
      </header>
      <section className="dashboard-cards">
        <Card id="card-authentication-attempt" className="dashboard-card">
          <Text id="card-authentication-attempt-title" tag="h2" variant="large"
            color="primary-60" weight="bold">Autenticações Recentes</Text>
          <Text id="card-authentication-attempt-text" variant="medium"
            color="neutral-80">{ user.total_authentications } tentativas</Text>
        </Card>
        <Card id="card-status" className="dashboard-card">
          <Text id="card-status-title" tag="h2" variant="large"
            color="primary-60" weight="bold">Status</Text>
          <Text id="card-status-text" variant="medium"
            color="neutral-80">{ user.status }</Text>
        </Card>
        <Card id="card-statistics" className="dashboard-card">
          <Text id="card-statistics-title" tag="h2" variant="large"
            color="primary-60" weight="bold">Estatísticas</Text>
          <Text id="card-statistics-text" variant="medium"
            color="neutral-80">{ user.successRate }% de sucesso nas
            autenticações</Text>
        </Card>
      </section>
      <section>
        <Card>
          <Accordion title="Widget Personalizado">
            <div  className="dashboard-widget">
              <Button context="info" appearance="borderless"
                onClick={ (e) => handleOnClick(e ,'geek') }>Geeks</Button>
              <Button context="info" appearance="borderless"
                onClick={ (e) => handleOnClick(e ,
                  'law') }>Juridico</Button>
              <Button context="info" appearance="borderless"
                onClick={ (e) => handleOnClick(e ,
                  'finance') }>Finanças</Button>
            </div>
          </Accordion>
        </Card>
      </section>
    </div>
  );
}
