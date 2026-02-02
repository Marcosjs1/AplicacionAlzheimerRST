-- Trigger para crear perfil automáticamente al registrarse
-- Ejecuta esto en el Editor SQL de Supabase

-- 1. Función que se ejecuta cuando se crea un usuario en auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, birth_date)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'name',
    new.raw_user_meta_data ->> 'role',
    (new.raw_user_meta_data ->> 'birth_date')::date
  );
  return new;
end;
$$;

-- 2. El Trigger que dispara la función
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
