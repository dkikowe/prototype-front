import React, { useMemo, useState } from "react";
import styles from "./BottomNavigation.module.scss";

const BottomNavigation = ({
  activeTab,
  onTabChange,
  showPopup,
  isInputFocused,
}) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const tabs = useMemo(
    () => [
      {
        id: "leaders",
        label: "Лидеры",
        icon: "/nav-icons/лидеры.png",
      },
      {
        id: "tasks",
        label: "Задания",
        icon: "/nav-icons/задания.png",
      },
      {
        id: "mining",
        label: "Майнинг",
        icon: "/nav-icons/mining.png",
      },
      {
        id: "exchange",
        label: "Обмен",
        icon: "/nav-icons/обмен.png",
      },
      {
        id: "more",
        label: "Еще",
        icon: "/nav-icons/еще.svg",
      },
    ],
    []
  );

  const handleTabClick = (tabId) => {
    if (tabId === "more") {
      setIsMoreOpen((prev) => !prev);
      return;
    }
    setIsMoreOpen(false);
    onTabChange(tabId);
  };

  return (
    <div
      className={`${styles.bottomNavigation} ${
        showPopup ? styles.blurred : ""
      } ${isInputFocused ? styles.hidden : ""}`}
    >
      <div className={styles.navContent}>
        {tabs.map((tab) => {
          const isMore = tab.id === "more";
          const isActive = isMoreOpen
            ? isMore
            : activeTab === tab.id ||
              (isMore && (activeTab === "profile" || activeTab === "friends"));

          return (
            <div
              key={tab.id}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <div className={styles.navIcon}>
                <img src={tab.icon} alt={tab.label} />
              </div>
              <span className={styles.navLabel}>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {isMoreOpen && (
        <div className={styles.moreMenu}>
          <button
            className={styles.moreItem}
            onClick={() => {
              setIsMoreOpen(false);
              onTabChange("profile");
            }}
          >
            <img
              className={styles.moreIcon}
              src="/nav-icons/profile.png"
              alt="Профиль"
            />
            <span className={styles.moreLabel}>Профиль</span>
          </button>
          <button
            className={styles.moreItem}
            onClick={() => {
              setIsMoreOpen(false);
              onTabChange("friends");
            }}
          >
            <img
              className={styles.moreIcon}
              src="/nav-icons/friends.png"
              alt="Друзья"
            />
            <span className={styles.moreLabel}>Друзья</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default BottomNavigation;
