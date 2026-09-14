/**
 * Ajoute un bouton œil sur tous les champs type=password.
 * Compatible avec .isp-login-input et wrappe les autres dans .isp-pwd-wrap.
 */
(function () {
  'use strict';

  // Ajoute le bouton œil sur un champ mot de passe.
  function enhance(input) {
    if (!input || input.dataset.ispPwdReady === '1') return;
    if (input.type !== 'password' && input.getAttribute('type') !== 'password') return;

    input.dataset.ispPwdReady = '1';

    var parent = input.parentElement;
    var wrap = parent && (parent.classList.contains('isp-login-input') || parent.classList.contains('isp-pwd-wrap'))
      ? parent
      : null;

    if (!wrap) {
      wrap = document.createElement('div');
      wrap.className = 'isp-pwd-wrap';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
    }

    wrap.classList.add('isp-pwd-has-toggle');

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'isp-pwd-toggle';
    btn.setAttribute('aria-label', 'Afficher le mot de passe');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<i class="ti ti-eye" aria-hidden="true"></i>';

    btn.addEventListener('click', function () {
      var show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      btn.setAttribute('aria-pressed', show ? 'true' : 'false');
      btn.setAttribute('aria-label', show ? 'Masquer le mot de passe' : 'Afficher le mot de passe');
      btn.innerHTML = show
        ? '<i class="ti ti-eye-off" aria-hidden="true"></i>'
        : '<i class="ti ti-eye" aria-hidden="true"></i>';
    });

    wrap.appendChild(btn);
  }

  // Parcourt et enrichit les champs password du DOM.
  function scan(root) {
    (root || document).querySelectorAll('input[type="password"]').forEach(enhance);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { scan(); });
  } else {
    scan();
  }

  // Modals Bootstrap : champs injectés après coup
  document.addEventListener('shown.bs.modal', function (e) {
    scan(e.target);
  });

  // Expose le scan des champs password globalement.
  window.ispEnhancePasswordFields = scan;
})();
