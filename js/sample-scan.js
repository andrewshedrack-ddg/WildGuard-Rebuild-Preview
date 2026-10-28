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
        // 2026-10-28 safety net: whatever the model does, the scan may
        // never spin forever. If no result appears within 30 seconds,
        // stop the spinner and say so plainly.
        if (window._wgSampleTimer) { clearTimeout(window._wgSampleTimer); }
        window._wgSampleTimer = setTimeout(function () {
          var loading = document.getElementById('loadingState');
          var result = document.getElementById('resultState');
          var stillSpinning = loading && loading.style.display !== 'none' &&
            (!result || result.style.display === 'none');
          if (stillSpinning) {
            // 2026-10-28 fix: show the message in the visible loading
            // panel. wgScanStatus lives inside the input view, which
            // showResultView hides, so a message set only there is
            // invisible during a scan.
            var loadingText = document.getElementById('loadingText');
            if (loadingText) {
              loadingText.textContent = 'Scan timed out after 30 seconds with no result. Please click Scan another and try again.';
            }
            setStatus('Scan timed out after 30 seconds with no result. Please click Scan another and try again.');
          }
        }, 30000);
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
