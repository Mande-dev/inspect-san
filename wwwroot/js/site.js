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

window.closePrintPreview = function () {
  var el = document.getElementById('ispPrintPreviewModal');
  if (el) el.remove();
  document.documentElement.classList.remove('isp-print-preview-open');
  if (window._ispPrintEsc) {
    document.removeEventListener('keydown', window._ispPrintEsc);
    window._ispPrintEsc = null;
  }
};

/** Aperçu / impression — même rendu, dans un modal de la page. */
window.openPrintPreview = function (title, htmlBody) {
  window.closePrintPreview();
  var isOfficial = htmlBody && String(htmlBody).indexOf('isp-print-doc') !== -1;
  var isRapportLandscape = htmlBody && String(htmlBody).indexOf('isp-rap-doc') !== -1;
  var body =
    htmlBody ||
    (document.getElementById('pageContainer')
      ? document.getElementById('pageContainer').innerHTML
      : document.body.innerHTML);
  var cssHref = '/css/print-official.css?v=' + Date.now();
  var docTitle = isOfficial ? '\u00A0' : title || 'Inspect-San';
  var label = (title || 'Document officiel').toString();
  var pageStyle = isRapportLandscape
    ? '<style>@page{size:A4 landscape;margin:10mm 8mm;}body.isp-preview-screen .isp-preview-sheet{width:min(297mm,calc(100vw - 2rem));min-height:210mm;}</style>'
    : '';
  var landscapeHint = isRapportLandscape
    ? ' Choisissez <strong>Orientation paysage</strong> dans la boîte d’impression.'
    : '';
  var toolbar = isOfficial
    ? '<header class="isp-preview-toolbar no-print">' +
      '<div class="isp-preview-toolbar-brand">' +
      '<span class="isp-preview-toolbar-icon" aria-hidden="true"><i class="ti ti-printer"></i></span>' +
      '<div class="isp-preview-toolbar-text">' +
      '<p class="isp-preview-toolbar-kicker">Inspect-San · Aperçu d’impression</p>' +
      '<p class="isp-preview-toolbar-title">' +
      esc(label) +
      '</p>' +
      '</div></div>' +
      '<div class="isp-preview-toolbar-actions">' +
      '<button type="button" class="isp-preview-btn isp-preview-btn-primary" onclick="window.print()">' +
      '<i class="ti ti-printer"></i> Imprimer / PDF</button>' +
      '<button type="button" class="isp-preview-btn isp-preview-btn-ghost" onclick="parent.closePrintPreview()">' +
      '<i class="ti ti-x"></i> Fermer</button>' +
      '</div>' +
      '<p class="isp-preview-hint">Pour un PDF propre : décochez « En-têtes et pieds de page ».' +
      landscapeHint +
      '</p>' +
      '</header>' +
      '<main class="isp-preview-stage"><div class="isp-preview-sheet' +
      (isRapportLandscape ? ' isp-preview-sheet--landscape' : '') +
      '">' +
      body +
      '</div></main>'
    : '<div class="no-print"><button type="button" class="isp-preview-btn isp-preview-btn-primary" onclick="window.print()">Imprimer / PDF</button> ' +
      '<button type="button" class="isp-preview-btn isp-preview-btn-ghost" onclick="parent.closePrintPreview()">Fermer</button></div>' +
      '<h1>' +
      esc(title || 'Inspect-San') +
      '</h1>' +
      body;

  var modal = document.createElement('div');
  modal.id = 'ispPrintPreviewModal';
  modal.className = 'isp-print-preview-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', label);
  var iframe = document.createElement('iframe');
  iframe.title = label;
  modal.appendChild(iframe);
  document.body.appendChild(modal);
  document.documentElement.classList.add('isp-print-preview-open');

  window._ispPrintEsc = function (e) {
    if (e.key === 'Escape') window.closePrintPreview();
  };
  document.addEventListener('keydown', window._ispPrintEsc);

  var w = iframe.contentWindow;
  if (!w) {
    window.closePrintPreview();
    window.print();
    return;
  }
  w.document.write(
    '<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>' +
      esc(docTitle) +
      '</title>' +
      '<link rel="stylesheet" href="/css/fonts.css">' +
      '<link rel="stylesheet" href="/assets/libs/@tabler/icons-webfont/tabler-icons.min.css">' +
      '<link rel="stylesheet" href="' +
      cssHref +
      '">' +
      pageStyle +
      '</head><body class="' +
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
  var a = ecole.Adresse || ecole.adresse;
  if (typeof a === 'string' && a.trim()) {
    // Format composé UI : "Av, Quartier, Commune, N° X" — afficher tel quel
    return a.trim();
  }
  if (a && typeof a === 'object') {
    var parts = [
      (a.Avenue || a.avenue || a.Av || a.av || '').toString().trim(),
      (a.Quartier || a.quartier || '').toString().trim(),
      (a.Commune || a.commune || '').toString().trim(),
      (a.Numero || a.numero || '').toString().trim() ? 'N° ' + (a.Numero || a.numero) : ''
    ].filter(Boolean);
    if (parts.length) return parts.join(', ');
  }
  var sous = (ecole.Sousproved || ecole.sousproved || '').toString().trim();
  return sous || '—';
}

function ecoleNom(ecole) {
  return (ecole && (ecole.Denomination || ecole.denomination)) || '—';
}

/** En-tête officiel (logo + 3 titres serrés | date [/ N°] à droite) — identique pour tous les documents. */
function buildOfficialOmHeader(dateKin, refSousDate) {
  return (
    '<header class="isp-om-header">' +
    '<div class="isp-om-header-grid">' +
    '<div class="isp-om-logo-wrap">' +
    '<img class="isp-om-logo" src="/assets/images/brand/logo/logo_new.png?v=20260829b" alt="Emblème RDC — MINEDU-NC" />' +
    '</div>' +
    '<div class="isp-om-head-text">' +
    '<div class="isp-om-head-main">' +
    '<div class="isp-om-head-titles">' +
    '<p class="isp-om-state">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</p>' +
    '<p class="isp-om-ministry">Ministère de l\'Éducation Nationale et Nouvelle Citoyenneté</p>' +
    '<p class="isp-om-province">Province Éducationnelle de Kinshasa Mont-Amba</p>' +
    '</div>' +
    '<div class="isp-om-head-right">' +
    '<p class="isp-om-head-date">Kinshasa, ' + esc(dateKin) + '</p>' +
    (refSousDate ? '<p class="isp-om-head-ref">N° : ' + esc(refSousDate) + '</p>' : '') +
    '</div>' +
    '</div>' +
    '</div>' +
    '</div>' +
    '</header>'
  );
}
window.buildOfficialOmHeader = buildOfficialOmHeader;

/** Pied officiel (bandeau tricolore + ligne institutionnelle) */
function buildOfficialOmFooter(docLabel, numero) {
  return (
    '<footer class="isp-om-footer">' +
    '<div class="isp-om-tricolor" aria-hidden="true"><span></span><span></span><span></span></div>' +
    '<p class="isp-om-footer-text">MINEDU-NC  •  Province Éducationnelle Kinshasa Mont-Amba  •  ' +
    esc(docLabel || 'Document') +
    (numero ? ' ' + esc(numero) : '') +
    '</p>' +
    '</footer>'
  );
}

/**
 * Gabarit commun — même en-tête officiel que OM / décision / rapport.
 * opts: { title, subtitle, ref, date, objet, destinataire, bodyHtml, docId }
 */
window.buildOfficialPrintShell = function (opts) {
  opts = opts || {};
  var dest = (opts.destinataire || '').toString().trim();
  var objet = (opts.objet || '').toString().trim();
  var metaRows = [];
  if (objet) metaRows.push(['Objet', objet]);
  if (dest) metaRows.push(["À l'attention de", dest]);
  var dateKin = opts.date || fmtDate(new Date());
  if (dateKin === '—') dateKin = fmtDate(new Date());

  return (
    '<article class="isp-print-doc isp-om-doc">' +
    '<div class="isp-om-body">' +
    buildOfficialOmHeader(dateKin) +
    '<div class="isp-print-meta">' +
    '<span><span class="isp-print-meta-ref-label">Réf. : </span>' +
    esc(opts.ref || '—') +
    '</span>' +
    '<span class="isp-print-meta-date">Kinshasa, le ' +
    esc(dateKin) +
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
    '</div>' +
    buildOfficialOmFooter('Document', opts.docId || opts.ref || '') +
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

/** HTML métier — Ordre de mission (gabarit officiel noir/gris + bandeau tricolore) */
window.buildOrdrePrintHtml = window.buildMissionPrintHtml = function (o, ecole, agentsRows, signataireNom) {
  var numero = o.Numero || o.numero || '';
  var dateDoc = o.DateEmission || o.dateEmission || o.SigneLe || o.signeLe || null;
  var debut = o.DateEmission || o.dateEmission || null;
  var fin = o.FinValidite || o.finValidite || null;
  var dateKin = fmtDate(dateDoc);
  if (dateKin === '—') dateKin = fmtDate(new Date());

  var dureeTxt = '—';
  try {
    var d0 = debut ? new Date(debut) : null;
    var d1 = fin ? new Date(fin) : null;
    if (d0 && d1 && !isNaN(d0.getTime()) && !isNaN(d1.getTime())) {
      var days = Math.round((d1 - d0) / 86400000) + 1;
      if (days > 0) dureeTxt = days + (days > 1 ? ' jours' : ' jour');
    }
  } catch (e) { /* ignore */ }

  var rows = Array.isArray(agentsRows) ? agentsRows : [];
  // Compat ancienne signature : string des noms
  if (typeof agentsRows === 'string') {
    rows = agentsRows
      ? agentsRows.split(',').map(function (s) {
          return { matricule: '—', nom: s.trim(), fonction: '—', telephone: '—' };
        })
      : [];
  }

  var agentsHtml =
    '<table class="isp-om-agents">' +
    '<thead><tr>' +
    '<th>MATRICULE</th><th>NOMS ET POST-NOM</th><th>FONCTION</th><th>TÉLÉPHONE</th>' +
    '</tr></thead><tbody>';
  if (!rows.length) {
    agentsHtml += '<tr><td colspan="4" class="text-center">Aucun participant</td></tr>';
  } else {
    rows.forEach(function (r) {
      agentsHtml +=
        '<tr>' +
        '<td class="isp-om-center">' + esc(r.matricule || '—') + '</td>' +
        '<td>' + esc(r.nom || '—') + '</td>' +
        '<td>' + esc(r.fonction || '—') + '</td>' +
        '<td>' + esc(r.telephone || '—') + '</td>' +
        '</tr>';
    });
  }
  agentsHtml += '</tbody></table>';

  var infoGrid =
    '<table class="isp-om-info"><tbody>' +
    '<tr><td><strong>Adresse Établissement :</strong> ' + esc(ecoleAdresse(ecole)) + '</td></tr>' +
    '<tr><td><strong>Durée de la mission :</strong> ' + esc(dureeTxt) + '</td></tr>' +
    '<tr><td><strong>Date début Mission :</strong> ' + esc(fmtDate(debut)) + '</td></tr>' +
    '<tr><td><strong>Date Fin Mission :</strong> ' + esc(fmtDate(fin)) + '</td></tr>' +
    '</tbody></table>';

  return (
    '<article class="isp-print-doc isp-om-doc">' +
    '<div class="isp-om-body">' +
    buildOfficialOmHeader(dateKin) +
    '<h1 class="isp-om-title">ORDRE DE MISSION N° : ' + esc(numero || '—') + '</h1>' +
    '<p class="isp-om-intro">' +
    '<strong>1.</strong> Les cadres et agents de la Province Éducationnelle de Kinshasa Mont-Amba dont les noms, post-noms, fonction et téléphone repris ci-dessous sont désignés pour effectuer une mission officielle. Il s\'agit de :' +
    '</p>' +
    agentsHtml +
    infoGrid +
    '<p class="isp-om-nb"><strong>N.B. :</strong></p>' +
    '<ul class="isp-om-bullets">' +
    '<li>À l\'issue de la mission, les intéressés sont priés d\'établir un rapport succinct ;</li>' +
    '<li>Les autorités tant civiles, militaires ainsi que la Police Nationale Congolaise sont priées d\'apporter toute leur aide et assistance aux porteurs de la présente.</li>' +
    '</ul>' +
    '<p class="isp-om-sign">DIRECTEUR PROVINCIAL' +
    (signataireNom ? '<br /><span class="isp-om-sign-nom">' + esc(signataireNom) + '</span>' : '') +
    '</p>' +
    '</div>' +
    buildOfficialOmFooter('Ordre de Mission', numero) +
    '</article>'
  );
};

/** HTML métier — Lettre de décision (gabarit officiel + données BDD). */
window.buildDecisionPrintHtml = function (d, ecole, ctx) {
  d = d || {};
  ctx = ctx || {};
  var numero = d.Numero || d.numero || '';
  var dateDoc = d.DecideLe || d.decideLe || d.CreatedAt || d.createdAt || null;
  var dateKin = fmtDate(dateDoc);
  if (dateKin === '—') dateKin = fmtDate(new Date());

  var typeCode = (
    ctx.typeCode ||
    d.TypeDecision ||
    d.typeDecision ||
    ''
  )
    .toString()
    .trim()
    .toLowerCase();
  var typeLabel = (
    ctx.typeLabel ||
    d.Type ||
    d.type ||
    d.TypeDecision ||
    d.typeDecision ||
    ''
  ).toString();

  if (!typeCode && typeLabel) {
    var labelKey = typeLabel
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    if (labelKey.indexOf('suspension') >= 0 || labelKey.indexOf('sanction') >= 0)
      typeCode = 'suspension_temporaire_chef';
    else if (labelKey.indexOf('rehabilitation') >= 0 || labelKey.indexOf('réhabilitation') >= 0)
      typeCode = 'rehabilitation';
    else if (labelKey.indexOf('fermeture') >= 0) typeCode = 'fermeture_temporaire';
  }

  var ecoleLabel = ecoleNom(ecole);
  if (ecoleLabel === '—' && (d.EcoleNom || d.ecoleNom)) {
    ecoleLabel = (d.EcoleNom || d.ecoleNom).toString().trim() || '—';
  }

  // Options du gabarit : la case cochée vient du type enregistré en BDD.
  var options = [
    {
      code: 'fermeture_temporaire',
      label: 'Fermeture temporaire de l\'établissement.'
    },
    {
      code: 'suspension_temporaire_chef',
      label: 'Sanction disciplinaire à l\'égard du chef d\'établissement.'
    },
    {
      code: 'rehabilitation',
      label: 'Réhabilitation des infrastructures sanitaires.'
    }
  ];

  var optionsHtml = options
    .map(function (opt) {
      var checked = typeCode === opt.code;
      return (
        '<p class="isp-ld-option">' +
        '<span class="isp-ld-check" aria-hidden="true">' +
        (checked ? '☑' : '☐') +
        '</span> ' +
        esc(opt.label) +
        '</p>'
      );
    })
    .join('');

  return (
    '<article class="isp-print-doc isp-om-doc isp-ld-doc">' +
    '<div class="isp-om-body">' +
    buildOfficialOmHeader(dateKin, numero || '') +
    '<div class="isp-ld-meta">' +
    '<p><strong>À l\'attention de :</strong> Monsieur/Madame le Chef d\'Établissement</p>' +
    '<p><strong>Établissement :</strong> ' + esc(ecoleLabel) + '</p>' +
    '<p><strong>Objet :</strong> Notification de décision suite à l\'inspection sanitaire</p>' +
    '</div>' +
    '<h1 class="isp-om-title">LETTRE DE DÉCISION</h1>' +
    '<p class="isp-ld-salut">Monsieur/Madame le Chef d\'Établissement,</p>' +
    '<p class="isp-ld-intro">' +
    'À la suite du rapport d\'inspection sanitaire transmis à nos services, le Directeur Provincial a arrêté la décision suivante concernant votre établissement :' +
    '</p>' +
    '<div class="isp-ld-box">' +
    '<p class="isp-ld-dec-title"><strong>DÉCISION FINALE</strong></p>' +
    optionsHtml +
    '</div>' +
    '<p class="isp-ld-close">Veuillez exécuter les présentes directives dès réception de cette notification.</p>' +
    '<div class="isp-ld-signs">' +
    '<div class="isp-ld-sign-col">' +
    '<p class="isp-ld-sign-head">Pour Réception (Chef d\'Établissement) :</p>' +
    '<p class="isp-ld-sign-space">&nbsp;</p>' +
    '<p><strong>Nom :</strong> ____________________</p>' +
    '</div>' +
    '<div class="isp-ld-sign-col isp-ld-sign-right">' +
    '<p class="isp-ld-sign-head">Pour la Direction Provinciale Kinshasa Mont-Amba :</p>' +
    '<p class="isp-ld-sign-space">&nbsp;</p>' +
    '<p><strong>Le Directeur Provincial</strong></p>' +
    '</div>' +
    '</div>' +
    '</div>' +
    buildOfficialOmFooter('Lettre de Décision', numero) +
    '</article>'
  );
};

/** HTML métier — Rapport d'inspection formel par sous-division (paysage) */
window.buildRapportInspectionPrintHtml = function (dto) {
  dto = dto || {};
  var sections = dto.sections || dto.Sections || [];
  var totalGenerale = dto.totalGenerale ?? dto.TotalGenerale ?? 0;
  var dateKin = fmtDate(new Date());
  if (dateKin === '—') dateKin = fmtDate(new Date());

  function money(v) {
    var n = Number(v);
    if (isNaN(n)) return '—';
    try {
      return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } catch (e) {
      return String(n);
    }
  }

  function cell(v) {
    var s = v == null || v === '' ? '—' : String(v);
    return esc(s);
  }

  function sectionBlock(s) {
    s = s || {};
    var code = s.sousDivisionCode || s.SousDivisionCode || '—';
    var libelle = s.sousDivisionLabel || s.SousDivisionLabel || '—';
    var lignes = s.lignes || s.Lignes || [];
    var totaleSd = s.totaleSousDivision ?? s.TotaleSousDivision ?? lignes.length;

    var rows = '';
    if (!lignes.length) {
      rows = '<tr><td colspan="16" class="text-center">Aucune fiche validée</td></tr>';
    } else {
      lignes.forEach(function (l) {
        rows +=
          '<tr>' +
          '<td>' + cell(l.numOrdre || l.NumOrdre) + '</td>' +
          '<td>' + cell(l.ecoleNom || l.EcoleNom) + '</td>' +
          '<td>' + cell(l.fonctionControleur || l.FonctionControleur) + '</td>' +
          '<td>' + cell(l.numAgrement || l.NumAgrement) + '</td>' +
          '<td>' + cell(l.nomAgent || l.NomAgent) + '</td>' +
          '<td>' + cell(l.etatBatiment || l.EtatBatiment) + '</td>' +
          '<td class="isp-om-center">' + cell(l.nombreBatiments ?? l.NombreBatiments) + '</td>' +
          '<td class="isp-om-center">' + cell(l.toilettesFilles ?? l.ToilettesFilles) + '</td>' +
          '<td class="isp-om-center">' + cell(l.toilettesGarcons ?? l.ToilettesGarcons) + '</td>' +
          '<td class="isp-om-center">' + cell(l.nombreEleves ?? l.NombreEleves) + '</td>' +
          '<td>' + cell(l.designationProduit || l.DesignationProduit) + '</td>' +
          '<td>' + cell(l.designationOutil || l.DesignationOutil) + '</td>' +
          '<td>' + cell(l.idDinacope || l.IdDinacope) + '</td>' +
          '<td>' + cell(l.chefNom || l.ChefNom) + '</td>' +
          '<td>' + cell(l.regime || l.Regime) + '</td>' +
          '<td class="isp-om-center">' +
          cell(
            l.montPer != null || l.MontPer != null
              ? money(l.montPer ?? l.MontPer)
              : '—'
          ) +
          '</td>' +
          '</tr>';
      });
    }

    return (
      '<section class="isp-rap-section">' +
      '<div class="isp-rap-sd-line">' +
      '<span><strong>CODE SOUS DIVISION :</strong> ' + esc(code) + '</span>' +
      '<span><strong>LIBELLE SOUS DIVISION :</strong> ' + esc(libelle) + '</span>' +
      '</div>' +
      '<div class="isp-rap-table-wrap">' +
      '<table class="isp-rap-grid">' +
      '<thead><tr>' +
      '<th>N° ORDRE</th>' +
      '<th>DÉNOM.</th>' +
      '<th>FONCT. CONTR.</th>' +
      '<th>N° AGR.</th>' +
      '<th>NOM AGENT</th>' +
      '<th>ÉTAT BÂT.</th>' +
      '<th>NBRE BÂT.</th>' +
      '<th>TOIL. F.</th>' +
      '<th>TOIL. G.</th>' +
      '<th>NBRE ÉLÈVES</th>' +
      '<th>DÉS. PRODUIT</th>' +
      '<th>DÉS. OUTIL</th>' +
      '<th>ID DINACOPE</th>' +
      '<th>NOM CHEF ÉTAB.</th>' +
      '<th>REG GES</th>' +
      '<th>MONT. PERÇU</th>' +
      '</tr></thead><tbody>' +
      rows +
      '</tbody></table>' +
      '</div>' +
      '<div class="isp-rap-footer-stack">' +
      '<p><strong>TOTALE PAR SOUS DIVISION :</strong> ' + esc(String(totaleSd)) + '</p>' +
      '</div>' +
      '</section>'
    );
  }

  var bodySections = '';
  if (!sections.length) {
    bodySections = '<p>Aucune inspection validée pour la période sélectionnée.</p>';
  } else {
    sections.forEach(function (s) {
      var lignes = s.lignes || s.Lignes || [];
      if (lignes.length) bodySections += sectionBlock(s);
    });
    if (!bodySections) {
      bodySections = '<p>Aucune inspection validée pour la période sélectionnée.</p>';
    }
  }

  var legend =
    '<div class="isp-rap-legend">' +
    '<p class="isp-rap-legend-title"><strong>LÉGENDE DES ABRÉVIATIONS</strong></p>' +
    '<ul>' +
    '<li><strong>N° ORDRE</strong> : Numéro d\'ordre de mission</li>' +
    '<li><strong>DÉNOM.</strong> : Dénomination de l\'établissement</li>' +
    '<li><strong>FONCT. CONTR.</strong> : Fonction du contrôleur (chef d\'équipe)</li>' +
    '<li><strong>N° AGR.</strong> : Numéro d\'agrément</li>' +
    '<li><strong>ÉTAT BÂT.</strong> : État des bâtiments</li>' +
    '<li><strong>NBRE BÂT.</strong> : Nombre de bâtiments</li>' +
    '<li><strong>TOIL. F.</strong> : Nombre de toilettes filles</li>' +
    '<li><strong>TOIL. G.</strong> : Nombre de toilettes garçons</li>' +
    '<li><strong>NBRE ÉLÈVES</strong> : Nombre d\'élèves</li>' +
    '<li><strong>DÉS. PRODUIT</strong> : Désignation du (des) produit(s)</li>' +
    '<li><strong>DÉS. OUTIL</strong> : Désignation du (des) outil(s)</li>' +
    '<li><strong>ID DINACOPE</strong> : Identifiant DINACOPE de l\'établissement</li>' +
    '<li><strong>NOM CHEF ÉTAB.</strong> : Nom du chef d\'établissement</li>' +
    '<li><strong>REG GES</strong> : Régime de gestion</li>' +
    '<li><strong>MONT. PERÇU</strong> : Montant perçu</li>' +
    '</ul>' +
    '</div>';

  return (
    '<article class="isp-print-doc isp-om-doc isp-rap-doc">' +
    '<div class="isp-om-body">' +
    buildOfficialOmHeader(dateKin) +
    '<h1 class="isp-om-title">RAPPORT D\'INSPECTION FORMEL PAR SOUS-DIVISION</h1>' +
    bodySections +
    '<p class="isp-rap-total-general"><strong>TOTAL GÉNÉRALE :</strong> ' + esc(String(totalGenerale)) + '</p>' +
    legend +
    '<p class="isp-om-sign">DIRECTEUR PROVINCIAL</p>' +
    '</div>' +
    buildOfficialOmFooter("Rapport d'inspection", '') +
    '</article>'
  );
};
