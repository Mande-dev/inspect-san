/**
 * SweetAlert2 — popups centrés Inspect-San.
 * Succès / info / warning / erreur / confirm = modale centre (pas de toast coin).
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

  var confirmBtnClass = {
    success: 'isp-swal-btn isp-swal-btn--success',
    error: 'isp-swal-btn isp-swal-btn--danger',
    warning: 'isp-swal-btn isp-swal-btn--warning',
    info: 'isp-swal-btn isp-swal-btn--primary',
    question: 'isp-swal-btn isp-swal-btn--primary'
  };

  function blocked(message, opts) {
    opts = opts || {};
    var detail = opts.detail || '';
    var html =
      (message
        ? '<p class="isp-swal-msg"><strong>' + escapeHtml(message) + '</strong></p>'
        : '') +
      (detail
        ? '<p class="isp-swal-msg isp-swal-msg--detail">' + escapeHtml(detail) + '</p>'
        : '');
    return fireCentered(null, 'warning', {
      title: opts.title || 'Suppression non autorisée',
      confirmText: opts.confirmText || 'J\'ai compris',
      htmlOverride: html || undefined
    });
  }

  function fireCentered(message, type, opts) {
    opts = opts || {};
    var Swal = resolveSwal();
    if (!Swal) {
      console.warn('[IspAlert]', type, message);
      return Promise.resolve({ isConfirmed: true });
    }
    type = normalizeType(opts.icon || type);
    var popupTone = 'isp-swal-popup--' + type;
    var bodyHtml = opts.htmlOverride;
    if (!bodyHtml && message) {
      bodyHtml = '<p class="isp-swal-msg">' + escapeHtml(message) + '</p>';
    }
    return Swal.fire({
      icon: type,
      title: opts.title || titles[type] || 'Information',
      html: bodyHtml,
      text: message && opts.asText ? String(message) : undefined,
      position: 'center',
      backdrop: true,
      allowOutsideClick: opts.allowOutsideClick !== false,
      allowEscapeKey: true,
      showConfirmButton: true,
      confirmButtonText: opts.confirmText || 'OK',
      showCancelButton: !!opts.showCancel,
      cancelButtonText: opts.cancelText || 'Annuler',
      focusConfirm: !opts.showCancel,
      focusCancel: !!opts.showCancel,
      reverseButtons: !!opts.showCancel,
      buttonsStyling: false,
      heightAuto: true,
      showClass: { popup: 'swal2-show isp-swal-enter' },
      hideClass: { popup: 'swal2-hide' },
      customClass: {
        container: 'isp-swal-container',
        popup: 'isp-swal-popup ' + popupTone,
        title: 'isp-swal-title',
        htmlContainer: 'isp-swal-html',
        icon: 'isp-swal-icon',
        actions: 'isp-swal-actions',
        confirmButton: confirmBtnClass[type] || 'isp-swal-btn isp-swal-btn--primary',
        cancelButton: 'isp-swal-btn isp-swal-btn--ghost',
        closeButton: 'isp-swal-close'
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
    return fireCentered(message || 'Confirmer cette action ?', opts.icon || 'question', {
      title: opts.title || 'Confirmation',
      showCancel: true,
      confirmText: opts.confirmText || 'Confirmer',
      cancelText: opts.cancelText || 'Annuler',
      allowOutsideClick: opts.allowOutsideClick !== false,
      icon: opts.icon || 'question'
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
        var msg =
          form.getAttribute('data-confirm-message') || 'Confirmer cette action ?';
        var title = form.getAttribute('data-confirm-title') || 'Confirmation';
        var confirmText = form.getAttribute('data-confirm-ok') || 'Confirmer';
        var cancelText = form.getAttribute('data-confirm-cancel') || 'Annuler';
        var icon = form.getAttribute('data-confirm-icon') || 'question';
        confirm(msg, {
          title: title,
          confirmText: confirmText,
          cancelText: cancelText,
          icon: icon
        }).then(function (ok) {
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
      if (data && data.message) {
        if (data.blocked || data.detail) {
          blocked(data.message, {
            title: data.title || 'Suppression non autorisée',
            detail: data.detail || ''
          });
        } else {
          notify(data.message, data.type || 'success');
        }
      }
    } catch (e) {
      /* ignore */
    }
    el.remove();
  }

  resolveSwal();
  global.IspAlert = {
    success: success,
    error: error,
    warning: warning,
    info: info,
    notify: notify,
    blocked: blocked,
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
