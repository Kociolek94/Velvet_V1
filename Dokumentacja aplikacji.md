# 🛋️ VELVET - Ekosystem Relacji Nowej Generacji

> **Status Dokumentu:** Rewizja Techniczno-Funkcjonalna v2.3  
> **Ostatnia Aktualizacja:** Dodano moduł Gier i Wyzwań (Velvet Games)

---

## 📑 Spis Treści
1. [🚀 Plan Implementacji MVP](#-plan-implementacji-mvp)
2. [🏗️ Architektura i Stack Technologiczny](#️-architektura-i-stack-technologiczny)
3. [🛡️ Bezpieczeństwo (Zero-Trust)](#️-bezpieczeństwo-zero-trust)
4. [🗯️ Moduł Komunikacji Emocjonalnej (Safe Space)](#️-moduł-komunikacji-emocjonalnej-safe-space)
5. [🧸 Monitorowanie Relacji (Maskotka)](#-monitorowanie-relacji-maskotka)
6. [🧠 Zaawansowany Silnik AI (The Velvet Engine)](#-zaawansowany-silnik-ai-the-velvet-engine)
7. [✈️ Moduł „The Journey” (LDR Optimization)](#️-moduł-the-journey-ldr-optimization)
8. [🎮 Grywalizacja i Velvet Points (VP)](#-grywalizacja-i-velvet-points-vp)
9. [📅 Zarządzanie Codziennością i Historia](#-zarządzanie-codziennością-i-historia)
10. [🧩 Gry i Wyzwania (Velvet Games)](#-gry-i-wyzwania-velvet-games)

---

## 🚀 Plan Implementacji MVP

### 🟦 Faza 1: Fundamenty i Backend
*Skupienie na Supabase i strukturze danych bez interfejsu.*

- [ ] **1.1: Inicjalizacja Supabase** – Aktywacja `pgvector` i ról systemowych.
- [ ] **1.2: Schemat Parowania** – Tabele `profiles` i `couples`.
- [ ] **1.3: Moduł Komunikacji** – Tabele `issues` (zgłoszenia emocjonalne).
- [ ] **1.4: Monitoring Relacji** – Tabel `daily_metrics`.
- [ ] **1.5: Row Level Security (RLS)** – Restrykcyjne polityki dostępu per `couple_id`.

### 🟦 Faza 2: Szkielet i Autoryzacja
*Uruchomienie Next.js i mechanizmu parowania.*

- [ ] **2.1: Inicjalizacja Next.js** – Layout Desktop-first z responsywnym Bottom Barem (Burgund, Złoto, Czerń).
- [ ] **2.2: Autoryzacja** – Integracja Supabase Auth.
- [ ] **2.3: Onboarding** – System generowania i wprowadzania "Kodu Zaproszenia".

### 🟦 Faza 3: Safe Space
*Serce aplikacji – ustrukturyzowana komunikacja.*

- [ ] **3.1: Widoki List** – Podział na zgłoszenia własne i partnera.
- [ ] **3.2: Formularz „Ciężko mi z tym”** – Implementacja wieloetapowa (Fakt -> Emocje -> Potrzeba).
- [ ] **3.3: Formularz „Musimy pogadać”** – Kategoryzacja kolorystyczna (🔴, 🟡, 🟢).
- [ ] **3.4: Obsługa Statusów** – Cykl życia zgłoszenia (Nowe -> Przeczytane -> Rozwiązane).

### 🟦 Faza 4: Dashboard Analityczny
*Wizualizacja kondycji związku.*

- [ ] **4.1: Daily Check-in** – Intuicyjne suwaki (1-10) dla 5 kluczowych potrzeb.
- [ ] **4.2: Agregacja Danych** – Średnie kroczące z 3/7 dni.
- [ ] **4.3: Relationship Dashboard** – **Wykres Radarowy** (Ja vs Partner).
- [ ] **4.4: System Alertów** – Kontekstowe sugestie interwencji.

### 🟦 Faza 5: UX & Real-time
- [ ] **5.1: Subskrypcje WebSockets** – Natychmiastowe powiadomienia o akcjach partnera.
- [ ] **5.2: Szlifowanie UX** – Typografia, marginesy, responsywność.

---

## 🏗️ Architektura i Stack Technologiczny

VELVET to progresywna aplikacja webowa (**PWA**) budowana w architekturze **Edge-First**.

### 🛠️ Technologie
| Warstwa | Technologia |
| :--- | :--- |
| **Frontend** | Next.js 14+ (App Router), Server Components |
| **Stylizacja** | Tailwind CSS (Custom Design Tokens) |
| **Backend** | Supabase (PostgreSQL), Real-time Listen/Notify |
| **AI** | GPT-4o / Claude 3.5 (Vercel AI SDK), pgvector |
| **Komunikacja** | Web Crypto API (E2EE), WebRTC (Velvet Room) |
| **Hardware** | Web Bluetooth API (Lovense/Kiiroo support) |

### 🎨 Paleta Barw
- `⬛ Black` (#0A0E14)
- `🍷 Deep Burgundy` (#4A0E0E)
- `🟡 Gold` (#D4AF37)

---

## 🛡️ Bezpieczeństwo (Zero-Trust)

> [!IMPORTANT]
> **End-to-End Encryption (E2EE):** Wykorzystujemy Web Crypto API. Klucze prywatne (RSA-OAEP/AES-GCM) nigdy nie opuszczają przeglądarki. Dane są szyfrowane przed zapisem w bazie.

- **RLS (Row Level Security):** Brak możliwości dostępu do danych innej pary na poziomie bazy danych.
- **Data Ephemerality:** Automatyczne niszczenie logów intymności (`pg_cron`) po 24h lub zakończeniu sesji.

---

## 🗯️ Moduł Komunikacji Emocjonalnej (Safe Space)

Fundament deeskalacji napięć – zamiana impulsu w strukturę.

### 🚦 Narzędzie „Ciężko mi z tym”
Wymusza autorefleksję poprzez system kroków:
1. **Fakt:** Opis obiektywny (bez oceny).
2. **Słownik Emocji:** Interaktywna chmura tagów.
3. **Analiza Potrzeb:** Czego mi zabrakło?
4. **Sugestia:** Co partner może zrobić inaczej?
5. **Potrzeba „Tu i Teraz”:** Np. „Przytul mnie”, „Daj mi 15 min spokoju”.

### 🗓️ System „Musimy pogadać”
- **🔴 Krytyczny:** Rozmowa w ciągu 24h.
- **🟡 Ważny:** Temat na najbliższy weekend.
- **🟢 Lekki:** Luźne sugestie ulepszeń.
- **Confirmation Loop:** Partner musi zaakceptować termin rozmowy lub zaproponować inny.

---

## 🧸 Monitorowanie Relacji (Maskotka)

Wizualny barometr kondycji związku.

### 📊 Relationship Radar
Codzienne oceny w 5 kategoriach:
- **Bliskość:** Czy czuję się dziś kochany/a?
- **Komunikacja:** Czy czuję się dziś słuchany/a?
- **Wsparcie:** Czy mam w Tobie oparcie?
- **Intymność:** Poziom pożądania/fizyczności.
- **Czas:** Satysfakcja z wspólnie spędzonych chwil.

> [!TIP]
> Jeśli wskaźniki spadają poniżej 4/10, Maskotka wizualnie "choruje", motywując do interakcji naprawczych.

---

## 🧠 Zaawansowany Silnik AI (The Velvet Engine)

AI jako aktywny moderator, nie tylko bot.

- **RAG & Long-term Memory:** Analiza powracających konfliktów (np. o sprzątanie) i sugerowanie grafików.
- **Analiza Sentymentu:** Wykrywanie agresji/gaslightingu i propozycja zmiany tonu komunikatu.
- **Translacja Języków Miłości:** Tłumaczenie gestów partnera (np. "ręka na udzie" jako komunikat "kocham cię" dla osób potrzebujących słów).

---

## ✈️ Moduł „The Journey” (LDR Optimization)

Optymalizacja sinusoidy napięcia dla par w rozłące (cykle 2-6 tygodni).

1. **Faza Connection:** Głębokie rozmowy, wspólne filmy.
2. **Faza Appreciation:** Wdzięczność, prezenty, planowanie przyszłości.
3. **Faza Tension:** Flirt, budowanie napięcia seksualnego.
4. **Faza Ignition:** Odblokowanie „Velvet Room” i teledildoniki.
5. **Faza Reunion:** Przygotowanie na fizyczne spotkanie.

> [!CAUTION]
> **Gatekeeping:** Moduł Ignition jest blokowany, jeśli średnia komunikacji spadnie poniżej 6/10 lub istnieją otwarte konflikty 🔴.

---

## 🎮 Grywalizacja i Velvet Points (VP)

Model hybrydowy: Wspólne **XP** (rozwój relacji) + Indywidualne **VP** (waluta).

### 💰 Katalog Aktywności
| Aktywność | Wartość | Typ Beneficjenta |
| :--- | :--- | :--- |
| Codzienny Self-Check | `+10 VP` | Indywidualnie |
| Wysłanie "Okruchu Miłości" | `+15 VP` | Nadawca |
| Zauważenie Gestu Partnera | `+20 VP` | Obaj |
| Rozwiązanie Konfliktu | `+50 VP` | Każdy |
| Cel z Tablicy Marzeń | `+100 VP` | Każdy |
| Tygodniowa Seria (Streak) | `+50 VP` | Para (XP) |

### 🎁 Wykorzystanie VP
- **Rynek Voucherów:** Możliwość "kupowania" usług od partnera (np. "Masaż wieczorem" za 300 VP).
- **Personalizacja:** Nowe skórki maskotki, zaawansowane emoji, dźwięki.

---

## 📅 Zarządzanie Codziennością i Historia

### 🖼️ Wspólna Historia (Pamiętnik)
- **Dashboard:** Galeria kafelkowa z najważniejszymi momentami.
- **Detale:** Opis, zdjęcia, filmy oraz sekcja "Nasze refleksje".
- **E2EE Storage:** Pełna prywatność mediów w Supabase Storage.

### 📋 Systemy Wspierające
- **Tablica Marzeń (Bucket List):** Wspólne cele do zrealizowania.
- **Śledzik Nawyków (12WY):** Wizualizacja ciągłości pozytywnych zachowań.
- **Ping-Pong Notifications:** Powiadomienia zachęcające do wzajemności.

---

## 🧩 Gry i Wyzwania (Velvet Games)

Budowanie bliskości poprzez wspólną zabawę.

- **Quizy "Jak dobrze mnie znasz?":** Porównywanie odpowiedzi i procent zgodności.
- **Pytanie Dnia (Daily Connect):** Głębokie pytania od AI, odpowiedzi widoczne po wypełnieniu przez oboje.
- **Wyzwania (Desires):** 
  - `Lekkie` – Romantyczne (wiersz).
  - `Średnie` – Zabawne (zdjęcie).
  - `Odważne` – Intymne (tylko w fazie Ignition).
- **Swipe-to-Match:** Mechanika wyboru randek/aktywności – informacja tylko o wspólnych zainteresowaniach.

---
