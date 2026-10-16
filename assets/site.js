
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
    // raggruppa le date dello stesso spettacolo nello stesso posto
    var groups = [], key = {};
    list.forEach(function (d) {
      var k = [d.project, d.en, d.venue, d.place].join('|');
      if (!key[k]) { key[k] = { d: d, dates: [] }; groups.push(key[k]); }
      key[k].dates.push(new Date(d.date + 'T00:00:00'));
    });
    function fmt(dates, loc) {
      var out = [], byMonth = {};
      dates.forEach(function (dt) {
        var m = dt.toLocaleDateString(loc, { month: 'short', year: 'numeric' });
        (byMonth[m] = byMonth[m] || []).push(dt.getDate());
      });
      Object.keys(byMonth).forEach(function (m) { out.push(byMonth[m].join(' · ') + ' ' + m); });
      return out.join('<br>');
    }
    box.innerHTML = '<div class="dates">' + groups.map(function (g) {
      var d = g.d, proj = names[d.project] ? '<a href="' + pages[d.project] + '">' + names[d.project] + '</a>' : '';
      var title = proj ? proj + (d.en && d.en !== 'Concert' && d.en !== 'Bal folk' ? '' : '') : '';
      var what = '<span lang="en">' + esc(d.en) + '</span><span lang="it">' + esc(d.it || d.en) + '</span>';
      var more = d.link ? '<a class="go" href="' + esc(d.link) + '">info →</a>' : '';
      return '<div class="date-card"><div class="when"><span lang="en">' + fmt(g.dates, 'en-GB') + '</span><span lang="it">' + fmt(g.dates, 'it-IT') + '</span></div>' +
        '<b>' + (proj ? proj + ' · ' : '') + what + '</b>' +
        '<span class="where-d">' + esc(d.venue) + (d.venue && d.place ? ', ' : '') + esc(d.place) + '</span>' + more + '</div>';
    }).join('') + '</div>';
  }
  var nb = document.getElementById('news-list');
  if (nb) nb.innerHTML = (window.SITE_NEWS || []).map(function (n) { return '<li><span lang="en">' + esc(n.en) + '</span><span lang="it">' + esc(n.it || n.en) + '</span></li>'; }).join('');
})();
