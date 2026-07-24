# Inspect-San — Front-end

Application de gestion du **contrôle sanitaire en milieu scolaire** pour la Province Éducationnelle de Kinshasa/Mont-Amba (RDC).

> **Front-end uniquement.** Aucun backend, aucune API réelle, aucune base de données. Les données sont fictives (mock) et stockées en mémoire pendant la session. Un rechargement de la page réinitialise l’état aux données d’origine.

## Stack

- React 18 + Vite
- Zustand (état en mémoire)
- React Router
- Thème **Dasher** (Bootstrap 5) — couleurs, typographie Public Sans, composants UI
- ApexCharts (graphiques)
- Tabler Icons

## Prérequis

- Node.js 18+
- npm 9+

## Installation et lancement

```bash
cd c:\PROJET\inspect-san
npm install
npm run dev
```

Ouvrir l’URL affichée (par défaut http://localhost:5173).

Build de production :

```bash
npm run build
npm run preview
```

Le build est généré dans le dossier `build/` (le dossier `dist/` conserve le template Dasher d’origine).

## Comptes de démonstration

| Identifiant   | Mot de passe | Rôle                   |
|---------------|--------------|------------------------|
| admin         | admin123     | Administrateur système |
| directeur     | dir123       | Directeur Provincial   |
| controleur    | ctrl123      | Contrôleur             |
| secretariat   | sec123       | Agent du Secrétariat   |
| chef          | chef123      | Chef d'établissement   |

Un sélecteur **« Simuler rôle »** dans l’en-tête permet de basculer entre les profils actifs sans se déconnecter.

## Structure du projet

```
inspect-san/
├── public/assets/          # Assets du thème Dasher (CSS, images, libs)
├── dist/                   # Template HTML Dasher d’origine (référence design)
├── scripts/generate-mock.mjs
├── src/
│   ├── components/         # Modal, DataTable, Toast, Pagination…
│   ├── layouts/            # Sidebar, Header, AppLayout
│   ├── mock/               # Fausses données (un fichier par entité)
│   ├── pages/              # Pages fonctionnelles
│   ├── store/useAppStore.js
│   ├── utils/helpers.js
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── README.md
```

## Modules

1. Connexion (simulation)
2. Tableau de bord (compteurs + graphiques selon le rôle)
3. Écoles, Chefs d’établissement, Utilisateurs — CRUD page unique
4. Ordres de mission (signature DP, PDF simulé)
5. Fiches de contrôle (5 sections, validation chef, verrouillage)
6. Rapports d’inspection
7. Accusés de réception
8. Décisions et mesures correctives
9. Statistiques
10. Notifications (cloche)
11. Paramètres (référentiels) + Journal d’activité

## Données mock

Volumes approximatifs : 42 écoles, 62 chefs, 16 utilisateurs, 52 ordres, 72 fiches, 42 rapports, 40 décisions, 32 notifications.

Régénération :

```bash
npm run generate-mock
```

## Notes importantes

- Les uploads (documents, photos) sont **simulés** (métadonnées + aperçu local).
- Les exports PDF/Excel ouvrent un aperçu imprimable ou téléchargent un fichier texte/CSV fictif.
- La suppression d’une école liée à des fiches/rapports est **bloquée** ; la désactivation est proposée.
- Un ordre non signé ne peut pas servir à créer une fiche de contrôle.
