(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('chefsFilter');
  var tbody = document.getElementById('chefsTbody');
  var table = tbody && tbody.closest('table');
  var form = document.getElementById('chefForm');
  var fields = ['chefNom', 'chefDinacope', 'chefTel', 'chefEcole', 'chefAncEns', 'chefAncChef', 'chefAncEcole'];

  function rowHtml(c) {
    var id = c.id || c.Id || '';
    var payload = {
      Id: id,
      NomComplet: c.nomComplet || c.NomComplet || '',
      IdDinacope: c.idDinacope || c.IdDinacope || '',
      Telephone: c.telephone || c.Telephone || '',
      EcoleId: c.ecoleId || c.EcoleId || '',
      AncienneteEnseignement: c.ancienneteEnseignement ?? c.AncienneteEnseignement ?? null,
      AncienneteChef: c.ancienneteChef ?? c.AncienneteChef ?? null,
      AncienneteEcole: c.ancienneteEcole ?? c.AncienneteEcole ?? null
    };
    var json = api.attr(JSON.stringify(payload));
    var ens = payload.AncienneteEnseignement ?? 0;
    var ch = payload.AncienneteChef ?? 0;
    var ec = payload.AncienneteEcole ?? 0;
    return (
      '<tr>' +
      '<td class="fw-semibold">' +
      api.esc(payload.NomComplet) +
      '</td>' +
      '<td>' +
      api.esc(payload.IdDinacope) +
      '</td>' +
      '<td>' +
      api.esc(payload.Telephone) +
      '</td>' +
      '<td>' +
      api.esc(c.ecoleNom || c.EcoleNom || '—') +
      '</td>' +
      '<td class="small">Ens. ' +
      ens +
      ' · Chef ' +
      ch +
      ' · École ' +
      ec +
      '</td>' +
      '<td class="text-end text-nowrap">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary chef-open" data-mode="view" data-json="' +
      json +
      '" data-bs-toggle="modal" data-bs-target="#chefModal"><i class="ti ti-eye"></i></button> ' +
      '<button type="button" class="btn btn-sm btn-outline-primary chef-open" data-mode="edit" data-json="' +
      json +
      '" data-bs-toggle="modal" data-bs-target="#chefModal"><i class="ti ti-edit"></i></button> ' +
      '<form class="d-inline js-delete-chef" data-id="' +
      api.attr(id) +
      '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>' +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var list = await api.get('/Home/GetChefs', {
      q: fd.get('q') || '',
      ecoleId: fd.get('ecoleId') || ''
    });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  function openChef(btn) {
    var el = btn && btn.closest ? btn.closest('.chef-open') || btn : btn;
    var c = api.parseJsonAttr(el, 'json') || {};
    var viewing = (el.dataset.mode || api.dataAttr(el, 'mode')) === 'view';
    document.getElementById('chefId').value = c.Id || c.id || '';
    document.getElementById('chefNom').value = c.NomComplet || c.nomComplet || '';
    document.getElementById('chefDinacope').value = c.IdDinacope || c.idDinacope || '';
    document.getElementById('chefTel').value = c.Telephone || c.telephone || '';
    document.getElementById('chefEcole').value = c.EcoleId || c.ecoleId || '';
    document.getElementById('chefAncEns').value = c.AncienneteEnseignement ?? c.ancienneteEnseignement ?? '';
    document.getElementById('chefAncChef').value = c.AncienneteChef ?? c.ancienneteChef ?? '';
    document.getElementById('chefAncEcole').value = c.AncienneteEcole ?? c.ancienneteEcole ?? '';
    document.getElementById('chefModalTitle').textContent = viewing ? 'Détail du chef' : 'Modifier le chef';
    document.getElementById('chefSave').classList.toggle('d-none', viewing);
    fields.forEach(function (id) {
      document.getElementById(id).disabled = viewing;
    });
  }

  document.getElementById('newChef')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('chefId').value = '';
    document.getElementById('chefModalTitle').textContent = 'Nouveau chef';
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
        var body = {
          id: document.getElementById('chefId').value || null,
          nomComplet: document.getElementById('chefNom').value,
          idDinacope: document.getElementById('chefDinacope').value,
          telephone: document.getElementById('chefTel').value,
          ecoleId: document.getElementById('chefEcole').value,
          ancienneteEnseignement: document.getElementById('chefAncEns').value
            ? +document.getElementById('chefAncEns').value
            : null,
          ancienneteChef: document.getElementById('chefAncChef').value
            ? +document.getElementById('chefAncChef').value
            : null,
          ancienneteEcole: document.getElementById('chefAncEcole').value
            ? +document.getElementById('chefAncEcole').value
            : null
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
    if (!(await api.confirm('Supprimer ce chef ?'))) return;
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
