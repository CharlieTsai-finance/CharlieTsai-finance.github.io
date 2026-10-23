(function () {
  'use strict';

  /* Accordion：button + aria-expanded + aria-controls，允許多項同時展開，預設全部收合 */
  var buttons = document.querySelectorAll('.acc-btn');
  buttons.forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    panel.classList.add('is-closed');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      panel.classList.toggle('is-closed', open);
    });
  });

  /* CTA tracking：只代表「點擊前往表單」，不代表表單送出；不傳任何個資 */
  function trackFormCta(link) {
    try {
      if (typeof window.gtag !== 'function') return;
      var params = {
        cta_location: link.getAttribute('data-cta-location') || 'unknown',
        cta_text: (link.textContent || '').replace(/\s+/g, ' ').trim(),
        destination_url: link.href,
        page_path: location.pathname
      };
      var service = link.getAttribute('data-service');
      if (service) params.service_name = service;
      window.gtag('event', 'form_cta_click', params);
    } catch (err) { /* 追蹤失敗不得影響表單開啟 */ }
  }
  document.querySelectorAll('.js-form-cta').forEach(function (link) {
    link.addEventListener('click', function () { trackFormCta(link); });
    link.addEventListener('auxclick', function (e) { if (e.button === 1) trackFormCta(link); });
  });

  /* Mobile navigation */
  var nav = document.getElementById('site-nav');
  var menu = nav.querySelector('.menu');
  var list = document.getElementById('nav-list');

  function setMenu(open) {
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', open ? 'true' : 'false');
    menu.setAttribute('aria-label', open ? '關閉選單' : '開啟選單');
  }

  menu.addEventListener('click', function () {
    setMenu(menu.getAttribute('aria-expanded') !== 'true');
  });
  list.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  /* 含 Hash 的網址：圖片與字型載入後再校正一次位置，避免版面位移造成偏移 */
  window.addEventListener('load', function () {
    if (!location.hash || location.hash.length < 2) return;
    var target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) { return; }
    if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  });

  window.matchMedia('(min-width: 761px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });
})();
