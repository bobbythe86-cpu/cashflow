-- Create milestones table
create table public.milestones (
    id uuid not null default gen_random_uuid(),
    code text not null,
    name text not null,
    description text not null,
    icon text not null,
    target_value integer not null default 1,
    category text not null, -- 'budget', 'savings', 'transaction', 'general'
    created_at timestamp with time zone not null default now(),
    constraint milestones_pkey primary key (id),
    constraint milestones_code_key unique (code)
);

-- Create user_milestones table to track progress
create table public.user_milestones (
    id uuid not null default gen_random_uuid(),
    user_id uuid not null,
    milestone_id uuid not null,
    current_value integer not null default 0,
    is_achieved boolean not null default false,
    achieved_at timestamp with time zone,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint user_milestones_pkey primary key (id),
    constraint user_milestones_user_id_fkey foreign key (user_id) references public.profiles(id) on delete cascade,
    constraint user_milestones_milestone_id_fkey foreign key (milestone_id) references public.milestones(id) on delete cascade,
    constraint user_milestones_user_milestone_unique unique (user_id, milestone_id)
);

-- Enable RLS
alter table public.milestones enable row level security;
alter table public.user_milestones enable row level security;

-- Policies for milestones (readable by everyone, manageable by admin - assuming admin logic exists but for now public read)
create policy "Milestones are viewable by everyone"
    on public.milestones for select
    using (true);

-- Policies for user_milestones
create policy "Users can view their own milestone progress"
    on public.user_milestones for select
    using (auth.uid() = user_id);

create policy "Users can update their own milestone progress" -- Usually system updates this, but for now allow user context update via server actions
    on public.user_milestones for update
    using (auth.uid() = user_id);

create policy "Users can insert their own milestone progress"
    on public.user_milestones for insert
    with check (auth.uid() = user_id);

-- Insert some default milestones
insert into public.milestones (code, name, description, icon, target_value, category) values
('first_transaction', 'Első Lépés', 'Hozz létre egy bevételt vagy kiadást!', 'Zap', 1, 'general'),
('saving_starter', 'Megtakarító', 'Hozz létre egy megtakarítási célt!', 'PiggyBank', 1, 'savings'),
('budget_master', 'Költségvetés Mester', 'Hozz létre 3 költségvetési kategóriát!', 'PieChart', 3, 'budget'),
('consistent_saver', 'Rendszeres Megtakarító', 'Érj el 3 megtakarítási célt!', 'Trophy', 3, 'savings');
