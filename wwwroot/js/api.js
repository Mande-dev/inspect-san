/**
 * Client AJAX Inspect-San (fetch natif).
 * Endpoints Home/*Json et Get* — credentials same-origin (cookie auth).
 * Feedback UI via SweetAlert2 (IspAlert) — api.showToast reste la façade publique.
 */
(function (global) {
  'use strict';

  function showToast(message, type) {
    type = type || 'success';
    if (global.IspAlert && typeof global.IspAlert.notify === 'function') {
      return global.IspAlert.notify(message, type);
    }
    // Repli minimal si swal-theme non chargé
    console.warn('[api.showToast]', type, message);
    return Promise.resolve();
  }

  function buildQuery(params) {
    if (!params) return '';
    var qs = new URLSearchParams();
    Object.keys(params).forEach(function (k) {
      var v = params[k];
      if (v === undefined || v === null || v === '') return;
      qs.append(k, v);
    });
    var s = qs.toString();
    return s ? '?' + s : '';
  }

  async function handleResponse(res) {
    if (res.status === 401 || res.status === 403) {
      showToast('Session expirée ou accès refusé. Redirection…', 'warning');
      setTimeout(function () {
        global.location.href = '/Auth/Login?returnUrl=' + encodeURIComponent(location.pathname + location.search);
      }, 800);
      throw new Error('Unauthorized');
    }
    var ct = res.headers.get('content-type') || '';
    var data = null;
    if (ct.indexOf('application/json') >= 0) {
      data = await res.json();
    } else {
      var text = await res.text();
      if (!res.ok) throw new Error(text || res.statusText || 'Erreur HTTP ' + res.status);
      return text;
    }
    if (!res.ok) {
      var msg = (data && (data.message || data.Message)) || 'Erreur HTTP ' + res.status;
      throw new Error(msg);
    }
    return data;
  }

  async function get(url, params) {
    var res = await fetch(url + buildQuery(params), {
      method: 'GET',
      credentials: 'same-origin',
      headers: { Accept: 'application/json' }
    });
    return handleResponse(res);
  }

  async function post(url, body) {
    var res = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: body === undefined ? undefined : JSON.stringify(body ?? {})
    });
    return handleResponse(res);
  }

  async function withBusy(el, fn) {
    if (!el) return fn();
    var disabled = el.disabled;
    var html = el.innerHTML;
    el.disabled = true;
    try {
      return await fn();
    } finally {
      el.disabled = disabled;
      if (html !== undefined) el.innerHTML = html;
    }
  }

  function esc(s) {
    if (s === null || s === undefined) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function attr(s) {
    return esc(s).replace(/\n/g, ' ');
  }

  /** Lit un data-* via getAttribute (évite le cache capricieux de jQuery .data()). */
  function dataAttr(el, name) {
    if (!el) return '';
    var key = name.indexOf('data-') === 0 ? name : 'data-' + name;
    return el.getAttribute(key) || '';
  }

  function parseJsonAttr(el, name) {
    var raw = dataAttr(el, name);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function formToJson(form, map) {
    var fd = new FormData(form);
    var o = {};
    fd.forEach(function (v, k) {
      if (k === '__RequestVerificationToken') return;
      if (Object.prototype.hasOwnProperty.call(o, k)) {
        if (!Array.isArray(o[k])) o[k] = [o[k]];
        o[k].push(v);
      } else {
        o[k] = v;
      }
    });
    if (typeof map === 'function') return map(o);
    return o;
  }

  function hideModal(el) {
    if (!el || !global.bootstrap) return;
    var m = bootstrap.Modal.getInstance(el) || bootstrap.Modal.getOrCreateInstance(el);
    m.hide();
  }

  /** Restaure body/backdrops après fermeture d'un modal enfant (stack Bootstrap). */
  function restoreModalStack() {
    var open = document.querySelectorAll('.modal.show');
    var backdrops = document.querySelectorAll('.modal-backdrop');
    if (open.length > 0) {
      document.body.classList.add('modal-open');
      // Un backdrop par modal ouvert ; supprimer les orphelins
      while (backdrops.length > open.length) {
        backdrops[backdrops.length - 1].remove();
        backdrops = document.querySelectorAll('.modal-backdrop');
      }
      if (backdrops.length === 0) {
        var bd = document.createElement('div');
        bd.className = 'modal-backdrop fade show';
        document.body.appendChild(bd);
        backdrops = document.querySelectorAll('.modal-backdrop');
      }
      open.forEach(function (m, i) {
        m.style.zIndex = String(1055 + i * 20);
      });
      backdrops.forEach(function (bd, i) {
        bd.style.zIndex = String(1050 + i * 20);
      });
      var top = open[open.length - 1];
      if (top) {
        var focusable = top.querySelector(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable) {
          try { focusable.focus(); } catch (e) { /* ignore */ }
        } else {
          try { top.focus(); } catch (e) { /* ignore */ }
        }
      }
    } else {
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
      document.querySelectorAll('.modal-backdrop').forEach(function (bd) { bd.remove(); });
    }
  }

  function bindStackedModalHandlers(el) {
    if (!el || el.dataset.ispStacked === '1') return;
    el.dataset.ispStacked = '1';
    el.addEventListener('shown.bs.modal', function () {
      var open = Array.prototype.slice.call(document.querySelectorAll('.modal.show'));
      var idx = open.indexOf(el);
      if (idx < 0) idx = Math.max(0, open.length - 1);
      el.style.zIndex = String(1055 + idx * 20);
      document.querySelectorAll('.modal-backdrop').forEach(function (bd, i) {
        bd.style.zIndex = String(1050 + i * 20);
      });
    });
    el.addEventListener('hidden.bs.modal', function () {
      // Laisser Bootstrap finir son cleanup, puis réparer la pile
      setTimeout(restoreModalStack, 10);
    });
  }

  /** Ouvre un modal Bootstrap éventuellement au-dessus d'un autre (stack sûr). */
  function showStackedModal(el) {
    if (!el || !global.bootstrap) return null;
    bindStackedModalHandlers(el);
    var m = bootstrap.Modal.getOrCreateInstance(el);
    m.show();
    return m;
  }

  /**
   * Lightbox image sans Bootstrap Modal (évite body.modal-open / backdrop).
   * opts: { url, title }
   */
  function showImageLightbox(opts) {
    opts = opts || {};
    var url = opts.url || '';
    if (!url) return;
    var title = opts.title || 'Photo';
    var existing = document.getElementById('ispImageLightbox');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'ispImageLightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.style.cssText =
      'position:fixed;inset:0;z-index:2000;background:rgba(0,0,0,.85);' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1rem;';

    var header = document.createElement('div');
    header.style.cssText =
      'width:100%;max-width:960px;display:flex;justify-content:space-between;align-items:center;color:#fff;margin-bottom:.5rem;';
    header.innerHTML =
      '<span style="font-size:.95rem;opacity:.9"></span>' +
      '<button type="button" aria-label="Fermer" style="background:transparent;border:0;color:#fff;font-size:1.5rem;line-height:1;cursor:pointer">&times;</button>';
    header.querySelector('span').textContent = title;

    var img = document.createElement('img');
    img.src = url;
    img.alt = title;
    img.style.cssText = 'max-width:100%;max-height:80vh;object-fit:contain;border-radius:.25rem;';

    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function onKey(e) {
      if (e.key === 'Escape') close();
    }

    header.querySelector('button').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);

    overlay.appendChild(header);
    overlay.appendChild(img);
    document.body.appendChild(overlay);
  }

  function refreshPagination(table) {
    if (!table) return;
    if (table._ispPagination) table._ispPagination.refresh(true);
    else if (typeof global.initTablePagination === 'function') {
      table.dataset.paginated = '';
      global.initTablePagination(table);
    }
  }

  function bindAjaxResult(result, onSuccess) {
    if (!result) return false;
    var ok = result.success !== undefined ? result.success : result.Success;
    var msg = result.message || result.Message || '';
    var title = result.title || result.Title || '';
    var detail = result.detail || result.Detail || '';
    var blocked = result.blocked !== undefined ? result.blocked : result.Blocked;
    var suggest = result.suggestDeactivate !== undefined ? result.suggestDeactivate : result.SuggestDeactivate;
    if (ok) {
      if (typeof onSuccess === 'function') onSuccess(result);
      showToast(msg || 'OK', 'success');
      return true;
    }
    if (blocked || detail || (title && title.indexOf('non autoris') >= 0)) {
      if (global.IspAlert && typeof global.IspAlert.blocked === 'function') {
        global.IspAlert.blocked(msg || 'Cette action ne peut pas être effectuée.', {
          title: title || 'Suppression non autorisée',
          detail: detail || ''
        });
      } else {
        showToast((msg || '') + (detail ? '\n' + detail : ''), 'warning');
      }
      return false;
    }
    showToast(msg || 'Échec', suggest ? 'warning' : 'danger');
    return false;
  }

  function confirmAction(message, opts) {
    if (global.IspAlert && typeof global.IspAlert.confirm === 'function') {
      return global.IspAlert.confirm(message, opts);
    }
    return Promise.resolve(global.confirm(message || 'Confirmer ?'));
  }

  global.api = {
    get: get,
    post: post,
    showToast: showToast,
    confirm: confirmAction,
    withBusy: withBusy,
    esc: esc,
    attr: attr,
    dataAttr: dataAttr,
    parseJsonAttr: parseJsonAttr,
    formToJson: formToJson,
    hideModal: hideModal,
    showStackedModal: showStackedModal,
    restoreModalStack: restoreModalStack,
    showImageLightbox: showImageLightbox,
    refreshPagination: refreshPagination,
    bindAjaxResult: bindAjaxResult
  };
})(window);
