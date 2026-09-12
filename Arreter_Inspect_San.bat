@echo off
setlocal EnableExtensions
title Inspect-San MVC — Arret
cd /d "%~dp0"

echo ===================================================
echo     Arret Inspect-San (ASP.NET MVC)
echo ===================================================
echo.

REM --- XAMPP ---
set "XAMPP_DIR=C:\xampp"
if not exist "%XAMPP_DIR%\mysql_stop.bat" set "XAMPP_DIR=C:\XAMPP"

echo [1/3] Arret de l'application Inspect-San...
REM Ports par defaut (launchSettings.json)
set "PORTS=5244 7018 3645"

for %%P in (%PORTS%) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
    echo       Port %%P — PID %%A
    taskkill /PID %%A /F >NUL 2>&1
  )
)

REM Processus dotnet lies au projet (au cas ou)
powershell -NoProfile -Command ^
  "$root = (Resolve-Path '%~dp0').Path.TrimEnd('\');" ^
  "Get-CimInstance Win32_Process -Filter \"Name='dotnet.exe'\" |" ^
  " Where-Object { $_.CommandLine -and ($_.CommandLine -like '*inspect-san*' -or $_.CommandLine -like ('*'+$root+'*')) } |" ^
  " ForEach-Object { Write-Host ('      Kill dotnet PID ' + $_.ProcessId); Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"

echo [2/3] Arret MySQL (XAMPP)...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if errorlevel 1 (
  echo       MySQL deja arrete.
) else (
  if exist "%XAMPP_DIR%\mysql_stop.bat" (
    call "%XAMPP_DIR%\mysql_stop.bat"
  ) else (
    taskkill /IM mysqld.exe /F >NUL 2>&1
    echo       mysqld.exe force-stop.
  )
)

echo [3/3] Fermeture du panneau XAMPP (si ouvert)...
tasklist /FI "IMAGENAME eq xampp-control.exe" 2>NUL | find /I "xampp-control.exe" >NUL
if errorlevel 1 (
  echo       XAMPP Control deja ferme.
) else (
  taskkill /IM xampp-control.exe /F >NUL 2>&1
  echo       XAMPP Control ferme.
)

echo.
echo Arret termine.
pause
endlocal
