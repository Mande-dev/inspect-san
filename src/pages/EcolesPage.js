import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { ECOLE_STATUTS } from '../mock/constantes.js';
import { formatDate } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterCommune: '',
  filterRegime: '',
  filterStatut: '',
  mode: 'create', // 'create' | 'edit' | 'view'
  selectedId: null,
  form: {
    denomination: '',
    regime: '',
    idDinacope: '',
    numAgrement: '',
    numNotification: '',
    documents: [],
    adresse: { commune: '', quartier: '', avenue: '', numero: '' },
    statut: 'active',
  },
  errors: {},
};

function formatTaille(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
}

export function renderEcolesPage() {
  const ecoles = appStore.ecoles;
  const communes = appStore.communes;
  const regimes = appStore.regimes;

  const filteredRows = ecoles.filter((e) => {
    if (state.filterCommune && e.adresse?.commune !== state.filterCommune) return false;
    if (state.filterRegime && e.regime !== state.filterRegime) return false;
    if (state.filterStatut && e.statut !== state.filterStatut) return false;
    return true;
  });

  const columns = [
    { key: 'denomination', header: 'Dénomination', sortable: true },
    { key: 'regime', header: 'Régime', sortable: true },
    { key: 'commune', header: 'Commune', render: (row) => row.adresse?.commune || '—' },
    { key: 'idDinacope', header: 'ID DINACOPE' },
    {
      key: 'statut',
      header: 'Statut',
      render: (row) => renderStatusBadgeHTML(ECOLE_STATUTS, row.statut),
    },
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
      <div class="col-md-4">
        <select class="form-select" id="filterCommune">
          <option value="">Toutes les communes</option>
          ${communes
            .map((c) => `<option value="${c.nom}" ${state.filterCommune === c.nom ? 'selected' : ''}>${c.nom}</option>`)
            .join('')}
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" id="filterRegime">
          <option value="">Tous les régimes</option>
          ${regimes
            .map((r) => `<option value="${r.nom}" ${state.filterRegime === r.nom ? 'selected' : ''}>${r.nom}</option>`)
            .join('')}
        </select>
      </div>
      <div class="col-md-4">
        <select class="form-select" id="filterStatut">
          <option value="">Tous les statuts</option>
          ${Object.entries(ECOLE_STATUTS)
            .map(
              ([v, label]) => `<option value="${v}" ${state.filterStatut === v ? 'selected' : ''}>${label}</option>`
            )
            .join('')}
        </select>
      </div>
    </div>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['denomination', 'idDinacope', 'regime', (row) => row.adresse?.commune || ''],
    searchPlaceholder: 'Rechercher une école (dénomination, commune, régime)…',
    emptyMessage: 'Aucune école trouvée.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Écoles',
    subtitle: 'Gestion des établissements scolaires soumis au contrôle sanitaire.',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle école
      </button>
    `,
  });

  const isView = state.mode === 'view';
  const selectedEcole = appStore.ecoles.find((e) => e.id === state.selectedId);
  const fichesSelected = selectedEcole
    ? appStore.fichesControle.filter((f) => f.ecoleId === selectedEcole.id)
    : [];

  const modalTitle =
    state.mode === 'create' ? 'Nouvelle école' : state.mode === 'edit' ? "Modifier l'école" : "Détail de l'école";

  const modalContentHtml = `
    <form id="ecoleForm">
      <div class="row g-3">
        <div class="col-md-8">
          <label class="form-label">Dénomination ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control"
            id="formDenomination"
            value="${state.form.denomination || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Régime ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formRegime" required ${isView ? 'disabled' : ''}>
            <option value="">Sélectionner…</option>
            ${regimes
              .map(
                (r) => `<option value="${r.nom}" ${state.form.regime === r.nom ? 'selected' : ''}>${r.nom}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="col-md-4">
          <label class="form-label">ID DINACOPE ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control ${state.errors.idDinacope ? 'is-invalid' : ''}"
            id="formIdDinacope"
            value="${state.form.idDinacope || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
          ${state.errors.idDinacope ? `<div class="invalid-feedback">${state.errors.idDinacope}</div>` : ''}
        </div>
        <div class="col-md-4">
          <label class="form-label">N° agrément</label>
          <input
            type="text"
            class="form-control"
            id="formNumAgrement"
            value="${state.form.numAgrement || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">N° notification</label>
          <input
            type="text"
            class="form-control"
            id="formNumNotification"
            value="${state.form.numNotification || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Adresse</h6>
        </div>
        <div class="col-md-3">
          <label class="form-label">Commune ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formCommune" required ${isView ? 'disabled' : ''}>
            <option value="">Sélectionner…</option>
            ${communes
              .map(
                (c) =>
                  `<option value="${c.nom}" ${state.form.adresse.commune === c.nom ? 'selected' : ''}>${c.nom}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Quartier</label>
          <input
            type="text"
            class="form-control"
            id="formQuartier"
            value="${state.form.adresse.quartier || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Avenue</label>
          <input
            type="text"
            class="form-control"
            id="formAvenue"
            value="${state.form.adresse.avenue || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-2">
          <label class="form-label">Numéro</label>
          <input
            type="text"
            class="form-control"
            id="formNumero"
            value="${state.form.adresse.numero || ''}"
            ${isView ? 'disabled' : ''}
          />
        </div>

        <div class="col-md-4">
          <label class="form-label">Statut ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formStatut" required ${isView ? 'disabled' : ''}>
            ${Object.entries(ECOLE_STATUTS)
              .map(([v, label]) => `<option value="${v}" ${state.form.statut === v ? 'selected' : ''}>${label}</option>`)
              .join('')}
          </select>
        </div>

        <div class="col-12">
          <hr class="my-2" />
          <h6 class="mb-2">Documents</h6>
          ${!isView ? `<input type="file" class="form-control mb-2" id="docFileInput" />` : ''}
          ${
            state.form.documents && state.form.documents.length > 0
              ? `
            <ul class="list-group" id="docList">
              ${state.form.documents
                .map(
                  (doc, idx) => `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  <span>
                    <i class="ti ti-file-text me-2"></i>
                    ${doc.nom} <span class="text-secondary small">(${doc.taille})</span>
                  </span>
                  <span class="d-flex align-items-center gap-2">
                    <span class="text-secondary small">${formatDate(doc.date)}</span>
                    ${
                      !isView
                        ? `<button type="button" class="btn btn-sm btn-outline-danger" data-remove-doc="${idx}"><i class="ti ti-x"></i></button>`
                        : ''
                    }
                  </span>
                </li>
              `
                )
                .join('')}
            </ul>
          `
              : `<p class="text-secondary small mb-0">Aucun document joint.</p>`
          }
        </div>

        ${
          isView
            ? `
          <div class="col-12">
            <hr class="my-2" />
            <h6 class="mb-2">Historique des fiches de contrôle</h6>
            ${
              fichesSelected.length === 0
                ? `<p class="text-secondary small mb-0">Aucune fiche de contrôle pour cette école.</p>`
                : `
              <div class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead class="table-light">
                    <tr>
                      <th>Numéro</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${fichesSelected
                      .map(
                        (f) => `
                      <tr>
                        <td>${f.numero}</td>
                        <td>${renderStatusBadgeHTML(
                          {
                            brouillon: 'Brouillon',
                            en_attente_validation: 'En attente de validation',
                            validee: 'Validée (Lu et approuvé)',
                          },
                          f.statut
                        )}</td>
                        <td>${formatDate(f.createdAt)}</td>
                      </tr>
                    `
                      )
                      .join('')}
                  </tbody>
                </table>
              </div>
            `
            }
          </div>
        `
            : ''
        }
      </div>
    </form>
  `;

  const footerHtml = isView
    ? `<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>`
    : `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="ecoleForm" class="btn btn-primary">Enregistrer</button>
    `;

  const modalHtml = renderModalHTML({
    id: 'ecoleModal',
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

export function initEcolesPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderEcolesPage();
    initEcolesPageEvents(container);
  };

  const openFormModal = (mode, ecole = null) => {
    state.mode = mode;
    state.selectedId = ecole?.id || null;
    state.errors = {};
    if (ecole) {
      state.form = {
        denomination: ecole.denomination,
        regime: ecole.regime,
        idDinacope: ecole.idDinacope,
        numAgrement: ecole.numAgrement || '',
        numNotification: ecole.numNotification || '',
        documents: ecole.documents ? [...ecole.documents] : [],
        adresse: { ...ecole.adresse },
        statut: ecole.statut,
      };
    } else {
      state.form = {
        denomination: '',
        regime: '',
        idDinacope: '',
        numAgrement: '',
        numNotification: '',
        documents: [],
        adresse: { commune: '', quartier: '', avenue: '', numero: '' },
        statut: 'active',
      };
    }
    refreshPage();
    openModal('ecoleModal');
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
      const ecole = appStore.ecoles.find((e) => e.id === id);
      if (action === 'view') openFormModal('view', ecole);
      if (action === 'edit') openFormModal('edit', ecole);
      if (action === 'delete') {
        showConfirmDialog({
          title: "Supprimer l'école",
          message: 'Voulez-vous vraiment supprimer cette école ? Cette action est irréversible.',
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            const ok = appStore.deleteEcole(id);
            if (!ok) {
              showConfirmDialog({
                title: 'Suppression impossible',
                message:
                  'Cette école ne peut pas être supprimée car des fiches ou rapports y sont liés. Voulez-vous la désactiver (fermeture temporaire) à la place ?',
                confirmLabel: 'Désactiver',
                onConfirm: () => {
                  appStore.deactivateEcole(id);
                  refreshPage();
                },
              });
            } else {
              refreshPage();
            }
          },
        });
      }
    },
  });

  const openCreateBtn = container.querySelector('#openCreateBtn');
  if (openCreateBtn) {
    openCreateBtn.addEventListener('click', () => openFormModal('create'));
  }

  ['filterCommune', 'filterRegime', 'filterStatut'].forEach((id) => {
    const el = container.querySelector(`#${id}`);
    if (el) {
      el.addEventListener('change', (e) => {
        state[id] = e.target.value;
        state.page = 1;
        refreshPage();
      });
    }
  });

  // Modal events & form submit
  const ecoleForm = container.querySelector('#ecoleForm');
  if (ecoleForm) {
    ecoleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idDinacope = container.querySelector('#formIdDinacope').value.trim();
      const duplicate = appStore.ecoles.some((e2) => e2.idDinacope === idDinacope && e2.id !== state.selectedId);
      if (duplicate) {
        state.errors = { idDinacope: 'Cet identifiant DINACOPE est déjà utilisé par une autre école.' };
        refreshPage();
        openModal('ecoleModal');
        return;
      }

      const payload = {
        id: state.selectedId,
        denomination: container.querySelector('#formDenomination').value.trim(),
        regime: container.querySelector('#formRegime').value,
        idDinacope,
        numAgrement: container.querySelector('#formNumAgrement').value.trim() || null,
        numNotification: container.querySelector('#formNumNotification').value.trim() || null,
        documents: state.form.documents,
        adresse: {
          commune: container.querySelector('#formCommune').value,
          quartier: container.querySelector('#formQuartier').value.trim(),
          avenue: container.querySelector('#formAvenue').value.trim(),
          numero: container.querySelector('#formNumero').value.trim(),
        },
        statut: container.querySelector('#formStatut').value,
      };

      appStore.upsertEcole(payload);
      closeModal('ecoleModal').then(() => refreshPage());
    });
  }

  const docInput = container.querySelector('#docFileInput');
  if (docInput) {
    docInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      state.form.documents.push({
        nom: file.name,
        taille: formatTaille(file.size),
        date: new Date().toISOString(),
      });
      refreshPage();
      openModal('ecoleModal');
    });
  }

  container.querySelectorAll('[data-remove-doc]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-remove-doc'), 10);
      state.form.documents.splice(idx, 1);
      refreshPage();
      openModal('ecoleModal');
    });
  });
}
