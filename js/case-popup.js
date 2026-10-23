// Поп-ап кейса СУМ, как на Behance. Флоу: .studio/ux/case-popup-flow.md
// Отдельный файл: если three.js с CDN не загрузится и main.js упадёт, поп-ап всё равно работает.
// Открыт ли поп-ап, решает только хеш #case-sum. DOM меняет syncFromURL(), все закрытия идут через requestClose().
(function () {
  const HASH = '#case-sum';
  const dialog = document.getElementById('case-sum-dialog');
  const trigger = document.querySelector('.projectLink[data-case="sum"]');
  const root = document.documentElement;
  if (!dialog || !trigger) return;

  const behanceUrl = trigger.dataset.behance;

  //Старый браузер без <dialog>: ссылка ведёт на Behance, как раньше
  if (typeof dialog.showModal !== 'function') {
    trigger.href = behanceUrl;
    trigger.target = '_blank';
    trigger.rel = 'noopener';
    trigger.setAttribute('aria-label', 'Открыть кейс СУМ на Behance, в новой вкладке');
    trigger.removeAttribute('aria-haspopup');
    root.classList.remove('case-pending');
    return;
  }

  const title = dialog.querySelector('.case-popup__title');
  const live = dialog.querySelector('.case-popup__live');
  const slides = [...dialog.querySelectorAll('.case-slide')];
  const pageTitle = document.title;
  const caseTitle = title.textContent + ' · Артём Курачев';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 769px)');

  let state = 'closed'; // closed | opening | open | closing
  let lastTrigger = null;
  let openTimer = null;
  let failCount = 0;
  let liveAnnounced = false;

  const isCaseState = () => !!(history.state && history.state.casePopup);


  //Открытие
  function openCase({ push, instant = false }) {
    if (push) history.pushState({ casePopup: 'sum' }, '', HASH);
    else if (!isCaseState()) history.replaceState({ casePopup: 'sum' }, '', HASH);
    //Safari не фокусирует ссылку по клику, поэтому при открытии кликом запоминаем саму ссылку
    showCase(instant, push ? trigger : document.activeElement);
  }

  function showCase(instant, from) {
    state = 'opening';
    lastTrigger = from;

    //Гасим hover главной: mouseleave после открытия может не прийти
    const preview = document.querySelector('.projectPreview');
    if (preview) preview.classList.remove('is-visible');
    trigger.querySelectorAll('.texxt-hover').forEach((el) => el.classList.remove('texxt-hover'));

    root.classList.add('case-open');
    dialog.classList.toggle('no-anim', instant);
    dialog.scrollTop = 0;
    dialog.showModal();
    dialog.scrollTop = 0;
    root.classList.remove('case-pending');
    title.focus({ preventScroll: true });
    document.title = caseTitle;
    document.dispatchEvent(new CustomEvent('casepopup:open'));

    const done = () => { if (state === 'opening') state = 'open'; };
    if (instant) done();
    else openTimer = setTimeout(done, reduceMotion.matches ? 150 : 350);
  }


  //Закрытие
  function requestClose() {
    if (state !== 'open') return;
    if (isCaseState()) history.back(); // → popstate → syncFromURL → hideCase
    else {
      history.replaceState(null, '', location.pathname + location.search);
      hideCase();
    }
  }

  function hideCase({ alreadyClosed = false } = {}) {
    clearTimeout(openTimer);
    state = 'closing';

    const finish = () => {
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
      root.classList.remove('case-open');
      document.title = pageTitle;
      document.dispatchEvent(new CustomEvent('casepopup:close'));

      //С главной фокус возвращаем на ссылку, после прямой ссылки остаётся на body
      if (lastTrigger && lastTrigger !== document.body && document.contains(lastTrigger)) {
        lastTrigger.focus({ preventScroll: true });
      }
      lastTrigger = null;
      state = 'closed';
      //Пока закрывались, могли нажать «вперёд»
      syncFromURL();
    };

    if (alreadyClosed) return finish();
    dialog.classList.remove('no-anim');
    dialog.classList.add('is-closing');
    setTimeout(finish, reduceMotion.matches ? 150 : 200);
  }

  function syncFromURL() {
    const want = location.hash === HASH;
    if (want && state === 'closed') openCase({ push: false });
    if (!want && (state === 'open' || state === 'opening')) hideCase();
  }


  //Слушатели
  trigger.addEventListener('click', (e) => {
    //Cmd/Ctrl/Shift/Alt и средняя кнопка: браузер откроет #case-sum в новой вкладке
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    if (state !== 'closed') return;
    openCase({ push: true });
  });

  //Пока тянутся к клику, начинаем грузить первые два слайда
  const preload = () => {
    slides.slice(0, 2).forEach((slide) => { slide.querySelector('img').loading = 'eager'; });
  };
  trigger.addEventListener('pointerenter', preload, { once: true });
  trigger.addEventListener('focus', preload, { once: true });

  dialog.querySelector('.case-popup__close').addEventListener('click', requestClose);
  dialog.querySelector('.case-popup__back').addEventListener('click', requestClose);

  //Esc идёт через историю и анимацию
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    requestClose();
  });

  //Диалог закрыл сам браузер (повторный Esc в Chrome, «назад» на Android)
  dialog.addEventListener('close', () => {
    if (dialog.open || (state !== 'open' && state !== 'opening')) return;
    const back = isCaseState();
    hideCase({ alreadyClosed: true });
    if (back) history.back();
  });

  //Клик по тёмному фону: только если и нажали, и отпустили на самом фоне
  let downOnBackdrop = false;
  dialog.addEventListener('pointerdown', (e) => {
    downOnBackdrop = e.target === dialog;
  });
  dialog.addEventListener('click', (e) => {
    const hit = downOnBackdrop && e.target === dialog;
    downOnBackdrop = false;
    if (hit && desktop.matches) requestClose();
  });

  window.addEventListener('popstate', syncFromURL);
  window.addEventListener('hashchange', syncFromURL);


  //Слайды: плавное появление, ошибка загрузки, повтор
  function buildError(slide) {
    const box = document.createElement('div');
    const img = slide.querySelector('img');
    box.className = 'case-slide__error';
    box.style.aspectRatio = img.getAttribute('width') + ' / ' + img.getAttribute('height');
    box.innerHTML =
      '<p class="case-slide__error-title">Слайд не загрузился</p>' +
      '<p class="case-slide__error-text">Возможно, пропала связь. Попробуйте ещё раз или откройте кейс на Behance.</p>' +
      '<div class="case-slide__error-actions">' +
        '<button type="button" class="case-slide__retry">Загрузить снова</button>' +
        '<a class="case-slide__behance" target="_blank" rel="noopener">Открыть на Behance<span class="visually-hidden">, откроется в новой вкладке</span></a>' +
      '</div>';
    box.querySelector('.case-slide__behance').href = behanceUrl;
    box.querySelector('.case-slide__retry').addEventListener('click', () => retry(slide));
    slide.appendChild(box);
    return box;
  }

  function retry(slide) {
    const img = slide.querySelector('img');
    const btn = slide.querySelector('.case-slide__retry');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Загружаем…';
    }
    //eager: скрытая (display: none) ленивая картинка не грузится
    const srcset = img.getAttribute('srcset'), src = img.getAttribute('src');
    img.loading = 'eager';
    img.removeAttribute('srcset');
    img.removeAttribute('src');
    img.setAttribute('srcset', srcset);
    img.setAttribute('src', src);
  }

  function onLoad(slide) {
    slide.classList.remove('is-failed');
    slide.classList.add('is-loaded');
  }

  function onError(slide) {
    //Пустой src при повторе тоже даёт error, его пропускаем
    if (!slide.querySelector('img').getAttribute('src')) return;
    slide.classList.add('is-failed');
    const box = slide.querySelector('.case-slide__error') || buildError(slide);
    const btn = box.querySelector('.case-slide__retry');
    btn.disabled = false;
    btn.textContent = 'Загрузить снова';

    failCount++;
    if (failCount >= 2 && !liveAnnounced && live) {
      liveAnnounced = true;
      live.textContent = 'Часть слайдов не загрузилась. Они появятся сами, когда вернётся связь.';
    }
  }

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    img.addEventListener('load', () => onLoad(slide));
    img.addEventListener('error', () => onError(slide));
    if (img.complete && img.naturalWidth) onLoad(slide);
  });

  //Связь вернулась: повторяем все упавшие слайды
  window.addEventListener('online', () => {
    slides.filter((slide) => slide.classList.contains('is-failed')).forEach(retry);
  });


  //Прямая ссылка: под поп-апом запись главной, чтобы «назад» закрывал кейс и оставлял на сайте
  if (location.hash === HASH) {
    if (!isCaseState()) {
      history.replaceState(null, '', location.pathname + location.search);
      history.pushState({ casePopup: 'sum' }, '', HASH);
    }
    openCase({ push: false, instant: true });
  } else {
    root.classList.remove('case-pending');
  }
})();
