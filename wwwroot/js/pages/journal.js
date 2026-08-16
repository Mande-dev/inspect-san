(function () {
  'use strict';
  if (!window.api) return;

  var filterForm = document.getElementById('journalFilter');
  var tbody = document.getElementById('journalTbody');
  var table = tbody && tbody.closest('table');

  function fmt(dt) {
    if (!dt) return '';
    var d = new Date(dt);
    if (isNaN(d.getTime())) return String(dt);
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }

  function rowHtml(j) {
    return (
      '<tr><td class="small text-nowrap">' +
      api.esc(fmt(j.createdAt || j.CreatedAt)) +
      '</td><td>' +
      api.esc(j.utilisateurNom || j.UtilisateurNom || j.utilisateurId || j.UtilisateurId || '') +
      '</td><td>' +
      api.esc(j.module || j.Module || '') +
      '</td><td>' +
      api.esc(j.action || j.Action || '') +
      '</td><td>' +
      api.esc(j.detail || j.Detail || '') +
      '</td></tr>'
    );
  }

  async function loadList() {
    if (!tbody || !filterForm) return;
    var fd = new FormData(filterForm);
    var list = await api.get('/Home/GetJournal', {
      q: fd.get('q') || '',
      userId: fd.get('userId') || '',
      module: fd.get('module') || ''
    });
    tbody.innerHTML = (list || []).map(rowHtml).join('');
    api.refreshPagination(table);
  }

  filterForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    loadList().catch(function (err) { api.showToast(err.message, 'danger'); });
  });
})();
