// NOVA GAYRİMENKUL — shared site behaviour
(function(){
  "use strict";

  /* Mobile menu */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.querySelector('.mobile-nav');
  if(toggle && mobileNav){
    toggle.addEventListener('click', function(){
      mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', mobileNav.classList.contains('open'));
    });
  }

  /* Highlight active nav link */
  try{
    var path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a, .mobile-nav a').forEach(function(a){
      var href = a.getAttribute('href') || '';
      if(href === path || (path === '' && href === 'index.html')){
        a.classList.add('active');
      }
    });
  }catch(e){}

  /* Cookie consent banner (KVKK / çerez politikası) */
  try{
    var banner = document.getElementById('cookie-banner');
    if(banner){
      var KEY = 'nova_cookie_consent';
      var stored = null;
      try{ stored = localStorage.getItem(KEY); }catch(e){}
      if(!stored){ banner.classList.add('show'); }
      var accept = document.getElementById('cookie-accept');
      var decline = document.getElementById('cookie-decline');
      if(accept){ accept.addEventListener('click', function(){
        try{ localStorage.setItem(KEY,'accepted'); }catch(e){}
        banner.classList.remove('show');
      }); }
      if(decline){ decline.addEventListener('click', function(){
        try{ localStorage.setItem(KEY,'declined'); }catch(e){}
        banner.classList.remove('show');
      }); }
    }
  }catch(e){}

  /* Homepage search widget -> redirects to relevant category page with query params (client-side only, no backend) */
  var searchForm = document.getElementById('nova-search');
  if(searchForm){
    searchForm.addEventListener('submit', function(ev){
      ev.preventDefault();
      var type = searchForm.querySelector('[name=islem]').value;
      var kategori = searchForm.querySelector('[name=kategori]').value;
      var bolge = searchForm.querySelector('[name=bolge]').value;
      var map = {
        'satilik':'satilik.html',
        'kiralik':'kiralik.html',
        'ticari':'ticari-gayrimenkul.html',
        'arsa':'arsa.html',
        'plaza-ofis':'plaza-ofis.html'
      };
      var target = map[type] || map[kategori] || 'satilik.html';
      var params = new URLSearchParams();
      if(bolge) params.set('bolge', bolge);
      if(kategori) params.set('kategori', kategori);
      window.location.href = target + (params.toString() ? ('?' + params.toString()) : '');
    });
  }

  /* Contact / demand forms: client-side only (no backend on static hosting).
     We disclose this and offer a mailto + WhatsApp fallback so the message
     is never silently lost. */
  document.querySelectorAll('form[data-nova-form]').forEach(function(form){
    form.addEventListener('submit', function(ev){
      ev.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function(v,k){ if(v) lines.push(k + ': ' + v); });
      var body = encodeURIComponent(lines.join('\n'));
      var subject = encodeURIComponent('Nova Gayrimenkul – Web Sitesi Talebi');
      var statusBox = form.querySelector('.form-status');
      var mailto = 'mailto:nova_gayrimenkul@hotmail.com?subject=' + subject + '&body=' + body;
      var waText = encodeURIComponent('Merhaba, web sitesi üzerinden iletişim formunu doldurdum:\n' + lines.join('\n'));
      var waLink = 'https://wa.me/905017017908?text=' + waText;
      if(statusBox){
        statusBox.innerHTML = 'Formunuz e-posta istemcinizde hazırlandı. Açılan pencereden gönderebilir, ya da doğrudan ' +
          '<a href="'+waLink+'" target="_blank" rel="noopener">WhatsApp üzerinden</a> bize ulaşabilirsiniz.';
        statusBox.style.display = 'block';
      }
      if(typeof window.gtag === 'function'){
        window.gtag('event', 'form_submit', {event_category: 'lead', event_label: location.pathname});
      }
      window.location.href = mailto;
    });
  });

  /* Simple current year */
  document.querySelectorAll('.cur-year').forEach(function(el){ el.textContent = new Date().getFullYear(); });

  /* GA4 / Google Ads dönüşüm takibi: WhatsApp ve telefon tıklamaları.
     window.gtag tanımlı değilse (GA henüz kurulmadıysa) sessizce hiçbir şey yapmaz. */
  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if(!a) return;
    var href = a.getAttribute('href') || '';
    if(typeof window.gtag !== 'function') return;
    if(/wa\.me|whatsapp/i.test(href)){
      window.gtag('event', 'whatsapp_click', {event_category: 'engagement', event_label: location.pathname});
    } else if(href.indexOf('tel:') === 0){
      window.gtag('event', 'phone_click', {event_category: 'engagement', event_label: location.pathname});
    }
  });
})();
