/**
 * SweetAlert2 — popups centrés Inspect-San.
 * Succès / info / warning / erreur / confirm = modale centre (pas de toast coin).
 */
(function (global) {
  'use strict';

  // Résout l’instance globale SweetAlert2.
  function resolveSwal() {
    var S = global.Swal || global.Sweetalert2 || global.SweetAlert2 || global.sweetAlert || global.swal;
    if (S && !global.Swal) global.Swal = S;
    return S || null;
  }

  // Normalise le type d’alerte SweetAlert.
  function normalizeType(type) {
    type = (type || 'success').toLowerCase();
    if (type === 'danger') return 'error';
    if (['success', 'error', 'warning', 'info', 'question'].indexOf(type) < 0) return 'info';
    return type;
  }

  // Échappe le HTML pour les messages d’alerte.
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

  // Affiche une alerte « action bloquée » centrée.
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

  // Affiche une popup SweetAlert centrée.
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

  // Affiche une alerte de succès.
  function success(message) {
    return fireCentered(message, 'success');
  }
  // Affiche une alerte d’information.
  function info(message) {
    return fireCentered(message, 'info');
  }
  // Affiche une alerte d’avertissement.
  function warning(message) {
    return fireCentered(message, 'warning');
  }
  // Affiche une alerte d’erreur.
  function error(message, title) {
    return fireCentered(message, 'error', { title: title || 'Erreur' });
  }

  // Route une notification selon son type.
  function notify(message, type) {
    type = normalizeType(type);
    if (type === 'error') return error(message);
    if (type === 'warning') return warning(message);
    if (type === 'info') return info(message);
    return success(message);
  }

  // Demande une confirmation via SweetAlert.
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

  /**
   * Affiche le modal de progression, exécute l'envoi, puis succès ou erreur.
   * opts: { title, steps, run, successTitle }
   * Important : fermer le loader (Swal.close) avant le Swal final, sinon SweetAlert2
   * met le 2e popup en file et l'UI reste bloquée.
   */
  function runEmailSend(opts) {
    opts = opts || {};
    var Swal = resolveSwal();
    var steps = opts.steps || [
      'Préparation du document PDF…',
      'Connexion au serveur mail…',
      'Envoi de l\'e-mail en cours…',
      'Confirmation SMTP…'
    ];
    var title = opts.title || 'Envoi de l\'e-mail';
    var stepIndex = 0;
    var timer = null;

    function stepsHtml(activeIndex) {
      var items = steps
        .map(function (label, i) {
          var state =
            i < activeIndex ? 'is-done' : i === activeIndex ? 'is-active' : 'is-pending';
          var mark = i < activeIndex ? '✓' : String(i + 1);
          return (
            '<li class="isp-email-step ' +
            state +
            '">' +
            '<span class="isp-email-step__mark" aria-hidden="true">' +
            mark +
            '</span>' +
            '<span class="isp-email-step__label">' +
            escapeHtml(label) +
            '</span>' +
            '</li>'
          );
        })
        .join('');
      return (
        '<ul class="isp-email-steps" id="ispEmailProgressSteps">' +
        items +
        '</ul>' +
        '<p class="isp-swal-msg isp-swal-msg--detail">Veuillez patienter, ne fermez pas cette fenêtre.</p>'
      );
    }

    function paintSteps(activeIndex) {
      var root = document.getElementById('ispEmailProgressSteps');
      if (!root) return;
      var items = root.querySelectorAll('.isp-email-step');
      for (var i = 0; i < items.length; i++) {
        items[i].classList.remove('is-done', 'is-active', 'is-pending');
        if (i < activeIndex) items[i].classList.add('is-done');
        else if (i === activeIndex) items[i].classList.add('is-active');
        else items[i].classList.add('is-pending');
        var mark = items[i].querySelector('.isp-email-step__mark');
        if (mark) mark.textContent = i < activeIndex ? '✓' : String(i + 1);
      }
    }

    function stopProgress() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    /** Ferme le loader pour débloquer la file SweetAlert2 avant succès/erreur. */
    function closeLoader() {
      stopProgress();
      if (!Swal) return;
      try {
        if (typeof Swal.isVisible === 'function' && Swal.isVisible()) {
          Swal.close();
        }
      } catch (e) {
        /* ignore */
      }
    }

    function openLoading() {
      if (!Swal) return;
      Swal.fire({
        title: title,
        html: stepsHtml(0),
        position: 'center',
        backdrop: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        showCancelButton: false,
        heightAuto: true,
        showClass: { popup: 'swal2-show isp-swal-enter' },
        customClass: {
          container: 'isp-swal-container',
          popup: 'isp-swal-popup isp-swal-popup--info isp-swal-popup--loading',
          title: 'isp-swal-title',
          htmlContainer: 'isp-swal-html',
          actions: 'isp-swal-actions'
        },
        didOpen: function () {
          Swal.showLoading();
          timer = setInterval(function () {
            if (stepIndex < steps.length - 1) {
              stepIndex += 1;
              paintSteps(stepIndex);
            }
          }, 1600);
        }
      });
    }

    function fireResult(kind, resultTitle, htmlMsg) {
      closeLoader();
      if (!Swal) return Promise.resolve();
      var isOk = kind === 'success';
      return Swal.fire({
        icon: isOk ? 'success' : 'error',
        title: resultTitle,
        html: '<p class="isp-swal-msg">' + escapeHtml(htmlMsg) + '</p>',
        position: 'center',
        backdrop: true,
        allowOutsideClick: true,
        showConfirmButton: true,
        confirmButtonText: isOk ? 'OK' : 'Fermer',
        buttonsStyling: false,
        customClass: {
          container: 'isp-swal-container',
          popup: 'isp-swal-popup isp-swal-popup--' + (isOk ? 'success' : 'error'),
          title: 'isp-swal-title',
          htmlContainer: 'isp-swal-html',
          icon: 'isp-swal-icon',
          actions: 'isp-swal-actions',
          confirmButton: 'isp-swal-btn isp-swal-btn--' + (isOk ? 'success' : 'danger')
        }
      });
    }

    if (Swal) {
      openLoading();
    }

    return Promise.resolve()
      .then(function () {
        return typeof opts.run === 'function' ? opts.run() : null;
      })
      .then(function (result) {
        var ok = result && (result.success !== undefined ? result.success : result.Success);
        var msg = (result && (result.message || result.Message)) || '';
        if (ok) {
          return fireResult(
            'success',
            opts.successTitle || 'E-mail envoyé',
            msg || 'Envoi réussi.'
          ).then(function () {
            return result;
          });
        }
        return fireResult(
          'error',
          'Échec de l\'envoi',
          msg || 'L\'e-mail n\'a pas pu être envoyé.'
        ).then(function () {
          return result;
        });
      })
      .catch(function (err) {
        var errMsg = (err && err.message) || 'Erreur réseau pendant l\'envoi.';
        return fireResult('error', 'Échec de l\'envoi', errMsg).then(function () {
          throw err;
        });
      });
  }

  // Lie la confirmation SweetAlert aux formulaires concernés.
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

  // Consomme et affiche le flash toast serveur.
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
    runEmailSend: runEmailSend,
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
