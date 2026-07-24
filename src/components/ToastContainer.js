import { appStore } from '../store/appStore.js';

export function renderToastContainerHTML() {
  const toasts = appStore.toasts;
  return `
    <div className="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1090">
      ${toasts
        .map(
          (t) => `
        <div class="toast show align-items-center text-bg-${t.type} border-0 mb-2" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body">${t.message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-toast-id="${t.id}" aria-label="Fermer"></button>
          </div>
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

export function initToastListeners(container) {
  if (!container) return;
  const buttons = container.querySelectorAll('[data-toast-id]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-toast-id');
      appStore.removeToast(id);
    });
  });
}
