create extension if not exists pgcrypto;

create table if not exists users (
        id  serial primary key,
    mail varchar not null unique,
    name varchar not null,
    pass varchar not null
);

insert into users ("name", "mail", "pass") values
    ('alice', 'alice@shoshi.dog', crypt('a123', gen_salt('bf', 8))),
    ('bob'  , 'bob@shoshi.dog'  , crypt('2123', gen_salt('bf', 8)));