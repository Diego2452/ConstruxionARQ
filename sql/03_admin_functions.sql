-- ── Correr en Supabase → SQL Editor ────────────────────────
-- Permite listar todos los usuarios admin desde el cliente
-- (solo usuarios autenticados pueden llamarla)

CREATE OR REPLACE FUNCTION get_admin_users()
RETURNS TABLE(
  id             UUID,
  email          TEXT,
  created_at     TIMESTAMPTZ,
  last_sign_in   TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
    SELECT
      au.id,
      au.email::TEXT,
      au.created_at,
      au.last_sign_in_at
    FROM auth.users au
    ORDER BY au.created_at ASC;
END;
$$;

-- Solo usuarios autenticados pueden llamarla
GRANT EXECUTE ON FUNCTION get_admin_users() TO authenticated;
