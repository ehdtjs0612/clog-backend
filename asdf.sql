--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Homebrew)
-- Dumped by pg_dump version 14.8 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.account_tb (
    id integer NOT NULL,
    major smallint NOT NULL,
    email character varying(256) NOT NULL,
    pw character(256) NOT NULL,
    name character varying(16) NOT NULL,
    entry_year smallint,
    personal_color character(6) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.account_tb OWNER TO ju;

--
-- Name: TABLE account_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.account_tb IS '계정 테이블';


--
-- Name: account_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.account_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_tb_id_seq OWNER TO ju;

--
-- Name: account_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.account_tb_id_seq OWNED BY public.account_tb.id;


--
-- Name: belong_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.belong_tb (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.belong_tb OWNER TO ju;

--
-- Name: TABLE belong_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.belong_tb IS '동아리 소속';


--
-- Name: belong_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.belong_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.belong_tb_id_seq OWNER TO ju;

--
-- Name: belong_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.belong_tb_id_seq OWNED BY public.belong_tb.id;


--
-- Name: big_category_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.big_category_tb (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.big_category_tb OWNER TO ju;

--
-- Name: TABLE big_category_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.big_category_tb IS '대분류 카테고리';


--
-- Name: big_category_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.big_category_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.big_category_tb_id_seq OWNER TO ju;

--
-- Name: big_category_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.big_category_tb_id_seq OWNED BY public.big_category_tb.id;


--
-- Name: club_board_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_board_tb (
    id integer NOT NULL,
    club_id integer NOT NULL,
    name character varying(16),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_board_tb OWNER TO ju;

--
-- Name: TABLE club_board_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_board_tb IS '동아리 게시판 테이블';


--
-- Name: club_board_tb_club_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_board_tb_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_board_tb_club_id_seq OWNER TO ju;

--
-- Name: club_board_tb_club_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_board_tb_club_id_seq OWNED BY public.club_board_tb.club_id;


--
-- Name: club_board_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_board_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_board_tb_id_seq OWNER TO ju;

--
-- Name: club_board_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_board_tb_id_seq OWNED BY public.club_board_tb.id;


--
-- Name: club_comment_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_comment_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    club_post_id integer NOT NULL,
    content text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_comment_tb OWNER TO ju;

--
-- Name: TABLE club_comment_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_comment_tb IS '동아리 댓글 테이블';


--
-- Name: club_comment_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_comment_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_comment_tb_account_id_seq OWNER TO ju;

--
-- Name: club_comment_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_comment_tb_account_id_seq OWNED BY public.club_comment_tb.account_id;


--
-- Name: club_comment_tb_club_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_comment_tb_club_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_comment_tb_club_post_id_seq OWNER TO ju;

--
-- Name: club_comment_tb_club_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_comment_tb_club_post_id_seq OWNED BY public.club_comment_tb.club_post_id;


--
-- Name: club_comment_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_comment_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_comment_tb_id_seq OWNER TO ju;

--
-- Name: club_comment_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_comment_tb_id_seq OWNED BY public.club_comment_tb.id;


--
-- Name: club_member_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_member_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    club_id integer NOT NULL,
    "position" smallint,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_member_tb OWNER TO ju;

--
-- Name: TABLE club_member_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_member_tb IS '동아리 유저 테이블';


--
-- Name: club_member_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_member_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_member_tb_account_id_seq OWNER TO ju;

--
-- Name: club_member_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_member_tb_account_id_seq OWNED BY public.club_member_tb.account_id;


--
-- Name: club_member_tb_club_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_member_tb_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_member_tb_club_id_seq OWNER TO ju;

--
-- Name: club_member_tb_club_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_member_tb_club_id_seq OWNED BY public.club_member_tb.club_id;


--
-- Name: club_member_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_member_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_member_tb_id_seq OWNER TO ju;

--
-- Name: club_member_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_member_tb_id_seq OWNED BY public.club_member_tb.id;


--
-- Name: club_post_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_post_tb (
    id integer NOT NULL,
    club_board_id integer NOT NULL,
    account_id integer NOT NULL,
    title character varying(32) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_post_tb OWNER TO ju;

--
-- Name: TABLE club_post_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_post_tb IS '동아리 게시물 테이블';


--
-- Name: club_post_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_post_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_post_tb_account_id_seq OWNER TO ju;

--
-- Name: club_post_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_post_tb_account_id_seq OWNED BY public.club_post_tb.account_id;


--
-- Name: club_post_tb_club_board_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_post_tb_club_board_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_post_tb_club_board_id_seq OWNER TO ju;

--
-- Name: club_post_tb_club_board_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_post_tb_club_board_id_seq OWNED BY public.club_post_tb.club_board_id;


--
-- Name: club_post_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_post_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_post_tb_id_seq OWNER TO ju;

--
-- Name: club_post_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_post_tb_id_seq OWNED BY public.club_post_tb.id;


--
-- Name: club_reply_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_reply_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    club_comment_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.club_reply_tb OWNER TO ju;

--
-- Name: TABLE club_reply_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_reply_tb IS '동아리 답글 테이블';


--
-- Name: club_reply_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_reply_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_reply_tb_account_id_seq OWNER TO ju;

--
-- Name: club_reply_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_reply_tb_account_id_seq OWNED BY public.club_reply_tb.account_id;


--
-- Name: club_reply_tb_club_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_reply_tb_club_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_reply_tb_club_comment_id_seq OWNER TO ju;

--
-- Name: club_reply_tb_club_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_reply_tb_club_comment_id_seq OWNED BY public.club_reply_tb.club_comment_id;


--
-- Name: club_reply_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_reply_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_reply_tb_id_seq OWNER TO ju;

--
-- Name: club_reply_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_reply_tb_id_seq OWNED BY public.club_reply_tb.id;


--
-- Name: club_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.club_tb (
    id integer NOT NULL,
    belong integer NOT NULL,
    big_category integer NOT NULL,
    small_category integer NOT NULL,
    name character varying(12) NOT NULL,
    cover character varying(320),
    is_recruit boolean NOT NULL,
    profile_img character varying(256) NOT NULL,
    banner_img character varying(256) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    theme_color character(6) NOT NULL
);


ALTER TABLE public.club_tb OWNER TO ju;

--
-- Name: TABLE club_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.club_tb IS '동아리 테이블';


--
-- Name: COLUMN club_tb.belong; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.belong IS '소속';


--
-- Name: COLUMN club_tb.big_category; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.big_category IS '대분류';


--
-- Name: COLUMN club_tb.small_category; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.small_category IS '소분류';


--
-- Name: COLUMN club_tb.is_recruit; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.is_recruit IS '가입신청 허용 유무';


--
-- Name: COLUMN club_tb.profile_img; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.profile_img IS '동아리 프로필';


--
-- Name: COLUMN club_tb.banner_img; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.banner_img IS '동아리 배너';


--
-- Name: COLUMN club_tb.theme_color; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON COLUMN public.club_tb.theme_color IS '동아리 테마 컬러';


--
-- Name: club_tb_belong_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_tb_belong_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_tb_belong_seq OWNER TO ju;

--
-- Name: club_tb_belong_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_tb_belong_seq OWNED BY public.club_tb.belong;


--
-- Name: club_tb_big_category_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_tb_big_category_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_tb_big_category_seq OWNER TO ju;

--
-- Name: club_tb_big_category_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_tb_big_category_seq OWNED BY public.club_tb.big_category;


--
-- Name: club_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_tb_id_seq OWNER TO ju;

--
-- Name: club_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_tb_id_seq OWNED BY public.club_tb.id;


--
-- Name: club_tb_small_category_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.club_tb_small_category_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.club_tb_small_category_seq OWNER TO ju;

--
-- Name: club_tb_small_category_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.club_tb_small_category_seq OWNED BY public.club_tb.small_category;


--
-- Name: join_request_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.join_request_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    club_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.join_request_tb OWNER TO ju;

--
-- Name: TABLE join_request_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.join_request_tb IS '가입 요청 테이블';


--
-- Name: join_request_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.join_request_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.join_request_tb_account_id_seq OWNER TO ju;

--
-- Name: join_request_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.join_request_tb_account_id_seq OWNED BY public.join_request_tb.account_id;


--
-- Name: join_request_tb_club_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.join_request_tb_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.join_request_tb_club_id_seq OWNER TO ju;

--
-- Name: join_request_tb_club_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.join_request_tb_club_id_seq OWNED BY public.join_request_tb.club_id;


--
-- Name: join_request_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.join_request_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.join_request_tb_id_seq OWNER TO ju;

--
-- Name: join_request_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.join_request_tb_id_seq OWNED BY public.join_request_tb.id;


--
-- Name: major_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.major_tb (
    id smallint NOT NULL,
    name character varying(32) NOT NULL
);


ALTER TABLE public.major_tb OWNER TO ju;

--
-- Name: TABLE major_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.major_tb IS '학과 테이블';


--
-- Name: notice_comment_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.notice_comment_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    notice_post_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_comment_tb OWNER TO ju;

--
-- Name: TABLE notice_comment_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.notice_comment_tb IS '공지 댓글 테이블';


--
-- Name: notice_comment_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_comment_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_comment_tb_account_id_seq OWNER TO ju;

--
-- Name: notice_comment_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_comment_tb_account_id_seq OWNED BY public.notice_comment_tb.account_id;


--
-- Name: notice_comment_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_comment_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_comment_tb_id_seq OWNER TO ju;

--
-- Name: notice_comment_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_comment_tb_id_seq OWNED BY public.notice_comment_tb.id;


--
-- Name: notice_comment_tb_notice_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_comment_tb_notice_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_comment_tb_notice_post_id_seq OWNER TO ju;

--
-- Name: notice_comment_tb_notice_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_comment_tb_notice_post_id_seq OWNED BY public.notice_comment_tb.notice_post_id;


--
-- Name: notice_post_img_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.notice_post_img_tb (
    id integer NOT NULL,
    post_id integer NOT NULL,
    post_img character varying NOT NULL,
    create_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_post_img_tb OWNER TO ju;

--
-- Name: TABLE notice_post_img_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.notice_post_img_tb IS '공지 게시물 이미지 테이블';


--
-- Name: notice_post_img_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_post_img_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_post_img_tb_id_seq OWNER TO ju;

--
-- Name: notice_post_img_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_post_img_tb_id_seq OWNED BY public.notice_post_img_tb.id;


--
-- Name: notice_post_img_tb_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_post_img_tb_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_post_img_tb_post_id_seq OWNER TO ju;

--
-- Name: notice_post_img_tb_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_post_img_tb_post_id_seq OWNED BY public.notice_post_img_tb.post_id;


--
-- Name: notice_post_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.notice_post_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    club_id integer NOT NULL,
    title character varying(32) NOT NULL,
    content text NOT NULL,
    is_fixed boolean,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_post_tb OWNER TO ju;

--
-- Name: TABLE notice_post_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.notice_post_tb IS '공지 게시물 테이블';


--
-- Name: notice_post_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_post_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_post_tb_account_id_seq OWNER TO ju;

--
-- Name: notice_post_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_post_tb_account_id_seq OWNED BY public.notice_post_tb.account_id;


--
-- Name: notice_post_tb_club_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_post_tb_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_post_tb_club_id_seq OWNER TO ju;

--
-- Name: notice_post_tb_club_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_post_tb_club_id_seq OWNED BY public.notice_post_tb.club_id;


--
-- Name: notice_post_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_post_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_post_tb_id_seq OWNER TO ju;

--
-- Name: notice_post_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_post_tb_id_seq OWNED BY public.notice_post_tb.id;


--
-- Name: notice_reply_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.notice_reply_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    notice_comment_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.notice_reply_tb OWNER TO ju;

--
-- Name: TABLE notice_reply_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.notice_reply_tb IS '공지 답글 테이블';


--
-- Name: notice_reply_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_reply_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_reply_tb_account_id_seq OWNER TO ju;

--
-- Name: notice_reply_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_reply_tb_account_id_seq OWNED BY public.notice_reply_tb.account_id;


--
-- Name: notice_reply_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_reply_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_reply_tb_id_seq OWNER TO ju;

--
-- Name: notice_reply_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_reply_tb_id_seq OWNED BY public.notice_reply_tb.id;


--
-- Name: notice_reply_tb_notice_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.notice_reply_tb_notice_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notice_reply_tb_notice_comment_id_seq OWNER TO ju;

--
-- Name: notice_reply_tb_notice_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.notice_reply_tb_notice_comment_id_seq OWNED BY public.notice_reply_tb.notice_comment_id;


--
-- Name: position_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.position_tb (
    id integer NOT NULL,
    name character varying(10)
);


ALTER TABLE public.position_tb OWNER TO ju;

--
-- Name: TABLE position_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.position_tb IS '동아리 직급 테이블';


--
-- Name: position_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.position_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.position_tb_id_seq OWNER TO ju;

--
-- Name: position_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.position_tb_id_seq OWNED BY public.position_tb.id;


--
-- Name: post_img_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.post_img_tb (
    id integer NOT NULL,
    post_id integer NOT NULL,
    post_img character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.post_img_tb OWNER TO ju;

--
-- Name: TABLE post_img_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.post_img_tb IS '일반 게시물 이미지 테이블';


--
-- Name: post_img_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.post_img_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_img_tb_id_seq OWNER TO ju;

--
-- Name: post_img_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.post_img_tb_id_seq OWNED BY public.post_img_tb.id;


--
-- Name: post_img_tb_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.post_img_tb_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_img_tb_post_id_seq OWNER TO ju;

--
-- Name: post_img_tb_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.post_img_tb_post_id_seq OWNED BY public.post_img_tb.post_id;


--
-- Name: promotion_comment_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.promotion_comment_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    pr_post_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotion_comment_tb OWNER TO ju;

--
-- Name: TABLE promotion_comment_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.promotion_comment_tb IS '홍보 댓글 테이블';


--
-- Name: promotion_comment_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_comment_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_comment_tb_account_id_seq OWNER TO ju;

--
-- Name: promotion_comment_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_comment_tb_account_id_seq OWNED BY public.promotion_comment_tb.account_id;


--
-- Name: promotion_comment_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_comment_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_comment_tb_id_seq OWNER TO ju;

--
-- Name: promotion_comment_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_comment_tb_id_seq OWNED BY public.promotion_comment_tb.id;


--
-- Name: promotion_comment_tb_pr_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_comment_tb_pr_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_comment_tb_pr_post_id_seq OWNER TO ju;

--
-- Name: promotion_comment_tb_pr_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_comment_tb_pr_post_id_seq OWNED BY public.promotion_comment_tb.pr_post_id;


--
-- Name: promotion_post_img_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.promotion_post_img_tb (
    id integer NOT NULL,
    post_id integer NOT NULL,
    post_img character varying NOT NULL,
    create_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotion_post_img_tb OWNER TO ju;

--
-- Name: TABLE promotion_post_img_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.promotion_post_img_tb IS '홍보 게시글 이미지 테이블';


--
-- Name: promotion_post_img_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_post_img_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_post_img_tb_id_seq OWNER TO ju;

--
-- Name: promotion_post_img_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_post_img_tb_id_seq OWNED BY public.promotion_post_img_tb.id;


--
-- Name: promotion_post_img_tb_post_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_post_img_tb_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_post_img_tb_post_id_seq OWNER TO ju;

--
-- Name: promotion_post_img_tb_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_post_img_tb_post_id_seq OWNED BY public.promotion_post_img_tb.post_id;


--
-- Name: promotion_post_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.promotion_post_tb (
    id integer NOT NULL,
    club_id integer NOT NULL,
    title character varying(32) NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotion_post_tb OWNER TO ju;

--
-- Name: TABLE promotion_post_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.promotion_post_tb IS '홍보 게시물 테이블';


--
-- Name: promotion_post_tb_club_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_post_tb_club_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_post_tb_club_id_seq OWNER TO ju;

--
-- Name: promotion_post_tb_club_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_post_tb_club_id_seq OWNED BY public.promotion_post_tb.club_id;


--
-- Name: promotion_post_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_post_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_post_tb_id_seq OWNER TO ju;

--
-- Name: promotion_post_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_post_tb_id_seq OWNED BY public.promotion_post_tb.id;


--
-- Name: promotion_reply_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.promotion_reply_tb (
    id integer NOT NULL,
    account_id integer NOT NULL,
    pr_comment_id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promotion_reply_tb OWNER TO ju;

--
-- Name: TABLE promotion_reply_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.promotion_reply_tb IS '홍보 답글 테이블';


--
-- Name: promotion_reply_tb_account_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_reply_tb_account_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_reply_tb_account_id_seq OWNER TO ju;

--
-- Name: promotion_reply_tb_account_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_reply_tb_account_id_seq OWNED BY public.promotion_reply_tb.account_id;


--
-- Name: promotion_reply_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

ALTER TABLE public.promotion_reply_tb ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.promotion_reply_tb_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: promotion_reply_tb_pr_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.promotion_reply_tb_pr_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.promotion_reply_tb_pr_comment_id_seq OWNER TO ju;

--
-- Name: promotion_reply_tb_pr_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.promotion_reply_tb_pr_comment_id_seq OWNED BY public.promotion_reply_tb.pr_comment_id;


--
-- Name: small_category_tb; Type: TABLE; Schema: public; Owner: ju
--

CREATE TABLE public.small_category_tb (
    id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.small_category_tb OWNER TO ju;

--
-- Name: TABLE small_category_tb; Type: COMMENT; Schema: public; Owner: ju
--

COMMENT ON TABLE public.small_category_tb IS '소분류 카테고리';


--
-- Name: small_category_tb_id_seq; Type: SEQUENCE; Schema: public; Owner: ju
--

CREATE SEQUENCE public.small_category_tb_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.small_category_tb_id_seq OWNER TO ju;

--
-- Name: small_category_tb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: ju
--

ALTER SEQUENCE public.small_category_tb_id_seq OWNED BY public.small_category_tb.id;


--
-- Name: account_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.account_tb ALTER COLUMN id SET DEFAULT nextval('public.account_tb_id_seq'::regclass);


--
-- Name: belong_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.belong_tb ALTER COLUMN id SET DEFAULT nextval('public.belong_tb_id_seq'::regclass);


--
-- Name: big_category_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.big_category_tb ALTER COLUMN id SET DEFAULT nextval('public.big_category_tb_id_seq'::regclass);


--
-- Name: club_board_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_board_tb ALTER COLUMN id SET DEFAULT nextval('public.club_board_tb_id_seq'::regclass);


--
-- Name: club_board_tb club_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_board_tb ALTER COLUMN club_id SET DEFAULT nextval('public.club_board_tb_club_id_seq'::regclass);


--
-- Name: club_comment_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb ALTER COLUMN id SET DEFAULT nextval('public.club_comment_tb_id_seq'::regclass);


--
-- Name: club_comment_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb ALTER COLUMN account_id SET DEFAULT nextval('public.club_comment_tb_account_id_seq'::regclass);


--
-- Name: club_comment_tb club_post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb ALTER COLUMN club_post_id SET DEFAULT nextval('public.club_comment_tb_club_post_id_seq'::regclass);


--
-- Name: club_member_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb ALTER COLUMN id SET DEFAULT nextval('public.club_member_tb_id_seq'::regclass);


--
-- Name: club_member_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb ALTER COLUMN account_id SET DEFAULT nextval('public.club_member_tb_account_id_seq'::regclass);


--
-- Name: club_member_tb club_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb ALTER COLUMN club_id SET DEFAULT nextval('public.club_member_tb_club_id_seq'::regclass);


--
-- Name: club_post_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb ALTER COLUMN id SET DEFAULT nextval('public.club_post_tb_id_seq'::regclass);


--
-- Name: club_post_tb club_board_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb ALTER COLUMN club_board_id SET DEFAULT nextval('public.club_post_tb_club_board_id_seq'::regclass);


--
-- Name: club_post_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb ALTER COLUMN account_id SET DEFAULT nextval('public.club_post_tb_account_id_seq'::regclass);


--
-- Name: club_reply_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb ALTER COLUMN id SET DEFAULT nextval('public.club_reply_tb_id_seq'::regclass);


--
-- Name: club_reply_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb ALTER COLUMN account_id SET DEFAULT nextval('public.club_reply_tb_account_id_seq'::regclass);


--
-- Name: club_reply_tb club_comment_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb ALTER COLUMN club_comment_id SET DEFAULT nextval('public.club_reply_tb_club_comment_id_seq'::regclass);


--
-- Name: club_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb ALTER COLUMN id SET DEFAULT nextval('public.club_tb_id_seq'::regclass);


--
-- Name: club_tb belong; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb ALTER COLUMN belong SET DEFAULT nextval('public.club_tb_belong_seq'::regclass);


--
-- Name: club_tb big_category; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb ALTER COLUMN big_category SET DEFAULT nextval('public.club_tb_big_category_seq'::regclass);


--
-- Name: club_tb small_category; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb ALTER COLUMN small_category SET DEFAULT nextval('public.club_tb_small_category_seq'::regclass);


--
-- Name: join_request_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb ALTER COLUMN id SET DEFAULT nextval('public.join_request_tb_id_seq'::regclass);


--
-- Name: join_request_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb ALTER COLUMN account_id SET DEFAULT nextval('public.join_request_tb_account_id_seq'::regclass);


--
-- Name: join_request_tb club_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb ALTER COLUMN club_id SET DEFAULT nextval('public.join_request_tb_club_id_seq'::regclass);


--
-- Name: notice_comment_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb ALTER COLUMN id SET DEFAULT nextval('public.notice_comment_tb_id_seq'::regclass);


--
-- Name: notice_comment_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb ALTER COLUMN account_id SET DEFAULT nextval('public.notice_comment_tb_account_id_seq'::regclass);


--
-- Name: notice_comment_tb notice_post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb ALTER COLUMN notice_post_id SET DEFAULT nextval('public.notice_comment_tb_notice_post_id_seq'::regclass);


--
-- Name: notice_post_img_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_img_tb ALTER COLUMN id SET DEFAULT nextval('public.notice_post_img_tb_id_seq'::regclass);


--
-- Name: notice_post_img_tb post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_img_tb ALTER COLUMN post_id SET DEFAULT nextval('public.notice_post_img_tb_post_id_seq'::regclass);


--
-- Name: notice_post_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb ALTER COLUMN id SET DEFAULT nextval('public.notice_post_tb_id_seq'::regclass);


--
-- Name: notice_post_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb ALTER COLUMN account_id SET DEFAULT nextval('public.notice_post_tb_account_id_seq'::regclass);


--
-- Name: notice_post_tb club_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb ALTER COLUMN club_id SET DEFAULT nextval('public.notice_post_tb_club_id_seq'::regclass);


--
-- Name: notice_reply_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb ALTER COLUMN id SET DEFAULT nextval('public.notice_reply_tb_id_seq'::regclass);


--
-- Name: notice_reply_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb ALTER COLUMN account_id SET DEFAULT nextval('public.notice_reply_tb_account_id_seq'::regclass);


--
-- Name: notice_reply_tb notice_comment_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb ALTER COLUMN notice_comment_id SET DEFAULT nextval('public.notice_reply_tb_notice_comment_id_seq'::regclass);


--
-- Name: position_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.position_tb ALTER COLUMN id SET DEFAULT nextval('public.position_tb_id_seq'::regclass);


--
-- Name: post_img_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.post_img_tb ALTER COLUMN id SET DEFAULT nextval('public.post_img_tb_id_seq'::regclass);


--
-- Name: post_img_tb post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.post_img_tb ALTER COLUMN post_id SET DEFAULT nextval('public.post_img_tb_post_id_seq'::regclass);


--
-- Name: promotion_comment_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb ALTER COLUMN id SET DEFAULT nextval('public.promotion_comment_tb_id_seq'::regclass);


--
-- Name: promotion_comment_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb ALTER COLUMN account_id SET DEFAULT nextval('public.promotion_comment_tb_account_id_seq'::regclass);


--
-- Name: promotion_comment_tb pr_post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb ALTER COLUMN pr_post_id SET DEFAULT nextval('public.promotion_comment_tb_pr_post_id_seq'::regclass);


--
-- Name: promotion_post_img_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_img_tb ALTER COLUMN id SET DEFAULT nextval('public.promotion_post_img_tb_id_seq'::regclass);


--
-- Name: promotion_post_img_tb post_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_img_tb ALTER COLUMN post_id SET DEFAULT nextval('public.promotion_post_img_tb_post_id_seq'::regclass);


--
-- Name: promotion_post_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_tb ALTER COLUMN id SET DEFAULT nextval('public.promotion_post_tb_id_seq'::regclass);


--
-- Name: promotion_post_tb club_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_tb ALTER COLUMN club_id SET DEFAULT nextval('public.promotion_post_tb_club_id_seq'::regclass);


--
-- Name: promotion_reply_tb account_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_reply_tb ALTER COLUMN account_id SET DEFAULT nextval('public.promotion_reply_tb_account_id_seq'::regclass);


--
-- Name: promotion_reply_tb pr_comment_id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_reply_tb ALTER COLUMN pr_comment_id SET DEFAULT nextval('public.promotion_reply_tb_pr_comment_id_seq'::regclass);


--
-- Name: small_category_tb id; Type: DEFAULT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.small_category_tb ALTER COLUMN id SET DEFAULT nextval('public.small_category_tb_id_seq'::regclass);


--
-- Data for Name: account_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.account_tb (id, major, email, pw, name, entry_year, personal_color, created_at, updated_at) FROM stdin;
2	43	test123@clog.com	$2b$10$pNuFlDPx1vpCSTinTLfgl.f/13CBM.NevzH6ElOm8Hcb8pQvrhUoi                                                                                                                                                                                                    	ju u	20	d27cd4	2023-10-03 09:53:05.643814+09	2023-10-03 09:53:05.643814
4	42	test123@inha.edu	$2b$10$RUSQJhY2iVbr4HNtpJzkxOyckHiSpeVl7aBgVVlOcMoKTku/Sdh7O                                                                                                                                                                                                    	ju yoo	20	f66b12	2023-10-03 10:09:01.341284+09	2023-10-03 10:09:01.341284
6	42	test1232@inha.edu	$2b$10$atnW4R2pRkyAX4uw5XmZkeqDGg3GbXNYhoewtFQ1BfJOsvVC3AcMy                                                                                                                                                                                                    	ju yoo	20	f7fd51	2023-10-04 19:43:09.762336+09	2023-10-04 19:43:09.762336
10	2	ehdtjs0612@inha.edu	$2b$10$4WW.UcVyocD3Zmdm1d/DxeuD5ZLpUcM1u8ntSYgpoj6FWzLRLwtWO                                                                                                                                                                                                    	ju yoo	20	06a3ff	2023-10-04 20:36:12.781777+09	2023-10-04 20:36:12.781777
11	22	ehdtjs0613@inha.edu	$2b$10$HwNc/3s2end/cGulVImSZOXMCgkLj.aJc.WbwVvUEToolGpPyeqTe                                                                                                                                                                                                    	ju yooo	20	372ebe	2023-10-05 11:03:13.878617+09	2023-10-05 11:03:13.878617
\.


--
-- Data for Name: belong_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.belong_tb (id, name) FROM stdin;
0	중앙동아리
1	일반동아리
2	단과대 소모임
3	학과 소모임
4	기타 소모임
\.


--
-- Data for Name: big_category_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.big_category_tb (id, name) FROM stdin;
0	공연
1	어학
2	연구
3	사회
4	종교
5	전시
6	무예
7	구기
8	레저
9	봉사
\.


--
-- Data for Name: club_board_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_board_tb (id, club_id, name, created_at) FROM stdin;
\.


--
-- Data for Name: club_comment_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_comment_tb (id, account_id, club_post_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: club_member_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_member_tb (id, account_id, club_id, "position", created_at) FROM stdin;
31	2	26	0	2023-10-05 11:59:06.221647+09
32	10	26	2	2023-10-05 12:10:08.828054+09
33	11	26	2	2023-10-05 12:20:38.391516+09
35	10	28	0	2023-10-05 14:44:45.041038+09
\.


--
-- Data for Name: club_post_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_post_tb (id, club_board_id, account_id, title, content, created_at) FROM stdin;
\.


--
-- Data for Name: club_reply_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_reply_tb (id, account_id, club_comment_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: club_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.club_tb (id, belong, big_category, small_category, name, cover, is_recruit, profile_img, banner_img, created_at, theme_color) FROM stdin;
26	4	5	6	동아리수정테스트	이 동아리는 2번유저가 만든 동아리입니다	f	modifyProfileImg.img	modifyBannerImg.img	2023-10-05 11:59:06.214767+09	000000
28	4	5	6	십번유저의 동아리	이번유저의 동아리입니다	t	clubProfile.img	clubBanner.img	2023-10-05 14:44:45.032288+09	000000
\.


--
-- Data for Name: join_request_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.join_request_tb (id, account_id, club_id, created_at) FROM stdin;
\.


--
-- Data for Name: major_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.major_tb (id, name) FROM stdin;
0	기계공학과
1	항공우주공학과
2	조선해양공학과
3	산업경영공학과
4	화학공학과
5	고분자공학과
6	신소재공학과
7	사회인프라공학과
8	환경공학과
9	공간정보공학과
10	건축공학과
11	건축학과
12	에너지자원공학과
13	전기공학과
14	전자공학과
15	정보통신공학과
16	반도체시스템공학과
17	수학과
18	통계학과
19	물리학과
20	화학과
21	해양과학과
22	식품영양학과
23	경영학과
24	글로벌금융학과
25	아태물류학부
26	국제통상학과
27	국어교육과
28	영어교육과
29	사회교육과
30	체육교육과
31	교육학과
32	수학교육과
33	행정학과
34	정치외교학과
35	미디어커뮤니케이션학과
36	경제학과
37	소비자학과
38	아동심리학과
39	사회복지학과
40	한국어문학과
41	사학과
42	철학과
43	중국학과
44	일본언어문화학과
45	영어영문학과
46	프랑스언어문화학과
47	문화콘텐츠문화경영학과
48	의예과
49	간호학과
50	메카트로닉스공학과
51	소프트웨어융합공학과
52	산업경영학과
53	금융투자학과
54	조형예술학과
55	디자인융합학과
56	스포츠과학과
57	연극영화학과
58	의류디자인학과
59	메카트로닉스공학과
60	산업경영학과
61	금융투자학과
62	반도체산업융합학과
63	인공지능공학과
64	데이터사이언스학과
65	스마트모빌리티공학과
66	디자인테크놀로지학과
67	컴퓨터공학과
68	생명공학과
69	생명과학과
\.


--
-- Data for Name: notice_comment_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.notice_comment_tb (id, account_id, notice_post_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: notice_post_img_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.notice_post_img_tb (id, post_id, post_img, create_at) FROM stdin;
\.


--
-- Data for Name: notice_post_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.notice_post_tb (id, account_id, club_id, title, content, is_fixed, created_at) FROM stdin;
\.


--
-- Data for Name: notice_reply_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.notice_reply_tb (id, account_id, notice_comment_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: position_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.position_tb (id, name) FROM stdin;
0	회장
1	운영진
2	부원
\.


--
-- Data for Name: post_img_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.post_img_tb (id, post_id, post_img, created_at) FROM stdin;
\.


--
-- Data for Name: promotion_comment_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.promotion_comment_tb (id, account_id, pr_post_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: promotion_post_img_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.promotion_post_img_tb (id, post_id, post_img, create_at) FROM stdin;
\.


--
-- Data for Name: promotion_post_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.promotion_post_tb (id, club_id, title, content, created_at) FROM stdin;
\.


--
-- Data for Name: promotion_reply_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.promotion_reply_tb (id, account_id, pr_comment_id, content, created_at) FROM stdin;
\.


--
-- Data for Name: small_category_tb; Type: TABLE DATA; Schema: public; Owner: ju
--

COPY public.small_category_tb (id, name) FROM stdin;
0	기악
1	밴드
2	연극/뮤지컬
3	무용
4	노래/합창
5	기타
6	(어학)
7	어학
8	경제/사회
9	순수과학
10	기계/설비
11	SW/IT
12	역사/문화
13	(사회)
14	사회
15	종교
16	예술/공예
17	미디어
18	문학
19	무예
20	구기
21	레저
22	동물
23	아동/학생
24	기타
\.


--
-- Name: account_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.account_tb_id_seq', 12, true);


--
-- Name: belong_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.belong_tb_id_seq', 1, false);


--
-- Name: big_category_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.big_category_tb_id_seq', 1, false);


--
-- Name: club_board_tb_club_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_board_tb_club_id_seq', 1, false);


--
-- Name: club_board_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_board_tb_id_seq', 1, false);


--
-- Name: club_comment_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_comment_tb_account_id_seq', 1, false);


--
-- Name: club_comment_tb_club_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_comment_tb_club_post_id_seq', 1, false);


--
-- Name: club_comment_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_comment_tb_id_seq', 1, false);


--
-- Name: club_member_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_member_tb_account_id_seq', 1, false);


--
-- Name: club_member_tb_club_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_member_tb_club_id_seq', 1, false);


--
-- Name: club_member_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_member_tb_id_seq', 35, true);


--
-- Name: club_post_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_post_tb_account_id_seq', 1, false);


--
-- Name: club_post_tb_club_board_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_post_tb_club_board_id_seq', 1, false);


--
-- Name: club_post_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_post_tb_id_seq', 1, false);


--
-- Name: club_reply_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_reply_tb_account_id_seq', 1, false);


--
-- Name: club_reply_tb_club_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_reply_tb_club_comment_id_seq', 1, false);


--
-- Name: club_reply_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_reply_tb_id_seq', 1, false);


--
-- Name: club_tb_belong_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_tb_belong_seq', 1, false);


--
-- Name: club_tb_big_category_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_tb_big_category_seq', 1, false);


--
-- Name: club_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_tb_id_seq', 28, true);


--
-- Name: club_tb_small_category_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.club_tb_small_category_seq', 1, false);


--
-- Name: join_request_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.join_request_tb_account_id_seq', 1, false);


--
-- Name: join_request_tb_club_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.join_request_tb_club_id_seq', 1, false);


--
-- Name: join_request_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.join_request_tb_id_seq', 24, true);


--
-- Name: notice_comment_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_comment_tb_account_id_seq', 1, false);


--
-- Name: notice_comment_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_comment_tb_id_seq', 1, false);


--
-- Name: notice_comment_tb_notice_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_comment_tb_notice_post_id_seq', 1, false);


--
-- Name: notice_post_img_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_post_img_tb_id_seq', 1, false);


--
-- Name: notice_post_img_tb_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_post_img_tb_post_id_seq', 1, false);


--
-- Name: notice_post_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_post_tb_account_id_seq', 1, false);


--
-- Name: notice_post_tb_club_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_post_tb_club_id_seq', 1, false);


--
-- Name: notice_post_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_post_tb_id_seq', 8, true);


--
-- Name: notice_reply_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_reply_tb_account_id_seq', 1, false);


--
-- Name: notice_reply_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_reply_tb_id_seq', 1, false);


--
-- Name: notice_reply_tb_notice_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.notice_reply_tb_notice_comment_id_seq', 1, false);


--
-- Name: position_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.position_tb_id_seq', 1, false);


--
-- Name: post_img_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.post_img_tb_id_seq', 1, false);


--
-- Name: post_img_tb_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.post_img_tb_post_id_seq', 1, false);


--
-- Name: promotion_comment_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_comment_tb_account_id_seq', 1, false);


--
-- Name: promotion_comment_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_comment_tb_id_seq', 1, false);


--
-- Name: promotion_comment_tb_pr_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_comment_tb_pr_post_id_seq', 1, false);


--
-- Name: promotion_post_img_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_post_img_tb_id_seq', 1, false);


--
-- Name: promotion_post_img_tb_post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_post_img_tb_post_id_seq', 1, false);


--
-- Name: promotion_post_tb_club_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_post_tb_club_id_seq', 1, false);


--
-- Name: promotion_post_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_post_tb_id_seq', 1, false);


--
-- Name: promotion_reply_tb_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_reply_tb_account_id_seq', 1, false);


--
-- Name: promotion_reply_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_reply_tb_id_seq', 1, false);


--
-- Name: promotion_reply_tb_pr_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.promotion_reply_tb_pr_comment_id_seq', 1, false);


--
-- Name: small_category_tb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: ju
--

SELECT pg_catalog.setval('public.small_category_tb_id_seq', 1, false);


--
-- Name: account_tb account_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.account_tb
    ADD CONSTRAINT account_tb_pkey PRIMARY KEY (id);


--
-- Name: belong_tb belong_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.belong_tb
    ADD CONSTRAINT belong_tb_pkey PRIMARY KEY (id);


--
-- Name: big_category_tb big_category_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.big_category_tb
    ADD CONSTRAINT big_category_tb_pkey PRIMARY KEY (id);


--
-- Name: club_board_tb club_board_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_board_tb
    ADD CONSTRAINT club_board_tb_pkey PRIMARY KEY (id);


--
-- Name: club_comment_tb club_comment_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb
    ADD CONSTRAINT club_comment_tb_pkey PRIMARY KEY (id);


--
-- Name: club_member_tb club_member_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb
    ADD CONSTRAINT club_member_tb_pkey PRIMARY KEY (id);


--
-- Name: club_post_tb club_post_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb
    ADD CONSTRAINT club_post_tb_pkey PRIMARY KEY (id);


--
-- Name: club_reply_tb club_reply_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb
    ADD CONSTRAINT club_reply_tb_pkey PRIMARY KEY (id);


--
-- Name: club_tb club_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb
    ADD CONSTRAINT club_tb_pkey PRIMARY KEY (id);


--
-- Name: join_request_tb join_request_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb
    ADD CONSTRAINT join_request_tb_pkey PRIMARY KEY (id);


--
-- Name: major_tb major_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.major_tb
    ADD CONSTRAINT major_tb_pkey PRIMARY KEY (id);


--
-- Name: notice_comment_tb notice_comment_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb
    ADD CONSTRAINT notice_comment_tb_pkey PRIMARY KEY (id);


--
-- Name: notice_post_img_tb notice_post_img_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_img_tb
    ADD CONSTRAINT notice_post_img_tb_pkey PRIMARY KEY (id);


--
-- Name: notice_post_tb notice_post_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb
    ADD CONSTRAINT notice_post_tb_pkey PRIMARY KEY (id);


--
-- Name: notice_reply_tb notice_reply_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb
    ADD CONSTRAINT notice_reply_tb_pkey PRIMARY KEY (id);


--
-- Name: position_tb position_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.position_tb
    ADD CONSTRAINT position_tb_pkey PRIMARY KEY (id);


--
-- Name: post_img_tb post_img_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.post_img_tb
    ADD CONSTRAINT post_img_tb_pkey PRIMARY KEY (id);


--
-- Name: promotion_comment_tb promotion_comment_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb
    ADD CONSTRAINT promotion_comment_tb_pkey PRIMARY KEY (id);


--
-- Name: promotion_post_img_tb promotion_post_img_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_img_tb
    ADD CONSTRAINT promotion_post_img_tb_pkey PRIMARY KEY (id);


--
-- Name: promotion_post_tb promotion_post_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_tb
    ADD CONSTRAINT promotion_post_tb_pkey PRIMARY KEY (id);


--
-- Name: promotion_reply_tb promotion_reply_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_reply_tb
    ADD CONSTRAINT promotion_reply_tb_pkey PRIMARY KEY (id);


--
-- Name: small_category_tb small_category_tb_pkey; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.small_category_tb
    ADD CONSTRAINT small_category_tb_pkey PRIMARY KEY (id);


--
-- Name: account_tb unique_account_tb_email; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.account_tb
    ADD CONSTRAINT unique_account_tb_email UNIQUE (email);


--
-- Name: club_tb unique_club_tb_name; Type: CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb
    ADD CONSTRAINT unique_club_tb_name UNIQUE (name);


--
-- Name: club_comment_tb fk_account_tb_to_club_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb
    ADD CONSTRAINT fk_account_tb_to_club_comment_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: club_member_tb fk_account_tb_to_club_member_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb
    ADD CONSTRAINT fk_account_tb_to_club_member_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: club_post_tb fk_account_tb_to_club_post_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb
    ADD CONSTRAINT fk_account_tb_to_club_post_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: club_reply_tb fk_account_tb_to_club_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb
    ADD CONSTRAINT fk_account_tb_to_club_reply_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: join_request_tb fk_account_tb_to_join_request_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb
    ADD CONSTRAINT fk_account_tb_to_join_request_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: notice_comment_tb fk_account_tb_to_notice_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb
    ADD CONSTRAINT fk_account_tb_to_notice_comment_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: notice_post_tb fk_account_tb_to_notice_post_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb
    ADD CONSTRAINT fk_account_tb_to_notice_post_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: notice_reply_tb fk_account_tb_to_notice_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb
    ADD CONSTRAINT fk_account_tb_to_notice_reply_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: promotion_comment_tb fk_account_tb_to_promotion_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb
    ADD CONSTRAINT fk_account_tb_to_promotion_comment_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: promotion_reply_tb fk_account_tb_to_promotion_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_reply_tb
    ADD CONSTRAINT fk_account_tb_to_promotion_reply_tb FOREIGN KEY (account_id) REFERENCES public.account_tb(id) ON DELETE CASCADE;


--
-- Name: club_tb fk_belong_tb_to_club_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb
    ADD CONSTRAINT fk_belong_tb_to_club_tb FOREIGN KEY (belong) REFERENCES public.belong_tb(id) ON DELETE CASCADE;


--
-- Name: club_tb fk_big_category_tb_to_club_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb
    ADD CONSTRAINT fk_big_category_tb_to_club_tb FOREIGN KEY (big_category) REFERENCES public.big_category_tb(id) ON DELETE CASCADE;


--
-- Name: club_post_tb fk_club_board_tb_to_club_post_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_post_tb
    ADD CONSTRAINT fk_club_board_tb_to_club_post_tb FOREIGN KEY (club_board_id) REFERENCES public.club_board_tb(id) ON DELETE CASCADE;


--
-- Name: club_reply_tb fk_club_comment_tb_to_club_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_reply_tb
    ADD CONSTRAINT fk_club_comment_tb_to_club_reply_tb FOREIGN KEY (club_comment_id) REFERENCES public.club_comment_tb(id) ON DELETE CASCADE;


--
-- Name: club_comment_tb fk_club_post_tb_to_club_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_comment_tb
    ADD CONSTRAINT fk_club_post_tb_to_club_comment_tb FOREIGN KEY (club_post_id) REFERENCES public.club_post_tb(id) ON DELETE CASCADE;


--
-- Name: post_img_tb fk_club_post_tb_to_post_img_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.post_img_tb
    ADD CONSTRAINT fk_club_post_tb_to_post_img_tb FOREIGN KEY (post_id) REFERENCES public.club_post_tb(id) ON DELETE CASCADE;


--
-- Name: club_board_tb fk_club_tb_to_club_board_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_board_tb
    ADD CONSTRAINT fk_club_tb_to_club_board_tb FOREIGN KEY (club_id) REFERENCES public.club_tb(id) ON DELETE CASCADE;


--
-- Name: club_member_tb fk_club_tb_to_club_member_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb
    ADD CONSTRAINT fk_club_tb_to_club_member_tb FOREIGN KEY (club_id) REFERENCES public.club_tb(id) ON DELETE CASCADE;


--
-- Name: join_request_tb fk_club_tb_to_join_request_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.join_request_tb
    ADD CONSTRAINT fk_club_tb_to_join_request_tb FOREIGN KEY (club_id) REFERENCES public.club_tb(id) ON DELETE CASCADE;


--
-- Name: notice_post_tb fk_club_tb_to_notice_post_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_tb
    ADD CONSTRAINT fk_club_tb_to_notice_post_tb FOREIGN KEY (club_id) REFERENCES public.club_tb(id) ON DELETE CASCADE;


--
-- Name: promotion_post_tb fk_club_tb_to_promotion_post_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_tb
    ADD CONSTRAINT fk_club_tb_to_promotion_post_tb FOREIGN KEY (club_id) REFERENCES public.club_tb(id) ON DELETE CASCADE;


--
-- Name: account_tb fk_major_tb_to_account_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.account_tb
    ADD CONSTRAINT fk_major_tb_to_account_tb FOREIGN KEY (major) REFERENCES public.major_tb(id) ON DELETE CASCADE;


--
-- Name: notice_reply_tb fk_notice_comment_tb_to_notice_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_reply_tb
    ADD CONSTRAINT fk_notice_comment_tb_to_notice_reply_tb FOREIGN KEY (notice_comment_id) REFERENCES public.notice_comment_tb(id) ON DELETE CASCADE;


--
-- Name: notice_comment_tb fk_notice_post_tb_to_notice_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_comment_tb
    ADD CONSTRAINT fk_notice_post_tb_to_notice_comment_tb FOREIGN KEY (notice_post_id) REFERENCES public.notice_post_tb(id) ON DELETE CASCADE;


--
-- Name: notice_post_img_tb fk_notice_post_tb_to_notice_post_img_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.notice_post_img_tb
    ADD CONSTRAINT fk_notice_post_tb_to_notice_post_img_tb FOREIGN KEY (post_id) REFERENCES public.notice_post_tb(id) ON DELETE CASCADE;


--
-- Name: club_member_tb fk_position_tb_to_club_member_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_member_tb
    ADD CONSTRAINT fk_position_tb_to_club_member_tb FOREIGN KEY ("position") REFERENCES public.position_tb(id);


--
-- Name: promotion_reply_tb fk_promotion_comment_tb_to_promotion_reply_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_reply_tb
    ADD CONSTRAINT fk_promotion_comment_tb_to_promotion_reply_tb FOREIGN KEY (pr_comment_id) REFERENCES public.promotion_comment_tb(id) ON DELETE CASCADE;


--
-- Name: promotion_comment_tb fk_promotion_post_tb_to_promotion_comment_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_comment_tb
    ADD CONSTRAINT fk_promotion_post_tb_to_promotion_comment_tb FOREIGN KEY (pr_post_id) REFERENCES public.promotion_post_tb(id) ON DELETE CASCADE;


--
-- Name: promotion_post_img_tb fk_promotion_post_tb_to_promotion_post_img_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.promotion_post_img_tb
    ADD CONSTRAINT fk_promotion_post_tb_to_promotion_post_img_tb FOREIGN KEY (post_id) REFERENCES public.promotion_post_tb(id) ON DELETE CASCADE;


--
-- Name: club_tb fk_small_category_tb_to_club_tb; Type: FK CONSTRAINT; Schema: public; Owner: ju
--

ALTER TABLE ONLY public.club_tb
    ADD CONSTRAINT fk_small_category_tb_to_club_tb FOREIGN KEY (small_category) REFERENCES public.small_category_tb(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--
