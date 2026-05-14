(function (win) {
  'use strict';

  function normalizeBase(url) {
    if (!url) return 'http://localhost:3000';
    return String(url).replace(/\/$/, '');
  }

  function resolveApiBaseUrl() {
    if (win.API_BASE_URL_OVERRIDE) {
      return normalizeBase(win.API_BASE_URL_OVERRIDE);
    }
    var loc = win.location;
    if (!loc || loc.protocol === 'file:') {
      return 'http://localhost:3000';
    }
    return normalizeBase(loc.origin);
  }

  win.API_BASE_URL = resolveApiBaseUrl();

  /**
   * @param {string} path - path starting with /api/...
   * @param {RequestInit & { body?: object, auth?: boolean }} init
   * @returns {Promise<{ ok: boolean, status: number, data: object }>}
   */
  win.apiFetch = async function apiFetch(path, init) {
    init = init || {};
    var method = init.method || 'GET';
    var headers = Object.assign({}, init.headers);
    var body = init.body;

    if (body != null && typeof body === 'object' && !(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }

    var auth = init.auth !== false;
    if (auth && win.localStorage) {
      var token = win.localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
    }

    var url = win.API_BASE_URL + path;
    var res = await fetch(url, Object.assign({}, init, {
      method: method,
      headers: headers,
      body: body
    }));

    var text = await res.text();
    var data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { message: text };
      }
    }
    return { ok: res.ok, status: res.status, data: data };
  };
})(typeof window !== 'undefined' ? window : globalThis);
