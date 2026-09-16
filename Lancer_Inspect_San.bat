@echo off
setlocal EnableExtensions EnableDelayedExpansion
title Inspect-San MVC - Demarrage
cd /d "%~dp0"

echo ===================================================
echo     Demarrage Inspect-San (ASP.NET MVC)
echo ===================================================
echo.

REM --- XAMPP (modifiable si installation ailleurs) ---
set "XAMPP_DIR=C:\xampp"
if not exist "%XAMPP_DIR%\xampp-control.exe" if exist "%XAMPP_DIR%\mysql_start.bat" goto xampp_ok
if not exist "%XAMPP_DIR%\xampp-control.exe" set "XAMPP_DIR=C:\XAMPP"
if not exist "%XAMPP_DIR%\mysql_start.bat" (
  echo [ERREUR] XAMPP introuvable ^(mysql_start.bat^).
  echo          Verifiez C:\xampp ou adaptez XAMPP_DIR dans ce script.
  pause
  exit /b 1
)
:xampp_ok

where dotnet >NUL 2>&1
if errorlevel 1 (
  echo [ERREUR] dotnet introuvable dans le PATH.
  echo          Installez le SDK .NET 8 puis lancez Installer_Dependances.bat
  pause
  exit /b 1
)

REM --- Liberer le port HTTP si une ancienne instance bloque ---
set "APP_PORT=5244"
echo [0/3] Verification du port %APP_PORT%...
set "_port_busy=0"
netstat -ano 2>NUL | findstr ":%APP_PORT% " | findstr "LISTENING" >NUL
if not errorlevel 1 set "_port_busy=1"
if "!_port_busy!"=="1" (
  echo       Port %APP_PORT% occupe - arret des processus en ecoute...
  set "_killed= "
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%APP_PORT% .*LISTENING"') do (
    echo !_killed! | findstr /C:" %%A " >NUL
    if errorlevel 1 (
      if not "%%A"=="0" if not "%%A"=="" (
        echo       Kill PID %%A
        taskkill /PID %%A /F >NUL 2>&1
        set "_killed=!_killed!%%A "
      )
    )
  )
  ping -n 3 127.0.0.1 >NUL
) else (
  echo       Port %APP_PORT% libre.
)

echo [1/3] Ouverture du panneau XAMPP...
if exist "%XAMPP_DIR%\xampp-control.exe" (
  tasklist /FI "IMAGENAME eq xampp-control.exe" 2>NUL | find /I "xampp-control.exe" >NUL
  if errorlevel 1 (
    start "" "%XAMPP_DIR%\xampp-control.exe"
  ) else (
    echo       XAMPP Control deja ouvert.
  )
) else (
  echo       xampp-control.exe absent — on continue avec MySQL uniquement.
)

echo [2/3] Demarrage MySQL...
tasklist /FI "IMAGENAME eq mysqld.exe" 2>NUL | find /I "mysqld.exe" >NUL
if errorlevel 1 (
  REM start "titre" : la 1re chaine entre guillemets = titre de fenetre
  start "XAMPP-MySQL" /MIN "%XAMPP_DIR%\mysql_start.bat"
  echo       Demarrage MySQL demande...
) else (
  echo       MySQL deja en cours.
)

REM Attendre le port 3306 (max ~40 s) via netstat (sans PowerShell, sans timeout)
set "_mysql_ok=0"
set /a _wait=0
:wait_mysql
netstat -ano 2>NUL | findstr ":3306" | findstr "LISTENING" >NUL
if not errorlevel 1 (
  set "_mysql_ok=1"
  goto mysql_ready
)
set /a _wait+=1
if !_wait! GEQ 40 goto mysql_fail
REM Attente ~1s sans "timeout" (evite erreur de redirection d'entree)
ping -n 2 127.0.0.1 >NUL
goto wait_mysql

:mysql_fail
echo [ERREUR] MySQL ne repond pas sur le port 3306 apres !_wait! s.
echo          Ouvrez XAMPP Control, demarrez MySQL (Start), puis relancez ce script.
pause
exit /b 1

:mysql_ready
echo       MySQL pret (port 3306).
echo.
echo [3/3] Lancement de l'application...
echo       URL : http://localhost:%APP_PORT%
echo       Profil : http ^(launchSettings.json^)
echo.

REM Profil http = http://localhost:5244 (Properties/launchSettings.json)
dotnet run --project inspect-san.csproj --launch-profile http
set "_app_exit=!ERRORLEVEL!"
echo.
if not "!_app_exit!"=="0" (
  echo [ATTENTION] L'application s'est arretee avec le code !_app_exit!.
  echo             Si dependances manquantes : lancez Installer_Dependances.bat
  echo             Si port occupe : lancez Arreter_Inspect_San.bat puis reessayez.
)
if /I "%INSPECTSAN_NO_PAUSE%"=="1" exit /b !_app_exit!
pause
exit /b !_app_exit!
