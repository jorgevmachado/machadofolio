<div style="text-align: center;">
    <h1>🎨 Design System (DS)</h1>
    <br/>
    <p>
        <img src="https://shields.io/badge/react-black?logo=react&style=flat"  alt="React Logo" />
        <img src="https://img.shields.io/badge/yarn-2C8EBB.svg?style=flat&logo=yarn&logoColor=white" alt="Yarn Logo" />
        <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=flat&logo=typescript&logoColor=%233178C6" alt="Typescript Logo" />
        <img src="https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white" alt="Node.js Logo" />
        <img src="https://img.shields.io/badge/jest-C53d15.svg?style=flat&logo=jest&logoColor=white" alt="Jest Logo" />
        <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Logo" />
    </p>
</div>

## 📚 Visão Geral

---

## 🎯 Objetivos do Projeto

---

## 🏗️ Estrutura do Projeto
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
## 🚀 Tecnologias Utilizadas
 
---

## 🗺️ Roadmap

---

## ⚙️ Instalação do Ambiente
### Pré-requisitos
#### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).
---

## 🏠 Comandos Importantes
### Instalação e Build
```bash
    # Irá executar a instalação do módulo.
    yarn install
    # Irá executar o build do módulo.
    yarn build
```
### Lint
```bash
    # Irá executar o lint do módulo.
    yarn lint    
```
### Testes
```bash
    # Irá executar os testes do módulo.
    yarn test    
```
### Develop
```bash
  # Irá executar o modulo em modo de desenvolvimento com a marca de finanças.
  yarn storybook:finance
  # Irá executar o modulo em modo de desenvolvimento com a marca de geek.
  yarn storybook:geek
  # Irá executar o modulo em modo de desenvolvimento com a marca de law.
  yarn storybook:law
  # Irá executar o modulo em modo de desenvolvimento com a marca de auth.
  yarn storybook:auth
```

