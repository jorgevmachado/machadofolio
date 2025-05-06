<div style="text-align: center;">
    <h1>NEST JS</h1>
<img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
    <br/>
<p>
    <strong>Powered by</strong>

![Yarn](https://img.shields.io/badge/yarn-2C8EBB.svg?style=falt&logo=yarn&logoColor=white)
![Typescript](https://img.shields.io/badge/typescript-%23323330.svg?style=falt&logo=typescript&logoColor=%233178C6)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=falt&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/jest-C53d15.svg?style=falt&logo=jest&logoColor=white)
</p>
</div>


## Para que serve ?
Este projeto é uma API desenvolvida com o framework **NestJS**,
que é uma solução progressiva para construir aplicações server-side eficientes,
escaláveis e confiáveis em **Node.js**. A API utiliza **TypeScript**
seguindo testes automatizados com **Jest**.

## Instalação do Ambiente
### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

## 🏠  Comandos
#### Todos os comandos aqui listados, devem ser executados na raiz do módulo (./apps/nest-js).
### Build
```bash
# Irá executar o build do módulo.
yarn build
```

### Develop

```bash
# Irá executar o módulo em modo de desenvolvimento. http://localhost:3001
yarn dev
```

### Lint
```bash
# Irá executar o lint no módulo.
# Veja `@repo/eslint-config` para personalizar o comportamento.
yarn lint
```
### test
```bash
# Irá executar todos os testes do módulo.
yarn test
```

## Módulos
### **Shared**: Este módulo fornece uma coleção de classes e utilitários essenciais para esté projeto.
#### **base**: Classe abstrata, que fornece um método utilitário para tratamento centralizado de erros.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/base/base.spec.ts                                 
```

#### **file**: Classe abstrata, que encapsula a lógica para upload e gerenciamento de arquivos em uma aplicação. Ele facilita operações relacionadas a arquivos, como criar caminhos e salvar arquivos no sistema, enquanto lida com possíveis erros.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/file/file.spec.ts                                 
```

#### **queries**: Classe projetada para facilitar e padronizar a execução de operações CRUD e consultas complexas em repositórios **TypeORM**. A classe é genérica, permitindo seu uso com diferentes entidades que herdam de um tipo básico.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/queries/queries.spec.ts                                 
```

#### **query**: classe, que fornece uma ferramenta poderosa e flexível para criar e executar consultas personalizadas utilizando o **TypeORM**. Ela abstrai a manipulação direta de query builders, simplificando a lógica para construção de consultas complexas com filtros, ordenação, relações e outras configurações.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/query/query.spec.ts                                 
```

#### **seeder**: classe, que fornece uma estrutura para gerenciar o processo de população de dados (seed) em um banco de dados em aplicações **NestJS** integradas com **TypeORM**. Ele lida com a inserção de dados iniciais ou necessários e evita duplicações, garantindo que as seeds sejam executadas de forma eficiente e confiável.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/seeder/seeder.spec.ts                                 
```

#### **service**: classe abstrata, que serve como uma camada base para serviços na aplicação, centralizando funcionalidades comuns para manipulação e gerenciamento de entidades no banco de dados, especialmente usando **TypeORM**. Ele integra operações como listagem, busca, validação e remoção de entidades, fornecendo uma base sólida para se estender em serviços específicos.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/service/service.spec.ts                                 
```

#### **validate**: classe que fornece métodos para validação de dados e entidades em uma aplicação. Seu objetivo é garantir a consistência dos dados manipulados, evitando erros durante o processamento ou persistência. Ele é usado principalmente para verificar a existência de parâmetros, validar se um objeto é uma entidade válida e identificar duplicatas em listas de dados.
#### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/shared/validate/validate.spec.ts                                 
```

### **strategies**: Conjunto de funções/métodos/classes de Estratégias de fluxo e validação.
#### **auth-jwt**: Implementa uma estratégia de autenticação baseada em tokens JWT, usando o `passport-jwt`.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/strategies/auth-jwt/auth-jwt.strategy.spec.ts                                 
```

### **auth**: Conjunto de serviços e endpoints relacionados a autenticação.
#### **users**: Conjunto de serviços relacionados a usuários que só podem ser acessados pelo auth.
- **create**: Cria um novo usuário no sistema após realizar validações de duplicidade de CPF, e-mail ou WhatsApp. Aplica hash na senha utilizando o e define um token de confirmação. `bcrypt`.
- **update**: Atualiza os dados de um usuário existente (como role, name, gender, status ou date of birth). Retorna o usuário atualizado no banco de dados.
- **checkCredentials**: Verifica se as credenciais de login fornecidas (e-mail e senha) são válidas. Confere o hash da senha e avalia se o usuário está ativo.
- **promoteUser**: Promove um usuário para o papel de administrador, caso ele ainda não seja . Retorna um objeto indicando o sucesso ou falha da promoção. `ADMIN`.
- **upload**: Realiza o upload de uma imagem de perfil (avatar) para o usuário, salva a URL do arquivo no banco de dados e retorna o usuário atualizado.
- **seed**: Realiza o processo de seed de um usuário mockado. Cria um novo usuário, caso ele ainda não exista, e o promove para administrador como parte da população inicial de dados.
- **me**: Busca um usuário específico pelo TOKEN. 
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/auth/users/users.service.spec.ts                                 
```
#### **auth.service**: Conjunto de serviços relacionados a autenticação com tratamentos de acesso consumindo o módulo de users.
- **signUp**: Registra um novo usuário com base nos dados fornecidos no e retorna uma mensagem de sucesso.
- **signIn**: Realiza a autenticação do usuário verificando suas credenciais. Se válidas, cria e retorna um token JWT junto com uma mensagem de sucesso.
- **me**: Retorna os dados do próprio usuário autenticado, carregando informações com limpeza de propriedades sensíveis.
- **findOne**: Busca um usuário específico pelo ID. Permite que administradores consultem usuários deletados. Aplica regras de negócio à resposta retornada.
- **update**: Atualiza os dados de um usuário, assegurando que o usuário autenticado tem permissões para realizar a atualização. Retorna uma mensagem de sucesso.
- **promoteUser**: Promove o papel de um usuário específico validando as permissões do usuário autenticado.
- **upload**: Realiza o upload de um arquivo associado ao usuário autenticado, após validar suas permissões. Retorna uma mensagem de sucesso ao concluir o upload.
- **seed**: Popula o banco de dados com dados de usuário padrão para inicialização do sistema. Retorna o usuário gerado ou uma mensagem de sucesso, dependendo do parâmetro.
- **me**: Busca um usuário específico pelo TOKEN e limpa os campos de segurança para não apresentar ao usuário.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/auth/auth.service.spec.ts                                 
``` 

