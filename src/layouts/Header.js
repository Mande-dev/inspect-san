import { appStore } from '../store/appStore.js';
import { formatDateTime } from '../utils/helpers.js';
import { renderThemeSwitcherHTML, initThemeSwitcherListeners } from '../components/ThemeSwitcher.js';

export function renderHeaderHTML() {
  const user = appStore.currentUser;
  const utilisateurs = appStore.utilisateurs;
  const notifications = appStore.notifications;
  const myNotifs = notifications.slice(0, 12);
  const unread = notifications.filter((n) => !n.lu).length;

  const roleOptionsHtml = utilisateurs
    .filter((u) => u.statut === 'actif')
    .map(
      (u) => `
      <option value="${u.id}" ${u.id === user?.id ? 'selected' : ''}>
        ${u.role} — ${u.nom}
      </option>
    `
    )
    .join('');

  const notificationsListHtml =
    myNotifs.length === 0
      ? `<div class="p-3 text-secondary">Aucune notification</div>`
      : myNotifs
          .map(
            (n) => `
        <button
          type="button"
          class="dropdown-item text-wrap py-3 ${n.lu ? '' : 'bg-light'}"
          data-notif-id="${n.id}"
        >
          <div class="fw-semibold">${n.titre}</div>
          <div class="small text-secondary">${n.message}</div>
          <div class="small text-muted mt-1">${formatDateTime(n.createdAt)}</div>
        </button>
      `
          )
          .join('');

  return `
    <div class="navbar-glass navbar navbar-expand-lg px-0 px-lg-4">
      <div class="container-fluid px-lg-0">
        <div class="d-flex align-items-center gap-4">
          <div class="d-block d-lg-none">
            <a
              class="text-inherit"
              data-bs-toggle="offcanvas"
              href="#offcanvasExample"
              role="button"
              aria-controls="offcanvasExample"
            >
              <i class="ti ti-menu-2 fs-4"></i>
            </a>
          </div>
          <div class="d-none d-lg-block">
            <a class="sidebar-toggle d-flex texttooltip p-3" id="sidebarToggleBtn" href="#!">
              <span class="collapse-mini">
                <i class="ti ti-arrow-bar-left text-secondary"></i>
              </span>
              <span class="collapse-expanded">
                <i class="ti ti-arrow-bar-right text-secondary"></i>
              </span>
            </a>
          </div>
          <div class="d-none d-md-block">
            <span class="text-secondary small">Province Éducationnelle</span>
            <div class="fw-semibold">Kinshasa / Mont-Amba</div>
          </div>
        </div>

        <ul class="list-unstyled d-flex align-items-center mb-0 gap-2 gap-lg-3">
          <li class="d-none d-xl-block">
            <div class="d-flex align-items-center gap-2">
              <label class="form-label mb-0 small text-secondary" for="roleSwitchSelect">
                Simuler rôle
              </label>
              <select
                id="roleSwitchSelect"
                class="form-select form-select-sm"
                style="min-width: 220px;"
              >
                ${roleOptionsHtml}
              </select>
            </div>
          </li>

          ${renderThemeSwitcherHTML()}

          <li class="dropdown position-relative">
            <button
              type="button"
              class="btn btn-ghost btn-icon position-relative"
              id="notifDropdownToggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              aria-label="Notifications"
            >
              <i class="ti ti-bell fs-4"></i>
              ${
                unread > 0
                  ? `<span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      ${unread > 9 ? '9+' : unread}
                    </span>`
                  : ''
              }
            </button>
            <div
              class="dropdown-menu dropdown-menu-end p-0 shadow"
              style="width: 360px; max-height: 420px; overflow: auto; right: 0; left: auto;"
            >
              <div class="d-flex justify-content-between align-items-center px-3 py-2 border-bottom">
                <strong>Notifications</strong>
                <button type="button" class="btn btn-link btn-sm" id="markAllReadBtn">
                  Tout marquer lu
                </button>
              </div>
              <div id="notifListContainer">
                ${notificationsListHtml}
              </div>
            </div>
          </li>

          <li class="dropdown">
            <a
              class="dropdown-toggle d-flex align-items-center gap-2 text-decoration-none"
              href="#!"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                src="/assets/images/avatar/avatar-1.jpg"
                alt=""
                class="avatar avatar-sm rounded-circle"
              />
              <span class="d-none d-md-inline text-body">${user?.nom?.split(' ').slice(0, 2).join(' ') || ''}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item-text small text-secondary">${user?.role || ''}</span>
              </li>
              <li><hr class="dropdown-divider" /></li>
              <li>
                <a class="dropdown-item" href="#/parametres">Paramètres</a>
              </li>
              <li>
                <button type="button" class="dropdown-item text-danger" id="logoutBtn">
                  Déconnexion
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  `;
}

export function initHeaderListeners(container) {
  if (!container) return;

  initThemeSwitcherListeners(container);

  const toggleBtn = container.querySelector('#sidebarToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const expanded = document.documentElement.classList.contains('expanded');
      if (expanded) {
        document.documentElement.classList.remove('expanded');
        document.documentElement.classList.add('collapsed');
        localStorage.setItem('sidebarExpanded', 'false');
      } else {
        document.documentElement.classList.remove('collapsed');
        document.documentElement.classList.add('expanded');
        localStorage.setItem('sidebarExpanded', 'true');
      }
    });
  }

  const roleSelect = container.querySelector('#roleSwitchSelect');
  if (roleSelect) {
    roleSelect.addEventListener('change', (e) => {
      appStore.switchRoleUser(e.target.value);
    });
  }

  const markAllBtn = container.querySelector('#markAllReadBtn');
  if (markAllBtn) {
    markAllBtn.addEventListener('click', () => {
      appStore.markAllNotificationsRead();
    });
  }

  const notifItems = container.querySelectorAll('[data-notif-id]');
  notifItems.forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.getAttribute('data-notif-id');
      appStore.markNotificationRead(id);
    });
  });

  const logoutBtn = container.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      appStore.logout();
      window.location.hash = '#/connexion';
    });
  }
}
