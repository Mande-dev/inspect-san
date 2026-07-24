import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { ROLES, USER_STATUTS } from '../mock/constantes.js';
import { equipes } from '../mock/index.js';
import { formatDate } from '../utils/helpers.js';

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterRole: '',
  filterStatut: '',
  mode: 'create',
  selectedId: null,
  form: {
    nom: '',
    contact: '',
    telephone: '',
    role: ROLES[0],
    equipe: '',
    statut: 'actif',
    identifiant: '',
    motDePasse: '',
  },
};

export function renderUtilisateursPage() {
  const utilisateurs = appStore.utilisateurs;

  const filteredRows = utilisateurs.filter((u) => {
    if (state.filterRole && u.role !== state.filterRole) return false;
    if (state.filterStatut && u.statut !== state.filterStatut) return false;
    return true;
  });

  const columns = [
    { key: 'nom', header: 'Nom', sortable: true },
    { key: 'identifiant', header: 'Identifiant' },
    { key: 'role', header: 'Rôle', sortable: true },
    { key: 'equipe', header: 'Équipe', render: (row) => row.equipe || '—' },
    { key: 'contact', header: 'Contact' },
    {
      key: 'statut',
      header: 'Statut',
      render: (row) => renderStatusBadgeHTML(USER_STATUTS, row.statut),
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
          <button type="button" class="btn btn-sm btn-outline-warning" title="Réinitialiser le mot de passe" data-action="reset" data-id="${row.id}">
            <i class="ti ti-key"></i>
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
        <select class="form-select" id="filterRoleSelect">
          <option value="">Tous les rôles</option>
          ${ROLES.map((r) => `<option value="${r}" ${state.filterRole === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
      </div>
      <div class="col-md-6">
        <select class="form-select" id="filterUserStatutSelect">
          <option value="">Tous les statuts</option>
          ${Object.entries(USER_STATUTS)
            .map(([v, label]) => `<option value="${v}" ${state.filterStatut === v ? 'selected' : ''}>${label}</option>`)
            .join('')}
        </select>
      </div>
    </div>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['nom', 'identifiant', 'contact'],
    searchPlaceholder: 'Rechercher un utilisateur…',
    emptyMessage: 'Aucun utilisateur trouvé.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Utilisateurs',
    subtitle: "Gestion des comptes d'accès à la plateforme Inspect-San.",
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateUserBtn">
        <i class="ti ti-plus me-1"></i> Nouvel utilisateur
      </button>
    `,
  });

  const isView = state.mode === 'view';
  const selectedUser = appStore.utilisateurs.find((u) => u.id === state.selectedId);
  const modalTitle =
    state.mode === 'create'
      ? 'Nouvel utilisateur'
      : state.mode === 'edit'
      ? "Modifier l'utilisateur"
      : "Détail de l'utilisateur";

  const modalContentHtml = `
    <form id="userForm">
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label">Nom ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control"
            id="formNom"
            value="${state.form.nom || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Contact (e-mail) ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="email"
            class="form-control"
            id="formContact"
            value="${state.form.contact || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
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
        <div class="col-md-6">
          <label class="form-label">Rôle ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formRole" required ${isView ? 'disabled' : ''}>
            ${ROLES.map((r) => `<option value="${r}" ${state.form.role === r ? 'selected' : ''}>${r}</option>`).join('')}
          </select>
        </div>

        <div class="col-md-6 ${state.form.role === 'Contrôleur' ? '' : 'd-none'}" id="equipeContainer">
          <label class="form-label">Équipe</label>
          <input
            type="text"
            class="form-control"
            list="equipes-list"
            id="formEquipe"
            value="${state.form.equipe || ''}"
            placeholder="Sélectionner ou saisir une équipe"
            ${isView ? 'disabled' : ''}
          />
          <datalist id="equipes-list">
            ${equipes.map((eq) => `<option value="${eq.nom}"></option>`).join('')}
          </datalist>
        </div>

        <div class="col-md-6">
          <label class="form-label">Identifiant ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <input
            type="text"
            class="form-control"
            id="formIdentifiant"
            value="${state.form.identifiant || ''}"
            required
            ${isView ? 'disabled' : ''}
          />
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut ${!isView ? '<span class="text-danger">*</span>' : ''}</label>
          <select class="form-select" id="formStatut" required ${isView ? 'disabled' : ''}>
            ${Object.entries(USER_STATUTS)
              .map(([v, label]) => `<option value="${v}" ${state.form.statut === v ? 'selected' : ''}>${label}</option>`)
              .join('')}
          </select>
        </div>

        ${
          state.mode === 'create'
            ? `
          <div class="col-md-6">
            <label class="form-label">Mot de passe</label>
            <input
              type="password"
              class="form-control"
              id="formMotDePasse"
              value="${state.form.motDePasse || ''}"
              placeholder="Laisser vide pour générer un mot de passe par défaut"
            />
            <div class="form-text">
              Optionnel : si vide, un mot de passe par défaut sera attribué.
            </div>
          </div>
        `
            : ''
        }

        ${
          isView
            ? `
          <div class="col-12">
            <hr class="my-2" />
            <p class="text-secondary small mb-0">
              Créé le ${formatDate(selectedUser?.createdAt)}. Utilisez l'action « Réinitialiser » depuis le
              tableau pour changer le mot de passe de cet utilisateur.
            </p>
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
      <button type="submit" form="userForm" class="btn btn-primary">Enregistrer</button>
    `;

  const modalHtml = renderModalHTML({
    id: 'userModal',
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

export function initUtilisateursPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderUtilisateursPage();
    initUtilisateursPageEvents(container);
  };

  const openFormModal = (mode, user = null) => {
    state.mode = mode;
    state.selectedId = user?.id || null;
    if (user) {
      state.form = {
        nom: user.nom,
        contact: user.contact,
        telephone: user.telephone || '',
        role: user.role,
        equipe: user.equipe || '',
        statut: user.statut,
        identifiant: user.identifiant,
        motDePasse: '',
      };
    } else {
      state.form = {
        nom: '',
        contact: '',
        telephone: '',
        role: ROLES[0],
        equipe: '',
        statut: 'actif',
        identifiant: '',
        motDePasse: '',
      };
    }
    refreshPage();
    openModal('userModal');
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
      const user = appStore.utilisateurs.find((u) => u.id === id);
      if (action === 'view') openFormModal('view', user);
      if (action === 'edit') openFormModal('edit', user);
      if (action === 'reset') {
        showConfirmDialog({
          title: 'Réinitialiser le mot de passe',
          message:
            'Voulez-vous réinitialiser le mot de passe de cet utilisateur ? Un nouveau mot de passe temporaire sera généré.',
          confirmLabel: 'Réinitialiser',
          onConfirm: () => {
            appStore.resetPassword(id);
            refreshPage();
          },
        });
      }
      if (action === 'delete') {
        showConfirmDialog({
          title: "Supprimer l'utilisateur",
          message: 'Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.',
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteUtilisateur(id);
            refreshPage();
          },
        });
      }
    },
  });

  const openBtn = container.querySelector('#openCreateUserBtn');
  if (openBtn) openBtn.addEventListener('click', () => openFormModal('create'));

  const roleFilter = container.querySelector('#filterRoleSelect');
  if (roleFilter) {
    roleFilter.addEventListener('change', (e) => {
      state.filterRole = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  const statutFilter = container.querySelector('#filterUserStatutSelect');
  if (statutFilter) {
    statutFilter.addEventListener('change', (e) => {
      state.filterStatut = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  const formRoleSelect = container.querySelector('#formRole');
  if (formRoleSelect) {
    formRoleSelect.addEventListener('change', (e) => {
      state.form.role = e.target.value;
      const eqContainer = container.querySelector('#equipeContainer');
      if (eqContainer) {
        if (e.target.value === 'Contrôleur') eqContainer.classList.remove('d-none');
        else eqContainer.classList.add('d-none');
      }
    });
  }

  const userForm = container.querySelector('#userForm');
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const payload = {
        id: state.selectedId,
        nom: container.querySelector('#formNom').value.trim(),
        contact: container.querySelector('#formContact').value.trim(),
        telephone: container.querySelector('#formTelephone').value.trim() || null,
        role: container.querySelector('#formRole').value,
        equipe:
          container.querySelector('#formRole').value === 'Contrôleur'
            ? container.querySelector('#formEquipe')?.value.trim() || null
            : null,
        statut: container.querySelector('#formStatut').value,
        identifiant: container.querySelector('#formIdentifiant').value.trim(),
      };
      if (state.mode === 'create') {
        const pwd = container.querySelector('#formMotDePasse')?.value.trim();
        if (pwd) payload.motDePasse = pwd;
      }

      appStore.upsertUtilisateur(payload);
      closeModal('userModal').then(() => refreshPage());
    });
  }
}
