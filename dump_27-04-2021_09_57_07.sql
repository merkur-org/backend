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
5d383de6-afa6-428f-9762-aae2af0765ed	Pato Branco	PR	Centro	Av tupy	0	85501030	-26.2270670000000017	-52.6722460000000012	2021-04-27 03:12:28.525615	2021-04-27 03:12:28.525615
\.


--
-- Data for Name: list_offers_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.list_offers_details (id, list_id, product_id, quantity, unit_price, sale_price, created_at, updated_at) FROM stdin;
9d71711f-4edc-4f1b-ab18-f20fd8d5f610	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	81da1448-0a83-4375-8d28-10d13aeb71ad	4	1	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
b68608e2-275a-4ce9-ae7d-dbb8cd22e68e	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	2ab4af84-b858-4084-9d3a-f1c9208f09b0	100	1	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
78a21ded-ced1-4dc7-aac5-b54150076cf9	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	91516304-c079-47d6-948d-446424740964	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
8df4acc4-4bbf-4388-9b54-16f1ae8489b0	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	6c53a1c7-3d68-43a4-9f2d-b07f93a5e733	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
9c3abd66-3e71-4338-8062-19642d69ec4e	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	6b2433e3-ffa0-4e42-ad1e-554014981b3a	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
c3392da7-b642-43ba-a973-50e8afc42517	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	15f86e59-2c7f-4370-ba33-54841cb2f6a2	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
d68b3d2a-eca3-4490-af70-67e2fc998ba8	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	296b4df5-cff8-46f3-b0e8-b45bac0385c0	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
00aabd46-bdb1-4532-8fc3-0fb612492cb4	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	463c9eae-56a8-4a1e-8161-e0840104fded	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
9226d935-2911-4407-a4bb-2e913f861bbd	9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	342bc43e-50fe-4e35-9fc4-cca8d82b357f	2	22	2	2021-04-27 03:20:20.391398	2021-04-27 03:20:20.391398
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
9e2d7dcb-6890-46c1-93e0-7d98100f3cbe	5791d8ff-e835-4e78-bfe8-e63313d711d2	offer	2021-04-12 12:48:32+00	2021-04-19 12:27:32+00	created	2021-04-27 03:20:20.381059	2021-04-27 03:20:20.381059
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
3	1605228554307	CreateUser1605228554307
4	1609379802515	createPoints1609379802515
5	1609879520820	createProduct1609879520820
6	1609879520822	createOrder1609879520822
7	1609883515226	createOrderDetail1609883515226
8	1610039989596	createWeeklyList1610039989596
9	1610039989598	createProducersListDetail1610039989598
10	1610310641444	createOffersListDetails1610310641444
11	1612107703467	CreateUserTokens1612107703467
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_details (id, order_id, product_id, unit_price, quantity, discount, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, date, value, final_value, payment_type, payment_status, sales_type, delivery_point_id, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, image, nutritional_information, observation, cost_price, organic, unit_sale, unit_buy, fraction_buy, fraction_sale, highlights, sale_price, wholesale_price, created_at, updated_at) FROM stdin;
81da1448-0a83-4375-8d28-10d13aeb71ad	alho	e814ac7c6cd26abdcf5e-alho.jpg	\N	\N	12	t	kg	kg	1	1	f	12	11	2021-04-27 02:59:58.674505	2021-04-27 02:59:58.674505
2ab4af84-b858-4084-9d3a-f1c9208f09b0	batata	4abf6f414675aab21d20-batata.jpg	\N	\N	1	t	kg	kg	1	1	f	1.5	140	2021-04-27 03:02:56.913937	2021-04-27 03:02:56.913937
91516304-c079-47d6-948d-446424740964	cenoura	b23bbf4b8351e12a085c-cenoura.jpg	\N	\N	1	t	kg	kg	1	1	f	1.5	1.39999999999999991	2021-04-27 03:03:55.209877	2021-04-27 03:03:55.209877
6c53a1c7-3d68-43a4-9f2d-b07f93a5e733	couve	7dcf66d6e88c0c2cec19-couve.jpg	\N	\N	1	t	kg	kg	1	1	f	1.5	1.39999999999999991	2021-04-27 03:04:12.742608	2021-04-27 03:04:12.742608
6b2433e3-ffa0-4e42-ad1e-554014981b3a	ervilha	4b776a22f803a0c67250-couve.jpg	\N	\N	2	t	kg	kg	0.200000000000000011	1	f	4	3.79999999999999982	2021-04-27 03:04:43.659877	2021-04-27 03:04:43.659877
15f86e59-2c7f-4370-ba33-54841cb2f6a2	melancia	90c047ea1d36218a4674-melancia.jpg	\N	\N	1	t	kg	kg	1	1	f	2	2	2021-04-27 03:05:10.992885	2021-04-27 03:05:10.992885
296b4df5-cff8-46f3-b0e8-b45bac0385c0	pepino	17225638f06a3948a4d6-pepino.jpg	\N	\N	1	t	kg	kg	1	1	f	2	2	2021-04-27 03:05:28.700583	2021-04-27 03:05:28.700583
463c9eae-56a8-4a1e-8161-e0840104fded	pimentao	37c9e9464f19b3bf0f52-pimentao.jpg	\N	\N	5	t	kg	kg	1	1	f	8	7	2021-04-27 03:06:09.556482	2021-04-27 03:06:09.556482
342bc43e-50fe-4e35-9fc4-cca8d82b357f	rabanete	961b5d41482d19ec6a50-rabanete.jpg	\N	\N	2	t	kg	kg	1	1	f	3	3	2021-04-27 03:06:40.536223	2021-04-27 03:06:40.536223
e1fdc570-8d88-4180-af9b-c95b917892e9	rucula	0b2b4100985183f12ea0-rucula.jpg	\N	\N	1	t	un	un	1	1	f	1	1	2021-04-27 03:07:53.170897	2021-04-27 03:07:53.170897
13d90dc6-333a-4f40-8784-69b83afc5cd6	tomate	8ee8856569d9ab06a1fd-tomate.jpg	\N	\N	1	t	un	un	1	1	f	1	1	2021-04-27 03:08:20.70135	2021-04-27 03:08:20.70135
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
5791d8ff-e835-4e78-bfe8-e63313d711d2	admin	admin@admin.com	46999999999	$2a$08$NQdYygarnEitwZG62.Kr7OSdy0nhgPlVE1qa.fC7xmTJ8uj4Q12ai	111111		r	2021-04-26 18:21:05.737526	2021-04-26 18:21:05.737526
f7ce335e-7acb-44bb-9399-7ca3856b1bfc	gabriel prando	prando@gmail.com	46999039412	$2a$08$flGVKUM32lTHPAydURAm/uwTCS795O5MjngcVV.yKszwfjPYuwnQG	111	\N	b	2021-04-26 18:47:51.410126	2021-04-26 18:47:51.410126
325d34f5-c405-47f2-98df-297c2eb697e1	teste	teste@gmail.com	46999999999	$2a$08$lwj5kanAF01xawAAs7SnEeMEnDO8SQizUR3OrmSFdksxezVY.VIli	1112	\N	b	2021-04-26 18:48:16.03178	2021-04-26 18:48:16.03178
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 11, true);


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

