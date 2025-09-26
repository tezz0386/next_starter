/* Global site logic:
   - Dark/Light mode toggle (localStorage)
   - Scroll reveal animations
   - Keyboard accessibility helpers
*/
(function () {
  const THEME_KEY = 'nv-theme';
  const root = document.documentElement;

  // Init theme from localStorage or system preference
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const preferDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    let theme = saved || (preferDark ? 'dark' : 'light');
    applyTheme(theme);
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.classList.add('dark');
      document.querySelectorAll('[data-theme]').forEach(el => el.setAttribute('data-theme', 'dark'));
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      document.querySelectorAll('[data-theme]').forEach(el => el.setAttribute('data-theme', 'light'));
      root.setAttribute('data-theme', 'light');
    }
    localStorage.setItem(THEME_KEY, theme);
  }

  // Theme toggle button
  function bindThemeToggle() {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isDark = document.documentElement.classList.contains('dark');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // Simple scroll reveal (elements with .reveal)
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    const onScroll = () => {
      const vh = window.innerHeight;
      reveals.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40) {
          el.classList.add('in-view');
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    bindThemeToggle();
    initScrollReveal();
  });
})();
