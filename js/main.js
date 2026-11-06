// Прокрутка вверх перед загрузкой
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

// Короткая заставка, затем автоматический вход без звука.
document.body.style.overflowY = 'hidden';
document.addEventListener('DOMContentLoaded', () => {
  if (document.documentElement.classList.contains('skip-preloader')) {
    enterSite({ sound: false });
    return;
  }
  const percent = document.querySelector('.preProc');
  const circle = document.querySelector('.circleLoadItem');
  const started = performance.now();
  function updateIntro(now) {
    const progress = Math.max(0, Math.min((now - started) / 1400, 1));
    percent.textContent = Math.floor(progress * 100) + '%';
    circle.style.strokeDashoffset = 596.9 * (1 - progress);
    if (progress < 1) requestAnimationFrame(updateIntro);
    else setTimeout(() => enterSite({ sound: false }), 100);
  }
  requestAnimationFrame(updateIntro);
});

//Функция проигрывания звука
function playSound() {
  var sound = document.getElementById("audio");
  sound.play();
}

//Вход на сайт по кнопке
let siteEntered = false;
function enterSite({ sound = true } = {}) {
  let preloader = document.querySelector('.preloader');
  const bgVideo = document.querySelector('.bgvideo');
  siteEntered = true;
  //Под открытым кейсом видео не запускаем, оно стартует после закрытия
  if (bgVideo && !document.documentElement.classList.contains('case-open')) bgVideo.play().catch(() => {});

  if (sound) playSound();
  innerCursor.classList.add('active-cursor');
  document.querySelector('.prelogo').style.opacity = 0;
  document.querySelector('.circleLoad').style.opacity = '0';
  document.querySelector('.preProc').style.opacity = '0';
  preloader.style.zIndex = -10;
  preloader.style.backgroundSize = 0;
  document.body.style.overflowY = 'auto';

  setTimeout(() => {
    strokeAnimate ('.fstScrAnimate');
    strokeAnimate ('.fstScrAnimateMask');
    strokeAnimate ('.artkurachev');
  }, 800);
}

//Скролл наверх по лого
document.querySelector('.logotype').onclick = () => {
  document.querySelector('.fstScr-container').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

// Заполнение строки маской
document.querySelectorAll('.mask').forEach((item) => {
  window.addEventListener('scroll', function() {

    let  pepi = item.getBoundingClientRect().top;
    let proc = (window.innerHeight - pepi) / 7;

    proc = Math.max(0, Math.min(proc, 100));
    item.style.clipPath = 'inset(0 0 0 ' + proc + '%)';
  })
})



// Заполнение строки через клип
document.querySelectorAll('.clip-texxt').forEach((item) => {
  window.addEventListener('scroll', function() {

    let  pepi = item.getBoundingClientRect().top;
    let proc = 100 - (window.innerHeight - pepi) / 7;

    proc = Math.max(0, Math.min(proc, 100));
    item.style.clipPath = 'inset(0 ' + proc + '% 0 0)';
  })
})

//Построчное
function StrokeMask (takeClass) {
  document.querySelectorAll(takeClass).forEach((item) => {
    window.addEventListener('scroll', function() {

      //Заливка начинается, когда строка поднялась до 75% высоты экрана,
      //и заканчивается на 45%: растянута на треть экрана, а не на 100px
      let  pepi = item.getBoundingClientRect().top;
      const start = window.innerHeight * 0.75,
            end = window.innerHeight * 0.45;
      let proc = (pepi - end) / (start - end) * 100;

      proc = Math.max(0, Math.min(proc, 100));
      item.style.clipPath = 'inset(0 ' + proc + '% 0 0)';
    })
  })
}
StrokeMask('.mask-text-mp');

//Анимация всплытия текста построчно
function strokeAnimate (className) {
  document.querySelectorAll(className).forEach((item, index) => {
    setTimeout(
      function(){
        item.classList.add('stroke-visible');
      }, 200 * index
    );
  })
}

//Анимация цитаты (запускаем один раз)
let mottoShown = false;
window.addEventListener('scroll', function(){
  if (!mottoShown && document.querySelector('.motto-text').getBoundingClientRect().top <= 670) {
    mottoShown = true;
    strokeAnimate ('.motto-stroke');
    setTimeout( function() {
      strokeAnimate ('.leftKav');
      document.querySelector('.rightKav').style.opacity = 1;
      document.querySelector('.mottoName').classList.add('visibleSeven');
    }, 1000);
  }
})

//Анимация заголовка
document.querySelectorAll('.containerTitle').forEach((item) => {
  window.addEventListener('scroll', function(){
    if (item.getBoundingClientRect().top <= 870) {
      item.classList.add('visibleSeven');
    }
  })
})



// Задаем начальную позицию курсора за пределами экрана
let clientX;
let clientY;
let maskSize = 0;
const innerCursor = document.querySelector(".cursor");

const initCursor = () => {
  //Скрываем курсор на блоках текста
  document.querySelectorAll('.cursorHide').forEach((item) => {
    item.addEventListener('mouseenter', () => {
      innerCursor.classList.add('active-cursor');
      maskSize = 30;
    })
    item.addEventListener('mouseleave', () => {
      innerCursor.classList.remove('active-cursor');
      maskSize = 0;
    })
  })  

  // добавляем прослушиватель для отслеживания текущей позиции мыши
  document.addEventListener("mousemove", e => {
    clientX = e.clientX;
    clientY = e.clientY;
    innerCursor.classList.remove('hidden-cursor');
    innerCursor.classList.add('visible-cursor');
  });

  // преобразуем innerCursor в текущую позицию мыши
  // используем requestAnimationFrame() для плавной работы
  const maskedFirst = document.querySelector('.maskedFirst');
  const baseFirst = document.querySelector('.cursorHide');
  //На телефоне берём координаты пальца
  const touchPos = (e) => {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  };
  document.addEventListener('touchstart', touchPos, { passive: true });
  document.addEventListener('touchmove', touchPos, { passive: true });

  // Позиция и диаметр обеих масок обновляются одним кадром.
  // CSS-переходы mask-position и mask-size рассинхронизировали центр при сжатии.
  let cursorX, cursorY, currentMaskSize = 0, previousFrame;
  const reduceCursorMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const render = (time) => {
    const ready = clientX !== undefined;
    const delta = previousFrame === undefined ? 16 : Math.min(time - previousFrame, 64);
    previousFrame = time;
    if (ready) {
      const follow = reduceCursorMotion.matches ? 1 : 1 - Math.exp(-delta / 65);
      const resize = reduceCursorMotion.matches ? 1 : 1 - Math.exp(-delta / 70);
      cursorX = cursorX === undefined ? clientX : cursorX + (clientX - cursorX) * follow;
      cursorY = cursorY === undefined ? clientY : cursorY + (clientY - cursorY) * follow;
      currentMaskSize += (maskSize - currentMaskSize) * resize;
      if (Math.abs(maskSize - currentMaskSize) < .001) currentMaskSize = maskSize;
      innerCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      const mRect = maskedFirst.getBoundingClientRect(), bRect = baseFirst.getBoundingClientRect();
      const maskVars = `--x:${cursorX - mRect.left}px; --y:${cursorY - mRect.top}px; --sizeMask:${currentMaskSize}rem`;
      maskedFirst.style.cssText = maskVars;
      baseFirst.style.cssText = `${maskVars}; --ox:${bRect.left - mRect.left}px; --oy:${bRect.top - mRect.top}px`;
      baseFirst.classList.add('maskReady');
    }
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
};
initCursor();

//Плавное изчезновение курсора за края документа
document.body.addEventListener('mouseleave', () => {
  innerCursor.classList.add('hidden-cursor');
  innerCursor.classList.remove('visible-cursor');
})


//Скрываем курсор на строках
const links = document.querySelectorAll('.strokeAnimateItem');
for (let i = 0; i < links.length; i++) {
  links[i].addEventListener('mouseover', () => {
    innerCursor.classList.add('active-cursor');
  })
  links[i].addEventListener('mouseleave', () => {
    innerCursor.classList.remove('active-cursor');
  })
}

const foot = document.querySelectorAll('.footerStroke');
for (let i = 0; i < foot.length; i++) {
  foot[i].addEventListener('mouseover', () => {
    innerCursor.classList.add('active-cursor');
  })
  foot[i].addEventListener('mouseleave', () => {
    innerCursor.classList.remove('active-cursor');
  })
}



//Уменьшение курсора в меню
document.querySelector('.header_menu').addEventListener('mouseenter', () => {
  innerCursor.classList.add('cursor--menu');
});
document.querySelector('.header_menu').addEventListener('mouseleave', () => {
  innerCursor.classList.remove('cursor--menu');
});





//Магнитная кнопка
//reach это расстояние от края элемента, с которого он начинает тянуться к курсору.
//pull это сила притяжения: какую часть пути до курсора проходит элемент.
const magnetReach = 40, magnetPull = 0.35;
const magnets = [...document.querySelectorAll('.magnetic')].map((el) => ({ el, x: 0, y: 0 }));

document.addEventListener('mousemove', function(e) {
  magnets.forEach((m) => {
    const rect = m.el.getBoundingClientRect();
    //Центр элемента без учёта текущего смещения
    const cx = rect.left + rect.width / 2 - m.x,
          cy = rect.top + rect.height / 2 - m.y;
    const dx = e.clientX - cx,
          dy = e.clientY - cy;
    const radius = Math.max(rect.width, rect.height) / 2 + magnetReach;

    if (Math.hypot(dx, dy) < radius) {
      m.x = dx * magnetPull;
      m.y = dy * magnetPull;
    } else {
      m.x = 0;
      m.y = 0;
    }
    m.el.style.transform = `translate(${m.x}px,${m.y}px)`;
  });
});

//Возвращаем кнопки на место, когда курсор уходит со страницы
document.addEventListener('mouseleave', () => {
  magnets.forEach((m) => {
    m.x = 0;
    m.y = 0;
    m.el.style.transform = 'translate(0,0)';
  });
});



//Анимация при наведении на строки
document.querySelectorAll('.strokeAnimateItem').forEach((item) => {
  let ishover = item.querySelector('.texxt2');
  item.addEventListener('mouseover', () => {
    ishover.classList.add('texxt-hover')
  })
  item.addEventListener('mouseleave', () => {
    ishover.classList.remove('texxt-hover');
  })
})

document.querySelectorAll('.footerStroke').forEach((item) => {
  let ishover = item.querySelector('.footerMask');
  item.addEventListener('mouseover', () => {
    ishover.classList.add('texxt-hover')
  })
  item.addEventListener('mouseleave', () => {
    ishover.classList.remove('texxt-hover');
  })
})

//Плавный скролл по меню
const anchors = document.querySelectorAll('.header_menu_item a')
for (let anchor of anchors) {
  anchor.addEventListener('click', function (e) {
    e.preventDefault()
    const blockID = anchor.getAttribute('href').substr(1)
    document.getElementById(blockID).scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}



//Определение активного элемента меню
window.addEventListener('scroll', () => {
  document.querySelectorAll('.menuItemCont').forEach((item, i) => {
    let sectionTop = item.getBoundingClientRect().top;
    if (-item.offsetHeight < sectionTop -2 && sectionTop - 2 < 0) {
      let elementMenu = document.querySelectorAll('.header_menu_item');
      elementMenu.forEach((el) => {
        if (el.classList.contains('is-active')) {
          el.classList.remove('is-active')
        }
      })
      elementMenu[i].classList.add('is-active');
    }
  })
});



//3d сцена c луной
let sceneMoon = new THREE.Scene();
let cameraMoon = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
cameraMoon.position.z = 30; // Отдаление камеры

let rendererMoon = new THREE.WebGLRenderer({ alpha: true } );
rendererMoon.setClearColor( 0x000000, 0 );
rendererMoon.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
// Размер сцены задаёт её CSS-контейнер, а не высота окна.
const moonContainer = document.querySelector('.model-container-moon');
const headsetContainer = document.querySelector('.model-container-headset');
function resizeScene(container, sceneCamera, sceneRenderer) {
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;
  sceneCamera.aspect = width / height;
  sceneCamera.updateProjectionMatrix();
  sceneRenderer.setSize(width, height, false);
}
function resizeMoon() {
  resizeScene(moonContainer, cameraMoon, rendererMoon);
}
resizeMoon();

rendererMoon.domElement.setAttribute("id", "Church3DObj");
document.querySelector('.model-container-moon').insertBefore(rendererMoon.domElement, document.querySelector('.model-container-moon').firstChild);

let controlsMoon = new THREE.OrbitControls(cameraMoon, rendererMoon.domElement);

const aLightMoon = new THREE.DirectionalLight(0xffffff, 1.5);
aLightMoon.position.setScalar(10);
sceneMoon.add(aLightMoon, new THREE.AmbientLight(0xffffff, 0.5));

let loaderMoon = new THREE.GLTFLoader();
let objMoon = null;

loaderMoon.load('./3d/moon/moon.gltf', function(gltf) {
  objMoon = gltf.scene;
  sceneMoon.add(objMoon);
});

const reduce3DMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let moonInView = false;
const moonObserver = new IntersectionObserver(([entry]) => { moonInView = entry.isIntersecting; });
moonObserver.observe(document.querySelector('.model-container-moon'));
const renderMoon = (time) => {
  if (!moonInView || document.hidden) return;
  sceneMoon.rotation.y = reduce3DMotion.matches ? 0 : time * 0.00005;
  rendererMoon.render(sceneMoon, cameraMoon);
}
rendererMoon.setAnimationLoop(renderMoon)


//3d сцена c наушниками
let sceneHeadset = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 33; // Отдаление камеры

// Ракурс три четверти остаётся стабильным при разных высотах окна.
function updateHeadsetAngle() {
  const rect = document.querySelector('.sectionSkills').getBoundingClientRect();
  const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top) / rect.height));
  sceneHeadset.rotation.set(-0.12, -Math.PI / 4 + progress * 0.12, 0.08);
}
updateHeadsetAngle();
window.addEventListener('scroll', updateHeadsetAngle, { passive: true });

let renderer = new THREE.WebGLRenderer({ alpha: true } );
renderer.setClearColor( 0x000000, 0 );
function resizeHeadset() {
  resizeScene(headsetContainer, camera, renderer);
}
resizeHeadset();

renderer.domElement.setAttribute("id", "Church3DObj");
document.querySelector('.model-container-headset').insertBefore(renderer.domElement, document.querySelector('.model-container-headset').firstChild);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

const aLight = new THREE.DirectionalLight(0xffffff, 1.5);
aLight.position.setScalar(10);
sceneHeadset.add(aLight, new THREE.AmbientLight(0xffffff, 0.5));

let loader = new THREE.GLTFLoader();
let obj = null;

let headsetLoading = false;
function loadHeadset() {
  if (!headsetContainer.clientWidth || obj || headsetLoading) return;
  headsetLoading = true;
  loader.load('./3d/headset/headset.gltf', function(gltf) {
    obj = gltf.scene;
    sceneHeadset.add(obj);
    headsetLoading = false;
  }, undefined, function(error) {
    headsetLoading = false;
    console.error('Не удалось загрузить наушники:', error);
  });
}
loadHeadset();

const modelResizeObserver = new ResizeObserver((entries) => {
  for (const { target } of entries) {
    if (target === moonContainer) resizeMoon();
    if (target === headsetContainer) {
      resizeHeadset();
      loadHeadset();
    }
  }
});
modelResizeObserver.observe(moonContainer);
modelResizeObserver.observe(headsetContainer);




//Инверсия при наведении
function InverseItem (item) {
  document.querySelector(item).addEventListener('mouseover', function () {
    document.querySelector('.cursor').style.mixBlendMode = 'difference';
  });
  document.querySelector(item).addEventListener('mouseleave', function () {
    document.querySelector('.cursor').style.mixBlendMode = 'normal';
  });
}

InverseItem ('.net_works');
InverseItem ('.logotype');
InverseItem ('.prelogo');

//Пауза 3D и фонового видео, пока открыт кейс (события из js/case-popup.js)
let casePaused = false;
document.addEventListener('casepopup:open', () => {
  const bgVideo = document.querySelector('.bgvideo');
  casePaused = true;
  rendererMoon.setAnimationLoop(null);
  if (bgVideo && !bgVideo.paused) bgVideo.pause();
  innerCursor.classList.add('hidden-cursor');
});
document.addEventListener('casepopup:close', () => {
  const bgVideo = document.querySelector('.bgvideo');
  casePaused = false;
  rendererMoon.setAnimationLoop(renderMoon);
  //Курсор появится сам на следующем движении мыши
  if (bgVideo && siteEntered) bgVideo.play().catch(() => {});
});

//Aнимация up-down наушников
const clock = new THREE.Clock();
let lastElaptedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElaptedTime;
  lastElaptedTime = elapsedTime;

  if (!!sceneHeadset){
    sceneHeadset.position.y = reduce3DMotion.matches ? 0 : Math.sin(elapsedTime * 0.5);
  }
  if (!casePaused) renderer.render(sceneHeadset,camera)

  window.requestAnimationFrame(tick)
}
tick();

//Задаём переменную скролла для CSS
window.addEventListener('scroll', e => {
  document.body.style.setProperty('--scrollTop', `${this.scrollY}px`)
})

// Мобильный параллакс ограничен запасом изображения за краями блока.
function updateMottoParallax() {
  const block = document.querySelector('.motto-container');
  if (window.innerWidth > 768) return;
  const rect = block.getBoundingClientRect();
  const offset = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0
    : Math.max(-32, Math.min(32, (window.innerHeight / 2 - rect.top - rect.height / 2) * 0.08));
  block.style.setProperty('--motto-parallax', offset + 'px');
}
window.addEventListener('scroll', updateMottoParallax, { passive: true });
window.addEventListener('resize', updateMottoParallax);
updateMottoParallax();

// Ракурс учитывает новую высоту окна; размер сцен обновляет ResizeObserver.
window.addEventListener('resize', updateHeadsetAngle);

//Пустые ссылки в футере не перезагружают страницу
document.querySelectorAll('a[href=""]').forEach((link) => {
  link.addEventListener('click', (e) => e.preventDefault());
})



// Автор переключается, когда начало его текста достигает середины экрана.
const feedbackSection = document.querySelector('#feedback');
const reviewItems = [...feedbackSection.querySelectorAll('.feedbackItem')];
const reviewAvatars = [...feedbackSection.querySelectorAll('.fbAvaItem')];
const reviewAvatarContainer = feedbackSection.querySelector('.fbAvaCont');
const reviewArrow = feedbackSection.querySelector('.arrowAv');
let reviewFramePending = false;
let reviewLayoutWidth;

function updateReviewAvatars() {
  const sectionRect = feedbackSection.getBoundingClientRect();
  const stackHeight = reviewAvatarContainer.offsetHeight;
  const anchorTop = Math.max(16, (window.innerHeight - stackHeight) / 2);
  const firstTextTop = reviewItems[0].querySelector('.mpt-stroke').getBoundingClientRect().top;
  const startTop = firstTextTop - sectionRect.top;
  const endTop = Math.max(startTop, feedbackSection.offsetHeight - stackHeight);
  const localTop = anchorTop - sectionRect.top;
  const pinned = localTop >= startTop && localTop <= endTop;
  const top = pinned ? anchorTop : Math.min(endTop, Math.max(startTop, localTop));
  const readingLine = anchorTop + stackHeight / 2;
  let active = 0;
  reviewItems.forEach((review, index) => {
    const text = review.querySelector('.mpt-stroke');
    if (text.getBoundingClientRect().top <= readingLine) active = index;
  });
  const avatar = reviewAvatars[active];
  const arrowY = avatar.offsetTop + (avatar.offsetHeight - reviewArrow.offsetHeight) / 2;

  // Фиксированная колонка не отстаёт от прокрутки на узком экране.
  reviewAvatarContainer.style.position = pinned ? 'fixed' : 'absolute';
  reviewAvatarContainer.style.top = `${top}px`;
  reviewAvatars.forEach((item, index) => {
    item.classList.toggle('is-active', index === active);
  });
  // При смене ширины сразу ставим стрелку на новый центр аватара.
  if (reviewLayoutWidth !== window.innerWidth) {
    reviewArrow.style.transition = 'none';
    reviewLayoutWidth = window.innerWidth;
    reviewArrow.style.transform = `translateY(${arrowY}px)`;
    reviewArrow.getBoundingClientRect();
    reviewArrow.style.removeProperty('transition');
  } else {
    reviewArrow.style.transform = `translateY(${arrowY}px)`;
  }
}
function scheduleReviewUpdate() {
  if (reviewFramePending) return;
  reviewFramePending = true;
  requestAnimationFrame(() => {
    reviewFramePending = false;
    updateReviewAvatars();
  });
}
window.addEventListener('scroll', scheduleReviewUpdate, { passive: true });
window.addEventListener('resize', scheduleReviewUpdate);
const reviewResizeObserver = new ResizeObserver(scheduleReviewUpdate);
[feedbackSection, reviewAvatarContainer, ...reviewItems].forEach((item) => reviewResizeObserver.observe(item));
document.fonts.ready.then(scheduleReviewUpdate);
updateReviewAvatars();

//Превью проекта при наведении
const projectPreview = document.querySelector('.projectPreview');
const projectPreviewImg = projectPreview.querySelector('img');

document.querySelectorAll('.projectLink').forEach((link) => {
  link.addEventListener('mouseenter', () => {
    projectPreviewImg.src = link.dataset.preview;
    projectPreview.classList.add('is-visible');
  });
  link.addEventListener('mouseleave', () => {
    projectPreview.classList.remove('is-visible');
  });
});

document.addEventListener('mousemove', (e) => {
  projectPreview.style.left = `${e.clientX}px`;
  projectPreview.style.top = `${e.clientY}px`;
});
