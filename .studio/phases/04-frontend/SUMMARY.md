# Фаза 4 — итог

2026-10-23: поп-ап кейса СУМ выкачен на kurachev.art (коммиты 16875e6, 3696fce).
- js/case-popup.js, css/case-popup.css, <dialog id="case-sum-dialog"> в index.html; ссылка СУМ → #case-sum; превью cover-1206.webp.
- js/main.js: enterSite(), пропуск прелоадера по #case-sum, пауза 3D/видео по casepopup:open/close. css/global.css: .visually-hidden.
- Проверено в Chromium (Playwright): 60 сценариев, десктоп 1440 и телефон 390, без CDN, офлайн, reduced-motion; главная без поп-апа совпадает с прежней.
- Ревью: исправлен двойной history.back() при закрытии самим браузером.
- Скриншоты: /mnt/project-files/cases/phase4-shots/.

Осталось:
- iPhone + Safari: Артём проверил 2026-10-23, всё чётко. Осталось: Firefox, Android, скринридеры (пункты 5, 13, 15 чек-листа case-popup-flow.md).
- Цифры Behance записаны по памяти: сверить, когда в окружении разрешат behance.net.
- Мелочи из ревью: курсор считает раскладку каждый кадр под поп-апом; scrollbar-gutter в Firefox; при 404 case-popup.js ссылка СУМ не работает.
- Порядок Tab: первым идёт не крестик (фокус на h1).
