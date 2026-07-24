import { appStore } from '../store/appStore.js';
import { renderPageHeaderHTML } from '../components/PageHeader.js';
import { DECISION_TYPES } from '../mock/constantes.js';
import { formatDateTime } from '../utils/helpers.js';

const MOIS_COURTS = [
  'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin',
  'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.',
];

const ROLE_TIPS = {
  'Administrateur système':
    "Vous disposez d'une vue complète sur toutes les écoles, missions, rapports et décisions de la province.",
  'Directeur Provincial':
    'Consultez les rapports transmis par le secrétariat et statuez sur les décisions en attente.',
  'Contrôleur':
    'Ce tableau de bord affiche uniquement vos ordres de mission et les fiches de contrôle qui en découlent.',
  'Agent du Secrétariat':
    'Suivez les rapports déposés à accuser réception, puis à transmettre au Directeur Provincial.',
  "Chef d'établissement":
    'Vous visualisez ici les fiches de contrôle et décisions concernant votre établissement uniquement.',
};

function renderCounterHTML({ icon, color, label, value, hint }) {
  return `
    <div class="col-xl-3 col-sm-6">
      <div class="card card-lg h-100">
        <div class="card-body d-flex align-items-center gap-3">
          <div class="icon-shape icon-lg rounded-circle bg-${color}-subtle text-${color}-emphasis flex-shrink-0">
            <i class="ti ${icon} fs-3"></i>
          </div>
          <div>
            <h3 class="mb-0">${value}</h3>
            <p class="mb-0 text-secondary small">${label}</p>
            ${hint ? `<p class="mb-0 text-muted" style="font-size: 0.75rem;">${hint}</p>` : ''}
          </div>
        </div>
      </div>
    </div>
  `;
}

let chartInstances = [];

export function renderDashboardPage() {
  const currentUser = appStore.currentUser;
  const ecoles = appStore.ecoles;
  const ordresMission = appStore.ordresMission;
  const fichesControle = appStore.fichesControle;
  const rapports = appStore.rapports;
  const decisions = appStore.decisions;
  const journalActivite = appStore.journalActivite;
  const utilisateurs = appStore.utilisateurs;

  const role = currentUser?.role;
  const isChef = role === "Chef d'établissement";
  const isControleur = role === 'Contrôleur';

  let missionsScope = ordresMission;
  if (isChef) missionsScope = ordresMission.filter((o) => o.ecoleId === currentUser?.ecoleId);
  else if (isControleur) missionsScope = ordresMission.filter((o) => o.controleurIds?.includes(currentUser?.id));

  let fichesScope = fichesControle;
  if (isChef) fichesScope = fichesControle.filter((f) => f.ecoleId === currentUser?.ecoleId);
  else if (isControleur) {
    const ids = new Set(missionsScope.map((o) => o.id));
    fichesScope = fichesControle.filter((f) => ids.has(f.ordreMissionId));
  }

  const rapportsScope = isChef ? rapports.filter((r) => r.ecoleId === currentUser?.ecoleId) : rapports;
  const decisionsScope = isChef ? decisions.filter((d) => d.ecoleId === currentUser?.ecoleId) : decisions;

  const ecolesCount = isChef ? (currentUser?.ecoleId ? 1 : 0) : ecoles.length;
  const missionsEnCours = missionsScope.filter((o) => o.statut === 'en_cours').length;
  const fichesEnAttente = fichesScope.filter((f) => f.statut === 'en_attente_validation').length;
  const rapportsDeposes = rapportsScope.filter((r) => r.statut === 'depose').length;

  const rapportsSansDecision = rapportsScope.filter(
    (r) => r.statut === 'transmis' && !decisions.some((d) => d.rapportId === r.id)
  ).length;
  const decisionsEnCours = decisionsScope.filter((d) => d.statutExecution === 'en_cours').length;
  const decisionsEnAttente = rapportsSansDecision + decisionsEnCours;

  const recentActivities = [...journalActivite]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map((log) => ({
      ...log,
      userName: utilisateurs.find((u) => u.id === log.utilisateurId)?.nom || 'Système',
    }));

  const roleTip = ROLE_TIPS[role];

  const pageHeaderHtml = renderPageHeaderHTML({
    title: 'Tableau de bord',
    subtitle: `Bienvenue, ${currentUser?.nom || ''} — ${role || ''}`,
  });

  return `
    <div>
      ${pageHeaderHtml}

      <div class="row g-3 mb-6">
        ${renderCounterHTML({
          icon: 'ti-building-community',
          color: 'primary',
          label: isChef ? 'Mon établissement' : 'Écoles enregistrées',
          value: ecolesCount,
        })}
        ${renderCounterHTML({
          icon: 'ti-file-certificate',
          color: 'info',
          label: 'Missions en cours',
          value: missionsEnCours,
        })}
        ${renderCounterHTML({
          icon: 'ti-clipboard-check',
          color: 'warning',
          label: 'Fiches en attente de validation',
          value: fichesEnAttente,
        })}
        ${renderCounterHTML({
          icon: 'ti-report-analytics',
          color: 'success',
          label: 'Rapports déposés',
          value: rapportsDeposes,
        })}
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-3 col-sm-6">
          <div class="card card-lg h-100">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="icon-shape icon-lg rounded-circle bg-danger-subtle text-danger-emphasis flex-shrink-0">
                <i class="ti ti-gavel fs-3"></i>
              </div>
              <div>
                <h3 class="mb-0">${decisionsEnAttente}</h3>
                <p class="mb-0 text-secondary small">Décisions en attente</p>
                <p class="mb-0 text-muted" style="font-size: 0.75rem;">
                  Rapports transmis sans décision + décisions en cours d'exécution
                </p>
              </div>
            </div>
          </div>
        </div>

        ${
          roleTip
            ? `
          <div class="col-xl-9 col-sm-6">
            <div class="card card-lg h-100">
              <div class="card-body d-flex align-items-center gap-3">
                <i class="ti ti-bulb fs-3 text-primary flex-shrink-0"></i>
                <p class="mb-0">${roleTip}</p>
              </div>
            </div>
          </div>
        `
            : ''
        }
      </div>

      <div class="row g-3 mb-6">
        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Conformité par commune</h5>
              <div id="chartConformite"></div>
            </div>
          </div>
        </div>

        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Contrôles réalisés (par mois)</h5>
              <div id="chartControles"></div>
            </div>
          </div>
        </div>

        <div class="col-xl-4">
          <div class="card card-lg h-100">
            <div class="card-body">
              <h5 class="mb-4">Répartition des décisions</h5>
              <div id="chartDecisions"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12">
          <div class="card card-lg">
            <div class="card-header border-bottom-0">
              <h5 class="mb-0">Activités récentes</h5>
            </div>
            <div class="card-body p-0">
              <div class="table-responsive">
                <table class="table table-hover mb-0">
                  <thead class="table-light">
                    <tr>
                      <th>Date</th>
                      <th>Utilisateur</th>
                      <th>Module</th>
                      <th>Action</th>
                      <th>Détail</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${
                      recentActivities.length === 0
                        ? `
                      <tr>
                        <td colSpan="5" class="text-center text-secondary py-5">
                          Aucune activité récente.
                        </td>
                      </tr>
                    `
                        : recentActivities
                            .map(
                              (log) => `
                        <tr>
                          <td>${formatDateTime(log.createdAt)}</td>
                          <td>${log.userName}</td>
                          <td>${log.module}</td>
                          <td class="text-capitalize">${log.action}</td>
                          <td>${log.detail}</td>
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
        </div>
      </div>
    </div>
  `;
}

export function initDashboardPageEvents(container) {
  if (!container) return;

  // Destroy previous chart instances
  chartInstances.forEach((chart) => {
    try {
      chart.destroy();
    } catch {}
  });
  chartInstances = [];

  if (typeof window.ApexCharts === 'undefined') return;

  const currentUser = appStore.currentUser;
  const ecoles = appStore.ecoles;
  const ordresMission = appStore.ordresMission;
  const fichesControle = appStore.fichesControle;
  const decisions = appStore.decisions;

  const role = currentUser?.role;
  const isChef = role === "Chef d'établissement";
  const isControleur = role === 'Contrôleur';

  let missionsScope = ordresMission;
  if (isChef) missionsScope = ordresMission.filter((o) => o.ecoleId === currentUser?.ecoleId);
  else if (isControleur) missionsScope = ordresMission.filter((o) => o.controleurIds?.includes(currentUser?.id));

  let fichesScope = fichesControle;
  if (isChef) fichesScope = fichesControle.filter((f) => f.ecoleId === currentUser?.ecoleId);
  else if (isControleur) {
    const ids = new Set(missionsScope.map((o) => o.id));
    fichesScope = fichesControle.filter((f) => ids.has(f.ordreMissionId));
  }

  const decisionsScope = isChef ? decisions.filter((d) => d.ecoleId === currentUser?.ecoleId) : decisions;

  // 1. Conformité par commune
  const mapCommune = {};
  fichesScope.forEach((f) => {
    const ecole = ecoles.find((e) => e.id === f.ecoleId);
    const commune = ecole?.adresse?.commune || 'Non renseignée';
    if (!mapCommune[commune]) mapCommune[commune] = { total: 0, conforme: 0 };
    mapCommune[commune].total += 1;
    if (['Bon', 'Moyen'].includes(f.sectionBatiments?.etatGeneral)) mapCommune[commune].conforme += 1;
  });

  const conformiteParCommune = Object.entries(mapCommune)
    .map(([commune, v]) => ({ commune, taux: v.total ? Math.round((v.conforme / v.total) * 100) : 0 }))
    .sort((a, b) => b.taux - a.taux)
    .slice(0, 10);

  const elChart1 = container.querySelector('#chartConformite');
  if (elChart1) {
    if (conformiteParCommune.length === 0) {
      elChart1.innerHTML = '<p class="text-secondary mb-0">Aucune donnée disponible.</p>';
    } else {
      const c1 = new window.ApexCharts(elChart1, {
        chart: { type: 'bar', height: 300, toolbar: { show: false } },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        dataLabels: { enabled: true, formatter: (v) => `${v}%` },
        xaxis: { categories: conformiteParCommune.map((c) => c.commune), max: 100 },
        colors: ['#0d6efd'],
        series: [{ name: 'Taux de conformité (%)', data: conformiteParCommune.map((c) => c.taux) }],
      });
      c1.render();
      chartInstances.push(c1);
    }
  }

  // 2. Contrôles par mois
  const mapMois = {};
  fichesScope.forEach((f) => {
    const d = new Date(f.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    mapMois[key] = (mapMois[key] || 0) + 1;
  });

  const controlesParMois = Object.entries(mapMois)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([key, count]) => {
      const [y, m] = key.split('-');
      return { label: `${MOIS_COURTS[Number(m) - 1]} ${y.slice(2)}`, count };
    });

  const elChart2 = container.querySelector('#chartControles');
  if (elChart2) {
    if (controlesParMois.length === 0) {
      elChart2.innerHTML = '<p class="text-secondary mb-0">Aucune donnée disponible.</p>';
    } else {
      const c2 = new window.ApexCharts(elChart2, {
        chart: { type: 'line', height: 300, toolbar: { show: false } },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { categories: controlesParMois.map((c) => c.label) },
        colors: ['#20c997'],
        series: [{ name: 'Fiches de contrôle', data: controlesParMois.map((c) => c.count) }],
      });
      c2.render();
      chartInstances.push(c2);
    }
  }

  // 3. Répartition des décisions
  const mapDec = {};
  decisionsScope.forEach((d) => {
    mapDec[d.type] = (mapDec[d.type] || 0) + 1;
  });
  const decisionsParType = Object.entries(mapDec).map(([type, count]) => ({
    label: DECISION_TYPES[type] || type,
    count,
  }));

  const elChart3 = container.querySelector('#chartDecisions');
  if (elChart3) {
    if (decisionsParType.length === 0) {
      elChart3.innerHTML = '<p class="text-secondary mb-0">Aucune décision enregistrée.</p>';
    } else {
      const c3 = new window.ApexCharts(elChart3, {
        chart: { type: 'donut', height: 300 },
        labels: decisionsParType.map((d) => d.label),
        colors: ['#0d6efd', '#ffc107', '#fd7e14', '#dc3545'],
        legend: { position: 'bottom' },
        series: decisionsParType.map((d) => d.count),
      });
      c3.render();
      chartInstances.push(c3);
    }
  }
}
