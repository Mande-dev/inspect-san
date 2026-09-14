(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('missionsFilter');
  var tbody = document.getElementById('missionsTbody');
  var table = document.getElementById('missionsTable');
  var form = document.getElementById('missionForm');
  var canSigner = table && table.getAttribute('data-can-signer') === '1';
  var canGerer = table && table.getAttribute('data-can-gerer') === '1';
  var partsList = document.getElementById('participationsList');

  var agentsOpts = [];
  var rolesOpts = [];
  var ecolesOpts = [];
  try {
    agentsOpts = JSON.parse(document.getElementById('agentsOptionsJson')?.textContent || '[]');
  } catch (e) {}
  try {
    rolesOpts = JSON.parse(document.getElementById('rolesOptionsJson')?.textContent || '[]');
  } catch (e) {}
  try {
    ecolesOpts = JSON.parse(document.getElementById('ecolesOptionsJson')?.textContent || '[]');
  } catch (e) {}

  var EXCLUSIVE_ROLES = { chef_equipe: true, chef_adjoint: true };

  // Retrouve une école dans les options locales.
  function findEcole(ecoleId) {
    if (!ecoleId) return null;
    return (
      ecolesOpts.find(function (e) {
        return (e.id || e.Id) === ecoleId;
      }) || null
    );
  }

  // Imprime l’ordre de mission.
  function printMission(m, ecole) {
    var parts = m.participations || m.Participations || [];
    var agentsRows = parts.map(function (p) {
      var agentId = p.agentId || p.AgentId || '';
      var agent = agentsOpts.find(function (a) {
        return (a.id || a.Id) === agentId;
      });
      return {
        matricule: agentId || '—',
        nom: p.agentNom || p.AgentNom || (agent && (agent.nomComplet || agent.NomComplet)) || agentId || '—',
        fonction: p.roleNom || p.RoleNom || p.roleMission || p.RoleMission || '—',
        telephone:
          p.agentTelephone ||
          p.AgentTelephone ||
          (agent && (agent.telephone || agent.Telephone)) ||
          '—'
      };
    });
    var numero = m.numero || m.Numero || '';
    var html = window.buildMissionPrintHtml
      ? window.buildMissionPrintHtml(m, ecole || findEcole(m.ecoleId || m.EcoleId), agentsRows, '')
      : null;
    if (window.openPrintPreview) {
      window.openPrintPreview('Ordre de mission ' + numero, html);
    } else {
      window.print();
    }
  }

  // Extrait la partie date YYYY-MM-DD.
  function d(v) {
    if (!v) return '';
    return String(v).substring(0, 10);
  }
  // Formate une date ISO en JJ/MM/AAAA.
  function fmtDate(v) {
    if (!v) return '—';
    var s = String(v).substring(0, 10);
    var p = s.split('-');
    return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : s;
  }

  // Libellé des participations pour le tableau.
  function partsLabel(parts) {
    return (parts || [])
      .map(function (p) {
        var nom = p.agentNom || p.AgentNom || p.agentId || p.AgentId || '';
        var role = p.roleNom || p.RoleNom || p.roleMission || p.RoleMission || '—';
        return nom + ' (' + role + ')';
      })
      .join(', ') || '—';
  }

  // Rôles exclusifs déjà pris (hors ligne courante).
  function takenExclusiveRoles(exceptRow) {
    var taken = {};
    if (!partsList) return taken;
    partsList.querySelectorAll('.participation-row').forEach(function (row) {
      if (row === exceptRow) return;
      var r = row.querySelector('.part-role')?.value;
      if (r && EXCLUSIVE_ROLES[r]) taken[r] = true;
    });
    return taken;
  }

  // Agents déjà sélectionnés (hors ligne courante).
  function takenAgents(exceptRow) {
    var taken = {};
    if (!partsList) return taken;
    partsList.querySelectorAll('.participation-row').forEach(function (row) {
      if (row === exceptRow) return;
      var a = row.querySelector('.part-agent')?.value;
      if (a) taken[a] = true;
    });
    return taken;
  }

  // Options HTML des rôles disponibles.
  function roleOptionsHtml(selectedCode, exceptRow) {
    var taken = takenExclusiveRoles(exceptRow);
    return rolesOpts
      .map(function (r) {
        var code = r.code || r.Code;
        var nom = r.nom || r.Nom || code;
        if (EXCLUSIVE_ROLES[code] && taken[code] && code !== selectedCode) return '';
        return (
          '<option value="' +
          api.attr(code) +
          '"' +
          (code === selectedCode ? ' selected' : '') +
          '>' +
          api.esc(nom) +
          '</option>'
        );
      })
      .join('');
  }

  // Options HTML des agents disponibles.
  function agentOptionsHtml(selectedId, exceptRow) {
    var taken = takenAgents(exceptRow);
    return agentsOpts
      .map(function (a) {
        var id = a.id || a.Id;
        var nom = a.nomComplet || a.NomComplet || id;
        if (taken[id] && id !== selectedId) return '';
        return (
          '<option value="' +
          api.attr(id) +
          '"' +
          (id === selectedId ? ' selected' : '') +
          '>' +
          api.esc(nom) +
          '</option>'
        );
      })
      .join('');
  }

  // Rafraîchit les listes de rôles des lignes.
  function refreshRoleSelects() {
    if (!partsList) return;
    partsList.querySelectorAll('.participation-row').forEach(function (row) {
      var sel = row.querySelector('.part-role');
      if (!sel) return;
      var current = sel.value;
      sel.innerHTML = '<option value="">Fonction…</option>' + roleOptionsHtml(current, row);
      if (current) sel.value = current;
    });
  }

  // Rafraîchit les listes d’agents des lignes.
  function refreshAgentSelects() {
    if (!partsList) return;
    partsList.querySelectorAll('.participation-row').forEach(function (row) {
      var sel = row.querySelector('.part-agent');
      if (!sel) return;
      var current = sel.value;
      sel.innerHTML = '<option value="">Agent…</option>' + agentOptionsHtml(current, row);
      if (current) sel.value = current;
    });
  }

  // Rafraîchit rôles et agents des participations.
  function refreshParticipationSelects() {
    refreshRoleSelects();
    refreshAgentSelects();
  }

  // Ajoute une ligne de participation.
  function addPartRow(agentId, roleCode) {
    if (!partsList) return;
    var row = document.createElement('div');
    row.className = 'row g-2 mb-2 participation-row';
    row.innerHTML =
      '<div class="col-md-5"><select name="AgentIds" class="form-select part-agent" required><option value="">Agent…</option>' +
      agentOptionsHtml(agentId || '', null) +
      '</select></div>' +
      '<div class="col-md-5"><select name="RoleMissions" class="form-select part-role" required><option value="">Fonction…</option>' +
      roleOptionsHtml(roleCode || '', null) +
      '</select></div>' +
      '<div class="col-md-2"><button type="button" class="btn btn-outline-danger w-100 btn-remove-part"><i class="ti ti-trash"></i></button></div>';
    partsList.appendChild(row);
    refreshParticipationSelects();
  }

  // Vide la liste des participations.
  function clearParts() {
    if (partsList) partsList.innerHTML = '';
  }

  // Collecte les participations du formulaire.
  function collectParticipations() {
    var rows = partsList ? partsList.querySelectorAll('.participation-row') : [];
    var list = [];
    rows.forEach(function (row) {
      var a = row.querySelector('.part-agent')?.value;
      var r = row.querySelector('.part-role')?.value;
      if (a && r) list.push({ agentId: a, roleMission: r });
    });
    return list;
  }

  // Indique si la mission est éditable.
  function canEditMission(m) {
    return canGerer || m.canWrite === true || m.CanWrite === true;
  }

  // Construit une ligne du tableau missions.
  function rowHtml(m) {
    var id = m.id || m.Id || '';
    var numero = m.numero || m.Numero || '';
    var ecoleNom = m.ecoleNom || m.EcoleNom || '—';
    var nomEquipe = m.nomEquipe || m.NomEquipe || '';
    var statut = m.statut || m.Statut || '';
    var parts = m.participations || m.Participations || [];
    var json = api.attr(JSON.stringify(m));
    var ecoleId = m.ecoleId || m.EcoleId || '';
    var ecole = findEcole(ecoleId);
    var ecoleJson = api.attr(JSON.stringify(ecole || { Id: ecoleId, Denomination: ecoleNom }));
    var editable = canEditMission(m);
    var canDeleguer = m.canDeleguer === true || m.CanDeleguer === true;
    var adjoint = parts.find(function (p) {
      return (p.roleMission || p.RoleMission) === 'chef_adjoint';
    });
    var delegue = adjoint && (adjoint.ecritureDeleguee === true || adjoint.EcritureDeleguee === true);
    var printBtn =
      '<button type="button" class="btn btn-sm btn-outline-secondary mission-print" title="Imprimer l’ordre de mission" data-json="' +
      json +
      '" data-ecole="' +
      ecoleJson +
      '"><i class="ti ti-printer"></i></button> ';
    var edit = editable
      ? '<button type="button" class="btn btn-sm btn-outline-primary mission-edit" data-json="' +
        json +
        '" data-bs-toggle="modal" data-bs-target="#missionModal"><i class="ti ti-edit"></i></button> '
      : '';
    var signer =
      canSigner && (statut === 'brouillon' || statut === 'en_attente_signature')
        ? '<form class="d-inline js-signer-mission" data-id="' +
          api.attr(id) +
          '"><button type="submit" class="btn btn-sm btn-outline-success" title="Signer"><i class="ti ti-signature"></i></button></form> '
        : '';
    var demander =
      editable && statut === 'brouillon'
        ? '<form class="d-inline js-demander-signature" data-id="' +
          api.attr(id) +
          '"><button type="submit" class="btn btn-sm btn-outline-warning" title="Demander signature"><i class="ti ti-send"></i></button></form> '
        : '';
    var deleg =
      canDeleguer && !delegue
        ? '<form class="d-inline js-deleguer-ecriture" data-id="' +
          api.attr(id) +
          '"><button type="submit" class="btn btn-sm btn-outline-info" title="Céder écriture à l\'adjoint"><i class="ti ti-key"></i></button></form> '
        : canDeleguer && delegue
          ? '<form class="d-inline js-retirer-delegation" data-id="' +
            api.attr(id) +
            '"><button type="submit" class="btn btn-sm btn-outline-secondary" title="Retirer délégation"><i class="ti ti-key-off"></i></button></form> '
          : '';
    var del = editable
      ? '<form class="d-inline js-delete-mission" data-id="' +
        api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>'
      : '';
    return (
      '<tr><td class="fw-semibold">' +
      api.esc(numero) +
      '</td><td>' +
      api.esc(ecoleNom) +
      '</td><td>' +
      api.esc(nomEquipe) +
      '</td><td class="small">' +
      api.esc(partsLabel(parts)) +
      '</td><td class="small">' +
      fmtDate(m.finValidite || m.FinValidite) +
      '</td><td><span class="badge bg-secondary-subtle text-dark">' +
      api.esc(String(statut).replace(/_/g, ' ')) +
      '</span></td><td class="text-end text-nowrap">' +
      printBtn +
      edit +
      signer +
      demander +
      deleg +
      del +
      '</td></tr>'
    );
  }

  // Charge et affiche la liste des missions.
  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var list = await api.get('/Home/GetMissions', { q: fd.get('q') || '', statut: fd.get('statut') || '' });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  // Affiche le numéro de mission dans le modal.
  function setNumeroDisplay(numero) {
    var wrap = document.getElementById('missionNumeroWrap');
    var display = document.getElementById('missionNumeroDisplay');
    if (!wrap || !display) return;
    if (numero) {
      display.textContent = numero;
      wrap.classList.remove('d-none');
    } else {
      display.textContent = '—';
      wrap.classList.add('d-none');
    }
  }

  // Affiche le nom d’équipe dans le modal.
  function setEquipeDisplay(numero, nomEquipe) {
    var display = document.getElementById('missionNomEquipeDisplay');
    if (!display) return;
    if (nomEquipe) {
      display.textContent = nomEquipe;
    } else if (numero) {
      display.textContent = 'Equipe-' + numero;
    } else {
      display.textContent = 'Généré automatiquement (Equipe-{N°})';
    }
  }

  // Remplit le formulaire mission pour édition.
  function fillMission(m) {
    document.getElementById('missionTitle').textContent = 'Modifier la mission';
    document.getElementById('missionId').value = m.id || m.Id || '';
    var numero = m.numero || m.Numero || '';
    setNumeroDisplay(numero);
    setEquipeDisplay(numero, m.nomEquipe || m.NomEquipe || '');
    document.getElementById('missionEcole').value = m.ecoleId || m.EcoleId || '';
    document.getElementById('missionStatut').value = m.statut || m.Statut || 'brouillon';
    document.getElementById('missionEmission').value = d(m.dateEmission || m.DateEmission);
    document.getElementById('missionFin').value = d(m.finValidite || m.FinValidite);
    clearParts();
    var parts = m.participations || m.Participations || [];
    if (parts.length) {
      parts.forEach(function (p) {
        addPartRow(p.agentId || p.AgentId, p.roleMission || p.RoleMission);
      });
    } else {
      addPartRow('', '');
    }
  }

  document.getElementById('addParticipation')?.addEventListener('click', function () {
    addPartRow('', '');
  });

  document.addEventListener('change', function (e) {
    if (!e.target || !e.target.classList) return;
    if (e.target.classList.contains('part-role') || e.target.classList.contains('part-agent')) {
      refreshParticipationSelects();
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest('.btn-remove-part')) {
      e.target.closest('.participation-row')?.remove();
      refreshParticipationSelects();
    }
    var printBtn = e.target.closest('.mission-print');
    if (printBtn) {
      var m = api.parseJsonAttr(printBtn, 'json') || {};
      var ecole = null;
      try {
        ecole = JSON.parse(printBtn.getAttribute('data-ecole') || 'null');
      } catch (err) {}
      printMission(m, ecole);
      return;
    }
    var edit = e.target.closest('.mission-edit');
    if (edit) {
      var mission = api.parseJsonAttr(edit, 'json');
      if (mission) fillMission(mission);
    }
  });

  document.getElementById('newMission')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('missionId').value = '';
    document.getElementById('missionTitle').textContent = 'Nouvelle mission';
    setNumeroDisplay('');
    setEquipeDisplay('', '');
    clearParts();
    addPartRow('', '');
  });

  document.getElementById('missionModal')?.addEventListener('show.bs.modal', function (e) {
    var trigger = e.relatedTarget;
    if (!trigger) return;
    var edit = trigger.closest('.mission-edit');
    if (!edit) return;
    var m = api.parseJsonAttr(edit, 'json');
    if (m) fillMission(m);
  });

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    loadList().catch(function (err) {
      api.showToast(err.message, 'danger');
    });
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    var btn = form.querySelector('[type=submit]');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          id: document.getElementById('missionId').value || null,
          statut: document.getElementById('missionStatut').value,
          ecoleId: document.getElementById('missionEcole').value,
          dateEmission: document.getElementById('missionEmission').value || null,
          finValidite: document.getElementById('missionFin').value || null,
          participations: collectParticipations()
        };
        var result = await api.post('/Home/SaveMissionJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('missionModal'));
          loadList();
        });
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  document.addEventListener('submit', async function (e) {
    var signer = e.target.closest('.js-signer-mission');
    var demander = e.target.closest('.js-demander-signature');
    var del = e.target.closest('.js-delete-mission');
    var deleguer = e.target.closest('.js-deleguer-ecriture');
    var retirer = e.target.closest('.js-retirer-delegation');
    if (!signer && !demander && !del && !deleguer && !retirer) return;
    e.preventDefault();
    if (del && !(await api.confirm('Supprimer cette mission ?'))) return;
    if (deleguer && !(await api.confirm('Céder les droits d\'écriture au chef adjoint ?'))) return;
    if (retirer && !(await api.confirm('Retirer la délégation d\'écriture à l\'adjoint ?'))) return;
    var el = signer || demander || del || deleguer || retirer;
    var id = el.getAttribute('data-id');
    var url = signer
      ? '/Home/SignerMissionJson'
      : demander
        ? '/Home/DemanderSignatureMissionJson'
        : deleguer
          ? '/Home/DeleguerEcritureAdjointJson'
          : retirer
            ? '/Home/RetirerDelegationAdjointJson'
            : '/Home/DeleteMissionJson';
    try {
      await api.withBusy(el.querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, loadList);
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });
})();
