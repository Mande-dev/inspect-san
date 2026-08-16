(function () {
  'use strict';
  if (!window.api) return;

  document.addEventListener('submit', async function (e) {
    var all = e.target.closest('form[action*="MarkAllNotificationsRead"]');
    var one = e.target.closest('form[action*="MarkNotificationRead"]');
    if (!all && !one) return;
    // Ne pas intercepter si ce n'est pas le dropdown notifs (éviter collision)
    if (!e.target.closest('.dropdown-menu')) return;
    e.preventDefault();
    try {
      if (all) {
        var result = await api.post('/Home/MarkAllNotificationsReadJson');
        api.bindAjaxResult(result, function () { location.reload(); });
      } else {
        var id = one.querySelector('input[name=id]')?.value;
        var result = await api.post('/Home/MarkNotificationReadJson', { id: id });
        api.bindAjaxResult(result, function () { location.reload(); });
      }
    } catch (err) {
      api.showToast(err.message, 'danger');
    }
  });
})();
