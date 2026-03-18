import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_ITEMS } from '../../utils/constants';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, logoutUser } = useUser();
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Sync body attribute so layout padding shifts
  useEffect(() => {
    document.body.setAttribute('data-sidebar', isExpanded ? 'open' : 'closed');
  }, [isExpanded]);

  // Keyboard shortcut Ctrl+B
  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsExpanded(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const getNavPath = (itemId) => {
    const pathMap = {
      'dashboard': '/', 'markets': '/markets', 'trade': '/trade',
      'history': '/history', 'wallet': '/wallet', 'assets': '/assets',
      'staking': '/staking',
      'nfts': '/nfts', 'settings': '/settings'
    };
    return pathMap[itemId] || '/';
  };

  const isActive = (itemId) => location.pathname === getNavPath(itemId);

  const toggle = () => setIsExpanded(prev => !prev);

  const renderNavItems = (items) => items.map(item => (
    <Link
      key={item.id}
      to={getNavPath(item.id)}
      className={`snav-item ${isActive(item.id) ? 'active' : ''}`}
      title={!isExpanded ? t(item.id) : ''}
      onClick={() => { if (window.innerWidth <= 600) setIsExpanded(false); }}
    >
      <span className="snav-icon"><NavIcon type={item.icon} /></span>
      <span className="snav-label">{t(item.id)}</span>
      {item.badge && <span className={`snav-badge ${item.badgeColor || ''}`}>{item.badge}</span>}
    </Link>
  ));

  return (
    <>
      {/* Mobile floating toggle — only visible when sidebar is closed on mobile */}
      {!isExpanded && (
        <button className="snav-mobile-fab" onClick={toggle} aria-label="Open navigation">
          <span className="snav-toggle-icon">N</span>
        </button>
      )}

      {isExpanded && (
        <div className="snav-backdrop" onClick={() => setIsExpanded(false)} />
      )}
      <aside className={`snav ${isExpanded ? 'snav--open' : 'snav--closed'}`}>
        {/* Toggle button / logo */}
        <button className="snav-toggle" onClick={toggle} title="Toggle sidebar (Ctrl+B)">
          <span className="snav-toggle-icon">N</span>
          <span className="snav-toggle-text">NEXUS</span>
        </button>

      <div className="snav-body">
        {/* MARKETS */}
        <div className="snav-section">
          <div className="snav-section-label">{t('navMarkets')}</div>
          {renderNavItems(NAV_ITEMS.markets)}
        </div>

        {/* PORTFOLIO */}
        <div className="snav-section">
          <div className="snav-section-label">{t('navPortfolio')}</div>
          {renderNavItems(NAV_ITEMS.portfolio)}
        </div>

        {/* DEFI */}
        <div className="snav-section">
          <div className="snav-section-label">{t('navDefi')}</div>
          {renderNavItems(NAV_ITEMS.defi)}
        </div>

        {/* ACCOUNT */}
        <div className="snav-section">
          <div className="snav-section-label">{t('navAccount')}</div>
          <Link to="/settings" className={`snav-item ${location.pathname === '/settings' ? 'active' : ''}`} title={!isExpanded ? t('settings') : ''} onClick={() => { if (window.innerWidth <= 600) setIsExpanded(false); }}>
            <span className="snav-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
            </span>
            <span className="snav-label">{t('settings')}</span>
          </Link>
          <button className="snav-item snav-logout" title={!isExpanded ? t('logout') : ''} onClick={() => { logoutUser(); navigate('/intro'); }}>
            <span className="snav-icon"><NavIcon type="logout" /></span>
            <span className="snav-label">{t('logout')}</span>
          </button>
        </div>
      </div>

      {/* User card */}
      <div className="snav-user" onClick={() => navigate('/settings')} style={{ cursor: 'pointer' }} title="Go to Settings">
        <div className="snav-user-avatar">
          {profile.avatar
            ? <img src={profile.avatar} alt="avatar" />
            : <span>{(profile.fullName || profile.username || 'U').charAt(0).toUpperCase()}</span>
          }
        </div>
        <div className="snav-user-info">
          <div className="snav-user-name">{profile.fullName || profile.username || 'Guest'}</div>
          <div className="snav-user-email">{profile.email || t('notLoggedIn')}</div>
        </div>
      </div>
    </aside>
    </>
  );
};

const NavIcon = ({ type }) => {
  const icons = {
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    chart: <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    wallet: <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></>,
    box: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>,
    'bar-chart': <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    circle: <><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
      {icons[type]}
    </svg>
  );
};

export default Sidebar;
