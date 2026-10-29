/* WildGuard i18n fix (2026-10-28 rebuild).
   The old js/i18n.js only translates elements with data-i18n
   attributes, and no page has any, so the language switch did
   nothing visible. This small shared script translates the
   elements that actually exist: nav, hero, and scan controls,
   using data-wg-i18n attributes. English and Kiswahili only.
   French was removed from the menus because its translations
   were incomplete. Choice is stored in localStorage under the
   same key the old system used: wildguard_language. */
(function () {
  'use strict';
  var DICT = {
    en: {
      navHome: 'Home', navLibrary: 'Library', navScan: 'Scan',
      navAbout: 'About', navContact: 'Contact', signIn: 'Sign In',
      heroKicker: 'TANZANIA - YOUTH-LED CONSERVATION',
      heroTitle: 'Scan. Learn. Act.',
      heroSub: 'Point your phone at wildlife, learn what it is, and support the young Tanzanians documenting it. WildGuard Society is a youth-led conservation project based in Moshi, Kilimanjaro, Tanzania.',
      heroScan: 'Scan wildlife', heroLibrary: 'Explore the library',
      scanTitle: 'What did you find?',
      scanLede: 'Take a clear photo of an animal. The scanner identifies well-known species like lion and elephant, and says honestly when it is not sure. For the best result, wait until the model is ready, then use a clear photo with the animal filling the frame.',
      scanReady: 'Ready when you are',
      scanHint: 'Use your camera or upload a photo.',
      scanCamera: 'Open camera', scanUpload: 'Upload photo',
      scanVoice: 'Voice Command', scanHow: 'How It Works',
      scanSample: 'Try a sample photo',
      scanStatusNone: 'No photo yet. Choose a photo, or try a sample below.',
      scanStatusAnalysing: 'Analysing your photo...',
      scanStatusDenied: 'Camera access was denied. Please allow camera access, or use Upload photo or a sample photo.'
    },
    sw: {
      navHome: 'Nyumbani', navLibrary: 'Maktaba', navScan: 'Skena',
      navAbout: 'Kuhusu', navContact: 'Mawasiliano', signIn: 'Ingia',
      heroKicker: 'TANZANIA - UHIFADHI UNAOONGOZWA NA VIJANA',
      heroTitle: 'Changanua. Jifunze. Chukua hatua.',
      heroSub: 'Elekeza simu yako kwa wanyamapori, jifunze ni nini, na saidia vijana wa Tanzania wanaowaandika. WildGuard Society ni mradi wa uhifadhi unaoongozwa na vijana wenye makao Moshi, Kilimanjaro, Tanzania.',
      heroScan: 'Skena wanyamapori', heroLibrary: 'Chunguza maktaba',
      scanTitle: 'Umepata nini?',
      scanLede: 'Piga picha wazi ya mnyama. Kichanganuzi kinatambua spishi zinazojulikana kama simba na tembo, na kinasema kwa uaminifu pale ambapo hakina uhakika. Kwa matokeo bora, subiri modeli iwe tayari, kisha tumia picha wazi yenye mnyama akijaza fremu.',
      scanReady: 'Tuko tayari',
      scanHint: 'Tumia kamera yako au pakia picha.',
      scanCamera: 'Fungua kamera', scanUpload: 'Pakia picha',
      scanVoice: 'Amri ya sauti', scanHow: 'Inavyofanya kazi',
      scanSample: 'Jaribu picha ya mfano',
      scanStatusNone: 'Bado hakuna picha. Chagua picha, au jaribu mfano hapa chini.',
      scanStatusAnalysing: 'Inachambua picha yako...',
      scanStatusDenied: 'Kamera haikuruhusiwa. Ruhusu kamera, au tumia Pakia picha au picha ya mfano.'
    }
  };
  var NAMES = { en: 'English', sw: 'Kiswahili' };
  var FLAGS = { en: 'assets/images/flags/us.svg', sw: 'assets/images/flags/tz.svg' };

  function getLang() {
    var v = null;
    try { v = localStorage.getItem('wildguard_language'); } catch (e) {}
    return v === 'sw' ? 'sw' : 'en';
  }
  function setLang(lang) {
    lang = lang === 'sw' ? 'sw' : 'en';
    try { localStorage.setItem('wildguard_language', lang); } catch (e) {}
    apply(lang);
  }
  function setTextKeepingIcons(el, text) {
    var replaced = false;
    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (!replaced && node.nodeType === 3 && node.textContent.trim() !== '') {
        node.textContent = ' ' + text;
        replaced = true;
      }
    });
    if (!replaced) { el.textContent = text; }
  }
  function apply(lang) {
    var d = DICT[lang];
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-wg-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-wg-i18n');
      if (d[key]) { setTextKeepingIcons(el, d[key]); }
    });
    /* Nav links have no data attributes in the old markup, so
       translate them by destination, preserving their icons. */
    var navMap = [
      ['index.html', 'navHome'], ['library/library.html', 'navLibrary'],
      ['library.html', 'navLibrary'], ['scan.html', 'navScan'],
      ['about.html', 'navAbout'], ['contact.html', 'navContact']
    ];
    document.querySelectorAll('.desktop-nav a').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      navMap.forEach(function (pair) {
        if (href === pair[0] || href.endsWith('/' + pair[0])) {
          setTextKeepingIcons(a, d[pair[1]]);
        }
      });
    });
    var signin = document.getElementById('signin-btn');
    if (signin && d.signIn) { setTextKeepingIcons(signin, d.signIn); }
    document.querySelectorAll('.lang-toggle').forEach(function (btn) {
      btn.setAttribute('data-lang', lang);
      btn.setAttribute('aria-label', NAMES[lang]);
      var name = btn.querySelector('.lang-name');
      if (name) { name.textContent = NAMES[lang]; }
      var flag = btn.querySelector('.flag-icon');
      if (flag) {
        var src = flag.getAttribute('src') || '';
        var prefix = src.indexOf('../') === 0 ? '../' : '';
        flag.setAttribute('src', prefix + FLAGS[lang]);
      }
    });
    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });
    var status = document.getElementById('wgScanStatus');
    if (status && !status.getAttribute('data-wg-status-set')) {
      status.textContent = d.scanStatusNone;
    }
    window.WGScanText = d;
  }
  document.addEventListener('DOMContentLoaded', function () {
    apply(getLang());
    document.querySelectorAll('.lang-option').forEach(function (opt) {
      opt.addEventListener('click', function () {
        setLang(opt.getAttribute('data-lang'));
      });
    });
  });
  window.WGSetLanguage = setLang;
})();
