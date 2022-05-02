CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  nickname TEXT,
  about_me TEXT,
  other_media TEXT,
  pokemon_tag TEXT,
  profile_pic TEXT,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE adminUsers (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  iterations INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
  roleID INTEGER PRIMARY KEY ,
  roleName TEXT NOT NULL
);