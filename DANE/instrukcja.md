# Instrukcja Konfiguracji i Uruchamiania Velvet (Windows)

Ta instrukcja pozwoli Ci przygotować aplikację Velvet na nowym komputerze, tak aby była gotowa do pracy po jednym kliknięciu.

## 1. Wymagania Wstępne (Jednorazowo)

Zanim uruchomisz skrypt, upewnij się, że na komputerze są zainstalowane poniższe narzędzia:

1.  **Node.js (LTS)**:
    *   Pobierz i zainstaluj z: [nodejs.org](https://nodejs.org/en/download/) (wybierz wersję Recommended For Most Users).
2.  **Git**:
    *   Pobierz i zainstaluj z: [git-scm.com](https://git-scm.com/downloads).
    *   Podczas instalacji możesz zostawić wszystkie opcje domyślne.

## 2. Przygotowanie Projektu

1.  Skopiuj folder z projektem na komputer docelowy.
2.  **Ważne**: Upewnij się, że w folderze głównym znajduje się plik **.env.local**. Zawiera on klucze niezbędne do połączenia z bazą danych (Supabase).
3.  **Dostęp do GitHub (opcjonalnie)**:
    *   Jeśli repozytorium jest prywatne, otwórz terminal (PowerShell) w folderze projektu i wpisz `git pull`. System poprosi o zalogowanie się do GitHub. Zrób to raz, aby system zapamiętał dane logowania.

## 3. Uruchamianie Aplikacji

Aby uruchomić aplikację, wystarczy wykonać **dwukrotne kliknięcie** na pliku:

### **`start_velvet.bat`**

Po jego uruchomieniu otworzy się czarne okno terminala, które automatycznie:
1.  Sprawdzi i pobierze najnowsze aktualizacje z GitHub.
2.  Zainstaluje/zaktualizuje niezbędne biblioteki.
3.  Uruchomi serwer Velvet.
4.  **Otworzy przeglądarkę** pod adresem `http://localhost:3000` (po ok. 8-10 sekundach).

---

## Rozwiązywanie Problemów

*   **Błąd "npm not recognized"**: Uruchom ponownie komputer po instalacji Node.js.
*   **Brak danych w aplikacji**: Sprawdź, czy plik `.env.local` jest poprawnie wypełniony.
*   **Aplikacja nie startuje automatycznie**: Jeśli przeglądarka się nie otworzy, wpisz ręcznie w pasku adresu: `http://localhost:3000`.

---
*Instrukcja przygotowana dla aplikacji Velvet - v1.0*
