import React, { useEffect, useState } from "react";
import BottomNavigation from "./components/BottomNavigation";
import LeadersPage from "./pages/LeadersPage";
import TasksPage from "./pages/TasksPage";
import MiningPage from "./pages/MiningPage";
import ExchangePage from "./pages/ExchangePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [activeTab, setActiveTab] = useState("mining");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (!tg) return;

    // Инициализация Telegram WebApp
    tg.ready();

    // Получаем данные пользователя из Telegram
    const user = tg.initDataUnsafe?.user;
    if (user) {
      console.log("Telegram User Data:", {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
        language_code: user.language_code,
        is_premium: user.is_premium,
      });
    }

    // Настройка полноэкранного режима
    tg.expand(); // Раскрывает WebApp на полный экран
    tg.enableClosingConfirmation(); // Подтверждение закрытия
    tg.disableVerticalSwipes(); // Отключаем вертикальные свайпы для предотвращения случайного закрытия при скролле

    // Настройка цветовой схемы
    tg.setHeaderColor("#1a1a1a"); // Темный цвет заголовка
    tg.setBackgroundColor("#1a1a1a"); // Темный фон

    // Функция для применения высоты viewport
    const applyVh = () => {
      const h = tg.viewportStableHeight || tg.viewportHeight;
      if (h) {
        document.documentElement.style.setProperty(
          "--tg-viewport-height",
          `${h}px`
        );
        // Устанавливаем высоту для body чтобы обеспечить скролл
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
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case "leaders":
        return <LeadersPage />;
      case "tasks":
        return <TasksPage />;
      case "mining":
        return <MiningPage showPopup={showPopup} setShowPopup={setShowPopup} />;
      case "exchange":
        return <ExchangePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <MiningPage showPopup={showPopup} setShowPopup={setShowPopup} />;
    }
  };

  return (
    <div className="app">
      {renderPage()}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showPopup={showPopup}
      />
    </div>
  );
}

export default App;
