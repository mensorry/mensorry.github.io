(function () {
  var HASH = '526b0d41a1741f3c78883e52cfd3a1d7c0747fb0dd3742b96750411bad18ceb4';
  var KEY = 'mensorry_auth';
  var STYLE_ID = 'mensorry-auth-style';
  var OVERLAY_ID = 'mensorry-auth-overlay';

  function isAuthed() {
    try {
      return sessionStorage.getItem(KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function unlock() {
    document.documentElement.classList.remove('mensorry-locked');
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) ov.remove();
    var st = document.getElementById(STYLE_ID);
    if (st) st.remove();
  }

  function injectStyle() {
    if (document.getElementById(STYLE_ID)) return;
    var s = document.createElement('style');
    s.id = STYLE_ID;
    s.textContent =
      'html.mensorry-locked{visibility:hidden!important}' +
      'html.mensorry-locked #mensorry-auth-overlay{visibility:visible!important}' +
      '#mensorry-auth-overlay{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;' +
      'background:#0a0a0b;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;visibility:visible}' +
      '#mensorry-auth-overlay .box{width:min(360px,92vw);background:#131316;border:1px solid #232327;border-radius:16px;' +
      'padding:28px 24px;box-shadow:0 20px 60px rgba(0,0,0,.55)}' +
      '#mensorry-auth-overlay h1{margin:0 0 6px;font-size:22px;letter-spacing:.08em;color:#fafafa;font-weight:700;text-align:center}' +
      '#mensorry-auth-overlay p{margin:0 0 18px;color:#8b8b94;font-size:14px;text-align:center}' +
      '#mensorry-auth-overlay input{width:100%;box-sizing:border-box;background:#18181c;border:1px solid #2e2e35;border-radius:10px;' +
      'color:#e4e4e7;padding:12px 14px;font-size:15px;outline:none}' +
      '#mensorry-auth-overlay input:focus{border-color:#8B5CF6;box-shadow:0 0 0 3px rgba(139,92,246,.25)}' +
      '#mensorry-auth-overlay button{width:100%;margin-top:12px;border:0;border-radius:10px;padding:12px 14px;font-size:15px;' +
      'font-weight:600;color:#fff;background:#8B5CF6;cursor:pointer}' +
      '#mensorry-auth-overlay button:hover{background:#7c3aed}' +
      '#mensorry-auth-overlay .err{margin-top:10px;min-height:18px;color:#f87171;font-size:13px;text-align:center}';
    (document.head || document.documentElement).appendChild(s);
  }

  function showOverlay() {
    if (document.getElementById(OVERLAY_ID)) return;
    var ov = document.createElement('div');
    ov.id = OVERLAY_ID;
    ov.innerHTML =
      '<div class="box">' +
      '<h1>MENSORRY</h1>' +
      '<p>Введите пароль</p>' +
      '<form id="mensorry-auth-form" autocomplete="off">' +
      '<input id="mensorry-auth-pass" type="password" name="password" placeholder="Пароль" autofocus>' +
      '<button type="submit">Войти</button>' +
      '<div class="err" id="mensorry-auth-err"></div>' +
      '</form></div>';
    (document.body || document.documentElement).appendChild(ov);

    var form = document.getElementById('mensorry-auth-form');
    var input = document.getElementById('mensorry-auth-pass');
    var err = document.getElementById('mensorry-auth-err');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      var pwd = input.value || '';
      hashHex(pwd).then(function (hex) {
        if (hex.toLowerCase() === HASH) {
          try {
            sessionStorage.setItem(KEY, '1');
          } catch (e2) {}
          unlock();
        } else {
          err.textContent = 'Неверный пароль';
          input.select();
        }
      }).catch(function () {
        err.textContent = 'Неверный пароль';
      });
    });

    setTimeout(function () {
      try {
        input.focus();
      } catch (e3) {}
    }, 0);
  }

  function hashHex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest('SHA-256', data).then(function (buf) {
      var bytes = new Uint8Array(buf);
      var out = '';
      for (var i = 0; i < bytes.length; i++) {
        out += bytes[i].toString(16).padStart(2, '0');
      }
      return out;
    });
  }

  if (isAuthed()) {
    return;
  }

  document.documentElement.classList.add('mensorry-locked');
  injectStyle();

  if (document.body) {
    showOverlay();
  } else {
    document.addEventListener('DOMContentLoaded', showOverlay);
  }
})();
