<div style="text-align: center;">
    <h1>NEST JS</h1>
<img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
    <br/>
<p>
    <strong>Powered by</strong>
    <br/>
    <img src="https://img.shields.io/badge/yarn-2C8EBB.svg?style=flat&logo=yarn&logoColor=white" alt="Yarn Logo" />
    <img src="https://img.shields.io/badge/typescript-%23323330.svg?style=flat&logo=typescript&logoColor=%233178C6" alt="TypeScript Logo" />
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=flat&logo=node.js&logoColor=white" alt="Node.js Logo" />
    <img src="https://img.shields.io/badge/jest-C53d15.svg?style=flat&logo=jest&logoColor=white" alt="Jest Logo" />
</p>
</div>

## 📚 Visão Geral
Este é o back-end do projeto **MACHADOFOLIO**, uma API desenvolvida em NestJS, responsável por fornecer os serviços para os módulos de autenticação, gestão financeira, Pokémon e integrações futuras.
O objetivo é oferecer uma API escalável, segura e bem estruturada, servindo como base sólida para os front-ends do monorepo.

---
## 🎯 Objetivos do Projeto
- Criar uma API robusta e modular para gerenciamento financeiro.
- Implementar autenticação segura com JWT e níveis de permissão.
- Permitir controle total de contas fixas, despesas e receitas.
- Oferecer endpoints documentados com Swagger.
- Servir como portfólio profissional para demonstrar boas práticas no back-end.

---

## 🏗️ Estrutura do Projeto
    .
    ├── apps/api
       ├── auth           # Autenticação e gerenciamento de usuários.
       └── finance        # Gestão financeira (Contas, despesas, receitas).
       └── pokemon        # Gestão de Pokemons.
       └── shared         # Módulo e serviços reutilizáveis.
       └── decorators     # Módulo de decoradores de requisições.
       └── guards         # Módulo de guards responsável por validar o permissionamento.
       └── interceptors   # Módulo de interceptadores.
       └── mocks          # Módulo de mocks para testes.
       └── strategies     # Módulo de estratégias e validações de requisições.
       └── transforms     # Módulo de transformação de campos nas requisições e persistencias de dados.
       └── main.ts        # Ponto inicial da aplicação.
       └── app.modules.ts # Módulo Raiz do NestJs. 
---

## 🚀 Tecnologias Utilizadas
- **[NestJS](https://nestjs.com/)**
- **[TypeScript](https://www.typescriptlang.org/)**
- **[PostgreSQL](https://www.postgresql.org/)**
- **[TypeORM](https://typeorm.io/)**
- **[JWT](https://jwt.io/)**
- **[Passport](http://www.passportjs.org/)**
- **[Swagger](https://swagger.io/)**
- **[class-validator](https://docs.nestjs.com/techniques/validation)**
- **[docker](https://www.docker.com/)**

---

## 🔐 Segurança
- Autenticação JWT: Cada usuário tem um token único.
- Permissões: Níveis administrativos para usuários.
- Proteção de rotas: Middleware para validação de permissões.

---
## 🗄️ Modelagem de Dados

Principais entidades do sistema financeiro:

- **Users** → Usuários com autenticação e permissão.
- **Finances** → Gerenciamento de Controle financeiro individual por usuário.
    - **Banks** → Gerenciamento de bancos.
    - **Suppliers** → Gerenciamento de Fornecedores vinculados aos tipos.
        - **Supplier Types** → Gerenciamento de Tipos de fornecedores.
    - **Bills** → Gerenciamento de Contas fixas (ex.: luz, internet, aluguel).
        - **Expenses** → Gerenciamento de Despesas associadas a uma conta, podendo ter subdespesas.
    - **Incomes** → Gerenciamento de Entradas financeiras ligadas a um mês e fonte de receita.
        - **Income Sources** → Gerenciamento de Fontes de receita (ex.: salário, freelas).
    - **Months** → Gerenciamento de Controle mensal (Janeiro a Dezembro).
- **Pokemons** → Gerenciamento de pokemons
    - **Pokemons Abilities** → Gerenciamento de Habilidades de pokemons
    - **Pokemons Moves** → Gerenciamento de Movimentações de pokemons
    - **Pokemons Types** → Gerenciamento de tipos de pokemons
---

## 🌐 APIs Disponíveis
A documentação completa pode ser acessada via Swagger após iniciar o projeto:
```bash
    http://localhost:3001/api/docs
```

### Endpoints principais
| Módulo          | Endpoint Base                 | Status           |
|-----------------|-------------------------------|------------------|
| Auth            | /auth                         | ✅ Concluído      |
| Finance         | /finance                      | 🔄 Em andamento  |
| Bills           | /finance/bill                 | 🔄 Em andamento  |
| Expenses        | /finance/bill/:billId/expense | 🔄 Em andamento  |
| Income          | /finance/income               | 🔄 Em andamento  |
| Income Source   | /finance/income/source        | ✅ Concluído      |
| Supplier        | /finance/supplier             | ✅ Concluído      |
| Supplier Type   | /finance/supplier/type        | ✅ Concluído      |
| Bank            | /finance/bank                 | ✅ Concluído      |
| Group           | /finance/group                | ✅ Concluído      |
| pokemon         | /pokemon                      | ✅ Concluído      |
| pokemon Ability | /pokemon/ability              | ✅ Concluído      |
| pokemon Move    | /pokemon/move                 | ✅ Concluído      |
| pokemon Type    | /pokemon/type                 | ✅ Concluído      |
| seeds           | /seeds                        | 🔄 Em andamento  |

---

## 🗺️ Roadmap
- Modulo de usuários	                              ✅ Concluído
    - Cadastro (/signUp) ✅
    - Autenticação (/signIn) ✅
    - Buscar usuário por token (/me) ✅
    - Edição de Usuário (/update) ✅
    - Upload de Avatar (/upload) ✅
    - Buscar Usuário por Id ou Nome *somente para usuários que possuem permissão administrativa* (/:id) ✅
    - Promover Usuário para administrador *somente para usuários que possuem permissão administrativa* (/:id/promote) ✅
- Modulo Financeiro                                  🔄 Em andamento
    - Inicialização de finanças pelo usuário (/finance/initialize) ✅ Concluído
    - Buscar Finanças por usuário (/finance) ✅ Concluído
    - Gerar Planilha Excel por usuário (/finance/generate-document) 🔄 Em andamento
    - Gerar Finanças por Planilha de Excel (/finance/upload) 🔄 Em andamento
    - Documentação 🔄 Em andamento
    - Modulo de Bancos ✅ Concluído
        - Cadastro (/finance/bank) ✅
        - Edição (/finance/:id/bank) ✅
        - Lista (/finance/list/bank) ✅
        - Busca por Id (/finance/:id/bank) ✅
        - Remoção via Soft-Delete (/finance/:id/bank) ✅
    - Modulo de Fornecedores ✅ Concluído
        - Cadastro de Tipo de Fornecedor (/finance/supplier/type) ✅
        - Edição de Tipo de Fornecedor (/finance/supplier/:id/type) ✅
        - Lista de Tipo de Fornecedor (/finance/supplier/list/type) ✅
        - Busca por Id de Tipo de Fornecedor (/finance/supplier/:id/type) ✅
        - Remoção via Soft-Delete de Tipo de Fornecedor (/finance/supplier/:id/type) ✅
        - Cadastro de Fornecedor (/finance/supplier) ✅
        - Edição de Fornecedor (/finance/supplier/:id) ✅
        - Lista de Fornecedor (/finance/supplier) ✅
        - Busca por Id de Fornecedor (/finance/supplier/:id) ✅
        - Remoção via Soft-Delete de Fornecedor (/finance/supplier/:id) ✅
    - Modulo de contas 🔄 Em andamento
        - Cadastro (/finance/bill) ✅
        - Edição (/finance/bill/:id) ✅
        - Lista (/finance/bill) ✅
        - Busca por Id (/finance/bill/:id) ✅
        - Remoção via Soft-Delete (/finance/bill/:id) ✅
        - Cadastro de Despesas (/finance/bill/:id/expense) 🔄
        - Lista de Despesas (/finance/bill/:id/list/expense) ✅
        - Edição de Despesas (/finance/bill/:id/expense/:id) 🔄
        - Buscar Despesas por id (/finance/bill/:id/expense/:id) ✅
        - Remoção de Despesas via Soft-Delete (/finance/bill/:id/expense/:id) ✅
    - Modulo de renda 🔄 Em andamento
        - Cadastro de Fonte de Renda (/finance/income/source) ✅
        - Edição de Fonte de Renda (/finance/income/:id/source) ✅
        - Lista de Fonte de Renda (/finance/income/list/source) ✅
        - Busca por Id de Fonte de Renda (/finance/income/:id/source) ✅
        - Remoção via Soft-Delete de Fonte de Renda (/finance/income/:id/source) ✅
        - Cadastro de Renda (/finance/income) 🔄
        - Edição de Renda (/finance/income/:id) 🔄
        - Lista de Rendas (/finance/income) 🔄
        - Busca por Id de Renda (/finance/income/:id) 🔄
        - Remoção via Soft-Delete de Renda (/finance/income/:id) 🔄
- Modulo de Pokemon 🔄 Em andamento
    - Listar Pokemons (/pokemon) ✅
    - Buscar Pokemon por Id (/pokemon/:id) ✅
    - Documentação 🔄
    - Modulo de Habilidades ✅ Concluído
        - Listar Habilidades (/pokemon/list/ability) ✅
        - Buscar Habilidade por id (/pokemon/:id/ability) ✅
    - Modulo de Movimentações ✅ Concluído
        - Listar Movimentações (/pokemon/list/move) ✅
        - Buscar Movimentação por id (/pokemon/:id/move) ✅
    - Modulo de Tipos ✅ Concluído
        - Listar Tipos (/pokemon/list/type) ✅
        - Buscar Tipo por id (/pokemon/:id/type) ✅
- Infraestrutura ⏳ Pendente
    - Testes ⏳ Pendente
    - Documentação	⏳ Pendente
    - Deploy Ambiente de DEV ⏳ Pendente
    - Deploy Ambiente de STG ⏳ Pendente
    - Deploy Ambiente de PROD ⏳ Pendente

## ⚙️ Instalação do Ambiente
### Pré-requisitos
#### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

## 🏠 Comandos Importantes
#### Todos os comandos aqui listados, devem ser executados na raiz do módulo (./apps/nest-js).
### Instalação e Build
```bash
    # Irá executar a instalação do módulo.
    yarn install
    # Irá executar o build do projeto nestJs.
    yarn build
```
### Lint
```bash
    # Irá executar o lint do projeto nestJs.
    yarn lint    
```
### Testes
```bash
    # Irá executar os testes do projeto nestJs
    yarn test    
```
### Develop
```bash
  # Irá executar o projeto nestJs em modo de desenvolvimento. http://localhost:3001
  yarn start:dev
```

## 🐳 Docker
### Subir os containers necessários para rodar o projeto:
```bash    
    docker-compose up -d    
```
### Encerrar os containers:
```bash  
    docker-compose down    
```

## 📘 Documentações Complementares
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

### **guards**: Conjunto de funções/métodos/classes que fazem proteção.
#### **auth-role**: Realiza a guarda do papel do usuário.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/guards/auth-role/auth-role.guard.spec.ts                                 
```
#### **auth-status**: Realiza a guarda do status do usuário.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/guards/auth-status/auth-status.guard.spec.ts                                 
```

#### **finance-initialize**: Realiza a guarda se o usuário possui finanças atribuida a ele.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/guards/finance-initialize/finance-initialize.guard.spec.ts                                 
```

### **strategies**: Conjunto de funções/métodos/classes de Estratégias de fluxo e validação.
#### **auth-jwt**: Implementa uma estratégia de autenticação baseada em tokens JWT, usando o `passport-jwt`.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/strategies/auth-jwt/auth-jwt.strategy.spec.ts                                 
```

### **decorators**: Conjunto de funções/métodos/classes para adicionar ou modificar comportamentos ou para fornecer metadados.
#### **CPF**: Irá validar se o campo possui as características de um cpf.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/decorators/cpf/cpf.decorator.spec.ts                                 
```
#### **Match**: Irá validar se uma um determinado campo possui o valor equivalente a outro.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/decorators/match/match.decorator.spec.ts                                 
```
#### **UseFileUpload**: Irá validar se um determinado arquivo possui as Características válidas para upload como tipo e se já existe.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/decorators/use-file-upload/use-file-upload.decorator.spec.ts                                 
```
#### **GetUserAuth**: Irá retornar as informações do usuário autenticado.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/decorators/auth-user/auth-user.decorator.spec.ts                                 
```
#### **IsNameDependingOnParent**: Irá validar se o campo name pode ou não ser preenchido a depender se o campo parent estiver presente.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/decorators/name-depending-parent.decorator/name-depending-parent.decorator.spec.ts                                 
```

### **auth**: Conjunto de serviços e endpoints relacionados a autenticação.
#### **users**: Conjunto de serviços relacionados a usuários que só podem ser acessados pelo auth.
- **create**: Cria um novo usuário no sistema após realizar validações de duplicidade de CPF, e-mail ou WhatsApp. Aplica hash na senha utilizando o e define um token de confirmação. `bcrypt`.
- **update**: Atualiza os dados de um usuário existente (como role, name, gender, status ou date of birth). Retorna o usuário atualizado no banco de dados.
- **checkCredentials**: Verifica se as credenciais de login fornecidas (e-mail e senha) são válidas. Confere o hash da senha e avalia se o usuário está ativo.
- **promote**: Promove um usuário para o papel de administrador, caso ele ainda não seja . Retorna um objeto indicando o sucesso ou falha da promoção. `ADMIN`.
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
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/auth/auth.service.spec.ts                                 
```
#### **auth.controller**: Controlador dos endpoints relascionados a autenticação.
- **signUp**: Aciona o serviço signUp do `auth.service` e retorna uma mensagem de sucesso.
- **signIn**: Aciona o serviço signIn do `auth.service` e retorna uma mensagem de sucesso e o token gerado.
- **me**: Aciona o serviço me do `auth.service` e retorna os dados do usuário autenticado.
- **findOne**: Aciona o serviço findOne do `auth.service` e retorna os dados do usuário autenticado pelo id do usuário.
- **update**: Aciona o serviço update do `auth.service` e retorna uma mensagem de sucesso.
- **promoteUser**: Aciona o serviço promoteUser do `auth.service` e retorna uma mensagem de sucesso os dados do usuário.
- **upload**: Aciona o serviço upload do `auth.service` e retorna uma mensagem de sucesso.
- **seed**: Aciona o serviço seed do `auth.service` e retorna uma mensagem de sucesso.
##### Comando para testes unitários exclusivo para esté sub-módulo.
```bash
  yarn run test -- --findRelatedTests src/auth/auth.controller.spec.ts                                 
``` 

### **finance**: Conjunto de serviços e endpoints relacionados a finanças.
#### **service**: Regras de négocio para o tratamento de finanças.
```bash
  // Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/finance.service.spec.ts                                 
```
#### **controller**: Endpoints relacionados a finanças.
```bash
  // Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/finance.controller.spec.ts                                 
```

#### **bank**: Conjunto de serviços relacionados a instituições bancárias.
- **service**: Regras de négocio para o tratamento das instituições bancárias.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bank/bank.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a instituições bancárias.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bank/bank.controller.spec.ts                                 
```
  
#### **bill**: Conjunto de serviços relacionados a contas a pagar.
- **service**: Regras de négocio para o tratamento das contas a pagar.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/bill.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a contas a pagar.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/bill.controller.spec.ts                                 
```
- **billCategory**: Conjunto de serviços relacionados a categoria da conta a pagar.
- - **service**: Regras de négocio para o tratamento da categoria da conta a pagar.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/category/category.service.spec.ts                                 
``` 
- - **controller**: Endpoints relacionados a categoria da conta a pagar.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/category/category.controller.spec.ts                                 
```
- **expense**: Conjunto de serviços relacionados a despesa da conta a pagar.
- - **service**: Regras de négocio para o tratamento de despesas da conta a pagar.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/expense/expense.service.spec.ts                                 
```
#### **supplier**: Conjunto de serviços relacionados a fornecedores.
- **service**: Regras de négocio para o tratamento de fornecedores.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/expense/supplier/supplier.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a fornecedores.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/expense/supplier/supplier.controller.spec.ts                                   
```
- **supplierType**: conjunto de serviços relacionados a tipos de fornecedor.
- - **service**: Regras de négocio para o tratamento de tipos de fornecedor.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/expense/supplier/type/type.service.spec.ts                    
```
- - **controller**: Endpoints relacionados a tipos de fornecedor.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/bill/expense/supplier/type/type.controller.spec.ts                      
```

### **pokemon**: Conjunto de serviços e endpoints relacionados a pokemon.
#### **service**: Regras de négocio para o tratamento de pokemons.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/pokemon.service.spec.ts                                 
```
#### **controller**: Endpoints relacionados a pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/finance/finance.controller.spec.ts                                 
```
#### **move**: Conjunto de serviços relacionados a movimentos de pokemon.
- **service**: Regras de négocio para o tratamento dos movimentos de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/move/move.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a movimentações de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/move/move.controller.spec.ts                                 
```
#### **type**: Conjunto de serviços relacionados a tipos de pokemon.
- **service**: Regras de négocio para o tratamento dos tipos de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/type/type.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a tipos de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/type/type.controller.spec.ts                                 
```

#### **ability**: Conjunto de serviços relacionados a Habilidades de pokemon.
- **service**: Regras de négocio para o tratamento de Habilidades de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/ability/ability.service.spec.ts                                 
```
- **controller**: Endpoints relacionados a Habilidades de pokemon.
```bash
  # Comando para testes unitários exclusivo para esté sub-módulo.
  yarn run test -- --findRelatedTests src/pokemon/ability/ability.controller.spec.ts                                 
```