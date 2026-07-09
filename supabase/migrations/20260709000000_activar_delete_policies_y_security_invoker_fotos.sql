-- Cierra los 2 hallazgos criticos de FASE1-BARRIDO-2026-07-08 (seccion "migraciones"):
--
-- 1. Las 9 policies FOR DELETE creadas en 20260704000002 estaban inertes: nunca se
--    otorgo el GRANT DELETE subyacente a authenticated, y Postgres rechaza el DELETE
--    por privilegios antes de evaluar la policy. Las policies ya restringen por rol
--    (es_admin() o estados anulados via es_terapeuta_o_admin()), este GRANT solo las
--    vuelve efectivas -- la autorizacion real sigue viviendo en la policy.
--
-- 2. vista_finanzas_fotos_auditoria (20260704000001) era la unica vista del proyecto
--    sin security_invoker=true: corria con privilegios del owner (bypass de RLS de
--    tablas base) y su unica barrera era el WHERE es_finanzas_o_admin() hardcodeado.
--    Se alinea al patron de doble capa del resto de las vistas, con el revoke
--    explicito que tambien le faltaba.

grant delete on table
  public.pacientes,
  public.consultas,
  public.evaluaciones,
  public.casos,
  public.elementos_caso,
  public.revisiones,
  public.trabajos,
  public.cobros,
  public.pagos
to authenticated;

alter view public.vista_finanzas_fotos_auditoria set (security_invoker = true);

revoke all privileges on table public.vista_finanzas_fotos_auditoria from public;
revoke all privileges on table public.vista_finanzas_fotos_auditoria from anon;
revoke all privileges on table public.vista_finanzas_fotos_auditoria from authenticated;

grant select on table public.vista_finanzas_fotos_auditoria to authenticated;
