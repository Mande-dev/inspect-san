export function renderPaginationHTML({ page, totalPages, total, pageSize }) {
  if (total === 0) {
    return `<p class="text-secondary mb-0 mt-3">Aucun résultat.</p>`;
  }

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const pagesArray = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);

  return `
    <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-4">
      <span class="text-secondary small">
        Affichage ${from}–${to} sur ${total}
      </span>
      <nav>
        <ul class="pagination mb-0">
          <li class="page-item ${page <= 1 ? 'disabled' : ''}">
            <button type="button" class="page-link" data-page="${page - 1}">
              Précédent
            </button>
          </li>
          ${pagesArray
            .map((p) =>
              p === '…'
                ? `<li class="page-item disabled"><span class="page-link">…</span></li>`
                : `<li class="page-item ${p === page ? 'active' : ''}">
                     <button type="button" class="page-link" data-page="${p}">${p}</button>
                   </li>`
            )
            .join('')}
          <li class="page-item ${page >= totalPages ? 'disabled' : ''}">
            <button type="button" class="page-link" data-page="${page + 1}">
              Suivant
            </button>
          </li>
        </ul>
      </nav>
    </div>
  `;
}
