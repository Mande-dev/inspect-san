import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { DECISION_TYPES, EXECUTION_STATUTS } from '../mock/constantes.js';
import { formatDate, formatDateTime } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterType: '',
  filterExec: '',
  editingId: null,
  form: {
    ecoleId: '',
    rapportId: '',
    type: 'maintien',
    delaiExecution: '7 jours',
    commentaire: '',
    statutExecution: 'en_cours',
  },
};

export function renderDecisionsPage() {
  const rapports = appStore.rapports;
  const ecoles = appStore.ecoles;
  const decisions = appStore.decisions;

  const ecoleName = (id) => ecoles.find((e) => e.id === id)?.denomination || '—';
  const rapportNumero = (id) => rapports.find((r) => r.id === id)?.numero || '—';

  const rapportsEnAttente = rapports.filter(
    (r) => r.statut === 'transmis' && !decisions.some((d) => d.rapportId === r.id)
  );

  const decisionsFiltrees = decisions.filter(
    (d) => (!state.filterType || d.type === state.filterType) && (!state.filterExec || d.statutExecution === state.filterExec)
  );

  const columns = [
    { key: 'numero', header: 'N° Décision', sortable: true },
    { key: 'ecole', header: 'École', sortKey: 'ecoleId', render: (d) => ecoleName(d.ecoleId) },
    { key: 'rapport', header: 'Rapport', render: (d) => rapportNumero(d.rapportId) },
    { key: 'type', header: 'Type', sortable: true, render: (d) => renderStatusBadgeHTML(DECISION_TYPES, d.type) },
    { key: 'delaiExecution', header: 'Délai' },
    {
      key: 'statutExecution',
      header: "Statut d'exécution",
      sortable: true,
      render: (d) => renderStatusBadgeHTML(EXECUTION_STATUTS, d.statutExecution),
    },
    { key: 'decideLe', header: 'Décidé le', sortable: true, render: (d) => formatDate(d.decideLe) },
    {
      key: 'actions',
      header: 'Actions',
      render: (d) => `
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${d.id}" aria-label="Modifier">
            <i class="ti ti-pencil"></i>
          </button>
          <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${d.id}" aria-label="Supprimer">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `,
    },
  ];

  const filtersHtml = `
    <div class="row g-2">
      <div class="col-md-6">
        <select class="form-select" id="filterTypeSelect">
          <option value="">Tous les types</option>
          ${Object.entries(DECISION_TYPES)
            .map(([k, label]) => `<option value="${k}" ${state.filterType === k ? 'selected' : ''}>${label}</option>`)
            .join('')}
        </select>
      </div>
      <div class="col-md-6">
        <select class="form-select" id="filterExecSelect">
          <option value="">Tous les statuts d'exécution</option>
          ${Object.entries(EXECUTION_STATUTS)
            .map(([k, label]) => `<option value="${k}" ${state.filterExec === k ? 'selected' : ''}>${label}</option>`)
            .join('')}
        </select>
      </div>
    </div>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: decisionsFiltrees,
    searchKeys: ['numero', (d) => ecoleName(d.ecoleId)],
    searchPlaceholder: 'Rechercher une décision ou une école…',
    emptyMessage: 'Aucune décision enregistrée.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Décisions',
    subtitle: 'Rapports transmis en attente de décision et suivi des décisions prises.',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openNewDecisionBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle décision
      </button>
    `,
  });

  const modalTitle = state.editingId ? 'Modifier la décision' : 'Nouvelle décision';

  const modalContentHtml = `
    <form id="decisionForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Rapport concerné</label>
          <select
            class="form-select"
            id="formRapportId"
            required
            ${state.editingId ? 'disabled' : ''}
          >
            <option value="">Sélectionner un rapport…</option>
            ${rapports
              .map(
                (r) =>
                  `<option value="${r.id}" ${state.form.rapportId === r.id ? 'selected' : ''}>${r.numero} — ${ecoleName(
                    r.ecoleId
                  )}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">École</label>
          <input type="text" class="form-control" id="formEcoleName" value="${ecoleName(state.form.ecoleId)}" disabled />
        </div>
        <div class="col-md-6">
          <label class="form-label">Type de décision</label>
          <select class="form-select" id="formType" required>
            ${Object.entries(DECISION_TYPES)
              .map(([k, label]) => `<option value="${k}" ${state.form.type === k ? 'selected' : ''}>${label}</option>`)
              .join('')}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Délai d'exécution</label>
          <input
            type="text"
            class="form-control"
            id="formDelaiExecution"
            placeholder="Ex. 14 jours"
            value="${state.form.delaiExecution || ''}"
            required
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut d'exécution</label>
          <select class="form-select" id="formStatutExecution">
            ${Object.entries(EXECUTION_STATUTS)
              .map(
                ([k, label]) =>
                  `<option value="${k}" ${state.form.statutExecution === k ? 'selected' : ''}>${label}</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="col-12">
          <label class="form-label">Commentaire</label>
          <textarea class="form-control" rows="3" id="formCommentaire">${state.form.commentaire || ''}</textarea>
        </div>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="decisionForm" class="btn btn-primary">Enregistrer</button>
  `;

  const modalHtml = renderModalHTML({
    id: 'decisionModal',
    title: modalTitle,
    contentHtml: modalContentHtml,
    footerHtml,
    size: 'lg',
  });

  return `
    <div>
      ${pageHeaderHtml}

      <div class="card card-lg mb-6">
        <div class="card-header border-bottom-0">
          <h5 class="mb-0">Rapports en attente de décision</h5>
        </div>
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>N° Rapport</th>
                  <th>École</th>
                  <th>Transmis le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${
                  rapportsEnAttente.length === 0
                    ? `
                  <tr>
                    <td colSpan="4" class="text-center text-secondary py-5">
                      Aucun rapport en attente de décision.
                    </td>
                  </tr>
                `
                    : rapportsEnAttente
                        .map(
                          (r) => `
                    <tr>
                      <td>${r.numero}</td>
                      <td>${ecoleName(r.ecoleId)}</td>
                      <td>${formatDateTime(r.transmisLe)}</td>
                      <td>
                        <button type="button" class="btn btn-sm btn-primary" data-open-from-rapport="${r.id}">
                          <i class="ti ti-gavel me-1"></i> Prendre une décision
                        </button>
                      </td>
                    </tr>
                  `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <h5 class="mb-3">Décisions enregistrées</h5>
      ${dataTableHtml}
      ${modalHtml}
    </div>
  `;
}

export function initDecisionsPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderDecisionsPage();
    initDecisionsPageEvents(container);
  };

  const openFormModal = (editingId = null, initialForm = null) => {
    state.editingId = editingId;
    if (initialForm) {
      state.form = { ...initialForm };
    } else if (editingId) {
      const d = appStore.decisions.find((x) => x.id === editingId);
      if (d) {
        state.form = {
          ecoleId: d.ecoleId,
          rapportId: d.rapportId,
          type: d.type,
          delaiExecution: d.delaiExecution,
          commentaire: d.commentaire || '',
          statutExecution: d.statutExecution,
        };
      }
    } else {
      state.form = {
        ecoleId: '',
        rapportId: '',
        type: 'maintien',
        delaiExecution: '7 jours',
        commentaire: '',
        statutExecution: 'en_cours',
      };
    }
    refreshPage();
    openModal('decisionModal');
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
      if (action === 'edit') openFormModal(id);
      if (action === 'delete') {
        const d = appStore.decisions.find((x) => x.id === id);
        showConfirmDialog({
          title: 'Supprimer la décision',
          message: `Confirmez-vous la suppression de la décision ${d?.numero} ? Le statut de l'école ne sera pas restauré automatiquement.`,
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteDecision(id);
            refreshPage();
          },
        });
      }
    },
  });

  const openNewBtn = container.querySelector('#openNewDecisionBtn');
  if (openNewBtn) openNewBtn.addEventListener('click', () => openFormModal(null));

  container.querySelectorAll('[data-open-from-rapport]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const rid = btn.getAttribute('data-open-from-rapport');
      const rapport = appStore.rapports.find((r) => r.id === rid);
      if (rapport) {
        openFormModal(null, {
          ecoleId: rapport.ecoleId,
          rapportId: rapport.id,
          type: 'maintien',
          delaiExecution: '7 jours',
          commentaire: '',
          statutExecution: 'en_cours',
        });
      }
    });
  });

  ['filterTypeSelect', 'filterExecSelect'].forEach((id) => {
    const el = container.querySelector(`#${id}`);
    if (el) {
      el.addEventListener('change', (e) => {
        if (id === 'filterTypeSelect') state.filterType = e.target.value;
        if (id === 'filterExecSelect') state.filterExec = e.target.value;
        state.page = 1;
        refreshPage();
      });
    }
  });

  const rapportSelect = container.querySelector('#formRapportId');
  if (rapportSelect) {
    rapportSelect.addEventListener('change', (e) => {
      const rid = e.target.value;
      const rapport = appStore.rapports.find((r) => r.id === rid);
      state.form.rapportId = rid;
      state.form.ecoleId = rapport?.ecoleId || '';
      const ecoleNameEl = container.querySelector('#formEcoleName');
      if (ecoleNameEl) {
        ecoleNameEl.value = appStore.ecoles.find((ec) => ec.id === state.form.ecoleId)?.denomination || '—';
      }
    });
  }

  const decisionForm = container.querySelector('#decisionForm');
  if (decisionForm) {
    decisionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.form.ecoleId || !state.form.rapportId) return;

      const payload = {
        id: state.editingId || undefined,
        ecoleId: state.form.ecoleId,
        rapportId: state.form.rapportId,
        type: container.querySelector('#formType').value,
        delaiExecution: container.querySelector('#formDelaiExecution').value.trim(),
        statutExecution: container.querySelector('#formStatutExecution').value,
        commentaire: container.querySelector('#formCommentaire').value.trim(),
      };

      appStore.upsertDecision(payload);
      closeModal('decisionModal').then(() => refreshPage());
    });
  }
}
