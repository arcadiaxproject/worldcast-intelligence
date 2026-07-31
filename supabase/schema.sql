-- Tabla de historial de conversaciones del chat RAG.
-- Ejecutar en Supabase: Project > SQL Editor > New query > pegar y ejecutar.

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  video_id text,
  question text not null,
  answer text not null,
  sources jsonb,
  ip text,
  created_at timestamptz not null default now()
);

create index if not exists conversations_created_at_idx on conversations (created_at desc);
create index if not exists conversations_video_id_idx on conversations (video_id);

-- RLS: activada por defecto (nadie puede leer ni escribir salvo que se permita
-- explícitamente). La API de chat inserta usando la clave pública (anon/publishable),
-- así que añadimos una política que solo permite INSERT, no SELECT/UPDATE/DELETE.
-- Así nadie puede leer las conversaciones de otros usuarios ni el historial completo
-- con esa clave, solo el propio servidor añadiendo filas nuevas.
alter table conversations enable row level security;

create policy "Allow inserts from the app"
  on conversations
  for insert
  to anon
  with check (true);

-- Permite leer el historial (sin esto no se podría traer las conversaciones
-- guardadas para mostrarlas de nuevo en el chat).
create policy "Allow reads from the app"
  on conversations
  for select
  to anon
  using (true);

-- Permite borrar el historial (botón "Vaciar conversación" en el chat).
create policy "Allow deletes from the app"
  on conversations
  for delete
  to anon
  using (true);
