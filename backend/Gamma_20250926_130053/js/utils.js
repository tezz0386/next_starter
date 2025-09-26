/**
 * Reusable utilities
 */

// Debounce: limit how often a function runs
function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      fn.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Date formatter example
function formatDate(date) {
  const d = new Date(date);
  if (Number.isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Smooth scroll to a section by id (eslint-friendly)
function scrollToSection(id) {
  const el = document.querySelector(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
