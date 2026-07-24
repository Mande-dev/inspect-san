import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { RAPPORT_STATUTS } from '../mock/constantes.js';
import { formatDate, formatDateTime, openPrintPreview } from '../utils/helpers.js';

function buildSynthese(count) {
  if (!count) return '';
  return `Synthèse d'inspection portant sur ${count} fiche(s) de contrôle validée(s). Conformité partielle observée. À compléter par l'inspecteur.`;
}

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterStatut: '',
  syntheseDirty: false,
  form: {
    id: null,
    numero: '',
    ficheIds: [],
    ecoleId: '',
    synthese: '',
    statut: 'brouillon',
  },
};

export function renderRapportsPage() {
  const rapports = appStore.rapports;
  const fichesControle = appStore.fichesControle;
  const ecoles = appStore.ecoles;

  const ecoleMap = new Map(ecoles.map((e) => [e.id, e]));
  const ficheMap = new Map(fichesControle.map((f) => [f.id, f]));
  const fichesValidees = fichesControle.filter((f) => f.statut === 'validee');

  const filteredRows = rapports.filter((r) => {
    if (state.filterStatut && r.statut !== state.filterStatut) return false;
    return true;
  });

  const columns = [
    { key: 'numero', header: 'N° Rapport', sortable: true },
    { key: 'ecole', header: 'École', render: (row) => ecoleMap.get(row.ecoleId)?.denomination || '—' },
    {
      key: 'fiches',
      header: 'Fiches intégrées',
      render: (row) => `${(row.ficheIds || []).length} fiche(s)`,
    },
    {
      key: 'synthese',
      header: 'Synthèse',
      render: (row) => `
        <span class="text-truncate d-inline-block" style="max-width: 260px;" title="${row.synthese}">
          ${row.synthese}
        </span>
      `,
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (row) => renderStatusBadgeHTML(RAPPORT_STATUTS, row.statut),
    },
    {
      key: 'createdAt',
      header: 'Créé le',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => `
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-sm btn-icon btn-outline-primary"
            title="${row.statut === 'brouillon' ? 'Modifier' : 'Consulter'}"
            data-action="edit"
            data-id="${row.id}"
          >
            <i class="ti ${row.statut === 'brouillon' ? 'ti-edit' : 'ti-eye'}"></i>
          </button>
          ${
            row.statut === 'brouillon'
              ? `<button type="button" class="btn btn-sm btn-primary" data-action="deposer" data-id="${row.id}">
                  <i class="ti ti-send me-1"></i> Déposer au Secrétariat
                </button>`
              : ''
          }
          <button type="button" class="btn btn-sm btn-icon btn-outline-secondary" title="Exporter en PDF" data-action="print" data-id="${row.id}">
            <i class="ti ti-file-download"></i>
          </button>
          <button type="button" class="btn btn-sm btn-icon btn-outline-danger" title="Supprimer" data-action="delete" data-id="${row.id}">
            <i class="ti ti-trash"></i>
          </button>
        </div>
      `,
    },
  ];

  const filtersHtml = `
    <select class="form-select" id="filterRapportStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(RAPPORT_STATUTS)
        .map(([v, label]) => `<option value="${v}" ${state.filterStatut === v ? 'selected' : ''}>${label}</option>`)
        .join('')}
    </select>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['numero', 'synthese', (row) => ecoleMap.get(row.ecoleId)?.denomination || ''],
    searchPlaceholder: 'Rechercher un rapport, une école…',
    emptyMessage: "Aucun rapport d'inspection trouvé.",
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: "Rapports d'inspection",
    subtitle: 'Consolidation des fiches validées et dépôt au secrétariat',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateRapportBtn">
        <i class="ti ti-plus me-1"></i> Nouveau rapport
      </button>
    `,
  });

  const readOnly = !!state.form.id && state.form.statut !== 'brouillon';
  const modalTitle = state.form.id ? `Rapport ${state.form.numero || ''}` : "Nouveau rapport d'inspection";
  const ecoleAssociee = ecoleMap.get(state.form.ecoleId);

  const modalContentHtml = `
    <form id="rapportForm">
      ${readOnly ? `<div class="alert alert-info">Ce rapport a été déposé : il n'est plus modifiable depuis cette page.</div>` : ''}
      <fieldset ${readOnly ? 'disabled' : ''} style="border: none; padding: 0; margin: 0;">
        <div class="mb-4">
          <label class="form-label">Fiches de contrôle validées <span class="text-danger">*</span></label>
          <div class="border rounded p-3" style="max-height: 260px; overflow-y: auto;">
            ${
              fichesValidees.length === 0
                ? `<p class="text-secondary mb-0">Aucune fiche validée disponible.</p>`
                : fichesValidees
                    .map(
                      (fiche) => `
                <div class="form-check mb-2">
                  <input
                    class="form-check-input fiche-check"
                    type="checkbox"
                    id="fiche-${fiche.id}"
                    value="${fiche.id}"
                    ${state.form.ficheIds.includes(fiche.id) ? 'checked' : ''}
                    ${readOnly && !state.form.ficheIds.includes(fiche.id) ? 'disabled' : ''}
                  />
                  <label class="form-check-label" for="fiche-${fiche.id}">
                    ${fiche.numero} — ${ecoleMap.get(fiche.ecoleId)?.denomination || '—'} (validée le ${formatDate(
                        fiche.valideeLe
                      )})
                  </label>
                </div>
              `
                    )
                    .join('')
            }
          </div>
          ${
            ecoleAssociee
              ? `<div class="form-text mt-2">École associée : <strong>${ecoleAssociee.denomination}</strong></div>`
              : ''
          }
        </div>

        <div class="mb-3">
          <label class="form-label">Synthèse</label>
          <textarea
            class="form-control"
            rows="5"
            id="formSynthese"
          >${state.form.synthese || ''}</textarea>
          <div class="form-text">
            Cette synthèse est pré-remplie automatiquement et reste entièrement modifiable.
          </div>
        </div>
      </fieldset>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
      ${readOnly ? 'Fermer' : 'Annuler'}
    </button>
    ${!readOnly ? `<button type="submit" form="rapportForm" class="btn btn-primary">Enregistrer</button>` : ''}
  `;

  const modalHtml = renderModalHTML({
    id: 'rapportModal',
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

export function initRapportsPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderRapportsPage();
    initRapportsPageEvents(container);
  };

  const openFormModal = (rapport = null) => {
    if (rapport) {
      state.form = {
        id: rapport.id,
        numero: rapport.numero || '',
        ficheIds: rapport.ficheIds ? [...rapport.ficheIds] : [],
        ecoleId: rapport.ecoleId || '',
        synthese: rapport.synthese || '',
        statut: rapport.statut || 'brouillon',
      };
      state.syntheseDirty = true;
    } else {
      state.form = {
        id: null,
        numero: '',
        ficheIds: [],
        ecoleId: '',
        synthese: '',
        statut: 'brouillon',
      };
      state.syntheseDirty = false;
    }
    refreshPage();
    openModal('rapportModal');
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
      if (action === 'edit') openFormModal(rapport);
      if (action === 'deposer') {
        showConfirmDialog({
          title: 'Déposer le rapport au Secrétariat',
          message: "Confirmez-vous le dépôt de ce rapport d'inspection au secrétariat pour traitement ?",
          confirmLabel: 'Déposer',
          onConfirm: () => {
            appStore.deposerRapport(id);
            refreshPage();
          },
        });
      }
      if (action === 'delete') {
        showConfirmDialog({
          title: 'Supprimer le rapport',
          message: "Cette action est irréversible. Confirmez-vous la suppression de ce rapport d'inspection ?",
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteRapport(id);
            refreshPage();
          },
        });
      }
      if (action === 'print') {
        const ecole = appStore.ecoles.find((e) => e.id === rapport.ecoleId);
        const fichesHtml = (rapport.ficheIds || [])
          .map((fid) => {
            const fiche = appStore.fichesControle.find((f) => f.id === fid);
            return `<tr><td>${fiche?.numero || fid}</td><td>${fiche?.recommandationPreliminaire || '—'}</td></tr>`;
          })
          .join('');
        const html = `
          <h2>Rapport d'inspection ${rapport.numero}</h2>
          <p class="text-secondary">École : ${ecole?.denomination || '—'}</p>
          <h4>Synthèse</h4>
          <p>${(rapport.synthese || '').replace(/\n/g, '<br/>')}</p>
          <h4>Fiches de contrôle intégrées</h4>
          <table class="table table-bordered">
            <thead><tr><th>N° Fiche</th><th>Recommandation préliminaire</th></tr></thead>
            <tbody>${fichesHtml || '<tr><td colspan="2">Aucune fiche</td></tr>'}</tbody>
          </table>
          <table class="table table-bordered mt-4">
            <tbody>
              <tr><th style="width:220px">Statut</th><td>${RAPPORT_STATUTS[rapport.statut] || rapport.statut}</td></tr>
              <tr><th>Déposé le</th><td>${formatDateTime(rapport.deposeLe)}</td></tr>
              <tr><th>Accusé de réception</th><td>${formatDateTime(rapport.accuseReceptionLe)}</td></tr>
              <tr><th>Transmis le</th><td>${formatDateTime(rapport.transmisLe)}</td></tr>
            </tbody>
          </table>
        `;
        openPrintPreview(`Rapport ${rapport.numero}`, html);
      }
    },
  });

  const openBtn = container.querySelector('#openCreateRapportBtn');
  if (openBtn) openBtn.addEventListener('click', () => openFormModal(null));

  const filterSelect = container.querySelector('#filterRapportStatut');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.filterStatut = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  container.querySelectorAll('.fiche-check').forEach((chk) => {
    chk.addEventListener('change', () => {
      const checkedIds = Array.from(container.querySelectorAll('.fiche-check:checked')).map((c) => c.value);
      state.form.ficheIds = checkedIds;
      if (checkedIds.length) {
        const firstFiche = appStore.fichesControle.find((f) => f.id === checkedIds[0]);
        state.form.ecoleId = firstFiche?.ecoleId || '';
      } else {
        state.form.ecoleId = '';
      }
      if (!state.syntheseDirty) {
        state.form.synthese = buildSynthese(checkedIds.length);
      }
      refreshPage();
      openModal('rapportModal');
    });
  });

  const synthTextarea = container.querySelector('#formSynthese');
  if (synthTextarea) {
    synthTextarea.addEventListener('input', (e) => {
      state.syntheseDirty = true;
      state.form.synthese = e.target.value;
    });
  }

  const rapportForm = container.querySelector('#rapportForm');
  if (rapportForm) {
    rapportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (state.form.ficheIds.length === 0) {
        appStore.pushToast('Veuillez sélectionner au moins une fiche de contrôle validée.', 'danger');
        return;
      }
      const payload = {
        id: state.form.id || undefined,
        numero: state.form.numero.trim() || undefined,
        ficheIds: state.form.ficheIds,
        ecoleId: state.form.ecoleId,
        synthese: container.querySelector('#formSynthese').value.trim(),
        statut: state.form.statut,
      };

      appStore.upsertRapport(payload);
      closeModal('rapportModal').then(() => refreshPage());
    });
  }
}
