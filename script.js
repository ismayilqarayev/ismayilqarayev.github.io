(function () {
  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var META = {
    en: {
      title: 'Ismayil Garayev — Computer Specialist & C++ Author',
      desc: 'Ismayil Garayev — computer specialist from Ganja, Azerbaijan. Windows & Linux systems, networks, C++ and Java. Author of a C++ textbook held at the Bodleian Libraries, University of Oxford.',
      empty: 'Nothing found. Try “C++”, “Oxford” or “certificate”.'
    },
    az: {
      title: 'İsmayıl Qarayev — Kompüter mütəxəssisi və C++ müəllifi',
      desc: 'İsmayıl Qarayev — Gəncədən kompüter mütəxəssisi. Windows və Linux sistemləri, şəbəkələr, C++ və Java. Oksfordun Bodleian Kitabxanalarında saxlanılan C++ dərsliyinin müəllifi.',
      empty: 'Nəticə tapılmadı. “C++”, “Oksford” və ya “sertifikat” yazın.'
    }
  };

  // Başlıqda bir dəfə yazılan şüar (hər iki dildə eyni); index.html-dəki mətnlə eyni olmalıdır
  var MOTTO = 'Creating systems driven by strong principles, not by individuals.\nComputer specialist.';

  // Sayt daxili axtarış üçün indeks
  var SEARCH = [
    { href: '#about', en: 'About me', az: 'Haqqımda', sec: ['Section', 'Bölmə'], k: 'about haqqimda bio kim computer specialist komputer mutexessisi' },
    { href: '#book', en: 'Fundamentals of C++ Programming', az: 'C++ Proqramlaşdırmanın Əsasları', sec: ['Book', 'Kitab'], k: 'c++ book kitab textbook derslik fener nesriyyat 2024 muellif author oxford oksford bodleian' },
    { href: '#book', en: 'Bodleian Libraries, Oxford', az: 'Bodleian Kitabxanaları, Oksford', sec: ['Book', 'Kitab'], k: 'oxford oksford bodleian radcliffe library kitabxana university universitet' },
    { href: '#experience', en: 'Computer Technical Specialist — FRITL', az: 'Kompüter texniki mütəxəssisi — FRİTL', sec: ['Experience', 'Təcrübə'], k: 'fritl lyceum lisey ganja gence technical support texniki destek 2022 is work' },
    { href: '#experience', en: 'EKTIS Specialist — Samukh', az: 'EKTİS mütəxəssisi — Samux', sec: ['Experience', 'Təcrübə'], k: 'ektis agrarian aqrar samukh samux kend teserrufati is work' },
    { href: '#experience', en: 'System Administrator — Cherkizovo', az: 'Sistem administratoru — Cherkizovo', sec: ['Experience', 'Təcrübə'], k: 'system administrator sistem admin cherkizovo moscow moskva russia rusiya windows linux network sebeke is work' },
    { href: '#volunteering', en: 'C++ Instructor — Azercell Cup', az: 'C++ təlimçisi — Azercell Cup', sec: ['Volunteering', 'Könüllülük'], k: 'azercell cup volunteer konullu instructor telimci mentor fritl olimpiada' },
    { href: '#education', en: 'Computer Specialist — Baku', az: 'Kompüter mütəxəssisi — Bakı', sec: ['Education', 'Təhsil'], k: 'education tehsil baku baki vocational pese' },
    { href: '#certificates', en: 'Russian language & history certificate', az: 'Rus dili və tarixi sertifikatı', sec: ['Certificate', 'Sertifikat'], k: 'certificate sertifikat russian rus mcko moscow moskva' },
    { href: '#certificates', en: 'Doctor Web Antivirus Certificate', az: 'Doctor Web antivirus sertifikatı', sec: ['Certificate', 'Sertifikat'], k: 'doctor web antivirus certificate sertifikat' },
    { href: '#skills', en: 'Programming: C++, Java', az: 'Proqramlaşdırma: C++, Java', sec: ['Skills', 'Bacarıqlar'], k: 'c++ java programming proqramlasdirma algorithm alqoritm skills bacariq' },
    { href: '#skills', en: 'Windows, Linux, networks', az: 'Windows, Linux, şəbəkələr', sec: ['Skills', 'Bacarıqlar'], k: 'windows linux network sebeke infrastructure infrastruktur skills bacariq' },
    { href: '#languages', en: 'Languages', az: 'Dil bilikləri', sec: ['Languages', 'Dillər'], k: 'language dil azerbaijani azerbaycan russian rus turkish turk english ingilis c1 b1 a1' },
    { href: '#honours', en: 'Letter of Appreciation — Qarabag University', az: 'Təşəkkür məktubu — Qarabağ Universiteti', sec: ['Honour', 'Təltif'], k: 'honour award teltif appreciation tesekkur qarabag karabakh university universitet book donation kitab bagis' },
    { href: '#contact', en: 'Contact details', az: 'Əlaqə məlumatları', sec: ['Contact', 'Əlaqə'], k: 'contact elaqe email e-poct poct linkedin' },
    { href: 'assets/Ismayil-Garayev-CV.pdf', en: 'Download CV (PDF)', az: 'CV-ni yüklə (PDF)', sec: ['File', 'Fayl'], k: 'cv resume pdf download yukle', download: true }
  ];

  function store(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
  }
  function lang() { return root.getAttribute('data-lang') === 'az' ? 'az' : 'en'; }

  // Axtarış üçün mətni sadələşdir: ə→e, ı/İ→i, ş→s və s.
  function norm(s) {
    var map = { 'ə': 'e', 'Ə': 'e', 'ı': 'i', 'İ': 'i', 'ş': 's', 'Ş': 's', 'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ö': 'o', 'Ö': 'o', 'ü': 'u', 'Ü': 'u' };
    return s.replace(/[əƏıİşŞçÇğĞöÖüÜ]/g, function (ch) { return map[ch]; }).toLowerCase();
  }

  // ---- Dil ----
  var langBtn = document.getElementById('langBtn');
  var langMenu = document.getElementById('langMenu');
  var langCur = document.getElementById('langCur');
  var input = document.getElementById('q');

  function setLang(l, save) {
    root.setAttribute('data-lang', l);
    root.lang = l;
    document.title = META[l].title;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', META[l].desc);
    langCur.textContent = l.toUpperCase();
    langMenu.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-checked', String(b.getAttribute('data-set-lang') === l));
    });
    document.querySelectorAll('[data-aria-' + l + ']').forEach(function (el) {
      el.setAttribute('aria-label', el.getAttribute('data-aria-' + l));
    });
    input.setAttribute('placeholder', input.getAttribute('data-ph-' + l));
    if (save) store('lang', l);
    if (!list.hidden) renderResults();
  }

  function closeLangMenu() {
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
  }
  langBtn.addEventListener('click', function () {
    var open = langMenu.hidden;
    langMenu.hidden = !open;
    langBtn.setAttribute('aria-expanded', String(open));
    if (open) closeMenu();
  });
  langMenu.querySelectorAll('[data-set-lang]').forEach(function (b) {
    b.addEventListener('click', function () {
      setLang(b.getAttribute('data-set-lang'), true);
      closeLangMenu();
      langBtn.focus();
    });
  });

  // ---- Tema ----
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var themeBtn = document.getElementById('themeToggle');
  function isDark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : darkQuery.matches;
  }
  function syncThemeBtn() { themeBtn.setAttribute('aria-pressed', String(isDark())); }
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store('theme', next);
    syncThemeBtn();
  });
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', syncThemeBtn);
  syncThemeBtn();

  // ---- Menyu paneli ----
  var menuBtn = document.getElementById('menuToggle');
  var panel = document.getElementById('menuPanel');
  function closeMenu() {
    panel.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) closeLangMenu();
  });
  panel.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });

  document.addEventListener('click', function (e) {
    if (!langMenu.hidden && !langMenu.contains(e.target) && !langBtn.contains(e.target)) closeLangMenu();
    if (!panel.hidden && !panel.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
    if (!list.hidden && !e.target.closest('.search')) closeResults();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!langMenu.hidden) { closeLangMenu(); langBtn.focus(); }
    if (!panel.hidden) { closeMenu(); menuBtn.focus(); }
  });

  // ---- Yazılma animasiyası ----
  // Yazılmamış hissə şəffaf qalır ki, sətirlər yazılarkən yerindən oynamasın
  var typedOn = document.getElementById('typedOn');
  var typedOff = document.getElementById('typedOff');

  function startTyping() {
    if (reduceMotion) return;
    var n = 0;
    typedOn.textContent = '';
    typedOff.textContent = MOTTO;
    function tick() {
      n++;
      typedOn.textContent = MOTTO.slice(0, n);
      typedOff.textContent = MOTTO.slice(n);
      if (n < MOTTO.length) setTimeout(tick, MOTTO[n - 1] === '\n' ? 350 : 40);
    }
    setTimeout(tick, 500);
  }

  // ---- Axtarış ----
  var list = document.getElementById('qList');
  var results = [];
  var active = -1;

  function closeResults() {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  }

  function renderResults() {
    var q = norm(input.value.trim());
    if (!q) { closeResults(); return; }
    var terms = q.split(/\s+/);
    var l = lang(), li = l === 'az' ? 1 : 0;

    results = SEARCH.filter(function (item) {
      var hay = norm(item.en + ' ' + item.az + ' ' + item.k);
      return terms.every(function (t) { return hay.indexOf(t) !== -1; });
    }).slice(0, 6);

    list.innerHTML = '';
    if (!results.length) {
      var empty = document.createElement('li');
      empty.className = 'res-empty';
      empty.textContent = META[l].empty;
      list.appendChild(empty);
    }
    results.forEach(function (item, i) {
      var row = document.createElement('li');
      row.setAttribute('role', 'presentation');
      var a = document.createElement('a');
      a.id = 'res-' + i;
      a.href = item.href;
      a.setAttribute('role', 'option');
      a.setAttribute('aria-selected', 'false');
      if (item.download) a.setAttribute('download', '');
      var label = document.createElement('span');
      label.textContent = item[l];
      var sec = document.createElement('span');
      sec.className = 'res-sec';
      sec.textContent = item.sec[li];
      a.appendChild(label);
      a.appendChild(sec);
      a.addEventListener('click', function () { closeResults(); input.value = ''; });
      row.appendChild(a);
      list.appendChild(row);
    });
    active = -1;
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function setActive(i) {
    var links = list.querySelectorAll('a');
    if (!links.length) return;
    active = (i + links.length) % links.length;
    links.forEach(function (a, j) { a.setAttribute('aria-selected', String(j === active)); });
    input.setAttribute('aria-activedescendant', links[active].id);
  }

  input.addEventListener('input', renderResults);
  input.addEventListener('focus', function () { if (input.value.trim()) renderResults(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (list.hidden) renderResults(); setActive(active + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
    else if (e.key === 'Enter') {
      var links = list.querySelectorAll('a');
      if (!links.length) return;
      e.preventDefault();
      links[active >= 0 ? active : 0].click();
    } else if (e.key === 'Escape') { closeResults(); }
  });

  // ---- E-poçtu kopyala ----
  var copyBtn = document.getElementById('copyEmail');
  if (copyBtn && navigator.clipboard) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(copyBtn.getAttribute('data-copy')).then(function () {
        copyBtn.classList.add('copied');
        setTimeout(function () { copyBtn.classList.remove('copied'); }, 1800);
      });
    });
  } else if (copyBtn) {
    copyBtn.hidden = true;
  }

  // ---- Yuxarı qayıt düyməsi ----
  var toTop = document.getElementById('toTop');
  function onScroll() { toTop.classList.toggle('show', window.scrollY > 700); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Son yenilənmə tarixi və il ----
  var updated = document.getElementById('updated');
  var modified = new Date(document.lastModified);
  if (updated && !isNaN(modified)) {
    var pad = function (x) { return (x < 10 ? '0' : '') + x; };
    updated.textContent = pad(modified.getDate()) + '.' + pad(modified.getMonth() + 1) + '.' + modified.getFullYear();
  }
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  setLang(lang(), false);
  startTyping();
})();
