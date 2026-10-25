-- Credenciales de proveedores (cifradas por la app con AES-256-GCM antes de guardarse)
create table public.provider_credentials (
  provider text primary key,
  encrypted jsonb not null,
  saved_at timestamptz not null default now()
);

-- Influencers (paso 1)
create table public.influencers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  notes text,
  base_image_url text,
  created_at timestamptz not null default now()
);

-- Análisis visual / archivo de conocimiento del system prompt (paso 2)
create table public.influencer_analyses (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencers(id) on delete cascade,
  source_image_url text,
  analysis text not null,
  created_at timestamptz not null default now()
);

-- Imágenes: base, ángulos de consistencia y contenido lifestyle (pasos 1 y 3)
create table public.influencer_images (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencers(id) on delete cascade,
  kind text not null check (kind in ('base', 'angle', 'lifestyle')),
  url text not null,
  prompt text,
  reference_url text,
  created_at timestamptz not null default now()
);

-- Videos animados con frame inicial y final (paso 4)
create table public.influencer_videos (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencers(id) on delete cascade,
  provider text not null,
  prompt text,
  start_frame_url text,
  end_frame_url text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'done', 'failed')),
  result_url text,
  created_at timestamptz not null default now()
);

create index on public.influencer_analyses (influencer_id);
create index on public.influencer_images (influencer_id, kind);
create index on public.influencer_videos (influencer_id);

-- Solo el servidor (service role) accede; sin políticas = sin acceso desde el navegador.
alter table public.provider_credentials enable row level security;
alter table public.influencers enable row level security;
alter table public.influencer_analyses enable row level security;
alter table public.influencer_images enable row level security;
alter table public.influencer_videos enable row level security;
