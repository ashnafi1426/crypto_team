import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import "../styles/components/intro.css";

function Intro() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: "🔒",
      title: "Secure Trading",
      description: "Multi-layer encryption and cold wallet storage protect your assets 24/7"
    },
    {
      icon: "⚡",
      title: "Fast Execution",
      description: "Lightning-fast order execution with minimal latency for optimal trading"
    },
    {
      icon: "🌍",
      title: "Global Markets",
      description: "Access crypto and forex markets all in one professional platform"
    },
    {
      icon: "📊",
      title: "User-Friendly Interface",
      description: "Modern, intuitive design built for both beginners and professionals"
    }
  ];

  const steps = [
    { number: "01", title: "Create an Account", description: "Sign up in seconds with email verification" },
    { number: "02", title: "Deposit Funds", description: "Add funds securely via multiple payment methods" },
    { number: "03", title: "Start Trading", description: "Execute trades instantly on crypto and forex markets" }
  ];

  const cryptoAssets = ["BTC", "ETH", "SOL", "XRP", "USDT", "BNB", "ADA", "DOGE"];
  const forexPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD"];

  return (
    <div className="intro-page">
      {/* Header / Navbar */}
      <header className={`intro-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">NEXUS</span>
          </div>
          <nav className="nav-links">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="header-actions">
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="intro-lang-select"
            >
              <option value="en">🇬🇧 EN</option>
              <option value="es">🇪🇸 ES</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="de">🇩🇪 DE</option>
              <option value="ar">🇸🇦 AR</option>
            </select>
            <button className="btn-secondary" onClick={() => navigate('/login')}>{t('signIn')}</button>
            <button className="btn-primary" onClick={() => navigate('/signup')}>{t('signUp')}</button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" id="home">
        <div className="hero-background">
          <div className="floating-icon crypto-btc">₿</div>
          <div className="floating-icon crypto-eth">Ξ</div>
          <div className="floating-icon crypto-chart">📈</div>
        </div>
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-headline">
              Trade Crypto & Forex<br />
              <span className="gradient-text">Easily and Securely</span>
            </h1>
            <p className="hero-subheadline">
              Buy, sell, and trade cryptocurrencies and forex pairs on a professional and secure platform.
            </p>
            <div className="hero-buttons">
              <button className="btn-hero-primary" onClick={() => navigate('/signup')}>{t('signUp')}</button>
              <button className="btn-hero-secondary" onClick={() => window.location.href = '#features'}>Explore Features</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="crypto-abstract">
              <div className="crypto-symbols">
                <div className="symbol-float symbol-btc">₿</div>
                <div className="symbol-float symbol-eth">Ξ</div>
                <div className="symbol-float symbol-chart">📊</div>
              </div>
              <div className="trading-chart">
                <div className="chart-grid"></div>
                <div className="candlestick-container">
                  <div className="candlestick green" style={{height: '60%'}}></div>
                  <div className="candlestick red" style={{height: '40%'}}></div>
                  <div className="candlestick green" style={{height: '75%'}}></div>
                  <div className="candlestick green" style={{height: '55%'}}></div>
                  <div className="candlestick red" style={{height: '45%'}}></div>
                  <div className="candlestick green" style={{height: '80%'}}></div>
                  <div className="candlestick green" style={{height: '70%'}}></div>
                  <div className="candlestick red" style={{height: '50%'}}></div>
                </div>
                <div className="trend-line"></div>
                <div className="price-indicators">
                  <div className="price-tag up">+12.5%</div>
                  <div className="price-tag">$67,234</div>
                </div>
              </div>
              <div className="data-stream">
                <div className="data-line"></div>
                <div className="data-line"></div>
                <div className="data-line"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll Down</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Market Overview - Ticker Style */}
      <section className="market-ticker-section">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <div className="ticker-item">
              <span className="ticker-icon">₿</span>
              <span className="ticker-name">Bitcoin</span>
              <span className="ticker-price">$67,234.50</span>
              <span className="ticker-change positive">+2.45%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">Ξ</span>
              <span className="ticker-name">Ethereum</span>
              <span className="ticker-price">$3,456.78</span>
              <span className="ticker-change positive">+1.23%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">◎</span>
              <span className="ticker-name">Solana</span>
              <span className="ticker-price">$145.67</span>
              <span className="ticker-change negative">-0.89%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">⬡</span>
              <span className="ticker-name">Cardano</span>
              <span className="ticker-price">$0.45</span>
              <span className="ticker-change positive">+2.34%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">Ð</span>
              <span className="ticker-name">Dogecoin</span>
              <span className="ticker-price">$0.08</span>
              <span className="ticker-change positive">+5.67%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">⬢</span>
              <span className="ticker-name">Polygon</span>
              <span className="ticker-price">$0.89</span>
              <span className="ticker-change positive">+1.89%</span>
            </div>
            {/* Duplicate for seamless loop */}
            <div className="ticker-item">
              <span className="ticker-icon">₿</span>
              <span className="ticker-name">Bitcoin</span>
              <span className="ticker-price">$67,234.50</span>
              <span className="ticker-change positive">+2.45%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">Ξ</span>
              <span className="ticker-name">Ethereum</span>
              <span className="ticker-price">$3,456.78</span>
              <span className="ticker-change positive">+1.23%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">◎</span>
              <span className="ticker-name">Solana</span>
              <span className="ticker-price">$145.67</span>
              <span className="ticker-change negative">-0.89%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">⬡</span>
              <span className="ticker-name">Cardano</span>
              <span className="ticker-price">$0.45</span>
              <span className="ticker-change positive">+2.34%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">Ð</span>
              <span className="ticker-name">Dogecoin</span>
              <span className="ticker-price">$0.08</span>
              <span className="ticker-change positive">+5.67%</span>
            </div>
            <div className="ticker-item">
              <span className="ticker-icon">⬢</span>
              <span className="ticker-name">Polygon</span>
              <span className="ticker-price">$0.89</span>
              <span className="ticker-change positive">+1.89%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Market Stats Grid */}
      <section className="market-stats-section">
        <div className="container">
          <h2 className="section-title">Market Overview</h2>
          <p className="section-subtitle">Real-time cryptocurrency market statistics</p>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">$2.1T</div>
              <div className="stat-label">Total Market Cap</div>
              <div className="stat-change positive">+3.2%</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">$89.5B</div>
              <div className="stat-label">24h Trading Volume</div>
              <div className="stat-change positive">+12.5%</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">₿</div>
              <div className="stat-value">48.2%</div>
              <div className="stat-label">Bitcoin Dominance</div>
              <div className="stat-change negative">-0.8%</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔥</div>
              <div className="stat-value">12,450+</div>
              <div className="stat-label">Active Cryptocurrencies</div>
              <div className="stat-change positive">+2.1%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="container">
          <h2 className="section-title">Why Choose NEXUS?</h2>
          <p className="section-subtitle">Professional trading platform built for your success</p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Start trading in 3 simple steps</p>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{step.number}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trading Interface Preview */}
      <section className="trading-preview">
        <div className="container">
          <h2 className="section-title">Professional Trading Interface</h2>
          <p className="section-subtitle">Advanced tools for serious traders</p>
          <div className="preview-mockup">
            <div className="preview-image-container">
              <img 
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=700&fit=crop" 
                alt="Professional Trading Interface" 
                className="preview-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="preview-screen" style={{ display: 'none' }}>
                <div className="preview-chart-area">
                  <div className="preview-chart-lines"></div>
                </div>
                <div className="preview-panel">
                  <div className="preview-panel-item"></div>
                  <div className="preview-panel-item"></div>
                </div>
              </div>
            </div>
            <div className="preview-features">
              <div className="preview-feature-item">
                <span className="preview-feature-icon">📊</span>
                <div className="preview-feature-text">
                  <h4>Advanced Charting</h4>
                  <p>TradingView integration with 100+ indicators</p>
                </div>
              </div>
              <div className="preview-feature-item">
                <span className="preview-feature-icon">⚡</span>
                <div className="preview-feature-text">
                  <h4>Real-Time Data</h4>
                  <p>Live order book and trade execution</p>
                </div>
              </div>
              <div className="preview-feature-item">
                <span className="preview-feature-icon">🎯</span>
                <div className="preview-feature-text">
                  <h4>Multiple Order Types</h4>
                  <p>Market, limit, stop-loss, and more</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Assets */}
      <section className="supported-assets" id="about">
        <div className="container">
          <h2 className="section-title">Supported Assets</h2>
          <div className="assets-category">
            <h3 className="assets-subtitle">Cryptocurrencies</h3>
            <div className="assets-list">
              {cryptoAssets.map((asset, index) => (
                <div key={index} className="asset-badge crypto">{asset}</div>
              ))}
            </div>
          </div>
          <div className="assets-category">
            <h3 className="assets-subtitle">Forex Pairs</h3>
            <div className="assets-list">
              {forexPairs.map((pair, index) => (
                <div key={index} className="asset-badge forex">{pair}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="security-section">
        <div className="container">
          <h2 className="section-title">Bank-Level Security</h2>
          <p className="security-description">
            Your funds are protected with multi-layer encryption, cold wallet storage, and real-time monitoring.
          </p>
          <div className="security-features">
            <div className="security-item">
              <span className="security-icon">🔐</span>
              <span>256-bit Encryption</span>
            </div>
            <div className="security-item">
              <span className="security-icon">❄️</span>
              <span>Cold Wallet Storage</span>
            </div>
            <div className="security-item">
              <span className="security-icon">👁️</span>
              <span>24/7 Monitoring</span>
            </div>
            <div className="security-item">
              <span className="security-icon">✅</span>
              <span>2FA Authentication</span>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section" id="contact">
        <div className="container">
          <h2 className="cta-headline">Start Trading Today</h2>
          <p className="cta-subheadline">Join thousands of traders worldwide</p>
          <div className="cta-buttons">
            <button className="btn-cta-primary" onClick={() => navigate('/signup')}>{t('signUp')}</button>
            <button className="btn-cta-secondary" onClick={() => window.location.href = '#features'}>Explore Features</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="intro-footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">⚡</span>
              <span className="logo-text">NEXUS</span>
            </div>
            <p className="footer-tagline">Professional Crypto & Forex Trading</p>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
          <div className="footer-section">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#twitter">Twitter</a>
              <a href="#telegram">Telegram</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 NEXUS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Intro;
