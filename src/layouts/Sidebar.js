import { appStore } from '../store/appStore.js';
import { canAccess } from '../utils/helpers.js';
import { renderAppLogoHTML } from '../components/AppLogo.js';

const NAV = [
  { key: 'dashboard', to: '#/', label: 'Tableau de bord', icon: 'ti-layout-dashboard' },
  { key: 'ecoles', to: '#/ecoles', label: 'Écoles', icon: 'ti-building-community' },
  { key: 'chefs', to: '#/chefs', label: "Chefs d'établissement", icon: 'ti-user-star' },
  { key: 'utilisateurs', to: '#/utilisateurs', label: 'Utilisateurs', icon: 'ti-users' },
  { key: 'ordres', to: '#/ordres-mission', label: 'Ordres de mission', icon: 'ti-file-certificate' },
  { key: 'fiches', to: '#/fiches-controle', label: 'Fiches de contrôle', icon: 'ti-clipboard-check' },
  { key: 'rapports', to: '#/rapports', label: "Rapports d'inspection", icon: 'ti-report-analytics' },
  { key: 'accuses', to: '#/accuses', label: 'Accusés de réception', icon: 'ti-mail-check' },
  { key: 'decisions', to: '#/decisions', label: 'Décisions', icon: 'ti-gavel' },
  { key: 'statistiques', to: '#/statistiques', label: 'Statistiques', icon: 'ti-chart-histogram' },
  { key: 'parametres', to: '#/parametres', label: 'Paramètres', icon: 'ti-settings' },
  { key: 'journal', to: '#/journal', label: "Journal d'activité", icon: 'ti-history' },
];

export function renderSidebarHTML(currentPath = '#/') {
  const user = appStore.currentUser;
  const role = user?.role;

  const navItemsHtml = NAV.filter((item) => canAccess(role, item.key))
    .map((item) => {
      const isActive = currentPath === item.to || (item.to === '#/' && (currentPath === '' || currentPath === '#/'));
      return `
        <li class="nav-item">
          <a href="${item.to}" class="nav-link ${isActive ? 'active' : ''}">
            <span class="nav-icon">
              <i class="ti ${item.icon}" style="font-size: 20px;"></i>
            </span>
            <span class="text">${item.label}</span>
          </a>
        </li>
      `;
    })
    .join('');

  return `
    <div id="miniSidebar">
      <div class="brand-logo">
        ${renderAppLogoHTML({ variant: 'sidebar' })}
      </div>
      <ul class="navbar-nav flex-column">
        <li class="nav-item">
          <div class="nav-heading">Navigation</div>
          <hr class="mx-5 nav-line mb-1" />
        </li>
        ${navItemsHtml}
        <li>
          <div class="text-center py-5 upgrade-ui">
            <div>
              <img src="/assets/images/avatar/avatar-1.jpg" alt="" class="avatar avatar-md rounded-circle" />
              <div class="my-3">
                <h5 class="mb-1 fs-6">${user?.nom || ''}</h5>
                <span class="text-secondary">${user?.role || ''}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div
      class="offcanvasNav offcanvas offcanvas-start"
      tabIndex="-1"
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div class="offcanvas-header">
        ${renderAppLogoHTML({ variant: 'offcanvas' })}
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body p-0">
        <ul class="navbar-nav flex-column">
          <li class="nav-item">
            <div class="nav-heading">Navigation</div>
            <hr class="mx-5 nav-line mb-1" />
          </li>
          ${navItemsHtml}
          <li>
            <div class="text-center py-5 upgrade-ui">
              <div>
                <img src="/assets/images/avatar/avatar-1.jpg" alt="" class="avatar avatar-md rounded-circle" />
                <div class="my-3">
                  <h5 class="mb-1 fs-6">${user?.nom || ''}</h5>
                  <span class="text-secondary">${user?.role || ''}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  `;
}

export function initSidebarListeners(container) {
  if (!container) return;
  const offcanvasEl = document.getElementById('offcanvasExample');
  if (offcanvasEl) {
    const navLinks = offcanvasEl.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.bootstrap) {
          const inst = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (inst) inst.hide();
        }
      });
    });
  }
}
