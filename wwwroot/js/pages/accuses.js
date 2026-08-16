(function () {
  'use strict';
  if (!window.api) return;

  var tbody = document.getElementById('accusesTbody');
  var table = document.getElementById('accusesTable');
  var search = document.getElementById('accuseSearch');
  var statut = document.getElementById('accuseStatut');

  function rowHtml(r) {
    var id = r.id || r.Id || '';
    var numero = r.numero || r.Numero || '';
    var ecoleNom = r.ecoleNom || r.EcoleNom || '—';
    var st = r.statut || r.Statut || '';
    var searchStr = (numero + ' ' + ecoleNom).toLowerCase();
    var actions = '';
    if (st === 'depose') {
      actions +=
        '<form class="d-inline js-accuser" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-primary"><i class="ti ti-mail-check me-1"></i>Accuser</button></form> ';
    }
    if (st === 'accuse') {
      actions +=
        '<form class="d-inline js-transmettre" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-success"><i class="ti ti-send me-1"></i>Transmettre DP</button></form>';
    }
    return (
      '<tr data-statut="' +
      api.attr(st) +
      '" data-search="' +
      api.attr(searchStr) +
      '"><td class="fw-semibold">' +
      api.esc(numero) +
      '</td><td>' +
      api.esc(ecoleNom) +
      '</td><td><span class="badge bg-secondary-subtle text-dark">' +
      api.esc(st) +
      '</span></td><td class="text-end text-nowrap">' +
      actions +
      '</td></tr>'
    );
  }

  function applyClientFilter() {
    var q = (search.value || '').toLowerCase().trim();
    var st = statut.value;
    document.querySelectorAll('#accusesTable tbody tr').forEach(function (tr) {
      if (tr.classList.contains('js-pagination-empty')) return;
      var okQ = !q || (tr.dataset.search || '').indexOf(q) >= 0;
      var okS = !st || tr.dataset.statut === st;
      tr.setAttribute('data-filtered-out', okQ && okS ? '0' : '1');
    });
    api.refreshPagination(table);
  }

  async function loadList() {
    if (!tbody) return;
    var list = await api.get('/Home/GetAccuses', {
      q: search.value || '',
      statut: statut.value || ''
    });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
    applyClientFilter();
  }

  search?.addEventListener('input', function () {
    // Prefer server filter when typing settles — here client filter on current rows
    applyClientFilter();
  });
  statut?.addEventListener('change', function () {
    loadList().catch(function (err) { api.showToast(err.message, 'danger'); });
  });

  document.addEventListener('submit', async function (e) {
    var acc = e.target.closest('.js-accuser');
    var trn = e.target.closest('.js-transmettre');
    if (!acc && !trn) return;
    e.preventDefault();
    var id = (acc || trn).getAttribute('data-id');
    var url = acc ? '/Home/AccuserJson' : '/Home/TransmettreJson';
    try {
      await api.withBusy((acc || trn).querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  // Convert initial server forms to ajax classes
  document.querySelectorAll('#accusesTable form[action*="Accuser"]').forEach(function (f) {
    f.classList.add('js-accuser');
    var id = f.querySelector('input[name=id]')?.value;
    if (id) f.setAttribute('data-id', id);
  });
  document.querySelectorAll('#accusesTable form[action*="Transmettre"]').forEach(function (f) {
    f.classList.add('js-transmettre');
    var id = f.querySelector('input[name=id]')?.value;
    if (id) f.setAttribute('data-id', id);
  });
})();
