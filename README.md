<div style="text-align: center;">
    <h1>MACHADOFOLIO</h1>
    <br/>
<p>
    <strong>Powered by</strong>

![Turbo](https://img.shields.io/badge/Turborepo-orangered?style=for-the-badge&logo=turborepo&logoColor=white)

![Nest](https://img.shields.io/badge/-NestJs-ea2845?style=for-the-badge&logo=nestjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=turborepo&logoColor=white)
![Next](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)

![React](https://shields.io/badge/react-black?logo=react&style=falt)
![Npm](https://shields.io/badge/npm-gray?logo=npm&style=falt)
![Typescript](https://img.shields.io/badge/typescript-%23323330.svg?style=falt&logo=typescript&logoColor=%233178C6)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=falt&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/jest-C53d15.svg?style=falt&logo=jest&logoColor=white)
</p>
</div>

###### Trocadilho com Machado e Portfolio.

## Para que serve ?
### Projeto Criado para aprimorar os meus conhecimentos em desenvolvimento de Software.
    .
    ├── apps
    │   ├── api                       # NestJS app (https://nestjs.com).
    │   └── web                       # Next.js app (https://nextjs.org).
    │   └── geek                      # Projeto Front-end com nextjs para a marca geek.
    └── packages
        ├── @repo/eslint-config       # Módulo de configurações do `eslint` (inclui `prettier`).
        ├── @repo/jest                # Módulo de configurações do `jest`.
        ├── @repo/typescript          # Módulo de configurações do typescript com `tsconfig.json`s usado em todo o monorepo.
        ├── @repo/services            # Módulo de utilitários.
        ├── @repo/business            # Módulo de regras de negocio.   
        └── @repo/tokens              # Biblioteca de estilos compartilhados divididos entre marcas.
        └── @repo/ds                  # Biblioteca de componentes React de Sistema de Design.
        └── @repo/ui                  # Biblioteca de componentes React de Interface do usuário.

## Apps
### Mais informações sobre projeto api [clique aqui](./apps/api/README.md).

### Mais informações sobre projeto web [clique aqui](./apps/web/README.md).

### Mais informações sobre projeto geek [clique aqui](./apps/geek/README.md).

## Packages
### Mais informações sobre módulo eslint [clique aqui](./packages/eslint-config/README.md).

### Mais informações sobre módulo jest [clique aqui](./packages/jest/README.md).

### Mais informações sobre módulo typescript [clique aqui](./packages/typescript/README.md).

### Mais informações sobre módulo services [clique aqui](./packages/services/README.md).

### Mais informações sobre módulo business [clique aqui](./packages/business/README.md).

### Mais informações sobre a biblioteca de tokens [clique aqui](./packages/tokens/README.md).

### Mais informações sobre a biblioteca de Design System [clique aqui](./packages/ds/README.md).

### Mais informações sobre a biblioteca de User Interface [clique aqui](./packages/ui/README.md).

## Instalação do Ambiente
### Primeiramente, instale o [NVM](https://github.com/nvm-sh/nvm) e instale a versão específica do Node via terminal:
```bash
  nvm install v22.15.0
  nvm use
```
Instale todas as dependências:
```bash
  yarn install
```

## 🏠  Comandos
### Build

```bash
# Irá construir todos os projetos e pacotes que possuírem o `build` no script.
yarn run build
```

### Develop

```bash
# Irá executar em todos os projetos e pacotes que possuírem o `dev` no script.
yarn dev
```

### test

```bash
# Irá executar em todos os projetos e pacotes que possuírem o `test` no script.
yarn test
```

#### Lint

```bash
# Irá executar o lint em todos os projetos e pacotes que possuírem o `lint` no script.
# Veja `@repo/eslint-config` para personalizar o comportamento.
yarn lint
```

#### Format

```bash
# Formatará todos os arquivos `.ts,.js,json,.tsx,.jsx` suportados.
# Veja `@repo/eslint-config/prettier-base.js` para personalizar o comportamento.
yarn format
```

## Dicas
### Como utilizar o TurboRepo [clique aqui.](HOW-TO-USE-TURBOREPO.md)

### Como usar o Rollup para realizar build das bibliotecas [clique aqui.](HOW-TO-USE-ROLLUP-TO-BUILD-REACT-LIBRARY.md)

### Como utilizar o Storybook [clique aqui.](HOW-TO-USE-STORYBOOK-WITH-REACT.md)

### Como utilizar o Style Dictionary [clique aqui.](HOW-TO-USE-STYLE-DICTIONARY.md)

### Como utilizar o Typeorm com NestJS [clique aqui.](HOW-TO-USE-TYPEORM-WITH-NEST.md)

### Como utilizar o Docker para criar o banco de dados [clique aqui.](HOW-USING-DOCKER-WITH-THIS-PROJECT.md)

### Bibliotecas mais utilizadas no projeto [clique aqui.](MOST-USED-LIBRARY.md)

### Comandos mais utilizados [clique aqui.](MOST-USED-COMMAND-LIBRARY.md)

