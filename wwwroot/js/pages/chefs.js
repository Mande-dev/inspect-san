(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('chefsFilter');
  var tbody = document.getElementById('chefsTbody');
  var table = document.getElementById('chefsTable') || (tbody && tbody.closest('table'));
  var form = document.getElementById('chefForm');
  var canGerer = table && table.getAttribute('data-can-gerer') === '1';
  var fields = ['chefMatricule', 'chefNom', 'chefTel', 'chefEmail', 'chefAnneeDebut'];

  // Construit une ligne du tableau chefs.
  function rowHtml(c) {
    var id = c.id || c.Id || '';
    var payload = {
      Id: id,
      Matricule: id,
      NomComplet: c.nomComplet || c.NomComplet || '',
      Telephone: c.telephone || c.Telephone || '',
      Email: c.email || c.Email || '',
      AnneeDebutActivite: c.anneeDebutActivite ?? c.AnneeDebutActivite ?? null
    };
    var json = api.attr(JSON.stringify(payload));
    var actions =
      '<button type="button" class="btn btn-sm btn-outline-secondary chef-open" data-mode="view" data-json="' +
      json +
      '" data-bs-toggle="modal" data-bs-target="#chefModal"><i class="ti ti-eye"></i></button> ';
    if (canGerer) {
      actions +=
        '<button type="button" class="btn btn-sm btn-outline-primary chef-open" data-mode="edit" data-json="' +
        json +
        '" data-bs-toggle="modal" data-bs-target="#chefModal"><i class="ti ti-edit"></i></button> ' +
        '<form class="d-inline js-delete-chef" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>';
    }
    return (
      '<tr>' +
      '<td class="font-monospace">' + api.esc(payload.Matricule) + '</td>' +
      '<td class="fw-semibold">' + api.esc(payload.NomComplet) + '</td>' +
      '<td>' + api.esc(payload.Telephone) + '</td>' +
      '<td class="small">' + api.esc(payload.Email || '—') + '</td>' +
      '<td>' + api.esc(c.ecoleNom || c.EcoleNom || '—') + '</td>' +
      '<td class="small">' + api.esc(payload.AnneeDebutActivite != null ? String(payload.AnneeDebutActivite) : '—') + '</td>' +
      '<td class="text-end text-nowrap">' +
      actions +
      '</td></tr>'
    );
  }

  // Met à jour un compteur statistique chefs.
  function setStat(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  // Recalcule les statistiques chefs.
  function refreshStats(list) {
    var all = list || [];
    var assignes = all.filter(function (c) {
      var ecole = c.ecoleNom || c.EcoleNom || '';
      return !!(ecole && ecole !== '—');
    }).length;
    setStat('statChefsTotal', all.length);
    setStat('statChefsAssignes', assignes);
    setStat('statChefsSansEcole', all.length - assignes);
    setStat(
      'statChefsTel',
      all.filter(function (c) {
        return !!(c.telephone || c.Telephone);
      }).length
    );
  }

  // Charge et affiche la liste des chefs.
  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var list = await api.get('/Home/GetChefs', {
      q: fd.get('q') || '',
      ecoleId: fd.get('ecoleId') || ''
    });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
    var all = await api.get('/Home/GetChefs', {});
    refreshStats(all);
  }

  // Ouvre le modal chef en vue ou édition.
  function openChef(btn) {
    var el = btn && btn.closest ? btn.closest('.chef-open') || btn : btn;
    var c = api.parseJsonAttr(el, 'json') || {};
    var viewing = (el.dataset.mode || api.dataAttr(el, 'mode')) === 'view';
    var isEdit = !!(c.Id || c.id);
    document.getElementById('chefId').value = c.Id || c.id || '';
    document.getElementById('chefMatricule').value = c.Matricule || c.matricule || c.Id || c.id || '';
    document.getElementById('chefNom').value = c.NomComplet || c.nomComplet || '';
    document.getElementById('chefTel').value = c.Telephone || c.telephone || '';
    document.getElementById('chefEmail').value = c.Email || c.email || '';
    document.getElementById('chefAnneeDebut').value =
      c.AnneeDebutActivite != null ? c.AnneeDebutActivite : c.anneeDebutActivite != null ? c.anneeDebutActivite : '';
    document.getElementById('chefModalTitle').textContent = viewing ? 'Détail du chef' : 'Modifier le chef';
    document.getElementById('chefSave').classList.toggle('d-none', viewing);
    fields.forEach(function (id) {
      document.getElementById(id).disabled = viewing;
    });
    document.getElementById('chefMatricule').readOnly = isEdit;
  }

  document.getElementById('newChef')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('chefId').value = '';
    document.getElementById('chefMatricule').readOnly = false;
    document.getElementById('chefModalTitle').textContent = 'Nouveau chef d\'établissement';
    document.getElementById('chefSave').classList.remove('d-none');
    fields.forEach(function (id) {
      document.getElementById(id).disabled = false;
    });
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.chef-open');
    if (btn) openChef(btn);
  });

  document.getElementById('chefModal')?.addEventListener('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    var btn = trigger.closest('.chef-open');
    if (btn) openChef(btn);
  });

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    loadList().catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    fields.forEach(function (id) {
      document.getElementById(id).disabled = false;
    });
    var btn = document.getElementById('chefSave');
    try {
      await api.withBusy(btn, async function () {
        var anneeRaw = document.getElementById('chefAnneeDebut').value;
        var body = {
          id: document.getElementById('chefId').value || null,
          matricule: document.getElementById('chefMatricule').value,
          nomComplet: document.getElementById('chefNom').value,
          telephone: document.getElementById('chefTel').value,
          email: document.getElementById('chefEmail').value || null,
          anneeDebutActivite: anneeRaw ? parseInt(anneeRaw, 10) : null
        };
        var result = await api.post('/Home/SaveChefJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('chefModal'));
          loadList();
        });
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  document.addEventListener('submit', async function (e) {
    var f = e.target.closest('.js-delete-chef');
    if (!f) return;
    e.preventDefault();
    if (!(await api.confirm('Supprimer ce chef d\'établissement ?'))) return;
    var id = f.getAttribute('data-id');
    try {
      await api.withBusy(f.querySelector('button'), async function () {
        var result = await api.post('/Home/DeleteChefJson', { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });
})();
