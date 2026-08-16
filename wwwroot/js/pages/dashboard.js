(function () {
  'use strict';
  if (!window.api || !window.ApexCharts) return;

  var charts = [];

  function destroy() {
    charts.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    charts = [];
  }

  function setText(sel, v) {
    var el = document.querySelector(sel);
    if (el) el.textContent = v;
  }

  function fmt(dt) {
    if (!dt) return '';
    var d = new Date(dt);
    if (isNaN(d.getTime())) return String(dt);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function labelsOf(arr) {
    var labels = (arr || []).map(function (x) { return x.label || x.Label; }).filter(Boolean);
    return labels.length ? labels : ['—'];
  }

  function valuesOf(arr) {
    var values = (arr || []).map(function (x) { return x.value ?? x.Value ?? 0; });
    return values.length ? values : [0];
  }

  async function load() {
    var dto = await api.get('/Home/GetDashboardData');
    setText('#kpiEcolesCount', dto.ecolesCount ?? dto.EcolesCount ?? 0);
    setText('#kpiMissions', dto.missionsEnCours ?? dto.MissionsEnCours ?? 0);
    setText('#kpiFiches', dto.fichesEnAttente ?? dto.FichesEnAttente ?? 0);
    setText('#kpiRapports', dto.rapportsDeposes ?? dto.RapportsDeposes ?? 0);
    setText('#kpiDecisions', dto.decisionsEnAttente ?? dto.DecisionsEnAttente ?? 0);
    var tip = dto.roleTip || dto.RoleTip || '';
    var tipEl = document.getElementById('dashboardRoleTip');
    if (tipEl) tipEl.textContent = tip;

    var byRegime = dto.ecolesByRegime || dto.EcolesByRegime || [];
    var controles = dto.controlesParMois || dto.ControlesParMois || [];
    var decisions = dto.decisionsByType || dto.DecisionsByType || [];
    var journal = dto.recentJournal || dto.RecentJournal || [];

    destroy();
    charts.push(new ApexCharts(document.querySelector('#chartRegime'), {
      chart: { type: 'donut', height: 260 },
      labels: labelsOf(byRegime),
      series: valuesOf(byRegime),
      colors: ['#00A76F', '#00B8D9', '#FFAB00', '#8E33FF']
    }));
    charts.push(new ApexCharts(document.querySelector('#chartControles'), {
      chart: { type: 'area', height: 260, toolbar: { show: false } },
      xaxis: { categories: labelsOf(controles) },
      series: [{ name: 'Contrôles', data: valuesOf(controles) }],
      colors: ['#00B8D9']
    }));
    charts.push(new ApexCharts(document.querySelector('#chartDecisions'), {
      chart: { type: 'bar', height: 260, toolbar: { show: false } },
      xaxis: { categories: labelsOf(decisions) },
      series: [{ name: 'Décisions', data: valuesOf(decisions) }],
      colors: ['#FF5630']
    }));
    charts.forEach(function (c) { c.render(); });

    var tbody = document.getElementById('dashboardJournalTbody');
    var table = tbody && tbody.closest('table');
    if (tbody) {
      tbody.innerHTML = journal
        .map(function (j) {
          return (
            '<tr><td class="small">' +
            api.esc(fmt(j.createdAt || j.CreatedAt)) +
            '</td><td>' +
            api.esc(j.module || j.Module || '') +
            '</td><td>' +
            api.esc(j.action || j.Action || '') +
            '</td><td class="small text-secondary">' +
            api.esc(j.detail || j.Detail || '') +
            '</td></tr>'
          );
        })
        .join('');
      api.refreshPagination(table);
    }
  }

  load().catch(function (err) {
    api.showToast(err.message || 'Erreur dashboard', 'danger');
  });
})();
