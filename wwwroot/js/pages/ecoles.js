(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('ecolesFilter');
  var tbody = document.getElementById('ecolesTbody');
  var table = tbody && tbody.closest('table');
  var canGerer = table && table.getAttribute('data-can-gerer') === '1';
  var suggestBox = document.getElementById('suggestDeactivateBox');
  var modalForm = document.querySelector('#ecoleModal form');
  var docs = [];
  var readonly = false;

  function statutBadge(s) {
    if (s === 'active')
      return '<span class="badge bg-success-subtle text-success-emphasis">Active</span>';
    return '<span class="badge bg-warning-subtle text-warning-emphasis">Fermeture temp.</span>';
  }

  function renderDocs() {
    $('#documentsJson').val(JSON.stringify(docs));
    $('#docList').html(
      docs
        .map(function (d, i) {
          return (
            '<li class="list-group-item d-flex justify-content-between align-items-center py-2 px-0">' +
            '<span>' +
            api.esc(d.Nom || d.nom || '') +
            ' <small class="text-secondary">(' +
            api.esc(d.Taille || d.taille || '') +
            ')</small></span>' +
            (readonly
              ? ''
              : '<button type="button" class="btn btn-sm btn-outline-danger" data-i="' +
                i +
                '"><i class="ti ti-x"></i></button>') +
            '</li>'
          );
        })
        .join('') || '<li class="list-group-item px-0 text-secondary">Aucun document</li>'
    );
  }

  function setReadonly(ro) {
    readonly = ro;
    $('#ecoleModal').find('input, select, textarea').not('[type=hidden]').prop('disabled', ro);
    $('#docFileInput').toggle(!ro);
    $('#ecoleSave').toggle(!ro);
  }

  function fillFromBtn(btn, ro) {
    var el = btn && btn.closest ? btn.closest('.btn-voir-ecole, .btn-edit-ecole') || btn : btn;
    $('#formId').val(api.dataAttr(el, 'id'));
    $('#formDenomination').val(api.dataAttr(el, 'denomination'));
    $('#formRegime').val(api.dataAttr(el, 'regime'));
    $('#formDinacope').val(api.dataAttr(el, 'dinacope'));
    $('#formAgrement').val(api.dataAttr(el, 'agrement') || '');
    $('#formNotif').val(api.dataAttr(el, 'notif') || '');
    $('#formCommune').val(api.dataAttr(el, 'commune'));
    $('#formQuartier').val(api.dataAttr(el, 'quartier'));
    $('#formAvenue').val(api.dataAttr(el, 'avenue'));
    $('#formNumero').val(api.dataAttr(el, 'numero'));
    $('#formStatut').val(api.dataAttr(el, 'statut') || 'active');
    docs = api.parseJsonAttr(el, 'docs') || [];
    if (!Array.isArray(docs)) docs = [];
    setReadonly(!!ro);
    renderDocs();
    $('#ecoleModalTitle').text(ro ? "Voir l'école" : "Modifier l'école");
  }

  function rowHtml(e) {
    var docsJson = api.attr(JSON.stringify(e.documents || e.Documents || []));
    var id = e.id || e.Id || '';
    var den = e.denomination || e.Denomination || '';
    var regime = e.regimeId || e.RegimeId || e.regime || e.Regime || '';
    var din = e.idDinacope || e.IdDinacope || '';
    var agr = e.numAgrement || e.NumAgrement || '';
    var notif = e.numNotification || e.NumNotification || '';
    var com = e.communeId || e.CommuneId || e.commune || e.Commune || '';
    var regimeLabel = e.regime || e.Regime || regime;
    var comLabel = e.commune || e.Commune || com;
    var quar = e.quartier || e.Quartier || '';
    var av = e.avenue || e.Avenue || '';
    var num = e.numero || e.Numero || '';
    var st = e.statut || e.Statut || '';
    var dataAttrs =
      ' data-id="' +
      api.attr(id) +
      '" data-denomination="' +
      api.attr(den) +
      '" data-regime="' +
      api.attr(regime) +
      '" data-dinacope="' +
      api.attr(din) +
      '" data-agrement="' +
      api.attr(agr) +
      '" data-notif="' +
      api.attr(notif) +
      '" data-commune="' +
      api.attr(com) +
      '" data-quartier="' +
      api.attr(quar) +
      '" data-avenue="' +
      api.attr(av) +
      '" data-numero="' +
      api.attr(num) +
      '" data-statut="' +
      api.attr(st) +
      '" data-docs="' +
      docsJson +
      '"';
    return (
      '<tr>' +
      '<td class="fw-semibold">' +
      api.esc(den) +
      '</td>' +
      '<td>' +
      api.esc(din) +
      '</td>' +
      '<td>' +
      api.esc(regimeLabel) +
      '</td>' +
      '<td>' +
      api.esc(comLabel) +
      '</td>' +
      '<td>' +
      statutBadge(st) +
      '</td>' +
      '<td class="text-end text-nowrap">' +
      '<button type="button" class="btn btn-sm btn-outline-secondary btn-voir-ecole"' +
      dataAttrs +
      ' data-readonly="1" data-bs-toggle="modal" data-bs-target="#ecoleModal" title="Voir"><i class="ti ti-eye"></i></button>' +
      (canGerer
        ? ' <button type="button" class="btn btn-sm btn-outline-primary btn-edit-ecole"' +
          dataAttrs +
          ' data-readonly="0" data-bs-toggle="modal" data-bs-target="#ecoleModal" title="Modifier"><i class="ti ti-edit"></i></button> ' +
          '<form class="d-inline js-delete-ecole" data-id="' +
          api.attr(id) +
          '">' +
          '<button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>'
        : '') +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var params = {
      q: fd.get('q') || '',
      commune: fd.get('commune') || '',
      regime: fd.get('regime') || '',
      statut: fd.get('statut') || ''
    };
    var list = await api.get('/Home/GetEcoles', params);
    tbody.innerHTML = (list || []).map(rowHtml).join('') || '';
    api.refreshPagination(table);
  }

  function showSuggest(id) {
    if (!suggestBox) return;
    suggestBox.classList.remove('d-none');
    suggestBox.querySelector('[data-ecole-id]').setAttribute('data-ecole-id', id);
  }

  function hideSuggest() {
    if (suggestBox) suggestBox.classList.add('d-none');
  }

  var pendingDocFiles = [];

  // docs UI
  $('#docList').on('click', 'button[data-i]', function () {
    if (readonly) return;
    var i = +$(this).data('i');
    docs.splice(i, 1);
    if (i < pendingDocFiles.length) pendingDocFiles.splice(i, 1);
    renderDocs();
  });
  $('#docFileInput').on('change', function () {
    Array.from(this.files).forEach(function (f) {
      pendingDocFiles.push(f);
      docs.push({
        Nom: f.name,
        Taille: Math.max(1, Math.round(f.size / 1024)) + ' Ko',
        Date: new Date().toISOString(),
        Url: ''
      });
    });
    this.value = '';
    renderDocs();
  });

  $('#btnNewEcole').on('click', function () {
    if (!canGerer) return;
    $('#ecoleModalTitle').text('Nouvelle école');
    $('#formId').val('');
    if (modalForm) modalForm.reset();
    docs = [];
    pendingDocFiles = [];
    setReadonly(false);
    renderDocs();
  });

  // Peuplement fiable à l'ouverture de la modale (relatedTarget = bouton cliqué, y compris via icône)
  $('#ecoleModal').on('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    var btn = trigger.closest ? trigger.closest('.btn-voir-ecole, .btn-edit-ecole') : null;
    if (!btn) return;
    var ro = btn.classList.contains('btn-voir-ecole') || api.dataAttr(btn, 'readonly') === '1';
    fillFromBtn(btn, ro);
  });

  $(document).on('click', '.btn-edit-ecole', function () {
    fillFromBtn(this, false);
  });
  $(document).on('click', '.btn-voir-ecole', function () {
    fillFromBtn(this, true);
  });

  if (filterForm) {
    filterForm.addEventListener('submit', function (e) {
      e.preventDefault();
      loadList().catch(function (err) {
        api.showToast(err.message || 'Erreur chargement', 'danger');
      });
    });
  }

  if (modalForm) {
    modalForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!canGerer || readonly) return;
      $('#ecoleModal').find('input, select, textarea').prop('disabled', false);
      var btn = document.getElementById('ecoleSave');
      await api.withBusy(btn, async function () {
        var body = {
          id: $('#formId').val() || null,
          denomination: $('#formDenomination').val(),
          statut: $('#formStatut').val(),
          regimeId: $('#formRegime').val(),
          idDinacope: $('#formDinacope').val(),
          numAgrement: $('#formAgrement').val(),
          numNotification: $('#formNotif').val(),
          communeId: $('#formCommune').val(),
          quartier: $('#formQuartier').val(),
          avenue: $('#formAvenue').val(),
          numero: $('#formNumero').val(),
          documentsJson: $('#documentsJson').val()
        };
        var result = await api.post('/Home/SaveEcoleJson', body);
        if (api.bindAjaxResult(result, function () {
          /* continue uploads below */
        })) {
          var ecoleId = (result.data && (result.data.id || result.data.Id)) || body.id;
          // Si création, recharger pour obtenir l'id ; fallback : chercher dans la liste
          if (!ecoleId && pendingDocFiles.length) {
            await loadList();
          }
          if (ecoleId && pendingDocFiles.length) {
            for (var i = 0; i < pendingDocFiles.length; i++) {
              var fd = new FormData();
              fd.append('ecoleId', ecoleId);
              fd.append('file', pendingDocFiles[i]);
              await fetch('/Home/UploadEcoleDocument', { method: 'POST', body: fd, credentials: 'same-origin' });
            }
            pendingDocFiles = [];
          }
          api.hideModal(document.getElementById('ecoleModal'));
          hideSuggest();
          loadList();
        }
      }).catch(function (err) {
        api.showToast(err.message || 'Erreur', 'danger');
      });
    });
  }

  $(document).on('submit', '.js-delete-ecole', async function (e) {
    e.preventDefault();
    if (!canGerer) return;
    if (!(await api.confirm('Supprimer cette école ?'))) return;
    var id = this.getAttribute('data-id');
    var btn = this.querySelector('button');
    try {
      await api.withBusy(btn, async function () {
        var result = await api.post('/Home/DeleteEcoleJson', { id: id });
        var ok = result.success !== undefined ? result.success : result.Success;
        var suggest = result.suggestDeactivate !== undefined ? result.suggestDeactivate : result.SuggestDeactivate;
        var msg = result.message || result.Message || '';
        if (ok) {
          api.showToast(msg, 'success');
          hideSuggest();
          await loadList();
        } else {
          api.showToast(msg, suggest ? 'warning' : 'danger');
          if (suggest) showSuggest(id);
        }
      });
    } catch (err) {
      api.showToast(err.message || 'Erreur', 'danger');
    }
  });

  if (suggestBox) {
    suggestBox.querySelector('.js-deactivate-ecole')?.addEventListener('click', async function () {
      var id = this.getAttribute('data-ecole-id');
      try {
        await api.withBusy(this, async function () {
          var result = await api.post('/Home/DeactivateEcoleJson', { id: id });
          api.bindAjaxResult(result, function () {
            hideSuggest();
            loadList();
          });
        });
      } catch (err) {
        api.showToast(err.message || 'Erreur', 'danger');
      }
    });
  }

  // Initial server-rendered rows already OK; optional refresh keeps AJAX path warm
  // Rebind nothing needed for initial — event delegation covers it
})();
