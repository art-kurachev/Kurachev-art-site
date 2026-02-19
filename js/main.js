// Прокрутка вверх перед загрузкой
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

// Прелоадер
window.onload = function() {
  document.body.style.overflowY = 'hidden';
  document.querySelector('.circleLoadItem').style.strokeDashoffset = '0';
  setTimeout(() => {

      const preBtn = document.querySelector('.preBtn').style;
      
      setTimeout(()=>{
        preBtn.transform = 'translateY(-80%)';
        preBtn.opacity = 1;
      }, 500);
      
      document.querySelector('.prelogo').style.transform = 'translateY(-80%)';
      preBtn.pointerEvents = 'auto';
      document.querySelector('.circleLoadItem').style.opacity = 0;
      document.querySelector('.preProc').style.opacity = 0;
      document.querySelector('.preProc').style.transform = 'translateY(-50%)';
    }, 3500);
};

//Изменение процента загрузки
for (let i = 1; i < 101; i++) {
  let preProc = document.querySelector('.preProc');
  setTimeout(
    function (){
      preProc.textContent = [i] + '%';
    }
    , [i]*28);
}

//Функция проигрывания звука
function playSound() {
  var sound = document.getElementById("audio");
  sound.play();
}

//Вход на сайт по кнопке
document.querySelector('.preBtn').onclick = () => {
  let preloader = document.querySelector('.preloader');
  const bgVideo = document.querySelector('.bgvideo');
  if (bgVideo) bgVideo.play().catch(() => {});

  playSound();
  innerCursor.classList.add('active-cursor');
  document.querySelector('.prelogo').style.opacity = 0;
  document.querySelector('.preBtn').style.opacity = 0;
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

      let  pepi = item.getBoundingClientRect().top;
      let proc = window.innerHeight / 1.2 - pepi;

      proc = 100 - proc;
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

//Анимация цитаты
window.addEventListener('scroll', function(){
  if (document.querySelector('.motto-text').getBoundingClientRect().top <= 670) {
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
  const render = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`; 
    document.querySelector('.maskedFirst').style.cssText = `--x:${clientX+15}px; --y:${clientY+this.scrollY}px;--sizeMask:${maskSize}rem`;  
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
//offset это расстояние от центра элемента, при котором будет происходить "разрыв" примагничивания.
let offset = 33, cur = false;
document.body.addEventListener('mouseenter', function(e) {
  if(e.target.classList.contains('magnetic') && cur === false) {
    cur = {
        e: e.target,
      x: e.target.getBoundingClientRect().left,
      y: e.target.getBoundingClientRect().top
    };
  }
}, true);

document.addEventListener('mousemove', function(e) {
  if(cur !== false) {
    let x = (e.clientX - cur.x) - (cur.e.getBoundingClientRect().width / 2),
            y = (e.clientY - cur.y) - (cur.e.getBoundingClientRect().height / 2);
    cur.e.style.transform = `translate(${x}px,${y}px)`;
    //
    if(Math.abs(x) >= offset || Math.abs(y) >= offset) {
        cur.e.style.transform = 'translate(0,0)';
      cur = false;
    }
  }
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
rendererMoon.setSize(innerWidth, innerHeight);

rendererMoon.domElement.setAttribute("id", "Church3DObj");
document.querySelector('.model-container-moon').insertBefore(rendererMoon.domElement, document.querySelector('.model-container-moon').firstChild);

let controlsMoon = new THREE.OrbitControls(cameraMoon, rendererMoon.domElement);

const aLightMoon = new THREE.DirectionalLight(0xffffff, 1.5);
aLightMoon.position.setScalar(10);
sceneMoon.add(aLightMoon, new THREE.AmbientLight(0xffffff, 0.5));

let loaderMoon = new THREE.GLTFLoader();
let objMoon = null;

if (window.innerWidth > 768) {
  loaderMoon.load('./3d/moon/moon.gltf', function(gltf) {
    objMoon = gltf.scene;
    sceneMoon.add(objMoon);
  });
}

rendererMoon.setAnimationLoop(_ => {
  rendererMoon.render(sceneMoon, cameraMoon);
})


//Вращение по скроллу
window.onscroll = (e) => {
  // sceneMoon.rotation.y = window.innerHeight + this.scrollY / 1500.0;

  sceneHeadset.rotation.y = window.innerHeight + 700 + this.scrollY / 4000.0;
  sceneHeadset.rotation.x = -this.scrollY / 5000.0;
}



//3d сцена c наушниками
let sceneHeadset = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 33; // Отдаление камеры

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


renderer.setAnimationLoop(_ => {
  renderer.render(sceneHeadset, camera);
})



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

//Aнимация up-down наушников
const clock = new THREE.Clock();
let lastElaptedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - lastElaptedTime;
  lastElaptedTime = elapsedTime;

  if (!!sceneHeadset){
    sceneHeadset.position.y = Math.sin(elapsedTime * 0.5);
  }
  renderer.render(sceneHeadset,camera)

  window.requestAnimationFrame(tick)
}
tick();

//Задаём переменную скролла для CSS
window.addEventListener('scroll', e => {
  document.body.style.cssText = `--scrollTop:${this.scrollY}px`
})



//Aнимация вращения луны
const clockMoon = new THREE.Clock();

const moonRotation = () => {
  const TimeTwo = clockMoon.getElapsedTime();

  if (!!sceneMoon){
    sceneMoon.rotation.y = TimeTwo * 0.05;
  }

  window.requestAnimationFrame(moonRotation);
}
moonRotation();


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

//Поведение аватаров
window.addEventListener('scroll', e => {
  let item = document.querySelector('.feedbackItem').getBoundingClientRect().top,
  item2 = document.querySelector('.item2').getBoundingClientRect().top,
  ava1 = document.querySelector('.ava1'),
  ava2 = document.querySelector('.ava2'),
  ava3 = document.querySelector('.ava3'),
  topPos = '22rem', midPos = '30.2rem', botPos = '37.5rem', itt = 0;

  if (window.innerWidth <= 768) {
    topPos = '53.5rem';
    midPos = '78.2rem';
    botPos = '103.5rem';
    itt = 250;
  }

  if (item <= 0 - itt) {
    document.querySelector('.arrowAv').style.top = midPos;
    ava1.style.opacity = '0.3';
    ava2.style.opacity = '1';

    if (item2 <= 0 - itt) {
      document.querySelector('.arrowAv').style.top = botPos;
      ava2.style.opacity = '0.3';
      ava3.style.opacity = '1';
    } else {
      document.querySelector('.arrowAv').style.top = midPos;
      ava2.style.opacity = '1';
      ava3.style.opacity = '0.3';
    }
    
  } else {
    ava1.style.opacity = '1';
    ava2.style.opacity = '0.3';
    document.querySelector('.arrowAv').style.top = topPos;
  }

})