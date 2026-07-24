import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { ECOLE_STATUTS, DECISION_TYPES } from '../mock/constantes.js';
import { downloadText, openPrintPreview, formatDate } from '../utils/helpers.js';

const MOIS_COURTS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];
const ETATS = ['Bon', 'Moyen', 'Dégradé', 'Critique'];

let state = {
  dateFrom: '',
  dateTo: '',
  commune: '',
  regime: '',
  statutEcole: '',
};

let chartInstances = [];

export function renderStatistiquesPage() {
  const ecoles = appStore.ecoles;
  const fichesControle = appStore.fichesControle;
  const decisions = appStore.decisions;
  const communes = appStore.communes;
  const regimes = appStore.regimes;

  const inRange = (iso) => {
    if (!iso) return true;
    const d = new Date(iso);
    if (state.dateFrom && d < new Date(state.dateFrom)) return false;
    if (state.dateTo && d > new Date(`${state.dateTo}T23:59:59`)) return false;
    return true;
  };

  const ecolesFiltrees = ecoles.filter(
    (e) =>
      (!state.commune || e.adresse?.commune === state.commune) &&
      (!state.regime || e.regime === state.regime) &&
      (!state.statutEcole || e.statut === state.statutEcole)
  );
  const ecoleIds = new Set(ecolesFiltrees.map((e) => e.id));

  const fichesFiltrees = fichesControle.filter((f) => ecoleIds.has(f.ecoleId) && inRange(f.createdAt));
  const decisionsFiltrees = decisions.filter((d) => ecoleIds.has(d.ecoleId) && inRange(d.decideLe));

  const countsConformite = { Bon: 0, Moyen: 0, Dégradé: 0, Critique: 0 };
  fichesFiltrees.forEach((f) => {
    const etat = f.sectionBatiments?.etatGeneral;
    if (countsConformite[etat] !== undefined) countsConformite[etat] += 1;
  });
  const conformiteData = ETATS.map((etat) => countsConformite[etat]);

  const totalFiches = fichesFiltrees.length;
  const conformes = conformiteData[0] + conformiteData[1];
  const tauxConformiteGlobal = totalFiches ? Math.round((conformes / totalFiches) * 100) : 0;

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Statistiques',
    subtitle: "Indicateurs de conformité, de contrôle et d'utilisation des ressources des écoles.",
    actionsHtml: `
      <div class="d-flex gap-2 justify-content-md-end">
        <button type="button" class="btn btn-outline-secondary" id="exportExcelBtn">
          <i class="ti ti-file-spreadsheet me-1"></i> Excel
        </button>
        <button type="button" class="btn btn-outline-secondary" id="exportPdfBtn">
          <i class="ti ti-file-type-pdf me-1"></i> PDF
        </button>
      </div>
    `,
  });

  return `
    <div>
      ${pageHeaderHtml}

      <div class="card card-lg mb-6">
        <div class="card-body">
          <div class="row g-3 align-items-end">
            <div class="col-md-2">
              <label class="form-label">Du</label>
              <input
                type="date"
                class="form-control"
                id="filterDateFrom"
                value="${state.dateFrom}"
              />
            </div>
            <div class="col-md-2">
              <label class="form-label">Au</label>
              <input
                type="date"
                class="form-control"
                id="filterDateTo"
                value="${state.dateTo}"
              />
            </div>
            <div class="col-md-3">
              <label class="form-label">Commune</label>
              <select class="form-select" id="filterCommuneStat">
                <option value="">Toutes les communes</option>
                ${communes
                  .map(
                    (c) => `<option value="${c.nom}" ${state.commune === c.nom ? 'selected' : ''}>${c.nom}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Régime</label>
              <select class="form-select" id="filterRegimeStat">
                <option value="">Tous</option>
                ${regimes
                  .map(
                    (r) => `<option value="${r.nom}" ${state.regime === r.nom ? 'selected' : ''}>${r.nom}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="col-md-2">
              <label class="form-label">Statut école</label>
              <select class="form-select" id="filterStatutEcoleStat">
                <option value="">Tous</option>
                ${Object.entries(ECOLE_STATUTS)
                  .map(
                    ([k, label]) =>
                      `<option value="${k}" ${state.statutEcole === k ? 'selected' : ''}>${label}</option>`
                  )
                  .join('')}
              </select>
            </div>
            <div class="col-md-1">
              <button
                type="button"
                class="btn btn-outline-secondary w-100"
                id="resetStatFiltersBtn"
                title="Réinitialiser"
              >
                <i class="ti ti-refresh"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Écoles concernées</p>
              <h3 class="mb-0">${ecolesFiltrees.length}</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Fiches de contrôle</p>
              <h3 class="mb-0">${fichesFiltrees.length}</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Taux de conformité</p>
              <h3 class="mb-0">${tauxConformiteGlobal}%</h3>
            </div>
          </div>
        </div>
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body">
              <p class="text-secondary small mb-1">Décisions prises</p>
              <h3 class="mb-0">${decisionsFiltrees.length}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Taux de conformité des établissements</h5>
              <div id="statChartConformite"></div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Répartition des décisions</h5>
              <div id="statChartDecisions"></div>
            </div>
          </div>
        </div>
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Taux d'utilisation des 7 %</h5>
              <div id="statChart7"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card card-lg">
            <div class="card-body">
              <h5 class="mb-4">Évolution des contrôles réalisés</h5>
              <div id="statChartEvolution"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initStatistiquesPageEvents(container) {
  if (!container) return;

  const refreshPage = () => {
    container.innerHTML = renderStatistiquesPage();
    initStatistiquesPageEvents(container);
  };

  // Clear charts
  chartInstances.forEach((chart) => {
    try {
      chart.destroy();
    } catch {}
  });
  chartInstances = [];

  const inRange = (iso) => {
    if (!iso) return true;
    const d = new Date(iso);
    if (state.dateFrom && d < new Date(state.dateFrom)) return false;
    if (state.dateTo && d > new Date(`${state.dateTo}T23:59:59`)) return false;
    return true;
  };

  const ecoles = appStore.ecoles;
  const fichesControle = appStore.fichesControle;
  const decisions = appStore.decisions;

  const ecolesFiltrees = ecoles.filter(
    (e) =>
      (!state.commune || e.adresse?.commune === state.commune) &&
      (!state.regime || e.regime === state.regime) &&
      (!state.statutEcole || e.statut === state.statutEcole)
  );
  const ecoleIds = new Set(ecolesFiltrees.map((e) => e.id));

  const fichesFiltrees = fichesControle.filter((f) => ecoleIds.has(f.ecoleId) && inRange(f.createdAt));
  const decisionsFiltrees = decisions.filter((d) => ecoleIds.has(d.ecoleId) && inRange(d.decideLe));

  if (typeof window.ApexCharts !== 'undefined') {
    // 1. Conformité donut
    const countsConformite = { Bon: 0, Moyen: 0, Dégradé: 0, Critique: 0 };
    fichesFiltrees.forEach((f) => {
      const etat = f.sectionBatiments?.etatGeneral;
      if (countsConformite[etat] !== undefined) countsConformite[etat] += 1;
    });
    const conformiteData = ETATS.map((etat) => countsConformite[etat]);

    const elC1 = container.querySelector('#statChartConformite');
    if (elC1) {
      const c1 = new window.ApexCharts(elC1, {
        chart: { type: 'donut', height: 300 },
        labels: ETATS,
        colors: ['#20c997', '#0d6efd', '#fd7e14', '#dc3545'],
        legend: { position: 'bottom' },
        series: conformiteData,
      });
      c1.render();
      chartInstances.push(c1);
    }

    // 2. Décisions donut
    const mapDec = {};
    decisionsFiltrees.forEach((d) => {
      mapDec[d.type] = (mapDec[d.type] || 0) + 1;
    });
    const decisionsData = Object.entries(mapDec).map(([type, count]) => ({
      label: DECISION_TYPES[type] || type,
      count,
    }));

    const elC2 = container.querySelector('#statChartDecisions');
    if (elC2) {
      if (decisionsData.length === 0) {
        elC2.innerHTML = '<p class="text-secondary mb-0">Aucune décision sur la période sélectionnée.</p>';
      } else {
        const c2 = new window.ApexCharts(elC2, {
          chart: { type: 'donut', height: 300 },
          labels: decisionsData.map((d) => d.label),
          colors: ['#0d6efd', '#ffc107', '#fd7e14', '#dc3545'],
          legend: { position: 'bottom' },
          series: decisionsData.map((d) => d.count),
        });
        c2.render();
        chartInstances.push(c2);
      }
    }

    // 3. Taux utilisation 7% radial
    const avecMontant = fichesFiltrees.filter((f) => (f.sectionImpact7?.montantPercu || 0) > 0);
    const utilises = avecMontant.filter((f) => (f.sectionImpact7?.produitsNettoyage?.length || 0) > 0);
    const tauxUtilisation7 = avecMontant.length ? Math.round((utilises.length / avecMontant.length) * 100) : 0;

    const elC3 = container.querySelector('#statChart7');
    if (elC3) {
      const c3 = new window.ApexCharts(elC3, {
        chart: { type: 'radialBar', height: 300 },
        labels: ["Produits d'hygiène achetés"],
        colors: ['#0d6efd'],
        plotOptions: {
          radialBar: {
            hollow: { size: '60%' },
            dataLabels: { value: { formatter: (v) => `${v}%` } },
          },
        },
        series: [tauxUtilisation7],
      });
      c3.render();
      chartInstances.push(c3);
    }

    // 4. Évolution bar
    const mapEvol = {};
    fichesFiltrees.forEach((f) => {
      const d = new Date(f.createdAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      mapEvol[key] = (mapEvol[key] || 0) + 1;
    });

    const evolutionData = Object.entries(mapEvol)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, count]) => {
        const [y, m] = key.split('-');
        return { label: `${MOIS_COURTS[Number(m) - 1]} ${y.slice(2)}`, count };
      });

    const elC4 = container.querySelector('#statChartEvolution');
    if (elC4) {
      if (evolutionData.length === 0) {
        elC4.innerHTML = '<p class="text-secondary mb-0">Aucune fiche de contrôle sur la période sélectionnée.</p>';
      } else {
        const c4 = new window.ApexCharts(elC4, {
          chart: { type: 'bar', height: 320, toolbar: { show: false } },
          plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
          xaxis: { categories: evolutionData.map((d) => d.label) },
          colors: ['#0d6efd'],
          series: [{ name: 'Fiches de contrôle', data: evolutionData.map((d) => d.count) }],
        });
        c4.render();
        chartInstances.push(c4);
      }
    }
  }

  // Filter inputs
  ['filterDateFrom', 'filterDateTo', 'filterCommuneStat', 'filterRegimeStat', 'filterStatutEcoleStat'].forEach(
    (id) => {
      const el = container.querySelector(`#${id}`);
      if (el) {
        el.addEventListener('change', (e) => {
          if (id === 'filterDateFrom') state.dateFrom = e.target.value;
          if (id === 'filterDateTo') state.dateTo = e.target.value;
          if (id === 'filterCommuneStat') state.commune = e.target.value;
          if (id === 'filterRegimeStat') state.regime = e.target.value;
          if (id === 'filterStatutEcoleStat') state.statutEcole = e.target.value;
          refreshPage();
        });
      }
    }
  );

  const resetBtn = container.querySelector('#resetStatFiltersBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      state = { dateFrom: '', dateTo: '', commune: '', regime: '', statutEcole: '' };
      refreshPage();
    });
  }

  const exportPdfBtn = container.querySelector('#exportPdfBtn');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', () => {
      const totalFiches = fichesFiltrees.length;
      const countsConformite = { Bon: 0, Moyen: 0, Dégradé: 0, Critique: 0 };
      fichesFiltrees.forEach((f) => {
        const etat = f.sectionBatiments?.etatGeneral;
        if (countsConformite[etat] !== undefined) countsConformite[etat] += 1;
      });
      const conformes = countsConformite['Bon'] + countsConformite['Moyen'];
      const tauxConformiteGlobal = totalFiches ? Math.round((conformes / totalFiches) * 100) : 0;

      const html = `
        <h2>Rapport statistique — Inspect-San</h2>
        <p>Période : ${state.dateFrom ? formatDate(state.dateFrom) : 'début'} — ${
        state.dateTo ? formatDate(state.dateTo) : "aujourd'hui"
      }</p>
        <p>Filtres : Commune ${state.commune || 'toutes'}, Régime ${state.regime || 'tous'}, Statut école ${
        state.statutEcole ? ECOLE_STATUTS[state.statutEcole] : 'tous'
      }</p>
        <table border="1" cellpadding="6" style="border-collapse:collapse;width:100%">
          <tr><th>Indicateur</th><th>Valeur</th></tr>
          <tr><td>Écoles concernées</td><td>${ecolesFiltrees.length}</td></tr>
          <tr><td>Fiches de contrôle</td><td>${fichesFiltrees.length}</td></tr>
          <tr><td>Taux de conformité</td><td>${tauxConformiteGlobal}%</td></tr>
          <tr><td>Décisions prises</td><td>${decisionsFiltrees.length}</td></tr>
        </table>
      `;
      openPrintPreview('Statistiques Inspect-San', html);
    });
  }

  const exportExcelBtn = container.querySelector('#exportExcelBtn');
  if (exportExcelBtn) {
    exportExcelBtn.addEventListener('click', () => {
      const totalFiches = fichesFiltrees.length;
      const countsConformite = { Bon: 0, Moyen: 0, Dégradé: 0, Critique: 0 };
      fichesFiltrees.forEach((f) => {
        const etat = f.sectionBatiments?.etatGeneral;
        if (countsConformite[etat] !== undefined) countsConformite[etat] += 1;
      });
      const conformes = countsConformite['Bon'] + countsConformite['Moyen'];
      const tauxConformiteGlobal = totalFiches ? Math.round((conformes / totalFiches) * 100) : 0;

      const lines = [
        'Indicateur;Valeur',
        `Ecoles concernees;${ecolesFiltrees.length}`,
        `Fiches de controle;${fichesFiltrees.length}`,
        `Taux de conformite (%);${tauxConformiteGlobal}`,
        `Decisions prises;${decisionsFiltrees.length}`,
      ];
      downloadText('statistiques_inspect-san.csv', lines.join('\n'), 'text/csv;charset=utf-8;');
    });
  }
}
