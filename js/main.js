/* ============================================
   KURACHEV.ART - Main JavaScript
   ============================================ */

// --- Константы ---
const CONFIG = {
  preloader: {
    duration: 3500,
    btnDelay: 500,
    strokeDelay: 800,
  },
  scroll: {
    mottoThreshold: 670,
    titleThreshold: 870,
    clipDivisor: 7,
    maskHeightDivisor: 1.2,
  },
  cursor: {
    maskSizeActive: 30,
    headerSmall: { w: '0.3125rem', h: '0.3125rem', t: '0.125rem', l: '0.125rem' },
    headerNormal: { w: '1.875rem', h: '1.875rem', t: '-1.0625rem', l: '-0.9375rem' },
  },
  magnetic: { offset: 33 },
  three: {
    headsetScrollY: 4000,
    headsetScrollX: 5000,
    headsetBobSpeed: 0.5,
    moonRotationSpeed: 0.05,
  },
  feedback: { stickRatio: 0.55, stickRatioMobile: 0.65, mobileThreshold: 768 },
};

// --- Кэш DOM (инициализируется при загрузке) ---
const DOM = {};

function cacheDOM() {
  DOM.preloader = document.querySelector('.preloader');
  DOM.preBtn = document.querySelector('.preBtn');
  DOM.prelogo = document.querySelector('.prelogo');
  DOM.preProc = document.querySelector('.preProc');
  DOM.circleLoadItem = document.querySelector('.circleLoadItem');
  DOM.logotype = document.querySelector('.logotype');
  DOM.cursor = document.querySelector('.cursor');
  DOM.maskedFirst = document.querySelector('.maskedFirst');
  DOM.headerMenu = document.querySelector('.header_menu');
  DOM.fstScrContainer = document.querySelector('.fstScr-container');
  DOM.mottoText = document.querySelector('.motto-text');
  DOM.rightKav = document.querySelector('.rightKav');
  DOM.mottoName = document.querySelector('.mottoName');
  DOM.feedback = document.querySelector('#feedback');
  DOM.fbAvaCont = document.querySelector('.fbAvaCont');
  DOM.arrowAv = document.querySelector('.arrowAv');
  DOM.ava1 = document.querySelector('.ava1');
  DOM.ava2 = document.querySelector('.ava2');
  DOM.ava3 = document.querySelector('.ava3');
  DOM.feedbackItem = document.querySelector('.feedbackItem');
  DOM.item2 = document.querySelector('.item2');
}

cacheDOM();

// --- Утилиты ---
function playSound() {
  const audio = document.getElementById('audio');
  if (audio) audio.play();
}

function strokeAnimate(className) {
  document.querySelectorAll(className).forEach((item, index) => {
    setTimeout(() => item.classList.add('stroke-visible'), 200 * index);
  });
}

function throttle(fn, ms) {
  let last = 0, timer;
  return function (...args) {
    const now = Date.now();
    const remaining = ms - (now - last);
    if (remaining <= 0) {
      if (timer) clearTimeout(timer);
      last = now;
      fn.apply(this, args);
    } else if (!timer) {
      timer = setTimeout(() => { last = Date.now(); timer = null; fn.apply(this, args); }, remaining);
    }
  };
}

// --- Прелоадер ---
function initPreloader() {
  window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

  window.addEventListener('load', () => {
    document.body.style.overflowY = 'hidden';
    DOM.circleLoadItem?.style && (DOM.circleLoadItem.style.strokeDashoffset = '0');

    for (let i = 1; i <= 100; i++) {
      setTimeout(() => {
        if (DOM.preProc) DOM.preProc.textContent = i + '%';
      }, i * 28);
    }

    setTimeout(() => {
      if (!DOM.preBtn) return;
      const preBtnStyle = DOM.preBtn.style;
      setTimeout(() => {
        preBtnStyle.transform = 'translateY(-80%)';
        preBtnStyle.opacity = '1';
      }, CONFIG.preloader.btnDelay);

      DOM.prelogo?.style && (DOM.prelogo.style.transform = 'translateY(-80%)');
      preBtnStyle.pointerEvents = 'auto';
      DOM.circleLoadItem?.style && (DOM.circleLoadItem.style.opacity = '0');
      DOM.preProc?.style && (DOM.preProc.style.opacity = '0', DOM.preProc.style.transform = 'translateY(-50%)');
    }, CONFIG.preloader.duration);
  });

  DOM.preBtn?.addEventListener('click', () => {
    playSound();
    DOM.cursor?.classList.add('active-cursor');
    DOM.prelogo?.style && (DOM.prelogo.style.opacity = '0');
    DOM.preBtn?.style && (DOM.preBtn.style.opacity = '0');
    DOM.preloader?.style && (DOM.preloader.style.zIndex = '-10', DOM.preloader.style.backgroundSize = '0');
    document.body.style.overflowY = 'auto';

    setTimeout(() => {
      strokeAnimate('.fstScrAnimate');
      strokeAnimate('.fstScrAnimateMask');
      strokeAnimate('.artkurachev');
    }, CONFIG.preloader.strokeDelay);
  });
}

// --- Скролл-эффекты (один обработчик) ---
function initScrollEffects() {
  const maskItems = document.querySelectorAll('.mask');
  const clipItems = document.querySelectorAll('.clip-texxt');
  const maskTextItems = document.querySelectorAll('.mask-text-mp');
  const mottoStrokes = document.querySelectorAll('.motto-stroke');
  const mottoPlayed = { motto: false };
  const containerTitles = document.querySelectorAll('.containerTitle');
  const menuContainers = document.querySelectorAll('.menuItemCont');
  const menuItems = document.querySelectorAll('.header_menu_item');
  const mottoText = DOM.mottoText;
  const { mottoThreshold, titleThreshold, clipDivisor, maskHeightDivisor } = CONFIG.scroll;

  const onScroll = () => {
    const scrollY = window.scrollY;
    const vh = window.innerHeight;

    // Mask / clip-path анимации
    maskItems.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      let proc = (vh - top) / clipDivisor;
      proc = Math.max(0, Math.min(proc, 100));
      item.style.clipPath = `inset(0 0 0 ${proc}%)`;
    });

    clipItems.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      let proc = 100 - (vh - top) / clipDivisor;
      proc = Math.max(0, Math.min(proc, 100));
      item.style.clipPath = `inset(0 ${proc}% 0 0)`;
    });

    maskTextItems.forEach((item) => {
      const top = item.getBoundingClientRect().top;
      let proc = vh / maskHeightDivisor - top;
      proc = 100 - proc;
      proc = Math.max(0, Math.min(proc, 100));
      item.style.clipPath = `inset(0 ${proc}% 0 0)`;
    });

    // Анимация цитаты
    if (mottoText?.getBoundingClientRect().top <= mottoThreshold && !mottoPlayed.motto) {
      mottoPlayed.motto = true;
      strokeAnimate('.motto-stroke');
      setTimeout(() => {
        strokeAnimate('.leftKav');
        DOM.rightKav?.style && (DOM.rightKav.style.opacity = '1');
        DOM.mottoName?.classList.add('visibleSeven');
      }, 1000);
    }

    // Анимация заголовков
    containerTitles.forEach((item) => {
      if (item.getBoundingClientRect().top <= titleThreshold) {
        item.classList.add('visibleSeven');
      }
    });

    // Активный пункт меню
    menuContainers.forEach((item, i) => {
      const sectionTop = item.getBoundingClientRect().top;
      if (-item.offsetHeight < sectionTop - 2 && sectionTop - 2 < 0) {
        menuItems.forEach((el) => el.classList.remove('is-active'));
        menuItems[i]?.classList.add('is-active');
      }
    });
  };

  window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
}

// --- Курсор ---
function initCursor() {
  if (!DOM.cursor) return;
  let clientX = 0, clientY = 0;
  let maskSize = 0;
  const cursor = DOM.cursor;

  document.querySelectorAll('.cursorHide').forEach((item) => {
    item.addEventListener('mouseover', () => {
      cursor.classList.add('active-cursor');
      maskSize = String(CONFIG.cursor.maskSizeActive);
    });
    item.addEventListener('mouseleave', () => {
      cursor.classList.remove('active-cursor');
      maskSize = 0;
    });
  });

  document.addEventListener('mousemove', (e) => {
    clientX = e.clientX;
    clientY = e.clientY;
    cursor.classList.remove('hidden-cursor');
    cursor.classList.add('visible-cursor');
  });

  const render = () => {
    cursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    if (DOM.maskedFirst) {
      DOM.maskedFirst.style.cssText = `--x:${clientX + 15}px; --y:${clientY + window.scrollY}px;--sizeMask:${maskSize}rem`;
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
}

document.body.addEventListener('mouseleave', () => {
  DOM.cursor?.classList.add('hidden-cursor');
  DOM.cursor?.classList.remove('visible-cursor');
});

function bindCursorActive(selector) {
  if (!DOM.cursor) return;
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener('mouseover', () => DOM.cursor.classList.add('active-cursor'));
    el.addEventListener('mouseleave', () => DOM.cursor.classList.remove('active-cursor'));
  });
}
bindCursorActive('.strokeAnimateItem');
bindCursorActive('.footerStroke');

// Меню — уменьшение курсора
DOM.headerMenu?.addEventListener('mouseover', () => {
  const s = DOM.cursor.style;
  const c = CONFIG.cursor.headerSmall;
  s.width = c.w; s.height = c.h; s.top = c.t; s.left = c.l;
});
DOM.headerMenu?.addEventListener('mouseleave', () => {
  const s = DOM.cursor.style;
  const c = CONFIG.cursor.headerNormal;
  s.width = c.w; s.height = c.h; s.top = c.t; s.left = c.l;
});

// --- Магнитная кнопка ---
function initMagnetic() {
  let cur = false;
  const offset = CONFIG.magnetic.offset;

  document.body.addEventListener('mouseenter', (e) => {
    if (e.target.classList.contains('magnetic') && !cur) {
      const rect = e.target.getBoundingClientRect();
      cur = { el: e.target, x: rect.left, y: rect.top };
    }
  }, true);

  document.addEventListener('mousemove', (e) => {
    if (!cur) return;
    const r = cur.el.getBoundingClientRect();
    const x = (e.clientX - cur.x) - r.width / 2;
    const y = (e.clientY - cur.y) - r.height / 2;
    cur.el.style.transform = `translate(${x}px,${y}px)`;
    if (Math.abs(x) >= offset || Math.abs(y) >= offset) {
      cur.el.style.transform = 'translate(0,0)';
      cur = false;
    }
  });
}

// --- Hover на строках ---
document.querySelectorAll('.strokeAnimateItem').forEach((item) => {
  const texxt = item.querySelector('.texxt2');
  if (!texxt) return;
  item.addEventListener('mouseover', () => texxt.classList.add('texxt-hover'));
  item.addEventListener('mouseleave', () => texxt.classList.remove('texxt-hover'));
});
document.querySelectorAll('.footerStroke').forEach((item) => {
  const mask = item.querySelector('.footerMask');
  if (!mask) return;
  item.addEventListener('mouseover', () => mask.classList.add('texxt-hover'));
  item.addEventListener('mouseleave', () => mask.classList.remove('texxt-hover'));
});

// --- Навигация и лого ---
DOM.logotype?.addEventListener('click', () => {
  DOM.fstScrContainer?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('.header_menu_item a').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const id = anchor.getAttribute('href')?.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// --- Three.js: Луна ---
const sceneMoon = new THREE.Scene();
const cameraMoon = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraMoon.position.z = 30;

const rendererMoon = new THREE.WebGLRenderer({ alpha: true });
rendererMoon.setClearColor(0x000000, 0);
rendererMoon.setSize(innerWidth, innerHeight);
rendererMoon.domElement.setAttribute('id', 'Church3DObj');
document.querySelector('.model-container-moon')?.insertBefore(rendererMoon.domElement, document.querySelector('.model-container-moon').firstChild);

new THREE.OrbitControls(cameraMoon, rendererMoon.domElement);
const aLightMoon = new THREE.DirectionalLight(0xffffff, 1.5);
aLightMoon.position.setScalar(10);
sceneMoon.add(aLightMoon, new THREE.AmbientLight(0xffffff, 0.5));

if (window.innerWidth > CONFIG.feedback.mobileThreshold) {
  new THREE.GLTFLoader().load('./3d/moon/moon.gltf', (gltf) => sceneMoon.add(gltf.scene));
}

const clockMoon = new THREE.Clock();
rendererMoon.setAnimationLoop(() => {
  sceneMoon.rotation.y = clockMoon.getElapsedTime() * CONFIG.three.moonRotationSpeed;
  rendererMoon.render(sceneMoon, cameraMoon);
});

// --- Three.js: Наушники ---
const sceneHeadset = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 33;

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(innerWidth / 1.5, innerHeight / 1.5);
renderer.domElement.setAttribute('id', 'Church3DObj');
document.querySelector('.model-container-headset')?.insertBefore(renderer.domElement, document.querySelector('.model-container-headset').firstChild);

new THREE.OrbitControls(camera, renderer.domElement);
const aLight = new THREE.DirectionalLight(0xffffff, 1.5);
aLight.position.setScalar(10);
sceneHeadset.add(aLight, new THREE.AmbientLight(0xffffff, 0.5));

if (window.innerWidth > CONFIG.feedback.mobileThreshold) {
  new THREE.GLTFLoader().load('./3d/headset/headset.gltf', (gltf) => sceneHeadset.add(gltf.scene));
}

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  sceneHeadset.position.y = Math.sin(clock.getElapsedTime() * CONFIG.three.headsetBobSpeed);
  renderer.render(sceneHeadset, camera);
});

// Вращение наушников по скроллу
window.addEventListener('scroll', throttle(() => {
  const sy = window.scrollY;
  sceneHeadset.rotation.y = window.innerHeight + 700 + sy / CONFIG.three.headsetScrollY;
  sceneHeadset.rotation.x = -sy / CONFIG.three.headsetScrollX;
}, 16), { passive: true });

// --- CSS переменная скролла ---
window.addEventListener('scroll', throttle(() => {
  document.body.style.setProperty('--scrollTop', `${window.scrollY}px`);
}, 16), { passive: true });

// --- Инверсия курсора ---
['.net_works', '.logotype', '.prelogo'].forEach((sel) => {
  const el = document.querySelector(sel);
  if (!el || !DOM.cursor) return;
  el.addEventListener('mouseover', () => { DOM.cursor.style.mixBlendMode = 'difference'; });
  el.addEventListener('mouseleave', () => { DOM.cursor.style.mixBlendMode = 'normal'; });
});

// --- Feedback: фиксированные аватарки ---
window.addEventListener('scroll', throttle(() => {
  const AvaCont = DOM.fbAvaCont;
  const feedback = DOM.feedback;
  if (!AvaCont || !feedback) return;

  const scrollTop = feedback.getBoundingClientRect().top;
  const ins = window.innerWidth <= CONFIG.feedback.mobileThreshold
    ? CONFIG.feedback.stickRatioMobile
    : CONFIG.feedback.stickRatio;

  if (scrollTop <= 0) {
    AvaCont.style.position = 'fixed';
    AvaCont.style.top = '0';
    const offset = feedback.offsetHeight * ins;
    if (scrollTop <= -offset) {
      AvaCont.style.position = 'absolute';
      AvaCont.style.transform = `translateY(${offset}px)`;
    } else {
      AvaCont.style.transform = 'translateY(0)';
    }
  } else {
    AvaCont.style.position = 'absolute';
    AvaCont.style.top = '0';
  }
}, 16), { passive: true });

// --- Поведение аватаров ---
window.addEventListener('scroll', throttle(() => {
  const item = DOM.feedbackItem?.getBoundingClientRect().top ?? 0;
  const item2 = DOM.item2?.getBoundingClientRect().top ?? 0;
  const ava1 = DOM.ava1, ava2 = DOM.ava2, ava3 = DOM.ava3;
  const arrow = DOM.arrowAv;
  if (!ava1 || !ava2 || !ava3 || !arrow) return;

  const isMobile = window.innerWidth <= CONFIG.feedback.mobileThreshold;
  const topPos = isMobile ? '53.5rem' : '22rem';
  const midPos = isMobile ? '78.2rem' : '30.2rem';
  const botPos = isMobile ? '103.5rem' : '37.5rem';
  const itt = isMobile ? 250 : 0;

  if (item <= -itt) {
    arrow.style.top = midPos;
    ava1.style.opacity = '0.3';
    ava2.style.opacity = '1';
    if (item2 <= -itt) {
      arrow.style.top = botPos;
      ava2.style.opacity = '0.3';
      ava3.style.opacity = '1';
    } else {
      ava2.style.opacity = '1';
      ava3.style.opacity = '0.3';
    }
  } else {
    ava1.style.opacity = '1';
    ava2.style.opacity = '0.3';
    ava3.style.opacity = '0.3';
    arrow.style.top = topPos;
  }
}, 16), { passive: true });

// --- Инициализация ---
initPreloader();
initScrollEffects();
initCursor();
initMagnetic();
