-- Horsebow Scoring PWA schema
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

create table if not exists gear_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  bow_type text, bow_name text,
  draw_weight_lbs numeric, draw_length_in numeric,
  arrow_spine text, arrow_weight_gr numeric, arrow_point_gr numeric, arrow_material text,
  technique text, environment_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz,
  target_id text not null,
  distance_m numeric not null,
  lane text,
  gear_profile_id uuid references gear_profiles(id) on delete set null,
  environment_notes text,
  total_ends int not null,
  arrows_per_end int not null,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists session_arrows (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  end_index int not null,
  arrow_index int not null,
  value int,
  is_x boolean default false,
  is_miss boolean default false,
  updated_at timestamptz default now(),
  unique (session_id, end_index, arrow_index)
);

create index if not exists idx_gear_user on gear_profiles(user_id);
create index if not exists idx_sessions_user on sessions(user_id);
create index if not exists idx_arrows_session on session_arrows(session_id);

alter table profiles enable row level security;
alter table gear_profiles enable row level security;
alter table sessions enable row level security;
alter table session_arrows enable row level security;

drop policy if exists "own data" on profiles;
drop policy if exists "own gear" on gear_profiles;
drop policy if exists "own sess" on sessions;
drop policy if exists "own arr" on session_arrows;

create policy "own data" on profiles for all using (id = auth.uid()) with check (id = auth.uid());
create policy "own gear" on gear_profiles for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own sess" on sessions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "own arr" on session_arrows for all using (user_id = auth.uid()) with check (user_id = auth.uid());
