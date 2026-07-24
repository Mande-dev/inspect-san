import { appStore } from './store/appStore.js';
import { canAccess } from './utils/helpers.js';
import { renderSidebarHTML, initSidebarListeners } from './layouts/Sidebar.js';
import { renderHeaderHTML, initHeaderListeners } from './layouts/Header.js';
import { renderToastContainerHTML, initToastListeners } from './components/ToastContainer.js';
import { teardownModals } from './components/Modal.js';

import { renderLoginPage, initLoginPageEvents } from './pages/LoginPage.js';
import { renderDashboardPage, initDashboardPageEvents } from './pages/DashboardPage.js';
import { renderEcolesPage, initEcolesPageEvents } from './pages/EcolesPage.js';
import { renderChefsPage, initChefsPageEvents } from './pages/ChefsPage.js';
import { renderUtilisateursPage, initUtilisateursPageEvents } from './pages/UtilisateursPage.js';
import { renderOrdresMissionPage, initOrdresMissionPageEvents } from './pages/OrdresMissionPage.js';
import { renderFichesControlePage, initFichesControlePageEvents } from './pages/FichesControlePage.js';
import { renderRapportsPage, initRapportsPageEvents } from './pages/RapportsPage.js';
import { renderAccusesPage, initAccusesPageEvents } from './pages/AccusesPage.js';
import { renderDecisionsPage, initDecisionsPageEvents } from './pages/DecisionsPage.js';
import { renderStatistiquesPage, initStatistiquesPageEvents } from './pages/StatistiquesPage.js';
import { renderParametresPage, initParametresPageEvents } from './pages/ParametresPage.js';
import { renderJournalPage, initJournalPageEvents } from './pages/JournalPage.js';

const ROUTES = {
  '#/connexion': { render: renderLoginPage, init: initLoginPageEvents, isPublic: true },
  '#/': { render: renderDashboardPage, init: initDashboardPageEvents, pageKey: 'dashboard' },
  '#/ecoles': { render: renderEcolesPage, init: initEcolesPageEvents, pageKey: 'ecoles' },
  '#/chefs': { render: renderChefsPage, init: initChefsPageEvents, pageKey: 'chefs' },
  '#/utilisateurs': { render: renderUtilisateursPage, init: initUtilisateursPageEvents, pageKey: 'utilisateurs' },
  '#/ordres-mission': { render: renderOrdresMissionPage, init: initOrdresMissionPageEvents, pageKey: 'ordres' },
  '#/fiches-controle': { render: renderFichesControlePage, init: initFichesControlePageEvents, pageKey: 'fiches' },
  '#/rapports': { render: renderRapportsPage, init: initRapportsPageEvents, pageKey: 'rapports' },
  '#/accuses': { render: renderAccusesPage, init: initAccusesPageEvents, pageKey: 'accuses' },
  '#/decisions': { render: renderDecisionsPage, init: initDecisionsPageEvents, pageKey: 'decisions' },
  '#/statistiques': { render: renderStatistiquesPage, init: initStatistiquesPageEvents, pageKey: 'statistiques' },
  '#/parametres': { render: renderParametresPage, init: initParametresPageEvents, pageKey: 'parametres' },
  '#/journal': { render: renderJournalPage, init: initJournalPageEvents, pageKey: 'journal' },
};

export class Router {
  constructor(appElement) {
    this.appElement = appElement;
  }

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    appStore.subscribe(() => this.handleRoute());
    this.handleRoute();
  }

  handleRoute() {
    const rawHash = window.location.hash || '#/';
    const hash = rawHash.split('?')[0];

    const route = ROUTES[hash] || ROUTES['#/'];

    // Auth check
    if (!appStore.currentUser && !route.isPublic) {
      window.location.hash = '#/connexion';
      return;
    }

    if (appStore.currentUser && route.isPublic) {
      window.location.hash = '#/';
      return;
    }

    // Role Guard check
    if (route.pageKey && route.pageKey !== 'dashboard') {
      const role = appStore.currentUser?.role;
      if (!canAccess(role, route.pageKey)) {
        window.location.hash = '#/';
        return;
      }
    }

    // Render Page
    teardownModals(this.appElement);

    if (route.isPublic) {
      this.appElement.innerHTML = `
        ${route.render()}
        ${renderToastContainerHTML()}
      `;
      route.init(this.appElement);
      initToastListeners(this.appElement);
    } else {
      this.appElement.innerHTML = `
        <div>
          ${renderSidebarHTML(hash)}
          <div id="content" class="position-relative h-100">
            ${renderHeaderHTML()}
            <div className="custom-container py-6 px-4 px-lg-6" id="pageContainer">
              ${route.render()}
            </div>
          </div>
          ${renderToastContainerHTML()}
        </div>
      `;

      const pageContainer = this.appElement.querySelector('#pageContainer');
      initSidebarListeners(this.appElement);
      initHeaderListeners(this.appElement);
      initToastListeners(this.appElement);
      if (pageContainer && route.init) {
        route.init(pageContainer);
      }
    }
  }
}
