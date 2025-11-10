document.addEventListener('DOMContentLoaded', function() {
  var scrollBtn = document.getElementById('scrollBtn');
  var aboutSection = document.getElementById('about');
  var backToTop = document.getElementById('backToTop');

  // Scroll to About section
  scrollBtn.addEventListener('click', function() {
    aboutSection.scrollIntoView();
  });

  // Show/hide Back to Top button
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      backToTop.style.display = 'flex';
    } else {
      backToTop.style.display = 'none';
    }
  });

  backToTop.addEventListener('click', function() {
    window.scrollTo(0, 0);
  });
});
