-- Step 1: keep partner records accessible only through server-side service-role routes.
alter table public.partners enable row level security;

drop policy if exists "Allow public select" on public.partners;
drop policy if exists "Allow public insert" on public.partners;

revoke all privileges on table public.partners from anon;
revoke all privileges on table public.partners from authenticated;

