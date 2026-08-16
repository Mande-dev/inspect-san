(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('ordresFilter');
  var tbody = document.getElementById('ordresTbody');
  var table = tbody && tbody.closest('table');
  var form = document.getElementById('ordreForm');
  var canSigner = table && table.getAttribute('data-can-signer') === '1';
  var canGerer = table && table.getAttribute('data-can-gerer') === '1';
  var equipeSelect = document.getElementById('ordreEquipe');
  var equipeMap = {};
  if (equipeSelect) {
    Array.from(equipeSelect.options).forEach(function (opt) {
      if (opt.value) equipeMap[opt.value] = opt.textContent.trim();
    });
  }

  function d(v) {
    if (!v) return '';
    return String(v).substring(0, 10);
  }
  function fmtDate(v) {
    if (!v) return '—';
    var s = String(v).substring(0, 10);
    var p = s.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : s;
  }

  function rowHtml(o) {
    var id = o.id || o.Id || '';
    var numero = o.numero || o.Numero || '';
    var ecoleId = o.ecoleId || o.EcoleId || '';
    var ecoleNom = o.ecoleNom || o.EcoleNom || '—';
    var equipeId = o.equipeId || o.EquipeId || '';
    var equipeNom = o.equipeNom || o.EquipeNom || equipeMap[equipeId] || equipeId || '—';
    var statut = o.statut || o.Statut || '';
    var payload = {
      Id: id,
      Numero: numero,
      EcoleId: ecoleId,
      EquipeId: equipeId,
      Statut: statut,
      DateEmission: o.dateEmission || o.DateEmission,
      DebutValidite: o.debutValidite || o.DebutValidite,
      FinValidite: o.finValidite || o.FinValidite,
      Objet: o.objet || o.Objet || ''
    };
    var json = api.attr(JSON.stringify(payload));
    var ecoleJson = api.attr(JSON.stringify({ Id: ecoleId, Denomination: ecoleNom }));
    var signer =
      canSigner && (statut === 'brouillon' || statut === 'en_attente_signature')
        ? '<form class="d-inline js-signer-ordre" data-id="' +
          api.attr(id) +
          '"><button type="submit" class="btn btn-sm btn-outline-success" title="Signer"><i class="ti ti-signature"></i></button></form> '
        : '';
    var edit = canGerer
      ? '<button type="button" class="btn btn-sm btn-outline-primary ordre-edit" data-json="' +
        json +
        '" data-bs-toggle="modal" data-bs-target="#ordreModal"><i class="ti ti-edit"></i></button> '
      : '';
    var del = canGerer
      ? '<form class="d-inline js-delete-ordre" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>'
      : '';
    return (
      '<tr><td class="fw-semibold">' +
      api.esc(numero) +
      '</td><td>' +
      api.esc(ecoleNom) +
      '</td><td>' +
      api.esc(equipeNom) +
      '</td><td class="small">' +
      fmtDate(payload.DebutValidite) +
      ' – ' +
      fmtDate(payload.FinValidite) +
      '</td><td><span class="badge bg-secondary-subtle text-dark">' +
      api.esc(statut.replace(/_/g, ' ')) +
      '</span></td><td class="text-end text-nowrap">' +
      edit +
      signer +
      '<button type="button" class="btn btn-sm btn-outline-secondary print-btn" data-title="Ordre ' +
      api.attr(numero) +
      '" data-json="' +
      json +
      '" data-ecole="' +
      ecoleJson +
      '" data-controleurs="' +
      api.attr(equipeNom) +
      '" data-signataire=""><i class="ti ti-printer"></i></button> ' +
      del +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var list = await api.get('/Home/GetOrdres', { q: fd.get('q') || '', statut: fd.get('statut') || '' });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  function setNumeroDisplay(numero) {
    var wrap = document.getElementById('ordreNumeroWrap');
    var display = document.getElementById('ordreNumeroDisplay');
    if (!wrap || !display) return;
    if (numero) {
      display.textContent = numero;
      wrap.classList.remove('d-none');
    } else {
      display.textContent = '—';
      wrap.classList.add('d-none');
    }
  }

  function fillOrdre(o) {
    document.getElementById('ordreTitle').textContent = "Modifier l'ordre";
    document.getElementById('ordreId').value = o.Id || o.id || '';
    setNumeroDisplay(o.Numero || o.numero || '');
    document.getElementById('ordreEcole').value = o.EcoleId || o.ecoleId || '';
    document.getElementById('ordreStatut').value = o.Statut || o.statut || 'brouillon';
    document.getElementById('ordreEmission').value = d(o.DateEmission || o.dateEmission);
    document.getElementById('ordreDebut').value = d(o.DebutValidite || o.debutValidite);
    document.getElementById('ordreFin').value = d(o.FinValidite || o.finValidite);
    if (equipeSelect) equipeSelect.value = o.EquipeId || o.equipeId || '';
  }

  document.getElementById('newOrdre')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('ordreId').value = '';
    document.getElementById('ordreTitle').textContent = 'Nouvel ordre';
    setNumeroDisplay('');
  });

  document.addEventListener('click', function (e) {
    var edit = e.target.closest('.ordre-edit');
    if (edit) {
      var o = api.parseJsonAttr(edit, 'json');
      if (o) fillOrdre(o);
    }
    var print = e.target.closest('.print-btn');
    if (print) {
      var o = api.parseJsonAttr(print, 'json') || {};
      var ecole = api.parseJsonAttr(print, 'ecole');
      var html = window.buildOrdrePrintHtml
        ? window.buildOrdrePrintHtml(o, ecole, print.dataset.controleurs, print.dataset.signataire)
        : null;
      if (window.openPrintPreview) window.openPrintPreview(print.dataset.title || 'Ordre', html);
      else window.print();
    }
  });

  document.getElementById('ordreModal')?.addEventListener('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    var edit = trigger.closest('.ordre-edit');
    if (!edit) return;
    var o = api.parseJsonAttr(edit, 'json');
    if (o) fillOrdre(o);
  });

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    loadList().catch(function (err) { api.showToast(err.message, 'danger'); });
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          id: document.getElementById('ordreId').value || null,
          statut: document.getElementById('ordreStatut').value,
          ecoleId: document.getElementById('ordreEcole').value,
          equipeId: equipeSelect ? equipeSelect.value : '',
          dateEmission: document.getElementById('ordreEmission').value || null,
          debutValidite: document.getElementById('ordreDebut').value || null,
          finValidite: document.getElementById('ordreFin').value || null
        };
        var result = await api.post('/Home/SaveOrdreJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('ordreModal'));
          loadList();
        });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('submit', async function (e) {
    var signer = e.target.closest('.js-signer-ordre');
    var del = e.target.closest('.js-delete-ordre');
    if (!signer && !del) return;
    e.preventDefault();
    if (del && !(await api.confirm('Supprimer cet ordre ?'))) return;
    var id = (signer || del).getAttribute('data-id');
    var url = signer ? '/Home/SignerOrdreJson' : '/Home/DeleteOrdreJson';
    try {
      await api.withBusy((signer || del).querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });
})();
