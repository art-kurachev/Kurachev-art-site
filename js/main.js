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
    item.addEventListener('mouseover', () => {
      innerCursor.classList.add('active-cursor');
      maskSize = '30';
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

  const render = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    //Пока координат нет, круг не показываем
    const ready = clientX !== undefined;
    const size = ready ? maskSize : 0;
    const maskVars = `--x:${(clientX || 0)+15}px; --y:${(clientY || 0)+this.scrollY}px;--sizeMask:${size}rem`;
    maskedFirst.style.cssText = maskVars;
    //Тот же круг вырезаем в нижнем тексте, чтобы он не просвечивал по краям букв
    const mRect = maskedFirst.getBoundingClientRect(), bRect = baseFirst.getBoundingClientRect();
    baseFirst.style.cssText = `${maskVars}; --ox:${bRect.left - mRect.left}px; --oy:${bRect.top - mRect.top}px`;
    baseFirst.classList.toggle('maskReady', ready);
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
document.querySelector('.header_menu').addEventListener('mouseover', () => {
  document.querySelector(".cursor").style.width = '0.3125rem';
  document.querySelector(".cursor").style.top = '0.125rem';
  document.querySelector(".cursor").style.height = '0.3125rem';
  document.querySelector(".cursor").style.left = '0.125rem';
})
document.querySelector('.header_menu').addEventListener('mouseleave', () => {
  document.querySelector(".cursor").style.width = '1.875rem';
  document.querySelector(".cursor").style.top = '-1.0625rem';
  document.querySelector(".cursor").style.height = '1.875rem';
  document.querySelector(".cursor").style.left = '-0.9375rem';
})





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
function resizeMoon() {
  const mobile = window.innerWidth <= 768;
  const width = mobile ? document.querySelector('.model-container-moon').clientWidth : window.innerWidth;
  const height = mobile ? width : window.innerHeight;
  cameraMoon.aspect = width / height;
  cameraMoon.updateProjectionMatrix();
  rendererMoon.setSize(width, height);
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
renderer.setSize(innerWidth/1.5, innerHeight/1.5);

renderer.domElement.setAttribute("id", "Church3DObj");
document.querySelector('.model-container-headset').insertBefore(renderer.domElement, document.querySelector('.model-container-headset').firstChild);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

const aLight = new THREE.DirectionalLight(0xffffff, 1.5);
aLight.position.setScalar(10);
sceneHeadset.add(aLight, new THREE.AmbientLight(0xffffff, 0.5));

let loader = new THREE.GLTFLoader();
let obj = null;

if (window.innerWidth > 768) {
  loader.load('./3d/headset/headset.gltf', function(gltf) {
    obj = gltf.scene;
    sceneHeadset.add(obj);
  });
}




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

//Подгоняем 3D-сцены под новый размер окна
window.addEventListener('resize', () => {
  resizeMoon();
  updateHeadsetAngle();

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth/1.5, innerHeight/1.5);
})

//Пустые ссылки в футере не перезагружают страницу
document.querySelectorAll('a[href=""]').forEach((link) => {
  link.addEventListener('click', (e) => e.preventDefault());
})



//Фиксим аватарки при прокрутке
window.addEventListener('scroll', e => {
  const AvaCont = document.querySelector('.fbAvaCont');
  const a = document.querySelector('#feedback')
  let scrollContainer = a.getBoundingClientRect().top;
  let ins = 0.55;

  if (window.innerWidth <= 768) {
    ins = 0.65;
  }

  if (scrollContainer <= 0) {
    AvaCont.style.position = 'fixed';
    AvaCont.style.top = 0;
    let offset = document.querySelector('#feedback').offsetHeight * ins;
  
    if (scrollContainer <= -offset) {
      AvaCont.style.position = 'absolute';
      AvaCont.style.transform = `translateY(${offset}px)`;
    } else {
      AvaCont.style.transform = 'translateY(0)';
    }
  } else {
    AvaCont.style.position = 'absolute';
    AvaCont.style.top = '0';
  }
})

// Активный автор — цветной, остальные аватары приглушены и чёрно-белые.
function updateReviewAvatars() {
  const reviews = document.querySelectorAll('.feedbackItem');
  const avatars = document.querySelectorAll('.fbAvaItem');
  const mobile = window.innerWidth <= 768;
  const threshold = mobile ? -250 : 0;
  const active = reviews[0].getBoundingClientRect().top > threshold ? 0
    : reviews[1].getBoundingClientRect().top > threshold ? 1 : 2;
  avatars.forEach((avatar, index) => avatar.classList.toggle('is-active', index === active));
  const positions = mobile ? ['53.5rem', '78.2rem', '103.5rem'] : ['22rem', '30.2rem', '37.5rem'];
  document.querySelector('.arrowAv').style.top = positions[active];
}
window.addEventListener('scroll', updateReviewAvatars, { passive: true });
window.addEventListener('resize', updateReviewAvatars);
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
