(function () {
  'use strict';
  if (!window.api) return;

  var tbody = document.querySelector('#rapportsTable tbody');
  var table = document.getElementById('rapportsTable');
  var form = document.getElementById('rapportForm');
  var canCreer = table && table.getAttribute('data-can-creer') === '1';

  function updateEcole() {
    var first = document.querySelector('.fiche-check:checked');
    document.getElementById('rapportEcole').value = first ? first.dataset.ecole : '';
    var nums = Array.from(document.querySelectorAll('.fiche-check:checked')).map(function (x) {
      return x.nextElementSibling ? x.nextElementSibling.textContent.trim() : x.value;
    });
    if (nums.length && !document.getElementById('rapportSynthese').value.trim()) {
      var ids = Array.from(document.querySelectorAll('.fiche-check:checked')).map(function (x) { return x.value; });
      api.post('/Home/BuildSyntheseJson', { ficheIds: ids }).then(function (r) {
        var s = (r && (r.synthese || r.Synthese)) || '';
        if (s && !document.getElementById('rapportSynthese').value.trim())
          document.getElementById('rapportSynthese').value = s;
      }).catch(function () {
        document.getElementById('rapportSynthese').value = 'Synthèse basée sur : ' + nums.join(' ; ');
      });
    }
  }

  function setReadonly(ro) {
    document.querySelectorAll('.fiche-check').forEach(function (c) { c.disabled = ro; });
    document.getElementById('rapportSynthese').readOnly = ro;
    document.getElementById('rapportSave').style.display = ro ? 'none' : '';
  }

  function fillRapport(btn) {
    var el = btn.closest ? btn.closest('.btn-voir-rapport, .btn-edit-rapport') || btn : btn;
    var ids = api.parseJsonAttr(el, 'fiches') || [];
    document.getElementById('rapportId').value = api.dataAttr(el, 'id') || '';
    document.getElementById('rapportEcole').value = api.dataAttr(el, 'ecole') || '';
    document.getElementById('rapportStatut').value = api.dataAttr(el, 'statut') || 'brouillon';
    document.getElementById('rapportSynthese').value = api.dataAttr(el, 'synthese') || '';
    document.querySelectorAll('.fiche-check').forEach(function (c) {
      c.checked = ids.indexOf(c.value) >= 0;
    });
    var statut = api.dataAttr(el, 'statut');
    var ro = api.dataAttr(el, 'readonly') === '1' || (statut && statut !== 'brouillon');
    document.getElementById('rapportTitle').textContent = ro ? 'Voir le rapport' : 'Modifier le rapport';
    setReadonly(ro);
  }

  function rowHtml(r) {
    var id = r.id || r.Id || '';
    var numero = r.numero || r.Numero || '';
    var ecoleId = r.ecoleId || r.EcoleId || '';
    var ecoleNom = r.ecoleNom || r.EcoleNom || '—';
    var synthese = r.synthese || r.Synthese || '';
    var statut = r.statut || r.Statut || '';
    var ficheIds = r.ficheIds || r.FicheIds || [];
    var fichesAttr = api.attr(JSON.stringify(ficheIds));
    var payload = { Id: id, Numero: numero, EcoleId: ecoleId, Synthese: synthese, Statut: statut, FicheIds: ficheIds };
    var json = api.attr(JSON.stringify(payload));
    var ecoleJson = api.attr(JSON.stringify({ Id: ecoleId, Denomination: ecoleNom }));
    var peutDeposer = r.peutDeposer !== undefined ? !!r.peutDeposer : !!r.PeutDeposer;
    if (r.peutDeposer === undefined && r.PeutDeposer === undefined) {
      peutDeposer = statut === 'brouillon' && canCreer && ficheIds.length > 0;
    }
    var actions =
      '<button type="button" class="btn btn-sm btn-outline-secondary btn-voir-rapport" data-id="' +
      api.attr(id) +
      '" data-ecole="' + api.attr(ecoleId) +
      '" data-statut="' + api.attr(statut) +
      '" data-synthese="' + api.attr(synthese) +
      '" data-fiches="' + fichesAttr +
      '" data-readonly="1" data-bs-toggle="modal" data-bs-target="#rapportModal" title="Voir"><i class="ti ti-eye"></i></button> ';
    if (canCreer && statut === 'brouillon') {
      actions +=
        '<button type="button" class="btn btn-sm btn-outline-primary btn-edit-rapport" data-id="' +
        api.attr(id) +
        '" data-ecole="' + api.attr(ecoleId) +
        '" data-statut="' + api.attr(statut) +
        '" data-synthese="' + api.attr(synthese) +
        '" data-fiches="' + fichesAttr +
        '" data-readonly="0" data-bs-toggle="modal" data-bs-target="#rapportModal" title="Modifier"><i class="ti ti-edit"></i></button> ';
      if (peutDeposer) {
        actions +=
          '<form class="d-inline js-deposer-rapport" data-id="' + api.attr(id) +
          '"><button type="submit" class="btn btn-sm btn-outline-primary" title="Déposer"><i class="ti ti-send"></i></button></form> ';
      }
      actions +=
        '<form class="d-inline js-delete-rapport" data-id="' + api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>';
    }
    actions +=
      '<button type="button" class="btn btn-sm btn-outline-secondary print-btn" data-title="Rapport ' +
      api.attr(numero) +
      '" data-json="' + json +
      '" data-ecole="' + ecoleJson +
      '" data-fiches-lite="[]"><i class="ti ti-printer"></i></button> ';
    return (
      '<tr data-statut="' + api.attr(statut) +
      '"><td class="fw-semibold">' + api.esc(numero) +
      '</td><td>' + api.esc(ecoleNom) +
      '</td><td class="small text-truncate" style="max-width:280px">' +
      api.esc(synthese || '—') +
      '</td><td><span class="badge bg-secondary-subtle text-dark">' +
      api.esc(statut) +
      '</span></td><td class="text-end text-nowrap">' +
      actions +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody) return;
    var list = await api.get('/Home/GetRapports');
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  document.querySelectorAll('.fiche-check').forEach(function (c) {
    c.addEventListener('change', updateEcole);
  });

  document.getElementById('newRapport')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('rapportId').value = '';
    document.getElementById('rapportStatut').value = 'brouillon';
    document.getElementById('rapportTitle').textContent = 'Nouveau rapport';
    document.querySelectorAll('.fiche-check').forEach(function (c) { c.checked = false; });
    setReadonly(false);
  });

  document.addEventListener('click', function (e) {
    var fill = e.target.closest('.btn-voir-rapport, .btn-edit-rapport');
    if (fill) fillRapport(fill);
    var print = e.target.closest('#rapportsTable .print-btn');
    if (print) {
      var r = api.parseJsonAttr(print, 'json') || {};
      var ecole = api.parseJsonAttr(print, 'ecole');
      var lite = api.parseJsonAttr(print, 'fiches-lite') || [];
      var rows = (lite || []).map(function (f) {
        return '<tr><td>' + (f.Numero || f.numero || '') + '</td><td>' + (f.Recommandation || f.recommandation || '—') + '</td></tr>';
      }).join('');
      var html = window.buildRapportPrintHtml ? window.buildRapportPrintHtml(r, ecole, rows) : null;
      if (window.openPrintPreview) window.openPrintPreview(print.dataset.title || 'Rapport', html);
    }
  });

  document.getElementById('rapportModal')?.addEventListener('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    var fill = trigger.closest('.btn-voir-rapport, .btn-edit-rapport');
    if (fill) fillRapport(fill);
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.querySelectorAll('.fiche-check').forEach(function (c) { c.disabled = false; });
    var btn = document.getElementById('rapportSave');
    try {
      await api.withBusy(btn, async function () {
        var ficheIds = Array.from(document.querySelectorAll('.fiche-check:checked')).map(function (x) { return x.value; });
        var body = {
          id: document.getElementById('rapportId').value || null,
          ecoleId: document.getElementById('rapportEcole').value,
          statut: document.getElementById('rapportStatut').value,
          synthese: document.getElementById('rapportSynthese').value,
          ficheIds: ficheIds
        };
        var result = await api.post('/Home/SaveRapportJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('rapportModal'));
          loadList();
        });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('submit', async function (e) {
    var dep = e.target.closest('.js-deposer-rapport');
    var del = e.target.closest('.js-delete-rapport');
    if (!dep && !del) return;
    e.preventDefault();
    if (del && !(await api.confirm('Supprimer ?'))) return;
    var id = (dep || del).getAttribute('data-id');
    var url = dep ? '/Home/DeposerRapportJson' : '/Home/DeleteRapportJson';
    try {
      await api.withBusy((dep || del).querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.querySelectorAll('form[action*="DeposerRapport"]').forEach(function (f) {
    f.classList.add('js-deposer-rapport');
    f.setAttribute('data-id', f.querySelector('input[name=id]')?.value || '');
  });
  document.querySelectorAll('form[action*="DeleteRapport"]').forEach(function (f) {
    f.classList.add('js-delete-rapport');
    f.setAttribute('data-id', f.querySelector('input[name=id]')?.value || '');
  });
})();
