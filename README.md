<div style="text-align: center;">
    <h1>🚀 MACHADOFOLIO</h1>
    <p>Trocadilho com <strong>Machado</strong> + <strong>Portfólio</strong></p>
    <br/>
<p>
        <strong>Powered by</strong><br/>
        <img src="https://img.shields.io/badge/Turborepo-orangered?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo Logo" />
        <img src="https://img.shields.io/badge/-NestJs-ea2845?style=for-the-badge&logo=nestjs&logoColor=white"  alt="NestJs Logo"/>
        <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite Logo" />
        <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Logo" />
    </p>
    <p>
        <img src="https://shields.io/badge/react-black?logo=react&style=flat"  alt="React Logo" />
        <img src="https://img.shields.io/badge/yarn-2C8EBB.svg?style=flat&logo=yarn&logoColor=white" alt="Yarn Logo" />
        <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=flat&logo=typescript&logoColor=%233178C6" alt="Typescript Logo" />
        <img src="https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white" alt="Node.js Logo" />
        <img src="https://img.shields.io/badge/jest-C53d15.svg?style=flat&logo=jest&logoColor=white" alt="Jest Logo" />
    </p>
</div>

## 📚 Visão Geral

O **MACHADOFOLIO** é um monorepo que centraliza diferentes projetos pessoais, sendo o principal deles uma **aplicação financeira** para **controle de contas fixas, despesas e receitas**.  
O objetivo é aprimorar conhecimentos em **desenvolvimento full stack**, utilizando **NestJS no back-end**, **Next.js no front-end**, além de bibliotecas modernas para **design system** e **regras de negócio reutilizáveis**.

O projeto de finanças foi criado para resolver um problema comum: **a falta de visibilidade sobre onde o dinheiro está sendo gasto**.  
Com ele, é possível cadastrar contas (como luz, internet, cartão de crédito) e associar **despesas e subdespesas**, além de registrar **receitas mensais**, gerando **relatórios claros e intuitivos**.

---

## 🎯 Objetivos do Projeto

- Desenvolver um sistema **moderno e escalável** para gerenciamento financeiro.
- Permitir **cadastro e gerenciamento de contas fixas** (Bills).
- Registrar **despesas e subdespesas**, com controle hierárquico.
- Gerenciar **receitas mensais**, associadas a fontes de renda.
- Disponibilizar **relatórios e dashboards** para melhor entendimento financeiro.
- Criar uma base sólida para evoluir o projeto e servir como **portfólio profissional**.

---

## 👥 Público-Alvo

- Pessoas que desejam **substituir planilhas financeiras** por uma solução prática.
- Pequenos empreendedores que precisam **acompanhar despesas recorrentes**.
- Usuários que desejam **centralizar contas e receitas em um só sistema**.

---

## 🏗️ Estrutura do Monorepo

O projeto utiliza **Turborepo** para gerenciar múltiplos apps e pacotes compartilhados.

    .
    ├── apps
    │   ├── api                       # Back-end (NestJS + typeorm + PostgresSQL)  (https://nestjs.com).
    │   └── auth                      # Front-end (Next.js) Responsável por autenticação e gerenciamento de usuário (https://nextjs.org).
    │   └── finance                   # Front-end (Next.js) Responsável pelo gerenciamento financeiro (https://nextjs.org).
    └── packages
        ├── @repo/eslint-config       # Módulo de configurações do `eslint` (inclui `prettier`).
        ├── @repo/jest                # Módulo de configurações do `jest`.
        ├── @repo/typescript          # Módulo de configurações do typescript com `tsconfig.json`s usado em todo o monorepo.
        ├── @repo/services            # Módulo de utilitários.
        ├── @repo/business            # Módulo de regras de negocio.   
        └── @repo/tokens              # Biblioteca de estilos compartilhados divididos entre marcas.
        └── @repo/ds                  # Biblioteca de componentes React de Sistema de Design.
        └── @repo/ui                  # Biblioteca de componentes React de Interface do usuário.

---
## 🗄️ Modelagem de Dados

Principais entidades do sistema financeiro:

- **Users** → Usuários com autenticação e permissão.
- **Finances** → Gerenciamento de Controle financeiro individual por usuário. 
- **Pokemons** → Gerenciamento de pokemons 
---

## 🚀 Tecnologias Utilizadas

**Front-end**
- React
- **[TypeScript](https://www.typescriptlang.org/)**
- Next.js

**Back-end**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[NestJS](https://nestjs.com/)**
- **[TypeORM](https://typeorm.io/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[Swagger](https://swagger.io/)**

**Infraestrutura (planejado)**

- Vercel → Deploy do front-end
- Railway/Render → Deploy do back-end
- **[docker](https://www.docker.com/)** → Ambiente padronizado

---

## 🗺️ Roadmap
### Back-end 🔄 Em andamento
- Modulo de usuários	    ✅ Concluído 
- Modulo Financeiro         🔄 Em andamento 
- Modulo de Pokemon         🔄 Em andamento
- Infraestrutura            ⏳ Pendente

### Front End (Auth) 🔄 Em andamento
- Página de Dashboard ⏳ Pendente
- Página de Cadastro ✅ Concluído
- Página de Autenticação ✅ Concluído
- Página de Perfil ⏳ Pendente
- Página de Sistema Financeiro ⏳ Pendente
- Página de Sistema Geek ⏳ Pendente
- Página de Sistema Juridico ⏳ Pendente
- Testes ⏳ Pendente 
- Documentação	⏳ Pendente
- Deploy Ambiente de DEV ⏳ Pendente
- Deploy Ambiente de STG ⏳ Pendente
- Deploy Ambiente de PROD ⏳ Pendente 

### Front End (Financeiro) 🔄 Em andamento
- Página de Dashboard ⏳ Pendente
- Página de Gerenciamento de Banco ✅ Concluído
- Página de Gerenciamento de Grupos ✅ Concluído
- Página de Gerenciamento de Fornecedores ✅ Concluído
- Página de Gerenciamento de Contas 🔄 Em andamento
- Página de Gerenciamento de Renda ⏳ Pendente
- Página de Autenticação ✅ Concluído
- Testes ⏳ Pendente
- Documentação	⏳ Pendente
- Deploy Ambiente de DEV ⏳ Pendente
- Deploy Ambiente de STG ⏳ Pendente
- Deploy Ambiente de PROD ⏳ Pendente
---

### Front End (Geek) ⏳ Pendente
- Página de Dashboard ⏳ Pendente
- Página de Gerenciamento de Pokemons ⏳ Pendente
- Testes ⏳ Pendente
- Documentação	⏳ Pendente
- Deploy Ambiente de DEV ⏳ Pendente
- Deploy Ambiente de STG ⏳ Pendente
- Deploy Ambiente de PROD ⏳ Pendente
---

## ⚙️ Instalação do Ambiente
### Pré-requisitos
- [NVM](https://github.com/nvm-sh/nvm)
- Node.js v22.15.0+
- Yarn
```bash
  # Instalar versão correta do Node
  nvm install v22.15.0
  nvm use
  
  # Instalar dependências
  yarn install
```
---

## 🏠 Comandos Importantes
### Install and Build
```bash
  # Compila todos os projetos e pacotes com script "build"
  yarn run build
  
  # Compila o utilitário de serviços úteis 
  yarn run build:services
  
  # Compila o utilitário de regras de negocio 
  yarn run build:business
  
  # Compila o utilitário de tokens de cores, fontes e espaçamentos. 
  yarn run build:tokens
  
  # Compila o Design System. 
  yarn run build:ds
  
  # Compila o User Interface. 
  yarn run build:ui
  
  # Compila apenas o front-end do projeto Auth 
  yarn run build:auth
  
  # Compila apenas o front-end do projeto Finance 
  yarn run build:finance
  
  # Compila apenas o back-end do projeto API 
  yarn run build:api
```
### lint
```bash
    # Irá executar em todos os projetos e pacotes que possuírem o `lint` no script.
    yarn lint
    
    # Irá executar sómente o utilitário de serviços úteis.
    yarn lint:services
    
    # Irá executar sómente o utilitário de regras de negocio.
    yarn lint:business
    
    # Irá executar sómente o utilitário de tokens de cores, fontes e espaçamentos.
    yarn lint:tokens
    
    # Irá executar sómente o Design System.
    yarn lint:ds
    
    # Irá executar sómente o User Interface.
    yarn lint:ui
    
    # Irá executar sómente o front-end do projeto Auth 
    yarn lint:auth
    
    # Irá executar sómente o front-end do projeto Finance 
    yarn lint:finance
    
    # Irá executar sómente o back-end do projeto API 
    yarn lint:api
```
### format
```bash
    # Formata arquivos de código automaticamente
    yarn format
```

### Testes
```bash
    # Irá executar em todos os projetos e pacotes que possuírem o `test` no script.
    yarn test
    
    # Irá executar sómente o utilitário de serviços úteis.
    yarn test:services
    
    # Irá executar sómente o utilitário de regras de negocio.
    yarn test:business
    
    # Irá executar sómente o utilitário de tokens de cores, fontes e espaçamentos.
    yarn test:tokens
    
    # Irá executar sómente o Design System.
    yarn test:ds
    
    # Irá executar sómente o User Interface.
    yarn test:ui
    
    # Irá executar sómente o front-end do projeto Auth 
    yarn test:auth
    
    # Irá executar sómente o front-end do projeto Finance 
    yarn test:finance
    
    # Irá executar sómente o back-end do projeto API 
    yarn test:api
```

### Desenvolvimento
```bash
    # Irá executar em todos os projetos e pacotes que possuírem o `dev` no script.
    yarn dev
    
    # Irá executar sómente o storybook do Design System a execução para cada marca.
    yarn dev:ds:law
    yarn dev:ds:auth
    yarn dev:ds:geek
    yarn dev:ds:finance
    
    # Irá executar sómente o storybook do User Interface a execução para cada marca.
    yarn dev:ui:law
    yarn dev:ui:auth
    yarn dev:ui:geek
    yarn dev:ui:finance
    
    # Irá executar sómente o front-end do projeto Auth 
    yarn dev:auth
    
    # Irá executar sómente o front-end do projeto Finance 
    yarn dev:finance
    
    # Irá executar sómente o back-end do projeto API 
    yarn dev:api
```
---
## 📘 Documentações

### Apps
- Mais informações sobre projeto api (NestJs) [clique aqui](./apps/nest-js/README.md).
- Mais informações sobre projeto auth [clique aqui](./apps/auth/README.md).  
- Mais informações sobre projeto finance [clique aqui](./apps/finance/README.md).  

### Packages
- Mais informações sobre módulo eslint [clique aqui](./packages/eslint-config/README.md).
- Mais informações sobre módulo jest [clique aqui](./packages/jest/README.md).
- Mais informações sobre módulo typescript [clique aqui](./packages/typescript/README.md).
- Mais informações sobre módulo services [clique aqui](./packages/services/README.md).
- Mais informações sobre módulo business [clique aqui](./packages/business/README.md).
- Mais informações sobre a biblioteca de tokens [clique aqui](./packages/tokens/README.md).
- Mais informações sobre a biblioteca de Design System [clique aqui](./packages/ds/README.md).
- Mais informações sobre a biblioteca de User Interface [clique aqui](./packages/ui/README.md).

### Extras
- Como utilizar o TurboRepo [clique aqui.](HOW-TO-USE-TURBOREPO.md)
- Como usar o Rollup para realizar build das bibliotecas [clique aqui.](HOW-TO-USE-ROLLUP-TO-BUILD-REACT-LIBRARY.md)
- Como utilizar o Storybook [clique aqui.](HOW-TO-USE-STORYBOOK-WITH-REACT.md)
- Como utilizar o Style Dictionary [clique aqui.](HOW-TO-USE-STYLE-DICTIONARY.md)
- Como utilizar o Typeorm com NestJS [clique aqui.](HOW-TO-USE-TYPEORM-WITH-NEST.md)
- Como utilizar o Docker para criar o banco de dados [clique aqui.](HOW-USING-DOCKER-WITH-THIS-PROJECT.md)
- Bibliotecas mais utilizadas no projeto [clique aqui.](MOST-USED-LIBRARY.md)
- Comandos mais utilizados [clique aqui.](MOST-USED-COMMAND-LIBRARY.md)

