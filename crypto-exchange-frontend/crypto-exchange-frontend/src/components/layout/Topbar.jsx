import React from 'react';
import { useNavigate } from 'react-router-dom';
import TickerScroll from '../common/TickerScroll';
import NotificationCenter from '../common/NotificationCenter';
import LanguageSelector from '../common/LanguageSelector';
import UserProfileButton from '../common/UserProfileButton';
import { useLanguage } from '../../context/LanguageContext';

const Topbar = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <header className="topbar">
      <TickerScroll />

      <div className="topbar-actions">
        <NotificationCenter />
        <LanguageSelector />
        <button className="btn-ghost" onClick={() => navigate('/deposit')}>{t('deposit')}</button>
        <button className="btn-primary" onClick={() => navigate('/trade')}>{t('tradeNow')}</button>
        <UserProfileButton />
      </div>
    </header>
  );
};

export default Topbar;
