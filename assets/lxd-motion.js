/* LXD motion: stepped text reveal, drafting crosshair on the hero grid. Hard steps only, no fades. Off under reduced motion where it animates. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 02 stepped reveal: text types in, one character per step, no layout shift */
  function typeIn(el) {
    var full = el.textContent.trim();
    if (!full || el.children.length) return null;
    el.innerHTML = '<span class="sr">' + full + '</span><span aria-hidden="true"><span class="t-on"></span><span class="t-off">' + full + '</span></span>';
    var on = el.querySelector('.t-on'), off = el.querySelector('.t-off'), n = 0;
    return function play() {
      if (reduce) { on.textContent = full; off.textContent = ''; return; }
      var t = setInterval(function () {
        n++; on.textContent = full.slice(0, n); off.textContent = full.slice(n);
        if (n >= full.length) clearInterval(t);
      }, 38);
    };
  }
  var targets = Array.prototype.slice.call(document.querySelectorAll('.metarow span, .eyebrow'));
  var plays = new Map();
  targets.forEach(function (el) { var p = typeIn(el); if (p) plays.set(el, p); });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { var p = plays.get(e.target); if (p) { plays.delete(e.target); p(); } io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    plays.forEach(function (p, el) { io.observe(el); });
  } else { plays.forEach(function (p) { p(); }); }

  /* 03 drafting crosshair on the hero grid (mouse and trackpad only) */
  var hero = document.querySelector('.hero');
  if (hero && hero.querySelector('.hero-portrait') && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    var layer = document.createElement('div'); layer.className = 'xh'; layer.setAttribute('aria-hidden', 'true');
    layer.innerHTML = '<i class="xh-h"></i><i class="xh-v"></i><b class="xh-tag"></b>';
    hero.insertBefore(layer, hero.firstChild);
    var h = layer.querySelector('.xh-h'), v = layer.querySelector('.xh-v'), tag = layer.querySelector('.xh-tag');
    var pins = [], SKIP = 'a, button, .hero-portrait, input, textarea';
    function pt(e) { var r = hero.getBoundingClientRect(); var x = Math.round((e.clientX - r.left) / 24), y = Math.round((e.clientY - r.top) / 24); return { x: x, y: y }; }
    function hide() { layer.classList.remove('on'); }
    hero.addEventListener('pointermove', function (e) {
      if (e.target.closest(SKIP)) { hide(); return; }
      var p = pt(e); layer.classList.add('on');
      h.style.top = p.y * 24 + 'px'; v.style.left = p.x * 24 + 'px';
      tag.textContent = 'X ' + String(p.x).padStart(2, '0') + ' · Y ' + String(p.y).padStart(2, '0');
      tag.style.left = Math.min(p.x * 24 + 8, hero.clientWidth - 110) + 'px'; tag.style.top = Math.max(p.y * 24 - 24, 4) + 'px';
    });
    hero.addEventListener('pointerleave', hide);
    hero.addEventListener('click', function (e) {
      if (e.target.closest(SKIP)) return;
      var p = pt(e), pin = document.createElement('i'); pin.className = 'xh-pin';
      pin.style.left = p.x * 24 + 'px'; pin.style.top = p.y * 24 + 'px';
      var lab = document.createElement('b'); lab.className = 'xh-pinlab'; lab.textContent = p.x + ',' + p.y;
      lab.style.left = p.x * 24 + 10 + 'px'; lab.style.top = p.y * 24 + 8 + 'px';
      layer.appendChild(pin); layer.appendChild(lab); pins.push(pin, lab);
      while (pins.length > 16) layer.removeChild(pins.shift());
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { pins.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); pins = []; } });
  }
})();
