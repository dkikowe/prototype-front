// Утилиты для работы с Telegram WebApp
export const parseTelegramInitData = () => {
  try {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return null;

    // Получаем init data из Telegram WebApp
    const initData = tg.initData;
    if (!initData) return null;

    // Парсим init data
    const urlParams = new URLSearchParams(initData);
    const userParam = urlParams.get("user");

    if (!userParam) return null;

    const user = JSON.parse(decodeURIComponent(userParam));

    return {
      id: user.id,
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      username: user.username || "",
      languageCode: user.language_code || "ru",
      isPremium: user.is_premium || false,
      photoUrl: user.photo_url || null,
    };
  } catch (error) {
    console.error("Ошибка при парсинге Telegram init data:", error);
    return null;
  }
};

export const getTelegramUserInfo = () => {
  const userData = parseTelegramInitData();

  if (!userData) {
    // Fallback данные для разработки
    return {
      firstName: "Пользователь",
      username: "username_telegram",
      displayName: "Пользователь",
    };
  }

  const displayName = userData.firstName || userData.username || "Пользователь";

  return {
    firstName: userData.firstName,
    username: userData.username,
    displayName: displayName,
    fullName: `${userData.firstName} ${userData.lastName}`.trim(),
    id: userData.id,
  };
};

export const initializeTelegramWebApp = () => {
  const tg = window?.Telegram?.WebApp;
  if (!tg) return;

  // Инициализация Telegram WebApp
  tg.ready();

  // Настройка полноэкранного режима
  tg.expand();

  // Отключаем подтверждение закрытия для предотвращения случайного закрытия
  tg.disableClosingConfirmation();

  // Отключаем вертикальные свайпы для предотвращения закрытия при скролле
  tg.disableVerticalSwipes();

  // Дополнительные настройки для предотвращения закрытия
  tg.enableClosingConfirmation(); // Включаем подтверждение закрытия
  tg.disableVerticalSwipes(); // Отключаем вертикальные свайпы

  // Настройка поведения при скролле
  document.addEventListener(
    "touchstart",
    (e) => {
      // Предотвращаем закрытие при скролле вверх
      if (e.touches.length === 1) {
        const startY = e.touches[0].clientY;
        const startTime = Date.now();

        const handleTouchMove = (moveEvent) => {
          const currentY = moveEvent.touches[0].clientY;
          const deltaY = startY - currentY;
          const deltaTime = Date.now() - startTime;

          // Если пользователь быстро скроллит вверх в начале страницы
          if (deltaY > 50 && deltaTime < 300 && window.scrollY === 0) {
            moveEvent.preventDefault();
          }
        };

        const handleTouchEnd = () => {
          document.removeEventListener("touchmove", handleTouchMove);
          document.removeEventListener("touchend", handleTouchEnd);
        };

        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });
        document.addEventListener("touchend", handleTouchEnd);
      }
    },
    { passive: true }
  );

  // Настройка цветовой схемы
  tg.setHeaderColor("#1a1a1a");
  tg.setBackgroundColor("#1a1a1a");

  // Функция для применения высоты viewport
  const applyVh = () => {
    const h = tg.viewportStableHeight || tg.viewportHeight;
    if (h) {
      document.documentElement.style.setProperty(
        "--tg-viewport-height",
        `${h}px`
      );
      document.body.style.height = `${h}px`;
      document.body.style.overflowY = "auto";
    }
  };

  applyVh();
  tg.onEvent("viewportChanged", applyVh);

  // Обработка изменения темы
  const handleThemeChange = () => {
    const theme = tg.colorScheme;
    document.documentElement.setAttribute("data-theme", theme);
  };

  handleThemeChange();
  tg.onEvent("themeChanged", handleThemeChange);

  return () => {
    tg.offEvent("viewportChanged", applyVh);
    tg.offEvent("themeChanged", handleThemeChange);
  };
};
