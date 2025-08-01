<div style="text-align: center;">
    <h1>Business</h1>
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
### Módulo responsável por lidar com as regras de negócio em comum de todos os projetos (‘apps’).

## Instalação do Ambiente
### Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

### Para usar o business dentro do projeto, basta adicionar o módulo no package.json do projeto.
```json
{
  "dependencies": {
    "@repo/business": "*"
  }      
}
```

## 🏠  Comandos
### **Build**
```bash
# Irá executar o build do módulo.
yarn build
```

### **test**
```bash
# Irá executar todos os testes do módulo.
yarn test
```

### **Lint**
```bash
# Irá executar o lint no módulo.
# Veja `@repo/eslint-config` para personalizar o comportamento.
yarn lint
```

## Módulos
### **shared**: Este módulo fornece uma coleção de classes e utilitários essenciais para esté projeto.
#### **baseService**: classe abstrata, que serve como uma camada base para serviços na aplicação, centralizando funcionalidades comuns para manipulação e gerenciamento de entidades no banco de dados, especialmente usando **TypeORM**. Ele integra operações como listagem, busca, validação e remoção de entidades, fornecendo uma base sólida para se estender em serviços específicos.
##### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/shared/service/base-service.spec.ts               
```

### **api**: Utilitários relacionados a manipulação de serviços de varias bibliotecas como NestJs.
#### **Nest**: Utilitários relacionados a manipulação de serviços privados do módulo nestJs.
##### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/api/nest/nest.spec.ts               
```
##### - **nestModuleAbstract**: 
##### Classe abstrata, que serve como uma camada base para serviços na aplicação, centralizando funcionalidades comuns para manipulação e gerenciamento de entidades no banco de dados, especialmente usando **TypeORM**. Ele integra operações como listagem, busca, validação e remoção de entidades, fornecendo uma base sólida para se estender em serviços específicos.
```bash
  yarn run test -- --findRelatedTests src/api/nest/abstract/nestModuleAbstract.spec.ts               
```
##### - **auth**: 
##### Utilitários relacionados a manipulação de serviços de autenticação nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/auth/auth.spec.ts               
```
##### - **finance**: 
Utilitários relacionados a manipulação de serviços do módulo de finanças nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/finance.spec.ts               
```
- **bank**: Utilitários relacionados a manipulação de serviços do módulo de finanças bancos nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/bank/bank.spec.ts               
```
- **supplier**: Utilitários relacionados a manipulação de serviços do módulo de finanças fornecedores nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/supplier/supplier.spec.ts               
```
- - **supplier-type**: Utilitários relacionados a manipulação de serviços do módulo de finanças tipos de fornecedores nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/supplier/type/type.spec.ts               
```
- **bill**: Utilitários relacionados a manipulação de serviços do módulo de finanças contas a pagar nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/bill/bill.spec.ts               
```
- - **bill-category**: Utilitários relacionados a manipulação de serviços do módulo de finanças Categoria das contas a Pagar nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/bill/category/category.spec.ts               
```
- - **expense**: Utilitários relacionados a manipulação de serviços do módulo de finanças Despesas nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/finance/bill/expense/expense.spec.ts               
```

##### - **pokemon**:
Utilitários relacionados a manipulação de serviços de pokemon nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/pokemon/pokemon.spec.ts               
```
- **ability**: Utilitários relacionados a manipulação de serviços do módulo de habilidades de pokemon nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/pokemon/ability/ability.spec.ts               
```
- **move**: Utilitários relacionados a manipulação de serviços do módulo de movimentos de pokemon nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/pokemon/move/move.spec.ts               
```
- **type**: Utilitários relacionados a manipulação de serviços do módulo de tipos de pokemon nestJs.
```bash
  yarn run test -- --findRelatedTests src/api/nest/pokemon/type/type.spec.ts               
```
---

#### **poke-api**: Utilitários relacionados a manipulação de serviços privados do módulo poke-api.
##### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/api/poke-api/poke-api.spec.ts               
```
##### - **specie**:
##### Utilitários relacionados a manipulação de serviços de manipulação de espécies de pokemon poke-api.
```bash
  yarn run test -- --findRelatedTests src/api/poke-api/specie/specie.spec.ts               
```

##### - **evolution**:
##### Utilitários relacionados a manipulação de serviços de manipulação de evoluções de pokemon poke-api.
```bash
  yarn run test -- --findRelatedTests src/api/poke-api/evolution/evolution.spec.ts               
```

##### - **move**:
##### Utilitários relacionados a manipulação de serviços de manipulação de movimentações de pokemon poke-api.
```bash
  yarn run test -- --findRelatedTests src/api/poke-api/move/move.spec.ts               
```

### **auth**: Utilitários relacionados a manipulação de usuário e autenticação.
#### **business**: Utilitários relacionados a regras de negócios na manipulação de usuário e autenticação.
##### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/auth/business/business.spec.ts               
```
##### **service**: Utilitários relacionados ao consumo de serviços de autenticação.
###### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/auth/service/service.spec.ts               
```
##### **user**: Utilitários relacionados a manipulação da entidade usuário.
###### Comando para teste unitários deste sub-módulo
```bash
  yarn run test -- --findRelatedTests src/auth/user/user.spec.ts               
```
- **config**: Utilitários relacionados a manipulação de configurações internas da entidadde usuário.
```bash
  yarn run test -- --findRelatedTests src/auth/user/config.spec.ts               
```
---

### **finance**: Utilitários relacionados a manipulação de finanças.
- **finance**: Utilitários relacionados a manipulação da entidade finance.
```bash
  yarn run test -- --findRelatedTests src/finance/finance.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de finanças.
```bash
  yarn run test -- --findRelatedTests src/finance/service/service.spec.ts               
```
- **business**: Utilitários relacionados as regras de negocio de finanças.
```bash
  yarn run test -- --findRelatedTests src/finance/business/business.spec.ts               
```

##### **bank**: Utilitários relacionados a manipulação de bancos no contexto de finanças.
- **bank**: Utilitários relacionados a manipulação da entidade banco.
```bash
  yarn run test -- --findRelatedTests src/finance/bank/bank.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de bancos.
```bash
  yarn run test -- --findRelatedTests src/finance/bank/service/service.spec.ts               
```

##### **supplier-type**: Utilitários relacionados a manipulação de Tipos de fornecedor no contexto de finanças.
- **supplier-type**: Utilitários relacionados a manipulação da entidade Tipos de fornecedor.
```bash
  yarn run test -- --findRelatedTests src/finance/supplier-type/supplier-type.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de Tipos de fornecedor.
```bash
  yarn run test -- --findRelatedTests src/finance/supplier-type/service/service.spec.ts               
```

##### **supplier**: Utilitários relacionados a manipulação de fornecedor no contexto de finanças.
- **supplier**: Utilitários relacionados a manipulação da entidade de fornecedor.
```bash
  yarn run test -- --findRelatedTests src/finance/supplier/supplier.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de fornecedor.
```bash
  yarn run test -- --findRelatedTests src/finance/supplier/service/service.spec.ts               
```

##### **group**: Utilitários relacionados a manipulação de Grupo de contas no contexto de finanças.
- **group**: Utilitários relacionados a manipulação da entidade Grupo de Contas.
```bash
  yarn run test -- --findRelatedTests src/finance/group/group.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de Grupo de Contas.
```bash
  yarn run test -- --findRelatedTests src/finance/group/service/service.spec.ts               
```

##### **expense**: Utilitários relacionados a manipulação de despesas no contexto de finanças.
- **expense**: Utilitários relacionados a manipulação da entidade Despesas.
```bash
  yarn run test -- --findRelatedTests src/finance/expense/expense.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de Despesas.
```bash
  yarn run test -- --findRelatedTests src/finance/expense/service/service.spec.ts               
```
- **business**: Utilitários relacionados as regras de negocio de Despesas.
```bash
  yarn run test -- --findRelatedTests src/finance/expense/business/business.spec.ts               
```

##### **bill**: Utilitários relacionados a manipulação de Contas no contexto de finanças.
- **bill**: Utilitários relacionados a manipulação da entidade Contas.
```bash
  yarn run test -- --findRelatedTests src/finance/bill/bill.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de Contas.
```bash
  yarn run test -- --findRelatedTests src/finance/bill/service/service.spec.ts               
```
- **business**: Utilitários relacionados as regras de negocio de Contas.
```bash
  yarn run test -- --findRelatedTests src/finance/bill/business/business.spec.ts               
```
---
### **pokemon**: Utilitários relacionados a manipulação de pokemons.
- **pokemon**: Utilitários relacionados a manipulação da entidade pokemon.
```bash
  yarn run test -- --findRelatedTests src/pokemon/pokemon.spec.ts               
```
- **service**: Utilitários relacionados ao consumo de serviços de manipulação de pokemons.
```bash
  yarn run test -- --findRelatedTests src/pokemon/service/service.spec.ts               
```
- **business**: Utilitários relacionados as regras de negocio de pokemons.
```bash
  yarn run test -- --findRelatedTests src/pokemon/business/business.spec.ts               
```
##### **ability**: Utilitários relacionados a manipulação de habilidades de pokemon.
- **ability**: Utilitários relacionados a manipulação da entidade de habilidades de pokemon.
```bash
  yarn run test -- --findRelatedTests src/pokemon/ability/ability.spec.ts               
```
##### **move**: Utilitários relacionados a manipulação de movimentos de pokemon.
- **move**: Utilitários relacionados a manipulação da entidade de movimentos de pokemon.
```bash
  yarn run test -- --findRelatedTests src/pokemon/move/move.spec.ts               
```
##### **type**: Utilitários relacionados a manipulação de tipos de pokemon.
- **type**: Utilitários relacionados a manipulação da entidade de tipos de pokemon.
```bash
  yarn run test -- --findRelatedTests src/pokemon/type/type.spec.ts               
```
##### **poke-api**: Utilitários relacionados a manipulação de requisições a poke-api.
- **service**: Utilitários relacionados a manipulação de serviços da poke-api.
```bash
  yarn run test -- --findRelatedTests src/pokemon/poke-api/service/service.spec.ts               
```
- **business**: Utilitários relacionados as regras de negocio de poke-api.
```bash
  yarn run test -- --findRelatedTests src/pokemon/poke-api/business/business.spec.ts               
```

- **move**: Utilitários relacionados aos movimentos dos pokemons.
- - **service**: Utilitários relacionados a manipulação de serviços de movimentos dos pokemons poke-api.
```bash
  yarn run test -- --findRelatedTests src/pokemon/poke-api/move/service/service.spec.ts               
```