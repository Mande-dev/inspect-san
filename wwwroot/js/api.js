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
    var suggest = result.suggestDeactivate !== undefined ? result.suggestDeactivate : result.SuggestDeactivate;
    if (ok) {
      // Fermer d'abord les modales Bootstrap pour éviter tout conflit de focus/backdrop
      if (typeof onSuccess === 'function') onSuccess(result);
      showToast(msg || 'OK', 'success');
      return true;
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
    refreshPagination: refreshPagination,
    bindAjaxResult: bindAjaxResult
  };
})(window);
