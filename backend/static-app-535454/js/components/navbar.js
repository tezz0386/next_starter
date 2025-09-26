/* Sticky, responsive navbar with active link highlight on scroll */
(function () {
  // Mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  function toggleMobileMenu() {
    if (!mobileMenu) return;
    const isHidden = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden', !isHidden);
  }
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', toggleMobileMenu);
  }

  // Active link highlight on scroll
  function setActiveNav() {
    const sections = [
      { id: 'home', anchor: document.querySelector('a[href="#home"]') },
      { id: 'features', anchor: document.querySelector('a[href="#features"]') },
      { id: 'shop', anchor: document.querySelector('a[href="#shop"]') },
    ];
    const fromTop = window.scrollY + 80;
    sections.forEach(item => {
      const section = document.getElementById(item.id);
      if (section) {
        if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) {
          item.anchor?.classList.add('active');
        } else {
          item.anchor?.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', debounce(setActiveNav, 100));
  window.addEventListener('load', setActiveNav);

  // Smooth jump for hash links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1 && href.startsWith('#')) {
        e.preventDefault();
        scrollToSection(href.substring(1));
        // Close mobile menu if open
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
          mobileMenu.classList.add('hidden');
        }
      }
    });
  });
})();
