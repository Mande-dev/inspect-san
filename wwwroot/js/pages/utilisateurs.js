(function () {
  'use strict';
  if (!window.api || !window.jQuery) return;
  var $ = window.jQuery;
  var tbody = document.getElementById('usersTbody');
  var table = tbody && tbody.closest('table');
  var form = document.querySelector('#userModal form');

  async function loadChefsSansCompte() {
    var $sel = $('#userControleurId');
    $sel.empty().append('<option value="">— Sélectionner —</option>');
    try {
      var list = await api.get('/Home/GetChefsEquipeSansCompte');
      (list || []).forEach(function (c) {
        var id = c.controleurId || c.ControleurId;
        var nom = c.nomComplet || c.NomComplet || '';
        var eq = c.equipeNom || c.EquipeNom || '';
        var label = nom + (eq ? ' — ' + eq : '');
        $sel.append($('<option></option>').attr('value', id).text(label));
      });
    } catch (err) {
      api.showToast(err.message || 'Erreur chargement chefs', 'danger');
    }
  }

  function toggleRoleFields() {
    var role = $('#userRole').val();
    $('#equipeBox').toggleClass('d-none', role !== 'Contrôleur');
    $('#ecoleBox').toggleClass('d-none', role !== "Chef d'établissement");
    if (role === 'Contrôleur') loadChefsSansCompte();
  }

  $('#userRole').on('change', toggleRoleFields);

  $('#userControleurId').on('change', function () {
    var txt = $(this).find('option:selected').text() || '';
    var nom = txt.split(' — ')[0];
    if (nom && !$('#userNom').val()) {
      $('#userNom').val(nom.trim());
    }
  });

  function isActif(statut) {
    return String(statut || '').toLowerCase() === 'actif';
  }

  function statutBadge(s) {
    return isActif(s)
      ? '<span class="badge bg-success-subtle text-success-emphasis">Actif</span>'
      : '<span class="badge bg-secondary">Inactif</span>';
  }

  function statutFormHtml(id, statut) {
    var next = isActif(statut) ? 'inactif' : 'actif';
    var label = next === 'actif' ? 'Activer' : 'Désactiver';
    var aria = next === 'actif' ? 'Activer ce compte' : 'Désactiver ce compte';
    var btnClass = next === 'actif' ? 'btn-outline-success' : 'btn-outline-secondary';
    var icon = next === 'actif' ? 'ti-user-check' : 'ti-user-off';
    return (
      '<form method="post" action="/Home/SetUtilisateurStatut" class="d-inline js-set-statut"' +
      ' data-id="' +
      api.attr(id) +
      '" data-statut="' +
      api.attr(next) +
      '">' +
      '<input type="hidden" name="id" value="' +
      api.attr(id) +
      '" />' +
      '<input type="hidden" name="statut" value="' +
      api.attr(next) +
      '" />' +
      '<button type="submit" class="btn btn-sm ' +
      btnClass +
      '" title="' +
      api.attr(aria) +
      '" aria-label="' +
      api.attr(aria) +
      '">' +
      '<i class="ti ' +
      icon +
      ' me-1" aria-hidden="true"></i>' +
      label +
      '</button></form>'
    );
  }

  function rowHtml(u) {
    var id = u.id || u.Id || '';
    var nom = u.nom || u.Nom || '';
    var role = u.role || u.Role || '';
    var equipe = u.equipe || u.Equipe || '';
    var statut = u.statut || u.Statut || '';
    var contact = u.contact || u.Contact || '';
    return (
      '<tr><td class="fw-semibold">' +
      api.esc(nom) +
      '</td><td>' +
      api.esc(contact) +
      '</td><td>' +
      api.esc(role) +
      '</td><td>' +
      api.esc(equipe || '—') +
      '</td><td>' +
      statutBadge(statut) +
      '</td><td class="text-end text-nowrap">' +
      statutFormHtml(id, statut) +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody) return;
    try {
      var list = await api.get('/Home/GetUtilisateurs');
      tbody.innerHTML = (list || []).map(rowHtml).join('');
      api.refreshPagination(table);
    } catch (err) {
      api.showToast(err.message || 'Impossible de recharger la liste', 'danger');
    }
  }

  $('#btnNewUser').on('click', function () {
    $('#userModalTitle').text('Nouvel utilisateur');
    form.reset();
    $('#userPwd, #userPwdConfirm').prop('required', true);
    $('#pwdMismatch').addClass('d-none');
    toggleRoleFields();
  });

  function passwordsOk() {
    var p1 = $('#userPwd').val() || '';
    var p2 = $('#userPwdConfirm').val() || '';
    if (p1 !== p2) {
      $('#pwdMismatch').removeClass('d-none');
      return false;
    }
    $('#pwdMismatch').addClass('d-none');
    return true;
  }

  $('#userPwd, #userPwdConfirm').on('input', passwordsOk);

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    if (!passwordsOk()) {
      api.showToast('Les mots de passe ne correspondent pas.', 'danger');
      return;
    }
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          nom: $('#userNom').val(),
          contact: $('#userContact').val(),
          role: $('#userRole').val(),
          controleurId: $('#userControleurId').val() || null,
          ecoleId: $('#userEcoleId').val() || null,
          statut: $('#userStatut').val(),
          motDePasse: $('#userPwd').val() || null,
          confirmationMotDePasse: $('#userPwdConfirm').val() || null
        };
        var result = await api.post('/Home/SaveUtilisateurJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('userModal'));
          loadList();
        });
      });
    } catch (err) {
      api.showToast(err.message || 'Erreur', 'danger');
    }
  });

  // Pattern aligné sur ecoles.js — preventDefault synchrone avant await
  $(document).on('submit', '.js-set-statut', async function (e) {
    e.preventDefault();
    e.stopPropagation();

    var formStatut = this;
    var id =
      formStatut.getAttribute('data-id') ||
      (formStatut.querySelector('input[name="id"]') || {}).value ||
      '';
    var statut =
      formStatut.getAttribute('data-statut') ||
      (formStatut.querySelector('input[name="statut"]') || {}).value ||
      '';

    if (!id || !statut) {
      api.showToast('Identifiant ou statut manquant.', 'danger');
      return;
    }

    var label = statut === 'actif' ? 'Activer ce compte ?' : 'Désactiver ce compte ?';
    if (!(await api.confirm(label))) return;

    var btn = formStatut.querySelector('button[type="submit"]') || formStatut.querySelector('button');
    try {
      await api.withBusy(btn, async function () {
        var result = await api.post('/Home/SetUtilisateurStatutJson', { id: id, statut: statut });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) {
      api.showToast(err.message || 'Erreur lors du changement de statut', 'danger');
    }
  });
})();
