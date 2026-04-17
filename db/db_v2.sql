CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS banks(
  id         uuid      DEFAULT uuid_generate_v4() NOT NULL CONSTRAINT "PK_bank_id" PRIMARY KEY,
  name       varchar(200) NOT NULL CONSTRAINT "UQ_bank_name" UNIQUE,
  name_code  varchar(200) NOT NULL CONSTRAINT "UQ_bank_name_code" UNIQUE,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL,
  deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS income_sources(
    id         uuid      default uuid_generate_v4() NOT NULL CONSTRAINT "PK_income_sources_id" PRIMARY KEY,
    name       varchar(200)                         NOT NULL CONSTRAINT "UQ_income_sources_name" UNIQUE,
    name_code  varchar(200)                         NOT NULL CONSTRAINT "UQ_income_sources_name_code" UNIQUE,
    created_at timestamp default now()              NOT NULL,
    updated_at timestamp default now()              NOT NULL,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS supplier_types(
    id         uuid      default uuid_generate_v4() NOT NULL CONSTRAINT "PK_supplier_types_id" PRIMARY KEY,
    name       varchar(200)                         NOT NULL CONSTRAINT "UQ_supplier_types_name" UNIQUE,
    name_code  varchar(200)                         NOT NULL CONSTRAINT "UQ_supplier_types_name_code" UNIQUE,
    created_at timestamp default now()              NOT NULL,
    updated_at timestamp default now()              NOT NULL,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS suppliers(
    id         uuid      default uuid_generate_v4() NOT NULL CONSTRAINT "PK_suppliers_id" PRIMARY KEY,
    name       varchar(200)                         NOT NULL CONSTRAINT "UQ_suppliers_name" UNIQUE,
    name_code  varchar(200)                         NOT NULL CONSTRAINT "UQ_suppliers_name_code" UNIQUE,
    created_at timestamp default now()              NOT NULL,
    updated_at timestamp default now()              NOT NULL,
    deleted_at timestamp,
    "typeId" UUID NOT NULL CONSTRAINT "FK_supplier_types" REFERENCES supplier_types
)

CREATE TABLE IF NOT EXISTS finances(
    id uuid default uuid_generate_v4() NOT NULL CONSTRAINT "PK_finances_id" PRIMARY KEY,
    created_at timestamp default now() NOT NULL,
    updated_at timestamp default now() NOT NULL,
    deleted_at timestamp
);

CREATE TABLE IF NOT EXISTS incomes
(
    id          uuid           default uuid_generate_v4() NOT NULL CONSTRAINT "PK_incomes" PRIMARY KEY,
    year        integer                                   NOT NULL,
    name        varchar(200)                              NOT NULL CONSTRAINT "UQ_incomes_name" UNIQUE,
    total       numeric(10, 2) default '0'::numeric       NOT NULL,
    name_code   varchar(200)                              NOT NULL CONSTRAINT "UQ_incomes_name_code" UNIQUE,
    description varchar,
    created_at  timestamp      default now()              NOT NULL,
    updated_at  timestamp      default now()              NOT NULL,
    deleted_at  timestamp,
    "sourceId"  uuid                                      NOT NULL CONSTRAINT "FK_income_sources" REFERENCES income_sources(id),
    "financeId" uuid                                      NOT NULL CONSTRAINT "FK_finances" REFERENCES finances(id),
    all_paid    boolean        default false              NOT NULL
    )

CREATE TABLE IF NOT EXISTS groups
(
    id          uuid      default uuid_generate_v4() NOT NULL CONSTRAINT "PK_banks_id" PRIMARY KEY,
    name        varchar(200)                         NOT NULL CONSTRAINT "UQ_banks_name" UNIQUE,
    name_code   varchar(200)                         NOT NULL CONSTRAINT "UQ_banks_name_code" UNIQUE,
    created_at  timestamp default now()              NOT NULL,
    updated_at  timestamp default now()              NOT NULL,
    deleted_at  timestamp,
    "financeId" uuid                                 NOT NULL CONSTRAINT "FK_finances" REFERENCES finances
);

CREATE TYPE bills_type_enum AS ENUM ('PIX', 'BANK_SLIP', 'CREDIT_CARD', 'ACCOUNT_DEBIT');

CREATE TABLE IF NOT EXISTS bills
(
    id          uuid           default uuid_generate_v4() NOT NULL CONSTRAINT "PK_bills_id" PRIMARY KEY,
    name        varchar(200)                              NOT NULL,
    year        integer                                   NOT NULL,
    type        bills_type_enum                           NOT NULL,
    total       numeric(10, 2) default '0'::numeric       NOT NULL,
    all_paid    boolean        default false              NOT NULL,
    name_code   varchar(200)                              NOT NULL,
    created_at  timestamp      default now()              NOT NULL,
    updated_at  timestamp      default now()              NOT NULL,
    deleted_at  timestamp,
    total_paid  numeric(10, 2) default '0'::numeric       NOT NULL,
    "bankId"    uuid                                      NOT NULL CONSTRAINT "FK_banks" REFERENCES banks(id),
    "financeId" uuid                                      NOT NULL CONSTRAINT "FK_finances" REFERENCES finances(id),
    "groupId"   uuid                                      NOT NULL CONSTRAINT "FK_group" REFERENCES groups(id)
);

CREATE TYPE expenses_type_enum AS ENUM ('FIXED','VARIABLE')

CREATE TABLE IF NOT EXISTS expenses
(
    id                uuid           default uuid_generate_v4() NOT NULL CONSTRAINT "PK_expenses_id" PRIMARY KEY,
    name              varchar(200)                              NOT NULL,
    year              integer                                   NOT NULL,
    type              expenses_type_enum                        NOT NULL,
    paid              boolean                                   NOT NULL,
    total             numeric(10, 2) default '0'::numeric       NOT NULL,
    name_code         varchar(200)                              NOT NULL,
    total_paid        numeric(10, 2) default '0'::numeric       NOT NULL,
    total_pending     numeric(10, 2) default '0'::numeric,
    description       varchar,
    instalment_number integer                                   NOT NULL,
    is_aggregate      boolean        default false              NOT NULL,
    aggregate_name    varchar,
    created_at        timestamp      default now()              NOT NULL,
    updated_at        timestamp      default now()              NOT NULL,
    deleted_at        timestamp,
    "billId"          uuid                                      NOT NULL CONSTRAINT "FK_bills" REFERENCES bills(id),
    "supplierId"      uuid                                      NOT NULL CONSTRAINT "FK_suppliers" REFERENCES suppliers(id),
    "parentId"        uuid CONSTRAINT "FK_parent" REFERENCES expenses
);

CREATE TABLE IF NOT EXISTS months
(
    id          uuid           default uuid_generate_v4() NOT NULL CONSTRAINT "PK_months_id" PRIMARY KEY,
    paid        boolean                                   NOT NULL,
    year        integer                                   NOT NULL,
    code        integer                                   NOT NULL,
    value       numeric(10, 2) default '0'::numeric       NOT NULL,
    label       varchar                                   NOT NULL,
    created_at  timestamp      default now()              NOT NULL,
    updated_at  timestamp      default now()              NOT NULL,
    deleted_at  timestamp,
    received_at timestamp                                 NOT NULL,
    "incomeId"  uuid CONSTRAINT "FK_incomes" REFERENCES incomes,
    "expenseId" uuid CONSTRAINT "FK_expenses" REFERENCES expenses
);

CREATE TYPE users_role_enum AS ENUM ('ADMIN', 'USER');

CREATE TYPE users_gender_enum AS ENUM ( 'MALE', 'FEMALE', 'OTHER')

CREATE TABLE IF NOT EXISTS users
(
    id                 uuid              default uuid_generate_v4()              NOT NULL CONSTRAINT "PK_users_id" PRIMARY KEY,
    cpf                varchar(11)                                               NOT NULL CONSTRAINT "UQ_users_cpf" UNIQUE,
    role               users_role_enum   default 'USER'::users_role_enum         NOT NULL,
    salt               varchar                                                   NOT NULL,
    name               varchar(200)                                              NOT NULL,
    email              varchar(200)                                              NOT NULL CONSTRAINT "UQ_users_email" UNIQUE,
    gender             users_gender_enum default 'USERS'::users_gender_enum      NOT NULL,
    status             users_status_enum default 'INCOMPLETE'::users_status_enum NOT NULL,
    avatar             varchar,
    whatsapp           varchar(11)                                               NOT NULL CONSTRAINT "UQ_users_whatsapp" UNIQUE,
    password           varchar                                                   NOT NULL,
    created_at         timestamp         default now()                           NOT NULL,
    updated_at         timestamp         default now()                           NOT NULL,
    deleted_at         timestamp,
    date_of_birth      timestamp                                                 NOT NULL,
    recover_token      varchar(64),
    confirmation_token varchar(64),
    "financeId"        uuid CONSTRAINT "REL_finances" UNIQUE CONSTRAINT "FK_finances" REFERENCES finances
);