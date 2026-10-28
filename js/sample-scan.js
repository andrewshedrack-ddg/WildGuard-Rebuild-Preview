/* WildGuard sample photos (2026-10-28 rebuild).
   "Try a sample photo" buttons load an existing site image
   into the existing scanner flow (WildlifeScan), so visitors
   can test identification without a camera or their own photo.
   Sample images are the site's own lion, elephant and leopard
   pictures. No new species data is invented. */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    var status = document.getElementById('wgScanStatus');
    function setStatus(text) {
      if (status) {
        status.textContent = text;
        status.setAttribute('data-wg-status-set', '1');
      }
    }
    document.querySelectorAll('[data-sample-photo]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var src = btn.getAttribute('data-sample-photo');
        var name = src.split('/').pop() || 'sample.jpg';
        if (typeof WildlifeScan === 'undefined' || !WildlifeScan.els || !WildlifeScan.els.previewImg) {
          setStatus('Scanner is still loading. Please wait a moment, then try again.');
          return;
        }
        var d = window.WGScanText || {};
        setStatus(d.scanStatusAnalysing || 'Analysing your photo...');
        WildlifeScan.lastInputSource = { type: 'sample', name: name.toLowerCase() };
        WildlifeScan.showResultView();
        WildlifeScan.els.previewImg.onload = function () {
          try {
            var r = WildlifeScan.simulateScanAsync(WildlifeScan.els.previewImg.src);
            if (r && r.catch) {
              r.catch(function () {
                setStatus('That scan could not be completed. Please try another sample photo.');
              });
            }
          } catch (e) {
            setStatus('That scan could not be completed. Please try another sample photo.');
          }
        };
        WildlifeScan.els.previewImg.onerror = function () {
          setStatus('That sample photo could not be loaded. Please try another one.');
        };
        WildlifeScan.els.previewImg.src = src;
      });
    });
  });
})();
