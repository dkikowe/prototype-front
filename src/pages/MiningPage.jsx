import React, { useState, useEffect, useMemo } from "react";
import styles from "./Page.module.scss";
import FoundPopup from "../components/FoundPopup";

const MiningPage = ({ showPopup, setShowPopup }) => {
  const [activeTab, setActiveTab] = useState("token_finder");
  const [isScanning, setIsScanning] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const SLIDE_GAP = 20;
  const sliderContainerRef = React.useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const [isTouching, setIsTouching] = useState(false);
  const touchStartXRef = React.useRef(0);
  const [touchDelta, setTouchDelta] = useState(0);

  const [terminalLogs, setTerminalLogs] = useState([]);
  const terminalRef = React.useRef(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = React.useRef(null);

  const [liveFeedMessages, setLiveFeedMessages] = useState([]);
  const isInitialized = React.useRef(false);

  // >>>>> СТРОГО ЧЕРЕЗ Telegram initData <<<<<
  const [tgUser, setTgUser] = useState(null);
  const [startParam, setStartParam] = useState(null);
  const [rawInitData, setRawInitData] = useState(null);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;

    console.log("🔍 Debug - tg exists:", !!tg);

    if (!tg) {
      // фолбэк только для локальной разработки вне Telegram
      const fallbackUser = {
        username: "username_telegram",
        first_name: "Пользователь",
      };
      setTgUser(fallbackUser);
      console.log("🔧 Development mode - Fallback user:", fallbackUser);
      return;
    }

    tg.ready();
    tg.expand?.();

    console.log("🔍 Debug - tg.initDataUnsafe:", tg.initDataUnsafe);
    console.log("🔍 Debug - tg.initDataUnsafe?.user:", tg.initDataUnsafe?.user);
    console.log("🔍 Debug - full tg object:", tg);

    // Пробуем получить user несколько способами
    const u = tg.initDataUnsafe?.user || tg.webAppInitData?.user || null;

    console.log("🔍 Debug - user object:", u);

    setTgUser(u);
    setStartParam(tg.initDataUnsafe?.start_param ?? null);
    setRawInitData(tg.initData ?? null);

    // Логирование данных пользователя и параметров запуска
    if (u) {
      console.log("👤 Telegram User Info:", {
        username: u.username || "не указан",
        first_name: u.first_name,
        last_name: u.last_name,
        id: u.id,
        language_code: u.language_code,
        is_premium: u.is_premium,
      });
      console.log(
        "🔗 Start Param:",
        tg.initDataUnsafe?.start_param || "отсутствует"
      );
      console.log("📦 Init Data:", tg.initData ?? "отсутствует");
    } else {
      console.log(
        "⚠️ User data not available - initDataUnsafe?.user is null/undefined"
      );
    }
  }, []);

  const uiUser = useMemo(() => {
    if (!tgUser) {
      console.log("⚠️ uiUser: tgUser is null, using fallback");
      return { displayName: "Пользователь", username: "username_telegram" };
    }

    console.log("✅ uiUser: tgUser exists", tgUser);

    const displayName =
      tgUser.first_name ||
      tgUser.username ||
      tgUser.last_name ||
      "Пользователь";
    const username =
      tgUser.username || `user${tgUser.id}` || "username_telegram";

    console.log("✅ uiUser final:", { displayName, username });

    return {
      displayName,
      username,
    };
  }, [tgUser]);

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

  const generateRandomMessage = () => {
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const template =
      liveFeedTemplates[Math.floor(Math.random() * liveFeedTemplates.length)];
    const amount = Math.floor(Math.random() * 10000) + 100;
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
    if (terminalRef.current && !isUserScrolling)
      terminalRef.current.scrollTop = 0;
  };

  const handleTerminalScroll = () => {
    setIsUserScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(
      () => setIsUserScrolling(false),
      2000
    );
  };

  // Первичная инициализация логов — с использованием имени из initData
  useEffect(() => {
    if (isInitialized.current || !uiUser) return;
    isInitialized.current = true;

    const initialLive = [
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
    setLiveFeedMessages(initialLive);

    const username = uiUser.username || "username";
    const initialTerminal = [
      "[BOOT] Подключение к BTC Prototype...",
      `[AUTH] Пользователь: @${username} — проверка доступа...`,
      "[OK] Соединение установлено",
      "[SYNC] Синхронизация узлов: 12% → 56% → 95% → 100%",
      "[DATA] Игровой баланс: 1100₿ • Энергия: 12",
      "[INFO] Готово к поиску. Нажми «Поиск», чтобы начать скан.",
    ];

    let i = 0;
    const addMessage = () => {
      if (i < initialTerminal.length) {
        setTerminalLogs((prev) => [initialTerminal[i], ...prev]);
        i++;
        setTimeout(addMessage, 500);
      } else {
        const scanMessages = [
          "[SCAN] Подключение к узлам... ОК",
          "[NET] Синхронизация... 17% → 62% → 100%",
          "[HASH] Проверка блоков... ОК",
          "[DETECT] Найден активный адрес",
          "[ADDR] 0xA3b7...E2",
          "[BALANCE] 0.057 BTC",
          `[BOT] Отличная находка, ${uiUser.displayName}.`,
          "[INFO] Поиск завершён",
        ];
        let s = 0;
        const addScan = () => {
          if (s < scanMessages.length) {
            setTerminalLogs((prev) => [scanMessages[s], ...prev]);
            s++;
            setTimeout(addScan, 800);
          }
        };
        setTimeout(addScan, 1000);
      }
    };
    setTimeout(addMessage, 1000);
  }, [uiUser]);

  useEffect(() => {
    scrollToTop();
  }, [terminalLogs, liveFeedMessages]);

  useEffect(() => {
    if (activeTab !== "live_feed") return;
    const tick = () => {
      setLiveFeedMessages((prev) => {
        const next = [generateRandomMessage(), ...prev];
        return next.length > 20 ? next.slice(0, 20) : next;
      });
      const delay = Math.random() * 2000 + 1000;
      timer = setTimeout(tick, delay);
    };
    let timer = setTimeout(tick, Math.random() * 2000 + 1000);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    const updateWidth = () => {
      if (sliderContainerRef.current)
        setContainerWidth(sliderContainerRef.current.clientWidth);
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
    setTouchDelta(e.touches[0].clientX - touchStartXRef.current);
  };
  const onTouchEnd = () => {
    if (!isTouching) return;
    const threshold = 40;
    const delta = touchDelta;
    setIsTouching(false);
    setTouchDelta(0);
    if (delta < -threshold && currentSlide < 1) setCurrentSlide(1);
    else if (delta > threshold && currentSlide > 0) setCurrentSlide(0);
  };

  const startScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setShowPopup(false);
    setTimeout(() => {
      setIsScanning(false);
      setShowPopup(true);
    }, 3000);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <div className={styles.prototypeText}>prototype</div>

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
                    {uiUser.displayName}!
                  </div>
                  <div className={styles.usernameText}>
                    @{uiUser.username}
                    {process.env.NODE_ENV === "development" && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#888",
                          marginTop: "4px",
                        }}
                      >
                        Debug: {tgUser ? "has data" : "no data"}
                      </div>
                    )}
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
                    {uiUser.displayName}!
                  </div>
                  <div className={styles.usernameText}>
                    @{uiUser.username}
                    {process.env.NODE_ENV === "development" && (
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#888",
                          marginTop: "4px",
                        }}
                      >
                        Debug: {tgUser ? "has data" : "no data"}
                      </div>
                    )}
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
                : liveFeedMessages.map((msg, index) => (
                    <div key={index} className={styles.logLine}>
                      {msg}
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
