/**
 * SweetAlert2 — popups centrés (modèle officiel https://sweetalert2.github.io/).
 * Plus de toasts en coin : succès / info / warning / erreur / confirm = modale centre.
 */
(function (global) {
  'use strict';

  function resolveSwal() {
    var S = global.Swal || global.Sweetalert2 || global.SweetAlert2 || global.sweetAlert || global.swal;
    if (S && !global.Swal) global.Swal = S;
    return S || null;
  }

  function normalizeType(type) {
    type = (type || 'success').toLowerCase();
    if (type === 'danger') return 'error';
    if (['success', 'error', 'warning', 'info', 'question'].indexOf(type) < 0) return 'info';
    return type;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/\n/g, '<br>');
  }

  var titles = {
    success: 'Succès',
    error: 'Erreur',
    warning: 'Attention',
    info: 'Information',
    question: 'Confirmation'
  };

  function fireCentered(message, type, opts) {
    opts = opts || {};
    var Swal = resolveSwal();
    if (!Swal) {
      console.warn('[IspAlert]', type, message);
      return Promise.resolve({ isConfirmed: true });
    }
    type = normalizeType(type);
    return Swal.fire({
      icon: type,
      title: opts.title || titles[type] || 'Information',
      html: message ? '<p class="mb-0">' + escapeHtml(message) + '</p>' : undefined,
      text: message && opts.asText ? String(message) : undefined,
      position: 'center',
      backdrop: true,
      allowOutsideClick: true,
      allowEscapeKey: true,
      showConfirmButton: true,
      confirmButtonText: opts.confirmText || 'OK',
      showCancelButton: !!opts.showCancel,
      cancelButtonText: opts.cancelText || 'Annuler',
      focusConfirm: !opts.showCancel,
      focusCancel: !!opts.showCancel,
      reverseButtons: !!opts.showCancel,
      buttonsStyling: true,
      heightAuto: true,
      customClass: {
        container: 'isp-swal-container',
        popup: 'isp-swal-popup'
      }
    });
  }

  function success(message) {
    return fireCentered(message, 'success');
  }
  function info(message) {
    return fireCentered(message, 'info');
  }
  function warning(message) {
    return fireCentered(message, 'warning');
  }
  function error(message, title) {
    return fireCentered(message, 'error', { title: title || 'Erreur' });
  }

  function notify(message, type) {
    type = normalizeType(type);
    if (type === 'error') return error(message);
    if (type === 'warning') return warning(message);
    if (type === 'info') return info(message);
    return success(message);
  }

  function confirm(message, opts) {
    opts = opts || {};
    return fireCentered(message || 'Confirmer cette action ?', 'warning', {
      title: opts.title || 'Confirmation',
      showCancel: true,
      confirmText: opts.confirmText || 'Oui',
      cancelText: opts.cancelText || 'Annuler'
    }).then(function (r) {
      return !!(r && r.isConfirmed);
    });
  }

  function bindConfirmForms(root) {
    root = root || document;
    root.querySelectorAll('form.js-swal-confirm').forEach(function (form) {
      if (form.dataset.swalBound === '1') return;
      form.dataset.swalBound = '1';
      form.addEventListener('submit', function (e) {
        if (form.dataset.swalConfirmed === '1') return;
        e.preventDefault();
        var msg = form.getAttribute('data-confirm-message') || 'Confirmer cette action ?';
        confirm(msg, { title: 'Confirmation' }).then(function (ok) {
          if (!ok) return;
          form.dataset.swalConfirmed = '1';
          HTMLFormElement.prototype.submit.call(form);
        });
      });
    });
  }

  function consumeFlash() {
    var el = document.getElementById('isp-flash-toast');
    if (!el) return;
    try {
      var data = JSON.parse(el.textContent || '{}');
      if (data && data.message) notify(data.message, data.type || 'success');
    } catch (e) { /* ignore */ }
    el.remove();
  }

  resolveSwal();
  global.IspAlert = {
    success: success,
    error: error,
    warning: warning,
    info: info,
    notify: notify,
    confirm: confirm,
    alertSuccess: success,
    alertError: error,
    alertWarning: warning,
    alertInfo: info,
    alertConfirm: confirm,
    bindConfirmForms: bindConfirmForms
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      resolveSwal();
      consumeFlash();
      bindConfirmForms();
    });
  } else {
    consumeFlash();
    bindConfirmForms();
  }
})(window);
