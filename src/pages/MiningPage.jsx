import React, { useState, useEffect } from "react";
import styles from "./Page.module.scss";
import FoundPopup from "../components/FoundPopup";
import { getTelegramUserInfo } from "../utils/telegramUtils";

const MiningPage = ({ showPopup, setShowPopup, userInfo }) => {
  console.log("MiningPage: Получены данные пользователя:", userInfo);
  const [activeTab, setActiveTab] = useState("token_finder");
  const [isScanning, setIsScanning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const SLIDE_GAP = 20; // px — зазор между карточками при анимации (синхронизирован со стилями)
  const sliderContainerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // жесты
  const [isTouching, setIsTouching] = useState(false);
  const touchStartXRef = React.useRef(0);
  const [touchDelta, setTouchDelta] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalRef = React.useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef(null);
  const [liveFeedMessages, setLiveFeedMessages] = useState([]);
  const isInitialized = React.useRef(false);
  const [localUserInfo, setLocalUserInfo] = useState(null);

  // Альтернативный способ получения данных пользователя
  useEffect(() => {
    if (!userInfo) {
      console.log(
        "MiningPage: userInfo не получен, пытаемся получить локально..."
      );
      const localUser = getTelegramUserInfo();
      console.log("MiningPage: Локально полученные данные:", localUser);
      setLocalUserInfo(localUser);
    }
  }, [userInfo]);

  // Используем локальные данные если основные не получены
  const effectiveUserInfo = userInfo || localUserInfo;

  // Массив шаблонов для генерации новых сообщений live feed
  const liveFeedTemplates = [
    "user#{number}: {amount}₿ | 0x{hash}",
    "@{username}: {amount}₿ | 0x{hash}",
    "miner#{number}: {amount}₿ | 0x{hash}",
    "@{username}: {amount}₿ | 0x{hash}",
    "user#{number}: {amount}₿ | 0x{hash}",
  ];

  const usernames = [
    "agent47",
    "trinity",
    "morpheus",
    "oracle",
    "neo",
    "cypher",
    "switch",
    "apoc",
    "mouse",
    "tank",
    "dozer",
    "ghost",
    "phantom",
    "shadow",
    "blade",
    "storm",
    "thunder",
    "lightning",
    "fire",
    "ice",
  ];

  // Функция для генерации случайного сообщения
  const generateRandomMessage = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

    const template =
      liveFeedTemplates[Math.floor(Math.random() * liveFeedTemplates.length)];
    const amount = Math.floor(Math.random() * 10000) + 100; // от 100 до 10100
    const number = Math.floor(Math.random() * 9999) + 1;
    const username = usernames[Math.floor(Math.random() * usernames.length)];
    const hash = Math.random().toString(16).substring(2, 6).toUpperCase();

    let message = template
      .replace("{number}", number)
      .replace("{amount}", amount)
      .replace("{username}", username)
      .replace("{hash}", hash);

    return `[${timeStr}] > ${message}`;
  };

  const scrollToTop = () => {
    if (terminalRef.current && !isUserScrolling) {
      terminalRef.current.scrollTop = 0;
    }
  };

  const handleTerminalScroll = () => {
    setIsUserScrolling(true);

    // Очищаем предыдущий таймаут
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Через 2 секунды после последней прокрутки считаем, что пользователь закончил скроллить
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 2000);
  };

  // Инициализация сообщений при загрузке страницы
  useEffect(() => {
    // Проверяем, что инициализация еще не происходила
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Инициализируем сообщения live feed
    const initialLiveFeedMessages = [
      "[19:26] > user#1029: 3214₿ | 0xB2..4D",
      "[19:26] > @agent47: 589₿ | 0x6E..7F",
      "[19:26] > user#2288: 2301₿ | 0xD4..9E",
      "[19:27] > @trinity: 4932₿ | 0x77..FA",
      "[19:27] > user#9931: 247₿ | 0xCA..51",
      "[19:27] > @morpheus: 1024₿ | 0xF0..AA",
      "[19:28] > user#3142: 712₿ | 0x82..3C",
      "[19:28] > @oracle: 8392₿ | 0xDE..F5",
      "[19:28] > user#1190: 351₿ | 0x1A..B7",
    ];
    setLiveFeedMessages(initialLiveFeedMessages);

    // Инициализируем сообщения терминала с задержкой
    const username = effectiveUserInfo?.username || "username";
    const initialTerminalMessages = [
      "[BOOT] Подключение к BTC Prototype...",
      `[AUTH] Пользователь: @${username} — проверка доступа...`,
      "[OK] Соединение установлено",
      "[SYNC] Синхронизация узлов: 12% → 56% → 95% → 100%",
      "[DATA] Игровой баланс: 1100₿ • Энергия: 12",
      "[INFO] Готово к поиску. Нажми «Поиск», чтобы начать скан.",
    ];

    // Добавляем сообщения терминала по одному с задержкой
    let currentIndex = 0;
    const addMessage = () => {
      if (currentIndex < initialTerminalMessages.length) {
        setTerminalLogs((prev) => [
          initialTerminalMessages[currentIndex],
          ...prev,
        ]);
        currentIndex++;
        setTimeout(addMessage, 500); // 500мс между сообщениями
      } else {
        // После начальных сообщений добавляем сообщения сканирования
        const scanMessages = [
          "[SCAN] Подключение к узлам... ОК",
          "[NET] Синхронизация... 17% → 62% → 100%",
          "[HASH] Проверка блоков... ОК",
          "[DETECT] Найден активный адрес",
          "[ADDR] 0xA3b7...E2",
          "[BALANCE] 0.057 BTC",
          `[BOT] Отличная находка, ${
            effectiveUserInfo?.displayName || "Пользователь"
          }.`,
          "[INFO] Поиск завершён",
        ];

        let scanIndex = 0;
        const addScanMessage = () => {
          if (scanIndex < scanMessages.length) {
            setTerminalLogs((prev) => [scanMessages[scanIndex], ...prev]);
            scanIndex++;
            setTimeout(addScanMessage, 800); // 800мс между сообщениями сканирования
          }
        };

        setTimeout(addScanMessage, 1000); // Задержка перед началом сканирования
      }
    };

    setTimeout(addMessage, 1000); // Начинаем через 1 секунду после загрузки
  }, [effectiveUserInfo]);

  useEffect(() => {
    scrollToTop();
  }, [terminalLogs, liveFeedMessages]);

  // Автоматическое обновление live feed
  useEffect(() => {
    if (activeTab !== "live_feed") return;

    const addNewMessage = () => {
      const newMessage = generateRandomMessage();
      setLiveFeedMessages((prev) => {
        const updated = [newMessage, ...prev];
        // Ограничиваем количество сообщений до 20, удаляя старые
        return updated.length > 20 ? updated.slice(0, 20) : updated;
      });
    };

    const scheduleNextMessage = () => {
      // Рандомный интервал от 1 до 3 секунд
      const delay = Math.random() * 2000 + 1000; // от 1000мс до 3000мс
      setTimeout(() => {
        addNewMessage();
        scheduleNextMessage();
      }, delay);
    };

    // Запускаем первую задержку
    scheduleNextMessage();
  }, [activeTab]);

  // измеряем ширину контейнера для точного смещения с учётом gap
  useEffect(() => {
    const updateWidth = () => {
      if (sliderContainerRef.current) {
        setContainerWidth(sliderContainerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onTouchStart = (e) => {
    if (!sliderContainerRef.current) return;
    setIsTouching(true);
    touchStartXRef.current = e.touches[0].clientX;
    setTouchDelta(0);
  };

  const onTouchMove = (e) => {
    if (!isTouching) return;
    const currentX = e.touches[0].clientX;
    setTouchDelta(currentX - touchStartXRef.current);
  };

  const onTouchEnd = () => {
    if (!isTouching) return;
    const threshold = 40; // px
    const delta = touchDelta;
    setIsTouching(false);
    setTouchDelta(0);
    if (delta < -threshold && currentSlide < 1) {
      setCurrentSlide(1);
    } else if (delta > threshold && currentSlide > 0) {
      setCurrentSlide(0);
    }
  };

  const startScan = () => {
    if (isScanning) return;

    setIsScanning(true);
    setShowPopup(false);

    // Просто показываем загрузку и через некоторое время показываем попап
    setTimeout(() => {
      setIsScanning(false);
      setShowPopup(true);
    }, 3000); // 3 секунды загрузки
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <div className={styles.prototypeText}>prototype</div>

        {/* Отладочная информация о пользователе */}
        {effectiveUserInfo && (
          <div
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              background: "rgba(0,0,0,0.8)",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "12px",
              zIndex: 9999,
              maxWidth: "200px",
            }}
          >
            <div>
              <strong>Отладка пользователя:</strong>
            </div>
            <div>Имя: {effectiveUserInfo.displayName}</div>
            <div>Username: @{effectiveUserInfo.username}</div>
            <div>ID: {effectiveUserInfo.id || "N/A"}</div>
            <div>First Name: {effectiveUserInfo.firstName || "N/A"}</div>
            <div>Источник: {userInfo ? "App" : "Local"}</div>
          </div>
        )}
        <div className={styles.balanceSection}>
          <div className={styles.balanceLabel}>Балансы</div>
          <div className={styles.balanceValues}>
            <div className={styles.balanceItem}>
              <img
                src="/mine-icons/bitcoin.svg"
                alt="bitcoin"
                className={styles.balanceIcon}
              />
              <span className={styles.balanceNumber}>3280</span>
            </div>
            <div className={styles.balanceDivider}></div>
            <div className={styles.balanceItem}>
              <img
                src="/mine-icons/energy.svg"
                alt="energy"
                className={styles.balanceIcon}
              />
              <span className={styles.balanceNumber}>12</span>
            </div>
          </div>
        </div>
        <div className={styles.welcomeSlider}>
          <div
            className={styles.sliderContainer}
            ref={sliderContainerRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className={styles.sliderTrack}
              style={{
                transform: `translateX(-${
                  (containerWidth + SLIDE_GAP) * currentSlide -
                  (isTouching ? touchDelta : 0)
                }px)`,
                transition: isTouching ? "none" : "transform 0.3s ease-in-out",
              }}
            >
              <div className={styles.welcomeCard}>
                <div className={styles.welcomeContent}>
                  <div className={styles.symbolsRow}>
                    <span className={styles.symbol}>#</span>
                    <span className={styles.symbol}>$</span>
                    <span className={styles.symbol}>%</span>
                  </div>
                  <div className={styles.welcomeText}>
                    Удачного поиска, <br />
                    {effectiveUserInfo?.displayName || "Пользователь"}!
                  </div>
                  <div className={styles.usernameText}>
                    @{effectiveUserInfo?.username || "username_telegram"}
                  </div>
                </div>
                <div className={styles.largeHash}>
                  <img src="/mine-icons/reshetka.svg" alt="hash" />
                </div>
              </div>
              <div className={styles.welcomeCard}>
                <div className={styles.welcomeContent}>
                  <div className={styles.symbolsRow}>
                    <span className={styles.symbol}>#</span>
                    <span className={styles.symbol}>$</span>
                    <span className={styles.symbol}>%</span>
                  </div>
                  <div className={styles.welcomeText}>
                    Удачного поиска, <br />
                    {effectiveUserInfo?.displayName || "Пользователь"}!
                  </div>
                  <div className={styles.usernameText}>
                    @{effectiveUserInfo?.username || "username_telegram"}
                  </div>
                </div>
                <div className={styles.largeHash}>
                  <img src="/mine-icons/reshetka.svg" alt="hash" />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.sliderDots}>
            <div
              className={`${styles.sliderDot} ${
                currentSlide === 0 ? styles.sliderActiveDot : ""
              }`}
              onClick={() => setCurrentSlide(0)}
            ></div>
            <div
              className={`${styles.sliderDot} ${
                currentSlide === 1 ? styles.sliderActiveDot : ""
              }`}
              onClick={() => setCurrentSlide(1)}
            ></div>
          </div>
        </div>
        <div className={styles.buttonsContainer}>
          <button className={styles.primaryButton}>
            <img
              src="/mine-icons/ai-agent.svg"
              alt="ai-agent"
              className={styles.buttonIcon}
            />
            <span className={styles.buttonText}>AI-agent</span>
          </button>
          <button className={styles.secondaryButton}>
            <img
              src="/mine-icons/tg.svg"
              alt="telegram"
              className={styles.buttonIcon}
            />
            <span className={styles.buttonText}>Телеграм</span>
          </button>
          <button className={styles.secondaryButton}>
            <img
              src="/mine-icons/concl.svg"
              alt="conclusions"
              className={styles.buttonIcon}
            />
            <span className={styles.buttonText}>Выводы</span>
          </button>
        </div>
        <div className={styles.terminalContainer}>
          <div className={styles.terminalTabs}>
            <div
              className={`${styles.tab} ${
                activeTab === "token_finder" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("token_finder")}
            >
              <img
                src="/mine-icons/token-finder.svg"
                alt="token-finder"
                className={styles.tabIcon}
              />
              <span className={styles.tabText}>Token_finder</span>
            </div>
            <div
              className={`${styles.tab} ${
                activeTab === "live_feed" ? styles.activeTab : ""
              }`}
              onClick={() => setActiveTab("live_feed")}
            >
              <img
                src="/mine-icons/live.svg"
                alt="live"
                className={styles.liveFeedIcon}
              />
              <span className={styles.tabText}>Live_feed</span>
            </div>
          </div>
          <div className={styles.terminalContent}>
            <div
              className={styles.terminalLogs}
              ref={terminalRef}
              onScroll={handleTerminalScroll}
            >
              {activeTab === "token_finder"
                ? terminalLogs.map((log, index) => (
                    <div key={index} className={styles.logLine}>
                      {log}
                    </div>
                  ))
                : liveFeedMessages.map((message, index) => (
                    <div key={index} className={styles.logLine}>
                      {message}
                    </div>
                  ))}
            </div>
            <div className={styles.terminalInput}>
              <div
                className={`${styles.inputField} ${
                  activeTab === "live_feed" ? styles.fullWidthInput : ""
                }`}
              >
                <span className={styles.prompt}>$</span>
                <div className={styles.cursor}></div>
              </div>
              {activeTab === "token_finder" && (
                <button
                  className={styles.searchButton}
                  onClick={startScan}
                  disabled={isScanning}
                >
                  {isScanning ? (
                    <div className={styles.loadingDots}>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                      <div className={styles.dot}></div>
                    </div>
                  ) : (
                    <>
                      <span className={styles.searchText}>Поиск</span>
                      <img
                        src="/mine-icons/energywhite.svg"
                        alt="energy"
                        className={styles.lightningIcon}
                      />
                      <span className={styles.searchNumber}>1</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <FoundPopup
          onClose={() => setShowPopup(false)}
          walletAddress="0x4f3a9b2Sas..."
          collectedAmount={257}
        />
      )}
    </div>
  );
};

export default MiningPage;
