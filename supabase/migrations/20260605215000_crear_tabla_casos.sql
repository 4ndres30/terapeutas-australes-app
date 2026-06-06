select
    tgname as nombre_trigger,
    tgenabled as estado,
    pg_get_triggerdef(oid) as definicion
from pg_trigger
where tgrelid = 'public.casos'::regclass
  and not tgisinternal;