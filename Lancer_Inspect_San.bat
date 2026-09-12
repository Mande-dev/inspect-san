@echo off
setlocal EnableExtensions
title Inspect-San MVC — Demarrage
cd /d "%~dp0"

echo ===================================================
echo     Demarrage Inspect-San (ASP.NET MVC)
echo ===================================================
echo.

REM --- XAMPP (modifiable si installation ailleurs) ---
set "XAMPP_DIR=C:\xampp"
if not exist "%XAMPP_DIR%\xampp-control.exe" set "XAMPP_DIR=C:\XAMPP"
if not exist "%XAMPP_DIR%\xampp-control.exe" (
  echo [ERREUR] XAMPP introuvable. Verifiez C:\xampp
  pause
  exit /b 1
)

echo [1/3] Ouverture du panneau XAMPP...
tasklist /FI "IMAGENAME eq xampp-control.exe" 2>NUL | find /I "xampp-control.exe" >NUL
if errorlevel 1 (
  start "" "%XAMPP_DIR%\xampp-control.exe"
) else (
  echo       XAMPP Control deja ouvert.
)

echo [2/3] Demarrage MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if errorlevel 1 (
  start "XAMPP MySQL" /MIN cmd /c "cd /d %XAMPP_DIR% && call mysql_start.bat"
) else (
  echo       MySQL deja en cours.
)

REM Attendre que le port 3306 reponde (max ~30 s)
set /a _wait=0
:wait_mysql
powershell -NoProfile -Command "try { $c = New-Object Net.Sockets.TcpClient; $c.Connect('127.0.0.1',3306); $c.Close(); exit 0 } catch { exit 1 }" >NUL 2>&1
if %errorlevel%==0 goto mysql_ok
set /a _wait+=1
if %_wait% GEQ 30 (
  echo [ATTENTION] MySQL ne repond pas encore sur le port 3306.
  echo             Demarrez MySQL dans XAMPP Control puis continuez.
  pause
  goto mysql_ok
)
timeout /t 1 /nobreak >NUL
goto wait_mysql

:mysql_ok
echo       MySQL pret (port 3306).
echo.
echo [3/3] Lancement de l'application...
echo       URL : http://localhost:5244
echo.
dotnet run
echo.
pause
endlocal
