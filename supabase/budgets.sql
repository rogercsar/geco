-- Supabase budgets schema with RLS

-- Ensure needed extensions exist
create extension if not exists pgcrypto;

-- Table: budgets
create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  project_name text,
  client_name text,
  project_country text,
  project_state text,
  project_city text,
  project_type text,

  structure_type text,
  steps jsonb default '[]'::jsonb,
  rooms jsonb default '[]'::jsonb,

  materials jsonb default '[]'::jsonb,
  labor jsonb default '[]'::jsonb,
  materials_quantities jsonb default '{}'::jsonb,

  total_cost numeric(12,2) default 0,
  budget_type text,
  budget_mode text,
  status text default 'Ativo',

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.budgets enable row level security;

-- Policies
create policy "budgets_select_own" on public.budgets
  for select
  using (user_id = auth.uid());

create policy "budgets_insert_own" on public.budgets
  for insert
  with check (user_id = auth.uid());

create policy "budgets_update_own" on public.budgets
  for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "budgets_delete_own" on public.budgets
  for delete
  using (user_id = auth.uid());

-- Trigger: auto-update updated_at on update
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger set_timestamp
before update on public.budgets
for each row
execute function public.set_updated_at();