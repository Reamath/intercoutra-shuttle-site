function toggleMobileNav(){
  document.getElementById('mobileNav').classList.toggle('open');
  document.querySelector('.hamburger').classList.toggle('open');
}
// close the mobile menu automatically once a link is tapped
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.mobile-nav a').forEach(function(link){
    link.addEventListener('click', function(){
      document.getElementById('mobileNav').classList.remove('open');
      document.querySelector('.hamburger').classList.remove('open');
    });
  });
});

// Vercel Web Analytics custom-event queue (safe no-op if the script
// hasn't loaded yet, or is blocked by an ad blocker) - tracks the
// ad -> landing page -> book/WhatsApp click funnel per element carrying
// a data-track attribute, e.g. data-track="book_click".
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.va('event', { name: el.dataset.track, page: location.pathname });
    });
  });
});

// Sticky mobile Book Now / WhatsApp bar - shown on small screens on
// marketing pages only (opt out via <body class="no-sticky-cta">, used
// on book.html/admin.html/manage.html where it would duplicate an
// already-visible booking flow).
document.addEventListener('DOMContentLoaded', function () {
  if (document.body.classList.contains('no-sticky-cta')) return;
  const bar = document.createElement('div');
  bar.className = 'mobile-sticky-cta';
  bar.innerHTML =
    '<a href="https://wa.me/27743518384" target="_blank" rel="noopener" class="btn btn-outline-dark btn-sm" data-track="sticky_whatsapp_click">WhatsApp</a>' +
    '<a href="book.html" class="btn btn-red btn-sm" data-track="sticky_book_click">Book Your Seat →</a>';
  document.body.appendChild(bar);
  bar.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      window.va('event', { name: el.dataset.track, page: location.pathname });
    });
  });
});
