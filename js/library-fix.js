/* WildGuard library fixes (2026-10-28 rebuild).
   1. Category search: filters the nine category cards live
      as the user types, with a "no match" message.
   2. Research button: opens an iNaturalist species search in
      a new tab and says so on the page. It never fakes
      internal results.
   3. Species cards on category pages: adds a real "Scan a
      species like this" link to scan.html, so a card click
      is never a dead end. */
(function () {
  'use strict';
  function research() {
    var input = document.getElementById('researchSearch');
    var box = document.getElementById('researchResults');
    var q = input ? input.value.trim() : '';
    if (!box) { return false; }
    box.style.display = 'block';
    if (q.length < 2) {
      box.innerHTML = '<div class="research-result-card"><p>Please type a species name first (at least 2 letters).</p></div>';
      return false;
    }
    var url = 'https://www.inaturalist.org/taxa/search?q=' + encodeURIComponent(q);
    window.open(url, '_blank', 'noopener');
    box.innerHTML = '<div class="research-result-card"><p>Results for <strong>' + q.replace(/</g, '&lt;') + '</strong> open on iNaturalist in a new tab. WildGuard does not show fake internal results.</p>' +
      '<p><a href="' + url + '" target="_blank" rel="noopener">Open the iNaturalist results again</a></p></div>';
    return false;
  }
  window.WildGuardLibraryFix = { research: research };

  document.addEventListener('DOMContentLoaded', function () {
    var search = document.getElementById('categorySearch');
    var grid = document.getElementById('categoryGrid');
    if (search && grid) {
      var empty = document.getElementById('categorySearchEmpty');
      search.addEventListener('input', function () {
        var q = search.value.trim().toLowerCase();
        var shown = 0;
        grid.querySelectorAll('.card[data-name]').forEach(function (card) {
          var name = (card.getAttribute('data-name') || '').toLowerCase();
          var ok = !q || name.indexOf(q) !== -1;
          card.style.display = ok ? '' : 'none';
          if (ok) { shown += 1; }
        });
        if (empty) { empty.hidden = shown !== 0; }
      });
    }
    /* Category pages (mammals.html etc.) have expandable cards
       with no link. Add a real link to the scanner. */
    if (!grid) {
      document.querySelectorAll('.wildlife-card').forEach(function (card) {
        if (card.querySelector('.wg-card-link')) { return; }
        var body = card.querySelector('.card-body');
        if (!body) { return; }
        var a = document.createElement('a');
        a.className = 'wg-card-link';
        a.href = '../scan.html';
        a.textContent = 'Scan a species like this';
        a.style.cssText = 'display:inline-block;margin-top:0.75rem;font-weight:700;';
        body.appendChild(a);
      });
    }
  });
})();
