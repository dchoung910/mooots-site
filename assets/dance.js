// The logo figures dance (same moves as the app's loading screen): a 2.4s
// burst shortly after the page loads, then again every 5-10 seconds, and
// once more right when someone joins the waitlist (window.mooootsDance).
// Skipped for people who have reduced motion turned on.
(function () {
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var steps = document.querySelectorAll('.logo .dance');
  var canDance = !reduced && steps.length && !!steps[0].beginElement;

  function burst() {
    if (!canDance) return;
    for (var i = 0; i < steps.length; i++) steps[i].beginElement();
  }
  window.mooootsDance = burst;

  if (!canDance) return;
  function loop() {
    // Wait while the tab is in the background so nobody misses it.
    if (!document.hidden) burst();
    setTimeout(loop, 2400 + 5000 + Math.random() * 5000);
  }
  setTimeout(loop, 1200);
})();
