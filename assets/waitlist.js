// Waitlist form: formats US numbers as you type, validates, and sends the
// number to the Google Sheet (see apps-script/Code.gs and README.md).
(function () {
  // Paste the Apps Script web app URL here (Deploy > Manage deployments).
  // While it's empty the form refuses signups, so no number is ever lost.
  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbyhBVgMhGUQ2vayx9-d_0346bsTz6-6klv3oHTtW5nfkzV1KbFkJTzveQReCqz490NY/exec';

  var form = document.getElementById('waitlist');
  var field = document.getElementById('phone-field');
  var input = document.getElementById('phone');
  var button = document.getElementById('join');
  var trap = document.getElementById('website');
  var error = document.getElementById('phone-error');
  var consent = document.getElementById('consent');
  var joined = document.getElementById('joined');

  // Where the visitor came from, taken from a tag on the link they used
  // (e.g. the TikTok bio links to mooots.app/?from=tiktok). Untagged = "direct".
  var source = (function () {
    var tag = new URLSearchParams(location.search).get('from') || '';
    tag = tag.toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 30);
    return tag || 'direct';
  })();

  // Keep 10 digits, dropping a leading +1 / 1 from pasted numbers.
  function digits(v) {
    var d = String(v || '').replace(/\D/g, '');
    if (d.length > 10 && d.charAt(0) === '1') d = d.slice(1);
    return d.slice(0, 10);
  }

  function format(d) {
    if (d.length === 0) return '';
    if (d.length < 4) return '(' + d;
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function setError(msg) {
    error.textContent = msg;
    field.classList.toggle('err', !!msg);
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  function setBusy(busy) {
    button.disabled = busy;
    button.setAttribute('aria-busy', busy ? 'true' : 'false');
    form.classList.toggle('busy', busy);
  }

  // "Bring a friend": the phone's share sheet, or copy the link on desktop.
  // Shared links are tagged so the sheet shows signups that came from friends.
  var share = document.getElementById('share');
  var shareUrl = 'https://mooots.app/?from=friend';
  share.addEventListener('click', function () {
    if (navigator.share) {
      navigator.share({ title: 'Mooots', text: 'find your people nearby.', url: shareUrl }).catch(function () {});
      return;
    }
    var done = function () {
      share.textContent = 'Link copied';
      setTimeout(function () { share.textContent = 'Bring a friend'; }, 2500);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(done, function () { window.prompt('Copy this link:', shareUrl); });
    } else {
      window.prompt('Copy this link:', shareUrl);
    }
  });

  input.addEventListener('input', function () {
    input.value = format(digits(input.value));
    setError('');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = digits(input.value);
    if (d.length === 0) { setError('Enter your phone number.'); input.focus(); return; }
    if (d.length < 10) { setError('That number looks short. Check it and try again.'); input.focus(); return; }
    if (!ENDPOINT) { setError("Signups aren't open yet. Check back soon."); return; }

    setBusy(true);
    // The sheet also stores the exact consent wording the person agreed to.
    var body = new URLSearchParams({
      phone: '+1' + d,
      consent: consent.textContent.trim(),
      source: source,
      website: trap.value
    });
    // Apps Script doesn't send CORS headers, so the response can't be read.
    // A network failure still rejects, which is the case worth reporting.
    fetch(ENDPOINT, { method: 'POST', mode: 'no-cors', body: body })
      .then(function () {
        form.hidden = true;
        joined.hidden = false;
      })
      .catch(function () {
        setBusy(false);
        setError("Something went wrong. Check your connection and try again.");
      });
  });
})();
