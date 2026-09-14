(function () {
  'use strict';
  if (!window.api) return;

  var lastDto = null;
  var page = document.getElementById('rapportPage');
  var canEquipeUi = page?.getAttribute('data-can-equipe') === '1';
  var canSecUi = page?.getAttribute('data-can-secretariat') === '1';
  var canCloturerUi = page?.getAttribute('data-can-cloturer') === '1';

  // Lit une propriété camelCase ou PascalCase.
  function pick(obj, camel, pascal) {
    return obj[camel] ?? obj[pascal];
  }

  // Code de sous-division sélectionné.
  function selectedCode() {
    return document.getElementById('filterSousproved')?.value || '';
  }

  // Formate une date ISO en français.
  function fmtDateIso(val) {
    if (!val) return '—';
    try {
      var d = new Date(val);
      if (isNaN(d.getTime())) return '—';
      return d.toLocaleDateString('fr-FR');
    } catch (e) {
      return '—';
    }
  }

  // Agrège les KPI à partir des sections.
  function aggregateKpi(sections) {
    var ecoles = new Set();
    var fiches = 0;
    var decisions = 0;
    var bon = 0;
    var total = 0;
    (sections || []).forEach(function (s) {
      fiches += pick(s, 'fichesCount', 'FichesCount') || 0;
      decisions += pick(s, 'decisionsCount', 'DecisionsCount') || 0;
      (pick(s, 'lignes', 'Lignes') || []).forEach(function (l) {
        ecoles.add(l.ecoleNom || l.EcoleNom);
      });
      (pick(s, 'conformite', 'Conformite') || []).forEach(function (c) {
        var label = c.label || c.Label || '';
        var value = c.value ?? c.Value ?? 0;
        total += value;
        if (label === 'Bon' || label === 'Moyen') bon += value;
      });
    });
    var taux = total === 0 ? 0 : Math.round((100 * bon) / total);
    return { ecoles: ecoles.size, fiches: fiches, decisions: decisions, taux: taux };
  }

  // Active ou désactive un bouton d’action.
  function setBtn(id, enabled) {
    var el = document.getElementById(id);
    if (el) el.disabled = !enabled;
  }

  // Met à jour boutons et statut du rapport.
  function updateActions(dto) {
    var hasSd = !!selectedCode();
    var hasLignes = (pick(dto, 'sections', 'Sections') || []).some(function (s) {
      return (pick(s, 'lignes', 'Lignes') || []).length > 0;
    });
    setBtn('btnPrintRapport', hasSd && hasLignes);
    setBtn(
      'btnDeposerEquipe',
      canEquipeUi && hasSd && !!pick(dto, 'canDeposerEquipe', 'CanDeposerEquipe')
    );
    setBtn(
      'btnDeposerSecretariat',
      canSecUi && hasSd && !!pick(dto, 'canDeposerSecretariat', 'CanDeposerSecretariat')
    );
    setBtn(
      'btnCloturerRapport',
      canCloturerUi && hasSd && !!pick(dto, 'canCloturer', 'CanCloturer')
    );

    var status = document.getElementById('rapportStatus');
    if (!status) return;
    if (!hasSd) {
      status.classList.add('d-none');
      return;
    }
    var eq = pick(dto, 'equipeDeposeCount', 'EquipeDeposeCount') || 0;
    var sec = pick(dto, 'secretariatDeposeCount', 'SecretariatDeposeCount') || 0;
    var clos = pick(dto, 'closCount', 'ClosCount') || 0;
    var total = pick(dto, 'missionsEligiblesCount', 'MissionsEligiblesCount') || 0;
    status.classList.remove('d-none');
    status.textContent =
      'Missions : ' +
      total +
      ' — Déposé secrétariat : ' +
      eq +
      '/' +
      total +
      ' — Transféré DP : ' +
      sec +
      '/' +
      total +
      ' — Clôturées : ' +
      clos +
      '/' +
      total;
  }

  // Rend le tableau HTML des lignes de fiche.
  function renderTable(lignes) {
    if (!lignes || !lignes.length) {
      return '<p class="text-secondary mb-0">Aucune fiche validée pour cette section.</p>';
    }
    var html =
      '<div class="table-responsive"><table class="table table-hover table-sm mb-0">' +
      '<thead class="table-light"><tr>' +
      '<th>N° ORDRE</th><th>DÉNOM.</th><th>FONCT. CONTR.</th><th>N° AGR.</th><th>NOM AGENT</th>' +
      '<th>ÉTAT BÂT.</th><th>NBRE BÂT.</th><th>TOIL. F.</th><th>TOIL. G.</th><th>NBRE ÉLÈVES</th>' +
      '<th>DÉS. PRODUIT</th><th>DÉS. OUTIL</th><th>ID DINACOPE</th><th>NOM CHEF ÉTAB.</th>' +
      '<th>REG GES</th><th>MONT. PERÇU</th><th>CIRCUIT</th>' +
      '</tr></thead><tbody>';
    lignes.forEach(function (l) {
      var flags = [];
      if (l.rapportEquipeDepose || l.RapportEquipeDepose) flags.push('Déposé');
      if (l.rapportSecretariatDepose || l.RapportSecretariatDepose) flags.push('Transféré DP');
      if (l.rapportClos || l.RapportClos) flags.push('Clos');
      html +=
        '<tr>' +
        '<td class="fw-semibold">' + (l.numOrdre || l.NumOrdre || '—') + '</td>' +
        '<td>' + (l.ecoleNom || l.EcoleNom || '—') + '</td>' +
        '<td>' + (l.fonctionControleur || l.FonctionControleur || '—') + '</td>' +
        '<td>' + (l.numAgrement || l.NumAgrement || '—') + '</td>' +
        '<td>' + (l.nomAgent || l.NomAgent || '—') + '</td>' +
        '<td>' + (l.etatBatiment || l.EtatBatiment || '—') + '</td>' +
        '<td>' + (l.nombreBatiments ?? l.NombreBatiments ?? '—') + '</td>' +
        '<td>' + (l.toilettesFilles ?? l.ToilettesFilles ?? '—') + '</td>' +
        '<td>' + (l.toilettesGarcons ?? l.ToilettesGarcons ?? '—') + '</td>' +
        '<td>' + (l.nombreEleves ?? l.NombreEleves ?? '—') + '</td>' +
        '<td>' + (l.designationProduit || l.DesignationProduit || '—') + '</td>' +
        '<td>' + (l.designationOutil || l.DesignationOutil || '—') + '</td>' +
        '<td>' + (l.idDinacope || l.IdDinacope || '—') + '</td>' +
        '<td>' + (l.chefNom || l.ChefNom || '—') + '</td>' +
        '<td>' + (l.regime || l.Regime || '—') + '</td>' +
        '<td>' + (l.montPer ?? l.MontPer ?? '—') + '</td>' +
        '<td class="small">' + (flags.length ? flags.join(' · ') : '—') + '</td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    return html;
  }

  // Affiche les sections et KPI du rapport.
  function renderSections(dto) {
    var container = document.getElementById('rapportSections');
    var emptyEl = document.getElementById('rapportEmpty');
    var kpiRow = document.getElementById('rapportGlobalKpi');
    if (!container) return;

    if (!selectedCode()) {
      container.innerHTML = '';
      emptyEl?.classList.remove('d-none');
      if (emptyEl) emptyEl.textContent = 'Sélectionnez une sous-division pour afficher les fiches validées.';
      kpiRow?.classList.add('d-none');
      updateActions(dto || {});
      return;
    }

    var sections = pick(dto, 'sections', 'Sections') || [];
    var hasData = sections.some(function (s) {
      return (pick(s, 'lignes', 'Lignes') || []).length > 0;
    });

    if (!hasData) {
      container.innerHTML = '';
      emptyEl?.classList.remove('d-none');
      if (emptyEl) emptyEl.textContent = 'Aucune fiche validée pour cette sous-division (dans votre périmètre).';
      kpiRow?.classList.add('d-none');
      updateActions(dto);
      return;
    }

    emptyEl?.classList.add('d-none');
    kpiRow?.classList.remove('d-none');

    var kpi = aggregateKpi(sections);
    document.getElementById('kpiEcoles').textContent = kpi.ecoles;
    document.getElementById('kpiFiches').textContent = kpi.fiches;
    document.getElementById('kpiConformite').textContent = kpi.taux + '%';
    document.getElementById('kpiDecisions').textContent = kpi.decisions;

    var html = '';
    sections.forEach(function (s) {
      var sd = pick(s, 'sousDivisionLabel', 'SousDivisionLabel') || '—';
      var code = pick(s, 'sousDivisionCode', 'SousDivisionCode') || '—';
      var lignes = pick(s, 'lignes', 'Lignes') || [];
      var totale = pick(s, 'totaleSousDivision', 'TotaleSousDivision') || lignes.length;

      html +=
        '<div class="card card-lg mb-4">' +
        '<div class="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">' +
        '<span class="fw-semibold">CODE : ' + code + ' — ' + sd + '</span>' +
        '<span class="badge bg-primary-subtle text-primary">' + totale + ' fiche(s)</span>' +
        '</div>' +
        '<div class="card-body">' +
        renderTable(lignes) +
        '<div class="mt-3 small text-uppercase">' +
        '<div><strong>TOTALE PAR SOUS DIVISION :</strong> ' + totale + '</div>' +
        '</div>' +
        '</div></div>';
    });
    var totalGen = pick(dto, 'totalGenerale', 'TotalGenerale') || 0;
    html +=
      '<p class="text-uppercase mb-0 fw-semibold">TOTAL GÉNÉRALE : ' + totalGen + '</p>';
    container.innerHTML = html;
    updateActions(dto);
  }

  // Recharge les données du rapport.
  async function refresh() {
    var code = selectedCode();
    if (!code) {
      lastDto = {};
      renderSections(lastDto);
      return;
    }
    lastDto = await api.get('/Home/GetRapportInspection', { sousproved: code });
    renderSections(lastDto);
  }

  // Exécute une action POST avec confirmation.
  async function postAction(url, confirmMsg, skipConfirm) {
    var code = selectedCode();
    if (!code) {
      api.showToast('Choisissez une sous-division.', 'warning');
      return;
    }
    if (!skipConfirm && !(await api.confirm(confirmMsg))) return;
    var result = await api.post(url, { sousDivisionCode: code });
    api.bindAjaxResult(result, function () {
      refresh().catch(function (err) {
        api.showToast(err.message, 'danger');
      });
    });
  }

  document.getElementById('filterSousproved')?.addEventListener('change', function () {
    refresh().catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  document.getElementById('btnDeposerEquipe')?.addEventListener('click', function () {
    postAction(
      '/Home/DeposerRapportEquipeJson',
      'Déposer ce rapport au secrétariat pour cette sous-division ?'
    ).catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  document.getElementById('btnDeposerSecretariat')?.addEventListener('click', function () {
    postAction(
      '/Home/DeposerRapportSecretariatJson',
      'Transférer ce rapport au Directeur Provincial ?'
    ).catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  document.getElementById('btnCloturerRapport')?.addEventListener('click', function () {
    postAction('/Home/CloturerRapportJson', 'Clôturer définitivement le rapport de cette sous-division ?').catch(
      function (err) {
        api.showToast(err.message, 'danger');
      }
    );
  });

  document.getElementById('btnPrintRapport')?.addEventListener('click', function () {
    if (!lastDto) {
      api.showToast('Chargement en cours…', 'info');
      return;
    }
    var sections = pick(lastDto, 'sections', 'Sections') || [];
    if (!sections.some(function (s) {
      return (pick(s, 'lignes', 'Lignes') || []).length;
    })) {
      api.showToast('Aucune donnée à imprimer.', 'warning');
      return;
    }
    var html = window.buildRapportInspectionPrintHtml
      ? window.buildRapportInspectionPrintHtml(lastDto)
      : null;
    if (window.openPrintPreview) {
      window.openPrintPreview("Rapport d'inspection formel (2 exemplaires)", html);
    } else {
      window.print();
    }

    // Après impression : proposer le dépôt au secrétariat si le chef d'équipe peut le faire.
    var canDepositNow = canEquipeUi && !!pick(lastDto, 'canDeposerEquipe', 'CanDeposerEquipe');
    if (!canDepositNow) return;
    api
      .confirm(
        'Impression lancée. Déposer maintenant ce rapport au secrétariat dans le système ?'
      )
      .then(function (ok) {
        if (!ok) return;
        return postAction('/Home/DeposerRapportEquipeJson', '', true);
      })
      .catch(function (err) {
        api.showToast(err.message, 'danger');
      });
  });

  refresh().catch(function (err) {
    api.showToast(err.message, 'danger');
  });
})();
