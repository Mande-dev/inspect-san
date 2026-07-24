import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { renderDataTable, initDataTableEvents } from '../components/DataTable.js';
import { renderModalHTML, openModal, closeModal, teardownModals } from '../components/Modal.js';
import { renderStatusBadgeHTML } from '../components/StatusBadge.js';
import { showConfirmDialog } from '../components/ConfirmDialog.js';
import { FICHE_STATUTS, ORDRE_STATUTS } from '../mock/constantes.js';
import { formatDate, formatDateTime, openPrintPreview } from '../utils/helpers.js';

const ORDRES_AUTORISES_CREATION = ['signe', 'en_cours', 'cloture'];
const ETATS_GENERAUX = ['Bon', 'Moyen', 'Dégradé', 'Critique'];
const PRODUITS_STANDARD = ['Javel', 'Savon', 'Balais', 'Seaux'];
const RECOMMANDATIONS = [
  'Maintien avec recommandations',
  'Réhabilitation partielle',
  'Fermeture temporaire proposée',
  'Suivi renforcé',
];

function photoId() {
  return `ph-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

let state = {
  q: '',
  page: 1,
  sortKey: null,
  sortDir: 'asc',
  filterStatut: '',
  form: {
    id: null,
    numero: '',
    ordreMissionId: '',
    ecoleId: '',
    chefId: '',
    statut: 'brouillon',
    sectionBatiments: {
      nombreBatiments: '',
      etatGeneral: 'Bon',
      toilettesFilles: '',
      toilettesGarcons: '',
      nombreEleves: '',
    },
    sectionImpact7: {
      montantPercu: '',
      produitsNettoyage: [],
      quantite: '',
    },
    produitsAutres: '',
    observations: '',
    recommandationPreliminaire: RECOMMANDATIONS[0],
    photos: [],
  },
};

export function renderFichesControlePage() {
  const currentUser = appStore.currentUser;
  const fichesControle = appStore.fichesControle;
  const ordresMission = appStore.ordresMission;
  const ecoles = appStore.ecoles;
  const chefs = appStore.chefs;

  const ecoleMap = new Map(ecoles.map((e) => [e.id, e]));
  const chefMap = new Map(chefs.map((c) => [c.id, c]));
  const ordreMap = new Map(ordresMission.map((o) => [o.id, o]));

  const filteredRows = fichesControle.filter((f) => {
    if (state.filterStatut && f.statut !== state.filterStatut) return false;
    return true;
  });

  const isChefUser = currentUser?.role === "Chef d'établissement";

  const columns = [
    { key: 'numero', header: 'N° Fiche', sortable: true },
    {
      key: 'ordreMission',
      header: 'N° OM',
      render: (row) => ordreMap.get(row.ordreMissionId)?.numero || '—',
    },
    {
      key: 'ecole',
      header: 'École',
      render: (row) => ecoleMap.get(row.ecoleId)?.denomination || '—',
    },
    {
      key: 'chef',
      header: "Chef d'étab.",
      render: (row) => chefMap.get(row.chefId)?.nomComplet || '—',
    },
    {
      key: 'createdAt',
      header: 'Date',
      sortable: true,
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'statut',
      header: 'Statut',
      sortable: true,
      render: (row) => renderStatusBadgeHTML(FICHE_STATUTS, row.statut),
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (row) => `
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-sm btn-icon btn-outline-primary" title="Editer / Voir" data-action="edit" data-id="${row.id}">
            <i class="ti ti-edit"></i>
          </button>
          ${
            isChefUser && row.statut === 'en_attente_validation'
              ? `<button type="button" class="btn btn-sm btn-success" data-action="valider" data-id="${row.id}">
                  <i class="ti ti-check me-1"></i> Valider
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
    <select class="form-select" id="filterFicheStatut">
      <option value="">Tous les statuts</option>
      ${Object.entries(FICHE_STATUTS)
        .map(([v, label]) => `<option value="${v}" ${state.filterStatut === v ? 'selected' : ''}>${label}</option>`)
        .join('')}
    </select>
  `;

  const dataTableHtml = renderDataTable({
    columns,
    rows: filteredRows,
    searchKeys: ['numero', (row) => ecoleMap.get(row.ecoleId)?.denomination || ''],
    searchPlaceholder: 'Rechercher une fiche, une école…',
    emptyMessage: 'Aucune fiche de contrôle trouvée.',
    filtersHtml,
    q: state.q,
    page: state.page,
    sortKey: state.sortKey,
    sortDir: state.sortDir,
  });

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Fiches de contrôle',
    subtitle: 'Saisie et validation des fiches de contrôle sanitaire scolaire',
    actionsHtml: `
      <button type="button" class="btn btn-primary" id="openCreateFicheBtn">
        <i class="ti ti-plus me-1"></i> Nouvelle fiche de contrôle
      </button>
    `,
  });

  const isReadOnly = state.form.statut === 'validee';
  const selectedOrdre = ordreMap.get(state.form.ordreMissionId);
  const selectedEcole = ecoleMap.get(state.form.ecoleId);
  const selectedChef = chefMap.get(state.form.chefId);

  const modalTitle = state.form.id ? `Fiche ${state.form.numero}` : 'Nouvelle fiche de contrôle';

  const modalContentHtml = `
    <form id="ficheForm">
      <div class="row g-3 mb-4">
        <div class="col-md-6">
          <label class="form-label">Ordre de mission <span class="text-danger">*</span></label>
          <select class="form-select" id="formOrdreMissionId" required ${isReadOnly ? 'disabled' : ''}>
            <option value="">Sélectionner un OM…</option>
            ${ordresMission
              .map(
                (o) =>
                  `<option value="${o.id}" ${state.form.ordreMissionId === o.id ? 'selected' : ''}>${o.numero} — ${
                    ecoleMap.get(o.ecoleId)?.denomination || ''
                  } (${ORDRE_STATUTS[o.statut] || o.statut})</option>`
              )
              .join('')}
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Statut</label>
          <select class="form-select" id="formStatut" ${isReadOnly ? 'disabled' : ''}>
            ${Object.entries(FICHE_STATUTS)
              .map(([v, label]) => `<option value="${v}" ${state.form.statut === v ? 'selected' : ''}>${label}</option>`)
              .join('')}
          </select>
        </div>
      </div>

      <div class="card bg-light border mb-4">
        <div class="card-body">
          <h6 class="card-title mb-2">Informations associées</h6>
          <div class="row g-2 small text-secondary">
            <div class="col-md-6">
              <strong>École :</strong> ${selectedEcole ? selectedEcole.denomination : '—'}
            </div>
            <div class="col-md-6">
              <strong>Commune :</strong> ${selectedEcole?.adresse?.commune || '—'}
            </div>
            <div class="col-md-6">
              <strong>Chef d'établissement :</strong> ${selectedChef ? selectedChef.nomComplet : '—'}
            </div>
            <div class="col-md-6">
              <strong>ID DINACOPE :</strong> ${selectedEcole?.idDinacope || '—'}
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Section Bâtiments & Infrastructures</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Nombre de bâtiments</label>
              <input
                type="number"
                min="0"
                class="form-control"
                id="formNombreBatiments"
                value="${state.form.sectionBatiments.nombreBatiments}"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
            <div class="col-md-4">
              <label class="form-label">État général</label>
              <select class="form-select" id="formEtatGeneral" ${isReadOnly ? 'disabled' : ''}>
                ${ETATS_GENERAUX.map(
                  (eg) => `<option value="${eg}" ${state.form.sectionBatiments.etatGeneral === eg ? 'selected' : ''}>${eg}</option>`
                ).join('')}
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label">Nombre d'élèves</label>
              <input
                type="number"
                min="0"
                class="form-control"
                id="formNombreEleves"
                value="${state.form.sectionBatiments.nombreEleves}"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Toilettes Filles (nombre / état)</label>
              <input
                type="text"
                class="form-control"
                id="formToilettesFilles"
                value="${state.form.sectionBatiments.toilettesFilles}"
                placeholder="Ex. 4 fonctionnelles"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Toilettes Garçons (nombre / état)</label>
              <input
                type="text"
                class="form-control"
                id="formToilettesGarcons"
                value="${state.form.sectionBatiments.toilettesGarcons}"
                placeholder="Ex. 3 fonctionnelles"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Section Frais de fonctionnement (Impact 7$)</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label class="form-label">Montant perçu (FC / $)</label>
              <input
                type="text"
                class="form-control"
                id="formMontantPercu"
                value="${state.form.sectionImpact7.montantPercu}"
                placeholder="Ex. 140 000 FC"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
            <div class="col-md-8">
              <label class="form-label">Produits de nettoyage achetés</label>
              <div class="d-flex flex-wrap gap-3 mt-1">
                ${PRODUITS_STANDARD.map(
                  (p) => `
                  <div class="form-check">
                    <input
                      class="form-check-input produit-check"
                      type="checkbox"
                      id="prod-${p}"
                      value="${p}"
                      ${state.form.sectionImpact7.produitsNettoyage.includes(p) ? 'checked' : ''}
                      ${isReadOnly ? 'disabled' : ''}
                    />
                    <label class="form-check-label" for="prod-${p}">${p}</label>
                  </div>
                `
                ).join('')}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Autres produits</label>
              <input
                type="text"
                class="form-control"
                id="formProduitsAutres"
                value="${state.form.produitsAutres}"
                placeholder="Séparés par des virgules"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
            <div class="col-md-6">
              <label class="form-label">Quantité / Précisions</label>
              <input
                type="text"
                class="form-control"
                id="formQuantite"
                value="${state.form.sectionImpact7.quantite}"
                placeholder="Ex. 10L Javel, 2 cartons de savon"
                ${isReadOnly ? 'disabled' : ''}
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header"><h6 class="mb-0">Observations & Recommandation</h6></div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-12">
              <label class="form-label">Observations générales</label>
              <textarea
                class="form-control"
                rows="3"
                id="formObservations"
                ${isReadOnly ? 'disabled' : ''}
              >${state.form.observations}</textarea>
            </div>
            <div class="col-12">
              <label class="form-label">Recommandation préliminaire</label>
              <select class="form-select" id="formRecommandationPreliminaire" ${isReadOnly ? 'disabled' : ''}>
                ${RECOMMANDATIONS.map(
                  (r) => `<option value="${r}" ${state.form.recommandationPreliminaire === r ? 'selected' : ''}>${r}</option>`
                ).join('')}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Photos constatées sur le terrain</h6>
          ${
            !isReadOnly
              ? `<label class="btn btn-sm btn-outline-primary mb-0">
                  <i class="ti ti-camera me-1"></i> Ajouter photo
                  <input type="file" id="photoFileInput" accept="image/*" class="d-none" />
                </label>`
              : ''
          }
        </div>
        <div class="card-body">
          ${
            state.form.photos.length === 0
              ? `<p class="text-secondary small mb-0">Aucune photo jointe.</p>`
              : `
            <div class="row g-3" id="photoList">
              ${state.form.photos
                .map(
                  (ph, idx) => `
                <div class="col-md-6 col-lg-4">
                  <div class="border rounded p-2 text-center position-relative">
                    <img src="${ph.url}" alt="${ph.legende}" class="img-fluid rounded mb-2" style="max-height: 140px; object-fit: cover;" />
                    <p class="small text-muted mb-0">${ph.legende}</p>
                    ${
                      !isReadOnly
                        ? `<button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1" data-remove-photo="${idx}">
                            <i class="ti ti-x"></i>
                          </button>`
                        : ''
                    }
                  </div>
                </div>
              `
                )
                .join('')}
            </div>
          `
          }
        </div>
      </div>
    </form>
  `;

  const footerHtml = isReadOnly
    ? `<button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>`
    : `
      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Annuler</button>
      <button type="submit" form="ficheForm" class="btn btn-primary">Enregistrer</button>
    `;

  const modalHtml = renderModalHTML({
    id: 'ficheModal',
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

export function initFichesControlePageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    teardownModals(container);
    container.innerHTML = renderFichesControlePage();
    initFichesControlePageEvents(container);
  };

  const openFormModal = (fiche = null) => {
    if (fiche) {
      const produits = fiche.sectionImpact7?.produitsNettoyage || [];
      const standard = produits.filter((p) => PRODUITS_STANDARD.includes(p));
      const autres = produits.filter((p) => !PRODUITS_STANDARD.includes(p));
      state.form = {
        id: fiche.id,
        numero: fiche.numero || '',
        ordreMissionId: fiche.ordreMissionId || '',
        ecoleId: fiche.ecoleId || '',
        chefId: fiche.chefId || '',
        statut: fiche.statut || 'brouillon',
        sectionBatiments: {
          nombreBatiments: fiche.sectionBatiments?.nombreBatiments ?? '',
          etatGeneral: fiche.sectionBatiments?.etatGeneral || 'Bon',
          toilettesFilles: fiche.sectionBatiments?.toilettesFilles ?? '',
          toilettesGarcons: fiche.sectionBatiments?.toilettesGarcons ?? '',
          nombreEleves: fiche.sectionBatiments?.nombreEleves ?? '',
        },
        sectionImpact7: {
          montantPercu: fiche.sectionImpact7?.montantPercu ?? '',
          produitsNettoyage: standard,
          quantite: fiche.sectionImpact7?.quantite || '',
        },
        produitsAutres: autres.join(', '),
        observations: fiche.observations || '',
        recommandationPreliminaire: fiche.recommandationPreliminaire || RECOMMANDATIONS[0],
        photos: fiche.photos ? [...fiche.photos] : [],
      };
    } else {
      state.form = {
        id: null,
        numero: '',
        ordreMissionId: '',
        ecoleId: '',
        chefId: '',
        statut: 'brouillon',
        sectionBatiments: {
          nombreBatiments: '',
          etatGeneral: 'Bon',
          toilettesFilles: '',
          toilettesGarcons: '',
          nombreEleves: '',
        },
        sectionImpact7: {
          montantPercu: '',
          produitsNettoyage: [],
          quantite: '',
        },
        produitsAutres: '',
        observations: '',
        recommandationPreliminaire: RECOMMANDATIONS[0],
        photos: [],
      };
    }
    refreshPage();
    openModal('ficheModal');
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
      const fiche = appStore.fichesControle.find((f) => f.id === id);
      if (action === 'edit') openFormModal(fiche);
      if (action === 'valider') {
        showConfirmDialog({
          title: 'Valider la fiche de contrôle',
          message:
            'En tant que Chef d\'établissement, vous validez les informations de cette fiche (Lu et approuvé).',
          confirmLabel: 'Valider (Lu et approuvé)',
          onConfirm: () => {
            appStore.validerFiche(id);
            refreshPage();
          },
        });
      }
      if (action === 'delete') {
        showConfirmDialog({
          title: 'Supprimer la fiche de contrôle',
          message: 'Voulez-vous vraiment supprimer cette fiche de contrôle ? Cette action est irréversible.',
          confirmLabel: 'Supprimer',
          danger: true,
          onConfirm: () => {
            appStore.deleteFiche(id);
            refreshPage();
          },
        });
      }
      if (action === 'print') {
        const ecole = appStore.ecoles.find((e) => e.id === fiche.ecoleId);
        const chef = appStore.chefs.find((c) => c.id === fiche.chefId);
        const ordre = appStore.ordresMission.find((o) => o.id === fiche.ordreMissionId);
        const html = `
          <h2>Fiche de contrôle ${fiche.numero}</h2>
          <p class="text-secondary">Province Éducationnelle de Kinshasa / Mont-Amba</p>
          <hr />
          <h5>1. Généralités</h5>
          <p><strong>École :</strong> ${ecole?.denomination || '—'}</p>
          <p><strong>Chef d'établissement :</strong> ${chef?.nomComplet || '—'}</p>
          <p><strong>Ordre de mission :</strong> ${ordre?.numero || '—'}</p>
          <h5>2. Bâtiments & Infrastructures</h5>
          <p><strong>État général :</strong> ${fiche.sectionBatiments?.etatGeneral || '—'}</p>
          <p><strong>Nombre d'élèves :</strong> ${fiche.sectionBatiments?.nombreEleves || '—'}</p>
          <p><strong>Toilettes filles :</strong> ${fiche.sectionBatiments?.toilettesFilles || '—'}</p>
          <p><strong>Toilettes garçons :</strong> ${fiche.sectionBatiments?.toilettesGarcons || '—'}</p>
          <h5>3. Observations & Recommandations</h5>
          <p>${fiche.observations || 'Aucune observation.'}</p>
          <p><strong>Recommandation :</strong> ${fiche.recommandationPreliminaire || '—'}</p>
          <p><strong>Statut :</strong> ${FICHE_STATUTS[fiche.statut] || fiche.statut}</p>
        `;
        openPrintPreview(`Fiche ${fiche.numero}`, html);
      }
    },
  });

  const openBtn = container.querySelector('#openCreateFicheBtn');
  if (openBtn) openBtn.addEventListener('click', () => openFormModal(null));

  const filterSelect = container.querySelector('#filterFicheStatut');
  if (filterSelect) {
    filterSelect.addEventListener('change', (e) => {
      state.filterStatut = e.target.value;
      state.page = 1;
      refreshPage();
    });
  }

  const ordreSelect = container.querySelector('#formOrdreMissionId');
  if (ordreSelect) {
    ordreSelect.addEventListener('change', (e) => {
      const oid = e.target.value;
      state.form.ordreMissionId = oid;
      const ordre = appStore.ordresMission.find((o) => o.id === oid);
      if (ordre) {
        state.form.ecoleId = ordre.ecoleId;
        const chef = appStore.chefs.find((c) => c.ecoleId === ordre.ecoleId);
        state.form.chefId = chef ? chef.id : '';
      } else {
        state.form.ecoleId = '';
        state.form.chefId = '';
      }
      refreshPage();
      openModal('ficheModal');
    });
  }

  const photoInput = container.querySelector('#photoFileInput');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        state.form.photos.push({
          id: photoId(),
          url: evt.target.result,
          legende: file.name,
        });
        refreshPage();
        openModal('ficheModal');
      };
      reader.readAsDataURL(file);
    });
  }

  container.querySelectorAll('[data-remove-photo]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-remove-photo'), 10);
      state.form.photos.splice(idx, 1);
      refreshPage();
      openModal('ficheModal');
    });
  });

  const ficheForm = container.querySelector('#ficheForm');
  if (ficheForm) {
    ficheForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedProds = Array.from(container.querySelectorAll('.produit-check:checked')).map((c) => c.value);
      const autresStr = container.querySelector('#formProduitsAutres')?.value.trim() || '';
      const autresArr = autresStr ? autresStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
      const tousProduits = Array.from(new Set([...checkedProds, ...autresArr]));

      const payload = {
        id: state.form.id || undefined,
        numero: state.form.numero || undefined,
        ordreMissionId: state.form.ordreMissionId,
        ecoleId: state.form.ecoleId,
        chefId: state.form.chefId,
        statut: container.querySelector('#formStatut')?.value || state.form.statut,
        sectionBatiments: {
          nombreBatiments: Number(container.querySelector('#formNombreBatiments')?.value) || 0,
          etatGeneral: container.querySelector('#formEtatGeneral')?.value || 'Bon',
          toilettesFilles: container.querySelector('#formToilettesFilles')?.value.trim() || '',
          toilettesGarcons: container.querySelector('#formToilettesGarcons')?.value.trim() || '',
          nombreEleves: Number(container.querySelector('#formNombreEleves')?.value) || 0,
        },
        sectionImpact7: {
          montantPercu: container.querySelector('#formMontantPercu')?.value.trim() || '',
          produitsNettoyage: tousProduits,
          quantite: container.querySelector('#formQuantite')?.value.trim() || '',
        },
        observations: container.querySelector('#formObservations')?.value.trim() || '',
        recommandationPreliminaire: container.querySelector('#formRecommandationPreliminaire')?.value || RECOMMANDATIONS[0],
        photos: state.form.photos,
      };

      appStore.upsertFiche(payload);
      closeModal('ficheModal').then(() => refreshPage());
    });
  }
}
