@echo off
title Inspect-San — Installation des dependances
echo ===================================================
echo   Installation des packages NuGet Inspect-San
echo ===================================================
echo.
cd /d "%~dp0"

where dotnet >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] .NET SDK introuvable. Installez .NET 8 : https://dotnet.microsoft.com/download
    goto :fin
)

echo Packages du projet principal (inspect-san.csproj) :
echo   - Microsoft.AspNetCore.Identity.EntityFrameworkCore 8.0.11
echo   - Microsoft.EntityFrameworkCore.Design               8.0.11
echo   - Pomelo.EntityFrameworkCore.MySql                   8.0.3
echo.
echo Packages des tests (inspect-san.Tests.csproj) :
echo   - coverlet.collector                    6.0.0
echo   - FluentAssertions                      6.12.0
echo   - Microsoft.AspNetCore.Mvc.Testing      8.0.11
echo   - Microsoft.EntityFrameworkCore.InMemory 8.0.11
echo   - Microsoft.NET.Test.Sdk                17.8.0
echo   - xunit                                 2.5.3
echo   - xunit.runner.visualstudio             2.5.3
echo.

echo [1/3] Ajout des packages du projet principal...
dotnet add inspect-san.csproj package Microsoft.AspNetCore.Identity.EntityFrameworkCore --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.csproj package Microsoft.EntityFrameworkCore.Design --version 8.0.11
if errorlevel 1 goto :err
dotnet add inspect-san.csproj package Pomelo.EntityFrameworkCore.MySql --version 8.0.3
if errorlevel 1 goto :err
echo.

echo [2/3] Ajout des packages du projet de tests...
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

echo [3/3] Restauration de la solution...
dotnet restore inspect-san.sln
if errorlevel 1 goto :err

echo.
echo ===================================================
echo   Termine. Packages .NET installes / restaures.
echo   Lancez ensuite : Lancer_Inspect_San.bat
echo ===================================================
goto :fin

:err
echo.
echo [ERREUR] Echec lors de l'installation d'un package.

:fin
echo.
pause
