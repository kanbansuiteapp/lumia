-- Multiusuario: cada modelo y cada credencial pertenece a un usuario de Supabase Auth.
alter table public.influencers
  add column user_id uuid references auth.users(id) on delete cascade;
create index on public.influencers (user_id);

alter table public.provider_credentials drop constraint provider_credentials_pkey;
alter table public.provider_credentials
  add column id uuid primary key default gen_random_uuid(),
  add column user_id uuid references auth.users(id) on delete cascade,
  add constraint provider_credentials_user_provider_key unique (user_id, provider);
