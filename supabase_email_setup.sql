-- 1. Funkcja do bezpiecznego pobierania emaila z auth.users
-- Używamy SECURITY DEFINER, aby móc odczytać tabelę auth, która jest chroniona.
CREATE OR REPLACE FUNCTION public.get_user_email(user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT email FROM auth.users WHERE id = user_id);
END;
$$;

-- 2. Nadanie uprawnień do wykonywania funkcji (tylko dla zalogowanych użytkowników lub systemowych ról)
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_email(uuid) TO service_role;

-- 3. (Opcjonalnie) Logika powiadomień - dodanie komentarza, co należy skonfigurować w panelu Supabase Webhooks
/*
Aby podpiąć powiadomienia email, musisz w panelu Supabase (Database -> Webhooks):
- Nazwa: send_notification_email
- Tabela: notifications
- Event: INSERT
- Typ: Edge Function
- Funkcja: send-notification-email
*/
