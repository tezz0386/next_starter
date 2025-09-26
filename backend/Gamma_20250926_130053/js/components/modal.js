/**
 * Lightweight modal with fade/scale transitions and accessibility
 * Open via #openModal button; closes with overlay or close button
 */
(function () {
  const openBtn = document.getElementById('openModal');
  const modal = document.getElementById('demoModal');
  const closeBtn = document.getElementById('closeModal');
  const modalContent = modal?.querySelector('.bg-white, .bg-slate-800');

  if (!modal) return;

  function openModal() {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    // fade in content
    const inner = modal.querySelector('.bg-white, .bg-slate-800');
    if (inner) inner.style.opacity = '0';
    setTimeout(() => {
      if (inner) inner.style.opacity = '1';
      inner?.classList.add('scale-100');
      inner?.classList.remove('scale-95');
    }, 10);
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const inner = modal.querySelector('.bg-white, .bg-slate-800');
    if (inner) {
      inner.style.opacity = '0';
      inner.classList.remove('scale-100');
      inner.classList.add('scale-95');
    }
    setTimeout(() => {
      modal.style.display = 'none';
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }, 200);
  }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

})();
