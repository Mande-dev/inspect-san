export function renderModalHTML({ id, title, contentHtml, footerHtml = '', size = 'lg' }) {
  return `
    <div class="modal fade" id="${id}" tabIndex="-1" aria-hidden="true">
      <div class="modal-dialog modal-${size} modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">${contentHtml}</div>
          ${footerHtml ? `<div class="modal-footer">${footerHtml}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

/** Retire backdrops orphelins et styles body laissés par Bootstrap. */
export function cleanupModalArtifacts() {
  document.querySelectorAll('.modal-backdrop').forEach((el) => el.remove());
  document.body.classList.remove('modal-open');
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('padding-right');
}

/**
 * Dispose les instances Bootstrap encore liées au DOM (à appeler AVANT
 * un innerHTML qui détruit les nœuds .modal).
 */
export function teardownModals(root = document) {
  if (!window.bootstrap?.Modal) {
    cleanupModalArtifacts();
    return;
  }
  root.querySelectorAll('.modal').forEach((el) => {
    const instance = window.bootstrap.Modal.getInstance(el);
    if (instance) instance.dispose();
  });
  cleanupModalArtifacts();
}

export function openModal(id) {
  // Nettoie d'éventuels artefacts d'une modale détruite sans hide() complet
  cleanupModalArtifacts();

  const el = document.getElementById(id);
  if (el && window.bootstrap) {
    const modal = window.bootstrap.Modal.getOrCreateInstance(el, { backdrop: 'static', keyboard: true });
    modal.show();
  }
}

/**
 * Ferme la modale et résout uniquement après hidden.bs.modal + nettoyage body.
 * Safe à appeler avant un refreshPage() qui remplace le DOM.
 */
export function closeModal(id) {
  return new Promise((resolve) => {
    const el = document.getElementById(id);
    if (!el || !window.bootstrap) {
      cleanupModalArtifacts();
      resolve();
      return;
    }

    const modal = window.bootstrap.Modal.getInstance(el);
    if (!modal) {
      cleanupModalArtifacts();
      resolve();
      return;
    }

    // hide() ne déclenche pas hidden.bs.modal si déjà fermée
    if (!el.classList.contains('show')) {
      modal.dispose();
      cleanupModalArtifacts();
      resolve();
      return;
    }

    const finish = () => {
      el.removeEventListener('hidden.bs.modal', finish);
      cleanupModalArtifacts();
      resolve();
    };

    el.addEventListener('hidden.bs.modal', finish);
    modal.hide();
  });
}
