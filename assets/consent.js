/* Einwilligung für Google Analytics (GA4). Ohne Zustimmung wird nichts von Google geladen.
   Auswahl liegt in localStorage unter "jz-consent" ("granted" | "denied").
   Links mit data-consent-open öffnen den Banner erneut (Cookie-Einstellungen).
   Beide Knöpfe gleich gewichtet (kein Nudging). Consent Mode v2: Werbe-Signale immer "denied",
   Google Signals und Anzeigen-Personalisierung aus. */
(function () {
  var GA_ID = 'G-8LDCBMKW6Z';
  var KEY = 'jz-consent';

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  var loaded = false;
  function loadGA() {
    window['ga-disable-' + GA_ID] = false;
    if (loaded) {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function removeGACookies() {
    window['ga-disable-' + GA_ID] = true;
    if (loaded) window.gtag('consent', 'update', { analytics_storage: 'denied' });
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        ['', '; domain=' + host, '; domain=.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  var css =
    '.jz-consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:34rem;margin:0 auto;' +
    'background:#E4B7C6;color:#092B4E;border:1.5px solid #092B4E;' +
    'padding:20px;font:15px/1.5 "Open Sans",system-ui,sans-serif;box-shadow:0 8px 32px rgba(7,51,54,.35)}' +
    '.jz-consent[hidden]{display:none}' +
    '.jz-consent p{margin:0 0 14px}' +
    '.jz-consent a{color:#092B4E;text-decoration:underline}' +
    '.jz-consent__btns{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
    '.jz-consent button{font:600 13px/1.2 "Open Sans",system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;' +
    'cursor:pointer;padding:12px 10px;border:1.5px solid #092B4E;background:#092B4E;color:#E4B7C6;border-radius:0}' +
    '.jz-consent button:hover,.jz-consent button:focus-visible{background:#073336;border-color:#073336}';

  var box = null;
  function show() {
    if (box) { box.hidden = false; box.querySelector('button').focus(); return; }
    var st = document.createElement('style');
    st.textContent = css;
    document.head.appendChild(st);
    box = document.createElement('div');
    box.className = 'jz-consent';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie-Einstellungen');
    box.innerHTML =
      '<p>Darf ich mit Google Analytics messen, wie diese Seite genutzt wird? Dafür werden Cookies gesetzt, ' +
      'dabei können Daten an Google in den USA gehen. Ohne deine Zustimmung passiert das nicht, ' +
      'und du kannst sie jederzeit unter „Cookie-Einstellungen“ widerrufen. ' +
      'Mehr in der <a href="datenschutz.html">Datenschutzerklärung</a>.</p>' +
      '<div class="jz-consent__btns">' +
      '<button type="button" class="jz-no">Ablehnen</button>' +
      '<button type="button" class="jz-yes">Zustimmen</button></div>';
    box.querySelector('.jz-yes').addEventListener('click', function () {
      write('granted'); box.hidden = true; loadGA();
    });
    box.querySelector('.jz-no').addEventListener('click', function () {
      write('denied'); box.hidden = true; removeGACookies();
    });
    document.body.appendChild(box);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest ? e.target.closest('[data-consent-open]') : null;
    if (t) { e.preventDefault(); show(); }
  });

  var v = read();
  if (v === 'granted') loadGA();
  else if (v !== 'denied') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show);
    else show();
  }
})();
