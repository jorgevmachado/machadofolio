#!/bin/bash
set -e

echo "===> Executando script de inicialização para múltiplos bancos..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname postgres <<-EOSQL
    CREATE USER dev_user WITH ENCRYPTED PASSWORD 'dev_password';
    CREATE USER stg_user WITH ENCRYPTED PASSWORD 'stg_password';
    CREATE USER prod_user WITH ENCRYPTED PASSWORD 'prod_password';

    CREATE DATABASE "devPostgresDB" OWNER dev_user;
    CREATE DATABASE "stgPostgresDB" OWNER stg_user;
    CREATE DATABASE "prodPostgresDB" OWNER prod_user;

    REVOKE CONNECT ON DATABASE "devPostgresDB" FROM PUBLIC;
    REVOKE CONNECT ON DATABASE "stgPostgresDB" FROM PUBLIC;
    REVOKE CONNECT ON DATABASE "prodPostgresDB" FROM PUBLIC;
EOSQL

echo "===> Script de inicialização finalizado."
