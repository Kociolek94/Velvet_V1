# VELVET Launcher - ASCII Version (Safe Encoding)
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "--- Inicjalizacja Velvet ---" -ForegroundColor Cyan

# 0. Check requirements
if (-not (Test-Path ".env.local")) {
    Write-Host "--- OSTRZEZENIE ---" -ForegroundColor Red
    Write-Host "Brak pliku .env.local! Aplikacja moze nie dzialac bez kluczy Supabase." -ForegroundColor Red
    Write-Host "Upewnij sie, ze skopiowales ten plik z innego komputera." -ForegroundColor Red
    Write-Host ""
}

# 1. Update from GitHub
Write-Host "[1/4] Sprawdzanie aktualizacji..." -ForegroundColor Yellow

if (Get-Command git -ErrorAction SilentlyContinue) {
    if (Test-Path ".git") {
        # Fetch updates
        git fetch --all --quiet
        
        # Check for local changes
        $status = git status --porcelain
        if ($status) {
            Write-Host "Wykryto lokalne zmiany. Zabezpieczam je (git stash)..." -ForegroundColor Gray
            git stash --include-untracked --quiet
        }

        # Pull updates
        Write-Host "Pobieranie nowych plikow..." -ForegroundColor Cyan
        git pull --rebase --autostash
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Blad podczas git pull. Upewnij sie, ze masz polaczenie z internetem." -ForegroundColor Red
            Write-Host "Sprobuj recznie: git pull" -ForegroundColor Gray
        } else {
            Write-Host "Repozytorium jest aktualne." -ForegroundColor Green
        }
    } else {
        Write-Host "PominieTo aktualizacje: Folder nie jest repozytorium Git." -ForegroundColor Gray
    }
} else {
    Write-Host "BLAD: Git nie jest zainstalowany lub nie jest w PATH!" -ForegroundColor Red
    Write-Host "Pobierz Git ze strony: https://git-scm.com/" -ForegroundColor Gray
}

# 2. Install npm dependencies
Write-Host "[2/4] Sprawdzanie bibliotek (npm install)..." -ForegroundColor Yellow
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) {
    Write-Host "Wystapil blad podczas instalacji bibliotek." -ForegroundColor Red
}

# 3. Start Next.js server
Write-Host "[3/4] Uruchamianie serwera Velvet..." -ForegroundColor Cyan
Write-Host "Serwer wystartuje za chwile. Prosze nie zamykac tego okna." -ForegroundColor Gray

# Open browser in background
Start-Job -ScriptBlock {
    Start-Sleep -Seconds 12
    Start-Process 'http://localhost:3000'
} | Out-Null

# Start app
npm run dev
