<div style="text-align: center;">
    <h1>services</h1>
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
Módulo responsável por fornecer funções utilitárias em comum para todos os módulos, bibliotecas e projetos(apps).

## Instalação do Ambiente
Seguir as instruções do Readme Principal no ‘item’ Instalação do Ambiente [clique aqui](../../README.md).

Para usar o services dentro do projeto, basta adicionar o módulo no package.json do projeto.
```json
{
  "dependencies": {
    "@repo/services": "*"
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
### **Address**: Utilitários relacionados a manipulação ou validação de 'endereço'.
- **cepFormatter**: Responsável por formatar um texto para cep.
- **cepValidator**: Valida se o valor é um cep valido.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/address/address.spec.ts               
```

### **Array**: Utilitários ou manipuladores de arrays.
- **chunk**: Responsável por separar itens de um array em outro array.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/array/array.spec.ts               
```

### **Contact**: Utilitários relacionados a manipulação ou validação de formas de contato (telefone, e-mail e etc).
- **emailValidator**: Valida se o valor é um e-mail valido.
- **phoneValidator**: Valida se o valor é um telefone valido.
- **mobileValidator**: Valida se o valor é um telemóvel valido.
- **phoneFormatter**: Responsável por formatar um texto para Telefone.
- **mobileFormatter**: Responsável por formatar um texto para Telemóvel.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/contact/contact.spec.ts               
```

### **cookies**: Classe de utilitário para manipular ‘cookies’ do navegador.
- **get**: Obtém o valor de um ‘cookie’ específico pelo seu nome.
- **set**: Define um novo ‘cookie’ no navegador, com um valor, domínio, e duração.
- **remove**: Remove um 'cookie' específico pelo seu nome.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/cookies/cookies.spec.ts               
```

### **Date**: Utilitários relacionados a manipulação ou validação de datas com Subutilitários para manipulação de mes.
- **isUnderMinimumAge**: Valida se a data pertence a alguém maior de idade.
- **calculateMaxDate**: Calcula a data máxima de nascimento para alguém maior de idade.
- **createDateFromYearMonthDay**: Converte uma data em ‘string’ para data.
- **parseStartDate**: Transforma os campos numa data valida.
- **day**: Subutilitários relacionados a manipulação ou validação de dias de uma data.
  - **dayValidator**: Certifique-se de que o dia esteja dentro dos limites apropriados de ser maior que 1 e menor que e igual a 31.
  - **parseDay**: Garante que o dia fornecido esta dentro dos limites 1 e 31.
- **month**: Subutilitários relacionados a manipulação ou validação de meses de uma data.
  - **MONTHS**: Constante que retorna todos os 12 meses.
  - **getMonthIndex**: Responsável por transformar o enum de mês num índice de meses.
  - **isMonthValid**: Verifica se é um mês valido.
  - **getCurrentMonth**: Responsável por retornar o mês atual.
  - **getMonthByIndex**: Responsável por transformar um índice em um enum de mês.
  - **monthValidator**: Valida se o valor do mês passado é válido.
  - **parseMonth**: Garante que o mes fornecido esta dentro dos limites 0 e 12.
- **year**: Subutilitários relacionados a manipulação ou validação de anos de uma data.
  - **yearValidator**: Valida se o valor do ano passado é válido.
  - **parseYear**: Garante que o ano fornecido esta dentro dos limites 1000 e 9999.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/date/date.spec.ts               
  yarn run test -- --findRelatedTests src/date/day/day.spec.ts               
  yarn run test -- --findRelatedTests src/date/month/month.spec.ts               
```

### **Error**: Classe de utilitário relacionado a tratamento de erros.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/error/error.spec.ts               
               
```

### **File**: Utilitários relacionados a manipulação ou validação de arquivos.
- **imageTypeValidator**: Valida se o tipo do arquivo é de uma imagem.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/file/file.spec.ts               
```

### **Http**: Classe de utilitário para manipular chamadas HTTP gerenciar requisições e respostas.
- **url**: Obtém a url de requisição.
- **config**: Obtém as configurações de requisição.
- **get**: Aciona uma requisição HTTP GET.
- **path**: Aciona uma requisição HTTP PATH ou PUT.
- **post**: Aciona uma requisição HTTP POST.
- **remove**: Aciona uma requisição HTTP DELETE.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/http/http.spec.ts               
```

### **Number**: Utilitários relacionados a manipulação ou validação de 'number'.
- **isNumberEven**: Verifica se um número é par. Também valida se o número é um inteiro e lança um erro caso não seja.
- **extractLastNumberFromUrl**: Extraí o último segmento da URL e tenta convertê-lo para um número.
- **numberValidator**: Valida se é um número valido.
- **currencyFormatter**: Responsável por formatar um valor para valor monetário.
- **removeCurrencyFormatter**: Responsável por remover a formatação de um valor monetário.
- **ensureOrderNumber**: Responsável por receber um pedido e uma url, caso não tenha o pedido remove o valor do último valor da url. 
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/number/number.spec.ts               
```

### **Object**: Utilitários ou manipuladores de objetos.
- **isObject**: Verifica se o valor passado é um objeto.
- **Serialize**: Serialize um objeto (no formato chave-valor) em uma ‘string’ de consulta padrão de URL (`query string`).
- **findEntityBy**: Busca um objeto ou entidade a partir de uma lista e retorna o resultado.
- **transformObjectDateAndNulls**: Formata um objeto ou entidade, ou um grupo de entidades transformando tudo que for null em undefined e o que for data em Date.
- **transformDateStringInDate**: Formata um objeto ou entidade, ou um grupo de entidades transformando todos os campos do tipo data em data.
- **isObjectEmpty**: Verifica se um objeto está vazio ou não.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/object/object.spec.ts               
```

### **Password**: Utilitários relacionados a manipulação ou validação password.
- **minLength**: Valida se o valor possui o nũmero mínimo de caracteres.
- **leastOneLetter**: Valida se o valor possui ao menos uma letra.
- **leastOneNumber**: Valida se o valor possui ao menos um número.
- **leastOneSpecialCharacter**: Valida se o valor é uma senha valida.
- **passwordValidator**: Valida se o valor possui ao menos um caractere especial.
- **confirmPasswordValidator**: Valida se o valor de uma confirmação de senha é uma senha valida.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/password/password.spec.ts               
``` 

### **Personal Data**: Utilitários relacionados a manipulação ou validação de dados pessoais (cpf, nome e etc).
- **cpfFormatter**: Responsável por formatar um valor para cpf.
- **cpfValidator**: Valida se o valor é um cpf valido.
- **nameValidator**: Valida se o valor é um nome válido.
- **genderValidator**: Valida se o valor é um gênero válido.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/personal-data/personal-data.spec.ts               
```

### **Spreadsheet**: Utilitários relacionados a manipulação de planilhas no formato xlsx.
- **workBook**: Utilitário responsável por manipular a planilha geral caso seja necessário algo mais personalizado.
- **createWorkSheet**: Utilitário responsável por criar uma aba dentro de uma planilha (worksheet).
- **addTables**: Utilitário responsável por facilitar a criação de multiplas tabelas.
- **addTable**: Utilitário responsável pela criação de uma tabela.
- **generateSheetBuffer**: Utilitário responsável por gerar uma planilha no formato Buffer para download.
- **cell**: Subutilitário responsável por manipular as celulas de uma planilha.
  - **add**: Responsável por adicionar uma célula a planilha.
  - **reference**: Responsável por retornar a célula a ser criada na planilha.
  - **merge**: Responsável mesclar um grupo de células numa planilha.
  - **column**: Responsável retornar ou manipular uma coluna numa planilha.
- **table**: Subutilitários responsável por manipular os parameters de criação de uma tabela. 
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/spreadsheet/spreadsheet.spec.ts               
  yarn run test -- --findRelatedTests src/spreadsheet/cell/cell.spec.ts               
  yarn run test -- --findRelatedTests src/spreadsheet/table/table.spec.ts                         
```

### **String**: Utilitários relacionados a manipulação ou validação de 'strings'.
- **initials**: Retorna as iniciais de uma 'string' com um número específico de letras.
- **Normalize**: Remove acentos e espaços extras e Normaliza espaços múltiplos para um único espaço.
- **formatUrl**: Constrói uma URL formatada com caminho adicional ('path') e parâmetros de consulta ('params').
- **capitalize**: Retorna uma 'string' com a primeira letra em maiúscula.
- **toSnakeCase**: Converte strings em camel case (ou similares) para snake case (formato `snake_case`).
- **toCamelCase**: Converte strings no formato `snake_case` para camel case.
- **findRepeated**: Procura duplicatas numa lista de objetos com base numa chave definida ('id' ou 'name').
- **truncateString**: Trunca uma 'string' para o comprimento especificado ('length') e converte para maiúsculas.
- **convertSubPathUrl**: Converte e constrói uma URL anexando subcaminhos e parâmetros com base nas opções fornecidas.
- **separateCamelCase**: Separa palavras em camel case ('CamelCase') para uma versão com espaços e capitalização individual.
- **snakeCaseToNormal**: Converte uma 'string' snake_case fornecida em uma string case normal legível por humanos.
- **extractLastItemFromUrl**: Extrai o último segmento de uma URL.
- **cleanFormatter**: Responsável por limpar a formatação do texto.
- **sanitize**: Responsável por realizar a higienização do texto.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/string/string.spec.ts               
```

### **UUID**: Utilitário que fornece funções relacionadas ao uso de UUIDs.
- **generateUUID**: Gera um UUID usando a função `v4` da biblioteca . Permite a inclusão opcional de um prefixo antes do UUID. `uuid`.
- **isUUID**: Verifica se uma ‘string’ fornecida é um UUID válido. Utiliza a função `validate` da biblioteca para fazer essa checagem. `uuid`.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/UUID/UUID.spec.ts               
```

### **window**: Funções relacionadas ao objeto `window` (provavelmente para navegadores).
- **isBrowser**: Verifica se o código está sendo executado num ambiente de navegador verificando se o objeto global `window` está definido.
- **isDocument**: Verifica se o objeto global `document` está disponível, indicando que o código está sendo executado num ambiente com suporte ao DOM (como um navegador).
- **documentCookie**: Retorna os ‘cookies’ do documento atual usando `document.cookie`.
#### Comando para testes unitários exclusivo para esté módulo.
```bash
  yarn run test -- --findRelatedTests src/window/window.spec.ts               
```













 





