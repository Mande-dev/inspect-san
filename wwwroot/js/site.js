$(function () {
  // Sidebar collapse
  $('#sidebarToggleBtn').on('click', function (e) {
    e.preventDefault();
    var html = document.documentElement;
    if (html.classList.contains('collapsed')) {
      html.classList.remove('collapsed');
      html.classList.add('expanded');
      localStorage.setItem('sidebarExpanded', 'true');
    } else {
      html.classList.add('collapsed');
      html.classList.remove('expanded');
      localStorage.setItem('sidebarExpanded', 'false');
    }
  });

  // Toast auto-hide
  var toastEl = document.getElementById('appToast');
  if (toastEl && window.bootstrap) {
    setTimeout(function () {
      var t = bootstrap.Toast.getOrCreateInstance(toastEl);
      t.hide();
    }, 3500);
  }

  // Theme switcher
  $('[data-bs-theme-value]').on('click', function () {
    var v = $(this).attr('data-bs-theme-value');
    if (typeof window.setTheme === 'function') {
      window.setTheme(v);
    } else {
      document.documentElement.setAttribute(
        'data-bs-theme',
        v === 'auto'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : v
      );
      localStorage.setItem('theme', v);
    }
  });

  // Mode détail / édition des modales métier (titre Voir, Détail, lecture seule…)
  function applyIspModalMode(modal) {
    if (!modal || !modal.classList) return;
    modal.classList.add('isp-modal');
    var titleEl = modal.querySelector('.modal-title');
    var title = (titleEl && titleEl.textContent) || '';
    var isDetail = /voir|détail|detail|lecture seule|consultation|consulter/i.test(title);
    modal.classList.toggle('isp-modal--detail', isDetail);
    modal.classList.toggle('isp-modal--form', !isDetail);
  }

  document.addEventListener('show.bs.modal', function (e) {
    var modal = e.target;
    if (!modal || !modal.classList || !modal.classList.contains('modal')) return;
    applyIspModalMode(modal);
    setTimeout(function () { applyIspModalMode(modal); }, 0);
    var titleEl = modal.querySelector('.modal-title');
    if (titleEl && !titleEl._ispModeObserved) {
      titleEl._ispModeObserved = true;
      var obs = new MutationObserver(function () { applyIspModalMode(modal); });
      obs.observe(titleEl, { childList: true, characterData: true, subtree: true });
    }
  });

});

/**
 * Pagination client pour tableaux HTML.
 * Tailles : 5 / 15 / 25 / 50. Respecte data-filtered-out="1" pour les filtres JS.
 */
window.initTablePagination = function (table, options) {
  options = options || {};
  if (!table || table.dataset.paginated === '1') return null;
  var tbody = table.tBodies && table.tBodies[0];
  if (!tbody) return null;

  table.dataset.paginated = '1';
  var pageSizes = options.pageSizes || [5, 15, 25, 50];
  var storageKey = 'isp-page-size:' + (table.id || table.className) + ':' + location.pathname;
  var saved = parseInt(localStorage.getItem(storageKey) || '', 10);
  var pageSize = pageSizes.indexOf(saved) >= 0 ? saved : options.pageSize || 15;
  var page = 1;
  var colCount = (table.tHead && table.tHead.rows[0] && table.tHead.rows[0].cells.length) || 1;

  var bar = document.createElement('div');
  bar.className =
    'table-pagination-bar d-flex flex-wrap justify-content-between align-items-center gap-3 px-3 py-3 border-top bg-body-tertiary';
  bar.innerHTML =
    '<div class="d-flex align-items-center gap-2">' +
    '<label class="small text-secondary mb-0 text-nowrap">Lignes par page</label>' +
    '<select class="form-select form-select-sm" style="width:auto" data-page-size>' +
    pageSizes
      .map(function (n) {
        return '<option value="' + n + '"' + (n === pageSize ? ' selected' : '') + '>' + n + '</option>';
      })
      .join('') +
    '</select>' +
    '<span class="small text-secondary" data-page-info></span>' +
    '</div>' +
    '<nav aria-label="Pagination">' +
    '<ul class="pagination pagination-sm mb-0">' +
    '<li class="page-item"><button type="button" class="page-link" data-page-action="first" title="Première">«</button></li>' +
    '<li class="page-item"><button type="button" class="page-link" data-page-action="prev" title="Précédente">‹</button></li>' +
    '<li class="page-item disabled"><span class="page-link" data-page-current>1</span></li>' +
    '<li class="page-item"><button type="button" class="page-link" data-page-action="next" title="Suivante">›</button></li>' +
    '<li class="page-item"><button type="button" class="page-link" data-page-action="last" title="Dernière">»</button></li>' +
    '</ul></nav>';

  var host = table.closest('.table-responsive') || table.parentNode;
  if (host && host.parentNode) {
    if (host.classList && host.classList.contains('table-responsive')) {
      host.parentNode.insertBefore(bar, host.nextSibling);
    } else {
      host.insertBefore(bar, table.nextSibling);
    }
  } else {
    table.insertAdjacentElement('afterend', bar);
  }

  function dataRows() {
    return Array.prototype.slice.call(tbody.querySelectorAll('tr')).filter(function (tr) {
      return !tr.classList.contains('js-pagination-empty');
    });
  }

  function candidateRows() {
    return dataRows().filter(function (tr) {
      return tr.getAttribute('data-filtered-out') !== '1';
    });
  }

  function ensureEmptyRow(show) {
    var empty = tbody.querySelector('tr.js-pagination-empty');
    if (show) {
      if (!empty) {
        empty = document.createElement('tr');
        empty.className = 'js-pagination-empty';
        empty.innerHTML =
          '<td colspan="' +
          colCount +
          '" class="text-center text-secondary py-4">Aucun enregistrement à afficher.</td>';
        tbody.appendChild(empty);
      }
      empty.style.display = '';
    } else if (empty) {
      empty.style.display = 'none';
    }
  }

  function render() {
    var rows = candidateRows();
    var total = rows.length;
    var totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
    if (page > totalPages) page = totalPages;
    if (page < 1) page = 1;

    dataRows().forEach(function (tr) {
      tr.style.display = 'none';
    });

    if (total === 0) {
      ensureEmptyRow(true);
    } else {
      ensureEmptyRow(false);
      var start = (page - 1) * pageSize;
      rows.slice(start, start + pageSize).forEach(function (tr) {
        tr.style.display = '';
      });
    }

    var from = total === 0 ? 0 : (page - 1) * pageSize + 1;
    var to = Math.min(page * pageSize, total);
    bar.querySelector('[data-page-info]').textContent =
      total === 0 ? '0 résultat' : from + '–' + to + ' sur ' + total;
    bar.querySelector('[data-page-current]').textContent = page + ' / ' + totalPages;

    var disablePrev = page <= 1;
    var disableNext = page >= totalPages;
    bar.querySelectorAll('[data-page-action]').forEach(function (btn) {
      var action = btn.getAttribute('data-page-action');
      var li = btn.closest('.page-item');
      var off =
        ((action === 'first' || action === 'prev') && disablePrev) ||
        ((action === 'last' || action === 'next') && disableNext);
      if (li) li.classList.toggle('disabled', off);
      btn.disabled = off;
    });
  }

  bar.querySelector('[data-page-size]').addEventListener('change', function (e) {
    pageSize = parseInt(e.target.value, 10) || 15;
    localStorage.setItem(storageKey, String(pageSize));
    page = 1;
    render();
  });

  bar.querySelectorAll('[data-page-action]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var action = btn.getAttribute('data-page-action');
      var totalPages = Math.max(1, Math.ceil(candidateRows().length / pageSize) || 1);
      if (action === 'first') page = 1;
      if (action === 'prev') page = Math.max(1, page - 1);
      if (action === 'next') page = Math.min(totalPages, page + 1);
      if (action === 'last') page = totalPages;
      render();
    });
  });

  var api = {
    refresh: function (resetPage) {
      if (resetPage) page = 1;
      render();
    },
    setPage: function (p) {
      page = p;
      render();
    },
  };
  table._ispPagination = api;
  render();
  return api;
};

$(function () {
  document.querySelectorAll('table.js-paginated-table').forEach(function (table) {
    window.initTablePagination(table);
  });
});

/** Aperçu / impression — studio professionnel MINEDU. */
window.openPrintPreview = function (title, htmlBody) {
  var w = window.open('', '_blank');
  if (!w) {
    window.print();
    return;
  }
  var isOfficial = htmlBody && String(htmlBody).indexOf('isp-print-doc') !== -1;
  var body =
    htmlBody ||
    (document.getElementById('pageContainer')
      ? document.getElementById('pageContainer').innerHTML
      : document.body.innerHTML);
  var cssHref = '/css/print-official.css?v=' + Date.now();
  // Titre vide pour les docs officiels : évite « date + Fiche FC/… » dans l’en-tête navigateur
  var docTitle = isOfficial ? '\u00A0' : title || 'Inspect-San';
  var label = (title || 'Document officiel').toString();
  var toolbar = isOfficial
    ? '<header class="isp-preview-toolbar no-print">' +
      '<div class="isp-preview-toolbar-brand">' +
      '<img class="isp-preview-toolbar-mark" src="/assets/images/brand/logo/logo-minedu.png" alt="" />' +
      '<div class="isp-preview-toolbar-text">' +
      '<p class="isp-preview-toolbar-kicker">Inspect-San · Aperçu d’impression</p>' +
      '<p class="isp-preview-toolbar-title">' +
      esc(label) +
      '</p>' +
      '</div></div>' +
      '<div class="isp-preview-toolbar-actions">' +
      '<button type="button" class="isp-preview-btn isp-preview-btn-primary" onclick="window.print()">Imprimer / PDF</button>' +
      '<button type="button" class="isp-preview-btn isp-preview-btn-ghost" onclick="window.close()">Fermer</button>' +
      '</div>' +
      '<p class="isp-preview-hint">Pour un PDF propre : décochez « En-têtes et pieds de page » dans la boîte d’impression du navigateur.</p>' +
      '</header>' +
      '<main class="isp-preview-stage"><div class="isp-preview-sheet">' +
      body +
      '</div></main>'
    : '<div class="no-print"><button type="button" onclick="window.print()">Imprimer / PDF</button></div>' +
      '<h1>' +
      esc(title || 'Inspect-San') +
      '</h1>' +
      body;

  w.document.write(
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' +
      esc(docTitle) +
      '</title><link rel="stylesheet" href="' +
      cssHref +
      '"></head><body class="' +
      (isOfficial ? 'isp-preview-screen' : '') +
      '">' +
      toolbar +
      '</body></html>'
  );
  w.document.close();
  try {
    if (isOfficial) w.document.title = '';
  } catch (e) {}
};

/** Export texte / CSV (équivalent downloadText Vite). */
window.downloadText = function (filename, content, mime) {
  var blob = new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || 'export.txt';
  a.click();
  URL.revokeObjectURL(a.href);
};

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtDate(v) {
  if (!v) return '—';
  try {
    var d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString('fr-FR');
  } catch (e) {
    return String(v);
  }
}

function fmtDateTime(v) {
  if (!v) return '—';
  try {
    var d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleString('fr-FR');
  } catch (e) {
    return String(v);
  }
}

function fmtDateLong(v) {
  var d = v ? new Date(v) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function yearOf(v) {
  var d = v ? new Date(v) : new Date();
  if (isNaN(d.getTime())) d = new Date();
  return d.getFullYear();
}

function buildOfficialRef(numero, dateVal) {
  var raw = String(numero == null ? '' : numero).trim() || '000';
  raw = raw.replace(/^N[°ºo]\s*/i, '');
  return 'N° ' + raw + '/MINEDU-NC/PE-KMA/' + yearOf(dateVal);
}

function ecoleAdresse(ecole) {
  if (!ecole) return '—';
  var a = ecole.Adresse || ecole.adresse || {};
  var parts = [
    (a.Avenue || a.avenue || ecole.avenue || '').toString().trim(),
    (a.Numero || a.numero || ecole.numero || '').toString().trim()
      ? 'n°' + (a.Numero || a.numero || ecole.numero)
      : '',
    (a.Quartier || a.quartier || ecole.quartier || '').toString().trim(),
    (a.Commune || a.commune || ecole.commune || '').toString().trim()
  ].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
}

function ecoleNom(ecole) {
  return (ecole && (ecole.Denomination || ecole.denomination)) || '—';
}

/**
 * Gabarit commun — style build.js (navy/or).
 * opts: { title, subtitle, ref, date, objet, destinataire, bodyHtml, docId }
 */
window.buildOfficialPrintShell = function (opts) {
  opts = opts || {};
  var dest = (opts.destinataire || '').toString().trim();
  var objet = (opts.objet || '').toString().trim();
  var metaRows = [];
  if (objet) metaRows.push(['Objet', objet]);
  if (dest) metaRows.push(["À l'attention de", dest]);

  return (
    '<article class="isp-print-doc">' +
    '<header class="isp-print-header">' +
    '<img class="isp-print-logo" src="/assets/images/brand/logo/logo-minedu.png" alt="Logo Ministère de l\'Éducation nationale" />' +
    '<p class="isp-print-state">République Démocratique du Congo</p>' +
    '<p class="isp-print-ministry">Ministère de l\'Éducation Nationale et Nouvelle Citoyenneté</p>' +
    '<p class="isp-print-province">Province Éducationnelle — Kinshasa Mont-Amba</p>' +
    '<hr class="isp-print-rule-navy" />' +
    '</header>' +
    '<div class="isp-print-meta">' +
    '<span><span class="isp-print-meta-ref-label">Réf. : </span>' +
    esc(opts.ref || '—') +
    '</span>' +
    '<span class="isp-print-meta-date">Kinshasa, le ' +
    esc(opts.date || fmtDateLong()) +
    '</span>' +
    '</div>' +
    '<div class="isp-print-banner"><p class="isp-print-banner-title">' +
    esc(opts.title || '') +
    '</p></div>' +
    (opts.subtitle
      ? '<p class="isp-print-subtitle">' + esc(opts.subtitle) + '</p>'
      : '') +
    (metaRows.length ? printKvTable(metaRows) : '') +
    '<div class="isp-print-body">' +
    (opts.bodyHtml || '') +
    '</div>' +
    '<footer class="isp-print-footer">' +
    'MINEDU-NC &nbsp;•&nbsp; Province Éducationnelle Kinshasa Mont-Amba' +
    (opts.docId ? ' &nbsp;•&nbsp; Réf. ' + esc(opts.docId) : '') +
    '</footer>' +
    '</article>'
  );
};

function printSectionTitle(num, text) {
  return (
    '<h2 class="isp-print-section"><span class="isp-print-section-num">' +
    esc(num) +
    '</span>' +
    esc(text) +
    '</h2>'
  );
}

/** rows: [label, value, opts?] — opts: { bold, colorClass: 'ok'|'warn', empty } */
function printKvTable(rows) {
  var html = '<table class="isp-print-table"><tbody>';
  (rows || []).forEach(function (r) {
    var label = r[0];
    var value = r[1];
    var opts = r[2] || {};
    var raw = opts.raw === true;
    var text = value == null || String(value).trim() === '' ? '—' : String(value);
    var isEmpty = text === '—';
    var cls = [];
    if (isEmpty) cls.push('is-empty');
    if (opts.colorClass === 'ok') cls.push('is-ok');
    if (opts.colorClass === 'warn') cls.push('is-warn');
    html +=
      '<tr><th>' +
      esc(label) +
      '</th><td class="' +
      cls.join(' ') +
      '">' +
      (raw ? value : esc(text)) +
      '</td></tr>';
  });
  html += '</tbody></table>';
  return html;
}

function printObsBox(observation, recommandation) {
  return (
    '<div class="isp-print-box isp-print-box-obs">' +
    '<p><span class="isp-print-box-label">Observation : </span>' +
    esc(observation || '—') +
    '</p>' +
    '<p><span class="isp-print-box-label">Recommandation préliminaire : </span>' +
    esc(recommandation || '—') +
    '</p>' +
    '</div>'
  );
}

function printValidBox(mention, dateTxt, signQualite, signNom) {
  return (
    '<div class="isp-print-box isp-print-box-valid">' +
    '<p><span class="isp-print-box-label">Mention : </span><em>' +
    esc(mention || '—') +
    '</em></p>' +
    '<p>' +
    esc(dateTxt || '') +
    '</p>' +
    '<p class="isp-print-box-sign">' +
    esc(signQualite || '') +
    '</p>' +
    (signNom ? '<p class="isp-print-box-sign-nom">' + esc(signNom) + '</p>' : '') +
    '</div>'
  );
}

function highlightStatut(statut) {
  var s = (statut || '').toString().toLowerCase();
  if (s === 'validee' || s === 'validée' || s === 'signe' || s === 'signé' || s === 'traite' || s === 'traité')
    return { colorClass: 'ok' };
  if (s === 'en_attente_validation' || s === 'brouillon' || s === 'depose' || s === 'déposé')
    return { colorClass: 'warn' };
  return {};
}

function highlightEtat(etat) {
  var e = (etat || '').toString().toLowerCase();
  if (!e || e === '—') return {};
  if (e.indexOf('partiellement') !== -1 || e.indexOf('hors service') !== -1 || e.indexOf('absentes') !== -1)
    return { colorClass: 'warn' };
  if (e === 'bon' || e === 'satisfaisant' || e.indexOf('fonctionnelles') !== -1)
    return { colorClass: 'ok' };
  return {};
}

function displayStatut(statut) {
  var map = {
    brouillon: 'Brouillon',
    en_attente_validation: 'En attente de validation',
    validee: 'Validée',
    en_attente_signature: 'En attente de signature',
    signe: 'Signé',
    en_cours: 'En cours',
    cloture: 'Clôturé',
    depose: 'Déposé',
    accuse: 'Accusé',
    transmis: 'Transmis',
    traite: 'Traité'
  };
  var s = (statut || '').toString();
  return map[s] || s || '—';
}

/** HTML métier — Ordre de mission */
window.buildOrdrePrintHtml = function (o, ecole, controleursNoms, signataireNom) {
  var numero = o.Numero || o.numero || '';
  var dateDoc = o.DateEmission || o.dateEmission || o.SigneLe || o.signeLe || null;
  var objetMetier =
    o.Objet ||
    o.objet ||
    'Contrôle sanitaire scolaire — mission d\'inspection de l\'établissement';
  var statutAff = displayStatut(o.Statut || o.statut);
  var body =
    printSectionTitle('1.', 'Désignation de la mission') +
    printKvTable([
      ['École', ecoleNom(ecole)],
      ['Adresse', ecoleAdresse(ecole)],
      ['Équipe / contrôleur(s)', controleursNoms || ''],
      ['Date d\'émission', fmtDate(o.DateEmission || o.dateEmission)],
      [
        'Période de validité',
        'Du ' +
          fmtDate(o.DebutValidite || o.debutValidite) +
          ' au ' +
          fmtDate(o.FinValidite || o.finValidite)
      ],
      ['Objet de la mission', objetMetier],
      ['Statut', statutAff, highlightStatut(o.Statut || o.statut)]
    ]) +
    printSectionTitle('2.', 'Signature') +
    printValidBox(
      (o.SigneLe || o.signeLe) ? 'Ordre signé' : 'En attente de signature',
      (o.SigneLe || o.signeLe) ? 'Signé le ' + fmtDateTime(o.SigneLe || o.signeLe) : '',
      'LE DIRECTEUR PROVINCIAL',
      signataireNom || ''
    );

  return window.buildOfficialPrintShell({
    title: 'ORDRE DE MISSION',
    subtitle: 'Mission de contrôle sanitaire',
    ref: buildOfficialRef(numero, dateDoc),
    date: fmtDateLong(dateDoc),
    objet: objetMetier + (ecoleNom(ecole) !== '—' ? ' — ' + ecoleNom(ecole) : ''),
    destinataire: 'L\'équipe de contrôle désignée et le chef d\'établissement concerné',
    bodyHtml: body,
    docId: numero
  });
};

/** HTML métier — Fiche de contrôle */
window.buildFichePrintHtml = function (f, ecole, chef, ordre) {
  var sb = f.SectionBatiments || f.sectionBatiments || {};
  var si = f.SectionImpact7 || f.sectionImpact7 || {};
  // Compat DTO plat (espace chef)
  if (!f.SectionBatiments && !f.sectionBatiments && (f.NombreBatiments != null || f.nombreBatiments != null || f.EtatGeneral || f.etatGeneral)) {
    sb = {
      NombreBatiments: f.NombreBatiments ?? f.nombreBatiments,
      EtatGeneral: f.EtatGeneral || f.etatGeneral,
      NombreEleves: f.NombreEleves ?? f.nombreEleves,
      ToilettesFilles: f.ToilettesFilles || f.toilettesFilles,
      ToilettesGarcons: f.ToilettesGarcons || f.toilettesGarcons
    };
  }
  if (!f.SectionImpact7 && !f.sectionImpact7 && (f.MontantPercu || f.montantPercu || f.Quantite || f.quantite || f.ProduitsNettoyage || f.produitsNettoyage)) {
    si = {
      MontantPercu: f.MontantPercu || f.montantPercu,
      Quantite: f.Quantite || f.quantite,
      ProduitsNettoyage: f.ProduitsNettoyage || f.produitsNettoyage
    };
  }
  if ((!ordre || !(ordre.Numero || ordre.numero)) && (f.OrdreMissionNumero || f.ordreMissionNumero)) {
    ordre = { Numero: f.OrdreMissionNumero || f.ordreMissionNumero };
  }
  var numero = f.Numero || f.numero || '';
  var dateDoc = f.ValideeLe || f.valideeLe || f.UpdatedAt || f.updatedAt || f.CreatedAt || f.createdAt;
  var chefNom = (chef && (chef.NomComplet || chef.nomComplet)) || '—';
  var statutRaw = f.Statut || f.statut || '';
  var statutAff = displayStatut(statutRaw);
  var etat = sb.EtatGeneral || sb.etatGeneral || '';
  var toilettesG = sb.ToilettesGarcons || sb.toilettesGarcons || '';
  var toilettesF = sb.ToilettesFilles || sb.toilettesFilles || '';
  var produits =
    si.ProduitsNettoyage ||
    si.produitsNettoyage ||
    f.ProduitsNettoyage ||
    f.produitsNettoyage ||
    [];
  if (typeof produits === 'string') {
    try {
      produits = JSON.parse(produits);
    } catch (e) {
      produits = produits ? [produits] : [];
    }
  }
  var produitsTxt = Array.isArray(produits) && produits.length ? produits.join(', ') : '';
  var autres = (f.ProduitsAutres || f.produitsAutres || '').toString().trim();
  if (autres) produitsTxt = produitsTxt ? produitsTxt + ', ' + autres : autres;

  var isValidee = statutRaw.toString().toLowerCase() === 'validee';
  var body =
    printSectionTitle('1.', 'Généralités') +
    printKvTable([
      ['École', ecoleNom(ecole)],
      ['Chef d\'établissement', chefNom],
      ['Ordre de mission', (ordre && (ordre.Numero || ordre.numero)) || ''],
      ['Statut de la fiche', statutAff, highlightStatut(statutRaw)]
    ]) +
    printSectionTitle('2.', 'Bâtiments & infrastructures') +
    printKvTable([
      [
        'Nombre de bâtiments',
        sb.NombreBatiments != null
          ? sb.NombreBatiments
          : sb.nombreBatiments != null
            ? sb.nombreBatiments
            : ''
      ],
      ['État général', etat, highlightEtat(etat)],
      [
        'Nombre d\'élèves',
        sb.NombreEleves != null ? sb.NombreEleves : sb.nombreEleves != null ? sb.nombreEleves : ''
      ],
      ['Toilettes filles', toilettesF, highlightEtat(toilettesF)],
      ['Toilettes garçons', toilettesG, highlightEtat(toilettesG)]
    ]) +
    printSectionTitle('3.', 'Impact 7 %') +
    printKvTable([
      ['Montant perçu', si.MontantPercu || si.montantPercu || ''],
      ['Produits de nettoyage', produitsTxt],
      ['Quantité / précisions', si.Quantite || si.quantite || f.Quantite || f.quantite || '']
    ]) +
    printSectionTitle('4.', 'Observations & recommandations') +
    printObsBox(
      f.Observations || f.observations || '',
      f.RecommandationPreliminaire || f.recommandationPreliminaire || ''
    ) +
    printSectionTitle('5.', 'Validation') +
    printValidBox(
      isValidee ? 'Lu et approuvé' : 'En attente / non validée',
      isValidee ? 'Validée le ' + fmtDateTime(f.ValideeLe || f.valideeLe) : '',
      'LE CONTRÔLEUR / L\'ÉQUIPE DE MISSION',
      ''
    );

  return window.buildOfficialPrintShell({
    title: 'FICHE DE CONTRÔLE',
    subtitle: 'Constat sanitaire scolaire',
    ref: buildOfficialRef(numero, dateDoc),
    date: fmtDateLong(dateDoc),
    objet: 'Constat sanitaire scolaire — ' + ecoleNom(ecole),
    destinataire: 'Le chef d\'établissement — ' + chefNom,
    bodyHtml: body,
    docId: numero
  });
};

/** HTML métier — Rapport */
window.buildRapportPrintHtml = function (r, ecole, fichesRowsHtml) {
  var numero = r.Numero || r.numero || '';
  var dateDoc = r.DeposeLe || r.deposeLe || r.CreatedAt || r.createdAt || null;
  var synthese = (r.Synthese || r.synthese || '').toString().trim();
  var statutRaw = r.Statut || r.statut || '';
  var body =
    printSectionTitle('1.', 'Synthèse') +
    printKvTable([
      ['École concernée', ecoleNom(ecole)],
      ['Synthèse', synthese || '']
    ]) +
    printSectionTitle('2.', 'Fiches de contrôle intégrées') +
    '<table class="isp-print-table isp-print-table--data"><thead><tr><th>N° Fiche</th><th>Recommandation</th></tr></thead><tbody>' +
    (fichesRowsHtml || '<tr><td class="is-empty" colspan="2">—</td></tr>') +
    '</tbody></table>' +
    printSectionTitle('3.', 'Suivi administratif') +
    printKvTable([
      ['Statut', displayStatut(statutRaw), highlightStatut(statutRaw)],
      ['Déposé le', fmtDateTime(r.DeposeLe || r.deposeLe)],
      ['Accusé de réception', fmtDateTime(r.AccuseReceptionLe || r.accuseReceptionLe)],
      ['Transmis le', fmtDateTime(r.TransmisLe || r.transmisLe)]
    ]) +
    printSectionTitle('4.', 'Signature') +
    printValidBox(
      'Rapport d\'inspection',
      (r.DeposeLe || r.deposeLe) ? 'Déposé le ' + fmtDateTime(r.DeposeLe || r.deposeLe) : '',
      'LE CONTRÔLEUR / L\'ÉQUIPE DE MISSION',
      ''
    );

  return window.buildOfficialPrintShell({
    title: 'RAPPORT D\'INSPECTION',
    subtitle: 'Synthèse du contrôle sanitaire scolaire',
    ref: buildOfficialRef(numero, dateDoc),
    date: fmtDateLong(dateDoc),
    objet: 'Rapport d\'inspection sanitaire — ' + ecoleNom(ecole),
    destinataire: 'Le Secrétariat / Le Directeur Provincial',
    bodyHtml: body,
    docId: numero
  });
};

/** HTML métier — Décision (espace chef / DP) */
window.buildDecisionPrintHtml = function (d, ecole) {
  var numero = d.Numero || d.numero || '';
  var dateDoc = d.DecideLe || d.decideLe || d.CreatedAt || d.createdAt || null;
  var type = d.Type || d.type || d.TypeDecision || d.typeDecision || '—';
  var statutRaw = d.StatutExecution || d.statutExecution || '';
  var commentaire = (d.Commentaire || d.commentaire || d.Motif || d.motif || '').toString().trim();
  var body =
    printSectionTitle('1.', 'Identification') +
    printKvTable([
      ['École', ecoleNom(ecole)],
      ['Rapport lié', d.RapportNumero || d.rapportNumero || ''],
      ['Type de décision', type],
      ['Statut d\'exécution', displayStatut(statutRaw) || statutRaw.replace(/_/g, ' '), highlightStatut(statutRaw)]
    ]) +
    printSectionTitle('2.', 'Mesures') +
    printKvTable([
      ['Délai d\'exécution', d.DelaiExecution || d.delaiExecution || ''],
      ['Décidée le', fmtDateTime(d.DecideLe || d.decideLe)]
    ]) +
    printSectionTitle('3.', 'Motif / commentaire') +
    '<div class="isp-print-box isp-print-box-obs"><p>' +
    esc(commentaire || '—') +
    '</p></div>' +
    printSectionTitle('4.', 'Notification') +
    printValidBox(
      'Décision notifiée à l\'établissement',
      dateDoc ? 'Décidée le ' + fmtDateTime(dateDoc) : '',
      'LE DIRECTEUR PROVINCIAL',
      ''
    );

  return window.buildOfficialPrintShell({
    title: 'DÉCISION',
    subtitle: 'Mesure corrective — contrôle sanitaire scolaire',
    ref: buildOfficialRef(numero, dateDoc),
    date: fmtDateLong(dateDoc),
    objet: 'Décision — ' + type + ' — ' + ecoleNom(ecole),
    destinataire: 'Le chef d\'établissement',
    bodyHtml: body,
    docId: numero
  });
};
