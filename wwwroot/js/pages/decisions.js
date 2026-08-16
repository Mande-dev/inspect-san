(function () {
  'use strict';
  if (!window.api) return;

  var tbody = document.getElementById('decisionsTbody');
  var table = document.getElementById('decisionsTable') || (tbody && tbody.closest('table'));
  var form = document.getElementById('decisionForm');
  var rapport = document.getElementById('decRapport');
  var ecole = document.getElementById('decEcole');
  var ecoleLabel = document.getElementById('decEcoleLabel');
  var alertBox = document.getElementById('sansDecisionAlert');
  var canCreer = table && table.getAttribute('data-can-creer') === '1';

  function syncEcoleFromRapport() {
    var o = rapport && rapport.selectedOptions[0];
    if (!o || !o.value) {
      if (ecole) ecole.value = '';
      if (ecoleLabel) ecoleLabel.value = '';
      return;
    }
    if (ecole) ecole.value = o.dataset.ecole || '';
    if (ecoleLabel) ecoleLabel.value = o.dataset.ecoleNom || o.dataset.ecole || '—';
  }

  function filterRapportOptions(modeEdit) {
    if (!rapport) return;
    Array.from(rapport.options).forEach(function (opt) {
      if (!opt.value) {
        opt.hidden = false;
        return;
      }
      var eligible = opt.dataset.eligible === '1';
      // Création : seulement éligibles ; édition : tout (rapport courant inclus)
      opt.hidden = modeEdit ? false : !eligible;
    });
  }

  function ensureRapportOption(rapportId, ecoleId, ecoleNom, numero) {
    if (!rapport || !rapportId) return;
    var exists = Array.from(rapport.options).some(function (o) { return o.value === rapportId; });
    if (exists) return;
    var opt = document.createElement('option');
    opt.value = rapportId;
    opt.dataset.ecole = ecoleId || '';
    opt.dataset.ecoleNom = ecoleNom || '';
    opt.dataset.eligible = '0';
    opt.textContent = (numero || rapportId) + (ecoleNom ? ' — ' + ecoleNom : '');
    rapport.appendChild(opt);
  }

  rapport?.addEventListener('change', syncEcoleFromRapport);

  function setReadonly(ro, lockRapport) {
    ['decRapport', 'decType', 'decDelai', 'decExec', 'decCommentaire'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = ro || (id === 'decRapport' && lockRapport);
    });
    if (ecoleLabel) ecoleLabel.readOnly = true;
    document.getElementById('decisionSave').style.display = ro ? 'none' : '';
  }

  function fillDecision(btn) {
    var el = btn.closest ? btn.closest('.btn-voir-decision, .btn-edit-decision') || btn : btn;
    var rapportId = api.dataAttr(el, 'rapport') || '';
    var ecoleId = api.dataAttr(el, 'ecole') || '';
    var ecoleNom = api.dataAttr(el, 'ecole-nom') || '';
    ensureRapportOption(rapportId, ecoleId, ecoleNom, rapportId);
    filterRapportOptions(true);
    document.getElementById('decId').value = api.dataAttr(el, 'id') || '';
    rapport.value = rapportId;
    if (ecole) ecole.value = ecoleId;
    if (ecoleLabel) ecoleLabel.value = ecoleNom || ecoleId || '—';
    document.getElementById('decType').value = api.dataAttr(el, 'type') || '';
    document.getElementById('decDelai').value = api.dataAttr(el, 'delai') || '';
    document.getElementById('decExec').value = api.dataAttr(el, 'exec') || 'en_attente';
    document.getElementById('decCommentaire').value = api.dataAttr(el, 'commentaire') || '';
    var ro = api.dataAttr(el, 'readonly') === '1';
    document.getElementById('decisionTitle').textContent = ro ? 'Voir la décision' : 'Modifier la décision';
    setReadonly(ro, !ro); // en édition : rapport verrouillé
  }

  function rowHtml(d) {
    var id = d.id || d.Id || '';
    var numero = d.numero || d.Numero || id;
    var typeLabel = d.type || d.Type || '';
    var typeId = d.typeDecisionId || d.TypeDecisionId || '';
    var ecoleNom = d.ecoleNom || d.EcoleNom || '—';
    var ecoleId = d.ecoleId || d.EcoleId || '';
    var rapportId = d.rapportId || d.RapportId || '';
    var delai = d.delaiExecution || d.DelaiExecution || '';
    var exec = d.statutExecution || d.StatutExecution || '';
    var commentaire = d.commentaire || d.Commentaire || '';
    var data =
      ' data-id="' + api.attr(id) +
      '" data-rapport="' + api.attr(rapportId) +
      '" data-ecole="' + api.attr(ecoleId) +
      '" data-ecole-nom="' + api.attr(ecoleNom) +
      '" data-type="' + api.attr(typeId) +
      '" data-delai="' + api.attr(delai) +
      '" data-exec="' + api.attr(exec) +
      '" data-commentaire="' + api.attr(commentaire) +
      '"';
    var actions =
      '<button type="button" class="btn btn-sm btn-outline-secondary btn-voir-decision"' + data +
      ' data-readonly="1" data-bs-toggle="modal" data-bs-target="#decisionModal" title="Voir"><i class="ti ti-eye"></i></button> ';
    if (canCreer) {
      actions +=
        '<button type="button" class="btn btn-sm btn-outline-primary btn-edit-decision"' + data +
        ' data-readonly="0" data-bs-toggle="modal" data-bs-target="#decisionModal" title="Modifier"><i class="ti ti-edit"></i></button> ' +
        '<form class="d-inline js-delete-decision" data-id="' + api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>';
    }
    return (
      '<tr><td class="fw-semibold">' + api.esc(numero) +
      '</td><td>' + api.esc(typeLabel) +
      '</td><td>' + api.esc(ecoleNom) +
      '</td><td>' + api.esc(delai || '—') +
      '</td><td>' + api.esc(exec) +
      '</td><td class="text-end text-nowrap">' +
      actions +
      '</td></tr>'
    );
  }

  function renderSansDecision(list) {
    if (!alertBox) return;
    if (!list || !list.length) {
      alertBox.classList.add('d-none');
      alertBox.innerHTML = '';
      return;
    }
    alertBox.classList.remove('d-none');
    var ul = list
      .map(function (r) {
        var id = r.id || r.Id;
        var numero = r.numero || r.Numero;
        var ecoleId = r.ecoleId || r.EcoleId;
        var ecoleNom = r.ecoleNom || r.EcoleNom || '';
        return (
          '<li>' +
          api.esc(numero) +
          ' — ' +
          api.esc(ecoleNom) +
          ' <button type="button" class="btn btn-sm btn-outline-dark ms-2 decide-from" data-rapport="' +
          api.attr(id) +
          '" data-ecole="' +
          api.attr(ecoleId) +
          '" data-ecole-nom="' +
          api.attr(ecoleNom) +
          '" data-bs-toggle="modal" data-bs-target="#decisionModal">Prendre une décision</button></li>'
        );
      })
      .join('');
    alertBox.innerHTML = '<strong>Rapports transmis sans décision :</strong><ul class="mb-0 mt-2">' + ul + '</ul>';
  }

  async function loadList() {
    var data = await api.get('/Home/GetDecisions');
    var decisions = data.decisions || data.Decisions || [];
    var sans = data.sansDecision || data.SansDecision || [];
    if (tbody) {
      tbody.innerHTML = decisions.map(rowHtml).join('');
      api.refreshPagination(table);
    }
    renderSansDecision(sans);
    // Rafraîchir options éligibles après mutation
    if (rapport) {
      var selected = rapport.value;
      Array.from(rapport.querySelectorAll('option[data-eligible="1"]')).forEach(function (o) {
        o.remove();
      });
      (sans || []).forEach(function (r) {
        var id = r.id || r.Id;
        var numero = r.numero || r.Numero;
        var ecoleId = r.ecoleId || r.EcoleId || '';
        var ecoleNom = r.ecoleNom || r.EcoleNom || '';
        ensureRapportOption(id, ecoleId, ecoleNom, numero);
        var opt = Array.from(rapport.options).find(function (o) { return o.value === id; });
        if (opt) opt.dataset.eligible = '1';
      });
      if (selected) rapport.value = selected;
    }
  }

  document.getElementById('newDecision')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('decId').value = '';
    if (ecole) ecole.value = '';
    if (ecoleLabel) ecoleLabel.value = '';
    filterRapportOptions(false);
    document.getElementById('decisionTitle').textContent = 'Nouvelle décision';
    setReadonly(false, false);
  });

  document.addEventListener('click', function (e) {
    var from = e.target.closest('.decide-from');
    if (from) {
      form.reset();
      document.getElementById('decId').value = '';
      filterRapportOptions(false);
      ensureRapportOption(
        from.dataset.rapport,
        from.dataset.ecole,
        from.dataset.ecoleNom || '',
        from.dataset.rapport
      );
      var opt = Array.from(rapport.options).find(function (o) { return o.value === from.dataset.rapport; });
      if (opt) opt.dataset.eligible = '1';
      rapport.value = from.dataset.rapport;
      syncEcoleFromRapport();
      document.getElementById('decisionTitle').textContent = 'Nouvelle décision';
      setReadonly(false, false);
    }
    var fill = e.target.closest('.btn-voir-decision, .btn-edit-decision');
    if (fill) fillDecision(fill);
  });

  document.getElementById('decisionModal')?.addEventListener('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    if (trigger.id === 'newDecision') {
      filterRapportOptions(false);
      setReadonly(false, false);
      return;
    }
    var fill = trigger.closest('.btn-voir-decision, .btn-edit-decision');
    if (fill) fillDecision(fill);
    var from = trigger.closest('.decide-from');
    if (from) {
      filterRapportOptions(false);
      rapport.value = from.dataset.rapport;
      syncEcoleFromRapport();
      setReadonly(false, false);
    }
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    ['decRapport', 'decType', 'decDelai', 'decExec', 'decCommentaire'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = false;
    });
    syncEcoleFromRapport();
    document.getElementById('decMotif').value = document.getElementById('decCommentaire').value;
    var btn = document.getElementById('decisionSave');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          id: document.getElementById('decId').value || null,
          rapportId: rapport.value,
          ecoleId: ecole.value,
          typeDecisionId: document.getElementById('decType').value,
          delaiExecution: document.getElementById('decDelai').value,
          statutExecution: document.getElementById('decExec').value,
          commentaire: document.getElementById('decCommentaire').value,
          motif: document.getElementById('decMotif').value
        };
        var result = await api.post('/Home/SaveDecisionJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('decisionModal'));
          // Recharger la page pour options / alerte cohérentes
          location.reload();
        });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('submit', async function (e) {
    var f = e.target.closest('.js-delete-decision');
    if (!f) return;
    e.preventDefault();
    if (!(await api.confirm('Supprimer cette décision ? Le rapport redeviendra « transmis ».'))) return;
    try {
      await api.withBusy(f.querySelector('button'), async function () {
        var result = await api.post('/Home/DeleteDecisionJson', { id: f.getAttribute('data-id') });
        api.bindAjaxResult(result, function () { location.reload(); });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  filterRapportOptions(false);
})();
