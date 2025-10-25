import React, { useEffect, useState } from "react";
import BottomNavigation from "./components/BottomNavigation";
import LeadersPage from "./pages/LeadersPage";
import TasksPage from "./pages/TasksPage";
import MiningPage from "./pages/MiningPage";
import ExchangePage from "./pages/ExchangePage";
import ProfilePage from "./pages/ProfilePage";
import {
  initializeTelegramWebApp,
  getTelegramUserInfo,
} from "./utils/telegramUtils";

function App() {
  const [activeTab, setActiveTab] = useState("mining");
  const [showPopup, setShowPopup] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Инициализация Telegram WebApp
    const cleanup = initializeTelegramWebApp();

    // Получаем информацию о пользователе
    const user = getTelegramUserInfo();
    setUserInfo(user);

    return cleanup;
  }, []);

  const renderPage = () => {
    switch (activeTab) {
      case "leaders":
        return <LeadersPage />;
      case "tasks":
        return <TasksPage />;
      case "mining":
        return (
          <MiningPage
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            userInfo={userInfo}
          />
        );
      case "exchange":
        return <ExchangePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return (
          <MiningPage
            showPopup={showPopup}
            setShowPopup={setShowPopup}
            userInfo={userInfo}
          />
        );
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
