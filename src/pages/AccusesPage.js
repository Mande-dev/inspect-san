import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { RAPPORT_STATUTS } from '../mock/constantes.js';
import { formatDateTime } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  statutFiltre: '',
};

export function renderAccusesPage() {
  const rapports = appStore.rapports;
  const ecoles = appStore.ecoles;

  const ecoleName = (id) => ecoles.find((e) => e.id === id)?.denomination || '—';

  let filteredRows = rapports.filter((r) => r.statut === 'depose' || r.statut === 'recu');
  if (state.statutFiltre) {
    filteredRows = filteredRows.filter((r) => r.statut === state.statutFiltre);
  }

  const columns = [
    { key: 'numero', header: 'N° Rapport', sortable: true },
    { key: 'ecole', header: 'École', sortKey: 'ecoleId', render: (r) => ecoleName(r.ecoleId) },
    { key: 'deposeLe', header: 'Déposé le', sortable: true, render: (r) => formatDateTime(r.deposeLe) },
    {
      key: 'accuseReceptionLe',
      header: 'Accusé délivré le',
      render: (r) => formatDateTime(r.accuseReceptionLe),
    },
    {
      key: 'statut',
      header: 'Statut',
      render: (r) => renderStatusBadgeHTML(RAPPORT_STATUTS, r.statut),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => `
        <div class="d-flex gap-2">
          ${
            r.statut === 'depose'
              ? `<button type="button" class="btn btn-sm btn-outline-primary" data-action="accuse" data-id="${r.id}">
                  <i class="ti ti-mail-check me-1"></i> Délivrer l'accusé
                </button>`
              : ''
          }
          ${
            r.statut === 'recu'
              ? `<button type="button" class="btn btn-sm btn-outline-success" data-action="transmission" data-id="${r.id}">
                  <i class="ti ti-send me-1"></i> Transmettre au Directeur Provincial
                </button>`
              : ''
          }
        </div>
      `,
    },
  ];

  const filtersHtml = `
    <select class="form-select" id="filterStatutFiltre">
      <option value="">Tous les statuts</option>
      <option value="depose" ${state.statutFiltre === 'depose' ? 'selected' : ''}>Déposé (en attente d'accusé)</option>
      <option value="recu" ${state.statutFiltre === 'recu' ? 'selected' : ''}>Reçu (en attente de transmission)</option>
    </select>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['numero', (r) => ecoleName(r.ecoleId)],
    searchPlaceholder: 'Rechercher un rapport ou une école…',
    emptyMessage: "Aucun rapport en attente d'accusé ou de transmission.",
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Accusés de réception',
    subtitle: 'Délivrance des accusés de réception et transmission des rapports au Directeur Provincial.',
  });

  return `
    <div>
      ${pageHeaderHtml}
      ${dataTableHtml}
    </div>
  `;
}

export function initAccusesPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    container.innerHTML = renderAccusesPage();
    initAccusesPageEvents(container);
  };

  initDataTableEvents(container, {
    onSearch: (val) => {
      state.q = val;
      state.page = 1;
      refreshPage();
    },
    onPageChange: (p) => {
      state.page = p;
      refreshPage();
    },
    onSortChange: (key) => {
      if (state.sortKey === key) state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
      else {
        state.sortKey = key;
        state.sortDir = 'asc';
      }
      refreshPage();
    },
    onActionClick: (action, id) => {
      const rapport = appStore.rapports.find((r) => r.id === id);
      if (action === 'accuse') {
        showConfirmDialog({
          title: "Délivrer l'accusé de réception",
          message: `Confirmez-vous la délivrance de l'accusé de réception pour le rapport ${rapport?.numero} ?`,
          confirmLabel: 'Confirmer',
          onConfirm: () => {
            appStore.delivrerAccuse(id);
            refreshPage();
          },
        });
      }
      if (action === 'transmission') {
        showConfirmDialog({
          title: 'Transmettre le rapport',
          message: `Confirmez-vous la transmission du rapport ${rapport?.numero} au Directeur Provincial ?`,
          confirmLabel: 'Confirmer',
          onConfirm: () => {
            appStore.transmettreRapport(id);
            refreshPage();
          },
        });
      }
    },
  });

  const filterSelect = container.querySelector('#filterStatutFiltre');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.statutFiltre = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }
}
