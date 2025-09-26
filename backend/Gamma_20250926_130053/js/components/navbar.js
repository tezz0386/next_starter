/**
 * Navbar: mobile toggle, active link highlight on scroll (in-page)
 * This file is loaded on all pages to provide a consistent experience.
 */

(function () {
  const mobileBtn = document.getElementById('mobileMenuButton');
  const mobileMenu = document.getElementById('mobileMenu');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const root = document.documentElement;

  // Mobile menu toggle
  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const hidden = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !hidden);
    });
  }

  // Theme toggle (dark/light) stored in localStorage
  function setTheme(isDark) {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      // swap icon to sun
      themeIcon.innerHTML = `
        <path d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.71.71a1 1 0 11-1.42 1.42l-.71-.71a1 1 0 010-1.42zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm7 7a1 1 0 011-1h0a1 1 0 110 2h0a1 1 0 01-1-1zM4.22 15.78a1 1 0 010-1.42l.71-.71a1 1 0 111.42 1.42l-.71.71a1 1 0 01-1.42 0zM10 17a3 3 0 100-6 3 3 0 000 6z" />
      `;
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      themeIcon.innerHTML = `
        <path d="M17.293 13.293A8 8 0 016.707 2.707 8.003 8.003 0 1016 18a7.96 7.96 0 001.293-.707z" />
      `;
    }
  }

  // Init theme from localStorage
  (function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setTheme(true);
    else if (saved === 'light') setTheme(false);
    else {
      // default to system preference if available
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark);
    }
  })();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(!isDark);
    });
  }

  // Active link highlight on scroll (for index.html in-page sections)
  function highlightOnScroll() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const top = window.scrollY + 60; // a bit offset
    let currentId = '';
    sections.forEach((sec) => {
      if (sec.offsetTop <= top) currentId = sec.id;
    });
    // remove existing active
    document.querySelectorAll('.nav-link').forEach((el) => {
      el.classList.remove('bg-gray-100', 'text-gray-900');
    });
    if (currentId) {
      document.querySelectorAll(`.nav-link[href*="${currentId}"]`).forEach((el) => {
        el.classList.add('bg-gray-100', 'dark:bg-slate-800');
        // Ensure this is visible in shipped links on index.html
      });
    }
  }

  window.addEventListener('scroll', debounce(highlightOnScroll, 100));

  // Init highlight on load
  document.addEventListener('DOMContentLoaded', highlightOnScroll);
})();
