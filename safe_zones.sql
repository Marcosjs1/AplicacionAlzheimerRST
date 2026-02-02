-- Tabla safe_zones
create table if not exists public.safe_zones (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references auth.users(id) on delete cascade,
  caregiver_id uuid not null references auth.users(id) on delete cascade,
  center_lat double precision not null,
  center_lng double precision not null,
  radius_meters integer not null default 200,
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Habilitar RLS
alter table public.safe_zones enable row level security;

-- Policies

-- 1. Cuidador puede ver las safe_zones de sus pacientes vinculados
create policy "Caregiver can select safe_zones for linked patients"
on public.safe_zones for select
to authenticated
using (
  exists (
    select 1 from public.caregiver_links
    where public.caregiver_links.caregiver_id = auth.uid()
    and public.caregiver_links.patient_id = public.safe_zones.patient_id
  )
);

-- 2. Cuidador puede insertar safe_zones para sus pacientes vinculados
create policy "Caregiver can insert safe_zones for linked patients"
on public.safe_zones for insert
to authenticated
with check (
  exists (
    select 1 from public.caregiver_links
    where public.caregiver_links.caregiver_id = auth.uid()
    and public.caregiver_links.patient_id = public.safe_zones.patient_id
  )
);

-- 3. Cuidador puede actualizar safe_zones para sus pacientes vinculados
create policy "Caregiver can update safe_zones for linked patients"
on public.safe_zones for update
to authenticated
using (
  exists (
    select 1 from public.caregiver_links
    where public.caregiver_links.caregiver_id = auth.uid()
    and public.caregiver_links.patient_id = public.safe_zones.patient_id
  )
);

-- 4. Paciente puede ver SU propia safe_zone
create policy "Patient can view their own safe_zone"
on public.safe_zones for select
to authenticated
using (
  patient_id = auth.uid()
);

-- Comentarios
COMMENT ON TABLE public.safe_zones IS 'Zonas seguras definidas por cuidadores para pacientes.';
