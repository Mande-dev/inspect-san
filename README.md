# Inspect-San

Application de gestion du **contrôle sanitaire en milieu scolaire** — Province Éducationnelle de Kinshasa/Mont-Amba (RDC).

## Architecture actuelle

```
inspect-san/                 ← racine = projet ASP.NET Core MVC
├── Controllers/
├── Views/                   ← Razor (.cshtml) + jQuery
├── Services/Mock/           ← données fictives en mémoire
├── wwwroot/assets/          ← thème Dasher
├── inspect-san.csproj
├── inspect-san.sln
├── frontend/                ← ancienne app Vite (référence, non utilisée en prod MVC)
├── README.md
└── .gitignore
```

> **MVC + Razor + jQuery** : application principale.  
> **Données mock** en mémoire (pas encore de SQL / Web API).  
> **`frontend/`** : ancienne version Vite conservée comme référence visuelle / métier.

## Prérequis

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- (Optionnel) Node.js si vous consultez encore `frontend/`

## Lancer l’application MVC

```bash
cd C:\PROJET\inspect-san
dotnet restore
dotnet run
```

Ouvrir l’URL affichée (ex. `https://localhost:7xxx` ou `http://localhost:5xxx`).

## Compte administrateur

| E-mail | Mot de passe | Rôle |
|--------|--------------|------|
| `admin@inspect-san.cd` | `admin123` | Administrateur système |

Connexion **par e-mail**. Les autres comptes se créent via **Utilisateurs** (nom, rôle, e-mail, mot de passe + confirmation).  
Selon le rôle : **Contrôleur** → équipe obligatoire ; **Chef d'établissement** → école obligatoire.

Le sélecteur **« Simuler rôle »** (dev) liste les comptes présents en base.

## Ancienne app Vite

```bash
cd frontend
npm install
npm run dev
```

## Suite prévue

Backend réel (EF Core / SQL + authentification renforcée) pourra remplacer le store mock sans changer le design des vues.
