/* =====================================================================
   dramatek-fast.js — يشيل النيون والتأثيرات الثقيلة ويسرّع الصور والحركات
   ضعه كأول سكربت داخل <head> قبل أي سكربت ثاني:
   <script src="dramatek-fast.js"></script>
   ===================================================================== */
(function () {
  'use strict';

  /* ---------- 1) تخفيف المؤقتات (أهم سبب للثقل) ---------- */
  // الموقع فيه عشرات setInterval كل 300-400ms. هنا نخليها كل ثانية كحد أدنى،
  // ونوقفها كلياً لما الصفحة بالخلفية. مؤقتات المشغّل والمشاهدة مستثناة.
  var nativeSI = window.setInterval.bind(window);
  var KEEP = /PL\.ad|PL\.state|PL\.tickT|saveProgress|RV\.id|rvTick/;
  window.setInterval = function (fn, ms) {
    var rest = Array.prototype.slice.call(arguments, 2);
    if (typeof fn !== 'function') return nativeSI.apply(null, arguments);
    var src = '';
    try { src = Function.prototype.toString.call(fn); } catch (e) {}
    if (KEEP.test(src)) return nativeSI.apply(null, [fn, ms].concat(rest));
    var t = (ms || 0) < 1000 ? 1000 : ms;
    return nativeSI.apply(null, [function () {
      if (document.hidden) return;
      return fn.apply(this, arguments);
    }, t].concat(rest));
  };

  /* ---------- 2) إلغاء انتقال الصفحات الثقيل ---------- */
  try { document.startViewTransition = undefined; } catch (e) {}

  /* ---------- 3) CSS: حذف النيون + التمويه + الحركات الثقيلة ---------- */
  var css = [
    /* إلغاء التمويه الخلفي (backdrop-filter) نهائياً */
    'html body *{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}',
    'html body .glass-panel{background:rgba(22,22,26,.97)!important}',
    'html body .stt,html body .st-pill{background:#0a0a0c!important}',

    /* حلقات النيون (البروفايل / الستوري / الرسائل): ثابتة بدون توهج ولا دوران */
    'html body .fire .glow,html body .fire .fl,html body .fire::after,html body .pf-av .fire::after,',
    'html body .nz::after,html body .gx-ring::after,html body .dm-hav::after,',
    'html body #dmEdge,html body .s-card::after,html body .nb-p,html body .set-aurora{display:none!important}',
    'html body .fire .ring,html body .nz::before,html body .gx-ring::before,html body .dm-hav::before{animation:none!important;filter:none!important;will-change:auto!important}',
    'html body .fire .ring{background:var(--nc,#EAB308)!important}',
    'html body .nz::before{background:var(--c,#EAB308)!important}',

    /* إيقاف كل الحركات اللانهائية الزخرفية */
    'html body .gx-plus,html body .gx-bub,html body .gx-bub::before,html body .gx-bub em,',
    'html body .dm-hav,html body .dm-hn,html body .dm-stk,html body .dm-st0,html body .dm-st1,html body .dm-st2,html body .dm-st3,',
    'html body .dm-tst,html body .mv-ic,html body #dmFab,html body .nb-btn.nb-has,html body .nb-btn.nb-has .nb-ico,',
    'html body .nb-hero,html body .nb-hero::after,html body .nb-orb,html body .nb-orb i,html body .set-orb i,html body .set-orb::before,',
    'html body .pf-gear::after,html body .ty-neon,html body .ty-neon i,html body #dmTy b,html body .dm-nzp,',
    'html body .hero-slide.active .hero-bg,html body .hero-slide.active .hero-content>*,html body .mo-img.ld,',
    'html body .mt-acct .nz::before,html body .mt-acct .wl{animation:none!important}',
    'html body #hubModal.dm-nz-frame,html body #hubModal.dm-nz-bub,html body #hubModal[data-bg] #hubBody{animation:none!important}',
    'html body .hero-slide .hero-content>*{opacity:1!important;transform:none!important}',
    'html body .hero-slide .hero-bg{translate:none!important;transform:none!important}',

    /* حذف الظلال المتوهجة */
    'html body .gx-bub,html body .gx-ring,html body .mv-ic,html body .nb-orb,html body .pf-cover,html body .st-studio,',
    'html body .mt-hero,html body .mt-acct,html body .sh-card,html body .dm-hav,html body .dm-nzp,html body .nb-panel,',
    'html body .set-orb,html body .pf-gear,html body .mv-hero,html body .dm-m.me,html body .gx-n .av,html body #dmFab{box-shadow:none!important;text-shadow:none!important}',
    'html body .logo-glow{filter:none!important}',
    'html body .mt-acct .wl span,html body .mt-acct .wl b,html body .ty-neon,html body .dm-hn,html body .gx-bub{text-shadow:none!important}',

    /* حذف التمويه الثقيل على الصور */
    'html body .hbg,html body .mt-acct::before,html body .bgav img,html body .gx-media img{filter:none!important}',

    /* فقاعات الدردشة بدون إطار نيون متدرّج */
    'html body #hubModal.dm-nz-bub .dm-m.me:not(.st):not(.eo){background:linear-gradient(135deg,var(--a),var(--a2))!important;color:var(--on)!important;border:0!important;box-shadow:none!important}',
    'html body #hubModal.dm-nz-bub .dm-m.pe:not(.st):not(.eo){background:#26262c!important;color:#fff!important;border:0!important;box-shadow:none!important}',
    'html body #dmTy.dm-m{background:#16161a!important;border:0!important;box-shadow:none!important}',
    'html body .ty-neon{color:#9ca3af!important}',

    /* ظهور الكروت: بدون حركة، فقط تلاشي بسيط للصور */
    'html body .mo-r,html body .mo-r.in{opacity:1!important;translate:none!important;scale:1!important;transition:none!important}',
    'html body .mo-img{transition:opacity .25s ease!important}',

    /* رسم أسرع للقوائم الطويلة */
    'html body #allGrid>.s-card,html body .ig-grid .it,html body .sr-row{content-visibility:auto;contain-intrinsic-size:auto 230px}',
    'html body img{image-rendering:auto}'
  ].join('\n');

  var st = document.createElement('style');
  st.id = 'dramatek-fast-css';
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);
  // نرجّعه آخر الـ head بعد التحميل حتى يغلب أي ستايل انضاف بعده
  window.addEventListener('load', function () { try { document.head.appendChild(st); } catch (e) {} });

  /* ---------- 4) تسريع تحميل الصور ---------- */
  var SKIP = '#mtHero,#mtAcct,.hero-slide,.gx-v,.pf-av,.fire,#hubModal,.sh-card';
  function fix(img) {
    if (img.__f) return; img.__f = 1;
    img.decoding = 'async';
    if (img.closest && img.closest(SKIP)) {
      if (img.closest('#mtHero') && img === img.parentNode.firstElementChild) img.setAttribute('fetchpriority', 'high');
      return;
    }
    if (!img.hasAttribute('loading') || img.loading === 'eager') img.loading = 'lazy';
    if (!img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'low');
  }
  function scan(root) {
    if (root.nodeType !== 1) return;
    if (root.tagName === 'IMG') fix(root);
    var l = root.querySelectorAll ? root.querySelectorAll('img') : [];
    for (var i = 0; i < l.length; i++) fix(l[i]);
  }
  var queue = [], pending = false;
  function flush() {
    pending = false;
    var q = queue; queue = [];
    for (var i = 0; i < q.length; i++) scan(q[i]);
  }
  function start() {
    scan(document.body);
    new MutationObserver(function (ms) {
      for (var i = 0; i < ms.length; i++) {
        var a = ms[i].addedNodes;
        for (var j = 0; j < a.length; j++) if (a[j].nodeType === 1) queue.push(a[j]);
      }
      if (queue.length && !pending) {
        pending = true;
        (window.requestIdleCallback || function (f) { return setTimeout(f, 60); })(flush, { timeout: 400 });
      }
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
