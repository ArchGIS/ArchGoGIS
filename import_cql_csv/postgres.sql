--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.4
-- Dumped by pg_dump version 9.5.4

-- Started on 2017-02-26 18:58:40 UTC

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2231 (class 1262 OID 12411)
-- Dependencies: 2230
-- Name: postgres; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- TOC entry 1 (class 3079 OID 12393)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2234 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 203 (class 1259 OID 32808)
-- Name: local_storage_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE local_storage_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE local_storage_file_id_seq OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 32780)
-- Name: n_artifact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_artifact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_artifact_id_seq OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 32768)
-- Name: n_author_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_author_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_author_id_seq OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 32804)
-- Name: n_author_job_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_author_job_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_author_job_id_seq OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 32802)
-- Name: n_city_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_city_id_seq OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 32819)
-- Name: n_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_collection_id_seq OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 32798)
-- Name: n_complex_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_complex_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_complex_id_seq OWNER TO postgres;

--
-- TOC entry 196 (class 1259 OID 32794)
-- Name: n_culture_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_culture_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_culture_id_seq OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 32792)
-- Name: n_epoch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_epoch_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_epoch_id_seq OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 32806)
-- Name: n_excavation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_excavation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_excavation_id_seq OWNER TO postgres;

--
-- TOC entry 192 (class 1259 OID 32786)
-- Name: n_file_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_file_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_file_id_seq OWNER TO postgres;

--
-- TOC entry 187 (class 1259 OID 32776)
-- Name: n_geometry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_geometry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_geometry_id_seq OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 32811)
-- Name: n_heritage_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_heritage_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_heritage_id_seq OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 16402)
-- Name: n_heritage_object_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_heritage_object_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_heritage_object_id_seq OWNER TO postgres;

--
-- TOC entry 194 (class 1259 OID 32790)
-- Name: n_heritage_status_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_heritage_status_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_heritage_status_id_seq OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 32800)
-- Name: n_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_image_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_image_id_seq OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 32815)
-- Name: n_interpretation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_interpretation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_interpretation_id_seq OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 32772)
-- Name: n_knowledge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_knowledge_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_knowledge_id_seq OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 32788)
-- Name: n_monument_analysis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_monument_analysis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_monument_analysis_id_seq OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 32770)
-- Name: n_monument_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_monument_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_monument_id_seq OWNER TO postgres;

--
-- TOC entry 188 (class 1259 OID 32778)
-- Name: n_object_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_object_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_object_id_seq OWNER TO postgres;

--
-- TOC entry 181 (class 1259 OID 16398)
-- Name: n_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_organization_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_organization_id_seq OWNER TO postgres;

--
-- TOC entry 190 (class 1259 OID 32782)
-- Name: n_organization_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_organization_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_organization_seq OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 32821)
-- Name: n_publication_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_publication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_publication_id_seq OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 32784)
-- Name: n_report_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_report_id_seq OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 32774)
-- Name: n_research_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_research_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_research_id_seq OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 32796)
-- Name: n_research_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_research_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_research_type_id_seq OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 40960)
-- Name: n_spatial_reference_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_spatial_reference_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_spatial_reference_id_seq OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 32817)
-- Name: n_storage_interval_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_storage_interval_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_storage_interval_id_seq OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 32813)
-- Name: n_survey_map_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE n_survey_map_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE n_survey_map_id_seq OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 211 (class 1259 OID 32825)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE users (
    id integer NOT NULL,
    login character varying(50) NOT NULL,
    password character varying(50) NOT NULL
);


ALTER TABLE users OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 32823)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO postgres;

--
-- TOC entry 2235 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- TOC entry 2077 (class 2604 OID 32828)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- TOC entry 2236 (class 0 OID 0)
-- Dependencies: 203
-- Name: local_storage_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('local_storage_file_id_seq', 297, true);


--
-- TOC entry 2237 (class 0 OID 0)
-- Dependencies: 189
-- Name: n_artifact_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_artifact_id_seq', 10, true);


--
-- TOC entry 2238 (class 0 OID 0)
-- Dependencies: 183
-- Name: n_author_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_author_id_seq', 35, true);


--
-- TOC entry 2239 (class 0 OID 0)
-- Dependencies: 201
-- Name: n_author_job_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_author_job_id_seq', 1, false);


--
-- TOC entry 2240 (class 0 OID 0)
-- Dependencies: 200
-- Name: n_city_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_city_id_seq', 1, false);


--
-- TOC entry 2241 (class 0 OID 0)
-- Dependencies: 208
-- Name: n_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_collection_id_seq', 1, false);


--
-- TOC entry 2242 (class 0 OID 0)
-- Dependencies: 198
-- Name: n_complex_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_complex_id_seq', 4, true);


--
-- TOC entry 2243 (class 0 OID 0)
-- Dependencies: 196
-- Name: n_culture_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_culture_id_seq', 24, true);


--
-- TOC entry 2244 (class 0 OID 0)
-- Dependencies: 195
-- Name: n_epoch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_epoch_id_seq', 1, false);


--
-- TOC entry 2245 (class 0 OID 0)
-- Dependencies: 202
-- Name: n_excavation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_excavation_id_seq', 111, true);


--
-- TOC entry 2246 (class 0 OID 0)
-- Dependencies: 192
-- Name: n_file_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_file_id_seq', 2, true);


--
-- TOC entry 2247 (class 0 OID 0)
-- Dependencies: 187
-- Name: n_geometry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_geometry_id_seq', 1, false);


--
-- TOC entry 2248 (class 0 OID 0)
-- Dependencies: 204
-- Name: n_heritage_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_heritage_id_seq', 44, true);


--
-- TOC entry 2249 (class 0 OID 0)
-- Dependencies: 182
-- Name: n_heritage_object_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_heritage_object_id_seq', 1, true);


--
-- TOC entry 2250 (class 0 OID 0)
-- Dependencies: 194
-- Name: n_heritage_status_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_heritage_status_id_seq', 1, true);


--
-- TOC entry 2251 (class 0 OID 0)
-- Dependencies: 199
-- Name: n_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_image_id_seq', 214, true);


--
-- TOC entry 2252 (class 0 OID 0)
-- Dependencies: 206
-- Name: n_interpretation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_interpretation_id_seq', 5, true);


--
-- TOC entry 2253 (class 0 OID 0)
-- Dependencies: 185
-- Name: n_knowledge_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_knowledge_id_seq', 328, true);


--
-- TOC entry 2254 (class 0 OID 0)
-- Dependencies: 193
-- Name: n_monument_analysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_monument_analysis_id_seq', 1, false);


--
-- TOC entry 2255 (class 0 OID 0)
-- Dependencies: 184
-- Name: n_monument_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_monument_id_seq', 279, true);


--
-- TOC entry 2256 (class 0 OID 0)
-- Dependencies: 188
-- Name: n_object_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_object_id_seq', 1, false);


--
-- TOC entry 2257 (class 0 OID 0)
-- Dependencies: 181
-- Name: n_organization_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_organization_id_seq', 1, false);


--
-- TOC entry 2258 (class 0 OID 0)
-- Dependencies: 190
-- Name: n_organization_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_organization_seq', 1, false);


--
-- TOC entry 2259 (class 0 OID 0)
-- Dependencies: 209
-- Name: n_publication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_publication_id_seq', 20, true);


--
-- TOC entry 2260 (class 0 OID 0)
-- Dependencies: 191
-- Name: n_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_report_id_seq', 84, true);


--
-- TOC entry 2261 (class 0 OID 0)
-- Dependencies: 186
-- Name: n_research_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_research_id_seq', 109, true);


--
-- TOC entry 2262 (class 0 OID 0)
-- Dependencies: 197
-- Name: n_research_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_research_type_id_seq', 1, false);


--
-- TOC entry 2263 (class 0 OID 0)
-- Dependencies: 212
-- Name: n_spatial_reference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_spatial_reference_id_seq', 1, false);


--
-- TOC entry 2264 (class 0 OID 0)
-- Dependencies: 207
-- Name: n_storage_interval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_storage_interval_id_seq', 1, false);


--
-- TOC entry 2265 (class 0 OID 0)
-- Dependencies: 205
-- Name: n_survey_map_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('n_survey_map_id_seq', 3, true);


--
-- TOC entry 2224 (class 0 OID 32825)
-- Dependencies: 211
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY users (id, login, password) FROM stdin;
1	admin	qwerty
\.


--
-- TOC entry 2266 (class 0 OID 0)
-- Dependencies: 210
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('users_id_seq', 1, true);


--
-- TOC entry 2079 (class 2606 OID 32830)
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2233 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2017-02-26 18:58:40 UTC

--
-- PostgreSQL database dump complete
--

