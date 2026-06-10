-- Tarot Journal initial schema (run in Supabase SQL Editor)

create table if not exists tarot_cards (
  id text primary key,
  name text not null,
  en_name text,
  number text,
  suit text not null,
  image_url text,
  upright_kw text,
  reversed_kw text,
  upright_meaning text,
  reversed_meaning text,
  love_meaning text,
  career_meaning text,
  money_meaning text,
  study_meaning text,
  social_meaning text,
  author_note text,
  real_expr text,
  mistakes text,
  tags jsonb default '[]'::jsonb,
  sort_order int not null default 0,
  created_at timestamptz default now()
);

create table if not exists user_card_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  card_id text not null references tarot_cards(id) on delete cascade,
  my_note text default '',
  real_expr text default '',
  mistakes text default '',
  updated_at timestamptz default now(),
  unique (user_id, card_id)
);

create table if not exists draws (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  question text default '',
  card_id text references tarot_cards(id),
  orientation text default '正位',
  interpretation text default '',
  event text default '',
  tags jsonb default '[]'::jsonb,
  need_review boolean default false,
  reviewed boolean default false,
  actual_event text default '',
  review_note text default '',
  accuracy text default '待验证',
  score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  client_code text default '',
  date date not null,
  theme text default '',
  q_type text default '感情',
  spread text default '',
  card_ids jsonb default '[]'::jsonb,
  interpretation text default '',
  feedback text default '',
  accuracy text default '待验证',
  score int default 0,
  tags jsonb default '[]'::jsonb,
  reviewed boolean default false,
  review_note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_draws_user_date on draws(user_id, date desc);
create index if not exists idx_cases_user_date on cases(user_id, date desc);
create index if not exists idx_user_card_notes_user on user_card_notes(user_id);

alter table tarot_cards enable row level security;
alter table user_card_notes enable row level security;
alter table draws enable row level security;
alter table cases enable row level security;

drop policy if exists "tarot_cards_read" on tarot_cards;
create policy "tarot_cards_read" on tarot_cards for select to authenticated using (true);

drop policy if exists "user_card_notes_all" on user_card_notes;
create policy "user_card_notes_all" on user_card_notes for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "draws_all" on draws;
create policy "draws_all" on draws for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "cases_all" on cases;
create policy "cases_all" on cases for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
