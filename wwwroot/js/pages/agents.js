(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('agentsFilter');
  var tbody = document.getElementById('agentsTbody');
  var table = document.getElementById('agentsTable');
  var form = document.getElementById('agentForm');
  var canGerer = table && table.getAttribute('data-can-gerer') === '1';
  var editingId = null;

  function statutBadge(actif) {
    return actif
      ? '<span class="badge bg-success-subtle text-success-emphasis">Actif</span>'
      : '<span class="badge bg-secondary">Inactif</span>';
  }

  function rowHtml(a) {
    var id = a.id || a.Id || '';
    var nom = a.nomComplet || a.NomComplet || '';
    var tel = a.telephone || a.Telephone || '';
    var actif = a.actif !== undefined ? a.actif : a.Actif;
    var edit = canGerer
      ? '<button type="button" class="btn btn-sm btn-outline-primary btn-edit-agent" data-bs-toggle="modal" data-bs-target="#agentModal" data-id="' +
        api.attr(id) +
        '" data-nom="' +
        api.attr(nom) +
        '" data-tel="' +
        api.attr(tel) +
        '" data-actif="' +
        (actif ? '1' : '0') +
        '"><i class="ti ti-edit"></i></button> '
      : '';
    var del = canGerer
      ? '<form class="d-inline js-delete-agent" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>'
      : '';
    return (
      '<tr><td class="font-monospace">' +
      api.esc(id) +
      '</td><td class="fw-semibold">' +
      api.esc(nom) +
      '</td><td>' +
      api.esc(tel || '—') +
      '</td><td>' +
      statutBadge(!!actif) +
      '</td><td class="text-end text-nowrap">' +
      edit +
      del +
      '</td></tr>'
    );
  }

  function setStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function refreshStats(list) {
    var all = list || [];
    var actifs = all.filter(function (a) {
      var v = a.actif !== undefined ? a.actif : a.Actif;
      return !!v;
    }).length;
    setStat('statAgentsTotal', all.length);
    setStat('statAgentsActifs', actifs);
    setStat('statAgentsInactifs', all.length - actifs);
    setStat(
      'statAgentsTel',
      all.filter(function (a) {
        return !!(a.telephone || a.Telephone);
      }).length
    );
  }

  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var actif = fd.get('actif');
    var params = { q: fd.get('q') || '' };
    if (actif === 'true' || actif === 'false') params.actif = actif;
    var list = await api.get('/Home/GetAgents', params);
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
    // Vue globale : stats sur l’ensemble (sans filtre)
    var all = await api.get('/Home/GetAgents', {});
    refreshStats(all);
  }

  function fillAgent(id, nom, tel, actif) {
    editingId = id || null;
    document.getElementById('agentEditId').value = id || '';
    document.getElementById('agentId').value = id || '';
    document.getElementById('agentId').readOnly = !!id;
    document.getElementById('agentNom').value = nom || '';
    document.getElementById('agentTel').value = tel || '';
    document.getElementById('agentActif').value = actif === '1' || actif === true ? 'true' : 'false';
  }

  document.getElementById('btnNewAgent')?.addEventListener('click', function () {
    document.getElementById('agentTitle').textContent = 'Nouvel agent';
    form.reset();
    fillAgent('', '', '', '1');
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-edit-agent');
    if (!btn) return;
    document.getElementById('agentTitle').textContent = 'Modifier';
    fillAgent(
      btn.getAttribute('data-id') || '',
      btn.getAttribute('data-nom') || '',
      btn.getAttribute('data-tel') || '',
      btn.getAttribute('data-actif') || '1'
    );
  });

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    loadList().catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!canGerer) return;
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var matricule = document.getElementById('agentId').value;
        var body = {
          id: editingId || null,
          matricule: matricule,
          nomComplet: document.getElementById('agentNom').value,
          telephone: document.getElementById('agentTel').value || null,
          actif: document.getElementById('agentActif').value === 'true'
        };
        var result = await api.post('/Home/SaveAgentJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('agentModal'));
          loadList();
        });
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  document.addEventListener('submit', async function (e) {
    var del = e.target.closest('.js-delete-agent');
    if (!del) return;
    e.preventDefault();
    if (!(await api.confirm('Supprimer cet agent ?'))) return;
    var id = del.getAttribute('data-id');
    try {
      await api.withBusy(del.querySelector('button'), async function () {
        var result = await api.post('/Home/DeleteAgentJson', { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });
})();
