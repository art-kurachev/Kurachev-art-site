// Общая логика окон Observer и rout; 3D-сцены подключаются событиями projectpopup.
(function () {
  const root = document.documentElement;
  document.querySelectorAll('[data-project-popup]').forEach((trigger) => {
    const dialog = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const close = dialog.querySelector('.iprit-popup__close');
    let previousFocus = null;
    let downOnBackdrop = false;
    let closing = false;
    let generation = 0;

    function requestClose() {
      if (!dialog.open || closing) return;
      closing = true;
      const closingGeneration = generation;
      const pending = [];
      dialog.dispatchEvent(new CustomEvent('projectpopup:beforeclose', {
        detail: { waitUntil: (promise) => pending.push(Promise.resolve(promise)) }
      }));
      if (!pending.length) {
        dialog.close();
        return;
      }
      Promise.allSettled(pending).then(() => {
        if (dialog.open && generation === closingGeneration) dialog.close();
      });
    }

    trigger.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (document.querySelector('dialog[open]')) return;
      previousFocus = trigger;
      generation++;
      closing = false;
      dialog.showModal();
      dialog.scrollTop = 0;
      root.classList.add('iprit-open');
      trigger.setAttribute('aria-expanded', 'true');
      document.dispatchEvent(new CustomEvent('casepopup:open', { detail: { dialog } }));
      close.focus({ preventScroll: true });
      dialog.dispatchEvent(new CustomEvent('projectpopup:open'));
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!event.repeat) trigger.click();
    });
    close.addEventListener('click', requestClose);
    dialog.addEventListener('cancel', (event) => {
      if (!event.cancelable) return;
      event.preventDefault();
      requestClose();
    });
    dialog.addEventListener('close', () => {
      generation++;
      dialog.dispatchEvent(new CustomEvent('projectpopup:close'));
      trigger.setAttribute('aria-expanded', 'false');
      if (!document.querySelector('dialog.iprit-popup[open]')) root.classList.remove('iprit-open');
      if (!document.querySelector('dialog[open]')) document.dispatchEvent(new CustomEvent('casepopup:close'));
      if (previousFocus) previousFocus.focus({ preventScroll: true });
      previousFocus = null;
      closing = false;
    });
    // Escape и удержание фокуса обрабатывает нативный dialog.
    dialog.addEventListener('pointerdown', (event) => { downOnBackdrop = event.target === dialog; });
    dialog.addEventListener('click', (event) => {
      if (downOnBackdrop && event.target === dialog) requestClose();
      downOnBackdrop = false;
    });
    dialog.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
    dialog.addEventListener('keydown', (event) => event.stopPropagation());
  });
}());
