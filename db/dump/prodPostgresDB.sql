--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: bills_type_enum; Type: TYPE; Schema: public; Owner: prod_user
--

CREATE TYPE public.bills_type_enum AS ENUM (
    'PIX',
    'BANK_SLIP',
    'CREDIT_CARD',
    'ACCOUNT_DEBIT'
);


ALTER TYPE public.bills_type_enum OWNER TO prod_user;

--
-- Name: expenses_type_enum; Type: TYPE; Schema: public; Owner: prod_user
--

CREATE TYPE public.expenses_type_enum AS ENUM (
    'FIXED',
    'VARIABLE'
);


ALTER TYPE public.expenses_type_enum OWNER TO prod_user;

--
-- Name: users_role_enum; Type: TYPE; Schema: public; Owner: prod_user
--

CREATE TYPE public.users_role_enum AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public.users_role_enum OWNER TO prod_user;

--
-- Name: users_status_enum; Type: TYPE; Schema: public; Owner: prod_user
--

CREATE TYPE public.users_status_enum AS ENUM (
    'ACTIVE',
    'COMPLETE',
    'INACTIVE',
    'INCOMPLETE'
);


ALTER TYPE public.users_status_enum OWNER TO prod_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: banks; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.banks (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.banks OWNER TO prod_user;

--
-- Name: bills; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.bills (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    year integer NOT NULL,
    type public.bills_type_enum NOT NULL,
    total numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    all_paid boolean DEFAULT false NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    total_paid numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "bankId" uuid NOT NULL,
    "financeId" uuid NOT NULL,
    "groupId" uuid NOT NULL
);


ALTER TABLE public.bills OWNER TO prod_user;

--
-- Name: expenses; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.expenses (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    year integer NOT NULL,
    type public.expenses_type_enum NOT NULL,
    paid boolean NOT NULL,
    total numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    name_code character varying(200) NOT NULL,
    total_paid numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total_pending numeric(10,2) DEFAULT '0'::numeric,
    description character varying,
    instalment_number integer NOT NULL,
    is_aggregate boolean DEFAULT false NOT NULL,
    aggregate_name character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    "billId" uuid NOT NULL,
    "supplierId" uuid NOT NULL,
    "parentId" uuid
);


ALTER TABLE public.expenses OWNER TO prod_user;

--
-- Name: finances; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.finances (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.finances OWNER TO prod_user;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.groups (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    "financeId" uuid NOT NULL
);


ALTER TABLE public.groups OWNER TO prod_user;

--
-- Name: income_sources; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.income_sources (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.income_sources OWNER TO prod_user;

--
-- Name: incomes; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.incomes (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    year integer NOT NULL,
    name character varying(200) NOT NULL,
    total numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    name_code character varying(200) NOT NULL,
    description character varying,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    "sourceId" uuid NOT NULL,
    "financeId" uuid NOT NULL,
    all_paid boolean DEFAULT false NOT NULL
);


ALTER TABLE public.incomes OWNER TO prod_user;

--
-- Name: months; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.months (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    paid boolean NOT NULL,
    year integer NOT NULL,
    code integer NOT NULL,
    value numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    label character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    received_at timestamp without time zone NOT NULL,
    "incomeId" uuid,
    "expenseId" uuid
);


ALTER TABLE public.months OWNER TO prod_user;

--
-- Name: pokemon_abilities; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemon_abilities (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    "order" integer NOT NULL,
    slot integer NOT NULL,
    is_hidden boolean NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.pokemon_abilities OWNER TO prod_user;

--
-- Name: pokemon_moves; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemon_moves (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pp integer NOT NULL,
    url character varying(50) NOT NULL,
    type character varying NOT NULL,
    name character varying(200) NOT NULL,
    "order" integer NOT NULL,
    power integer,
    target character varying,
    effect character varying,
    priority integer,
    accuracy integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    short_effect character varying,
    damage_class character varying,
    effect_chance integer
);


ALTER TABLE public.pokemon_moves OWNER TO prod_user;

--
-- Name: pokemon_types; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemon_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    url character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    "order" integer NOT NULL,
    text_color character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    background_color character varying(200) NOT NULL
);


ALTER TABLE public.pokemon_types OWNER TO prod_user;

--
-- Name: pokemons; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemons (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    hp integer,
    url character varying(50) NOT NULL,
    name character varying(200) NOT NULL,
    "order" integer NOT NULL,
    image character varying(200),
    speed integer,
    status character varying DEFAULT 'INCOMPLETE'::character varying NOT NULL,
    attack integer,
    defense integer,
    habitat character varying,
    is_baby boolean,
    shape_url character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    shape_name character varying(200),
    is_mythical boolean,
    gender_rate integer,
    is_legendary boolean,
    capture_rate integer,
    hatch_counter integer,
    base_happiness integer,
    special_attack integer,
    special_defense integer,
    evolution_chain_url character varying,
    evolves_from_species character varying,
    has_gender_differences boolean
);


ALTER TABLE public.pokemons OWNER TO prod_user;

--
-- Name: pokemons_abilities_pokemon_abilities; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemons_abilities_pokemon_abilities (
    "pokemonsId" uuid NOT NULL,
    "pokemonAbilitiesId" uuid NOT NULL
);


ALTER TABLE public.pokemons_abilities_pokemon_abilities OWNER TO prod_user;

--
-- Name: pokemons_evolutions_pokemons; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemons_evolutions_pokemons (
    "pokemonsId_1" uuid NOT NULL,
    "pokemonsId_2" uuid NOT NULL
);


ALTER TABLE public.pokemons_evolutions_pokemons OWNER TO prod_user;

--
-- Name: pokemons_moves_pokemon_moves; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemons_moves_pokemon_moves (
    "pokemonsId" uuid NOT NULL,
    "pokemonMovesId" uuid NOT NULL
);


ALTER TABLE public.pokemons_moves_pokemon_moves OWNER TO prod_user;

--
-- Name: pokemons_types_pokemon_types; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.pokemons_types_pokemon_types (
    "pokemonsId" uuid NOT NULL,
    "pokemonTypesId" uuid NOT NULL
);


ALTER TABLE public.pokemons_types_pokemon_types OWNER TO prod_user;

--
-- Name: supplier_types; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.supplier_types (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone
);


ALTER TABLE public.supplier_types OWNER TO prod_user;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(200) NOT NULL,
    name_code character varying(200) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    "typeId" uuid NOT NULL
);


ALTER TABLE public.suppliers OWNER TO prod_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: prod_user
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    cpf character varying(11) NOT NULL,
    role public.users_role_enum DEFAULT 'USER'::public.users_role_enum NOT NULL,
    salt character varying NOT NULL,
    name character varying(200) NOT NULL,
    email character varying(200) NOT NULL,
    gender character varying NOT NULL,
    status public.users_status_enum DEFAULT 'INCOMPLETE'::public.users_status_enum NOT NULL,
    avatar character varying,
    whatsapp character varying(11) NOT NULL,
    password character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    deleted_at timestamp without time zone,
    date_of_birth timestamp without time zone NOT NULL,
    recover_token character varying(64),
    confirmation_token character varying(64),
    "financeId" uuid
);


ALTER TABLE public.users OWNER TO prod_user;

--
-- Data for Name: banks; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.banks (id, name, name_code, created_at, updated_at, deleted_at) FROM stdin;
6130d019-f20a-447e-a197-7afb7253aa8b	Nubank	nubank	2025-12-04 20:36:11.374447	2025-12-04 20:36:11.374447	\N
05e128e8-e31d-4e6c-ad14-286d1f37994b	Itaú	itau	2025-12-04 20:36:19.305752	2025-12-04 20:36:19.305752	\N
06748445-204b-4b64-a479-31120c55580b	Caixa	caixa	2025-12-04 20:36:29.59288	2025-12-04 20:36:29.59288	\N
cb3ef891-ab23-430f-b9e0-db93b17f74ad	Santander	santander	2025-12-08 21:24:59.448325	2025-12-08 21:25:14.059389	\N
\.


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.bills (id, name, year, type, total, all_paid, name_code, created_at, updated_at, deleted_at, total_paid, "bankId", "financeId", "groupId") FROM stdin;
61dd3d3d-01d3-4f9a-9757-8a02b333f507	Pessoal Account Debit Itaú	2025	ACCOUNT_DEBIT	0.00	f	pessoal_account_debit_itau	2025-12-08 19:40:55.450475	2025-12-08 19:40:55.450475	\N	0.00	05e128e8-e31d-4e6c-ad14-286d1f37994b	8f321489-1284-4818-8f72-e96e3e41eab6	60c787ba-eedc-431b-a4b7-9129dfab9bf3
96204459-db6e-4065-ae9c-78961f302268	Pessoal Account Debit Nubank	2025	ACCOUNT_DEBIT	0.00	f	pessoal_account_debit_nubank	2025-12-08 19:17:22.619685	2025-12-08 19:41:41.908359	\N	0.00	6130d019-f20a-447e-a197-7afb7253aa8b	8f321489-1284-4818-8f72-e96e3e41eab6	60c787ba-eedc-431b-a4b7-9129dfab9bf3
3b66b1af-44ec-4b95-9604-81665551d046	Residencial Ingrid Bank Slip Nubank	2025	BANK_SLIP	0.00	f	residencial_ingrid_bank_slip_nubank	2025-12-08 19:50:27.641747	2025-12-08 19:50:27.641747	\N	0.00	6130d019-f20a-447e-a197-7afb7253aa8b	8f321489-1284-4818-8f72-e96e3e41eab6	67933468-6a75-46c7-bf26-47e7d7e8d530
\.


--
-- Data for Name: expenses; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.expenses (id, name, year, type, paid, total, name_code, total_paid, total_pending, description, instalment_number, is_aggregate, aggregate_name, created_at, updated_at, deleted_at, "billId", "supplierId", "parentId") FROM stdin;
846a0ef8-9dc8-4fb2-af0c-dd8211462108	Pessoal Account Debit Nubank L.U.V.E	2025	FIXED	t	1320.00	pessoal_account_debit_nubank_l_u_v_e	1320.00	0.00	Taxa Mensal da Loja Universitária Verdade Evolução número 3492 do Rito Moderno.	12	f	\N	2025-12-08 19:29:55.29975	2025-12-08 19:30:27.537392	\N	96204459-db6e-4065-ae9c-78961f302268	b544a49d-0a21-41b3-9f7d-0a2c57b46c0a	\N
f9b5668c-908b-4b22-b9d5-536545018a2c	Pessoal Account Debit Nubank Graus Filosóficos	2025	FIXED	t	910.00	pessoal_account_debit_nubank_graus_filosoficos	910.00	0.00	Taxa mensal do Capítulo Consciência Liberta número 13 do Rito Moderno.	12	f	\N	2025-12-08 19:31:17.548361	2025-12-08 19:31:59.279627	\N	96204459-db6e-4065-ae9c-78961f302268	41736b99-4626-47e6-8442-4528a9b510fa	\N
0da134e1-ff53-48aa-8d71-23e0cab6e164	Pessoal Account Debit Nubank Bodes do Asfalto	2025	FIXED	t	1893.72	pessoal_account_debit_nubank_bodes_do_asfalto	1893.72	0.00	Taxa mensal do Moto Clube Bodes do Asfalto Subsede Brasília.	12	f	\N	2025-12-08 19:32:55.763809	2025-12-08 19:35:12.020039	\N	96204459-db6e-4065-ae9c-78961f302268	f92d02c1-a182-45eb-9d44-97114ca9caca	\N
315d9d4e-1384-4286-9450-d4ee29322701	Pessoal Account Debit Itaú Claro	2025	VARIABLE	f	5860.61	pessoal_account_debit_itau_claro	502.61	5358.00	Taxa mensal do serviço da companhia de telecomunicação Claro. Referente ao plano de celular (3), TV e Internet. 	1	f	\N	2025-12-08 19:44:23.840169	2025-12-08 19:46:26.69387	\N	61dd3d3d-01d3-4f9a-9757-8a02b333f507	23be85fc-e7d0-48ce-9ed5-36c73ad6f99d	\N
\.


--
-- Data for Name: finances; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.finances (id, created_at, updated_at, deleted_at) FROM stdin;
8f321489-1284-4818-8f72-e96e3e41eab6	2025-12-04 19:55:35.361282	2025-12-04 19:55:35.361282	\N
\.


--
-- Data for Name: groups; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.groups (id, name, name_code, created_at, updated_at, deleted_at, "financeId") FROM stdin;
60c787ba-eedc-431b-a4b7-9129dfab9bf3	Pessoal	pessoal	2025-12-04 20:15:46.391586	2025-12-04 20:17:08.332195	\N	8f321489-1284-4818-8f72-e96e3e41eab6
67933468-6a75-46c7-bf26-47e7d7e8d530	Residencial Ingrid	residencial_ingrid	2025-12-04 20:16:11.519711	2025-12-04 20:17:22.725763	\N	8f321489-1284-4818-8f72-e96e3e41eab6
f7b65d93-76e6-4754-b487-08b4d4ea257a	Residencial Monte Carlo	residencial_monte_carlo	2025-12-04 20:15:54.516522	2025-12-04 20:17:29.540366	\N	8f321489-1284-4818-8f72-e96e3e41eab6
\.


--
-- Data for Name: income_sources; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.income_sources (id, name, name_code, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: incomes; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.incomes (id, year, name, total, name_code, description, created_at, updated_at, deleted_at, "sourceId", "financeId", all_paid) FROM stdin;
\.


--
-- Data for Name: months; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.months (id, paid, year, code, value, label, created_at, updated_at, deleted_at, received_at, "incomeId", "expenseId") FROM stdin;
9604fec0-54de-449b-8cb6-4e118a00b715	t	2025	1	110.00	january	2025-12-08 19:29:55.312723	2025-12-08 19:29:55.312723	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
f35420b4-b8fd-4ccd-9528-7c85e8a6ac12	t	2025	2	110.00	february	2025-12-08 19:29:55.322962	2025-12-08 19:30:27.421622	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
410c0f02-6fbf-47b6-8bda-fafaf7924de8	t	2025	3	110.00	march	2025-12-08 19:29:55.328759	2025-12-08 19:30:27.432989	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
39f9106b-9839-4862-ae34-2ef7e7cc3f69	t	2025	4	110.00	april	2025-12-08 19:29:55.333735	2025-12-08 19:30:27.440489	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
dcb072ef-1c3a-4098-a70d-ef4104f94590	t	2025	5	110.00	may	2025-12-08 19:29:55.33892	2025-12-08 19:30:27.452898	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
d6eb0264-d964-4d19-bbc1-45db73f2232a	t	2025	6	110.00	june	2025-12-08 19:29:55.342842	2025-12-08 19:30:27.460744	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
bbbac703-c096-4928-9e3f-f1063b657631	t	2025	7	110.00	july	2025-12-08 19:29:55.348045	2025-12-08 19:30:27.471083	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
8441a304-36c0-4a7f-b455-c93090a14fb0	t	2025	8	110.00	august	2025-12-08 19:29:55.355745	2025-12-08 19:30:27.482841	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
68d75ec5-2293-4553-9951-958b2bbbfb85	t	2025	9	110.00	september	2025-12-08 19:29:55.360205	2025-12-08 19:30:27.491056	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
e8855fac-74ea-4abc-a38f-6ebce5e43a3d	t	2025	10	110.00	october	2025-12-08 19:29:55.367389	2025-12-08 19:30:27.498008	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
4e6adc5e-f776-4924-9967-f150170fc54f	t	2025	11	110.00	november	2025-12-08 19:29:55.372685	2025-12-08 19:30:27.506075	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
b46cff89-8d99-4042-80f9-130641a293cc	t	2025	12	110.00	december	2025-12-08 19:29:55.378212	2025-12-08 19:30:27.517512	\N	2025-12-08 16:29:55.298	\N	846a0ef8-9dc8-4fb2-af0c-dd8211462108
2739d380-1628-4f1d-aea4-3681535bb3c8	t	2025	1	40.00	january	2025-12-08 19:31:17.559435	2025-12-08 19:31:17.559435	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
ce06c316-6f80-4b8e-8563-38012c43b38f	t	2025	2	40.00	february	2025-12-08 19:31:17.566235	2025-12-08 19:31:59.17957	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
76c04449-fe8a-41f5-819a-e1b984e992af	t	2025	3	40.00	march	2025-12-08 19:31:17.572462	2025-12-08 19:31:59.187154	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
6853f292-2130-4fd7-8a10-440ca4322c2e	t	2025	4	40.00	april	2025-12-08 19:31:17.578146	2025-12-08 19:31:59.195935	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
214d1757-5d5b-44a9-91d9-aee13a74715c	t	2025	5	40.00	may	2025-12-08 19:31:17.581978	2025-12-08 19:31:59.209256	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
588b4ad0-c681-4147-bf05-8c2d4c97ed7e	t	2025	6	40.00	june	2025-12-08 19:31:17.585946	2025-12-08 19:31:59.218828	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
266c0f0c-4f2f-47c5-aa96-a1cf9f8e8e81	t	2025	7	40.00	july	2025-12-08 19:31:17.589984	2025-12-08 19:31:59.225752	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
a095b0dc-6ff8-4361-979e-64b2602f3f1a	t	2025	8	40.00	august	2025-12-08 19:31:17.596386	2025-12-08 19:31:59.232131	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
dedc92ff-41f0-4cc0-893e-fc41efcd50ed	t	2025	9	40.00	september	2025-12-08 19:31:17.602529	2025-12-08 19:31:59.239476	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
f910cca2-f6bb-4a3a-81d7-736895552c0c	t	2025	10	40.00	october	2025-12-08 19:31:17.610373	2025-12-08 19:31:59.247551	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
aaa751ce-71a9-47b5-bab3-347a1a31c06c	t	2025	11	255.00	november	2025-12-08 19:31:17.615474	2025-12-08 19:31:59.256317	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
7dd559a0-0f23-493f-985a-a7d7d8903448	t	2025	12	255.00	december	2025-12-08 19:31:17.620816	2025-12-08 19:31:59.266123	\N	2025-12-08 16:31:17.547	\N	f9b5668c-908b-4b22-b9d5-536545018a2c
ff14cc21-71ac-4cfd-b3e3-127d4766633c	t	2025	1	150.31	january	2025-12-08 19:32:55.774727	2025-12-08 19:32:55.774727	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
aef974f7-15c2-4b72-ac09-7b7dd36494ba	t	2025	2	150.31	february	2025-12-08 19:32:55.778492	2025-12-08 19:35:11.929949	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
4b1a43b2-f36e-4bfd-8f92-33314165c7c6	t	2025	3	150.31	march	2025-12-08 19:32:55.781888	2025-12-08 19:35:11.942868	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
cc456e36-4fc7-4446-a4a4-d6f14fbf23ed	t	2025	4	150.31	april	2025-12-08 19:32:55.786373	2025-12-08 19:35:11.951424	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
1b5f8c17-7826-4294-855e-5c59bfc59abb	t	2025	5	150.31	may	2025-12-08 19:32:55.790435	2025-12-08 19:35:11.961145	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
b4f367fb-74e3-4974-8cd1-e9f84eb29fa8	t	2025	6	150.31	june	2025-12-08 19:32:55.794512	2025-12-08 19:35:11.968109	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
acfde619-8169-436a-bd1b-b75b02c2345f	t	2025	7	150.31	july	2025-12-08 19:32:55.798172	2025-12-08 19:35:11.97672	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
52e17516-a977-4552-97af-9c17c9086cfd	t	2025	8	150.31	august	2025-12-08 19:32:55.802584	2025-12-08 19:35:11.982027	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
c6532a37-6b1c-4119-a8f1-5ccb42f023cd	t	2025	9	150.31	september	2025-12-08 19:32:55.809423	2025-12-08 19:35:11.988486	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
f9781531-6128-4154-9379-cb5a8a786b54	t	2025	10	180.31	october	2025-12-08 19:32:55.812527	2025-12-08 19:35:11.994034	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
87e00266-21d3-4686-933d-b3f97e7b1c2f	t	2025	11	180.31	november	2025-12-08 19:32:55.815298	2025-12-08 19:35:12.000646	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
9e67ccba-c0e4-448e-af75-937aee0da7c0	t	2025	12	180.31	december	2025-12-08 19:32:55.820313	2025-12-08 19:35:12.009349	\N	2025-12-08 16:32:55.763	\N	0da134e1-ff53-48aa-8d71-23e0cab6e164
39da6fdf-df10-41ef-a45b-d85568fb93a6	t	2025	1	502.61	january	2025-12-08 19:44:23.85042	2025-12-08 19:44:23.85042	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
ce3782eb-4279-4182-82b3-c1673ac43288	f	2025	2	496.00	february	2025-12-08 19:44:23.854592	2025-12-08 19:46:26.602389	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
615554ba-db99-4331-8c01-7603e2a7961f	f	2025	3	511.00	march	2025-12-08 19:44:23.858189	2025-12-08 19:46:26.609613	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
4ce7600d-dc28-4cb5-8673-792b98955071	f	2025	4	507.00	april	2025-12-08 19:44:23.862958	2025-12-08 19:46:26.616719	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
3727ebe2-e042-4193-8059-eb68f5f4c849	f	2025	5	526.00	may	2025-12-08 19:44:23.867167	2025-12-08 19:46:26.624707	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
431ef97b-5683-4f11-ab19-b08af76d70b6	f	2025	6	551.00	june	2025-12-08 19:44:23.871343	2025-12-08 19:46:26.633306	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
d0624f3e-46fb-4b93-9c2c-08f5268f66b2	f	2025	7	551.00	july	2025-12-08 19:44:23.879467	2025-12-08 19:46:26.644323	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
ab0ff749-adaa-4635-8431-52a5b56bc0d0	f	2025	8	550.00	august	2025-12-08 19:44:23.886139	2025-12-08 19:46:26.655387	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
f0928edb-04e6-4dd5-b4a0-9a18da34fd19	f	2025	9	550.00	september	2025-12-08 19:44:23.890421	2025-12-08 19:46:26.662254	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
a49e467c-8cb5-4a0d-9c6d-70a097f7b683	f	2025	10	551.00	october	2025-12-08 19:44:23.897555	2025-12-08 19:46:26.668485	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
3cb235c2-17c1-4e6e-844a-6d65e40675d5	f	2025	11	565.00	november	2025-12-08 19:44:23.901573	2025-12-08 19:46:26.675816	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
0aef37c0-8f2c-4841-a67d-3e09d5b1a7c5	f	2025	12	0.00	december	2025-12-08 19:44:23.904715	2025-12-08 19:46:26.682427	\N	2025-12-08 16:44:23.839	\N	315d9d4e-1384-4286-9450-d4ee29322701
\.


--
-- Data for Name: pokemon_abilities; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemon_abilities (id, url, name, "order", slot, is_hidden, created_at, updated_at, deleted_at) FROM stdin;
\.


--
-- Data for Name: pokemon_moves; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemon_moves (id, pp, url, type, name, "order", power, target, effect, priority, accuracy, created_at, updated_at, deleted_at, short_effect, damage_class, effect_chance) FROM stdin;
\.


--
-- Data for Name: pokemon_types; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemon_types (id, url, name, "order", text_color, created_at, updated_at, deleted_at, background_color) FROM stdin;
\.


--
-- Data for Name: pokemons; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemons (id, hp, url, name, "order", image, speed, status, attack, defense, habitat, is_baby, shape_url, created_at, updated_at, deleted_at, shape_name, is_mythical, gender_rate, is_legendary, capture_rate, hatch_counter, base_happiness, special_attack, special_defense, evolution_chain_url, evolves_from_species, has_gender_differences) FROM stdin;
\.


--
-- Data for Name: pokemons_abilities_pokemon_abilities; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemons_abilities_pokemon_abilities ("pokemonsId", "pokemonAbilitiesId") FROM stdin;
\.


--
-- Data for Name: pokemons_evolutions_pokemons; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemons_evolutions_pokemons ("pokemonsId_1", "pokemonsId_2") FROM stdin;
\.


--
-- Data for Name: pokemons_moves_pokemon_moves; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemons_moves_pokemon_moves ("pokemonsId", "pokemonMovesId") FROM stdin;
\.


--
-- Data for Name: pokemons_types_pokemon_types; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.pokemons_types_pokemon_types ("pokemonsId", "pokemonTypesId") FROM stdin;
\.


--
-- Data for Name: supplier_types; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.supplier_types (id, name, name_code, created_at, updated_at, deleted_at) FROM stdin;
93cfb1e7-3c63-4e49-942c-0898d4172540	Serviços	servicos	2025-12-04 20:37:15.357673	2025-12-04 20:37:15.357673	\N
1d0ac751-fe9b-42bd-b85f-6b90f77022a7	Maçonaria	maconaria	2025-12-04 20:37:23.275792	2025-12-04 20:37:23.275792	\N
7ada5df1-0ef1-46a5-ae06-26cf0bf2f750	Impostos	impostos	2025-12-04 20:37:30.465812	2025-12-04 20:37:30.465812	\N
a830fb15-ac13-4b2c-9350-ee90273d9f6b	Casa	casa	2025-12-04 20:37:38.67393	2025-12-04 20:37:38.67393	\N
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.suppliers (id, name, name_code, created_at, updated_at, deleted_at, "typeId") FROM stdin;
4517fd55-aea9-4ef3-af60-bce717b0b885	Netflix	netflix	2025-12-04 20:38:01.994398	2025-12-04 20:38:01.994398	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
8e49245a-9275-41dd-963b-4d53901116e2	Vivo	vivo	2025-12-04 20:38:38.627311	2025-12-04 20:38:38.627311	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
23be85fc-e7d0-48ce-9ed5-36c73ad6f99d	Claro	claro	2025-12-04 20:39:10.912969	2025-12-04 20:39:10.912969	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
bc7cb75b-c93d-4db2-86b2-989b03ca5dcb	Facilite (Condomínio)	facilite_condominio	2025-12-04 20:39:31.420847	2025-12-04 20:39:31.420847	\N	a830fb15-ac13-4b2c-9350-ee90273d9f6b
d15bac8a-1db2-4abd-99aa-d7d109b75044	Âncora (Condomínio)	ancora_condominio	2025-12-04 20:39:43.409812	2025-12-04 20:39:43.409812	\N	a830fb15-ac13-4b2c-9350-ee90273d9f6b
4b2bcd75-10c5-4689-91a0-a52542792d4d	Garagem (Marcos)	garagem_marcos	2025-12-04 20:39:54.500711	2025-12-04 20:39:54.500711	\N	a830fb15-ac13-4b2c-9350-ee90273d9f6b
68652176-b9f8-4d9a-b639-849c419e81b6	Garagem (Flavia)	garagem_flavia	2025-12-04 20:40:03.845733	2025-12-04 20:40:03.845733	\N	a830fb15-ac13-4b2c-9350-ee90273d9f6b
4ab1a97e-472e-4e08-9f64-27e7a9669555	IPTU - Imposto Predial e Territorial Urbano	iptu_imposto_predial_e_territorial_urbano	2025-12-04 20:40:28.639243	2025-12-04 20:40:28.639243	\N	7ada5df1-0ef1-46a5-ae06-26cf0bf2f750
22f7a24d-de8a-4af8-a4e7-355411cb7f54	Neoenergia	neoenergia	2025-12-04 20:40:49.150299	2025-12-04 20:40:49.150299	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
1a6b64e1-879d-4f25-bb59-eec11f90a455	HBO MAX	hbo_max	2025-12-04 20:41:03.128022	2025-12-04 20:41:03.128022	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
6431ac9d-c06e-4103-ac21-48c2a8bf83de	Melimais - Mercado Livre	melimais_mercado_livre	2025-12-04 20:41:14.588101	2025-12-04 20:41:14.588101	\N	93cfb1e7-3c63-4e49-942c-0898d4172540
f92d02c1-a182-45eb-9d44-97114ca9caca	Bodes do Asfalto	bodes_do_asfalto	2025-12-04 20:41:27.420535	2025-12-04 20:41:27.420535	\N	1d0ac751-fe9b-42bd-b85f-6b90f77022a7
41736b99-4626-47e6-8442-4528a9b510fa	Graus Filosóficos	graus_filosoficos	2025-12-04 20:41:37.202096	2025-12-04 20:41:37.202096	\N	1d0ac751-fe9b-42bd-b85f-6b90f77022a7
b544a49d-0a21-41b3-9f7d-0a2c57b46c0a	L.U.V.E	l_u_v_e	2025-12-04 20:41:47.565717	2025-12-04 20:41:47.565717	\N	1d0ac751-fe9b-42bd-b85f-6b90f77022a7
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: prod_user
--

COPY public.users (id, cpf, role, salt, name, email, gender, status, avatar, whatsapp, password, created_at, updated_at, deleted_at, date_of_birth, recover_token, confirmation_token, "financeId") FROM stdin;
eb134aba-a0dd-463c-9aa0-c7801890e7df	00256337160	ADMIN	$2b$10$X0ZxO8vChJDpnQ.IslzYLu	Jorge Machado	jorge.vmachado@gmail.com	MALE	INCOMPLETE	\N	61996230790	$2b$10$X0ZxO8vChJDpnQ.IslzYLu5t9WYF0wOLqgPX31AT26EnCEko4s5TO	2025-12-04 19:40:09.560267	2025-12-04 19:55:35.361282	\N	1990-07-19 21:00:00	\N	fd8af51ca2083f51aa353161036aed1309761eecad0f5c6a54167687774d5933	8f321489-1284-4818-8f72-e96e3e41eab6
\.


--
-- Name: pokemons_evolutions_pokemons PK_1bae1f050dc316b4b77a495aeca; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_evolutions_pokemons
    ADD CONSTRAINT "PK_1bae1f050dc316b4b77a495aeca" PRIMARY KEY ("pokemonsId_1", "pokemonsId_2");


--
-- Name: supplier_types PK_2a20dd7dd5a7410dfccf9533e67; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.supplier_types
    ADD CONSTRAINT "PK_2a20dd7dd5a7410dfccf9533e67" PRIMARY KEY (id);


--
-- Name: pokemons_moves_pokemon_moves PK_334ac6a2dc6e00b020c2763b435; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_moves_pokemon_moves
    ADD CONSTRAINT "PK_334ac6a2dc6e00b020c2763b435" PRIMARY KEY ("pokemonsId", "pokemonMovesId");


--
-- Name: banks PK_3975b5f684ec241e3901db62d77; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT "PK_3975b5f684ec241e3901db62d77" PRIMARY KEY (id);


--
-- Name: pokemon_types PK_4d2d359062d5345ac2aa14bd702; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemon_types
    ADD CONSTRAINT "PK_4d2d359062d5345ac2aa14bd702" PRIMARY KEY (id);


--
-- Name: income_sources PK_5e2bc8bfe0ee6a3e4726bdf0d79; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.income_sources
    ADD CONSTRAINT "PK_5e2bc8bfe0ee6a3e4726bdf0d79" PRIMARY KEY (id);


--
-- Name: groups PK_659d1483316afb28afd3a90646e; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY (id);


--
-- Name: pokemon_abilities PK_6bed1091d7446bb1c70fe0d71c9; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemon_abilities
    ADD CONSTRAINT "PK_6bed1091d7446bb1c70fe0d71c9" PRIMARY KEY (id);


--
-- Name: months PK_6d28d9fc3fd263f08f01fc8f044; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT "PK_6d28d9fc3fd263f08f01fc8f044" PRIMARY KEY (id);


--
-- Name: pokemon_moves PK_741c4dd36f492701ecae99d32de; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemon_moves
    ADD CONSTRAINT "PK_741c4dd36f492701ecae99d32de" PRIMARY KEY (id);


--
-- Name: expenses PK_94c3ceb17e3140abc9282c20610; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "PK_94c3ceb17e3140abc9282c20610" PRIMARY KEY (id);


--
-- Name: pokemons PK_a3172290413af616d9cfa1fdc9a; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons
    ADD CONSTRAINT "PK_a3172290413af616d9cfa1fdc9a" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: bills PK_a56215dfcb525755ec832cc80b7; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "PK_a56215dfcb525755ec832cc80b7" PRIMARY KEY (id);


--
-- Name: suppliers PK_b70ac51766a9e3144f778cfe81e; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "PK_b70ac51766a9e3144f778cfe81e" PRIMARY KEY (id);


--
-- Name: pokemons_types_pokemon_types PK_bfacaee4e93f7bad6c914137f62; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_types_pokemon_types
    ADD CONSTRAINT "PK_bfacaee4e93f7bad6c914137f62" PRIMARY KEY ("pokemonsId", "pokemonTypesId");


--
-- Name: incomes PK_d737b3d0314c1f0da5461a55e5e; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT "PK_d737b3d0314c1f0da5461a55e5e" PRIMARY KEY (id);


--
-- Name: finances PK_dd84717ec8f1c29d8dd8687b6fd; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.finances
    ADD CONSTRAINT "PK_dd84717ec8f1c29d8dd8687b6fd" PRIMARY KEY (id);


--
-- Name: pokemons_abilities_pokemon_abilities PK_ee981c721956e8633e81fd589ba; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_abilities_pokemon_abilities
    ADD CONSTRAINT "PK_ee981c721956e8633e81fd589ba" PRIMARY KEY ("pokemonsId", "pokemonAbilitiesId");


--
-- Name: users REL_e4d75ecc2fe0d393173d863dfa; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "REL_e4d75ecc2fe0d393173d863dfa" UNIQUE ("financeId");


--
-- Name: users UQ_230b925048540454c8b4c481e1c; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE (cpf);


--
-- Name: incomes UQ_2334a915cd238388d7cae00642d; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT "UQ_2334a915cd238388d7cae00642d" UNIQUE (name_code);


--
-- Name: supplier_types UQ_404d6a6acdcb384b45d64221c9c; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.supplier_types
    ADD CONSTRAINT "UQ_404d6a6acdcb384b45d64221c9c" UNIQUE (name);


--
-- Name: suppliers UQ_5b5720d9645cee7396595a16c93; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "UQ_5b5720d9645cee7396595a16c93" UNIQUE (name);


--
-- Name: banks UQ_62341721e996d4f97a5a4613a77; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT "UQ_62341721e996d4f97a5a4613a77" UNIQUE (name_code);


--
-- Name: groups UQ_664ea405ae2a10c264d582ee563; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "UQ_664ea405ae2a10c264d582ee563" UNIQUE (name);


--
-- Name: groups UQ_93e940b2957ef07c2ec7fbadefd; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "UQ_93e940b2957ef07c2ec7fbadefd" UNIQUE (name_code);


--
-- Name: users UQ_956434dfd305a85d14dc92efb23; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_956434dfd305a85d14dc92efb23" UNIQUE (whatsapp);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: banks UQ_bc680de8ba9d7878fddcecd610c; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT "UQ_bc680de8ba9d7878fddcecd610c" UNIQUE (name);


--
-- Name: supplier_types UQ_eb97818a6e819517d8d98d40b72; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.supplier_types
    ADD CONSTRAINT "UQ_eb97818a6e819517d8d98d40b72" UNIQUE (name_code);


--
-- Name: suppliers UQ_efc94083124fc876cba944b3a2c; Type: CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "UQ_efc94083124fc876cba944b3a2c" UNIQUE (name_code);


--
-- Name: IDX_1acc6104012cb14a6858d0ad5c; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_1acc6104012cb14a6858d0ad5c" ON public.pokemons_moves_pokemon_moves USING btree ("pokemonsId");


--
-- Name: IDX_3064d5771146b18325097e29ad; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_3064d5771146b18325097e29ad" ON public.pokemons_evolutions_pokemons USING btree ("pokemonsId_2");


--
-- Name: IDX_504facccf538f33bd03d8504f3; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_504facccf538f33bd03d8504f3" ON public.pokemons_evolutions_pokemons USING btree ("pokemonsId_1");


--
-- Name: IDX_6025f084511db329f5ca9961a3; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_6025f084511db329f5ca9961a3" ON public.pokemons_abilities_pokemon_abilities USING btree ("pokemonAbilitiesId");


--
-- Name: IDX_7108054e1e59c471c2d91c84ae; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_7108054e1e59c471c2d91c84ae" ON public.pokemons_abilities_pokemon_abilities USING btree ("pokemonsId");


--
-- Name: IDX_8cce56d748e07f4c01bf9272a4; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_8cce56d748e07f4c01bf9272a4" ON public.pokemons_types_pokemon_types USING btree ("pokemonTypesId");


--
-- Name: IDX_a0f3487a914e772b67763d97ba; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_a0f3487a914e772b67763d97ba" ON public.pokemons_types_pokemon_types USING btree ("pokemonsId");


--
-- Name: IDX_eb7e2c56bdd236f7c549e1fb01; Type: INDEX; Schema: public; Owner: prod_user
--

CREATE INDEX "IDX_eb7e2c56bdd236f7c549e1fb01" ON public.pokemons_moves_pokemon_moves USING btree ("pokemonMovesId");


--
-- Name: bills FK_0159a066c45ba249cb41da5f4f0; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "FK_0159a066c45ba249cb41da5f4f0" FOREIGN KEY ("financeId") REFERENCES public.finances(id);


--
-- Name: groups FK_01c8547145f889743e548595373; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "FK_01c8547145f889743e548595373" FOREIGN KEY ("financeId") REFERENCES public.finances(id);


--
-- Name: expenses FK_02cdd37386349572c9af5c882c8; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "FK_02cdd37386349572c9af5c882c8" FOREIGN KEY ("parentId") REFERENCES public.expenses(id);


--
-- Name: bills FK_055c0f63099b6cbc379b56b19f6; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "FK_055c0f63099b6cbc379b56b19f6" FOREIGN KEY ("bankId") REFERENCES public.banks(id);


--
-- Name: expenses FK_07e6685c4f3947ab49fa1488340; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "FK_07e6685c4f3947ab49fa1488340" FOREIGN KEY ("billId") REFERENCES public.bills(id);


--
-- Name: pokemons_moves_pokemon_moves FK_1acc6104012cb14a6858d0ad5c6; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_moves_pokemon_moves
    ADD CONSTRAINT "FK_1acc6104012cb14a6858d0ad5c6" FOREIGN KEY ("pokemonsId") REFERENCES public.pokemons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pokemons_evolutions_pokemons FK_3064d5771146b18325097e29adc; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_evolutions_pokemons
    ADD CONSTRAINT "FK_3064d5771146b18325097e29adc" FOREIGN KEY ("pokemonsId_2") REFERENCES public.pokemons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pokemons_evolutions_pokemons FK_504facccf538f33bd03d8504f30; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_evolutions_pokemons
    ADD CONSTRAINT "FK_504facccf538f33bd03d8504f30" FOREIGN KEY ("pokemonsId_1") REFERENCES public.pokemons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pokemons_abilities_pokemon_abilities FK_6025f084511db329f5ca9961a3d; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_abilities_pokemon_abilities
    ADD CONSTRAINT "FK_6025f084511db329f5ca9961a3d" FOREIGN KEY ("pokemonAbilitiesId") REFERENCES public.pokemon_abilities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pokemons_abilities_pokemon_abilities FK_7108054e1e59c471c2d91c84ae5; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_abilities_pokemon_abilities
    ADD CONSTRAINT "FK_7108054e1e59c471c2d91c84ae5" FOREIGN KEY ("pokemonsId") REFERENCES public.pokemons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: months FK_82a7635151355a25d13092c85ed; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT "FK_82a7635151355a25d13092c85ed" FOREIGN KEY ("incomeId") REFERENCES public.incomes(id);


--
-- Name: pokemons_types_pokemon_types FK_8cce56d748e07f4c01bf9272a43; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_types_pokemon_types
    ADD CONSTRAINT "FK_8cce56d748e07f4c01bf9272a43" FOREIGN KEY ("pokemonTypesId") REFERENCES public.pokemon_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: incomes FK_9707a2df523e0e72d0d60c91653; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT "FK_9707a2df523e0e72d0d60c91653" FOREIGN KEY ("sourceId") REFERENCES public.income_sources(id);


--
-- Name: pokemons_types_pokemon_types FK_a0f3487a914e772b67763d97ba1; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_types_pokemon_types
    ADD CONSTRAINT "FK_a0f3487a914e772b67763d97ba1" FOREIGN KEY ("pokemonsId") REFERENCES public.pokemons(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: incomes FK_bc2ce28c428e49d931b199b738e; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.incomes
    ADD CONSTRAINT "FK_bc2ce28c428e49d931b199b738e" FOREIGN KEY ("financeId") REFERENCES public.finances(id);


--
-- Name: bills FK_cae7051a42b00aca17ee139bde0; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT "FK_cae7051a42b00aca17ee139bde0" FOREIGN KEY ("groupId") REFERENCES public.groups(id);


--
-- Name: expenses FK_cb04770a68c157a22fa42cc0506; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.expenses
    ADD CONSTRAINT "FK_cb04770a68c157a22fa42cc0506" FOREIGN KEY ("supplierId") REFERENCES public.suppliers(id);


--
-- Name: months FK_d0466768a9d55faf8e7665fefb7; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.months
    ADD CONSTRAINT "FK_d0466768a9d55faf8e7665fefb7" FOREIGN KEY ("expenseId") REFERENCES public.expenses(id);


--
-- Name: users FK_e4d75ecc2fe0d393173d863dfa5; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "FK_e4d75ecc2fe0d393173d863dfa5" FOREIGN KEY ("financeId") REFERENCES public.finances(id);


--
-- Name: pokemons_moves_pokemon_moves FK_eb7e2c56bdd236f7c549e1fb01a; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.pokemons_moves_pokemon_moves
    ADD CONSTRAINT "FK_eb7e2c56bdd236f7c549e1fb01a" FOREIGN KEY ("pokemonMovesId") REFERENCES public.pokemon_moves(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: suppliers FK_fe9f2a92872350c4ed56ea99a9d; Type: FK CONSTRAINT; Schema: public; Owner: prod_user
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT "FK_fe9f2a92872350c4ed56ea99a9d" FOREIGN KEY ("typeId") REFERENCES public.supplier_types(id);


--
-- PostgreSQL database dump complete
--

