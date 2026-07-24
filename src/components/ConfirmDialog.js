export function showConfirmDialog({ title, message, confirmLabel = 'Confirmer', danger = false, onConfirm, onCancel }) {
  let existing = document.getElementById('globalConfirmDialog');
  if (existing) existing.remove();

  const dialogHtml = `
    <div class="modal fade show d-block" id="globalConfirmDialog" style="background: rgba(0,0,0,.45);" role="dialog">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${title}</h5>
            <button type="button" class="btn-close" id="confirmDialogCloseBtn" aria-label="Fermer"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">${message}</p>
          </div>
          <div class="modal-footer">
            <button type="button" className="btn btn-outline-secondary" id="confirmDialogCancelBtn">
              Annuler
            </button>
            <button type="button" class="btn ${danger ? 'btn-danger' : 'btn-primary'}" id="confirmDialogOkBtn">
              ${confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', dialogHtml);
  const container = document.getElementById('globalConfirmDialog');

  const close = () => {
    container.remove();
  };

  document.getElementById('confirmDialogCancelBtn').addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });
  document.getElementById('confirmDialogCloseBtn').addEventListener('click', () => {
    close();
    if (onCancel) onCancel();
  });
  document.getElementById('confirmDialogOkBtn').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });
}
