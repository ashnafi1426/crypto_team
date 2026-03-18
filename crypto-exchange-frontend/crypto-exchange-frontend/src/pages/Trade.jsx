import { useState, useEffect, useRef } from "react";
import "../styles/components/trade.css";
import { useLanguage } from "../context/LanguageContext";

function Trade() {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(0);
  const [selectedTime, setSelectedTime] = useState("30");
  const [price, setPrice] = useState("0.00");
  const [priceChange, setPriceChange] = useState(0);
  const [volume, setVolume] = useState("0");
  const [high, setHigh] = useState("0");
  const [low, setLow] = useState("0");
  const chartContainerRef = useRef(null);

 const timeframes = [
  { label: "30s", value: "30" },
  { label: "1m", value: "60" },
  { label: "1m30s", value: "90" },
  { label: "2m", value: "120" },
  { label: "2m30s", value: "150" },
  { label: "3m", value: "180" },
  { label: "3m30s", value: "210" },
  { label: "4m", value: "240" },
  { label: "4m30s", value: "270" },
  { label: "5m", value: "300" },
];

  // Initialize TradingView Widget
  useEffect(() => {
    if (chartContainerRef.current) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/tv.js";
      script.async = true;
      script.onload = () => {
        if (window.TradingView) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "BINANCE:BTCUSDT",
            interval: selectedTime,
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            toolbar_bg: "#0f0f1e",
            enable_publishing: false,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            container_id: "tradingview_chart",
            backgroundColor: "#0f0f1e",
            gridColor: "#1a1a2e",
            studies: ["Volume@tv-basicstudies"],
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: false,
            withdateranges: true,
            details: true,
            hotlist: true,
            calendar: false,
          });
        }
      };
      document.head.appendChild(script);

      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, [selectedTime]);

  // Connect to Binance WebSocket for live price updates
  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@ticker");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.c).toFixed(2));
      setPriceChange(parseFloat(data.P).toFixed(2));
      setVolume(parseFloat(data.v).toFixed(0));
      setHigh(parseFloat(data.h).toFixed(2));
      setLow(parseFloat(data.l).toFixed(2));
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="trade-page">
      {/* Chart Container with Full Height */}
      <div className="chart-section">
        {/* Price Ticker - Compact */}
        <div className="compact-ticker">
          <div className="ticker-left">
            <span className="ticker-symbol">Bitcoin / TetherUS</span>
            <span className="ticker-time">30 · Binance</span>
          </div>
          <div className="ticker-center">
            <span className={`ticker-price ${priceChange >= 0 ? "positive" : "negative"}`}>
              ${price}
            </span>
            <span className="ticker-high">H ${high}</span>
            <span className="ticker-low">L ${low}</span>
            <span className={`ticker-percent ${priceChange >= 0 ? "positive" : "negative"}`}>
              {priceChange >= 0 ? "+" : ""}
              {priceChange}%
            </span>
          </div>
          <div className="ticker-right">
            <span className="ticker-vol-label">Vol · BTC</span>
            <span className="ticker-vol-value">{volume}</span>
          </div>
        </div>

        {/* Timeframe Bar - Compact */}
        <div className="compact-timeframe">
          <div className="timeframe-left">
            {timeframes.map((time) => (
              <button
                key={time.value}
                className={`tf-btn ${selectedTime === time.value ? "active" : ""}`}
                onClick={() => setSelectedTime(time.value)}
              >
                {time.label}
              </button>
            ))}
          </div>
          <button className="indicators-compact">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            {t('indicators')}
          </button>
        </div>

        {/* Chart with Full Height */}
        <div className="chart-full" ref={chartContainerRef}>
          <div id="tradingview_chart" className="tradingview-widget"></div>
        </div>
      </div>

      {/* Trading Panel - Compact Bottom */}
      <div className="compact-trading">
        <div className="trade-inputs-row">
          <div className="trade-input-group">
            <label>{t('selectTimer')}</label>
            <select className="compact-select">
              <option value="">Choose a time</option>
              <option value="1">1 minute</option>
              <option value="5">5 minutes</option>
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
            </select>
          </div>
          <div className="trade-input-group">
            <label>{t('enterAmount')}</label>
            <div className="compact-amount">
              <button onClick={() => setAmount(Math.max(0, amount - 10))}>-</button>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="0"
              />
              <button onClick={() => setAmount(amount + 10)}>+</button>
            </div>
          </div>
        </div>
        <div className="trade-buttons-row">
          <button className="compact-sell">
            <span>{t('sell')}</span>
            <small>{t('byMarket')}</small>
          </button>
          <button className="compact-buy">
            <span>{t('buy')}</span>
            <small>{t('byMarket')}</small>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Trade;
