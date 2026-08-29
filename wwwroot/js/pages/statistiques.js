(function () {
  'use strict';
  if (!window.api) return;

  var charts = [];

  function destroyCharts() {
    charts.forEach(function (c) { try { c.destroy(); } catch (e) {} });
    charts = [];
  }

  function filters() {
    return {
      dateFrom: document.getElementById('filterDateFrom').value || '',
      dateTo: document.getElementById('filterDateTo').value || '',
      sousproved: document.getElementById('filterSousproved').value || '',
      regime: document.getElementById('filterRegime').value || ''
    };
  }

  async function refresh() {
    destroyCharts();
    var dto = await api.get('/Home/GetStatistiques', filters());
    var ecolesCount = dto.ecolesCount ?? dto.EcolesCount ?? 0;
    var fichesCount = dto.fichesCount ?? dto.FichesCount ?? 0;
    var taux = dto.tauxConformite ?? dto.TauxConformite ?? 0;
    var decisionsCount = dto.decisionsCount ?? dto.DecisionsCount ?? 0;
    document.getElementById('kpiEcoles').textContent = ecolesCount;
    document.getElementById('kpiFiches').textContent = fichesCount;
    document.getElementById('kpiConformite').textContent = taux + '%';
    document.getElementById('kpiDecisions').textContent = decisionsCount;

    var conformite = dto.conformite || dto.Conformite || [];
    var decParType = dto.decisionsParType || dto.DecisionsParType || [];
    var produitsDeclares = dto.produitsDeclares || dto.ProduitsDeclares || [];
    var evolution = dto.evolution || dto.Evolution || [];

    if (window.ApexCharts) {
      function labelsOf(arr) {
        var labels = (arr || []).map(function (x) { return x.label || x.Label; }).filter(Boolean);
        return labels.length ? labels : ['—'];
      }
      function valuesOf(arr) {
        var values = (arr || []).map(function (x) { return x.value ?? x.Value ?? 0; });
        return values.length ? values : [0];
      }
      charts.push(new ApexCharts(document.querySelector('#chartConformite'), {
        chart: { type: 'donut', height: 280 },
        labels: labelsOf(conformite),
        series: valuesOf(conformite),
        colors: ['#00A76F', '#FFAB00', '#FF5630', '#7A0916']
      }));
      charts.push(new ApexCharts(document.querySelector('#chartDecisions'), {
        chart: { type: 'bar', height: 280, toolbar: { show: false } },
        xaxis: { categories: labelsOf(decParType) },
        series: [{ name: 'Décisions', data: valuesOf(decParType) }],
        colors: ['#00B8D9']
      }));
      charts.push(new ApexCharts(document.querySelector('#chartProduits'), {
        chart: { type: 'bar', height: 280, toolbar: { show: false } },
        xaxis: { categories: labelsOf(produitsDeclares) },
        series: [{ name: 'Fiches', data: valuesOf(produitsDeclares) }],
        colors: ['#8E33FF']
      }));
      charts.push(new ApexCharts(document.querySelector('#chartEvolution'), {
        chart: { type: 'area', height: 300, toolbar: { show: false } },
        xaxis: { categories: labelsOf(evolution) },
        series: [{ name: 'Contrôles', data: valuesOf(evolution) }],
        colors: ['#00A76F']
      }));
      charts.forEach(function (c) { c.render(); });
    }

    window.__statsExport = {
      ecoles: ecolesCount,
      fiches: fichesCount,
      taux: taux,
      decisions: decisionsCount,
      decLabels: decParType.map(function (x) { return x.label || x.Label; }),
      decValues: decParType.map(function (x) { return x.value || x.Value; })
    };
  }

  ['filterDateFrom', 'filterDateTo', 'filterSousproved', 'filterRegime'].forEach(function (id) {
    document.getElementById(id)?.addEventListener('change', function () {
      refresh().catch(function (err) { api.showToast(err.message, 'danger'); });
    });
  });
  document.getElementById('resetFilters')?.addEventListener('click', function () {
    ['filterDateFrom', 'filterDateTo', 'filterSousproved', 'filterRegime'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
    refresh().catch(function (err) { api.showToast(err.message, 'danger'); });
  });
  document.getElementById('exportCsv')?.addEventListener('click', function () {
    var q = new URLSearchParams();
    var f = filters();
    Object.keys(f).forEach(function (k) { if (f[k]) q.set(k, f[k]); });
    window.location = '/Home/ExportStatistiquesCsv?' + q.toString();
  });
  document.getElementById('exportPdf')?.addEventListener('click', function () {
    var s = window.__statsExport || {};
    var html =
      '<h2>Statistiques Inspect-San</h2><ul>' +
      '<li>Écoles : ' + s.ecoles + '</li><li>Fiches : ' + s.fiches + '</li>' +
      '<li>Taux conformité : ' + s.taux + '%</li><li>Décisions : ' + s.decisions + '</li></ul>';
    if (window.openPrintPreview) window.openPrintPreview('Statistiques Inspect-San', html);
    else window.print();
  });

  refresh().catch(function (err) { api.showToast(err.message, 'danger'); });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      charts.forEach(function (c) {
        try { c.resize(); } catch (e) {}
      });
    }, 150);
  });
})();
