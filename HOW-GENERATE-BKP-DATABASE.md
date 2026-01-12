# Como exportar a base de dados do projeto com os dados já criados.

## Via container
### Parando o container.
```sh
  docker compose down 
```

### Exporte o volume para um arquivo tar:
```sh
  docker run --rm -v machadofolio_postgres_data:/volume -v $(pwd):/backup alpine tar czf /backup/postgres_data.tar.gz -C /volume . 
```
#### (Substitua machadofolio_postgres_data pelo nome real do volume, se diferente.). Transfira o arquivo postgres_data.tar.gz para o novo computador.

### No novo computador
#### Transfira o arquivo postgres_data.tar.gz para o novo computador.
```sh
  docker volume create machadofolio_postgres_data 
```
### Restaure o volume:
```sh
  docker run --rm -v machadofolio_postgres_data:/volume -v $(pwd):/backup alpine sh -c "cd /volume && tar xzf /backup/postgres_data.tar.gz" 
```
### Suba o docker para continuar usando
```sh
  docker-compose up -d 
```
## Via dump
### Escolha o nome da base de dados e o local que quer enviar os dados
#### docker exec - t {containerName} pg_dump -U localhost -d {databaseName} > {fileName}.sql
#### Ambiente de desenvolvimento
```sh
 docker exec -t machadofolioPostgres pg_dump -U localhost -d devPostgresDB > db/dump/devPostgresDB.sql 
```
#### Ambiente de staging
```sh
 docker exec -t machadofolioPostgres pg_dump -U localhost -d stgPostgresDB > db/dump/stgPostgresDB.sql 
```
#### Ambiente de produção
```sh
 docker exec -t machadofolioPostgres pg_dump -U localhost -d prodPostgresDB > db/dump/prodPostgresDB.sql 
```


