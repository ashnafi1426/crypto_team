import React, { useState, useEffect } from 'react';

const PortfolioPerformance = () => {
  // Mock data - in real app, fetch from API or calculate from wallet
  const [portfolioData, setPortfolioData] = useState({
    totalValue: 84250.50,
    change24h: 2450.30,
    changePercent: 2.99,
    plToday: 1250.75,
    plAllTime: 12450.30,
    allTimePercent: 17.3
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolioData(prev => ({
        ...prev,
        totalValue: prev.totalValue + (Math.random() - 0.5) * 100,
        change24h: prev.change24h + (Math.random() - 0.5) * 50,
        changePercent: prev.changePercent + (Math.random() - 0.5) * 0.1,
        plToday: prev.plToday + (Math.random() - 0.5) * 20
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isPositive24h = portfolioData.change24h >= 0;
  const isPositiveToday = portfolioData.plToday >= 0;
  const isPositiveAllTime = portfolioData.plAllTime >= 0;

  return (
    <div className="portfolio-performance-card">
      <div className="performance-header">
        <h3>Total Portfolio Value</h3>
        <div className="performance-actions">
          <button className="btn-icon" title="Refresh">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="performance-main">
        <div className="portfolio-total-value">
          ${portfolioData.totalValue.toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </div>
        
        <div className={`portfolio-change-24h ${isPositive24h ? 'positive' : 'negative'}`}>
          {isPositive24h ? '▲' : '▼'} 
          {isPositive24h ? '+' : ''}${Math.abs(portfolioData.change24h).toLocaleString('en-US', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })} 
          ({isPositive24h ? '+' : ''}{portfolioData.changePercent.toFixed(2)}%) 24h
        </div>
      </div>

      <div className="performance-stats">
        <div className="performance-stat">
          <div className="stat-label-perf">P&L Today</div>
          <div className={`stat-value-perf ${isPositiveToday ? 'positive' : 'negative'}`}>
            {isPositiveToday ? '+' : ''}${Math.abs(portfolioData.plToday).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </div>
        </div>

        <div className="performance-stat">
          <div className="stat-label-perf">P&L All Time</div>
          <div className={`stat-value-perf ${isPositiveAllTime ? 'positive' : 'negative'}`}>
            {isPositiveAllTime ? '+' : ''}${Math.abs(portfolioData.plAllTime).toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
            <span className="stat-percent">
              ({isPositiveAllTime ? '+' : ''}{portfolioData.allTimePercent.toFixed(1)}%)
            </span>
          </div>
        </div>
      </div>

      <div className="performance-mini-chart">
        <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="perfGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isPositive24h ? '#10b981' : '#ef4444'} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={isPositive24h ? '#10b981' : '#ef4444'} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path
            d="M0,40 L30,35 L60,38 L90,30 L120,25 L150,28 L180,20 L210,18 L240,15 L270,12 L300,10 L300,60 L0,60 Z"
            fill="url(#perfGradient)"
          />
          <path
            d="M0,40 L30,35 L60,38 L90,30 L120,25 L150,28 L180,20 L210,18 L240,15 L270,12 L300,10"
            fill="none"
            stroke={isPositive24h ? '#10b981' : '#ef4444'}
            strokeWidth="2"
          />
        </svg>
        <div className="chart-label">Last 7 days</div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;
