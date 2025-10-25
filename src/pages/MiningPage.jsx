import React, { useState, useEffect } from "react";
import styles from "./Page.module.scss";
import FoundPopup from "../components/FoundPopup";

const MiningPage = ({ showPopup, setShowPopup }) => {
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
  const [terminalLogs, setTerminalLogs] = useState([
    "[BOOT] Подключение к BTC Prototype...",
    "[AUTH] Пользователь: @username — проверка доступа...",
    "[OK] Соединение установлено",
    "[SYNC] Синхронизация узлов: 12% → 56% → 95% → 100%",
    "[DATA] Игровой баланс: 1100₿ • Энергия: 12",
    "[INFO] Готово к поиску. Нажми «Поиск», чтобы начать скан.",
    "[STATUS] Система активна и готова к работе",
    "[NETWORK] Подключение к сети Bitcoin стабильно",
    "[MEMORY] Использование памяти: 45%",
    "[CPU] Загрузка процессора: 23%",
    "[STORAGE] Свободное место: 2.1 GB",
    "[SECURITY] Все проверки безопасности пройдены",
    "[READY] Ожидание команд пользователя...",
  ]);
  const terminalRef = React.useRef(null);
  const [liveFeedMessages, setLiveFeedMessages] = useState([
    "[19:26] > user#1029: 3214₿ | 0xB2..4D",
    "[19:26] > @agent47: 589₿ | 0x6E..7F",
    "[19:26] > user#2288: 2301₿ | 0xD4..9E",
    "[19:27] > @trinity: 4932₿ | 0x77..FA",
    "[19:27] > user#9931: 247₿ | 0xCA..51",
    "[19:27] > @morpheus: 1024₿ | 0xF0..AA",
    "[19:28] > user#3142: 712₿ | 0x82..3C",
    "[19:28] > @oracle: 8392₿ | 0xDE..F5",
    "[19:28] > user#1190: 351₿ | 0x1A..B7",
    "[19:29] > @cypher: 1850₿ | 0x3F..8A",
    "[19:29] > user#4567: 920₿ | 0x9C..2E",
    "[19:30] > @neo: 6543₿ | 0x1B..7D",
    "[19:30] > user#7890: 128₿ | 0x4A..9F",
    "[19:31] > @smith: 2750₿ | 0x6D..3C",
    "[19:31] > user#1234: 456₿ | 0x8E..5A",
    "[19:32] > @tank: 3890₿ | 0x2F..8B",
    "[19:32] > user#5678: 167₿ | 0x5C..1D",
  ]);

  const scrollToBottom = () => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [terminalLogs, liveFeedMessages]);

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

    const scanMessages = [
      "$ search",
      "[SCAN] Подключение к узлам... ОК",
      "[NET] Синхронизация... 17% → 62% → 100%",
      "[HASH] Проверка блоков... ОК",
      "[DETECT] Найден активный адрес",
      "[ADDR] 0xA3b7...E2",
      "[BALANCE] 0.057 BTC",
      "[BOT] Отличная находка, {name}.",
      "[INFO] Поиск завершён",
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < scanMessages.length) {
        setTerminalLogs((prev) => [...prev, scanMessages[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsScanning(false);
        setTimeout(() => {
          setShowPopup(true);
        }, 1000);
      }
    }, 800);
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
                    {`{name}`}!
                  </div>
                  <div className={styles.usernameText}>@username_telegram</div>
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
                    {`{name}`}!
                  </div>
                  <div className={styles.usernameText}>@username_telegram</div>
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
                className={styles.tabIcon}
              />
              <span className={styles.tabText}>Live_feed</span>
            </div>
          </div>
          <div className={styles.terminalContent}>
            <div className={styles.terminalLogs} ref={terminalRef}>
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
