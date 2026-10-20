// The logo figures dance (same moves as the app's loading screen): a 2.4s
// burst shortly after the page loads, then again every 5-10 seconds.
// Skipped for people who have reduced motion turned on.
(function () {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var steps = document.querySelectorAll('.logo .dance');
  if (!steps.length || !steps[0].beginElement) return;

  function dance() {
    // Wait while the tab is in the background so nobody misses it.
    if (!document.hidden) {
      for (var i = 0; i < steps.length; i++) steps[i].beginElement();
    }
    setTimeout(dance, 2400 + 5000 + Math.random() * 5000);
  }
  setTimeout(dance, 1200);
})();
