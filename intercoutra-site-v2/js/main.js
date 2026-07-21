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
