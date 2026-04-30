# Dokumentacja Techniczna - VELVET (v1.5)

Ten dokument zawiera szczegółowy opis architektury, stosu technologicznego oraz specyfikacji funkcjonalnej projektu VELVET. Jest on przeznaczony dla nowych programistów dołączających do zespołu.

---

## 1. Project Overview & Mission

**VELVET** to ekosystem relacji nowej generacji, zaprojektowany jako bezpieczna, intymna przestrzeń cyfrowa dla par. Misją projektu jest wspieranie komunikacji, pielęgnowanie wspólnych wspomnień oraz proaktywne monitorowanie kondycji relacji.

**Główne filary VELVET:**
*   **Komunikacja (Safe Space):** Strukturalne rozwiązywanie konfliktów i trudnych tematów bez eskalacji emocji.
*   **Wspomnienia (Pamiętnik & Bucket List):** Kolekcjonowanie wspólnych chwil i planowanie marzeń w luksusowej oprawie.
*   **Monitoring (Dashboard):** Wizualizacja dynamiki związku za pomocą danych i inteligentnych sugestii (AI Insight).

---

## 2. Tech Stack & Architecture

Aplikacja została zbudowana w oparciu o nowoczesny, wysokowydajny stos technologiczny:

*   **Framework:** [Next.js 14](https://nextjs.org/) (App Router) – wykorzystanie Server Components dla wydajności i Client Components dla interaktywności.
*   **Język:** [TypeScript](https://www.typescriptlang.org/) – silne typowanie w całym projekcie, w tym automatycznie generowane typy z bazy danych.
*   **Stylizacja:** [Tailwind CSS](https://tailwindcss.com/) – system klas narzędziowych z dedykowanymi tokenami projektowymi (v-card, v-button).
*   **Backend & Baza Danych:** [Supabase](https://supabase.com/)
    *   **Auth:** Zarządzanie sesjami i uwierzytelnianiem.
    *   **PostgreSQL:** Relacyjna baza danych z precyzyjnym systemem RLS.
    *   **Storage:** Przechowywanie mediów (zdjęcia do Pamiętnika i Bucket Listy).
    *   **Realtime:** Synchronizacja powiadomień i statusów spraw w czasie rzeczywistym.

### Architektura Danych i Mutacji
*   **Server Actions:** Wszystkie operacje zapisu i edycji danych (mutacje) odbywają się poprzez asynchroniczne funkcje po stronie serwera (`src/lib/actions`).
*   **Model Bezpieczeństwa (RLS):** Każda tabela posiada polityki **Row Level Security**, które gwarantują, że użytkownicy mają dostęp wyłącznie do danych przypisanych do ich `couple_id`. Dane są izolowane na poziomie bazy danych.

---

## 3. Database Schema (ERD Description)

System opiera się na relacyjnym modelu, w którym kluczowym elementem jest parowanie użytkowników.

### Kluczowe Tabele:
| Tabela | Opis |
| :--- | :--- |
| `profiles` | Dane użytkownika (avatar, display_name) powiązane z `auth.users`. |
| `couples` | Definicja pary, posiada unikalny `pairing_code`. |
| `issues` | Centralny punkt Safe Space – zgłaszane sprawy, ich statusy i priorytety. |
| `issue_comments` | Wątki dyskusji pod konkretnymi sprawami. |
| `daily_metrics` | Codzienne odczucia partnerów (closeness, communication, intimacy, support). |
| `diary_entries` | Wpisy w pamiętniku z obsługą JSONB dla treści i linkami do Storage. |
| `bucket_list` | Cele i marzenia (indywidualne „Jej”, „Jego” oraz „Wspólne”). |
| `notifications` | System powiadomień systemowych i od partnera. |

> [!IMPORTANT]
> Kolumna `couple_id` występuje w niemal każdej tabeli i pełni rolę globalnego klucza parowania, umożliwiając łatwą filtrację danych w ramach jednej relacji.

---

## 4. Modules - Functional Specification

### Dashboard: System Metryk i AI
Centrum dowodzenia związkiem, oferujące:
*   **Wykres Radarowy:** Wizualizacja 5 kluczowych obszarów (Bliskość, Komunikacja, Wsparcie, Intymność, Czas). Dane pobierane z `daily_metrics`.
*   **Perception Gap:** Obliczany jako bezwzględna różnica między średnią ocen użytkownika a ocenami partnera z ostatnich 7 dni.
*   **AI Insight:** Silnik regułowy (w przyszłości LLM), który na podstawie danych generuje spersonalizowane wskazówki (np. sugestia rozmowy przy niskim poziomie komunikacji).

### Safe Space: Zarządzanie Trudnościami
System zaprojektowany tak, aby zredukować stres podczas rozmów:
*   **Steppery:** Zgłaszanie problemu w kilku krokach (Typ -> Treść -> Sugestia rozwiązania).
*   **Wspólne Ustalenia (Kontrakt):** Możliwość stworzenia finalnego porozumienia, które wymaga „podpisu” obu stron (flagi `signed_by_author` i `signed_by_recipient`).
*   **Safe Exit (Przycisk Przeciążenia):** Specjalny mechanizm pozwalający partnerowi na zgłoszenie emocjonalnego przeładowania, co uruchamia licznik odpoczynku (`overloaded_until`).

### Pamiętnik & Bucket List
*   **Elastyczne Treści:** Wykorzystanie pola `Json` w `diary_entries` pozwala na stosowanie różnych szablonów wpisów bez zmiany schematu bazy.
*   **Media:** Zdjęcia są uploadowane do `/storage/v1/object/public/diary-media` i serwowane przez publiczne URL.

---

## 5. Design System (UI/UX)

VELVET stawia na estetykę segmentu **Premium/Luxury**.

*   **Paleta Kolorystyczna:**
    *   **Velvet Burgundy (#4A0E0E):** Kolor głębi, emocji i elegancji.
    *   **Gold (#D4AF37):** Akcenty luksusu, ikony i nagłówki.
    *   **Black/Dark (#0A0E14):** Tło zapewniające intymność i wysoki kontrast.
*   **Konstante Designowe:**
    *   Zaokrąglenia: Standard `rounded-2xl` dla kart i `rounded-3xl` dla dużych sekcji.
    *   Efekty: Glassmorphism (`backdrop-blur-xl`) oraz subtelne cienie `shadow-premium`.
    *   Typografia: Heading (Montserrat), Body (Inter).

---

## 6. Current Status & Roadmap

### Stan Obecny (v1.5):
*   [x] Pełny system Onboardingu i Parowania.
*   [x] Dashbord z aktywnymi metrykami i wykresami.
*   [x] Safe Space z obsługą spraw i komentarzy.
*   [x] Pamiętnik i Bucket List z obsługą zdjęć.
*   [x] System powiadomień Realtime.

### Placeholdery (W trakcie rozwoju):
*   **Velvet Room:** Nadchodząca sekcja personalizacji przestrzeni.
*   **Grywalizacja v2:** Rozbudowa systemu punktów `VP` (Velvet Points) i portfeli, które są już obecne w bazie danych (`vp_wallets`), ale nie są jeszcze w pełni zintegrowane w UI.
*   **AI Insights v2:** Przejście z prostych reguł na dedykowany model LLM.

---

## 7. Getting Started & Guidelines

### Konfiguracja Środowiska
Skopiuj `.env.example` do `.env.local` i uzupełnij klucze Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=twoj-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-klucz
```

### Zasady Kodowania:
1.  **Preferencja dla Server Actions:** Unikaj tworzenia dedykowanych API Route, jeśli operacja może być wykonana przez `use server`.
2.  **Typowanie:** Każda nowa tabela musi zostać uwzględniona w typach TS. Korzystaj z helpera `Tables<'nazwa_tabeli'>`.
3.  **Wydajność:** Komponenty serwerowe powinny być domyślne. Używaj `'use client'` tylko tam, gdzie wymagana jest obsługa eventów (onClick, onChange) lub hooki (useState, useEffect).
4.  **DRY & Design System:** Korzystaj z klas narzędziowych zdefiniowanych w `globals.css` (np. `@apply v-card`).

---
*Dokumentacja przygotowana dla wersji VELVET 1.5. Ostatnia aktualizacja: Marzec 2026. Autor: Antigravity AI.*
