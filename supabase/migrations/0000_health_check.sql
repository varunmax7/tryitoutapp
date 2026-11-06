-- 0000_health_check.sql — infrastructure only, not part of the data model (§9 starts at 0001).
--
-- The daily keep-alive job (§19 step 8) calls the `health` Edge Function, which calls this
-- function. That round trip is what stops a Supabase Free project pausing after a quiet
-- week. It returns no user data and is callable only with the service role.

create or replace function public.health_check()
returns timestamptz
language sql
stable
security invoker
set search_path = ''
as $$
  select now();
$$;

revoke all on function public.health_check() from public;
revoke all on function public.health_check() from anon;
revoke all on function public.health_check() from authenticated;
grant execute on function public.health_check() to service_role;
