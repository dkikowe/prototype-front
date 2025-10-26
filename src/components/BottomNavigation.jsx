import React from "react";
import styles from "./BottomNavigation.module.scss";

const BottomNavigation = ({ activeTab, onTabChange, showPopup }) => {
  const tabs = [
    {
      id: "leaders",
      label: "Лидеры",
      icon: "/nav-icons/лидеры.png",
    },
    {
      id: "tasks",
      label: "Задания",
      icon: "/nav-icons/задания.svg",
    },
    {
      id: "mining",
      label: "Майнинг",
      icon: "/nav-icons/mining.svg",
    },
    {
      id: "exchange",
      label: "Обмен",
      icon: "/nav-icons/обмен.svg",
    },
    {
      id: "profile",
      label: "Еще",
      icon: "/nav-icons/еще.svg",
    },
  ];

  return (
    <div
      className={`${styles.bottomNavigation} ${
        showPopup ? styles.blurred : ""
      }`}
    >
      <div className={styles.navContent}>
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`${styles.navItem} ${
              activeTab === tab.id ? styles.active : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <div className={styles.navIcon}>
              <img src={tab.icon} alt={tab.label} />
            </div>
            <span className={styles.navLabel}>{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
