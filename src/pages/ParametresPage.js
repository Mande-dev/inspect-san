import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';

const TABS = [
  { key: 'communes', label: 'Communes' },
  { key: 'regimes', label: 'Régimes' },
  { key: 'typesDecision', label: 'Types de décision' },
];

let state = {
  activeTab: 'communes',
  editing: null,
  form: { nom: '', code: '', libelle: '', actif: true },
};

export function renderParametresPage() {
  const communes = appStore.communes;
  const regimes = appStore.regimes;
  const typesDecision = appStore.typesDecision;

  const dataByTab = { communes, regimes, typesDecision };
  const list = dataByTab[state.activeTab] || [];
  const isTypeDecision = state.activeTab === 'typesDecision';

  const labelOf = (item) => (isTypeDecision ? item.libelle : item.nom);

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Paramètres',
    subtitle: 'Gestion des référentiels : communes, régimes et types de décision.',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openNewRefBtn">
        <i class="ti ti-plus me-1"></i> Ajouter
      </button>
    `,
  });

  const tabsHtml = `
    <ul class="nav nav-tabs mb-4">
      ${TABS.map(
        (t) => `
        <li class="nav-item">
          <button
            type="button"
            class="nav-link ${state.activeTab === t.key ? 'active' : ''}"
            data-tab="${t.key}"
          >
            ${t.label}
          </button>
        </li>
      `
      ).join('')}
    </ul>
  `;

  const tableRowsHtml =
    list.length === 0
      ? `<tr><td colSpan="${isTypeDecision ? 4 : 3}" class="text-center text-secondary py-5">Aucun enregistrement.</td></tr>`
      : list
          .map(
            (item) => `
        <tr data-id="${item.id}">
          ${isTypeDecision ? `<td>${item.code}</td>` : ''}
          <td>${labelOf(item)}</td>
          <td>
            <span class="badge bg-${item.actif ? 'success' : 'secondary'}-subtle text-${
              item.actif ? 'success' : 'secondary'
            }-emphasis">
              ${item.actif ? 'Actif' : 'Inactif'}
            </span>
          </td>
          <td>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-sm btn-outline-secondary" data-action="edit" data-id="${item.id}" aria-label="Modifier">
                <i class="ti ti-pencil"></i>
              </button>
              <button type="button" class="btn btn-sm btn-outline-danger" data-action="delete" data-id="${item.id}" aria-label="Supprimer">
                <i class="ti ti-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `
          )
          .join('');

  const modalTitle = state.editing ? 'Modifier la référence' : 'Ajouter une référence';

  const modalContentHtml = `
    <form id="refForm">
      ${
        isTypeDecision
          ? `
        <div class="mb-3">
          <label class="form-label">Code</label>
          <input
            type="text"
            class="form-control"
            id="formRefCode"
            value="${state.form.code || ''}"
            placeholder="ex. maintien"
            required
          />
        </div>
        <div class="mb-3">
          <label class="form-label">Libellé</label>
          <input
            type="text"
            class="form-control"
            id="formRefLibelle"
            value="${state.form.libelle || ''}"
            required
          />
        </div>
      `
          : `
        <div class="mb-3">
          <label class="form-label">Nom</label>
          <input
            type="text"
            class="form-control"
            id="formRefNom"
            value="${state.form.nom || ''}"
            required
          />
        </div>
      `
      }
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          id="actifSwitch"
          ${state.form.actif ? 'checked' : ''}
        />
        <label class="form-check-label" for="actifSwitch">
          Actif
        </label>
      </div>
    </form>
  `;

  const footerHtml = `
    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
    <button type="submit" form="refForm" class="btn btn-primary">Enregistrer</button>
  `;

  const modalHtml = renderModalHTML({
    id: 'refModal',
    title: modalTitle,
    contentHtml: modalContentHtml,
    footerHtml,
    size: 'md',
  });

  return `
    <div>
      ${pageHeaderHtml}
      ${tabsHtml}
      <div class="card card-lg">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  ${isTypeDecision ? '<th>Code</th>' : ''}
                  <th>${isTypeDecision ? 'Libellé' : 'Nom'}</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${tableRowsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      ${modalHtml}
    </div>
  `;
}

export function initParametresPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderParametresPage();
    initParametresPageEvents(container);
  };

  const openFormModal = (item = null) => {
    state.editing = item;
    const isTypeDecision = state.activeTab === 'typesDecision';
    if (item) {
      state.form = isTypeDecision
        ? { code: item.code, libelle: item.libelle, actif: item.actif }
        : { nom: item.nom, actif: item.actif };
    } else {
      state.form = isTypeDecision ? { code: '', libelle: '', actif: true } : { nom: '', actif: true };
    }
    refreshPage();
    openModal('refModal');
  };

  container.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.getAttribute('data-tab');
      refreshPage();
    });
  });

  const openNewBtn = container.querySelector('#openNewRefBtn');
  if (openNewBtn) openNewBtn.addEventListener('click', () => openFormModal(null));

  container.querySelectorAll('[data-action="edit"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const list = appStore[state.activeTab] || [];
      const item = list.find((x) => x.id === id);
      openFormModal(item);
    });
  });

  container.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const list = appStore[state.activeTab] || [];
      const item = list.find((x) => x.id === id);
      const isTypeDecision = state.activeTab === 'typesDecision';
      const label = item ? (isTypeDecision ? item.libelle : item.nom) : '';
      showConfirmDialog({
        title: 'Supprimer la référence',
        message: `Confirmez-vous la suppression de « ${label} » ?`,
        confirmLabel: 'Supprimer',
        danger: true,
        onConfirm: () => {
          appStore.deleteRef(state.activeTab, id);
          refreshPage();
        },
      });
    });
  });

  const refForm = container.querySelector('#refForm');
  if (refForm) {
    refForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const isTypeDecision = state.activeTab === 'typesDecision';
      const actif = container.querySelector('#actifSwitch').checked;
      let payload = {};
      if (isTypeDecision) {
        payload = {
          code: container.querySelector('#formRefCode').value.trim(),
          libelle: container.querySelector('#formRefLibelle').value.trim(),
          actif,
        };
      } else {
        payload = {
          nom: container.querySelector('#formRefNom').value.trim(),
          actif,
        };
      }

      if (state.editing) payload.id = state.editing.id;

      appStore.upsertRef(state.activeTab, payload);
      closeModal('refModal').then(() => refreshPage());
    });
  }
}
