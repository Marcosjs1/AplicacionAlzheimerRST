-- Tabla geofence_events
create table if not exists public.geofence_events (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null check (event_type in ('ENTER', 'EXIT')),
  lat double precision,
  lng double precision,
  triggered_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table public.geofence_events enable row level security;

-- Habilitar Realtime para esta tabla (IMPORTANTE para la alerta)
alter publication supabase_realtime add table public.geofence_events;

-- Policies

-- 1. Paciente puede ver (e insertar si lo hiciera via API directa, aunque usaremos Edge Function)
-- Pero para Realtime necesitamos que el Cuidador pueda leer (SELECT)
create policy "Patient can insert/view own events"
on public.geofence_events for all
to authenticated
using (patient_id = auth.uid())
with check (patient_id = auth.uid());

-- 2. Cuidador puede ver eventos de sus pacientes vinculados
create policy "Caregiver can view linked patient events"
on public.geofence_events for select
to authenticated
using (
  exists (
    select 1 from public.caregiver_links
    where public.caregiver_links.caregiver_id = auth.uid()
    and public.caregiver_links.patient_id = public.geofence_events.patient_id
  )
);

-- Comentarios
COMMENT ON TABLE public.geofence_events IS 'Log de entradas y salidas de zonas seguras.';
