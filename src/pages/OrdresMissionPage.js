import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { ORDRE_STATUTS } from '../mock/constantes.js';
import { formatDate, formatDateTime, openPrintPreview } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterStatut: '',
  selectedId: null,
  form: {
    id: null,
    numero: '',
    ecoleId: '',
    controleurIds: [],
    dateEmission: '',
    validiteDebut: '',
    validiteFin: '',
    statut: 'en_attente_signature',
  },
};

function toInputDate(iso) {
  if (!iso) return '';
  return String(iso).slice(0, 10);
}

export function renderOrdresMissionPage() {
  const currentUser = appStore.currentUser;
  const ordresMission = appStore.ordresMission;
  const ecoles = appStore.ecoles;
  const utilisateurs = appStore.utilisateurs;

  const ecoleMap = new Map(ecoles.map((e) => [e.id, e]));
  const userMap = new Map(utilisateurs.map((u) => [u.id, u]));

  const filteredRows = ordresMission.filter((o) => {
    if (state.filterStatut && o.statut !== state.filterStatut) return false;
    return true;
  });

  const canSigner = currentUser?.role === 'Directeur Provincial';

  const columns = [
    { key: 'numero', header: "N° Ordre", sortable: true },
    {
      key: 'ecole',
      header: 'École',
      render: (row) => ecoleMap.get(row.ecoleId)?.denomination || '—',
    },
    {
      key: 'controleurs',
      header: 'Contrôleur(s)',
      render: (row) =>
        (row.controleurIds || []).map((id) => userMap.get(id)?.nom || id).join(', ') || '—',
    },
    {
      key: 'dateEmission',
      header: "Date d'émission",
      sortable: true,
      render: (row) => formatDate(row.dateEmission),
    },
    {
      key: 'validite',
      header: 'Validité',
      render: (row) => `${formatDate(row.validiteDebut)} → ${formatDate(row.validiteFin)}`,
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (row) => renderStatusBadgeHTML(ORDRE_STATUTS, row.statut),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => `
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-icon btn-outline-primary" title="Modifier" data-action="edit" data-id="${row.id}">
            <i class="ti ti-edit"></i>
          </button>
          ${
            canSigner && row.statut === 'en_attente_signature'
              ? `<button type="button" class="btn btn-sm btn-success" data-action="signer" data-id="${row.id}">
                  <i class="ti ti-signature me-1"></i> Signer
                </button>`
              : ''
          }
          <button type="button" class="btn btn-sm btn-icon btn-outline-secondary" title="Générer le PDF" data-action="print" data-id="${row.id}">
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
    <select class="form-select" id="filterOrdreStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(ORDRE_STATUTS)
        .map(([v, label]) => `<option value="${v}" ${state.filterStatut === v ? 'selected' : ''}>${label}</option>`)
        .join('')}
    </select>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['numero', (row) => ecoleMap.get(row.ecoleId)?.denomination || ''],
    searchPlaceholder: 'Rechercher un ordre, une école…',
    emptyMessage: 'Aucun ordre de mission trouvé.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Ordres de mission',
    subtitle: 'Émission, signature et suivi des ordres de mission de contrôle sanitaire',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateOrdreBtn">
        <i class="ti ti-plus me-1"></i> Nouvel ordre de mission
      </button>
    `,
  });

  const controleurs = utilisateurs.filter((u) => u.role === 'Contrôleur');

  const modalTitle = state.form.id ? "Modifier l'ordre de mission" : 'Nouvel ordre de mission';

  const modalContentHtml = `
    <form id="ordreForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">N° de l'ordre</label>
          <input
            type="text"
            class="form-control"
            id="formNumero"
            value="${state.form.numero || ''}"
            placeholder="Généré automatiquement si laissé vide"
            ${state.form.id ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">École <span class="text-danger">*</span></label>
          <select class="form-select" id="formEcoleId" required>
            <option value="">Sélectionner une école…</option>
            ${ecoles
              .map(
                (e) => `<option value="${e.id}" ${state.form.ecoleId === e.id ? 'selected' : ''}>${e.denomination}</option>`
              )
              .join('')}
          </select>
        </div>

        <div class="col-12">
          <label class="form-label">Contrôleur(s) affecté(s) <span class="text-danger">*</span></label>
          <div class="row border rounded p-3">
            ${
              controleurs.length === 0
                ? `<p class="text-secondary mb-0">Aucun contrôleur disponible.</p>`
                : controleurs
                    .map(
                      (c) => `
                <div class="col-md-4 col-sm-6">
                  <div class="form-check">
                    <input
                      class="form-check-input ctrl-check"
                      type="checkbox"
                      id="ctrl-${c.id}"
                      value="${c.id}"
                      ${state.form.controleurIds.includes(c.id) ? 'checked' : ''}
                    />
                    <label class="form-check-label" for="ctrl-${c.id}">
                      ${c.nom} ${c.equipe ? `(${c.equipe})` : ''}
                    </label>
                  </div>
                </div>
              `
                    )
                    .join('')
            }
          </div>
        </div>

        <div class="col-md-4">
          <label class="form-label">Date d'émission</label>
          <input
            type="date"
            class="form-control"
            id="formDateEmission"
            value="${state.form.dateEmission || ''}"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Début de validité</label>
          <input
            type="date"
            class="form-control"
            id="formValiditeDebut"
            value="${state.form.validiteDebut || ''}"
          />
        </div>
        <div class="col-md-4">
          <label class="form-label">Fin de validité</label>
          <input
            type="date"
            class="form-control"
            id="formValiditeFin"
            value="${state.form.validiteFin || ''}"
          />
        </div>

        ${
          state.form.id
            ? `
          <div class="col-md-6">
            <label class="form-label">Statut</label>
            <select class="form-select" id="formStatut">
              ${Object.entries(ORDRE_STATUTS)
                .map(
                  ([v, label]) => `<option value="${v}" ${state.form.statut === v ? 'selected' : ''}>${label}</option>`
                )
                .join('')}
            </select>
            <div class="form-text">
              La signature officielle se fait via le bouton « Signer » depuis le tableau.
            </div>
          </div>
        `
            : ''
        }
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="ordreForm" class="btn btn-primary">Enregistrer</button>
  `;

  const modalHtml = renderModalHTML({
    id: 'ordreModal',
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

export function initOrdresMissionPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderOrdresMissionPage();
    initOrdresMissionPageEvents(container);
  };

  const openFormModal = (ordre = null) => {
    if (ordre) {
      state.form = {
        id: ordre.id,
        numero: ordre.numero || '',
        ecoleId: ordre.ecoleId || '',
        controleurIds: ordre.controleurIds ? [...ordre.controleurIds] : [],
        dateEmission: toInputDate(ordre.dateEmission),
        validiteDebut: toInputDate(ordre.validiteDebut),
        validiteFin: toInputDate(ordre.validiteFin),
        statut: ordre.statut || 'en_attente_signature',
      };
    } else {
      state.form = {
        id: null,
        numero: '',
        ecoleId: '',
        controleurIds: [],
        dateEmission: '',
        validiteDebut: '',
        validiteFin: '',
        statut: 'en_attente_signature',
      };
    }
    refreshPage();
    openModal('ordreModal');
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
      const ordre = appStore.ordresMission.find((o) => o.id === id);
      if (action === 'edit') openFormModal(ordre);
      if (action === 'signer') {
        showConfirmDialog({
          title: "Signer l'ordre de mission",
          message:
            'En tant que Directeur Provincial, vous confirmez la signature officielle de cet ordre de mission.',
          confirmLabel: 'Signer',
          onConfirm: () => {
            appStore.signerOrdre(id);
            refreshPage();
          },
        });
      }
      if (action === 'delete') {
        showConfirmDialog({
          title: "Supprimer l'ordre de mission",
          message: 'Cette action est irréversible. Confirmez-vous la suppression de cet ordre de mission ?',
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteOrdre(id);
            refreshPage();
          },
        });
      }
      if (action === 'print') {
        const ecole = appStore.ecoles.find((e) => e.id === ordre.ecoleId);
        const noms = (ordre.controleurIds || [])
          .map((cid) => appStore.utilisateurs.find((u) => u.id === cid)?.nom || cid)
          .join(', ');
        const signataire = ordre.signePar ? appStore.utilisateurs.find((u) => u.id === ordre.signePar)?.nom : null;
        const html = `
          <h2>Ordre de mission ${ordre.numero}</h2>
          <p class="text-secondary">Province Éducationnelle de Kinshasa / Mont-Amba — Contrôle sanitaire scolaire</p>
          <table class="table table-bordered">
            <tbody>
              <tr><th style="width:220px">École</th><td>${ecole?.denomination || '—'}</td></tr>
              <tr><th>Adresse</th><td>${
                ecole
                  ? `${ecole.adresse?.avenue || ''} n°${ecole.adresse?.numero || ''}, ${
                      ecole.adresse?.quartier || ''
                    }, ${ecole.adresse?.commune || ''}`
                  : '—'
              }</td></tr>
              <tr><th>Contrôleur(s) désigné(s)</th><td>${noms || '—'}</td></tr>
              <tr><th>Date d'émission</th><td>${formatDate(ordre.dateEmission)}</td></tr>
              <tr><th>Période de validité</th><td>Du ${formatDate(ordre.validiteDebut)} au ${formatDate(
          ordre.validiteFin
        )}</td></tr>
              <tr><th>Statut</th><td>${ORDRE_STATUTS[ordre.statut] || ordre.statut}</td></tr>
              <tr><th>Signé par</th><td>${signataire || '—'}</td></tr>
              <tr><th>Signé le</th><td>${formatDateTime(ordre.signeLe)}</td></tr>
            </tbody>
          </table>
        `;
        openPrintPreview(`Ordre de mission ${ordre.numero}`, html);
      }
    },
  });

  const openBtn = container.querySelector('#openCreateOrdreBtn');
  if (openBtn) openBtn.addEventListener('click', () => openFormModal(null));

  const filterSelect = container.querySelector('#filterOrdreStatut');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.filterStatut = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  const ordreForm = container.querySelector('#ordreForm');
  if (ordreForm) {
    ordreForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ecoleId = container.querySelector('#formEcoleId').value;
      const checkedCtrls = Array.from(container.querySelectorAll('.ctrl-check:checked')).map((c) => c.value);

      if (!ecoleId) {
        appStore.pushToast('Veuillez sélectionner une école.', 'danger');
        return;
      }
      if (checkedCtrls.length === 0) {
        appStore.pushToast('Veuillez sélectionner au moins un contrôleur.', 'danger');
        return;
      }

      const validiteDebut = container.querySelector('#formValiditeDebut').value;
      const validiteFin = container.querySelector('#formValiditeFin').value;
      const dateEmission = container.querySelector('#formDateEmission').value;
      const numero = container.querySelector('#formNumero')?.value.trim();

      const payload = {
        id: state.form.id || undefined,
        numero: numero || undefined,
        ecoleId,
        controleurIds: checkedCtrls,
        dateEmission: dateEmission ? new Date(dateEmission).toISOString() : new Date().toISOString(),
        validiteDebut: validiteDebut ? new Date(validiteDebut).toISOString() : null,
        validiteFin: validiteFin ? new Date(validiteFin).toISOString() : null,
        statut: state.form.id ? container.querySelector('#formStatut')?.value || state.form.statut : 'en_attente_signature',
      };

      appStore.upsertOrdre(payload);
      closeModal('ordreModal').then(() => refreshPage());
    });
  }
}
