-- Create tasks table
create table if not exists public.tasks (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    description text,
    scheduled_date date not null,
    scheduled_time text default 'Cualquier hora',
    completed boolean default false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policies
create policy "Users can manage their own tasks"
    on public.tasks for all
    using ( auth.uid() = user_id );
