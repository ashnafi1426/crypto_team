import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import '../../styles/components/watchlist-activity.css';

const RecentActivity = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Mock transaction data - in real app, fetch from API
  const recentTransactions = [
    {
      id: 1,
      type: 'deposit',
      asset: 'BTC',
      amount: '0.05',
      status: 'completed',
      timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 min ago
      icon: '✅',
      color: '#10b981'
    },
    {
      id: 2,
      type: 'send',
      asset: 'USDT',
      amount: '100',
      status: 'completed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      icon: '📤',
      color: '#0ea5e9'
    },
    {
      id: 3,
      type: 'buy',
      asset: 'ETH',
      amount: '0.5',
      status: 'completed',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      icon: '📈',
      color: '#10b981'
    },
    {
      id: 4,
      type: 'withdraw',
      asset: 'SOL',
      amount: '5.2',
      status: 'pending',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
      icon: '⏳',
      color: '#fbbf24'
    },
    {
      id: 5,
      type: 'swap',
      asset: 'BNB → USDT',
      amount: '2.5',
      status: 'completed',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      icon: '🔄',
      color: '#0ea5e9'
    }
  ];

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - timestamp) / 1000);
    if (seconds < 60) return `${seconds} ${t('secAgo')}`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)} ${t('minAgo')}`;
    const h = Math.floor(seconds / 3600);
    if (seconds < 86400) return `${h} ${h > 1 ? t('hoursAgo') : t('hourAgo')}`;
    const d = Math.floor(seconds / 86400);
    return `${d} ${d > 1 ? t('daysAgo') : t('dayAgo')}`;
  };

  const getTypeLabel = (type) => {
    const labels = {
      deposit: t('txDeposit'),
      send: t('txSent'),
      buy: t('txBought'),
      withdraw: t('txWithdraw'),
      swap: t('txSwapped'),
      sell: t('txSold')
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const badges = {
      completed: { label: t('completed'), class: 'status-completed' },
      pending: { label: t('pending'), class: 'status-pending' },
      failed: { label: t('failed'), class: 'status-failed' }
    };
    return badges[status] || { label: status, class: '' };
  };

  return (
    <div className="recent-activity-card">
      <div className="activity-header">
        <h3>{t('recentActivity')}</h3>
        <button 
          className="btn-view-all"
          onClick={() => navigate('/history')}
        >
          {t('viewAll')} →
        </button>
      </div>

      {recentTransactions.length === 0 ? (
        <div className="activity-empty">
          <div className="empty-icon">📜</div>
          <p>{t('noRecentActivity')}</p>
          <button className="btn-start-trading" onClick={() => navigate('/trade')}>
            {t('startTrading')}
          </button>
        </div>
      ) : (
        <div className="activity-list">
          {recentTransactions.map(tx => {
            const statusBadge = getStatusBadge(tx.status);
            
            return (
              <div 
                key={tx.id} 
                className="activity-item"
                onClick={() => navigate('/history')}
              >
                <div className="activity-icon" style={{ color: tx.color }}>
                  {tx.icon}
                </div>
                
                <div className="activity-details">
                  <div className="activity-main">
                    <span className="activity-type">{getTypeLabel(tx.type)}</span>
                    <span className="activity-amount">
                      {tx.amount} {tx.asset}
                    </span>
                  </div>
                  <div className="activity-meta">
                    <span className="activity-time">{getTimeAgo(tx.timestamp)}</span>
                    <span className={`activity-status ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                </div>

                <div className="activity-arrow">
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="activity-footer">
        <button 
          className="btn-full-history"
          onClick={() => navigate('/history')}
        >
          {t('viewFullHistory')}
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
