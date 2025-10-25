import React, { useEffect, useState } from "react";
import BottomNavigation from "./components/BottomNavigation";
import LeadersPage from "./pages/LeadersPage";
import TasksPage from "./pages/TasksPage";
import MiningPage from "./pages/MiningPage";
import ExchangePage from "./pages/ExchangePage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const [activeTab, setActiveTab] = useState("mining"); // По умолчанию активна страница "Майнинг"
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.requestFullscreen();
    tg.disableVerticalSwipes();
    tg.ready();

    return () => {
      tg.close(); // Закрытие веб-приложения (при необходимости)
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
