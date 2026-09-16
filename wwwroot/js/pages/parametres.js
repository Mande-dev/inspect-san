(function () {
  'use strict';
  if (!window.api) return;

  var page = document.getElementById('parametresPage');
  var tab = page?.getAttribute('data-tab') || 'categories';
  var canGerer = page?.getAttribute('data-can-gerer') === '1';
  var tbody = document.getElementById('parametresTbody');
  var thead = document.getElementById('parametresThead');
  var table = document.getElementById('parametresTable');
  var form = document.getElementById('refForm');
  var tabInput = document.getElementById('refTab');
  var refNom = document.getElementById('refNom');
  var refNomLabel = document.querySelector('label[for="refNom"]');
  var refCodeLabel = document.querySelector('label[for="refCodeDisplay"]');
  var refCode = document.getElementById('refCode');
  var refCodeText = document.getElementById('refCodeText');
  var refCodeGroup = document.getElementById('refCodeGroup');
  var refCodeDisplay = document.getElementById('refCodeDisplay');
  var refCodeHelp = document.getElementById('refCodeHelp');

  function isSousDivisionsTab() {
    return tab === 'sous-divisions';
  }

  function labelsForTab() {
    var p = page || {};
    if (tab === 'categories') {
      return {
        code: p.getAttribute('data-label-code-cat') || 'Code Catégorie',
        libelle: p.getAttribute('data-label-desi-cat') || 'Désignation Catégorie'
      };
    }
    if (tab === 'produits') {
      return {
        code: 'Code',
        libelle: p.getAttribute('data-label-desi-prod') || 'Désignation Produit de nettoyage'
      };
    }
    if (tab === 'outils') {
      return {
        code: 'Code',
        libelle: p.getAttribute('data-label-desi-outil') || 'Désignation outil de nettoyage'
      };
    }
    if (tab === 'sous-divisions') {
      return {
        code: p.getAttribute('data-label-code-sous') || 'Code Sous-division',
        libelle: p.getAttribute('data-label-lib-sous') || 'Libellé sous-division'
      };
    }
    return { code: 'Code', libelle: 'Libellé' };
  }

  // Synchronise l’UI selon l’onglet paramètres.
  function syncUiForTab() {
    if (page) page.setAttribute('data-tab', tab);
    if (tabInput) tabInput.value = tab;

    var labels = labelsForTab();
    if (thead) {
      thead.innerHTML =
        '<tr><th style="width:' +
        (isSousDivisionsTab() ? '7rem' : '5rem') +
        '">' +
        api.esc(labels.code) +
        '</th><th>' +
        api.esc(labels.libelle) +
        '</th><th></th></tr>';
    }
    if (refCodeLabel) refCodeLabel.textContent = labels.code;
    if (refNomLabel) refNomLabel.textContent = labels.libelle;
    if (refCodeHelp) {
      refCodeHelp.textContent = isSousDivisionsTab()
        ? 'Code technique SP00x attribué automatiquement (non modifiable).'
        : 'Code technique auto-incrémenté (non modifiable).';
    }

    document.querySelectorAll('#parametresTabs .nav-link').forEach(function (btn) {
      var active = btn.getAttribute('data-tab') === tab;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    var url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.replaceState({ tab: tab }, '', url.pathname + '?' + url.searchParams.toString());
  }

  // Affiche le code de référence dans le formulaire.
  function setCodeUi(code, codeText) {
    var text = (codeText || '').toString().trim();
    var n = parseInt(code, 10) || 0;
    if (refCode) refCode.value = n > 0 ? String(n) : '0';
    if (refCodeText) refCodeText.value = text;
    var display = text || (n > 0 ? String(n) : '');
    if (refCodeDisplay) refCodeDisplay.value = display;
    if (refCodeGroup) refCodeGroup.hidden = !display;
  }

  // Identifiant utilisé pour supprimer / éditer une ligne.
  function itemKey(i) {
    return (
      i.codeText ||
      i.CodeText ||
      (typeof (i.code || i.Code) === 'string' && isNaN(parseInt(i.code || i.Code, 10))
        ? i.code || i.Code
        : '') ||
      String(i.code || i.Code || '')
    );
  }

  // Construit une ligne du tableau paramètres.
  function rowHtml(i) {
    var code = i.code || i.Code || 0;
    var codeText = i.codeText || i.CodeText || '';
    var displayCode = codeText || String(code || '');
    var nom = i.nom || i.Nom || '';
    var libelle = i.libelle || i.Libelle || '';
    var payload = { Code: code, CodeText: codeText || null, Nom: nom, Libelle: libelle };
    var json = api.attr(JSON.stringify(payload));
    var key = itemKey(i);
    var actions = canGerer
      ? ('<button type="button" class="btn btn-sm btn-outline-primary ref-edit" data-json="' +
        json +
        '" data-bs-toggle="modal" data-bs-target="#refModal"><i class="ti ti-edit"></i></button> ' +
        '<form class="d-inline js-delete-ref" data-code="' +
        api.attr(String(key)) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>')
      : '';
    return (
      '<tr>' +
      '<td class="text-secondary">' +
      api.esc(displayCode) +
      '</td>' +
      '<td>' +
      api.esc(libelle || nom) +
      '</td>' +
      '<td class="text-end text-nowrap">' +
      actions +
      '</td></tr>'
    );
  }

  // Charge la liste des référentiels de l’onglet.
  async function loadList() {
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-secondary py-4">Chargement…</td></tr>';
    var list = await api.get('/Home/GetParametres', { tab: tab });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  // Change d’onglet et recharge la liste.
  async function switchTab(nextTab) {
    if (!nextTab || nextTab === tab) return;
    tab = nextTab;
    syncUiForTab();
    try {
      await loadList();
    } catch (err) {
      api.showToast(err.message || 'Erreur de chargement', 'danger');
    }
  }

  document.getElementById('parametresTabs')?.addEventListener('click', function (e) {
    var btn = e.target.closest('.nav-link[data-tab]');
    if (!btn) return;
    e.preventDefault();
    switchTab(btn.getAttribute('data-tab'));
  });

  document.getElementById('btnNewRef')?.addEventListener('click', function () {
    form.reset();
    setCodeUi(0, '');
    document.getElementById('refTitle').textContent = 'Ajouter';
    if (tabInput) tabInput.value = tab;
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.ref-edit');
    if (!b) return;
    var i = api.parseJsonAttr ? api.parseJsonAttr(b, 'json') : JSON.parse(b.getAttribute('data-json') || '{}');
    if (!i) return;
    document.getElementById('refTitle').textContent = 'Modifier';
    var key = itemKey(i);
    var numeric = parseInt(i.Code || i.code || '0', 10) || 0;
    setCodeUi(numeric, isSousDivisionsTab() || (key && isNaN(parseInt(key, 10))) ? key : '');
    if (refNom) refNom.value = i.Nom || i.nom || i.Libelle || i.libelle || '';
    if (tabInput) tabInput.value = tab;
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          code: parseInt(refCode?.value || '0', 10) || 0,
          codeText: (refCodeText?.value || '').trim() || null,
          nom: refNom?.value || null
        };
        var result = await api.post('/Home/SaveParametreJson?tab=' + encodeURIComponent(tab), body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('refModal'));
          loadList();
        });
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  document.addEventListener('submit', async function (e) {
    var f = e.target.closest('.js-delete-ref');
    if (!f) return;
    e.preventDefault();
    if (!(await api.confirm('Supprimer ?'))) return;
    var id = f.getAttribute('data-code');
    try {
      await api.withBusy(f.querySelector('button'), async function () {
        var result = await api.post('/Home/DeleteParametreJson?tab=' + encodeURIComponent(tab), { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  window.addEventListener('popstate', function () {
    var params = new URLSearchParams(window.location.search);
    var next = params.get('tab') || 'categories';
    if (next !== tab) switchTab(next);
  });

  syncUiForTab();
})();
