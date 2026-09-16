# Configurer les secrets SMTP (hors git) — Gmail recommandé.
# Usage (PowerShell, à la racine du projet) :
#   .\Set-EmailUserSecrets.ps1 -SmtpUser "ton@gmail.com" -SmtpPassword "mot-de-passe-application"
# Ou interactif :
#   .\Set-EmailUserSecrets.ps1
#
# Important Gmail :
# - Activer la validation en 2 étapes + Mot de passe d'application
# - Email:From DOIT être le même compte que SmtpUser (sinon forcé côté code)
# - Le destinataire (Chef.Email) peut être n'importe quelle adresse

param(
    [string]$SmtpUser = "",
    [string]$SmtpPassword = "",
    [string]$SmtpHost = "smtp.gmail.com",
    [int]$SmtpPort = 587,
    [string]$From = ""
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if ([string]::IsNullOrWhiteSpace($SmtpUser)) {
    $SmtpUser = Read-Host "SmtpUser (ex. ton@gmail.com)"
}
if ([string]::IsNullOrWhiteSpace($SmtpPassword)) {
    $secure = Read-Host "SmtpPassword (mot de passe d'application Gmail)" -AsSecureString
    $SmtpPassword = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
        [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure))
}
if ([string]::IsNullOrWhiteSpace($From)) {
    $From = $SmtpUser
}

dotnet user-secrets set "Email:SmtpHost" $SmtpHost
dotnet user-secrets set "Email:SmtpPort" "$SmtpPort"
dotnet user-secrets set "Email:SmtpUser" $SmtpUser
dotnet user-secrets set "Email:SmtpPassword" $SmtpPassword
dotnet user-secrets set "Email:UseSsl" "true"
dotnet user-secrets set "Email:From" $From
dotnet user-secrets set "Email:FromDisplayName" "Inspect-San"

Write-Host "OK — secrets enregistrés (User Secrets). Redémarre l'app puis teste :" -ForegroundColor Green
Write-Host "  /Home/TestEmail?to=ADRESSE_DIFFERENTE@exemple.com  (admin)"
Write-Host "  Ou : `$env:INSPECTSAN_TEST_TO='autre@mail.com'; dotnet test --filter LiveSmtp"
