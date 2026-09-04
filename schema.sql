-- Ressonância RPG — schema do Supabase (Postgres), COM autenticação real
-- Rodar isso no SQL Editor do seu projeto Supabase (dashboard.supabase.com > SQL Editor > New query)

create table if not exists public.personagens (
  id uuid primary key default gen_random_uuid(),
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade,
  nome text not null,
  origem_id text not null,
  classe_id text not null,
  nivel int not null default 1,
  -- a ficha inteira (atributos, aplicações, ledgers, inventário) fica num único JSON —
  -- mais simples de evoluir enquanto o sistema de regras ainda está mudando toda semana.
  ficha jsonb not null
);

create index if not exists personagens_user_id_idx on public.personagens(user_id);

-- Row Level Security: cada jogador só vê e mexe nos PRÓPRIOS personagens.
alter table public.personagens enable row level security;

create policy "Cada um vê só os próprios personagens" on public.personagens
  for select using (auth.uid() = user_id);

create policy "Cada um cria personagem pra si mesmo" on public.personagens
  for insert with check (auth.uid() = user_id);

create policy "Cada um edita só os próprios personagens" on public.personagens
  for update using (auth.uid() = user_id);

create policy "Cada um apaga só os próprios personagens" on public.personagens
  for delete using (auth.uid() = user_id);
