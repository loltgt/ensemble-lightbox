function ready() {
  if (document.readyState != 'interactive')
    return;

  const c = (c) => document.createElement(c),
    q = (q) => document.querySelector(q),
    x = (x) => document.getElementById(x);
  var d = c('div'),
    u = c('label'),
    m = c('input'),
    o = c('textarea'),
    r = x('button-lightbox'),
    s = q('#example-3 div');
  u.innerText = ' Allow remote contents';
  m.type = 'checkbox';
  m.id = 'allow-remote';
  m.checked = m.ariaChecked = true;
  o.id = 'options';
  o.readOnly = true;
  o.rows = 19;
  o.cols = 34;

  u.prepend(m);
  d.append(u);
  s.before(d);

  d = c('div');
  d.append(o);
  s.after(d);

  if (/(Mac|iPhone|iPad).+(Version).+(Safari)/.test(navigator.userAgent)) {
    s = q('#example-1 figure:nth-child(2) a');
    s.href = s.href.replace('webm', 'mp4');
    s.title = s.title.replace('WEBM', 'MP4');

    s = contents[4];
    s.sources.reverse();
    s.caption = s.caption.replace('H.264', 'VP9').replace('VP9', 'H.264');
  }

  function out() {
    o.value = JSON.stringify({contents: lightbox.options.contents}, '', '  ');
  }
  function check() {
    if (lightbox) {
      lightbox.opened && lightbox.close();
      r.removeEventListener('click', lightbox.open, true);

      delete lightbox;
    }

    lightbox = new ensemble.Lightbox({
      contents: m.checked ? contents : contents.slice(4)
    });

    m.ariaChecked = m.checked;
    r.addEventListener('click', lightbox.open, true);
    out();
  }

  m.addEventListener('change', check);
  out();
}

document.addEventListener('readystatechange', ready);

