/* One toggle button: inverts the site (ink and ice swap) and swaps the favicon to match. Remembers the choice. */
(function () {
  var root = document.documentElement, KEY = 'lxd-theme';
  function apply(inv) {
    if (inv) root.setAttribute('data-theme', 'invert'); else root.removeAttribute('data-theme');
    var icon = document.querySelector('link[rel="icon"][type="image/svg+xml"]');
    if (icon) icon.setAttribute('href', icon.getAttribute('href').replace(/favicon(-invert)?\.svg/, inv ? 'favicon-invert.svg' : 'favicon.svg'));
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', inv ? '#0F1418' : '#E1EFFA');
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) btns[i].setAttribute('aria-pressed', inv ? 'true' : 'false');
  }
  function stored() { if (/[?&]theme=invert/.test(location.search)) return true; try { return localStorage.getItem(KEY) === 'invert'; } catch (e) { return false; } }
  function save(inv) { try { localStorage.setItem(KEY, inv ? 'invert' : 'light'); } catch (e) {} }
  apply(stored());
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.theme-toggle') : null;
    if (!b) return;
    var inv = root.getAttribute('data-theme') !== 'invert';
    apply(inv); save(inv);
  });
})();
