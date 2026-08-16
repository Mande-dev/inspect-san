(function () {
  'use strict';
  if (!window.api) return;

  var page = document.getElementById('parametresPage');
  var tab = page?.getAttribute('data-tab') || 'communes';
  var tbody = document.getElementById('parametresTbody');
  var thead = document.getElementById('parametresThead');
  var table = document.getElementById('parametresTable');
  var form = document.getElementById('refForm');
  var tabInput = document.getElementById('refTab');
  var fieldsTypes = document.getElementById('refFieldsTypes');
  var fieldsNom = document.getElementById('refFieldsNom');
  var fieldsEquipe = document.getElementById('refFieldsEquipe');
  var refCode = document.getElementById('refCode');
  var refLibelle = document.getElementById('refLibelle');
  var refNom = document.getElementById('refNom');
  var chefSelect = document.getElementById('refChefControleurId');

  function isTypesTab() {
    return tab === 'typesDecision';
  }
  function isEquipesTab() {
    return tab === 'equipes';
  }

  async function loadChefOptions(equipeId, selectedChefId) {
    if (!chefSelect) return;
    chefSelect.innerHTML = '<option value="">— À désigner plus tard —</option>';
    if (!equipeId) {
      var emptyHint = document.createElement('option');
      emptyHint.disabled = true;
      emptyHint.textContent = 'Aucun membre tant que l’équipe n’est pas créée';
      chefSelect.appendChild(emptyHint);
      return;
    }
    try {
      var list = await api.get('/Home/GetControleursPourEquipe', { equipeId: equipeId });
      if (!list || !list.length) {
        var noMember = document.createElement('option');
        noMember.disabled = true;
        noMember.textContent = 'Aucun membre dans cette équipe';
        chefSelect.appendChild(noMember);
        return;
      }
      (list || []).forEach(function (c) {
        var id = c.id || c.Id;
        var nom = c.nomComplet || c.NomComplet || '';
        var opt = document.createElement('option');
        opt.value = id;
        opt.textContent = nom;
        if (selectedChefId && selectedChefId === id) opt.selected = true;
        chefSelect.appendChild(opt);
      });
    } catch (err) {
      api.showToast(err.message || 'Erreur chargement chefs', 'danger');
    }
  }

  function syncUiForTab() {
    var types = isTypesTab();
    var equipes = isEquipesTab();
    if (page) page.setAttribute('data-tab', tab);
    if (tabInput) tabInput.value = tab;

    if (fieldsTypes) fieldsTypes.classList.toggle('d-none', !types);
    if (fieldsNom) fieldsNom.classList.toggle('d-none', types);
    if (fieldsEquipe) fieldsEquipe.classList.toggle('d-none', !equipes);

    if (refCode) refCode.required = types;
    if (refLibelle) refLibelle.required = types;
    if (refNom) refNom.required = !types;

    if (thead) {
      thead.innerHTML =
        (types ? '<th>Code</th>' : '') +
        '<th>Nom / Libellé</th>' +
        (equipes ? '<th>Chef d’équipe</th>' : '') +
        '<th>Actif</th><th></th>';
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

  function rowHtml(i) {
    var id = i.id || i.Id || '';
    var code = i.code || i.Code || '';
    var nom = i.nom || i.Nom || '';
    var libelle = i.libelle || i.Libelle || '';
    var actif = i.actif !== undefined ? i.actif : i.Actif;
    var chefId = i.chefControleurId || i.ChefControleurId || '';
    var chefNom = i.chefNom || i.ChefNom || '';
    var payload = {
      Id: id,
      Code: code,
      Nom: nom,
      Libelle: libelle,
      Actif: !!actif,
      ChefControleurId: chefId,
      ChefNom: chefNom
    };
    var json = api.attr(JSON.stringify(payload));
    var cells =
      (isTypesTab() ? '<td>' + api.esc(code) + '</td>' : '') +
      '<td>' +
      api.esc(libelle || nom) +
      '</td>' +
      (isEquipesTab() ? '<td>' + api.esc(chefNom || '—') + '</td>' : '') +
      '<td>' +
      (actif ? 'Oui' : 'Non') +
      '</td>';
    return (
      '<tr>' +
      cells +
      '<td class="text-end text-nowrap">' +
      '<button type="button" class="btn btn-sm btn-outline-primary ref-edit" data-json="' +
      json +
      '" data-bs-toggle="modal" data-bs-target="#refModal"><i class="ti ti-edit"></i></button> ' +
      '<form class="d-inline js-delete-ref" data-id="' +
      api.attr(id) +
      '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>' +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody) return;
    tbody.innerHTML =
      '<tr><td colspan="5" class="text-center text-secondary py-4">Chargement…</td></tr>';
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
    document.getElementById('refId').value = '';
    document.getElementById('refTitle').textContent = 'Ajouter';
    document.getElementById('actif').checked = true;
    if (tabInput) tabInput.value = tab;
    if (isEquipesTab()) loadChefOptions(null, null);
  });

  document.addEventListener('click', function (e) {
    var b = e.target.closest('.ref-edit');
    if (!b) return;
    var i = api.parseJsonAttr ? api.parseJsonAttr(b, 'json') : JSON.parse(b.getAttribute('data-json') || '{}');
    if (!i) return;
    document.getElementById('refTitle').textContent = 'Modifier';
    document.getElementById('refId').value = i.Id || i.id || '';
    if (refCode) refCode.value = i.Code || i.code || '';
    if (refLibelle) refLibelle.value = i.Libelle || i.libelle || '';
    if (refNom) refNom.value = i.Nom || i.nom || '';
    document.getElementById('actif').checked = !!(i.Actif !== undefined ? i.Actif : i.actif);
    if (tabInput) tabInput.value = tab;
    if (isEquipesTab()) {
      loadChefOptions(i.Id || i.id || '', i.ChefControleurId || i.chefControleurId || '');
    }
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var result;
        if (isEquipesTab()) {
          var bodyEq = {
            id: document.getElementById('refId').value || null,
            nom: refNom?.value || null,
            actif: document.getElementById('actif').checked,
            chefControleurId: chefSelect?.value || null
          };
          result = await api.post('/Home/SaveEquipeJson', bodyEq);
        } else {
          var body = {
            id: document.getElementById('refId').value || null,
            actif: document.getElementById('actif').checked,
            code: refCode?.value || null,
            libelle: refLibelle?.value || null,
            nom: refNom?.value || null
          };
          result = await api.post('/Home/SaveParametreJson?tab=' + encodeURIComponent(tab), body);
        }
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
    var id = f.getAttribute('data-id');
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
    var next = params.get('tab') || 'communes';
    if (next !== tab) switchTab(next);
  });

  syncUiForTab();
})();
