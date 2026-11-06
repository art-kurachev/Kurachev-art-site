// Отдельный dialog: ошибки WebGL не мешают открыть описание или закрыть окно.
(function () {
  setupModelPopup({
    trigger: '[data-iprit-popup]', dialog: 'iprit-dialog', managesDialog: true,
    modelURL: './3d/iprit/iphone-black.glb',
    screenURL: './img/personal-projects/iprit-screen.png?v=20261106-screen6',
    label: '3D-модель чёрного iPhone с приложением Iprit'
  });
  setupModelPopup({
    trigger: '[data-project-popup="rout"]', dialog: 'rout-dialog', managesDialog: false,
    modelURL: './3d/rout/apple-watch.glb', screenURL: null, frameScale: .82,
    label: '3D-модель Apple Watch Ultra 2 с приложением rout'
  });
  setupModelPopup({
    trigger: '[data-project-popup="observer"]', dialog: 'observer-dialog', managesDialog: false,
    modelURL: './3d/observer/macbook.glb',
    screenURL: './img/personal-projects/observer-screen.png',
    screenMesh: 'eVdSUYIqmtLvNwc', lid: true, frameMargin: 1.02,
    label: '3D-модель MacBook Pro с приложением Observer'
  });

  function setupModelPopup(options) {
    const trigger = document.querySelector(options.trigger);
    const dialog = document.getElementById(options.dialog);
    if (!trigger || !dialog || typeof dialog.showModal !== 'function') return;

    const root = document.documentElement;
    const closeButton = dialog.querySelector('.iprit-popup__close');
    const stage = dialog.querySelector('.iprit-popup__stage');
    const status = dialog.querySelector('.iprit-popup__status');
    const message = dialog.querySelector('.iprit-popup__status-text');
    const retry = dialog.querySelector('.iprit-popup__retry');
    const fallback = dialog.querySelector('.iprit-popup__screen-fallback');
    const { modelURL, screenURL } = options;
    let viewer = null;
    let loading = null;
    let frame = null;
    let previousFocus = null;
    let downOnBackdrop = false;
    let returnTimer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function applyLid(progress) {
      if (!viewer || !viewer.lid) return;
      const lid = viewer.lid;
      lid.progress = progress;
      lid.hinge.quaternion.fromArray(lid.interpolant.evaluate(progress * lid.duration));
    }

    function cancelLid() {
      if (!viewer || !viewer.lidAnimation) return;
      const resolve = viewer.lidAnimation.resolve;
      viewer.lidAnimation = null;
      resolve();
    }

    function animateLid(to) {
      cancelLid();
      if (!viewer || !viewer.lid || !dialog.open || viewer.contextLost || reduceMotion.matches || document.hidden || Math.abs(viewer.lid.progress - to) < .001) {
        applyLid(to);
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        viewer.lidAnimation = {
          from: viewer.lid.progress, to, started: performance.now(),
          duration: Math.max(100, 800 * Math.abs(viewer.lid.progress - to)), resolve
        };
        startRendering();
      });
    }

    function updateLid(time) {
      const animation = viewer.lidAnimation;
      if (!animation) return;
      const progress = Math.max(0, Math.min(1, (time - animation.started) / animation.duration));
      // Исходный Open Lid уже содержит плавное ускорение и торможение.
      applyLid(THREE.MathUtils.lerp(animation.from, animation.to, progress));
      if (progress === 1) cancelLid();
    }

    function openModel() {
      if (!dialog.open) return;
      viewer.controls.enabled = true;
      if (viewer.lid) {
        applyLid(0);
        animateLid(1);
      }
      resizeViewer();
      startRendering();
    }

    function closeModel() {
      cancelReturn();
      if (viewer) viewer.controls.enabled = false;
      return animateLid(0);
    }

    function cancelReturn() {
      clearTimeout(returnTimer);
      returnTimer = null;
      if (viewer) viewer.returnPose = null;
    }

    function scheduleReturn() {
      cancelReturn();
      returnTimer = setTimeout(() => {
        returnTimer = null;
        if (!dialog.open || !viewer || !viewer.ready) return;
        const orbit = new THREE.Spherical().setFromVector3(viewer.camera.position.clone().sub(viewer.controls.target));
        viewer.returnPose = {
          started: performance.now(),
          radius: orbit.radius,
          theta: THREE.MathUtils.euclideanModulo(orbit.theta + Math.PI, Math.PI * 2) - Math.PI,
          phi: orbit.phi,
          rotation: viewer.model.quaternion.clone()
        };
      }, 500);
    }

    function updateReturn(time) {
      const pose = viewer.returnPose;
      if (!pose) return;
      // Для полного разворота 3D-объекта используем 800 мс, без пружины и перелёта.
      const progress = reduceMotion.matches ? 1 : Math.max(0, Math.min(1, (time - pose.started) / 800));
      const eased = 1 - Math.pow(1 - progress, 3);
      viewer.camera.position.setFromSphericalCoords(pose.radius,
        THREE.MathUtils.lerp(pose.phi, Math.PI / 2, eased), pose.theta * (1 - eased)).add(viewer.controls.target);
      viewer.model.quaternion.slerpQuaternions(pose.rotation, new THREE.Quaternion(), eased);
      viewer.camera.lookAt(viewer.controls.target);
      if (progress === 1) viewer.returnPose = null;
    }

    function stopRendering() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
    }

    function startRendering() {
      if (!viewer || viewer.contextLost || !dialog.open || document.hidden || frame !== null) return;
      const draw = (time) => {
        frame = null;
        if (!dialog.open || document.hidden || viewer.contextLost) return;
        viewer.controls.update();
        updateLid(time);
        updateReturn(time);
        fitModelCamera();
        viewer.renderer.render(viewer.scene, viewer.camera);
        frame = requestAnimationFrame(draw);
      };
      frame = requestAnimationFrame(draw);
    }

    function fitModelCamera() {
      if (!viewer || !viewer.framing || viewer.contextLost) return;
      const { camera, controls, model, framing } = viewer;
      const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const tanY = Math.tan(halfFov), tanX = tanY * camera.aspect;
      framing.direction.copy(camera.position).sub(controls.target).normalize();
      framing.right.crossVectors(camera.up, framing.direction).normalize();
      framing.up.crossVectors(framing.direction, framing.right).normalize();
      model.updateMatrixWorld(true);
      let distance = 0;
      // Вписываем восемь углов объёма, включая весь ход крышки MacBook.
      // Это даёт крупный план анфас и сохраняет края при любом вращении.
      for (const corner of framing.corners) {
        framing.point.copy(corner).applyMatrix4(model.matrixWorld).sub(controls.target);
        const x = Math.abs(framing.point.dot(framing.right));
        const y = Math.abs(framing.point.dot(framing.up));
        const z = framing.point.dot(framing.direction);
        distance = Math.max(distance, z + Math.max(x / tanX, y / tanY));
      }
      distance *= (window.innerWidth <= 768 ? 1.01 : (options.frameMargin || 1.02)) / (options.frameScale || 1);
      if (viewer.returnPose) viewer.returnPose.radius = distance;
      camera.position.copy(framing.direction).multiplyScalar(distance).add(controls.target);
    }

    function resizeViewer() {
      if (!viewer || viewer.contextLost || !dialog.open || !stage.clientWidth || !stage.clientHeight) return;
      const { renderer, camera, controls } = viewer;
      camera.aspect = stage.clientWidth / stage.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(stage.clientWidth, stage.clientHeight, false);
      controls.update();
      fitModelCamera();
      renderer.render(viewer.scene, camera);
    }

    function createViewer() {
      if (!window.THREE || !THREE.GLTFLoader || !THREE.OrbitControls) {
        throw new Error('Three.js is unavailable');
      }
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      const canvas = renderer.domElement;
      canvas.tabIndex = 0;
      canvas.setAttribute('aria-label', options.label + '. Поворачивайте мышью или стрелками клавиатуры.');

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, .01, 100);
      camera.position.set(0, 0, 8);
      const controls = new THREE.OrbitControls(camera, canvas);
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.enableDamping = true;
      controls.dampingFactor = .08;
      controls.minPolarAngle = Math.PI / 4;
      controls.maxPolarAngle = Math.PI * 3 / 4;
      controls.addEventListener('start', cancelReturn);
      controls.addEventListener('end', scheduleReturn);

      // Студийные отражения подчёркивают чёрный металл, не перекрашивая корпус.
      const room = new THREE.Scene();
      room.background = new THREE.Color(0x252525);
      const panelGeometry = new THREE.PlaneGeometry(1, 1);
      const panelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
      [[-4, 2, 4, 2, 8], [4, 1, 2, 1, 6], [0, 5, -2, 7, 2]].forEach(([x, y, z, w, h]) => {
        const panel = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.position.set(x, y, z);
        panel.scale.set(w, h, 1);
        panel.lookAt(0, 0, 0);
        room.add(panel);
      });
      const pmrem = new THREE.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(room, .04);
      scene.environment = environment.texture;
      pmrem.dispose();
      panelGeometry.dispose();
      panelMaterial.dispose();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x161616, .7));
      const key = new THREE.DirectionalLight(0xffffff, 2);
      key.position.set(-3, 4, 5);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xffffff, 1);
      rim.position.set(4, 1, -3);
      scene.add(rim);

      viewer = { renderer, scene, camera, controls, environment, size: new THREE.Vector3(2, 3.6, 1) };
      stage.appendChild(canvas);
      canvas.addEventListener('keydown', (event) => {
        if (!viewer.model || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        cancelReturn();
        if (event.key === 'ArrowLeft') viewer.model.rotation.y -= .12;
        if (event.key === 'ArrowRight') viewer.model.rotation.y += .12;
        if (event.key === 'ArrowUp') viewer.model.rotation.x -= .08;
        if (event.key === 'ArrowDown') viewer.model.rotation.x += .08;
        scheduleReturn();
      });
      canvas.addEventListener('webglcontextlost', (event) => {
        event.preventDefault();
        if (!viewer || viewer.renderer !== renderer) return;
        viewer.contextLost = true;
        cancelLid();
        stopRendering();
        showError();
      });
      canvas.addEventListener('webglcontextrestored', () => {
        if (!viewer || viewer.renderer !== renderer) return;
        viewer.contextLost = false;
        if (!viewer.ready) return;
        status.hidden = true;
        fallback.hidden = true;
        resizeViewer();
        startRendering();
      });
      resizeViewer();
    }

    function applyModelTextureUVs(gltf) {
      // r128 использует UV0 для map, хотя в этой модели цвет крышки размечен в UV1.
      // UV0 у неё тайлится для микрорельефа, поэтому переносим только цвет, а не все карты.
      const secondaryUV = new Set(gltf.parser.json.materials
        .filter((material) => material.pbrMetallicRoughness && material.pbrMetallicRoughness.baseColorTexture && material.pbrMetallicRoughness.baseColorTexture.texCoord === 1)
        .map((material) => material.name));
      gltf.scene.traverse((node) => {
        if (!node.isMesh || !node.geometry.getAttribute('uv2')) return;
        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((material) => {
          if (!secondaryUV.has(material.name) || !material.map) return;
          node.geometry.setAttribute('ipritBaseUv', node.geometry.getAttribute('uv2'));
          if (material.userData.ipritBaseUv) return;
          material.userData.ipritBaseUv = true;
          material.onBeforeCompile = (shader) => {
            shader.vertexShader = 'attribute vec2 ipritBaseUv;\nvarying vec2 vIpritBaseUv;\n' + shader.vertexShader;
            shader.vertexShader = shader.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\nvIpritBaseUv = (uvTransform * vec3(ipritBaseUv, 1.0)).xy;');
            shader.fragmentShader = 'varying vec2 vIpritBaseUv;\n' + shader.fragmentShader;
            shader.fragmentShader = shader.fragmentShader.replace('#include <map_fragment>', THREE.ShaderChunk.map_fragment.replace(/\bvUv\b/g, 'vIpritBaseUv'));
          };
          material.customProgramCacheKey = () => 'iprit-base-color-uv1';
          material.needsUpdate = true;
        });
      });
    }

    function loadModel() {
      const loader = new THREE.GLTFLoader();
      const textureLoader = new THREE.TextureLoader();
      return Promise.all([
        new Promise((resolve, reject) => loader.load(modelURL, resolve, undefined, reject)),
        screenURL ? new Promise((resolve, reject) => textureLoader.load(screenURL, resolve, undefined, reject)) : Promise.resolve(null)
      ]).then(([gltf, screenTexture]) => {
        applyModelTextureUVs(gltf);
        if (screenTexture) {
          const screen = gltf.scene.getObjectByName(options.screenMesh || 'MmWvsinobDBeETZ');
          if (!screen || !screen.isMesh) throw new Error('The device screen mesh was not found');
          // UV0 уже совпадает с пропорциями дисплея. Сохраняем вырезы и скругления геометрии.
          screenTexture.flipY = false;
          screenTexture.encoding = THREE.sRGBEncoding;
          screenTexture.anisotropy = Math.min(4, viewer.renderer.capabilities.getMaxAnisotropy());
          // Пользовательская текстура экрана: показываем полностью, без обрезки краёв.
          screenTexture.repeat.set(1, 1);
          screenTexture.offset.set(0, 0);
          screen.material = new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false });
        }

        let lid = null;
        if (options.lid) {
          const clip = THREE.AnimationClip.findByName(gltf.animations, 'Open Lid');
          const track = clip && clip.tracks.find((item) => item.name.endsWith('.quaternion'));
          const hinge = track && gltf.scene.getObjectByName(track.name.slice(0, track.name.lastIndexOf('.')));
          if (!track || !hinge) throw new Error('The lid animation or hinge was not found');
          lid = { hinge, interpolant: track.createInterpolant(), duration: clip.duration, progress: 0 };
        }
        gltf.scene.updateMatrixWorld(true);
        const bounds = new THREE.Box3().setFromObject(gltf.scene);
        if (lid) {
          // Учитываем весь ход крышки, чтобы корпус не прыгал и не обрезался.
          for (let sample = 0; sample <= 16; sample++) {
            lid.hinge.quaternion.fromArray(lid.interpolant.evaluate(sample / 16 * lid.duration));
            gltf.scene.updateMatrixWorld(true);
            bounds.union(new THREE.Box3().setFromObject(gltf.scene));
          }
        }
        const center = bounds.getCenter(new THREE.Vector3());
        const size = bounds.getSize(new THREE.Vector3());
        const centered = new THREE.Group();
        gltf.scene.position.sub(center);
        centered.add(gltf.scene);
        centered.scale.setScalar(3.6 / size.y);
        const model = new THREE.Group();
        model.add(centered);
        model.rotation.set(0, 0, 0);
        viewer.scene.add(model);
        viewer.model = model;
        viewer.lid = lid;
        viewer.ready = true;
        viewer.size = size.clone().multiplyScalar(3.6 / size.y);
        const half = viewer.size.clone().multiplyScalar(.5);
        const corners = [];
        for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) {
          corners.push(new THREE.Vector3(x * half.x, y * half.y, z * half.z));
        }
        viewer.framing = {
          corners, direction: new THREE.Vector3(), right: new THREE.Vector3(),
          up: new THREE.Vector3(), point: new THREE.Vector3()
        };
        if (lid) applyLid(0);
      });
    }

    function showError() {
      stage.setAttribute('aria-busy', 'false');
      status.hidden = false;
      status.classList.add('is-error');
      message.textContent = '3D-модель не загрузилась. Можно попробовать ещё раз.';
      retry.hidden = false;
      fallback.hidden = false;
    }

    function ensureModel() {
      if (viewer && viewer.ready) {
        openModel();
        return;
      }
      if (loading) return;
      status.hidden = false;
      status.classList.remove('is-error');
      message.textContent = 'Загружаю 3D-модель…';
      retry.hidden = true;
      fallback.hidden = true;
      stage.setAttribute('aria-busy', 'true');
      loading = Promise.resolve().then(() => {
        if (!viewer) createViewer();
        return loadModel();
      }).then(() => {
        status.hidden = true;
        stage.setAttribute('aria-busy', 'false');
        openModel();
      }).catch((error) => {
        showError();
        console.error(options.label + ':', error);
      }).finally(() => { loading = null; });
    }

    if (options.managesDialog) {
      trigger.addEventListener('click', (event) => {
        if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        if (dialog.open) return;
        previousFocus = trigger;
        dialog.showModal();
        dialog.scrollTop = 0;
        root.classList.add('iprit-open');
        document.dispatchEvent(new CustomEvent('casepopup:open'));
        closeButton.focus({ preventScroll: true });
        ensureModel();
      });
      closeButton.addEventListener('click', () => dialog.close());
      dialog.addEventListener('close', () => {
        cancelReturn();
        stopRendering();
        root.classList.remove('iprit-open');
        if (!document.querySelector('dialog.case-popup[open]')) document.dispatchEvent(new CustomEvent('casepopup:close'));
        if (previousFocus) previousFocus.focus({ preventScroll: true });
        previousFocus = null;
      });
      // Нативный dialog обрабатывает Escape и удерживает фокус внутри окна.
      dialog.addEventListener('pointerdown', (event) => { downOnBackdrop = event.target === dialog; });
      dialog.addEventListener('click', (event) => {
        if (downOnBackdrop && event.target === dialog) dialog.close();
        downOnBackdrop = false;
      });
      // Не отдаём колёсико и клавиши прокрутки фоновому SmoothScroll.
      dialog.addEventListener('wheel', (event) => event.stopPropagation(), { passive: true });
      dialog.addEventListener('keydown', (event) => event.stopPropagation());
    } else {
      // Observer и rout открывает общий контроллер; сцена отвечает за 3D и движение крышки.
      dialog.addEventListener('projectpopup:open', ensureModel);
      if (options.lid) dialog.addEventListener('projectpopup:beforeclose', (event) => event.detail.waitUntil(closeModel()));
      dialog.addEventListener('projectpopup:close', () => {
        cancelReturn();
        cancelLid();
        stopRendering();
      });
    }
    retry.addEventListener('click', () => {
      if (viewer && viewer.contextLost) {
        const old = viewer;
        viewer = null;
        old.controls.dispose();
        old.scene.traverse((node) => {
          if (!node.isMesh) return;
          node.geometry.dispose();
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => { if (value && value.isTexture) value.dispose(); });
            material.dispose();
          });
        });
        old.environment.dispose();
        old.renderer.dispose();
        old.renderer.domElement.remove();
      }
      ensureModel();
    });
    new ResizeObserver(resizeViewer).observe(stage);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (viewer && viewer.lidAnimation && viewer.lidAnimation.to === 0) {
          applyLid(0);
          cancelLid();
        }
        stopRendering();
      }
      else startRendering();
    });
  }
}());
