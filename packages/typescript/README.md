<div style="text-align: center;">
    <h1>Typescript</h1>
    <br/>
<p>
    <strong>Powered by</strong>

![Typescript](https://img.shields.io/badge/typescript-%23323330.svg?style=falt&logo=typescript&logoColor=%233178C6)
![Npm](https://shields.io/badge/npm-gray?logo=npm&style=falt)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=falt&logo=node.js&logoColor=white)
</p>
</div>

## Para que serve ?
### Módulo responsável pelas configurações de typescript de todos os módulos, bibliotecas e projetos.

## Instalação do Ambiente
### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

### Para usar o typescript dentro do projeto, basta adicionar o módulo no package.json do projeto.
```json
{
  "devDependencies": {
    "typescript": "^5.8.2",
    "@repo/typescript": "*"
  }      
}
```
### Seguir os passos da instalação conforme [Instalação do Ambiente](#instalação-do-ambiente).
### Depois criar um arquivo `tsconfig.json` e selecionar qual grupo do typescript deseja adicionar ao projeto.
#### No Exemplo em extends está sendo utilizado o grupo de configurações do nestjs.json
```json
{
  "extends": "@repo/typescript/base.json",
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist"
  }
}
```
## Módulos

### base.json
#### O arquivo `base.json` é utilizado para definir uma configuração padrão e básica do TypeScript, sendo a base para outros módulos, bibliotecas e projetos. Ele contém as configurações essenciais do compilador TypeScript que ajudam a garantir a consistência e boas práticas no uso do TypeScript em diferentes ambientes.
#### Ações e Funcionalidades
- **Definição e suporte a bibliotecas modernas**: Configurado para trabalhar com recursos modernos da linguagem, como `ES2022` e APIs do DOM.
- **Modo modular**: Define o suporte para módulos `NodeNext`, garantindo uma integração robusta com o Node.js.
- **Strict Mode habilitado**: Garante maior segurança ao código, evitando erros comuns.
- **Mapeamento de declarações**: Gera mapas de declarações para facilitar o desenvolvimento de bibliotecas.
- **Resolução avançada de módulos**: Suporte para importar módulos JSON e garantir interoperabilidade entre `CommonJS` e `ESModule`.
- **Otimizações no processo de compilação**: Configuração específica para melhorar a performance do compilador.
#### Esta configuração serve como base genérica para ser estendida por outros arquivos de configuração, como o `nextjs.json`, permitindo personalizar ajustes conforme as necessidades de cada projeto.


### nextjs.json
#### O arquivo `nextjs.json` é uma configuração específica do TypeScript para projetos que utilizam o framework Next.js. Ele estende as configurações padrões definidas no `base.json`, adicionando ajustes e otimizações voltadas para o desenvolvimento de aplicações Next.js.
#### Ações e Funcionalidades
- **Suporte a JSX**: Define a opção `jsx: preserve`, que mantém o código JSX para ser processado pelo compilador do Next.js.
- **Módulo `ESNext`**: Configurado para suportar módulos modernos, garantindo integração perfeita com as dependências utilizadas no Next.js.
- **Resolução de módulos com `Bundler`**: Otimizado para trabalhar com bundlers modernos e o sistema de resolução do Next.js.
- **Uso de JavaScript**: Permite importar arquivos `.js` no projeto, oferecendo flexibilidade adicional para misturar JS e TS.
- **Plugins específicos**: Inclui o plugin oficial do Next.js para fornecer suporte adicional no desenvolvimento de projetos.
- **Omissão de arquivos JS**: A opção `noEmit` impede a geração de arquivos de saída, uma vez que o Next.js lida com esse processo internamente.

### react-library.json
#### O arquivo `react-library.json` é uma configuração destinada ao desenvolvimento de bibliotecas React utilizando TypeScript. Ele estende o `base.json`, adicionando ajustes específicos para suportar bibliotecas baseadas no React.
#### Ações e Funcionalidades
- **Suporte a JSX**: Configurado com `jsx: react-jsx`, que habilita o novo runtime JSX do React (React 17+), simplificando a importação do React nos arquivos que utilizam JSX.
- **Extensão do base.json**: Aproveita as configurações já definidas no arquivo base para garantir consistência e boas práticas, enquanto aplica ajustes necessários para bibliotecas React.

### library.json
#### O arquivo `library.json` é uma configuração de TypeScript destinada ao desenvolvimento de bibliotecas. Ele estende o `base.json`, herdando todas as configurações padrão definidas nele, e adiciona ajustes específicos para atender às necessidades de projetos que serão consumidos em diferentes ambientes, como `Next.js` e `Nest.js`.
#### Ações e Funcionalidades

- **Saída Compilada (`outDir`)**: Define `./dist` como o diretório onde os arquivos compilados da biblioteca serão gerados.
- **Versão do JavaScript (`target`)**: Especifica `ES2020` como alvo, garantindo compatibilidade com recursos modernos do JavaScript.
- **Módulo (`module`)**: Configurado como `CommonJS` para garantir compatibilidade com projetos que utilizam este padrão, como o `Nest.js`.
- **Inclusão de Arquivos**: Inclui todos os arquivos presentes na pasta `src` para compilação.
- **Exclusão de Arquivos**: Exclui a pasta `node_modules` e arquivos relacionados a testes, como os com extensão `.test.ts` e `.spec.ts`.
