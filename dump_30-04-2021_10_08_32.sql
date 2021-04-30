--
-- PostgreSQL database dump
--

-- Dumped from database version 11.11
-- Dumped by pg_dump version 11.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: lists_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lists_status_enum AS ENUM (
    'unavailable',
    'available',
    'created'
);


ALTER TYPE public.lists_status_enum OWNER TO postgres;

--
-- Name: lists_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.lists_type_enum AS ENUM (
    'offer',
    'producer'
);


ALTER TYPE public.lists_type_enum OWNER TO postgres;

--
-- Name: orders_payment_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_payment_status_enum AS ENUM (
    'processing',
    'awaiting_payment',
    'canceled',
    'expired',
    'paid'
);


ALTER TYPE public.orders_payment_status_enum OWNER TO postgres;

--
-- Name: orders_payment_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_payment_type_enum AS ENUM (
    'credit_card',
    'money',
    'pix',
    'bank_slip',
    'bank_transfer'
);


ALTER TYPE public.orders_payment_type_enum OWNER TO postgres;

--
-- Name: orders_sales_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.orders_sales_type_enum AS ENUM (
    'wholesale',
    'retail'
);


ALTER TYPE public.orders_sales_type_enum OWNER TO postgres;

--
-- Name: products_category_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_category_enum AS ENUM (
    'Verduras',
    'Legumes',
    'Proteínas',
    'Bebidas',
    'Carboidratos'
);


ALTER TYPE public.products_category_enum OWNER TO postgres;

--
-- Name: products_unit_buy_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_unit_buy_enum AS ENUM (
    'kg',
    'g',
    'l',
    'ml',
    'un',
    'box',
    'bag',
    'ton'
);


ALTER TYPE public.products_unit_buy_enum OWNER TO postgres;

--
-- Name: products_unit_sale_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.products_unit_sale_enum AS ENUM (
    'kg',
    'g',
    'l',
    'ml',
    'un',
    'box',
    'bag',
    'ton'
);


ALTER TYPE public.products_unit_sale_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: delivery_points; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delivery_points (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    city character varying NOT NULL,
    state character varying NOT NULL,
    suburb character varying NOT NULL,
    street character varying NOT NULL,
    number integer NOT NULL,
    cep character varying NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.delivery_points OWNER TO postgres;

--
-- Name: list_offers_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.list_offers_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    list_id uuid NOT NULL,
    product_id uuid NOT NULL,
    quantity double precision NOT NULL,
    unit_price double precision NOT NULL,
    sale_price double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.list_offers_details OWNER TO postgres;

--
-- Name: list_producers_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.list_producers_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    list_id uuid NOT NULL,
    product_id uuid NOT NULL,
    due_date timestamp with time zone NOT NULL,
    lot character varying,
    quantity integer NOT NULL,
    unit_price double precision NOT NULL,
    discount double precision NOT NULL,
    total_price double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.list_producers_details OWNER TO postgres;

--
-- Name: lists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lists (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    type public.lists_type_enum NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    status public.lists_status_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.lists OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: order_details; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_details (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    order_id uuid,
    product_id uuid NOT NULL,
    unit_price double precision NOT NULL,
    quantity double precision NOT NULL,
    discount double precision NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.order_details OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    date timestamp with time zone NOT NULL,
    value double precision NOT NULL,
    final_value double precision NOT NULL,
    payment_type public.orders_payment_type_enum NOT NULL,
    payment_status public.orders_payment_status_enum NOT NULL,
    sales_type public.orders_sales_type_enum NOT NULL,
    delivery_point_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    image character varying,
    nutritional_information text,
    observation text,
    cost_price double precision NOT NULL,
    organic boolean DEFAULT true NOT NULL,
    unit_sale public.products_unit_sale_enum NOT NULL,
    category public.products_category_enum NOT NULL,
    unit_buy public.products_unit_buy_enum NOT NULL,
    fraction_buy double precision NOT NULL,
    fraction_sale double precision NOT NULL,
    highlights boolean DEFAULT false NOT NULL,
    sale_price double precision NOT NULL,
    wholesale_price double precision,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: user_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tokens (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    token uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_tokens OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    email character varying,
    phone character varying NOT NULL,
    password character varying,
    cpf character varying NOT NULL,
    cnpj character varying,
    role character varying DEFAULT 'b'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: delivery_points; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.delivery_points (id, city, state, suburb, street, number, cep, latitude, longitude, created_at, updated_at) FROM stdin;
4a785f0c-f50f-4c3c-a653-fc7e3d0583a4	Pato Branco	PR	Centro	Av tupy	0	85501030	-26.2270670000000017	-52.6722460000000012	2021-04-30 12:54:38.441081	2021-04-30 12:54:38.441081
\.


--
-- Data for Name: list_offers_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.list_offers_details (id, list_id, product_id, quantity, unit_price, sale_price, created_at, updated_at) FROM stdin;
556e93d1-eefb-4c2e-bb30-e0f0f961c924	983a78d0-18f4-47a3-9f2f-dfa2b4b1591d	aede982f-4641-4859-b8f2-84abc0dedf0f	4	1	2	2021-04-30 12:57:33.942619	2021-04-30 12:57:33.942619
8e1088a7-bdfc-4fca-8ff9-8b4e91180d0c	70e81402-fcc1-476e-83c4-d26687f52ac7	aede982f-4641-4859-b8f2-84abc0dedf0f	4	1	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
1aeb1517-daf8-4feb-8ff7-06427257b39d	70e81402-fcc1-476e-83c4-d26687f52ac7	5e6589ad-80b6-4fd3-961c-567379136454	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
9193be01-5026-4648-a9a1-2c810ae63dfb	70e81402-fcc1-476e-83c4-d26687f52ac7	4da73427-46ea-47dd-b053-424b183d0c72	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
1ee6dfc2-ff2c-4ac6-9a52-ba3ae097ae8d	70e81402-fcc1-476e-83c4-d26687f52ac7	7356bf84-e440-47d2-be18-db26582e6e16	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
dd9add45-d077-424a-a955-cf5efe64d02b	70e81402-fcc1-476e-83c4-d26687f52ac7	5da1bf6b-69a7-497c-842b-0bcdd2b27135	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
c550608e-f962-41fd-935e-8b18f3102ae3	70e81402-fcc1-476e-83c4-d26687f52ac7	35d6a12b-0a03-4c17-9ae6-d7a8bb3f5775	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
692fcdea-a712-44e7-a48e-9ddc5a90546c	70e81402-fcc1-476e-83c4-d26687f52ac7	f47e3f81-07ce-4041-aa41-0f3d9d321821	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
6b2a0f11-dcbd-49e3-9ffd-a0e7ed6fd484	70e81402-fcc1-476e-83c4-d26687f52ac7	9111654a-befe-40db-a296-1579e91a78df	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
f4cf3da2-6dfe-40e2-a26c-d6d8e9299e14	70e81402-fcc1-476e-83c4-d26687f52ac7	00e68d5b-96f8-4ae8-b9d2-7d322473d348	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
e38b6523-e3fb-4312-b550-c9ea0bc722cf	70e81402-fcc1-476e-83c4-d26687f52ac7	6cc7e118-0d0a-423b-9564-cb472d210c79	2	22	2	2021-04-30 12:58:16.865128	2021-04-30 12:58:16.865128
f21d9fbf-bbbb-4848-8576-78c5e95a8cfb	7b9fcd49-d5ac-4409-9bee-55e5530c3768	aede982f-4641-4859-b8f2-84abc0dedf0f	4	1	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
67667aed-5fe2-4e25-8794-cf29633d1adf	7b9fcd49-d5ac-4409-9bee-55e5530c3768	994bb7d0-8489-4afe-80d5-25331a3d6109	100	1	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
bcf6976f-32e4-46d2-916a-e9d8b41c893f	7b9fcd49-d5ac-4409-9bee-55e5530c3768	5e6589ad-80b6-4fd3-961c-567379136454	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
d32e64e4-d83b-4f6f-8b19-d52489c917ae	7b9fcd49-d5ac-4409-9bee-55e5530c3768	4da73427-46ea-47dd-b053-424b183d0c72	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
e7fcee40-d99f-48ef-bc67-f6ba4916e4cb	7b9fcd49-d5ac-4409-9bee-55e5530c3768	7356bf84-e440-47d2-be18-db26582e6e16	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
0ed59795-8bd7-466e-acc7-b7f862ace150	7b9fcd49-d5ac-4409-9bee-55e5530c3768	5da1bf6b-69a7-497c-842b-0bcdd2b27135	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
651c0f42-d0cd-4bf5-80b5-3b39276287dc	7b9fcd49-d5ac-4409-9bee-55e5530c3768	35d6a12b-0a03-4c17-9ae6-d7a8bb3f5775	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
a9495979-aafe-4fed-805c-a84c3acf663f	7b9fcd49-d5ac-4409-9bee-55e5530c3768	f47e3f81-07ce-4041-aa41-0f3d9d321821	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
4f38f785-b442-4b18-8835-52bfc83b6851	7b9fcd49-d5ac-4409-9bee-55e5530c3768	9111654a-befe-40db-a296-1579e91a78df	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
9fbc1e05-8545-45f0-a9b1-53f3077574b4	7b9fcd49-d5ac-4409-9bee-55e5530c3768	00e68d5b-96f8-4ae8-b9d2-7d322473d348	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
6b7f8ea4-58df-46e4-9fdf-8e5305764d47	7b9fcd49-d5ac-4409-9bee-55e5530c3768	6cc7e118-0d0a-423b-9564-cb472d210c79	2	22	2	2021-04-30 12:58:49.248465	2021-04-30 12:58:49.248465
104e1689-8953-4a82-bf6e-c52e4bf30438	ee5326f0-88c7-49e1-b63d-ef9398515701	aede982f-4641-4859-b8f2-84abc0dedf0f	4	1	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
6a0f6ac1-1a6c-4e92-a0b6-37d0af826ecd	ee5326f0-88c7-49e1-b63d-ef9398515701	994bb7d0-8489-4afe-80d5-25331a3d6109	100	1	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
5f5d2eaa-2dc2-4b0e-b024-6863afa092fe	ee5326f0-88c7-49e1-b63d-ef9398515701	916c3a73-00f0-4ef1-a25c-b7dd6cb05792	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
6113f9ce-a22e-4575-898e-2d5d65a89bef	ee5326f0-88c7-49e1-b63d-ef9398515701	5e6589ad-80b6-4fd3-961c-567379136454	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
26347982-744e-4ca1-90b0-bdaed400112f	ee5326f0-88c7-49e1-b63d-ef9398515701	4da73427-46ea-47dd-b053-424b183d0c72	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
b8191c6f-9842-43d4-b288-df653ed22881	ee5326f0-88c7-49e1-b63d-ef9398515701	7356bf84-e440-47d2-be18-db26582e6e16	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
a90d53f4-7670-4171-9b14-2bcefe9b36f8	ee5326f0-88c7-49e1-b63d-ef9398515701	5da1bf6b-69a7-497c-842b-0bcdd2b27135	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
35333428-510d-4050-b8c2-e310504e763d	ee5326f0-88c7-49e1-b63d-ef9398515701	35d6a12b-0a03-4c17-9ae6-d7a8bb3f5775	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
5354363b-60cd-40d7-b971-af4ecf183305	ee5326f0-88c7-49e1-b63d-ef9398515701	f47e3f81-07ce-4041-aa41-0f3d9d321821	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
fe7d9d3d-e7fb-426c-826f-41382e66b760	ee5326f0-88c7-49e1-b63d-ef9398515701	9111654a-befe-40db-a296-1579e91a78df	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
4b051ab4-c37b-4c91-8b32-406e5325279e	ee5326f0-88c7-49e1-b63d-ef9398515701	00e68d5b-96f8-4ae8-b9d2-7d322473d348	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
0122ea74-ccb2-4465-b196-c7450e715096	ee5326f0-88c7-49e1-b63d-ef9398515701	6cc7e118-0d0a-423b-9564-cb472d210c79	2	22	2	2021-04-30 12:59:03.299471	2021-04-30 12:59:03.299471
4fb66903-c61e-48eb-8129-4b6a25101186	a13b8d54-b0d5-494f-88b3-16dcb857be12	aede982f-4641-4859-b8f2-84abc0dedf0f	4	1	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
410e43c9-a36c-41fc-9d1f-ad9a99c5cdf8	a13b8d54-b0d5-494f-88b3-16dcb857be12	994bb7d0-8489-4afe-80d5-25331a3d6109	100	1	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
dedc7f94-5656-4c0b-86a1-c22bb94f5b2b	a13b8d54-b0d5-494f-88b3-16dcb857be12	916c3a73-00f0-4ef1-a25c-b7dd6cb05792	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
1efe984e-b263-4d33-a1bb-8894f55cf3b2	a13b8d54-b0d5-494f-88b3-16dcb857be12	5e6589ad-80b6-4fd3-961c-567379136454	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
da884192-fe0c-47e9-9082-6269345498ee	a13b8d54-b0d5-494f-88b3-16dcb857be12	4da73427-46ea-47dd-b053-424b183d0c72	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
3a205a8d-5c47-4793-9671-e734fb561040	a13b8d54-b0d5-494f-88b3-16dcb857be12	7356bf84-e440-47d2-be18-db26582e6e16	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
b7337585-7965-4e89-a6f7-322e06847ab0	a13b8d54-b0d5-494f-88b3-16dcb857be12	5da1bf6b-69a7-497c-842b-0bcdd2b27135	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
d927aa62-ac35-461b-9896-087ba8dba74e	a13b8d54-b0d5-494f-88b3-16dcb857be12	35d6a12b-0a03-4c17-9ae6-d7a8bb3f5775	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
bf6ef54f-1d7e-4557-8029-52c4485033e4	a13b8d54-b0d5-494f-88b3-16dcb857be12	f47e3f81-07ce-4041-aa41-0f3d9d321821	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
b1aefd0c-4570-4fb1-a6ce-f6a7e90164b7	a13b8d54-b0d5-494f-88b3-16dcb857be12	9111654a-befe-40db-a296-1579e91a78df	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
e975ebb5-133c-4739-90c1-f3e7cddf87e0	a13b8d54-b0d5-494f-88b3-16dcb857be12	00e68d5b-96f8-4ae8-b9d2-7d322473d348	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
6115eb47-ed8f-44f8-acc2-045d121d30f5	a13b8d54-b0d5-494f-88b3-16dcb857be12	6cc7e118-0d0a-423b-9564-cb472d210c79	2	22	2	2021-04-30 13:00:19.525914	2021-04-30 13:00:19.525914
\.


--
-- Data for Name: list_producers_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.list_producers_details (id, list_id, product_id, due_date, lot, quantity, unit_price, discount, total_price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: lists; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lists (id, user_id, type, start_date, end_date, status, created_at, updated_at) FROM stdin;
ab946b21-e236-4128-b2a8-8877ad700a46	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:56:56.469308	2021-04-30 12:56:56.469308
983a78d0-18f4-47a3-9f2f-dfa2b4b1591d	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:57:33.932622	2021-04-30 12:57:33.932622
7be56898-f45f-450f-ad29-aa5fee4483b6	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:57:47.926705	2021-04-30 12:57:47.926705
cd51067b-306d-4142-9d03-c53f724f7d8e	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:58:04.107221	2021-04-30 12:58:04.107221
70e81402-fcc1-476e-83c4-d26687f52ac7	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:58:16.854576	2021-04-30 12:58:16.854576
16bad740-6837-4ed1-b832-55a077d53809	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:58:41.870012	2021-04-30 12:58:41.870012
7b9fcd49-d5ac-4409-9bee-55e5530c3768	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:58:49.239193	2021-04-30 12:58:49.239193
ee5326f0-88c7-49e1-b63d-ef9398515701	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-30 12:59:03.289064	2021-04-30 12:59:03.289064
a13b8d54-b0d5-494f-88b3-16dcb857be12	275fd52c-6600-4184-a7ba-a245c6b96750	offer	2021-04-30 12:48:32+00	2021-07-30 12:27:32+00	created	2021-04-30 13:00:19.512598	2021-04-30 13:00:19.512598
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
1	1605228554307	CreateUser1605228554307
2	1609379802515	createPoints1609379802515
3	1609879520820	createProduct1609879520820
4	1609879520822	createOrder1609879520822
5	1609883515226	createOrderDetail1609883515226
6	1610039989596	createWeeklyList1610039989596
7	1610039989598	createProducersListDetail1610039989598
8	1610310641444	createOffersListDetails1610310641444
9	1612107703467	CreateUserTokens1612107703467
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, order_id, product_id, unit_price, quantity, discount, created_at, updated_at) FROM stdin;
d11f5d60-ddb6-4393-b702-8d7f5376bf88	1c6e7bcc-99a9-45ab-a0f8-20506779c39d	aede982f-4641-4859-b8f2-84abc0dedf0f	22	2	1	2021-04-30 13:02:08.215564	2021-04-30 13:02:08.215564
aa39b594-542f-40d5-a8bf-1bc8c1ddb3f2	1c6e7bcc-99a9-45ab-a0f8-20506779c39d	916c3a73-00f0-4ef1-a25c-b7dd6cb05792	22	2	1	2021-04-30 13:02:08.215564	2021-04-30 13:02:08.215564
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, date, value, final_value, payment_type, payment_status, sales_type, delivery_point_id, user_id, created_at, updated_at) FROM stdin;
1c6e7bcc-99a9-45ab-a0f8-20506779c39d	2021-04-30 13:02:08.197+00	456	45	credit_card	processing	wholesale	4a785f0c-f50f-4c3c-a653-fc7e3d0583a4	275fd52c-6600-4184-a7ba-a245c6b96750	2021-04-30 13:02:08.202602	2021-04-30 13:02:08.202602
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, image, nutritional_information, observation, cost_price, organic, unit_sale, category, unit_buy, fraction_buy, fraction_sale, highlights, sale_price, wholesale_price, created_at, updated_at) FROM stdin;
aede982f-4641-4859-b8f2-84abc0dedf0f	alho	e814ac7c6cd26abdcf5e-alho.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	12	11	2021-04-30 09:47:12.444069	2021-04-30 09:47:12.444069
994bb7d0-8489-4afe-80d5-25331a3d6109	alho	e814ac7c6cd26abdcf5e-alho.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	12	11	2021-04-30 09:51:34.704109	2021-04-30 09:51:34.704109
5e6589ad-80b6-4fd3-961c-567379136454	batata	4abf6f414675aab21d20-batata.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	1.5	140	2021-04-30 09:52:10.101559	2021-04-30 09:52:10.101559
916c3a73-00f0-4ef1-a25c-b7dd6cb05792	cenoura	b23bbf4b8351e12a085c-cenoura.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	1.5	1.39999999999999991	2021-04-30 09:52:22.093243	2021-04-30 09:52:22.093243
4da73427-46ea-47dd-b053-424b183d0c72	couve	7dcf66d6e88c0c2cec19-couve.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	1.5	1.39999999999999991	2021-04-30 09:52:35.88948	2021-04-30 09:52:35.88948
7356bf84-e440-47d2-be18-db26582e6e16	ervilha	4b776a22f803a0c67250-couve.jpg	\N	\N	2	t	kg	Legumes	kg	1	1	f	4	3	2021-04-30 09:53:11.619855	2021-04-30 09:53:11.619855
5da1bf6b-69a7-497c-842b-0bcdd2b27135	melancia	90c047ea1d36218a4674-melancia.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	2	2	2021-04-30 09:53:19.622333	2021-04-30 09:53:19.622333
35d6a12b-0a03-4c17-9ae6-d7a8bb3f5775	pepino	17225638f06a3948a4d6-pepino.jpg	\N	\N	1	t	kg	Legumes	kg	1	1	f	2	2	2021-04-30 09:53:23.41719	2021-04-30 09:53:23.41719
f47e3f81-07ce-4041-aa41-0f3d9d321821	pimentao	37c9e9464f19b3bf0f52-pimentao.jpg	\N	\N	5	t	kg	Legumes	kg	1	1	f	8	7	2021-04-30 09:53:23.41719	2021-04-30 09:53:23.41719
9111654a-befe-40db-a296-1579e91a78df	rabanete	961b5d41482d19ec6a50-rabanete.jpg	\N	\N	2	t	kg	Legumes	kg	1	1	f	3	3	2021-04-30 09:53:23.41719	2021-04-30 09:53:23.41719
00e68d5b-96f8-4ae8-b9d2-7d322473d348	rucula	0b2b4100985183f12ea0-rucula.jpg	\N	\N	1	t	un	Legumes	un	1	1	f	1	1	2021-04-30 09:53:23.41719	2021-04-30 09:53:23.41719
6cc7e118-0d0a-423b-9564-cb472d210c79	tomate	8ee8856569d9ab06a1fd-tomate.jpg	\N	\N	1	t	un	Legumes	un	1	1	f	1	1	2021-04-30 09:53:23.41719	2021-04-30 09:53:23.41719
\.


--
-- Data for Name: user_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tokens (id, token, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, phone, password, cpf, cnpj, role, created_at, updated_at) FROM stdin;
275fd52c-6600-4184-a7ba-a245c6b96750	admin	admin@admin.com	46999999999	$2a$08$NQdYygarnEitwZG62.Kr7OSdy0nhgPlVE1qa.fC7xmTJ8uj4Q12ai	111111		r	2021-04-30 12:34:36.97182	2021-04-30 12:34:36.97182
b7dac4ad-df23-4c76-a881-1455ef33b7f6	teste	teste@gmail.com	46999999999	$2a$08$y0BNdt.htrxNb/vPoj5stOamqplZaEK9MvwejcjoVYBH8GWR.Abyi	1112	\N	b	2021-04-30 12:54:15.776749	2021-04-30 12:54:15.776749
238bd4ac-82a1-4723-9606-a67e69882d4e	prando	prando@gmail.com	46999999999	$2a$08$x3oNlYIupHJqEWIN/4and.O2/Yxz32nRCvB/br4ImpGeHSG/PZnq6	11121	\N	b	2021-04-30 12:54:27.407671	2021-04-30 12:54:27.407671
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 9, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: list_offers_details PK_0e7a1d2a40477c05e0957095015; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_offers_details
    ADD CONSTRAINT "PK_0e7a1d2a40477c05e0957095015" PRIMARY KEY (id);


--
-- Name: lists PK_268b525e9a6dd04d0685cb2aaaa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT "PK_268b525e9a6dd04d0685cb2aaaa" PRIMARY KEY (id);


--
-- Name: order_details PK_278a6e0f21c9db1653e6f406801; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT "PK_278a6e0f21c9db1653e6f406801" PRIMARY KEY (id);


--
-- Name: list_producers_details PK_5cf219df9b28808626b14818ab2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_producers_details
    ADD CONSTRAINT "PK_5cf219df9b28808626b14818ab2" PRIMARY KEY (id);


--
-- Name: user_tokens PK_63764db9d9aaa4af33e07b2f4bf; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: users PK_a3ffb1c0c8416b9fc6f907b7433; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);


--
-- Name: delivery_points PK_ee6d715a5812180cd569684ac06; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delivery_points
    ADD CONSTRAINT "PK_ee6d715a5812180cd569684ac06" PRIMARY KEY (id);


--
-- Name: users UQ_230b925048540454c8b4c481e1c; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_230b925048540454c8b4c481e1c" UNIQUE (cpf);


--
-- Name: users UQ_97672ac88f789774dd47f7c8be3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);


--
-- Name: users UQ_a7815967475d0accd76feba8a1e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_a7815967475d0accd76feba8a1e" UNIQUE (cnpj);


--
-- Name: products_name_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_name_search ON public.products USING btree (name);


--
-- Name: list_offers_details ListOffersDetailList; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_offers_details
    ADD CONSTRAINT "ListOffersDetailList" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: list_offers_details ListOffersDetailProduct; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_offers_details
    ADD CONSTRAINT "ListOffersDetailProduct" FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: list_producers_details ListProducersDetailList; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_producers_details
    ADD CONSTRAINT "ListProducersDetailList" FOREIGN KEY (list_id) REFERENCES public.lists(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: list_producers_details ListProducersDetailProduct; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.list_producers_details
    ADD CONSTRAINT "ListProducersDetailProduct" FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: lists ListUser; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lists
    ADD CONSTRAINT "ListUser" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_details OrderDetailOrder; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT "OrderDetailOrder" FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: order_details OrderDetailProduct; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT "OrderDetailProduct" FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders OrderPoint; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "OrderPoint" FOREIGN KEY (delivery_point_id) REFERENCES public.delivery_points(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: orders OrderUser; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "OrderUser" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: user_tokens TokenUser; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tokens
    ADD CONSTRAINT "TokenUser" FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

