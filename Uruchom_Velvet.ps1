# Ustawienie kodowania na UTF8 dla poprawnych znaków w konsoli
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "--- Inicjalizacja Velvet ---" -ForegroundColor Cyan

# 0. Sprawdzenie wymagań lokalnych
if (-not (Test-Path ".env.local")) {
    Write-Host "--- OSTRZEŻENIE ---" -ForegroundColor Red
    Write-Host "Brak pliku .env.local! Aplikacja może nie działać poprawnie bez kluczy Supabase." -ForegroundColor Red
    Write-Host "Upewnij się, że skopiowałeś ten plik z innego komputera." -ForegroundColor Red
    Write-Host ""
}

# 1. Pobieranie aktualizacji z GitHub
Write-Host "[1/4] Sprawdzanie aktualizacji..." -ForegroundColor Yellow
if (Test-Path ".git") {
    git pull
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Błąd podczas git pull. Upewnij się, że masz połączenie z internetem i dostęp do repozytorium." -ForegroundColor Red
    } else {
        Write-Host "Repozytorium jest aktualne." -ForegroundColor Green
    }
} else {
    Write-Host "Pominięto aktualizację: Folder nie jest repozytorium Git." -ForegroundColor Gray
}

# 2. Instalacja zależności npm
Write-Host "[2/4] Sprawdzanie bibliotek (npm install)..." -ForegroundColor Yellow
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) {
    Write-Host "Wystąpił błąd podczas instalacji bibliotek." -ForegroundColor Red
}

# 3. Uruchomienie serwera Next.js
Write-Host "[3/4] Uruchamianie serwera Velvet..." -ForegroundColor Cyan
Write-Host "Serwer wystartuje za chwilę. Proszę nie zamykać tego okna." -ForegroundColor Grey

# Otwarcie przeglądarki w tle po krótkim opóźnieniu
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 8
    Start-Process "http://localhost:3000"
} | Out-Null

# Start aplikacji
npm run dev
