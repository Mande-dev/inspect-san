(function () {
  'use strict';
  if (!window.api || !window.ApexCharts) return;

  var charts = [];
  var COLORS = ['#0f766e', '#1d4ed8', '#b45309', '#be123c', '#6d28d9', '#0369a1'];

  function destroy() {
    charts.forEach(function (c) {
      try {
        c.destroy();
      } catch (e) {}
    });
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
    var pad = function (n) {
      return n < 10 ? '0' + n : '' + n;
    };
    return (
      pad(d.getDate()) +
      '/' +
      pad(d.getMonth() + 1) +
      '/' +
      d.getFullYear() +
      ' ' +
      pad(d.getHours()) +
      ':' +
      pad(d.getMinutes())
    );
  }

  function pointsOf(arr) {
    return (arr || [])
      .map(function (x) {
        return {
          label: String(x.label || x.Label || '—').trim() || '—',
          value: Number(x.value ?? x.Value ?? 0) || 0
        };
      })
      .filter(function (x) {
        return x.label !== '—';
      });
  }

  /** Libellés courts pour lire facilement le graphique. */
  function shortLabel(label) {
    var s = String(label || '');
    var map = {
      "Suspension Temporaire du chef d'établissement": 'Suspension chef',
      'Fermeture temporaire de l\'Établissement': 'Fermeture temp.',
      Réhabilitation: 'Réhabilitation'
    };
    if (map[s]) return map[s];
    return s.length > 22 ? s.slice(0, 20) + '…' : s;
  }

  function emptyHtml(msg) {
    return (
      '<div class="d-flex align-items-center justify-content-center text-secondary h-100" style="min-height:220px;">' +
      '<p class="mb-0 text-center px-3">' +
      api.esc(msg) +
      '</p></div>'
    );
  }

  function baseChart() {
    return {
      chart: {
        fontFamily: 'inherit',
        toolbar: { show: false },
        animations: { enabled: false }
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '12px', fontWeight: 700, colors: ['#0f172a'] },
        background: { enabled: false }
      },
      grid: {
        borderColor: '#e2e8f0',
        strokeDashArray: 3,
        padding: { left: 8, right: 12 }
      },
      tooltip: {
        theme: 'light',
        y: {
          formatter: function (v) {
            return v + '';
          }
        }
      },
      legend: { show: false }
    };
  }

  /** Barres horizontales : idéal pour comparer des catégories. */
  function renderHBar(el, points, color) {
    if (!el) return;
    if (!points.length) {
      el.innerHTML = emptyHtml('Aucune donnée pour le moment.');
      return;
    }
    var opts = Object.assign(baseChart(), {
      chart: Object.assign(baseChart().chart, {
        type: 'bar',
        height: Math.max(240, 48 + points.length * 42)
      }),
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: '58%',
          dataLabels: { position: 'top' }
        }
      },
      colors: [color || COLORS[0]],
      series: [{ name: 'Nombre', data: points.map(function (p) { return p.value; }) }],
      xaxis: {
        categories: points.map(function (p) { return shortLabel(p.label); }),
        labels: { style: { fontSize: '12px', colors: '#475569' } },
        title: { text: 'Nombre', style: { fontSize: '11px', color: '#64748b' } }
      },
      yaxis: {
        labels: { style: { fontSize: '12px', colors: '#334155', fontWeight: 600 }, maxWidth: 140 }
      },
      dataLabels: {
        enabled: true,
        formatter: function (v) {
          return v;
        },
        offsetX: 6,
        style: { fontSize: '13px', fontWeight: 700, colors: ['#0f172a'] }
      }
    });
    var chart = new ApexCharts(el, opts);
    charts.push(chart);
    chart.render();
  }

  /** Colonnes verticales : idéal pour une évolution mois par mois. */
  function renderColumns(el, points, color) {
    if (!el) return;
    if (!points.length) {
      el.innerHTML = emptyHtml('Aucune donnée pour le moment.');
      return;
    }
    var opts = Object.assign(baseChart(), {
      chart: Object.assign(baseChart().chart, { type: 'bar', height: 280 }),
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '48%',
          borderRadius: 4,
          dataLabels: { position: 'top' }
        }
      },
      colors: [color || COLORS[1]],
      series: [{ name: 'Contrôles', data: points.map(function (p) { return p.value; }) }],
      xaxis: {
        categories: points.map(function (p) { return p.label; }),
        labels: { style: { fontSize: '12px', colors: '#475569' } }
      },
      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          style: { fontSize: '12px', colors: '#64748b' },
          formatter: function (v) {
            return Math.round(v);
          }
        },
        title: { text: 'Nombre', style: { fontSize: '11px', color: '#64748b' } }
      },
      dataLabels: {
        enabled: true,
        offsetY: -16,
        style: { fontSize: '12px', fontWeight: 700, colors: ['#0f172a'] },
        formatter: function (v) {
          return v;
        }
      }
    });
    var chart = new ApexCharts(el, opts);
    charts.push(chart);
    chart.render();
  }

  async function load() {
    var dto = await api.get('/Home/GetDashboardData');
    setText('#kpiEcolesCount', dto.ecolesCount ?? dto.EcolesCount ?? 0);
    setText('#kpiMissions', dto.missionsEnCours ?? dto.MissionsEnCours ?? 0);
    setText('#kpiFiches', dto.fichesEnAttente ?? dto.FichesEnAttente ?? 0);
    setText('#kpiDecisions', dto.decisionsEnAttente ?? dto.DecisionsEnAttente ?? 0);
    var tip = dto.roleTip || dto.RoleTip || '';
    var tipEl = document.getElementById('dashboardRoleTip');
    if (tipEl) tipEl.textContent = tip;

    var byRegime = pointsOf(dto.ecolesByRegime || dto.EcolesByRegime);
    var controles = pointsOf(dto.controlesParMois || dto.ControlesParMois);
    var decisions = pointsOf(dto.decisionsByType || dto.DecisionsByType);
    var journal = dto.recentJournal || dto.RecentJournal || [];

    destroy();
    renderHBar(document.querySelector('#chartRegime'), byRegime, COLORS[0]);
    renderColumns(document.querySelector('#chartControles'), controles, COLORS[1]);
    renderHBar(document.querySelector('#chartDecisions'), decisions, COLORS[3]);

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

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      charts.forEach(function (c) {
        try {
          c.resize();
        } catch (e) {
          /* ignore */
        }
      });
    }, 150);
  });

  load().catch(function (err) {
    api.showToast(err.message || 'Erreur dashboard', 'danger');
  });
})();
