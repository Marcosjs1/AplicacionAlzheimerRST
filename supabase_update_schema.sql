-- 1. Agregar columnas faltantes a profiles
alter table public.profiles 
add column if not exists phone text,
add column if not exists avatar_url text;

-- 2. Actualizar la función del Trigger para incluir el teléfono
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, birth_date, phone, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'role',
    (new.raw_user_meta_data ->> 'birth_date')::date,
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;
