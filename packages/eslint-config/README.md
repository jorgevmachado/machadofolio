<div style="text-align: center;">
    <h1>Eslint</h1>
    <br/>
<p>
    <strong>Powered by</strong>

![Javascript](https://img.shields.io/badge/javascript-%23323330.svg?style=falt&logo=javascript)
![Yarn](https://img.shields.io/badge/yarn-2C8EBB.svg?style=falt&logo=yarn&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=falt&logo=node.js&logoColor=white)
</p>
</div>
## Para que serve ?
### Módulo responsável pelas configurações de eslint de todos os módulos, bibliotecas e projetos.

## Instalação do Ambiente
### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

### Para usar o eslint-config dentro do projeto, basta adicionar o módulo no package.json do projeto.
```json
{
  "devDependencies": {
    "@repo/eslint-config": "*"
  }      
}
```
### Seguir os passos da instalação conforme [Instalação do Ambiente](#instalação-do-ambiente).
### Depois criar um arquivo `.eslintrc.js` e selecionar qual grupo do eslint deseja adicionar ao projeto.
```javascript
// No Exemplo em extends está sendo utilizado o grupo de configurações do next.js.
/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: ['@repo/eslint-config/next.js'],
    parserOptions: {
        project: 'tsconfig.lint.json',
        tsconfigRootDir: __dirname,
    },
};
```
### por fim no `package.json` adicionar os comandos para executar o lint.
```json
{
  "scripts": {
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --max-warnings 0 --fix"
  }      
}
```

## Módulos
### base.js
#### O arquivo `base.js` contém as configurações compartilhadas de ESLint para todo o repositório, servindo como a base comum para outros arquivos de configuração, como os dedicados a projetos específicos (ex.: `next.js`, `react-internal.js`). Ele centraliza regras e boas práticas que devem ser aplicadas de forma consistente em todos os módulos e pacotes do projeto.
- **Regras de Estilo**:
    - Uso obrigatório de ponto e vírgula (`semi: ['error', 'always']`).
    - Aspas simples para strings (`quotes: ['error', 'single']`).
    - Espaçamento consistente em objetos (`object-curly-spacing: ['error', 'always']`).
    - Espaçamento antes de parênteses em funções, com padrões diferentes para funções anônimas, nomeadas e de seta assíncronas (`space-before-function-paren`).
    - Ordenação de imports com suporte para diferentes estruturas (`sort-imports`).
    - Espaçamento correto entre palavras-chave como `if`, `else`, etc. (`keyword-spacing`).

- **Suporte ao TypeScript**:
    - Baseado nas regras recomendadas pelo `typescript-eslint`.
    - Desativa a regra que bloqueia o uso de `any` (`@typescript-eslint/no-explicit-any: 'off'`).

### next.js
#### O arquivo `next.js` é uma configuração personalizada do ESLint voltada para projetos que utilizam o framework **Next.js**. Ele é projetado para garantir as melhores práticas de desenvolvimento em aplicações Next.js, além de herdar todas as regras definidas no arquivo base `base.js`, garantindo consistência com o restante do repositório.
- **Regras de Estilo**:
    - **Hereditariedade do `base.js`**:
    - Todas as regras e configurações compartilhadas do `base.js` são automaticamente aplicadas no arquivo `next.js`, garantindo padronização em todo o projeto.
  
    - **Suporte Específico ao Next.js**:
         - Integração com o plugin `@next/eslint-plugin-next`, que fornece regras específicas para melhorar a segurança, acessibilidade e desempenho de aplicações Next.js.
         - Ativa regras fundamentais como:
              - Boas práticas de uso dos recursos básicos do Next.js.
              - Validação das Web Vitals com o `core-web-vitals`.

    - **Regras Adicionais para React**:
         - Herdado do `base.js` para garantir boas práticas gerais no uso de React.
         - Suporte ao plugin `react-hooks`, com configuração para garantir o uso correto de hooks.

    - **Configurações de Globais**:
         - Adapta os **globais** do ESLint para suportar os ambientes comuns de aplicações Next.js, como `browser` e `serviceworker`.
#### Este arquivo é ideal para garantir que as aplicações Next.js no repositório estejam alinhadas com as melhores práticas e padrões de desenvolvimento.

### react-internal.js
#### O arquivo `react-internal.js` é uma configuração personalizada do ESLint criada para projetos que utilizam **React** dentro do repositório. Ele herda todas as regras definidas no `base.js`, garantindo consistência nas diretrizes gerais do repositório, e adiciona configurações específicas para projetos React, otimizando o desenvolvimento de bibliotecas e aplicações internas que utilizam essa tecnologia.

- **Regras de Estilo**:
  - **Hereditariedade do `base.js`**:
      - Todas as regras e configurações compartilhadas no `base.js` são inclusas automaticamente. Isso inclui padronizações gerais de estilo de código (ponto e vírgula, aspas, ordenação de imports, entre outros) e boas práticas de desenvolvimento.

  - **Suporte Específico ao React**:
      - Integração com o plugin `eslint-plugin-react`, ativando regras recomendadas para o uso de componentes React.
      - Detecta automaticamente a versão do React utilizada no projeto (`react.version: "detect"`).
      - Desabilita a regra `react/react-in-jsx-scope`, desnecessária a partir do novo sistema de JSX transform do React.

  - **Regras para Hooks do React**:
      - Integrado ao plugin `eslint-plugin-react-hooks` para garantir o uso adequado de hooks.
      - Ativa o conjunto de regras recomendadas pelo plugin para evitar erros em hooks, como:
          - Verificação de dependências em `useEffect`.
          - Garantia de que hooks sejam chamados em momentos válidos.

  - **Configurações de Globais**:
      - Adapta os **globais** de ambiente para suportar cenários comuns no React, incluindo `serviceworker` e `browser`.
#### O `react-internal.js` é essencial para garantir que as bibliotecas e aplicações React desenvolvidas internamente estejam alinhadas com as melhores práticas e com a consistência requisitada no repositório.

### library.js
#### O arquivo `library.js` é uma configuração personalizada do ESLint projetada especialmente para bibliotecas TypeScript cujo objetivo é ser consumido por outros projetos. Ele visa garantir boas práticas e padrões de código de alta qualidade para bibliotecas reutilizáveis, com foco em consistência e manutenção a longo prazo. Ele herda todas as regras definidas no definidas no arquivo base `base.js`, garantindo consistência com o restante do repositório.

- **Regras de Estilo**:
  - **Hereditariedade do `base.js`**:
    - Todas as regras gerais configuradas no `base.js` são aplicadas automaticamente, como consistência no estilo de código (uso de ponto e vírgula, aspas, espaçamento, etc.).

    - **Configurações para TypeScript**:
        - Baseado nas regras recomendadas do `typescript-eslint`, garantindo melhores práticas para uso de tipagem em bibliotecas TypeScript.
        - Adiciona validações importantes, como:
            - **Restrições de variáveis não utilizadas**: Erro para variáveis ou argumentos não utilizados, com exceção de variáveis prefixadas com `_`.
            - **Tipagem explícita**: Alerta para funções ou limites de módulo sem tipos declarados explicitamente.
            - **Uso restrito de `any`**: Aviso para encorajar o uso de tipos concretos e evitar `any` desnecessário.

    - **Boas Práticas para Bibliotecas**:
        - **Proibição de `console.log`**: Permite apenas o uso de `console.warn` e `console.error` para mensagens importantes.
        - **Proibição de `debugger`**: Garante que nenhum código de depuração seja acidentalmente enviado.
        - **Atenção ao Escopo do Código**: Regras para modularização clara e tipada.

    - **Configurações de Globais**:
        - Suporte adicionado para variáveis globais comuns em ambientes de navegador e service workers, garantindo compatibilidade com diferentes contextos.

    - **Ignorar Arquivos Gerados**:
        - Ignora pastas e arquivos gerados como `dist/**` (artefatos de build) e `node_modules/**` para evitar análise desnecessária.
#### O `library.js` foi criado para ser utilizado em projetos de biblioteca TypeScript dentro do repositório. Ele centraliza configurações essenciais de ESLint específicas para o desenvolvimento de pacotes reutilizáveis de alta qualidade.

### nest.js
#### O arquivo `nest.js` é uma configuração personalizada do ESLint destinada a projetos que utilizam o ‘framework’ **NestJS**. Ele garante que as melhores práticas de desenvolvimento sejam seguidas ao trabalhar com o NestJS em TypeScript, promovendo consistência e qualidade no código em todos os projetos que utilizam essa tecnologia. Ele herda todas as regras definidas no definidas no arquivo base `base.js`, garantindo consistência com o restante do repositório.
- **Regras de Estilo**:
   - **Hereditariedade do `base.js`**:
     - Todas as regras gerais configuradas no `base.js` são aplicadas automaticamente, como consistência no estilo de código (uso de ponto e vírgula, aspas, espaçamento, etc.).
  - **Configurações para TypeScript**:
      - Baseado nas regras recomendadas do `typescript-eslint`, garantindo melhores práticas para uso de tipagem em bibliotecas TypeScript.
      - Adiciona validações importantes, como:
          - **Restrições de variáveis não utilizadas**: Erro para variáveis ou argumentos não utilizados, com exceção de variáveis prefixadas com `_`.
          - **Tipagem explícita**: Alerta para funções ou limites de módulo sem tipos declarados explicitamente.
          - **Uso restrito de `any`**: Aviso para encorajar o uso de tipos concretos e evitar `any` desnecessário.

  - **Boas Práticas para Bibliotecas**:
      - **Proibição de `console.log`**: Permite apenas o uso de `console.warn` e `console.error` para mensagens importantes.
      - **Proibição de `debugger`**: Garante que nenhum código de depuração seja acidentalmente enviado.
      - **Atenção ao Escopo do Código**: Regras para modularização clara e tipada.
  - **Configurações de Globais**:
    - Suporte adicionado para variáveis globais comuns em ambientes NestJS e service workers, garantindo compatibilidade com diferentes contextos.

      - **Ignorar Arquivos Gerados**:
          - Ignora pastas e arquivos gerados como `dist/**` (artefatos de build) e `node_modules/**` para evitar análise desnecessária. 