-- Run this in Supabase: Project -> SQL Editor -> New Query -> paste -> Run
-- Matches the ER diagram from your proposal (users, skin_profiles)

create table if not exists users (
  id            bigint generated always as identity primary key,
  name          varchar(255) not null,
  email         varchar(255) not null unique,
  password_hash varchar(255) not null,
  role          varchar(50) not null default 'customer',
  created_at    timestamp with time zone default now()
);

create table if not exists skin_profiles (
  id         bigint generated always as identity primary key,
  user_id    bigint not null unique references users(id) on delete cascade,
  skin_type  varchar(50) not null,
  concerns   jsonb default '[]',
  allergens  jsonb default '[]',
  created_at timestamp with time zone default now()
);
