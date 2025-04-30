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
### **Nest**
#### Utilitários relacionados a manipulação ou validação de 'endereço'.
- **cepFormatter**: Responsável por formatar um texto para cep.
- **cepValidator**: Valida se o valor é um cep valido.
#### Comando para teste unitários
```bash
  yarn run test -- --findRelatedTests src/address/address.spec.ts               
```

