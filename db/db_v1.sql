CREATE TABLE "finances" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "banks" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "name_code" varchar(200) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "supplier_types" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "name_code" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "income_sources" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "name_code" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "groups" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "name_code" varchar(200) UNIQUE NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "finance_id" uuid NOT NULL
);

CREATE TABLE "bills" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "year" int NOT NULL,
  "type" varchar NOT NULL,
  "total" numeric(10,2) NOT NULL DEFAULT 0,
  "all_paid" boolean NOT NULL DEFAULT false,
  "name_code" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "total_paid" numeric(10,2) NOT NULL DEFAULT 0,
  "bank_id" uuid NOT NULL,
  "finance_id" uuid NOT NULL,
  "group_id" uuid NOT NULL
);

CREATE TABLE "suppliers" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "name_code" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "type_id" uuid NOT NULL
);

CREATE TABLE "expenses" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "name" varchar(200) UNIQUE NOT NULL,
  "year" int NOT NULL,
  "type" varchar NOT NULL,
  "paid" boolean NOT NULL DEFAULT false,
  "total" numeric(10,2) NOT NULL DEFAULT 0,
  "name_code" varchar(200) NOT NULL,
  "total_paid" numeric(10,2) NOT NULL DEFAULT 0,
  "description" varchar,
  "installment_number" int,
  "is_aggregate" boolean NOT NULL DEFAULT false,
  "aggregate_name" varchar,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "bill_id" uuid NOT NULL,
  "supplier_id" uuid NOT NULL,
  "parent_id" uuid NOT NULL
);

CREATE TABLE "incomes" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "year" int NOT NULL,
  "name" varchar(200) UNIQUE NOT NULL,
  "total" numeric(10,2) NOT NULL DEFAULT 0,
  "name_code" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "description" varchar,
  "source_id" uuid NOT NULL,
  "finance_id" uuid NOT NULL
);

CREATE TABLE "months" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "paid" boolean NOT NULL DEFAULT false,
  "year" int NOT NULL,
  "code" int NOT NULL,
  "value" numeric(10,2) NOT NULL DEFAULT 0,
  "label" varchar NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "received_at" timestamp,
  "expense_id" uuid,
  "income_id" uuid
);

CREATE TABLE "pokemon_abilities" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "url" varchar(50) NOT NULL,
  "name" varchar(200) NOT NULL,
  "order" int NOT NULL,
  "slot" int NOT NULL,
  "is_hidden" boolean NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "pokemon_moves" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "pp" int NOT NULL,
  "url" varchar(50) NOT NULL,
  "type" varchar NOT NULL,
  "name" varchar(200) NOT NULL,
  "order" int NOT NULL,
  "power" int,
  "target" varchar,
  "effect" varchar,
  "priority" int,
  "accuracy" int,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "short_effect" varchar,
  "damage_class" varchar,
  "effect_chance" int
);

CREATE TABLE "pokemon_types" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "url" varchar(50) NOT NULL,
  "name" varchar(200) NOT NULL,
  "order" int NOT NULL,
  "text_color" varchar(200) NOT NULL,
  "background_color" varchar(200) NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "pokemons" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "hp" int,
  "url" varchar(50) NOT NULL,
  "name" varchar(200) NOT NULL,
  "order" int NOT NULL,
  "image" varchar(200),
  "speed" int,
  "status" varchar NOT NULL DEFAULT 'INCOMPLETE',
  "attack" int,
  "defense" int,
  "habitat" varchar,
  "is_baby" boolean,
  "shape_url" varchar(50),
  "shape_name" varchar(200),
  "is_mythical" boolean,
  "gender_rate" int,
  "is_legendary" boolean,
  "capture_rate" int,
  "hatch_counter" int,
  "base_happiness" int,
  "special_attack" int,
  "special_defense" int,
  "evolution_chain_url" varchar,
  "evolves_from_species" varchar,
  "has_gender_differences" boolean,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp
);

CREATE TABLE "pokemons_moves_pokemon_moves" (
  "pokemonsId" uuid,
  "pokemonMovesId" uuid,
  PRIMARY KEY ("pokemonsId", "pokemonMovesId")
);

CREATE TABLE "pokemons_types_pokemon_types" (
  "pokemonsId" uuid,
  "pokemonTypesId" uuid,
  PRIMARY KEY ("pokemonsId", "pokemonTypesId")
);

CREATE TABLE "pokemons_abilities_pokemon_abilities" (
  "pokemonsId" uuid,
  "pokemonAbilitiesId" uuid,
  PRIMARY KEY ("pokemonsId", "pokemonAbilitiesId")
);

CREATE TABLE "pokemons_evolutions_pokemons" (
  "pokemonsId_1" uuid,
  "pokemonsId_2" uuid,
  PRIMARY KEY ("pokemonsId_1", "pokemonsId_2")
);

CREATE TABLE "users" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "cpf" varchar(11) UNIQUE NOT NULL,
  "role" varchar NOT NULL DEFAULT 'USER',
  "salt" varchar NOT NULL,
  "name" varchar(200) NOT NULL,
  "email" varchar(200) UNIQUE NOT NULL,
  "gender" varchar NOT NULL,
  "status" varchar NOT NULL DEFAULT 'INCOMPLETE',
  "avatar" varchar,
  "whatsapp" varchar(11) UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT (now()),
  "updated_at" timestamp NOT NULL DEFAULT (now()),
  "deleted_at" timestamp,
  "date_of_birth" timestamp NOT NULL,
  "recover_token" varchar(64),
  "confirmation_token" varchar(64),
  "finance_id" uuid UNIQUE
);

ALTER TABLE "groups" ADD FOREIGN KEY ("finance_id") REFERENCES "finances" ("id");

ALTER TABLE "bills" ADD FOREIGN KEY ("bank_id") REFERENCES "banks" ("id");

ALTER TABLE "bills" ADD FOREIGN KEY ("finance_id") REFERENCES "finances" ("id");

ALTER TABLE "bills" ADD FOREIGN KEY ("group_id") REFERENCES "groups" ("id");

ALTER TABLE "suppliers" ADD FOREIGN KEY ("type_id") REFERENCES "supplier_types" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("bill_id") REFERENCES "bills" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("supplier_id") REFERENCES "suppliers" ("id");

ALTER TABLE "expenses" ADD FOREIGN KEY ("parent_id") REFERENCES "expenses" ("id");

ALTER TABLE "incomes" ADD FOREIGN KEY ("source_id") REFERENCES "income_sources" ("id");

ALTER TABLE "incomes" ADD FOREIGN KEY ("finance_id") REFERENCES "finances" ("id");

ALTER TABLE "months" ADD FOREIGN KEY ("expense_id") REFERENCES "expenses" ("id");

ALTER TABLE "months" ADD FOREIGN KEY ("income_id") REFERENCES "incomes" ("id");

ALTER TABLE "pokemons_moves_pokemon_moves" ADD FOREIGN KEY ("pokemonsId") REFERENCES "pokemons" ("id");

ALTER TABLE "pokemons_moves_pokemon_moves" ADD FOREIGN KEY ("pokemonMovesId") REFERENCES "pokemon_moves" ("id");

ALTER TABLE "pokemons_types_pokemon_types" ADD FOREIGN KEY ("pokemonsId") REFERENCES "pokemons" ("id");

ALTER TABLE "pokemons_types_pokemon_types" ADD FOREIGN KEY ("pokemonTypesId") REFERENCES "pokemon_types" ("id");

ALTER TABLE "pokemons_abilities_pokemon_abilities" ADD FOREIGN KEY ("pokemonsId") REFERENCES "pokemons" ("id");

ALTER TABLE "pokemons_abilities_pokemon_abilities" ADD FOREIGN KEY ("pokemonAbilitiesId") REFERENCES "pokemon_abilities" ("id");

ALTER TABLE "pokemons_evolutions_pokemons" ADD FOREIGN KEY ("pokemonsId_1") REFERENCES "pokemons" ("id");

ALTER TABLE "pokemons_evolutions_pokemons" ADD FOREIGN KEY ("pokemonsId_2") REFERENCES "pokemons" ("id");

ALTER TABLE "users" ADD FOREIGN KEY ("finance_id") REFERENCES "finances" ("id");

ALTER TABLE "pokemons_moves_pokemon_moves" ADD FOREIGN KEY ("pokemonMovesId") REFERENCES "pokemons_moves_pokemon_moves" ("pokemonsId");
