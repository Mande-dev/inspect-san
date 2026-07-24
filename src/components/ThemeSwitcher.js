const THEME_KEY = 'theme';

function getStoredTheme() {
  return localStorage.getItem(THEME_KEY);
}

function getPreferredTheme() {
  const stored = getStoredTheme();
  if (stored) return stored;
  return 'auto';
}

export function applyTheme(theme) {
  if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-bs-theme', 'dark');
  } else if (theme === 'auto') {
    document.documentElement.setAttribute('data-bs-theme', 'light');
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }
}

const OPTIONS = [
  { value: 'light', label: 'Clair', icon: 'ti-sun', hint: 'Toujours clair' },
  { value: 'dark', label: 'Sombre', icon: 'ti-moon-stars', hint: 'Toujours sombre' },
  { value: 'auto', label: 'Système', icon: 'ti-circle-half-2', hint: 'Suivre l’appareil' },
];

function getActiveIcon(theme) {
  if (theme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'ti-moon-stars'
      : 'ti-sun';
  }
  return OPTIONS.find((o) => o.value === theme)?.icon || 'ti-sun';
}

function renderOptionButton(opt, currentTheme) {
  const isActive = currentTheme === opt.value;
  return `
    <li>
      <button
        type="button"
        class="dropdown-item theme-switcher-item d-flex align-items-center ${isActive ? 'active' : ''}"
        data-theme-value="${opt.value}"
        aria-pressed="${isActive}"
      >
        <span class="theme-switcher-item-icon">
          <i class="ti theme-icon ${opt.icon}"></i>
        </span>
        <span class="theme-switcher-item-text">
          <span class="theme-switcher-item-label">${opt.label}</span>
          <span class="theme-switcher-item-hint">${opt.hint}</span>
        </span>
        <i class="ti ti-check theme-switcher-check ${isActive ? '' : 'invisible'}" aria-hidden="true"></i>
      </button>
    </li>
  `;
}

export function renderThemeSwitcherHTML() {
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);
  const activeIcon = getActiveIcon(currentTheme);

  return `
    <li class="theme-switcher">
      <div class="dropdown">
        <button
          class="btn theme-switcher-btn"
          type="button"
          aria-expanded="false"
          data-bs-toggle="dropdown"
          aria-label="Changer le thème"
          title="Thème"
        >
          <i class="ti theme-icon-active ${activeIcon}"></i>
          <span class="visually-hidden bs-theme-text">Changer le thème</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end shadow-sm theme-switcher-menu">
          <li>
            <h6 class="dropdown-header theme-switcher-header">Apparence</h6>
          </li>
          ${OPTIONS.map((opt) => renderOptionButton(opt, currentTheme)).join('')}
        </ul>
      </div>
    </li>
  `;
}

export function initThemeSwitcherListeners(container) {
  if (!container) return;
  const root = container.querySelector('.theme-switcher') || container;
  const buttons = root.querySelectorAll('[data-theme-value]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const value = btn.getAttribute('data-theme-value');
      localStorage.setItem(THEME_KEY, value);
      applyTheme(value);

      buttons.forEach((b) => {
        const isCurrent = b.getAttribute('data-theme-value') === value;
        b.classList.toggle('active', isCurrent);
        b.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
        const check = b.querySelector('.theme-switcher-check');
        if (check) check.classList.toggle('invisible', !isCurrent);
      });

      const iconEl = root.querySelector('.theme-icon-active');
      if (iconEl) {
        iconEl.className = `ti theme-icon-active ${getActiveIcon(value)}`;
      }
    });
  });
}
