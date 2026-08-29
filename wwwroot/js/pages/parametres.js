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
  var refCode = document.getElementById('refCode');
  var refCodeGroup = document.getElementById('refCodeGroup');
  var refCodeDisplay = document.getElementById('refCodeDisplay');

  function syncUiForTab() {
    if (page) page.setAttribute('data-tab', tab);
    if (tabInput) tabInput.value = tab;

    if (thead) {
      thead.innerHTML = '<tr><th style="width:5rem">Code</th><th>Libellé</th><th></th></tr>';
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

  function setCodeUi(code) {
    var n = parseInt(code, 10) || 0;
    if (refCode) refCode.value = n > 0 ? String(n) : '0';
    if (refCodeDisplay) refCodeDisplay.value = n > 0 ? String(n) : '';
    if (refCodeGroup) refCodeGroup.hidden = n <= 0;
  }

  function rowHtml(i) {
    var code = i.code || i.Code || 0;
    var nom = i.nom || i.Nom || '';
    var libelle = i.libelle || i.Libelle || '';
    var payload = { Code: code, Nom: nom, Libelle: libelle };
    var json = api.attr(JSON.stringify(payload));
    var actions = canGerer
      ? ('<button type="button" class="btn btn-sm btn-outline-primary ref-edit" data-json="' + json +
        '" data-bs-toggle="modal" data-bs-target="#refModal"><i class="ti ti-edit"></i></button> ' +
        '<form class="d-inline js-delete-ref" data-code="' + api.attr(String(code)) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>')
      : '';
    return (
      '<tr>' +
      '<td class="text-secondary">' + api.esc(String(code || '')) + '</td>' +
      '<td>' + api.esc(libelle || nom) + '</td>' +
      '<td class="text-end text-nowrap">' + actions + '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody) return;
    tbody.innerHTML = '<tr><td colspan="3" class="text-center text-secondary py-4">Chargement…</td></tr>';
    var list = await api.get('/Home/GetParametres', { tab: tab });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

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
    setCodeUi(0);
    document.getElementById('refTitle').textContent = 'Ajouter';
    if (tabInput) tabInput.value = tab;
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.ref-edit');
    if (!b) return;
    var i = api.parseJsonAttr ? api.parseJsonAttr(b, 'json') : JSON.parse(b.getAttribute('data-json') || '{}');
    if (!i) return;
    document.getElementById('refTitle').textContent = 'Modifier';
    setCodeUi(i.Code || i.code || 0);
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
