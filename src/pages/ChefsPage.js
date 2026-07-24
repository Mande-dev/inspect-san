import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterEcole: '',
  mode: 'create',
  selectedId: null,
  form: {
    nomComplet: '',
    idDinacope: '',
    ancienneteEnseignement: '',
    ancienneteChef: '',
    ancienneteEcole: '',
    telephone: '',
    ecoleId: '',
  },
};

export function renderChefsPage() {
  const chefs = appStore.chefs;
  const ecoles = appStore.ecoles;

  const ecoleMap = new Map(ecoles.map((e) => [e.id, e]));

  const filteredRows = chefs.filter((c) => {
    if (state.filterEcole && c.ecoleId !== state.filterEcole) return false;
    return true;
  });

  const columns = [
    { key: 'nomComplet', header: 'Nom complet', sortable: true },
    { key: 'idDinacope', header: 'ID DINACOPE' },
    {
      key: 'ecole',
      header: 'École',
      render: (row) => ecoleMap.get(row.ecoleId)?.denomination || '—',
    },
    { key: 'telephone', header: 'Téléphone', render: (row) => row.telephone || '—' },
    { key: 'ancienneteChef', header: 'Ancienneté (chef)', sortable: true },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => `
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" title="Voir" data-action="view" data-id="${row.id}">
            <i class="ti ti-eye"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-primary" title="Modifier" data-action="edit" data-id="${row.id}">
            <i class="ti ti-edit"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" title="Supprimer" data-action="delete" data-id="${row.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `,
    },
  ];

  const filtersHtml = `
    <div class="row g-2">
      <div class="col-md-6">
        <select class="form-select" id="filterEcoleSelect">
          <option value="">Toutes les écoles</option>
          ${ecoles
            .map(
              (e) => `<option value="${e.id}" ${state.filterEcole === e.id ? 'selected' : ''}>${e.denomination}</option>`
            )
            .join('')}
        </select>
      </div>
    </div>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['nomComplet', 'idDinacope', (row) => ecoleMap.get(row.ecoleId)?.denomination || ''],
    searchPlaceholder: 'Rechercher par nom ou par école…',
    emptyMessage: "Aucun chef d'établissement trouvé.",
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: "Chefs d'établissement",
    subtitle: 'Gestion des responsables des établissements scolaires.',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateChefBtn">
        <i class="ti ti-plus me-1"></i> Nouveau chef
      </button>
    `,
  });

  const isView = state.mode === 'view';
  const modalTitle =
    state.mode === 'create'
      ? "Nouveau chef d'établissement"
      : state.mode === 'edit'
      ? "Modifier le chef d'établissement"
      : "Détail du chef d'établissement";

  const modalContentHtml = `
    <form id="chefForm">
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Nom complet ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control"
            id="formNomComplet"
            value="${state.form.nomComplet || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">ID DINACOPE ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control"
            id="formIdDinacope"
            value="${state.form.idDinacope || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
        </div>

        <div class="col-md-6">
          <label class="form-label">École ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formEcoleId" required ${isView ? 'disabled' : ''}>
            <option value="">Sélectionner…</option>
            ${ecoles
              .map(
                (e) =>
                  `<option value="${e.id}" ${state.form.ecoleId === e.id ? 'selected' : ''}>${e.denomination}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Téléphone</label>
          <input
            type="tel"
            class="form-control"
            id="formTelephone"
            value="${state.form.telephone || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Ancienneté (en années)</h6>
        </div>
        <div class="col-md-4">
          <label class="form-label">Enseignement</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteEnseignement"
            value="${state.form.ancienneteEnseignement ?? ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">En tant que chef</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteChef"
            value="${state.form.ancienneteChef ?? ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Dans cette école</label>
          <input
            type="number"
            min="0"
            class="form-control"
            id="formAncienneteEcole"
            value="${state.form.ancienneteEcole ?? ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
      </div>
    </form>
  `;

  const footerHtml = isView
    ? `<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>`
    : `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="chefForm" class="btn btn-primary">Enregistrer</button>
    `;

  const modalHtml = renderModalHTML({
    id: 'chefModal',
    title: modalTitle,
    contentHtml: modalContentHtml,
    footerHtml,
    size: 'lg',
  });

  return `
    <div>
      ${pageHeaderHtml}
      ${dataTableHtml}
      ${modalHtml}
    </div>
  `;
}

export function initChefsPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderChefsPage();
    initChefsPageEvents(container);
  };

  const openFormModal = (mode, chef = null) => {
    state.mode = mode;
    state.selectedId = chef?.id || null;
    if (chef) {
      state.form = {
        nomComplet: chef.nomComplet,
        idDinacope: chef.idDinacope,
        ancienneteEnseignement: chef.ancienneteEnseignement ?? '',
        ancienneteChef: chef.ancienneteChef ?? '',
        ancienneteEcole: chef.ancienneteEcole ?? '',
        telephone: chef.telephone || '',
        ecoleId: chef.ecoleId || '',
      };
    } else {
      state.form = {
        nomComplet: '',
        idDinacope: '',
        ancienneteEnseignement: '',
        ancienneteChef: '',
        ancienneteEcole: '',
        telephone: '',
        ecoleId: '',
      };
    }
    refreshPage();
    openModal('chefModal');
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
      const chef = appStore.chefs.find((c) => c.id === id);
      if (action === 'view') openFormModal('view', chef);
      if (action === 'edit') openFormModal('edit', chef);
      if (action === 'delete') {
        showConfirmDialog({
          title: "Supprimer le chef d'établissement",
          message: 'Voulez-vous vraiment supprimer ce chef d\'établissement ? Cette action est irréversible.',
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteChef(id);
            refreshPage();
          },
        });
      }
    },
  });

  const openBtn = container.querySelector('#openCreateChefBtn');
  if (openBtn) openBtn.addEventListener('click', () => openFormModal('create'));

  const filterEcoleSelect = container.querySelector('#filterEcoleSelect');
  if (filterEcoleSelect) {
    filterEcoleSelect.addEventListener('change', (e) => {
      state.filterEcole = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  const chefForm = container.querySelector('#chefForm');
  if (chefForm) {
    chefForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: state.selectedId,
        nomComplet: container.querySelector('#formNomComplet').value.trim(),
        idDinacope: container.querySelector('#formIdDinacope').value.trim(),
        ecoleId: container.querySelector('#formEcoleId').value || null,
        telephone: container.querySelector('#formTelephone').value.trim() || null,
        ancienneteEnseignement: Number(container.querySelector('#formAncienneteEnseignement').value) || 0,
        ancienneteChef: Number(container.querySelector('#formAncienneteChef').value) || 0,
        ancienneteEcole: Number(container.querySelector('#formAncienneteEcole').value) || 0,
      };

      appStore.upsertChef(payload);
      closeModal('chefModal').then(() => refreshPage());
    });
  }
}
