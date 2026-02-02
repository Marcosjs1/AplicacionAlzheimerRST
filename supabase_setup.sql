-- Tabla para perfiles públicos de usuario
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  name text,
  role text, -- 'Usuario', 'Familiar', 'Cuidador'
  birth_date date,
  email text,
  avatar_url text,
  phone text
);

-- Configurar Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Permitir lectura (puedes restringirlo más si quieres)
create policy "Perfiles visibles por el usuario dueño"
  on profiles for select
  using ( auth.uid() = id );

-- Permitir inserción al registrarse
create policy "Usuarios pueden insertar su propio perfil"
  on profiles for insert
  with check ( auth.uid() = id );

-- Permitir actualización
create policy "Usuarios pueden editar su propio perfil"
  on profiles for update
  using ( auth.uid() = id );


-- Tabla para Progreso de Juegos
create table if not exists public.game_progress (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    game_type text not null, -- 'memory', 'attention', 'calc'
    score integer,
    details jsonb, -- estadísticas extra
    played_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.game_progress enable row level security;

create policy "Usuarios ven sus propios juegos"
    on public.game_progress for select
    using ( auth.uid() = user_id );

create policy "Usuarios guardan sus juegos"
    on public.game_progress for insert
    with check ( auth.uid() = user_id );

-- Tabla para Contactos/Cuidadores
create table if not exists public.contacts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    name text not null,
    phone text,
    relation text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.contacts enable row level security;

create policy "Usuarios gestionan sus contactos"
    on public.contacts for all
    using ( auth.uid() = user_id );
