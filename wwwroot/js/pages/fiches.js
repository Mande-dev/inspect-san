(function () {
  'use strict';
  if (!window.api) return;

  var form = document.getElementById('ficheForm');
  var filterForm = document.getElementById('fichesFilter');
  var canValider = document.getElementById('fichesTable')?.getAttribute('data-can-valider') === '1';

  // Filtre : AJAX soft-reload de la page (garde le wizard / data-json complets)
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

  form?.addEventListener('submit', async function (e) {
    e.preventDefault();
    form.querySelectorAll('input,select,textarea').forEach(function (el) { el.disabled = false; });
    var btn = document.getElementById('ficheSave');
    try {
      await api.withBusy(btn, async function () {
        if (typeof window.syncFicheToilets === 'function') window.syncFicheToilets();
        var produits = Array.from(document.querySelectorAll('.produit-check:checked')).map(function (x) {
          return x.value;
        });
        var body = {
          id: document.getElementById('ficheId').value || null,
          ordreMissionId: document.getElementById('ficheOrdre').value,
          statut: document.getElementById('ficheStatut').value,
          nombreBatiments: +document.getElementById('ficheBatiments').value || 0,
          etatGeneral: document.getElementById('ficheEtat').value,
          nombreEleves: +document.getElementById('ficheEleves').value || 0,
          toilettesFilles: document.getElementById('ficheFilles').value,
          toilettesGarcons: document.getElementById('ficheGarcons').value,
          montantPercu: document.getElementById('ficheMontant').value,
          quantite: document.getElementById('ficheQuantite').value,
          produitsAutres: document.getElementById('ficheAutres').value,
          observations: document.getElementById('ficheObs').value,
          recommandationPreliminaire: document.getElementById('ficheReco').value,
          produitsNettoyage: produits,
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
    var val = e.target.closest('form[action*="ValiderFiche"]');
    var del = e.target.closest('form[action*="DeleteFiche"]');
    if (!soumettre && !val && !del) return;
    e.preventDefault();
    if (del && !(await api.confirm('Supprimer cette fiche ?'))) return;
    if (soumettre && !(await api.confirm('Soumettre cette fiche au chef d’établissement pour « Lu et approuvé » ?'))) return;
    var form = soumettre || val || del;
    var id = form.querySelector('input[name=id]')?.value;
    var url = soumettre ? '/Home/SoumettreFicheJson' : val ? '/Home/ValiderFicheJson' : '/Home/DeleteFicheJson';
    try {
      await api.withBusy(form.querySelector('button'), async function () {
        var result = await api.post(url, { id: id });
        api.bindAjaxResult(result, function () { location.reload(); });
      });
    } catch (err) { api.showToast(err.message, 'danger'); }
  });

  // silence unused
  void canValider;
})();
