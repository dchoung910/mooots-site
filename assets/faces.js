// The logo faces look toward the pointer (or wherever you tap on a phone),
// and tapping the big figures makes them jump. At rest the eyes keep their
// original pose: the outer two looking in at the middle one.
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEADS = [455, 605, 755], HEAD_Y = 312;
  var REST = [19, 0, -19];      // each eye pair's resting x offset from its head's center
  var MAX_X = 18, MAX_Y = 14;   // how far the eyes can travel inside the ring
  var REACH = 260;              // px from a head at which the eyes are fully turned

  var logos = [].slice.call(document.querySelectorAll('svg.logo')).map(function (svg) {
    return { svg: svg, eyes: [].slice.call(svg.querySelectorAll('.eyes')), now: REST.map(function (x) { return [x, 0]; }) };
  });
  var pointer = null, jumpAt = -1e9, JUMP_MS = 560, JUMP_H = 44;
  var jumper = document.querySelector('#mark-jump .jumper');

  function target(logo, i) {
    if (performance.now() - jumpAt < JUMP_MS) return [0, -MAX_Y];  // look up mid-jump
    if (!pointer) return [REST[i], 0];
    var m = logo.svg.getScreenCTM();
    if (!m) return [REST[i], 0];
    var cx = m.a * HEADS[i] + m.e, cy = m.d * HEAD_Y + m.f;
    var dx = pointer[0] - cx, dy = pointer[1] - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(d / REACH, 1);
    return [dx / d * k * MAX_X, dy / d * k * MAX_Y];
  }

  function frame() {
    var t = performance.now();
    logos.forEach(function (logo) {
      logo.eyes.forEach(function (g, i) {
        var want = target(logo, i), now = logo.now[i], ease = reduced ? 1 : 0.18;
        now[0] += (want[0] - now[0]) * ease;
        now[1] += (want[1] - now[1]) * ease;
        // Pairs are drawn at their resting spot, so move by the difference from rest.
        g.setAttribute('transform', 'translate(' + (now[0] - REST[i]).toFixed(2) + ' ' + now[1].toFixed(2) + ')');
      });
    });
    if (jumper) {
      var s = t - jumpAt;
      jumper.setAttribute('transform', s >= 0 && s < JUMP_MS ? 'translate(0 ' + (-JUMP_H * Math.sin(Math.PI * s / JUMP_MS)).toFixed(2) + ')' : '');
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', function (e) { pointer = [e.clientX, e.clientY]; }, { passive: true });
  window.addEventListener('pointerdown', function (e) { pointer = [e.clientX, e.clientY]; }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { pointer = null; });
  window.addEventListener('blur', function () { pointer = null; });

  var btn = document.getElementById('mark-jump');
  if (btn) btn.addEventListener('click', function () {
    if (reduced || performance.now() - jumpAt < JUMP_MS) return;
    jumpAt = performance.now();
  });

  requestAnimationFrame(frame);
})();
