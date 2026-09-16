@echo off
setlocal EnableExtensions
title Inspect-San — Installation des dependances
echo ===================================================
echo   Installation des dependances Inspect-San
echo ===================================================
echo.
cd /d "%~dp0"

where dotnet >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] .NET SDK introuvable. Installez .NET 8 :
    echo          https://dotnet.microsoft.com/download
    goto :fin
)

for /f "tokens=*" %%V in ('dotnet --version 2^>nul') do set "DOTNET_VER=%%V"
echo SDK .NET detecte : %DOTNET_VER%
echo.

echo Packages du projet principal (inspect-san.csproj) :
echo   - Microsoft.AspNetCore.Identity.EntityFrameworkCore 8.0.11
echo   - Microsoft.EntityFrameworkCore.Design               8.0.11
echo   - Pomelo.EntityFrameworkCore.MySql                   8.0.3
echo   - Microsoft.Playwright                               1.49.0  ^(PDF OM/LD^)
echo.
echo Packages des tests (inspect-san.Tests.csproj) :
echo   - coverlet.collector                     6.0.0
echo   - FluentAssertions                       6.12.0
echo   - Microsoft.AspNetCore.Mvc.Testing       8.0.11
echo   - Microsoft.EntityFrameworkCore.InMemory 8.0.11
echo   - Microsoft.NET.Test.Sdk                 17.8.0
echo   - xunit                                  2.5.3
echo   - xunit.runner.visualstudio              2.5.3
echo.

echo [1/4] Ajout / mise a jour des packages du projet principal...
dotnet add inspect-san.csproj package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.csproj package Microsoft.EntityFrameworkCore.Design --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.csproj package Pomelo.EntityFrameworkCore.MySql --version 8.0.3
if errorlevel 1 goto :err
dotnet add inspect-san.csproj package Microsoft.Playwright --version 1.49.0
if errorlevel 1 goto :err
echo.

echo [2/4] Ajout / mise a jour des packages du projet de tests...
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package coverlet.collector --version 6.0.0
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package FluentAssertions --version 6.12.0
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package Microsoft.AspNetCore.Mvc.Testing --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package Microsoft.EntityFrameworkCore.InMemory --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package Microsoft.NET.Test.Sdk --version 17.8.0
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package xunit --version 2.5.3
if errorlevel 1 goto :err
dotnet add inspect-san.Tests\inspect-san.Tests.csproj package xunit.runner.visualstudio --version 2.5.3
if errorlevel 1 goto :err
echo.

echo [3/4] Restauration + compilation...
dotnet restore inspect-san.sln
if errorlevel 1 goto :err
dotnet build inspect-san.csproj -c Debug --nologo -v q
if errorlevel 1 goto :err
echo.

echo [4/4] Installation Chromium ^(Playwright — PDF ordre de mission / lettre de decision^)...
set "PW_PS1=%~dp0bin\Debug\net8.0\playwright.ps1"
if exist "%PW_PS1%" (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%PW_PS1%" install chromium
  if errorlevel 1 (
    echo [ATTENTION] Echec install Chromium via playwright.ps1 — nouvelle tentative...
    dotnet exec "%~dp0bin\Debug\net8.0\Microsoft.Playwright.dll" install chromium 2>nul
    if errorlevel 1 (
      echo [ATTENTION] Chromium non installe automatiquement.
      echo             Les PDF OM/LD echoueront jusqu'a :
      echo             powershell -File bin\Debug\net8.0\playwright.ps1 install chromium
    ) else (
      echo       Chromium OK ^(dotnet exec^).
    )
  ) else (
    echo       Chromium OK.
  )
) else (
  echo [ATTENTION] playwright.ps1 introuvable apres build.
  echo             Relancez ce script ou compilez : dotnet build
)

echo.
echo ===================================================
echo   Termine. Dependances NuGet + Playwright traites.
echo   Lancez ensuite : Lancer_Inspect_San.bat
echo ===================================================
goto :fin

:err
echo.
echo [ERREUR] Echec lors de l'installation / restauration.
exit /b 1

:fin
echo.
if /I "%INSPECTSAN_NO_PAUSE%"=="1" exit /b 0
pause
exit /b 0
