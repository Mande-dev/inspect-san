(function () {
  'use strict';

  /** Format BDD : "{AV}, N° {Numero}, {Quartier}, {Commune}" */
  function composeAdresse(av, numero, quartier, commune) {
    return [
      (av || '').trim(),
      'N° ' + (numero || '').trim(),
      (quartier || '').trim(),
      (commune || '').trim()
    ].join(', ');
  }

  function parseAdresse(raw) {
    var s = (raw || '').trim();
    if (!s) return { av: '', numero: '', quartier: '', commune: '' };
    var m = s.match(/^(.*?),\s*N°\s*(.*?),\s*(.*?),\s*(.*)$/i);
    if (m) {
      return {
        av: (m[1] || '').trim(),
        numero: (m[2] || '').trim(),
        quartier: (m[3] || '').trim(),
        commune: (m[4] || '').trim()
      };
    }
    return { av: s, numero: '', quartier: '', commune: '' };
  }

  function fillAdresseParts(raw) {
    var p = parseAdresse(raw);
    var av = document.getElementById('formAdresseAv');
    var num = document.getElementById('formAdresseNumero');
    var q = document.getElementById('formAdresseQuartier');
    var c = document.getElementById('formAdresseCommune');
    var hidden = document.getElementById('formAdresse');
    if (av) av.value = p.av;
    if (num) num.value = p.numero;
    if (q) q.value = p.quartier;
    if (c) c.value = p.commune;
    if (hidden) hidden.value = raw || '';
  }

  function syncAdresseHidden() {
    var composed = composeAdresse(
      document.getElementById('formAdresseAv')?.value,
      document.getElementById('formAdresseNumero')?.value,
      document.getElementById('formAdresseQuartier')?.value,
      document.getElementById('formAdresseCommune')?.value
    );
    var hidden = document.getElementById('formAdresse');
    if (hidden) hidden.value = composed;
    return composed;
  }

  function clearAdresseParts() {
    ['formAdresseAv', 'formAdresseNumero', 'formAdresseQuartier', 'formAdresseCommune', 'formAdresse'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.value = '';
    });
  }

  function setReadonly(ro) {
    document.querySelectorAll('#ecoleModal input, #ecoleModal select').forEach(function (el) {
      if (el.type !== 'hidden') el.disabled = !!ro;
    });
    var save = document.getElementById('ecoleSave');
    if (save) save.classList.toggle('d-none', !!ro);
  }

  function fillFromBtn(btn) {
    var ro = btn.dataset.readonly === '1';
    document.getElementById('ecoleModalTitle').textContent = ro ? 'Voir établissement' : 'Modifier établissement';
    document.getElementById('formId').value = btn.dataset.id || '';
    document.getElementById('formDenomination').value = btn.dataset.denomination || '';
    document.getElementById('formRegGes').value = btn.dataset.regges || '';
    document.getElementById('formSousDivision').value = btn.dataset.sousdivision || '';
    document.getElementById('formCategories').value = btn.dataset.categories || '';
    document.getElementById('formDinacope').value = btn.dataset.dinacope || '';
    document.getElementById('formAgrement').value = btn.dataset.agrement || '';
    document.getElementById('formNotif').value = btn.dataset.notif || '';
    document.getElementById('formChef').value = btn.dataset.chef || '';
    fillAdresseParts(btn.dataset.adresse || '');
    setReadonly(ro);
  }

  document.querySelectorAll('.btn-edit-ecole').forEach(function (btn) {
    btn.addEventListener('click', function () { fillFromBtn(btn); });
  });

  document.getElementById('btnNewEcole')?.addEventListener('click', function () {
    document.getElementById('ecoleModalTitle').textContent = 'Nouvel établissement';
    document.getElementById('formId').value = '';
    document.querySelector('#ecoleModal form')?.reset();
    clearAdresseParts();
    setReadonly(false);
  });

  ['formAdresseAv', 'formAdresseNumero', 'formAdresseQuartier', 'formAdresseCommune'].forEach(function (id) {
    document.getElementById(id)?.addEventListener('input', syncAdresseHidden);
  });

  document.getElementById('ecoleForm')?.addEventListener('submit', function () {
    syncAdresseHidden();
    document.querySelectorAll('#ecoleModal input, #ecoleModal select').forEach(function (el) {
      el.disabled = false;
    });
  });

  document.querySelectorAll('.js-delete-ecole').forEach(function (f) {
    f.addEventListener('submit', async function (e) {
      e.preventDefault();
      if (!(await api.confirm('Supprimer cet établissement ?'))) return;
      try {
        var result = await api.post('/Home/DeleteEcoleJson', { id: f.dataset.id });
        api.bindAjaxResult(result, function () {
          location.reload();
        });
      } catch (err) {
        api.showToast(err.message || 'Erreur', 'danger');
      }
    });
  });
})();
