import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { formatDateTime } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  utilisateurId: '',
  module: '',
  dateFrom: '',
  dateTo: '',
};

export function renderJournalPage() {
  const journalActivite = appStore.journalActivite;
  const utilisateurs = appStore.utilisateurs;

  const userName = (id) => utilisateurs.find((u) => u.id === id)?.nom || 'Système';
  const modules = Array.from(new Set(journalActivite.map((l) => l.module))).sort((a, b) => a.localeCompare(b, 'fr'));

  const rows = [...journalActivite]
    .filter((log) => !state.utilisateurId || log.utilisateurId === state.utilisateurId)
    .filter((log) => !state.module || log.module === state.module)
    .filter((log) => {
      if (!state.dateFrom && !state.dateTo) return true;
      const d = new Date(log.createdAt);
      if (state.dateFrom && d < new Date(state.dateFrom)) return false;
      if (state.dateTo && d > new Date(`${state.dateTo}T23:59:59`)) return false;
      return true;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((log) => ({ ...log, userName: userName(log.utilisateurId) }));

  const columns = [
    { key: 'createdAt', header: 'Date et heure', sortable: true, render: (l) => formatDateTime(l.createdAt) },
    { key: 'userName', header: 'Utilisateur', sortable: true },
    { key: 'module', header: 'Module', sortable: true },
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: (l) => `<span class="text-capitalize">${l.action}</span>`,
    },
    { key: 'detail', header: 'Détail' },
  ];

  const filtersHtml = `
    <div class="row g-2">
      <div class="col-md-3">
        <select class="form-select" id="filterUtilisateur">
          <option value="">Tous les utilisateurs</option>
          ${utilisateurs
            .map(
              (u) => `<option value="${u.id}" ${state.utilisateurId === u.id ? 'selected' : ''}>${u.nom}</option>`
            )
            .join('')}
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" id="filterModule">
          <option value="">Tous les modules</option>
          ${modules
            .map((m) => `<option value="${m}" ${state.module === m ? 'selected' : ''}>${m}</option>`)
            .join('')}
        </select>
      </div>
      <div class="col-md-3">
        <input
          type="date"
          class="form-control"
          id="filterDateFromJ"
          value="${state.dateFrom}"
          title="Du"
        />
      </div>
      <div class="col-md-3">
        <input
          type="date"
          class="form-control"
          id="filterDateToJ"
          value="${state.dateTo}"
          title="Au"
        />
      </div>
    </div>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows,
    searchKeys: ['detail', 'module', 'action', 'userName'],
    searchPlaceholder: 'Rechercher dans le journal…',
    emptyMessage: 'Aucune activité ne correspond aux filtres sélectionnés.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: "Journal d'activité",
    subtitle: "Historique consultable en lecture seule de toutes les actions effectuées dans l'application.",
  });

  return `
    <div>
      ${pageHeaderHtml}
      ${dataTableHtml}
    </div>
  `;
}

export function initJournalPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    container.innerHTML = renderJournalPage();
    initJournalPageEvents(container);
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
  });

  ['filterUtilisateur', 'filterModule', 'filterDateFromJ', 'filterDateToJ'].forEach((id) => {
    const el = container.querySelector(`#${id}`);
    if (el) {
      el.addEventListener('change', (e) => {
        if (id === 'filterUtilisateur') state.utilisateurId = e.target.value;
        if (id === 'filterModule') state.module = e.target.value;
        if (id === 'filterDateFromJ') state.dateFrom = e.target.value;
        if (id === 'filterDateToJ') state.dateTo = e.target.value;
        state.page = 1;
        refreshPage();
      });
    }
  });
}
