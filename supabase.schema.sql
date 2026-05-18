create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  role text not null check (role in ('employee', 'manager', 'admin')),
  title text,
  department text,
  manager_id uuid references public.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id),
  title text not null,
  description text not null,
  metric text not null,
  weight integer not null check (weight >= 10 and weight <= 100),
  progress integer not null default 0 check (progress >= 0 and progress <= 100),
  status text not null check (status in ('draft', 'submitted', 'approved', 'rejected', 'locked')),
  due_date date not null,
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.approvals (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id),
  manager_id uuid not null references public.users(id),
  decision text not null check (decision in ('approved', 'rejected')),
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.checkins (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid not null references public.goals(id),
  quarter text not null,
  achievement text not null,
  confidence integer not null check (confidence >= 0 and confidence <= 100),
  status text not null check (status in ('not_started', 'in_progress', 'submitted', 'reviewed')),
  manager_comment text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id),
  title text not null,
  body text not null,
  type text not null check (type in ('approval', 'reminder', 'comment', 'system')),
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references public.users(id),
  action text not null,
  target text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table if not exists public.escalations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.users(id),
  manager_id uuid not null references public.users(id),
  reason text not null check (reason in ('overdue_approval', 'overdue_checkin')),
  severity text not null check (severity in ('low', 'medium', 'high')),
  days_open integer not null default 0,
  status text not null check (status in ('open', 'monitoring', 'resolved')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.goals enable row level security;
alter table public.approvals enable row level security;
alter table public.checkins enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;
alter table public.escalations enable row level security;
