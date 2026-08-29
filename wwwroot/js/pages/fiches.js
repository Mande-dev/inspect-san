(function () {
  'use strict';
  if (!window.api) return;

  var form = document.getElementById('ficheForm');
  var filterForm = document.getElementById('fichesFilter');
  var canValider = document.getElementById('fichesTable')?.getAttribute('data-can-valider') === '1';

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(filterForm);
    var qs = new URLSearchParams();
    if (fd.get('q')) qs.set('q', fd.get('q'));
    if (fd.get('statut')) qs.set('statut', fd.get('statut'));
    var url = location.pathname + (qs.toString() ? '?' + qs.toString() : '');
    location.assign(url);
  });

  var pendingPhotoFiles = window.pendingPhotoFiles || (window.pendingPhotoFiles = []);

  function collectControleProduits() {
    return Array.from(document.querySelectorAll('.produit-row')).map(function (row) {
      var chk = row.querySelector('.produit-check');
      var qte = row.querySelector('.produit-qte');
      if (!chk || !chk.checked) return null;
      return {
        produitCode: +chk.value || 0,
        quantite: qte ? +qte.value || 0 : 0
      };
    }).filter(Boolean);
  }

  function collectControleOutils() {
    return Array.from(document.querySelectorAll('.outil-row')).map(function (row) {
      var chk = row.querySelector('.outil-check');
      var qte = row.querySelector('.outil-qte');
      if (!chk || !chk.checked) return null;
      return {
        outilCode: +chk.value || 0,
        quantite: qte ? +qte.value || 0 : 0
      };
    }).filter(Boolean);
  }

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    form.querySelectorAll('input,select,textarea').forEach(function (el) { el.disabled = false; });
    var btn = document.getElementById('ficheSave');
    try {
      await api.withBusy(btn, async function () {
        var autres = document.getElementById('ficheProduitsAutres').value || '';
        var autresQteRaw = document.getElementById('ficheProduitsAutresQte').value;
        var outilsAutres = document.getElementById('ficheOutilsAutres')?.value || '';
        var outilsAutresQteRaw = document.getElementById('ficheOutilsAutresQte')?.value;
        var body = {
          id: document.getElementById('ficheId').value || null,
          missionId: document.getElementById('ficheMission').value,
          statut: document.getElementById('ficheStatutHidden')?.value || document.getElementById('ficheStatut').value,
          nombreBatiments: +document.getElementById('ficheBatiments').value || 0,
          etatGeneral: document.getElementById('ficheEtat').value,
          nombreEleves: +document.getElementById('ficheEleves').value || 0,
          toilettesFilles: +document.getElementById('ficheToilettesFilles').value || 0,
          toilettesGarcons: +document.getElementById('ficheToilettesGarcons').value || 0,
          produitsAutres: autres.trim() ? autres.trim() : null,
          produitsAutresQuantite: autres.trim()
            ? (autresQteRaw === '' ? null : +autresQteRaw)
            : null,
          outilsAutres: outilsAutres.trim() ? outilsAutres.trim() : null,
          outilsAutresQuantite: outilsAutres.trim()
            ? (outilsAutresQteRaw === '' ? null : +outilsAutresQteRaw)
            : null,
          controleProduits: collectControleProduits(),
          controleOutils: collectControleOutils(),
          observations: document.getElementById('ficheObs').value,
          photosJson: document.getElementById('photosJson').value
        };
        var result = await api.post('/Home/SaveFicheJson', body);
        api.bindAjaxResult(result, async function () {
          var ficheId = (result.data && (result.data.id || result.data.Id)) || body.id;
          var pending = window.pendingPhotoFiles || [];
          if (ficheId && pending.length) {
            for (var i = 0; i < pending.length; i++) {
              var fd = new FormData();
              fd.append('ficheId', ficheId);
              fd.append('file', pending[i]);
              await fetch('/Home/UploadFichePhoto', { method: 'POST', body: fd, credentials: 'same-origin' });
            }
            window.pendingPhotoFiles = [];
          }
          api.hideModal(document.getElementById('ficheModal'));
          location.reload();
        });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  document.addEventListener('submit', async function (e) {
    var soumettre = e.target.closest('form[action*="SoumettreFiche"]');
    var del = e.target.closest('form[action*="DeleteFiche"]');
    if (!soumettre && !del) return;
    e.preventDefault();
    if (del && !(await api.confirm('Supprimer cette fiche ?'))) return;
    if (soumettre && !(await api.confirm('Soumettre cette fiche pour validation tablette (« Lu et approuvé ») ?'))) return;
    var formEl = soumettre || del;
    var id = formEl.querySelector('input[name=id]')?.value;
    var url = soumettre ? '/Home/SoumettreFicheJson' : '/Home/DeleteFicheJson';
    try {
      await api.withBusy(formEl.querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, function () { location.reload(); });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  function openValidationTablette(f) {
    var id = f.id || f.Id || '';
    var numero = f.numero || f.Numero || '';
    var chefNom = f.chefNom || f.ChefNom || 'Chef d\'établissement';
    var ecoleNom = f.ecoleNom || f.EcoleNom || '—';
    document.getElementById('valTabletteFicheId').value = id;
    document.getElementById('valTabletteTitle').textContent = 'Fiche ' + numero;
    document.getElementById('valTabletteChefNom').value = chefNom;
    document.getElementById('valTabletteEcole').value = ecoleNom;
    document.getElementById('valTabletteConfirm').checked = false;
    document.getElementById('valTabletteSubmit').disabled = true;
    var resume = document.getElementById('valTabletteResume');
    if (resume) {
      resume.innerHTML =
        '<p class="mb-1"><strong>État général :</strong> ' + api.esc(f.etatGeneral || f.EtatGeneral || '—') + '</p>' +
        '<p class="mb-1"><strong>Bâtiments :</strong> ' + api.esc(String(f.nombreBatiments ?? f.NombreBatiments ?? '—')) +
        ' — <strong>Élèves :</strong> ' + api.esc(String(f.nombreEleves ?? f.NombreEleves ?? '—')) + '</p>' +
        '<p class="mb-0"><strong>Observations :</strong> ' + api.esc(f.observations || f.Observations || '—') + '</p>';
    }
    var modalEl = document.getElementById('validationTabletteModal');
    if (modalEl && window.bootstrap) bootstrap.Modal.getOrCreateInstance(modalEl).show();
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('.fiche-valider-tablette');
    if (!btn) return;
    var f = api.parseJsonAttr(btn, 'json');
    if (f) openValidationTablette(f);
  });

  document.getElementById('valTabletteConfirm')?.addEventListener('change', function () {
    var submit = document.getElementById('valTabletteSubmit');
    if (submit) submit.disabled = !this.checked;
  });

  document.getElementById('valTabletteSubmit')?.addEventListener('click', async function () {
    if (!document.getElementById('valTabletteConfirm')?.checked) return;
    var id = document.getElementById('valTabletteFicheId')?.value;
    if (!id) return;
    var btn = this;
    try {
      await api.withBusy(btn, async function () {
        var result = await api.post('/Home/ValiderFicheJson', { id: id });
        api.bindAjaxResult(result, function () {
          var modalEl = document.getElementById('validationTabletteModal');
          if (modalEl && window.bootstrap) {
            var inst = bootstrap.Modal.getInstance(modalEl);
            if (inst) inst.hide();
          }
          location.reload();
        });
      });
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });

  void canValider;
  void pendingPhotoFiles;
})();
