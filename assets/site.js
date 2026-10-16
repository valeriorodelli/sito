
  (function () {
    var root = document.documentElement, saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    var lang = saved || 'en';
    function set(l) {
      root.setAttribute('data-lang', l); root.setAttribute('lang', l);
      document.querySelectorAll('.langs button').forEach(function (b) { b.classList.toggle('on', b.dataset.set === l); });
      try { localStorage.setItem('lang', l); } catch (e) {}
    }
    document.querySelectorAll('.langs button').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.set); }); });
    set(lang);
  })();

(function () {
  var box = document.getElementById('dates-list'); if (!box) return;
  var names = { archaic: 'Archaic Future', cirque: 'Cirque de Loin', karma: 'KarmaStation', roma: 'Roma mon amour' };
  var pages = { archaic: 'archaic-future.html', cirque: 'cirque-de-loin.html', karma: 'karmastation.html', roma: 'roma-mon-amour.html' };
  var today = new Date(); today.setHours(0,0,0,0);
  var list = (window.SITE_DATES || []).filter(function (d) { return new Date(d.date + 'T00:00:00') >= today; })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  function esc(t) { var e = document.createElement('span'); e.textContent = t || ''; return e.innerHTML; }
  if (!list.length) {
    box.innerHTML = '<p class="lead" style="margin:0"><span lang="en">New dates coming soon.</span><span lang="it">Nuove date in arrivo.</span></p>';
  } else {
    box.innerHTML = list.map(function (d) {
      var dt = new Date(d.date + 'T00:00:00');
      var day = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      var giorno = dt.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
      var proj = names[d.project] ? '<a href="' + pages[d.project] + '">' + names[d.project] + '</a>' : '';
      var more = d.link ? ' · <a href="' + esc(d.link) + '">info</a>' : '';
      return '<div class="row"><div class="y"><span lang="en">' + day + '</span><span lang="it">' + giorno + '</span></div><div><b>' + proj + (proj && (d.en || d.it) ? ' · ' : '') + '<span lang="en">' + esc(d.en) + '</span><span lang="it">' + esc(d.it || d.en) + '</span></b><span>' + esc(d.venue) + (d.venue && d.place ? ', ' : '') + esc(d.place) + more + '</span></div></div>';
    }).join('');
  }
  var nb = document.getElementById('news-list');
  if (nb) nb.innerHTML = (window.SITE_NEWS || []).map(function (n) { return '<li><span lang="en">' + esc(n.en) + '</span><span lang="it">' + esc(n.it || n.en) + '</span></li>'; }).join('');
})();
