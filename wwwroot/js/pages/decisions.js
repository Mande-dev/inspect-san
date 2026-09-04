(function () {
  'use strict';
  if (!window.api) return;

  var tbody = document.getElementById('decisionsTbody');
  var table = document.getElementById('decisionsTable') || (tbody && tbody.closest('table'));
  var form = document.getElementById('decisionForm');
  var fiche = document.getElementById('decFiche');
  var ecole = document.getElementById('decEcole');
  var ecoleLabel = document.getElementById('decEcoleLabel');
  var alertBox = document.getElementById('sansDecisionAlert');
  var canCreer = table && table.getAttribute('data-can-creer') === '1';
  var fichesById = {};

  try {
    var raw = document.getElementById('fichesPreviewJson');
    var list = raw ? JSON.parse(raw.textContent || '[]') : [];
    (list || []).forEach(function (f) {
      var id = f.id || f.Id;
      if (id) fichesById[id] = f;
    });
  } catch (e) { /* ignore */ }

  function syncEcoleFromFiche() {
    var o = fiche && fiche.selectedOptions[0];
    if (!o || !o.value) {
      if (ecole) ecole.value = '';
      if (ecoleLabel) ecoleLabel.value = '';
      return;
    }
    if (ecole) ecole.value = o.dataset.ecole || '';
    if (ecoleLabel) ecoleLabel.value = o.dataset.ecoleNom || o.dataset.ecole || '—';
  }

  function filterFicheOptions(modeEdit) {
    if (!fiche) return;
    Array.from(fiche.options).forEach(function (opt) {
      if (!opt.value) {
        opt.hidden = false;
        return;
      }
      var eligible = opt.dataset.eligible === '1';
      opt.hidden = modeEdit ? false : !eligible;
    });
  }

  function ensureFicheOption(ficheId, ecoleId, ecoleNom, numero, chefNom) {
    if (!fiche || !ficheId) return;
    var exists = Array.from(fiche.options).some(function (o) { return o.value === ficheId; });
    if (exists) {
      var optExisting = Array.from(fiche.options).find(function (o) { return o.value === ficheId; });
      if (optExisting && chefNom && !optExisting.dataset.chefNom) {
        optExisting.dataset.chefNom = chefNom;
      }
      return;
    }
    var opt = document.createElement('option');
    opt.value = ficheId;
    opt.dataset.ecole = ecoleId || '';
    opt.dataset.ecoleNom = ecoleNom || '';
    opt.dataset.chefNom = chefNom || '';
    opt.dataset.eligible = '0';
    opt.textContent = (numero || ficheId) + (ecoleNom ? ' — ' + ecoleNom : '');
    fiche.appendChild(opt);
  }

  function photoStamp(numOrdre, index) {
    var ordre = (numOrdre || '').trim() || 'MISSION';
    return ordre + '-' + index;
  }

  function displayPhotoLabel(p, f, index) {
    var existing = (p.Nom || p.nom || p.Legende || p.legende || '').trim();
    if (/^.+-\d+$/.test(existing) && existing.indexOf('.') < 0) return existing;
    var ordre = p.NumOrdre || p.numOrdre || (f && (f.Numero || f.numero)) || '';
    return photoStamp(ordre, index + 1);
  }

  function renderFichePreview(f) {
    if (!f) {
      return '<p class="text-secondary mb-0">Fiche introuvable.</p>';
    }
    function row(label, value) {
      return '<tr><th>' + api.esc(label) + '</th><td>' + (value || '—') + '</td></tr>';
    }
    function tableRows(items) {
      if (!items.length) {
        return '<tr><td colspan="2" class="isp-fd-empty">Aucun élément</td></tr>';
      }
      return items.map(function (it) {
        return '<tr><td>' + api.esc(it.nom) + '</td><td>' +
          api.esc(String(it.qte)) + '</td></tr>';
      }).join('');
    }
    var produits = (f.ControleProduits || f.controleProduits || []).map(function (cp) {
      return {
        nom: cp.ProduitNom || cp.produitNom || String(cp.ProduitCode ?? cp.produitCode ?? ''),
        qte: cp.Quantite ?? cp.quantite ?? 0
      };
    });
    var autresProd = f.ProduitsAutres || f.produitsAutres;
    if (autresProd) {
      produits.push({
        nom: String(autresProd) + ' (autre)',
        qte: f.ProduitsAutresQuantite ?? f.produitsAutresQuantite ?? 0
      });
    }
    var outils = (f.ControleOutils || f.controleOutils || []).map(function (co) {
      return {
        nom: co.OutilNom || co.outilNom || String(co.OutilCode ?? co.outilCode ?? ''),
        qte: co.Quantite ?? co.quantite ?? 0
      };
    });
    var autresOutil = f.OutilsAutres || f.outilsAutres;
    if (autresOutil) {
      outils.push({
        nom: String(autresOutil) + ' (autre)',
        qte: f.OutilsAutresQuantite ?? f.outilsAutresQuantite ?? 0
      });
    }

    var photosList = (f.Photos || f.photos || []).filter(function (p) {
      var url = p.Url || p.url || '';
      return url && String(url).indexOf('blob:') !== 0;
    });
    var photosHtml;
    if (!photosList.length) {
      photosHtml = '<p class="isp-fd-empty">Aucune photo.</p>';
    } else {
      photosHtml =
        '<div class="isp-fd-photos">' +
        photosList
          .map(function (p, i) {
            var url = p.Url || p.url || '';
            var legende = displayPhotoLabel(p, f, i);
            return (
              '<button type="button" class="isp-fd-photo fiche-preview-photo" data-url="' +
              api.attr(url) +
              '" data-title="' +
              api.attr(legende) +
              '">' +
              '<img src="' +
              api.esc(url) +
              '" alt="' +
              api.esc(legende) +
              '" />' +
              '<div class="isp-fd-photo-cap">' +
              api.esc(legende) +
              '</div>' +
              '</button>'
            );
          })
          .join('') +
        '</div>';
    }

    var numero = f.Numero || f.numero || f.Id || f.id || '';
    var missionId = f.MissionId || f.missionId || '';

    return (
      '<div class="isp-fd-hero">' +
      '<div><p class="isp-fd-hero-title">Ordre ' + api.esc(numero || '—') + '</p>' +
      '<p class="isp-fd-hero-meta">Mission ' + api.esc(missionId || '—') +
      ' · ' + api.esc(f.EcoleNom || f.ecoleNom || '—') + '</p></div>' +
      '<span class="isp-fd-badge">' + api.esc(f.Statut || f.statut || '—') + '</span>' +
      '</div>' +

      '<div class="isp-fd-section"><h6 class="isp-fd-section-title"><i class="ti ti-id"></i> Identification</h6>' +
      '<div class="table-responsive"><table class="isp-fd-table"><tbody>' +
      row('N° ordre / fiche', api.esc(numero)) +
      row('N° mission', api.esc(missionId || '—')) +
      row('Établissement', api.esc(f.EcoleNom || f.ecoleNom || '—')) +
      row('Recommandation', api.esc(f.RecommandationPreliminaire || f.recommandationPreliminaire || '—')) +
      '</tbody></table></div></div>' +

      '<div class="isp-fd-section"><h6 class="isp-fd-section-title"><i class="ti ti-building"></i> Constats &amp; infrastructures</h6>' +
      '<div class="table-responsive"><table class="isp-fd-table"><tbody>' +
      row('État général', api.esc(f.EtatGeneral || f.etatGeneral || '—')) +
      row('Bâtiments', api.esc(String(f.NombreBatiments ?? f.nombreBatiments ?? '—'))) +
      row('Élèves', api.esc(String(f.NombreEleves ?? f.nombreEleves ?? '—'))) +
      row('Toilettes filles', api.esc(String(f.ToilettesFilles ?? f.toilettesFilles ?? 0))) +
      row('Toilettes garçons', api.esc(String(f.ToilettesGarcons ?? f.toilettesGarcons ?? 0))) +
      '</tbody></table></div></div>' +

      '<div class="row g-3 mb-1">' +
      '<div class="col-md-6"><div class="isp-fd-section"><h6 class="isp-fd-section-title"><i class="ti ti-flask"></i> Produits</h6>' +
      '<div class="table-responsive"><table class="isp-fd-table isp-fd-table-list">' +
      '<thead><tr><th>Libellé</th><th class="text-end">Nombres</th></tr></thead>' +
      '<tbody>' + tableRows(produits) + '</tbody></table></div></div></div>' +
      '<div class="col-md-6"><div class="isp-fd-section"><h6 class="isp-fd-section-title"><i class="ti ti-tool"></i> Outils</h6>' +
      '<div class="table-responsive"><table class="isp-fd-table isp-fd-table-list">' +
      '<thead><tr><th>Libellé</th><th class="text-end">Nombres</th></tr></thead>' +
      '<tbody>' + tableRows(outils) + '</tbody></table></div></div></div>' +
      '</div>' +

      '<div class="isp-fd-section"><h6 class="isp-fd-section-title"><i class="ti ti-notes"></i> Observations</h6>' +
      '<div class="isp-fd-obs">' +
      api.esc(f.Observations || f.observations || '—') +
      '</div></div>' +

      '<div class="isp-fd-section mb-0"><h6 class="isp-fd-section-title"><i class="ti ti-photo"></i> Photos</h6>' +
      photosHtml +
      '</div>'
    );
  }

  function showFichePreview(ficheId) {
    var body = document.getElementById('fichePreviewBody');
    if (!body) return;
    body.innerHTML = renderFichePreview(fichesById[ficheId]);
    body.querySelectorAll('.fiche-preview-photo').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var url = btn.getAttribute('data-url') || '';
        var title = btn.getAttribute('data-title') || 'Photo';
        if (url && api.showImageLightbox) api.showImageLightbox({ url: url, title: title });
      });
    });
    var modalEl = document.getElementById('fichePreviewModal');
    if (!modalEl) return;
    if (api.showStackedModal) api.showStackedModal(modalEl);
    else if (window.bootstrap) bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  fiche?.addEventListener('change', syncEcoleFromFiche);

  function setReadonly(ro, lockFiche) {
    ['decFiche', 'decType'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = ro || (id === 'decFiche' && lockFiche);
    });
    if (ecoleLabel) ecoleLabel.readOnly = true;
    document.getElementById('decisionSave').style.display = ro ? 'none' : '';
  }

  function fillDecision(btn) {
    var el = btn.closest ? btn.closest('.btn-voir-decision, .btn-edit-decision') || btn : btn;
    var ficheId = api.dataAttr(el, 'fiche') || '';
    var ecoleId = api.dataAttr(el, 'ecole') || '';
    var ecoleNom = api.dataAttr(el, 'ecole-nom') || '';
    var chefNom = api.dataAttr(el, 'chef-nom') || '';
    ensureFicheOption(ficheId, ecoleId, ecoleNom, ficheId, chefNom);
    filterFicheOptions(true);
    document.getElementById('decId').value = api.dataAttr(el, 'id') || '';
    fiche.value = ficheId;
    if (ecole) ecole.value = ecoleId;
    if (ecoleLabel) ecoleLabel.value = ecoleNom || ecoleId || '—';
    document.getElementById('decType').value = api.dataAttr(el, 'type') || '';
    var ro = api.dataAttr(el, 'readonly') === '1';
    document.getElementById('decisionTitle').textContent = ro ? 'Voir la décision' : 'Modifier la décision';
    setReadonly(ro, !ro);
  }

  function printDecisionLetter(opts) {
    opts = opts || {};
    var ficheId = opts.ficheId || '';
    var f = fichesById[ficheId] || {};
    var ecoleNom = opts.ecoleNom || '';
    var chefNom = opts.chefNom || f.ChefNom || f.chefNom || '';
    if (!chefNom && fiche) {
      var sel = fiche.selectedOptions && fiche.selectedOptions[0];
      if (sel) chefNom = sel.dataset.chefNom || '';
    }
    var payload = {
      Numero: opts.numero || '',
      TypeDecision: opts.typeCode || '',
      Type: opts.typeLabel || '',
      EcoleNom: ecoleNom,
      ChefNom: chefNom,
      EtatGeneral: f.EtatGeneral || f.etatGeneral || f.EtatBatiment || f.etatBatiment || ''
    };
    if (!window.buildDecisionPrintHtml) {
      api.showToast('Gabarit de lettre indisponible. Rechargez la page.', 'danger');
      return;
    }
    var html = window.buildDecisionPrintHtml(
      payload,
      { Denomination: ecoleNom, ChefNom: chefNom },
      {
        typeCode: payload.TypeDecision,
        typeLabel: payload.Type,
        etatGeneral: payload.EtatGeneral,
        chefNom: chefNom
      }
    );
    if (window.openPrintPreview) {
      window.openPrintPreview('Lettre de décision ' + (payload.Numero || ''), html);
    }
  }

  function rowHtml(d) {
    var id = d.id || d.Id || '';
    var numero = d.numero || d.Numero || id;
    var typeLabel = d.type || d.Type || '';
    var typeCode = d.typeDecision || d.TypeDecision || '';
    var ecoleNom = d.ecoleNom || d.EcoleNom || '—';
    var ecoleId = d.ecoleId || d.EcoleId || '';
    var chefNom = d.chefNom || d.ChefNom || '';
    var ficheId = d.ficheControleId || d.FicheControleId || '';
    var data =
      ' data-id="' + api.attr(id) +
      '" data-numero="' + api.attr(numero) +
      '" data-fiche="' + api.attr(ficheId) +
      '" data-ecole="' + api.attr(ecoleId) +
      '" data-ecole-nom="' + api.attr(ecoleNom) +
      '" data-chef-nom="' + api.attr(chefNom) +
      '" data-type="' + api.attr(typeCode) +
      '" data-type-label="' + api.attr(typeLabel) + '"';
    var actions =
      '<button type="button" class="btn btn-sm btn-outline-dark btn-print-decision"' + data +
      ' title="Imprimer la lettre de décision"><i class="ti ti-printer"></i></button> ' +
      '<button type="button" class="btn btn-sm btn-outline-secondary btn-voir-decision"' + data +
      ' data-readonly="1" data-bs-toggle="modal" data-bs-target="#decisionModal" title="Voir"><i class="ti ti-eye"></i></button> ';
    if (canCreer) {
      actions +=
        '<button type="button" class="btn btn-sm btn-outline-primary btn-edit-decision"' + data +
        ' data-readonly="0" data-bs-toggle="modal" data-bs-target="#decisionModal" title="Modifier"><i class="ti ti-edit"></i></button> ' +
        '<form class="d-inline js-delete-decision" data-id="' + api.attr(id) +
        '"><button type="submit" class="btn btn-sm btn-outline-danger"><i class="ti ti-trash"></i></button></form>';
    }
    var ficheBtn = ficheId
      ? '<button type="button" class="btn btn-sm btn-link p-0 btn-voir-fiche" data-fiche-id="' + api.attr(ficheId) + '">Voir</button>'
      : '—';
    return (
      '<tr><td class="fw-semibold">' + api.esc(numero) +
      '</td><td>' + api.esc(typeLabel) +
      '</td><td>' + api.esc(ecoleNom) +
      '</td><td>' + ficheBtn +
      '</td><td class="text-end text-nowrap">' + actions + '</td></tr>'
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
      .map(function (f) {
        var id = f.id || f.Id;
        var numero = f.numero || f.Numero;
        var ecoleId = f.ecoleId || f.EcoleId;
        var ecoleNom = f.ecoleNom || f.EcoleNom || '';
        var chefNom = f.chefNom || f.ChefNom || '';
        fichesById[id] = Object.assign({}, fichesById[id] || {}, f, { EcoleNom: ecoleNom, ChefNom: chefNom });
        return (
          '<li class="mb-2">' + api.esc(numero) + ' — ' + api.esc(ecoleNom) +
          ' <button type="button" class="btn btn-sm btn-outline-secondary ms-2 btn-voir-fiche" data-fiche-id="' +
          api.attr(id) + '">Voir la fiche</button>' +
          ' <button type="button" class="btn btn-sm btn-outline-dark ms-1 decide-from" data-fiche="' +
          api.attr(id) + '" data-ecole="' + api.attr(ecoleId) + '" data-ecole-nom="' +
          api.attr(ecoleNom) + '" data-chef-nom="' + api.attr(chefNom) +
          '" data-bs-toggle="modal" data-bs-target="#decisionModal">Prendre une décision</button></li>'
        );
      })
      .join('');
    alertBox.innerHTML = '<strong>Fiches validées sans décision :</strong><ul class="mb-0 mt-2">' + ul + '</ul>';
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
    if (fiche) {
      var selected = fiche.value;
      Array.from(fiche.querySelectorAll('option[data-eligible="1"]')).forEach(function (o) { o.remove(); });
      (sans || []).forEach(function (f) {
        var id = f.id || f.Id;
        var numero = f.numero || f.Numero;
        var ecoleId = f.ecoleId || f.EcoleId || '';
        var ecoleNom = f.ecoleNom || f.EcoleNom || '';
        ensureFicheOption(id, ecoleId, ecoleNom, numero);
        var opt = Array.from(fiche.options).find(function (o) { return o.value === id; });
        if (opt) opt.dataset.eligible = '1';
      });
      if (selected) fiche.value = selected;
    }
  }

  document.getElementById('newDecision')?.addEventListener('click', function () {
    form.reset();
    document.getElementById('decId').value = '';
    if (ecole) ecole.value = '';
    if (ecoleLabel) ecoleLabel.value = '';
    filterFicheOptions(false);
    document.getElementById('decisionTitle').textContent = 'Nouvelle décision';
    setReadonly(false, false);
  });

  document.getElementById('btnVoirFicheDecision')?.addEventListener('click', function () {
    var id = fiche && fiche.value;
    if (!id) {
      api.showToast('Sélectionnez d’abord une fiche.', 'warning');
      return;
    }
    showFichePreview(id);
  });

  document.addEventListener('click', function (e) {
    var voir = e.target.closest('.btn-voir-fiche');
    if (voir) {
      showFichePreview(voir.getAttribute('data-fiche-id'));
      return;
    }
    var from = e.target.closest('.decide-from');
    if (from) {
      form.reset();
      document.getElementById('decId').value = '';
      filterFicheOptions(false);
      ensureFicheOption(from.dataset.fiche, from.dataset.ecole, from.dataset.ecoleNom || '', from.dataset.fiche, from.dataset.chefNom || '');
      var opt = Array.from(fiche.options).find(function (o) { return o.value === from.dataset.fiche; });
      if (opt) {
        opt.dataset.eligible = '1';
        if (from.dataset.chefNom) opt.dataset.chefNom = from.dataset.chefNom;
      }
      fiche.value = from.dataset.fiche;
      syncEcoleFromFiche();
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
      filterFicheOptions(false);
      setReadonly(false, false);
      return;
    }
    var fill = trigger.closest('.btn-voir-decision, .btn-edit-decision');
    if (fill) fillDecision(fill);
    var from = trigger.closest('.decide-from');
    if (from) {
      filterFicheOptions(false);
      fiche.value = from.dataset.fiche;
      syncEcoleFromFiche();
      setReadonly(false, false);
    }
  });

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    ['decFiche', 'decType'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.disabled = false;
    });
    syncEcoleFromFiche();
    var btn = document.getElementById('decisionSave');
    try {
      await api.withBusy(btn, async function () {
        var body = {
          id: document.getElementById('decId').value || null,
          ficheControleId: fiche.value,
          ecoleId: ecole.value,
          typeDecision: document.getElementById('decType').value
        };
        var result = await api.post('/Home/SaveDecisionJson', body);
        api.bindAjaxResult(result, function () {
          api.hideModal(document.getElementById('decisionModal'));
          location.reload();
        });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('submit', async function (e) {
    var f = e.target.closest('.js-delete-decision');
    if (!f) return;
    e.preventDefault();
    if (!(await api.confirm('Supprimer cette décision ?'))) return;
    try {
      await api.withBusy(f.querySelector('button'), async function () {
        var result = await api.post('/Home/DeleteDecisionJson', { id: f.getAttribute('data-id') });
        api.bindAjaxResult(result, function () { location.reload(); });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-print-decision');
    if (!btn) return;
    e.preventDefault();
    printDecisionLetter({
      numero: btn.getAttribute('data-numero') || btn.getAttribute('data-id') || '',
      ficheId: btn.getAttribute('data-fiche') || '',
      ecoleNom: btn.getAttribute('data-ecole-nom') || '',
      chefNom: btn.getAttribute('data-chef-nom') || '',
      typeCode: btn.getAttribute('data-type') || '',
      typeLabel: btn.getAttribute('data-type-label') || ''
    });
  });

  document.getElementById('btnApercuLettreDecision')?.addEventListener('click', function () {
    var typeSel = document.getElementById('decType');
    var typeCode = typeSel ? typeSel.value : '';
    var typeLabel = typeSel && typeSel.selectedOptions[0] ? typeSel.selectedOptions[0].textContent : '';
    var ficheOpt = fiche && fiche.selectedOptions[0];
    printDecisionLetter({
      numero: document.getElementById('decId')?.value || '',
      ficheId: fiche ? fiche.value : '',
      ecoleNom: ecoleLabel ? ecoleLabel.value : '',
      chefNom: (ficheOpt && ficheOpt.dataset.chefNom) || '',
      typeCode: typeCode,
      typeLabel: typeLabel
    });
  });

  filterFicheOptions(false);
})();
