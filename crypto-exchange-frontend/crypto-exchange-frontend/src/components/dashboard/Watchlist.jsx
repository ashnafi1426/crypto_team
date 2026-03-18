import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/components/watchlist-activity.css';

const Watchlist = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Load favorites from localStorage
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : ['BTC', 'ETH', 'SOL'];
  });

  const [showAddModal, setShowAddModal] = useState(false);

  // Mock coin data - in real app, fetch from API
  const allCoins = [
    { symbol: 'BTC', name: 'Bitcoin', price: 67842.50, change: 1.86, icon: '₿', color: '#f7931a' },
    { symbol: 'ETH', name: 'Ethereum', price: 3245.30, change: 2.14, icon: 'Ξ', color: '#627eea' },
    { symbol: 'SOL', name: 'Solana', price: 145.20, change: -0.52, icon: '◎', color: '#9945ff' },
    { symbol: 'BNB', name: 'Binance Coin', price: 412.80, change: 0.95, icon: 'B', color: '#f3ba2f' },
    { symbol: 'ADA', name: 'Cardano', price: 0.45, change: -1.23, icon: '₳', color: '#0033ad' },
    { symbol: 'AVAX', name: 'Avalanche', price: 38.50, change: 3.45, icon: 'A', color: '#e84142' },
    { symbol: 'DOT', name: 'Polkadot', price: 7.25, change: 1.67, icon: '●', color: '#e6007a' },
    { symbol: 'MATIC', name: 'Polygon', price: 0.89, change: 2.34, icon: '⬡', color: '#8247e5' },
  ];

  const watchlistCoins = allCoins.filter(coin => favorites.includes(coin.symbol));
  const availableCoins = allCoins.filter(coin => !favorites.includes(coin.symbol));

  // Save to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem('watchlist', JSON.stringify(favorites));
  }, [favorites]);

  const removeFavorite = (symbol) => {
    setFavorites(prev => prev.filter(s => s !== symbol));
  };

  const addFavorite = (symbol) => {
    if (!favorites.includes(symbol)) {
      setFavorites(prev => [...prev, symbol]);
    }
    setShowAddModal(false);
  };

  return (
    <div className="watchlist-card">
      <div className="watchlist-header">
        <h3>⭐ {t('myWatchlist')}</h3>
        <button 
          className="btn-add-watchlist" 
          onClick={() => setShowAddModal(true)}
          title="Add coin"
        >
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>

      {watchlistCoins.length === 0 ? (
        <div className="watchlist-empty">
          <div className="empty-icon">⭐</div>
          <p>{t('noCoinsWatchlist')}</p>
          <button className="btn-add-first" onClick={() => setShowAddModal(true)}>
            {t('addFirstCoin')}
          </button>
        </div>
      ) : (
        <div className="watchlist-items">
          {watchlistCoins.map(coin => {
            const isPositive = coin.change >= 0;
            return (
              <div 
                key={coin.symbol} 
                className="watchlist-item"
                onClick={() => navigate('/trade')}
              >
                <div className="watchlist-coin-info">
                  <div className="watchlist-icon" style={{ color: coin.color }}>
                    {coin.icon}
                  </div>
                  <div className="watchlist-details">
                    <div className="watchlist-symbol">{coin.symbol}</div>
                    <div className="watchlist-name">{coin.name}</div>
                  </div>
                </div>
                
                <div className="watchlist-price-info">
                  <div className="watchlist-price">
                    ${coin.price.toLocaleString('en-US', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className={`watchlist-change ${isPositive ? 'positive' : 'negative'}`}>
                    {isPositive ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
                  </div>
                </div>

                <button 
                  className="btn-remove-watchlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(coin.symbol);
                  }}
                  title={t('removeFromWatchlist')}
                >
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Coin Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content watchlist-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{t('addToWatchlist')}</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {availableCoins.length === 0 ? (
                <p className="no-coins-message">{t('allCoinsAdded')}</p>
              ) : (
                <div className="available-coins-list">
                  {availableCoins.map(coin => (
                    <div 
                      key={coin.symbol} 
                      className="available-coin-item"
                      onClick={() => addFavorite(coin.symbol)}
                    >
                      <div className="coin-info-modal">
                        <div className="coin-icon-modal" style={{ color: coin.color }}>
                          {coin.icon}
                        </div>
                        <div>
                          <div className="coin-symbol-modal">{coin.symbol}</div>
                          <div className="coin-name-modal">{coin.name}</div>
                        </div>
                      </div>
                      <button className="btn-add-coin">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
