-- =========================================================
-- SEventsHub - Auth → Profile auto-creation trigger
-- =========================================================
-- Goal:
-- Automatically create a public.profiles row whenever a new
-- Supabase auth user is created.
--
-- Notes:
-- - Default platform_role is 'sponsor' for safety.
-- - We can update role during onboarding right after signup.
-- - Metadata keys are optional and safely handled.
-- =========================================================

begin;

-- ---------------------------------------------------------
-- Function: create a public profile after auth signup
-- ---------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    avatar_url,
    platform_role,
    is_active
  )
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name'
    ),
    new.raw_user_meta_data ->> 'avatar_url',
    coalesce(
      (new.raw_user_meta_data ->> 'platform_role')::platform_role,
      'sponsor'::platform_role
    ),
    true
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    raise log 'handle_new_user failed for auth.users.id=%: %', new.id, sqlerrm;
    return new;
end;
$$;

-- ---------------------------------------------------------
-- Trigger on auth.users
-- ---------------------------------------------------------
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

commit;