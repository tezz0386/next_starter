/**
 * Global site logic: init-DOM, dark/light toggle, scroll reveals, and minor interactions.
 * This script relies on jQuery being loaded (as per requirements).
 */

// Ensure DOM ready
$(function () {
  // Scroll reveal: add 'visible' to elements with class 'reveal' when in viewport
  const revealElements = () => {
    const saw = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          saw.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach((el) => saw.observe(el));
  };
  revealElements();

  // Theme toggle on the page (synchronized with navbar.js)
  // If a theme toggle exists on this page, ensure proper initial state
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Update aria-label and content of the toggle as needed
  }

  // Smooth in-page scroll for #home (# Features etc.)
  $('a[href^="#"]').on('click', function (e) {
    const target = this.getAttribute('href');
    if (target && target.length > 1) {
      e.preventDefault();
      const el = $(target);
      if (el.length) {
        $('html, body').animate({ scrollTop: el.offset().top - 60 }, 500);
      }
    }
  });

  // Open modal button (if present on this page)
  $('#openModal').on('click', function () {
    $('#demoModal').removeClass('hidden').css('display', 'flex');
    setTimeout(() => {
      const inner = $('#demoModal .bg-white, #demoModal .bg-slate-800');
      inner.css({ opacity: 1 });
      inner.addClass('scale-100').removeClass('scale-95');
    }, 10);
  });
});

// Additional global init
document.addEventListener('DOMContentLoaded', () => {
  // Basic keyboard shortcut to toggle theme (T)
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') {
      const isDark = document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', !isDark);
      localStorage.setItem('theme', !isDark ? 'dark' : 'light');
    }
  });
});
