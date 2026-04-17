<div style="text-align: center;">
    <h1>JEST</h1>
    <br/>
<p>
    <strong>Powered by</strong>

![Jest](https://img.shields.io/badge/jest-C53d15.svg?style=falt&logo=jest&logoColor=white)

![Yarn](https://img.shields.io/badge/yarn-2C8EBB.svg?style=falt&logo=yarn&logoColor=white)
![Typescript](https://img.shields.io/badge/typescript-%23323330.svg?style=falt&logo=typescript&logoColor=%233178C6)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=falt&logo=node.js&logoColor=white)
</p>
</div>

## Para que serve ?
### Módulo responsável pelas configurações de testes de todos os módulos, bibliotecas e projetos.

## Instalação do Ambiente
### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

### Para usar o jest dentro do projeto, basta adicionar o módulo no package.json do projeto.
```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "jest": "^29.7.0",
    "ts-jest": "^29.2.5",
    "@repo/jest": "*"
  }      
}
```
### Seguir os passos da instalação conforme [Instalação do Ambiente](#instalação-do-ambiente).
### Depois criar um arquivo `jest.config.ts` e selecionar qual grupo do eslint deseja adicionar ao projeto.
```typescript
// No Exemplo está sendo utilizado o grupo de configurações do nest.
import { config } from '@repo/jest/nest';

export default config;
```
### por fim no `package.json` adicionar os comandos para executar o lint.
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json"
  }      
}
```
## Módulos
### base.ts
#### O arquivo `base.ts` define a **configuração genérica e compartilhada do Jest** para o monorepo. Ele centraliza as definições comuns que podem ser reutilizadas em diferentes projetos e cenários dentro do monorepo, garantindo consistência e redução de duplicações na configuração de testes.
#### Ações e Funcionalidades
- **Coleta de Cobertura de Código** (): `collectCoverage: true`
    - Ativa a coleta de métricas de cobertura de código para os testes.

- **Ambiente de Teste** (): `testEnvironment: 'jsdom'`
    - Configura o Jest para usar o ambiente `jsdom`, ideal para testes que simulam um navegador.

- **Provedor de Cobertura** (): `coverageProvider: 'v8'`
    - Utiliza o mecanismo baseado no V8 para geração de relatórios de cobertura, garantindo eficiência e precisão.

- **Diretório de Relatórios de Cobertura** (): `coverageDirectory: 'coverage'`
    - Especifica o diretório onde os relatórios de cobertura de código serão gerados.

- **Extensões de Módulos Suportados** (`moduleFileExtensions`):
    - Lista as extensões de arquivos que o Jest irá interpretar como módulos (, `ts`, `json`). `js`

- **Ignorar Pastas Durante a Cobertura** (`coveragePathIgnorePatterns`):
    - Exclui pastas irrelevantes da métrica de cobertura, como:
        - `node_modules`
        - (diretório de build) `dist`
        - (diretório de cache do Next.js) `.next`
### next.ts
#### O arquivo `next.ts` define a **configuração de testes do Jest para projetos que utilizam Next.js**. Ele é baseado na configuração genérica presente em e adiciona ajustes específicos para garantir compatibilidade e suporte às interfaces e estruturas do `base.ts`.
#### Ações e Funcionalidades
- **Extensão da Configuração Base**:
    - O `next.ts` estende automaticamente todas as configurações definidas no `base.ts`, incluindo coleta de cobertura, ambiente `jsdom` e suporte a arquivos `js` , `ts` e `json`. 

- **Suporte a Arquivos JSX e TSX**:
    - Adiciona as extensões `jsx` e `tsx` ao Jest através de:

### nest.ts
#### O arquivo `nest.ts` define a **configuração de testes do Jest para projetos que utilizam NestJS**. Ele é baseado na configuração genérica presente em e adiciona ajustes específicos para garantir compatibilidade e suporte às interfaces e estruturas do `base.ts`.
#### Ações e Funcionalidades
- **Extensão da Configuração Base**:
    - O `nest.ts` estende automaticamente todas as configurações definidas no `base.ts`, incluindo coleta de cobertura, ambiente `jsdom` e suporte a arquivos `js` , `ts` e `json`.