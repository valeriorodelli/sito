
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
    // un riquadro per spettacolo, in stile locandina: titolo grande, date grandi, posti sotto
    var imgs = { archaic: 'assets/archaic-banner.jpg', cirque: 'assets/smash-158.jpg', karma: 'assets/karmastation.jpg', roma: 'assets/roma-mon-amour.jpg' };
    var cols = { archaic: '#d8b06a', cirque: '#ff8a3d', karma: '#9b6bff', roma: '#3ad6c2', altro: '#ff5fa2' };
    var groups = [], key = {};
    list.forEach(function (d) {
      var k = [d.project, d.en].join('|');
      if (!key[k]) { key[k] = { d: d, places: [], pk: {}, all: [] }; groups.push(key[k]); }
      var g = key[k], pl = [d.venue, d.place].join('|'), dt = new Date(d.date + 'T00:00:00');
      if (!g.pk[pl]) { g.pk[pl] = { venue: d.venue, place: d.place, dates: [] }; g.places.push(g.pk[pl]); }
      g.pk[pl].dates.push(dt); g.all.push(dt);
    });
    function dm(dt, loc) { return dt.getDate() + ' ' + dt.toLocaleDateString(loc, { month: 'short' }).replace('.', ''); }
    function days(dates, loc) {
      var out = [], byMonth = {}, order = [];
      dates.forEach(function (dt) {
        var m = dt.toLocaleDateString(loc, { month: 'short' }).replace('.', '');
        if (!byMonth[m]) { byMonth[m] = []; order.push(m); }
        byMonth[m].push(dt.getDate());
      });
      return order.map(function (m) { return byMonth[m].join(' · ') + ' ' + m; }).join(', ');
    }
    function big(g, loc) {
      var a = g.all[0], z = g.all[g.all.length - 1];
      if (g.all.length === 1) return '<span class="bigday">' + a.getDate() + '</span><span class="bigmonth">' + a.toLocaleDateString(loc, { month: 'long', year: 'numeric' }) + '</span>';
      return '<span class="bigrange">' + dm(a, loc) + ' → ' + dm(z, loc) + '</span><span class="bigmonth">' + g.all.length + (loc === 'it-IT' ? ' date' : ' dates') + '</span>';
    }
    box.innerHTML = '<div class="dates">' + groups.map(function (g) {
      var d = g.d, col = cols[d.project] || cols.altro, img = imgs[d.project];
      var label = names[d.project] ? '<span lang="en">' + esc(d.en) + '</span><span lang="it">' + esc(d.it || d.en) + '</span>' : esc((d.en.split('–')[1] || '').trim());
      var title = names[d.project] ? names[d.project] : esc((d.en.split('–')[0] || d.en).trim());
      var bg = img ? 'background-image:linear-gradient(180deg,rgba(14,13,18,.55),rgba(14,13,18,.92) 65%),url(' + img + ')' : 'background-image:linear-gradient(135deg,' + col + '33,rgba(14,13,18,.95) 70%)';
      var rows = g.places.map(function (p) {
        return '<li><b>' + esc(p.place) + '</b>' + (p.venue ? ' · ' + esc(p.venue) : '') + '<span><span lang="en">' + days(p.dates, 'en-GB') + '</span><span lang="it">' + days(p.dates, 'it-IT') + '</span></span></li>';
      }).join('');
      var href = pages[d.project] || d.link || '';
      var open = href ? '<a class="date-card" href="' + esc(href) + '"' : '<div class="date-card"';
      var close = href ? '</a>' : '</div>';
      return open + ' style="--c:' + col + ';' + bg + '">' +
        '<span class="dlabel">' + label + '</span>' +
        '<span class="dtitle">' + title + '</span>' +
        '<span class="dbig"><span lang="en">' + big(g, 'en-GB') + '</span><span lang="it">' + big(g, 'it-IT') + '</span></span>' +
        '<ul class="dplaces">' + rows + '</ul>' + close;
    }).join('') + '</div>';
  }
  var nb = document.getElementById('news-list');
  if (nb) nb.innerHTML = (window.SITE_NEWS || []).map(function (n) { return '<li><span lang="en">' + esc(n.en) + '</span><span lang="it">' + esc(n.it || n.en) + '</span></li>'; }).join('');
})();
