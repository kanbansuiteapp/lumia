-- Modelos: descripción, prompt de apariencia (resultado del análisis) y cara de referencia
alter table public.influencers
  add column description text,
  add column prompt text,
  add column face_image_id uuid;

-- Colecciones de contenido lifestyle
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  influencer_id uuid not null references public.influencers(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);
alter table public.collections enable row level security;
create index on public.collections (influencer_id);

alter table public.influencer_images
  add column collection_id uuid references public.collections(id) on delete set null,
  add column angle text check (angle in ('frontal', 'tres_cuartos', 'perfil'));

alter table public.influencers
  add constraint influencers_face_fk foreign key (face_image_id) references public.influencer_images(id) on delete set null;
