/* Simple modal with fade transitions and accessibility */
(function () {
  const backdrop = document.getElementById('modalBackdrop');
  const modal = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalClose');

  function openModal() {
    if (modal) modal.classList.remove('hidden');
    if (backdrop) backdrop.classList.remove('hidden');
    // Allow keyboard focus trap (simple)
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable.length) focusable[0].focus();
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
    if (backdrop) backdrop.classList.add('hidden');
  }

  // Expose a simple API for other code
  window.openProductModal = function (product) {
    if (!modal) return;
    // Populate modal content
    const title = product?.name || 'Product Preview';
    const price = product?.price || '';
    const nameEl = document.getElementById('modalProductName');
    if (nameEl) nameEl.textContent = `${title} ${price ? `- ${price}` : ''}`;
    openModal();
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
})();
