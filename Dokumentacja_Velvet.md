# 🛋️ Kompleksowa Dokumentacja Systemu VELVET
**Wersja:** 2.1.0 (Relationship OS)
**Data ostatniej aktualizacji:** Kwiecień 2026
**Status:** Produkcja (aktywna)
**ID Projektu Supabase:** `ornmidsswdzekzsegphu`

---

## 📂 Spis Treści
1.  [🎯 Wizja i Główne Funkcje](#1-wizja-i-główne-funkcje)
2.  [📱 Interfejs Użytkownika (UI/UX)](#2-interfejs-użytkownika-uiux)
3.  [⏳ Historia Rozwoju i Fazy Projektu](#3-historia-rozwoju-i-fazy-projektu)
4.  [🛠️ Architektura Techniczna i Stack](#4-architektura-techniczna-i-stack)
5.  [📊 Model Danych i Schemat Bazy SQL](#5-model-danych-i-schemat-bazy-sql)
6.  [🧠 Zaawansowany Silnik AI (The Velvet Engine)](#6-zaawansowany-silnik-ai-the-velvet-engine)
7.  [💌 Moduł Komunikacji i Safe Space](#7-moduł-komunikacji-i-safe-space)
8.  [🎮 Grywalizacja i Wspólny Czas](#8-grywalizacja-i-wspólny-czas)
9.  [🔔 System Powiadomień i Integracje Zewnętrzne](#9-system-powiadomień-i-integracje-zewnętrzne)
10. [📦 Procedury Uruchomienia i Konfiguracja Środowiska](#10-procedury-uruchomienia-i-konfiguracja-środowiska)
11. [🔒 Bezpieczeństwo i Prywatność (Zero-Trust)](#11-bezpieczeństwo-i-prywatność-zero-trust)
12. [✅ Stan Aktualny i Funkcjonalności Zaimplementowane](#12-stan-aktualny-i-funkcjonalności-zaimplementowane)
13. [🔮 Plany Rozwoju i Przyszłość](#13-plany-rozwoju-i-przyszłość)
14. [🚀 Log Postępu (Development Log)](#14-log-postępu-development-log)

---

## 1. 🎯 Wizja i Główne Funkcje

### Cel Projektu
**VELVET** (Premium Relationship Space) to ekskluzywna, progresywna aplikacja webowa (PWA) zaprojektowana dla par jako cyfrowa, intymna przestrzeń do rozwijania relacji, ułatwiania trudnej komunikacji oraz kolekcjonowania wspólnych chwil.

Zamiast standardowego, chłodnego trackera nawyków, Velvet funkcjonuje jako proaktywny **„System Operacyjny dla Związku" (Relationship OS)**, łączący analitykę emocjonalną z grywalizacją i wsparciem Sztucznej Inteligencji (Velvet Engine). Kluczową przewagą jest luksusowy, intymny charakter interfejsu, który sprawia, że korzystanie z aplikacji samo w sobie jest aktem bliskości.

### Kluczowe Moduły Funkcjonalne

| Nr | Moduł | Opis Biznesowy |
| :--- | :--- | :--- |
| 1 | **Dashboard** | Centrum Dowodzenia. Agreguje aktualne samopoczucie obojga partnerów, wyświetla wskaźnik „Harmonii", otwarte sprawy oraz generuje spersonalizowany „Velvet Insight" (refleksję od AI). |
| 2 | **Safe Space** | Bezpieczna Przestrzeń. Zrestrukturyzowany system do rozwiązywania konfliktów w oparciu o technikę Porozumienia bez Przemocy (NVC). Dwie ścieżki: zgłoszenie emocjonalne „Ciężko mi z tym" (Heavy) i prośba o rozmowę „Musimy pogadać" (Talk). |
| 3 | **Daily Check-in** | Codzienny rytuał. Narzędzie do oceny 5 kluczowych potrzeb w skali 1-10: Bliskość, Komunikacja, Wsparcie, Intymność, Czas Razem. Dane zasilają wykresy i silnik AI. |
| 4 | **Activity Deck** | Talia Aktywności. Baza kategoryzowanych pomysłów na wspólny czas, filtrowanych po nastroju (Vibe), koszcie i czasie trwania. Mechanizm „ślepego losowania" przełamuje rutynę. |
| 5 | **Pamiętnik (Diary)** | Repozytorium wspomnień. Wpisy z obsługą mediów (zdjęcia), szablonami wpisów i datą wydarzenia. Przechowywane w Supabase Storage. |
| 6 | **Bucket List** | Lista Marzeń. Cele i marzenia podzielone na kategorie: „Jej", „Jego" i „Wspólne" z poziomem budżetu, datą i subkomentarzami. |
| 7 | **Love Sparks** | Okruchy Miłości. Szybki ping tekstowy – „Myślę o Tobie". Natychmiast wyzwala powiadomienie push/email do partnera. |
| 8 | **Velvet Games** | Quizy i Daily Connect. AI generuje głębokie pytania, odpowiedzi widoczne po wypełnieniu przez oboje. Mechanika wzmacniania wzajemnej znajomości. |
| 9 | **Wishlist** | Lista Życzeń. Indywidualne inspiracje na prezenty z opcją „secret" (ukrytą przed partnerem do momentu realizacji). |
| 10 | **Habit Tracker** | Śledzik Nawyków. Wizualizacja ciągłości wspólnych pozytywnych zachowań. |
| 11 | **Prizes / Vouchers** | Sklep Woucherów. Ekosystem zakupu „usług" od partnera za wewnętrzną walutę Velvet Points (VP). |

---

## 2. 📱 Interfejs Użytkownika (UI/UX)

### Architektura Nawigacji
Aplikacja jest oparta na **Next.js App Router**. Główna struktura url:

```
/                    → Landing/Onboarding (Strona główna + rejestracja)
/login               → Formularz logowania
/register            → Rejestracja nowego użytkownika
/onboarding          → Kreator parowania (generowanie/wpisywanie kodu pary)
/safe-space          → Widok publiczny Safe Space (przed logowaniem)
/dashboard           → Centrum Dowodzenia (po zalogowaniu)
/dashboard/check-in  → Daily Check-in
/dashboard/safe-space→ Safe Space dla zalogowanej pary
/dashboard/issues    → Widok pojedynczej sprawy
/dashboard/diary     → Pamiętnik
/dashboard/bucket-list→ Lista Marzeń
/dashboard/activity-deck → Talia Aktywności
/dashboard/sparks    → Love Sparks
/dashboard/games     → Velvet Games & Quizy
/dashboard/wishlist  → Lista Życzeń
/dashboard/tracker   → Habit Tracker
/dashboard/prizes    → Vouchery
/dashboard/room      → Velvet Room (placeholder - w budowie)
/dashboard/profile   → Profil użytkownika
```

### Luksusowy Design System
Aplikacja zaprojektowana zgodnie z wytycznymi segmentu *Premium / Luxury*, wymuszając poczucie przebywania w bezpiecznym, ekskluzywnym pokoju.

**Paleta Barw (Tokeny CSS):**
| Token | Wartość HEX | Zastosowanie |
| :--- | :--- | :--- |
| `--color-velvet-dark` | `#0A0E14` | Tło główne, głębia i intymność |
| `--color-velvet-dark-alt` | `#0D121A` | Tło kart (v-card) |
| `--color-velvet-burgundy` | `#9E2B2B` | Elementy aktywne, przyciski, cienie premium |
| `--color-velvet-gold` | `#D4AF37` | Akcenty złota, powiadomienia, typografia nagłówkowa |
| `--color-velvet-cream` | `#F0EAD6` | Treść (body text) |
| `--color-velvet-beige` | `#F5F5ED` | Jasne karty (wariant odwrócony) |

**Typografia:**
- Nagłówki: **Montserrat** (font-heading) – dystyngowany, pogrubiony
- Treść: **Inter** (font-body) – czytelny, nowoczesny

**Główne Komponenty UI (Design System):**
- `.v-card` – karta bazowa (ciemna, z subtelną ramką)
- `.v-card-gold-border` – karta z złotą obwódką (dla kluczowych elementów)
- `.v-card-glass` – karta szklana (glassmorphism `backdrop-blur-xl`)
- `.v-card-burgundy` – karta z gradientem burgundowym
- `.v-button-gold` – złoty CTA z efektem glow
- `.v-button-burgundy` – przycisk burgund
- `.v-button-outline-gold` – zarys złoty (akcje drugorzędne)

**Animacje (Framer Motion):**
- `animate-glow-gold` – miękka pulsacja złotego blasku (ważne elementy)
- `animate-flash-gold` – eksplozja złotego światła (po akcji sukcesu)
- `animate-fade-in` – wejście elementów z dołu
- `animate-expand` – rozszerzające się tło
- Komponenty `motion.div` z tranzycjami `delay` przy listach

### Dashboard (Widok Główny)
Główny ekran (`/dashboard`) zbudowany jako **Bento Grid** (siatka kafelków):
- **Górny rząd (Grid 3-kolumnowy):**
  - Koło Harmonii – animowane SVG `strokeDashoffset` wyświetlające % synchronizacji
  - Passer Dni (Streak) – licznik dni nieprzerwanych check-inów z ikoną ognia
  - Portfel VP – stan waluty Velvet Points

- **Środkowy rząd (Grid 8+4 kolumny):**
  - **Relational Radar** (Recharts RadarChart) – wykres nakładający wieloboki `Ja` vs `Partner` dla 5 kategorii. Pokazuje Perception Gap wizualnie.
  - **Velvet Insight** – sekcja streamingowej odpowiedzi AI (Vercel AI SDK `useCompletion`)

- **Dolny rząd (Grid 3-kolumnowy):**
  - Next Milestone – najbliższy cel z Bucket Listy
  - Daily Habit – CTA do wykonania Check-inu
  - Activity Pick – przełącznik do losowania aktywności

---

## 3. ⏳ Historia Rozwoju i Fazy Projektu

### Faza 1 (MVP Fundamenty): Schemat i Backend
- Inicjalizacja Supabase, schemat tabel `profiles` i `couples`.
- System parowania oparty na unikalnym `pairing_code`.
- Polityki RLS dla wszystkich tabel.

### Faza 2 (Szkielet i Autoryzacja)
- Inicjalizacja Next.js z App Router i Tailwind CSS.
- Integracja Supabase Auth (Email/Password).
- Onboarding – generowanie kodu pary i mechanizm zaproszenia.

### Faza 3 (Safe Space)
- Implementacja formularzy wieloetapowych (`HeavyIssueForm`, `TalkIssueForm`).
- System statusów Issues (new → read → discussed → resolved).
- Kolorystyka priorytetu (red/yellow/green).

### Faza 4 (Dashboard Analityczny)
- Daily Check-in z suwakami (5 kategorii).
- Radar Chart (Recharts) – wizualizacja danych obu partnerów.
- Obliczanie Perception Gap i Harmonii (% synchronizacji).
- Wskaźnik Streak (ciągłość check-inów).

### Faza 5 (Moduły Pamięci i Aktywności)
- Pamiętnik z szablonami wpisów i uploadem zdjęć (Supabase Storage).
- Bucket List z kategoriami Jej/Jego/Wspólne i komentarzami.
- Activity Deck z filtrowaniem (Vibe/Koszt/Czas).

### Faza 6 (AI – Velvet Engine v1)
- Integracja Google Gemini 2.5 Flash przez Vercel AI SDK.
- `getRelationshipContext.ts` – RAG kompilujący dane relacji.
- Generowanie Insight (streaming przez `useCompletion`).
- Zapisywanie analizy dnia do bazy (`ai_analyses`).

### Faza 7 (Grywalizacja i System VP)
- Implementacja `vp_wallets` i tabeli `vouchers`.
- Moduł Vouchers (kupowanie usług od partnera).
- Love Sparks – ping emocjonalny z powiadomieniem.

### Faza 8 (Powiadomienia i Integracja Email)
- Deno Edge Function `send-notification-email`.
- Integracja z Resend (pierwsze próby) → migracja na **Brevo API** (ze względu na ograniczenia darmowych kont bez domeny własnej).
- Szablony HTML emaili w stylu Premium (ciemne tło, złote nagłówki).
- System typowania powiadomień (`spark`, `check_in`, `diary`, `bucket`, `issue`, `wish`, `analysis`).

### Faza 9 (NVC Moderator i Quizy)
- `analyzeMessage()` – real-time analiza NVC wpisywanych wiadomości.
- Moduł Velvet Games z quizami (`questions` + `quiz_answers`).
- Daily Connect – mechanika blind-answer.

---

## 4. 🛠️ Architektura Techniczna i Stack

Aplikacja jest nowoczesną platformą **Serverless / Edge-First** zbudowaną w paradygmacie Server Components + Server Actions.

| Warstwa | Technologia | Wersja | Opis |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | latest (~14+) | Server Components do fetchowania danych; Client Components tylko dla interaktywności. |
| **Język** | TypeScript | latest | Silne typowanie w 100% projektu. Auto-generowane typy z Supabase (`src/types/supabase.ts`). |
| **Stylizacja** | Tailwind CSS | v4 | Custom tokeny (`@theme`) w `globals.css`. Komponenty komposowalne z `@layer components`. |
| **Baza Danych** | Supabase (PostgreSQL 17) | latest | Rygorystyczny RLS. Realtime via WebSockets. Storage na media. Deno Edge Functions. |
| **AI** | Google Gemini 2.5 Flash | – | Przez `@ai-sdk/google` i `@ai-sdk/react`. Streaming odpowiedzi w czasie rzeczywistym. |
| **AI SDK** | Vercel AI SDK | v3.0 (ai@6.0) | `useCompletion` dla streaming UI; `generateText` dla Server Actions. |
| **3D** | Three.js + React Three Fiber | v9.5 | Przygotowane biblioteki pod Velvet Room 3D (funkcja w budowie). |
| **Animacje** | Framer Motion | v12 | Wejścia, tranzycje, Staggered Animations. |
| **Ikonografia** | Lucide React | latest | 400+ ikon w stylu line-art. |
| **Wykresy** | Recharts | v3.8 | `RadarChart` na Dashboardzie. `AreaChart` dla trendów. |
| **Daty** | date-fns | v4.1 | Obliczanie Streak, różnic dat, formatowanie. |
| **Edge Functions** | Deno (Supabase) | v2 | Async eventy: wysyłanie emaili po wyzwoleniu przez trigger DB. |
| **Mailing** | Brevo API | v3 | SMTP z szablonami HTML. Bez wymagania własnej domeny. |
| **Deployment** | Vercel (domyślny) | – | Optymalne dla Next.js. Automatyczny CI/CD z GitHuba. |

### Wzorzec Architektury Danych i Mutacji
```
Użytkownik → Client Component → Server Action ('use server')
                                     ↓
                             Supabase (PostgreSQL + RLS)
                                     ↓
                      [opcjonalnie] DB Trigger → Edge Function → Brevo Email
```

- **Server Actions** (`src/lib/actions/`) – wszelkie operacje zapisu. Brak dedykowanych API Routes dla mutacji.
- **Client Hooks** (`src/hooks/`) – `useAuth`, `useIssues`, `useDiary`, `useBucketList`, `useActivityDeck`, `useNotifications` – enkapsulują logikę odczytu po stronie klienta.
- **Dashboard Fetching** (`src/lib/dashboard.ts`) – jednorazowe zaciągnięcie kompleksowych danych Dashboardu (10 równoległych zapytań) bezpośrednio w Client Component na mount.

### Konfiguracja Projektu Supabase (lokalny dev)
- Port API: `54321`
- Port DB: `54322`
- Supabase Studio: `54323`
- Realtime: aktywny
- Storage: aktywny, limit pliku `50 MiB`
- Edge Runtime: Deno v2, tryb `per_worker` (hot-reload)

---

## 5. 📊 Model Danych i Schemat Bazy SQL

### Koncepcja Parowania (Coupling)
Użytkownicy, zanim wejdą w interakcję, muszą się sparować za pomocą wygenerowanego `pairing_code`. Fizyczne sparowanie tworzy rekord w tabeli `couples` i przypisuje obu użytkownikom wspólny `couple_id`.

> **Kluczowa zasada:** Kolumna `couple_id` występuje w **każdej** tabeli biznesowej. Żadne zapytanie nie zwraca danych bez filtrowania po tej kolumnie (wymuszane przez RLS).

### Diagram Relacji (ERD – uproszczony)
```
auth.users
    │
    └── profiles (id, couple_id, display_name, avatar_url)
              │
              └── couples (id, pairing_code, is_active)
                    │
          ┌─────────┼──────────────────────────────────┐
          │         │                                  │
    daily_metrics  issues ──── issue_comments    diary_entries
          │         │                                  │
          │     bucket_list ── bucket_list_comments   [Storage]
          │         │
        love_sparks  activity_deck
          │
    notifications ── [Edge Function → Brevo Email]
          │
    vp_wallets ── vouchers
          │
    wishlists ── habits ── habit_logs
          │
    questions ── quiz_answers
```

### Szczegółowy Opis Tabel

| Tabela | Opis | Kluczowe Kolumny |
| :--- | :--- | :--- |
| `couples` | Definicja pary. Centralny hub. | `id`, `pairing_code`, `is_active` |
| `profiles` | Profil użytkownika rozszerzający `auth.users`. | `id` (= auth user id), `couple_id`, `display_name`, `avatar_url` |
| `daily_metrics` | Wpisy Check-in (1 per user per dzień). | `closeness`, `communication`, `intimacy`, `support`, `time_together` (1-10), `note` |
| `issues` | Zgłoszenia Safe Space (konflikty, tematy). | `type` (heavy/talk), `status` (new→resolved), `priority` (red/yellow/green), `content` (JSONB), `overloaded_until`, `signed_by_author`, `signed_by_recipient`, `solution_draft` |
| `issue_comments` | Wątki pod Issues. | `issue_id`, `author_id`, `content` |
| `diary_entries` | Wpisy do Pamiętnika. | `title`, `content` (JSONB – elastyczny szablon), `template_type`, `image_path`, `event_date` |
| `bucket_list` | Marzenia i cele. | `title`, `owner_type` (jej/jego/wspólne), `budget_level`, `is_completed`, `estimated_date`, `links[]`, `image_url` |
| `bucket_list_comments` | Komentarze pod marzeniami. | `bucket_list_id`, `author_id`, `content` |
| `activity_deck` | Propozycje aktywności. | `title`, `description`, `vibe` (relax/adrenaline/romance), `cost_level`, `duration`, `is_completed`, `image_url` |
| `love_sparks` | Okruchy miłości (ping). | `sender_id`, `couple_id`, `content` |
| `notifications` | Powiadomienia systemowe. | `user_id`, `type`, `title`, `content`, `link`, `is_read`, `couple_id` |
| `vp_wallets` | Portfel waluty VP (per user). | `user_id`, `couple_id`, `balance` |
| `vouchers` | Kupony usług za VP. | `creator_id`, `buyer_id`, `title`, `description`, `cost_vp`, `status` |
| `wishlists` | Lista życzeń. | `user_id`, `title`, `is_secret`, `link`, `status`, `category` |
| `habits` | Śledzone nawyki. | `couple_id`, `created_by`, `title` |
| `habit_logs` | Dziennik realizacji nawyku. | `habit_id`, `user_id`, `completed_at_date` |
| `questions` | Bank pytań do quizów. | `question_text`, `options` (JSONB), `category` |
| `quiz_answers` | Wyniki quizów par. | `question_id`, `user_a_answer`, `user_b_answer`, `is_match` |
| `ai_analyses` | Archiwum generowanych wglądów AI. | `couple_id`, `content`, `created_at` |

### Funkcje Bazodanowe (PostgreSQL RPC)
| Funkcja | Opis |
| :--- | :--- |
| `get_my_couple_id()` | Zwraca `couple_id` aktualnie zalogowanego użytkownika. |
| `get_partner_id(c_id, u_id)` | Zwraca ID partnera w parze. |
| `is_member_of_couple(c_id)` | Sprawdza czy użytkownik należy do danej pary (używane przez RLS). |
| `buy_voucher(b_id, v_id)` | Transakcja zakupu vouchera (pobiera VP z portfela kupującego). |
| `get_user_email(user_id)` | Pobiera email użytkownika z `auth.users` (dostępna dla Service Role). |

### Typy ENUM (PostgreSQL)
```sql
activity_vibe: 'relax' | 'adrenaline' | 'romance'
dream_category: 'jej' | 'jego' | 'wspólne'
issue_priority: 'red' | 'yellow' | 'green'
issue_status:   'new' | 'read' | 'discussed' | 'resolved'
issue_type:     'heavy' | 'talk'
```

---

## 6. 🧠 Zaawansowany Silnik AI (The Velvet Engine)

Velvet nie jest statycznym notatnikiem – działa jak wspierający doradca relacyjny.

### Architektura AI

**Model:** Google Gemini 2.5 Flash (`gemini-2.5-flash`)
**SDK:** `@ai-sdk/google` + `ai` (Vercel AI SDK 6.0)
**Klucz:** `GOOGLE_GENERATED_AI_API_KEY` (zmienna środowiskowa)

### Składniki Velvet Engine

#### A) RAG – Kompilacja Kontekstu Relacji (`getRelationshipContext.ts`)
Zanim AI wygeneruje wgląd (Insight), Server Action kompiluje strukturalny JSON z danymi:
- **`relationship_metrics`** – metryki z ostatnich 7 dni (obu partnerów + notatki)
- **`ongoing_and_recent_issues`** – otwarte sprawy lub rozwiązane w ostatnich 14 dniach
- **`activities_completed_this_week`** – liczba zrealizowanych aktywności (7 dni)
- **`love_sparks_sent_this_week`** – liczba wysłanych pingów (7 dni)

Ten JSON przekazywany jest do modelu jako kontekst w prompcie.

#### B) Insight Generation – Generowanie Wglądu
- Prompt wysyłany do `/api/chat` (Next.js Route Handler)
- Odpowiedź streamowana przez `useCompletion` (hook z `@ai-sdk/react`)
- Format odpowiedzi modelu: `Refleksja: [...] Zadanie: [...]`
- Wynik parsowany przez `useMemo` i wyświetlany w dwóch sekcjach
- **Persystencja:** Po zakończeniu streamowania, analiza zapisywana do tabeli `ai_analyses`. Przy ponownym wejściu na Dashboard tego samego dnia – wczytywana z bazy (nie generowana ponownie).

**System Prompt (rola modelu):**
> Jesteś 'Velvet Confidant' − luksusowym, mądrym asystentem i powiernikiem dla par. [...] Styl: Luksusowy, polski, intymny, terapeutyczny, poetycki ale konkretny.

#### C) Perception Gap – Obliczanie Rozbieżności
System automatycznie oblicza różnicę `|Ocena A − Ocena B|` dla każdej z 5 kategorii. Gdy gap > 3.0 punktów – AI w insighcie explicite odnosi się do rozbieżności z empatycznym wyjaśnieniem.

Wskaźnik **Harmonii** na Dashboardzie wyliczany jest wzorem:
```
harmoniaPercent = max(0, 100 - (suma_gapów / liczba_kategorii) × 10)
```

#### D) NVC Moderator (`analyzeMessage`)
- Aktywna autokorekta wpisywanych wiadomości w Safe Space
- Gemini analizuje tekst pod kątem: agresji, „Ty-komunikatów", pasywnej agresji
- Jeśli wykryje naruszenie NVC → sugeruje wersję z „Ja-komunikatem"
- Format odpowiedzi: `„Velvet Engine sugeruje: [poprawiona wersja]"`
- Temperatura modelu: `0.4` (bardziej deterministyczny)
- Max tokens: `200` (szybka odpowiedź)

#### E) Quizy i Daily Connect (`/dashboard/games`)
- Baza pytań (`questions`) z opcjami w JSONB
- Para odpowiada niezależnie; wyniki odsłaniane dopiero po wypełnieniu przez oboje
- Pole `is_match` wskazuje czy odpowiedzi się zgadzają

---

## 7. 💌 Moduł Komunikacji i Safe Space

Fundamentalny moduł deeskalacji napięć – zamiana impulsu emocjonalnego w ustrukturyzowaną formę.

### Dwa Typy Zgłoszeń (Issue Types)

#### `heavy` – „Ciężko mi z tym" (HeavyIssueForm)
Wieloetapowy formularz wymuszający autorefleksję:
1. **Fakt** – opisz obiektywne zdarzenie bez oceny
2. **Emocje** – chmura tagów emocji (wybór wielokrotny)
3. **Potrzeba** – czego Ci zabrakło?
4. **Sugestia** – co partner mógłby zrobić inaczej?
5. **Potrzeba „tu i teraz"** – np. „Przytul mnie", „Daj mi 15 min spokoju"

Treść przechowywana jako JSONB w kolumnie `content`.

#### `talk` – „Musimy pogadać" (TalkIssueForm)
Prośba o zaplanowanie rozmowy z kolorystycznym priorytetem:
- 🔴 **Red** – Wymaga reakcji w ciągu 24 godzin
- 🟡 **Yellow** – Na najbliższy wieczór/weekend
- 🟢 **Green** – Lekka obserwacja, niskie napięcie

### Cykl Życia Zgłoszenia
```
new → read → discussed → resolved
```

### Zaawansowane Mechanizmy Issues

- **Safe Exit / Overload** – partner może zgłosić emocjonalne przeciążenie (`needs_quiet_space = true`, `overloaded_until` = timestamp do końca time-outu). Zamraża eskalację.
- **Kontrakt** – możliwość zapisania `solution_draft` jako finalnego porozumienia wymagającego „podpisu" obu stron (`signed_by_author`, `signed_by_recipient`).
- **Planowanie** – pole `scheduled_at` dla ustalenia terminu rozmowy.
- **Propozycje** – JSONB `proposals` dla asynchronicznego negocjowania terminu.
- **Wątki Komentarzy** – tabela `issue_comments` dla pełnego dialogu przy sprawach.

---

## 8. 🎮 Grywalizacja i Wspólny Czas

Przełamanie rutyny i budowanie bliskości poprzez wspólne doświadczenia.

### Activity Deck (Talia Aktywności)

Baza kart aktywności kategoryzowanych po:
- **Vibe:** `relax` / `adrenaline` / `romance`
- **Koszt:** poziom 1-3 (darmowe / tanie / droższe)
- **Czas trwania:** w minutach

**Mechanika losowania:** Ślepe losowanie filtrowane po aktualnym nastroju eliminuje problem decyzyjny „co dziś robimy". Para przegapnięta codziennym checkiem aktywności jest zachęcana przez Insight AI.

Przykładowe aktywności z bazy (`Aktywnosci.md`):
> *Nocny Piknik pod Gwiazdami* – Koc, termos i aplikacja do rozpoznawania konstelacji. Vibe: Romantyka | 1.5h | $
> *Foto-Polowanie w Mieście* – 3 zdjęcia symbolizujące „Piękno", „Tajemnicę", „Partnera". Vibe: Adrenalina | 1h | Bezpłatne

### Love Sparks (Okruchy Miłości)
- Szybki, afektywny ping tekstowy
- Przechowywany w tabeli `love_sparks`
- Dashboard wyświetla 3 ostatnie Sparki w „bento" widgecie
- Automatycznie wyzwala powiadomienie dla partnera

### Velvet Points (VP) – System Waluty

**Filozofia:** Aktywna troska o relację = waluty.

- Każda pozytywna interakcja z aplikacją generuje VP
- VP przechowywane w tabeli `vp_wallets` (indywidualnie per user)
- Transakcja zakupu vouchera przez funkcję `buy_voucher()` (atomowa – pobiera środki i zmienia status)

**Vouchers (Kupony Usług):**
- Partner A tworzy voucher: „Masaż wieczorem – 300 VP"
- Partner B kupuje voucher za swoje VP
- Status vouchera: `available` → `purchased` → `redeemed`

---

## 9. 🔔 System Powiadomień i Integracje Zewnętrzne

### Architektura Powiadomień (In-App)

System powiadomień wewnętrznych (tabela `notifications`) obsługiwany przez:
1. **Server Actions** – każda akcja partnera wywołuje `createPartnerNotification()`
2. **Supabase Realtime** – hook `useNotifications` subskrybuje zmiany w tabeli przez WebSockets
3. **NotificationDrawer** – komponent boczny wyświetlający listę powiadomień z opcją odczytu i usunięcia

**Typy Powiadomień:**
| Typ | Wyzwalacz | Emotka |
| :--- | :--- | :--- |
| `spark` | Wysłanie Love Spark | ✨ |
| `check_in` | Partner wykonał Check-in | 📈 |
| `diary` | Nowy wpis w Pamiętniku | 📖 |
| `analysis` | Nowy Velvet Insight wygenerowany | 🧠 |
| `bucket` | Nowe marzenie / osiągnięty cel | 🌟 |
| `wish` | Nowe życzenie dodane | 🎁 |
| `issue` | Nowe zgłoszenie Safe Space | 💬 |

### Architektura Emaili (Brevo + Edge Functions)

```
Supabase DB INSERT (np. notifications)
         ↓
    DB Trigger (Postgres)
         ↓
Deno Edge Function: send-notification-email
         ↓
  1. Pobranie emaila adresata (RPC: get_user_email)
  2. Pobranie couple_id odbiorcy
  3. Pobranie display_name nadawcy
  4. Wybór tematu maila i emoji wg typu
  5. Renderowanie HTML Template (Ciemny, złoty, premium design)
         ↓
  Brevo SMTP API v3
  POST https://api.brevo.com/v3/smtp/email
         ↓
   Email dostarczony do partnera
```

**Szablon Email:** Responsywny HTML z:
- Ciemnym tłem (#0A0E14)
- Nagłówkiem „VELVET" w złotym kolorze (#D4AF37)
- Burgundową obwódką kontenera (#4A0E0E)
- Przyciskiem CTA „OTWÓRZ APLIKACJĘ"

**Historia Integracji Email:**
- **Próba 1 (Resend):** Limitacje darmowego planu uniemożliwiały wysyłkę na zewnętrzne adresy bez weryfikacji domeny.
- **Aktualne rozwiązanie (Brevo):** API Key bez wymagania własnej domeny – email wysyłany z konta nadawcy developera.

---

## 10. 📦 Procedury Uruchomienia i Konfiguracja Środowiska

### Wymagania Systemowe
- Node.js (LTS)
- npm lub yarn
- Dostęp do internetu (Supabase Cloud)

### Zmienne Środowiskowe (`.env.local`)
```env
# Supabase (wymagane)
NEXT_PUBLIC_SUPABASE_URL=https://ornmidsswdzekzsegphu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<klucz_anon>

# Google Gemini AI (wymagane dla Velvet Engine)
GOOGLE_GENERATED_AI_API_KEY=<klucz_google_ai>

# Brevo (wymagane tylko dla Edge Function - konfigurowane w Supabase Dashboard)
BREVO_API_KEY=<klucz_brevo>
```

> ⚠️ **Uwaga dla dewelopera:** `BREVO_API_KEY` jest konfigurowany jako **Secret w Supabase Dashboard**, nie w `.env.local`. Edge Function `send-notification-email` odczytuje go przez `Deno.env.get('BREVO_API_KEY')`.

### Uruchomienie Deweloperskie
```powershell
# Instalacja zależności
npm install

# Uruchomienie serwera deweloperskiego
npm run dev

# Lub używając skryptu startowego projektu
.\Uruchom_Velvet.ps1
```

Aplikacja dostępna pod: `http://localhost:3000`

### Budowanie Produkcyjne
```powershell
npm run build
npm run start
```

### Zasady Kodowania (Guidelines dla Dewelopera)
1. **Preferencja dla Server Actions:** Unikaj tworzenia API Routes dla mutacji. Używaj `'use server'` w `src/lib/actions/`.
2. **Typowanie:** Każda nowa tabela musi być uwzględniona w `src/types/supabase.ts`. Korzystaj z helpera `Tables<'nazwa_tabeli'>`.
3. **Client vs Server:** Komponenty serwerowe dla fetchowania danych. Dyrektywa `'use client'` tylko gdy wymagane hooki stanu lub eventy DOM.
4. **Design System:** Korzystaj z klas `.v-card`, `.v-button-gold` itp. z `globals.css`. Nie twórz nowych, ad-hoc stylów Tailwind dla powtarzających się wzorców.
5. **Powiadomienia:** Każda akcja mutująca dane PARTNERA powinna wywołać `createPartnerNotification()` z `src/lib/actions/notifications.ts`.

---

## 11. 🔒 Bezpieczeństwo i Prywatność (Zero-Trust)

### Row Level Security (RLS)
Każda tabela posiada polityki RLS wymuszające izolację danych na poziomie bazy danych:
- `couple_id` jako globalny klucz izolacji – użytkownik nie może odczytać danych innej pary
- Weryfikacja przez funkcję `is_member_of_couple(c_id)` zwracającą `boolean`
- Próba `SELECT` na danych innej pary jest blokowana przez PostgreSQL przed zwróceniem wyniku

### Izolacja Treści Powiadomień
- Emaile wysyłane przez Brevo **nie zawierają treści** zgłoszeń Safe Space
- Powiadomienie informuje jedynie o typie zdarzenia (np. „Ważna wiadomość od X")
- Pełna treść dostępna tylko po zalogowaniu do aplikacji

### Bezpieczeństwo Kluczy API
- `GOOGLE_GENERATED_AI_API_KEY` – wyłącznie po stronie serwera (nie eksponowany przez `NEXT_PUBLIC_`)
- `BREVO_API_KEY` – konfigurowany jako Secret w Supabase Dashboard (niedostępny po stronie klienta)
- `SUPABASE_SERVICE_ROLE_KEY` – używany wyłącznie w Edge Functions (nie na froncie)

### Planowane (v3.0): End-to-End Encryption (E2EE)
Szyfrowanie po stronie klienta z użyciem Web Crypto API (RSA-OAEP / AES-GCM). Klucze prywatne nigdy nie opuszczają przeglądarki – nawet administrator Supabase nie może odczytać treści.

---

## 12. ✅ Stan Aktualny i Funkcjonalności Zaimplementowane

### Zaimplementowane i Działające
- [x] Pełny system Onboardingu i Parowania
- [x] Dashboard z aktywnymi metrykami, Radar Chartem i wskaźnikami KPI
- [x] Safe Space z formularzami HeavyIssue i TalkIssue
- [x] Obsługa pełnego cyklu życia Issues (statusy, komentarze, Safe Exit, Kontrakt)
- [x] Daily Check-in z 5 kategoriami i notatką
- [x] Pamiętnik z uploadem zdjęć (Supabase Storage)
- [x] Bucket List z kategoriami i komentarzami
- [x] Activity Deck z filtrowaniem i losowaniem
- [x] Love Sparks z powiadomieniami
- [x] System VP Wallets
- [x] Vouchers (kupony usług)
- [x] Wishlist z opcją „secret"
- [x] Habit Tracker z dziennikiem realizacji
- [x] Velvet Games / Quizy
- [x] System powiadomień Real-time (Supabase WebSockets)
- [x] Email notifications via Brevo (Edge Function)
- [x] Velvet Engine AI (Insight z RAGiem)
- [x] NVC Moderator (autokorekta wiadomości w Safe Space)
- [x] Persystencja analiz AI (`ai_analyses`)
- [x] Streak (ciągłość check-inów)
- [x] Perception Gap i wskaźnik Harmonii

### Placeholdery (W Budowie)
- [ ] **Velvet Room** – trójwymiarowa przestrzeń par (infrastruktura Three.js gotowa)
- [ ] **Grywalizacja v2** – Rozbudowa systemu VP o automatyczne przyznawanie za akcje
- [ ] **The Journey (LDR)** – Pełny moduł optymalizacji sinusoidy napięcia dla par na dystans

---

## 13. 🔮 Plany Rozwoju i Przyszłość

### Krótkoterminowe (v2.2 – v2.5)
1.  **Web Push Notifications (PWA):** Migracja z emailowych powiadomień Brevo na natywne Web Push API (pełne PWA z `manifest.json` i Service Worker), co pozwoli na powiadomienia push bezpośrednio na ekran blokady urządzenia.
2.  **Własna Domena Email:** Rejestracja domeny `velvet-app.pl` / `.com` dla profesjonalizacji wysyłki emaili przez Brevo (bez „konto dewelopera").
3.  **Grywalizacja v2:** Automatyczne przyznawanie VP za każdy check-in, każdego Sparka, każde rozwiązane Issue. Tablica liderów dla pary.
4.  **Moduł „The Journey" (LDR):** Optymalizacja cyklów napięcia i bliskości dla par w rozłące (fazy: Connection → Appreciation → Tension → Reunion).

### Średnioterminowe (v3.0)
1.  **Velvet Room 3D (Three.js + React Three Fiber):** Trójwymiarowy, interaktywny pokój pary. Infrastruktura (`@react-three/fiber`, `@react-three/drei`) jest już zainstalowana w `package.json`. Docelowo: meble zmieniane przez VP, wspomnienia jako obiekty 3D, ambientowe oświetlenie zmieniające się wraz z Harmonią.
2.  **E2EE (End-to-End Encryption):** Szyfrowanie treści Safe Space po stronie klienta (Web Crypto API). Nawet Supabase nie może odczytać treści rozmów pary.
3.  **AI Insights v2 (RAG Long-term Memory):** Przechowywanie historii analiz i wzorców zachowań pary przez `pgvector`. AI będzie rozpoznawać powracające konflikty i sugerować bardziej spersonalizowane interwencje.

### Długoterminowe (v4.0 + Biznes)
1.  **Aplikacja Mobilna (React Native / Expo):** Natywna wersja na iOS/Android dla pełnego Push Notification i dostępu offline.
2.  **Model Freemium / Premium:** Podstawowe funkcje darmowe, płatny plan odblokowujący zaawansowany AI, Velvet Room, rozszerzoną historię.
3.  **Integracja Hardware (IoT – Teledildonika):** Obsługa urządzeń Kiiroo/Lovense przez Web Bluetooth API dla par LDR (Velvet Room Ignition). Wyłącznie za wyraźną zgodą i po spełnieniu kryterium Harmonii > 80%.

---

## 14. 🚀 Log Postępu (Development Log)

### Faza 8 (Marzec–Kwiecień 2026): Powiadomienia i Edge Functions
- **Problem:** Resend odrzucał wysyłkę emaili na adresy zewnętrzne bez weryfikacji domeny własnej.
- **Rozwiązanie:** Migracja na Brevo API v3 – brak wymagań domeny na darmowym koncie.
- **Implementacja:** Deno Edge Function (`send-notification-email`) – asynchroniczna, wyzwalana durch trigger DB na INSERT do tabeli `notifications`. Typy emaili: spark, check_in, diary, analysis, bucket, wish, issue.
- **Szablon:** Premium HTML z ciemnym tłem, złotym headerem i przyciskiem CTA. Dynamiczny temat emaila i emotka per typ.

### Faza 9 (Kwiecień 2026): AI Engine Stabilizacja i Dashboard v2
- Dodano persystencję analiz do tabeli `ai_analyses` (brak regenerowania przy każdym wejściu).
- Poprawiono parsowanie struktury odpowiedzi AI (split po sekcjach Refleksja/Zadanie).
- Wdrożono Bento Grid na Dashboardzie z animowanym kołem Harmonii (SVG strokeDashoffset).
- Dodano Sparkline'y trendów dla każdej kategorii.

---
*Dokumentacja skompilowana zgodnie z aktualną implementacją v2.1 na podstawie pełnego audytu kodu źródłowego.*
*Ostatnia aktualizacja: Kwiecień 2026. Autor: Antigravity AI.*
