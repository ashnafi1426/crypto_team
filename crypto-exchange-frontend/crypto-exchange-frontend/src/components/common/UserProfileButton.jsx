import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import './UserProfileButton.css';

const UserProfileButton = () => {
  const navigate = useNavigate();
  const { profile, logoutUser } = useUser();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const getInitials = (name) => {
    const names = name.trim().split(' ');
    if (names.length >= 2) return names[0].charAt(0) + names[1].charAt(0);
    return name.charAt(0);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setShowDropdown(false);
  };

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem('authToken');
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <div className="user-profile-button" ref={dropdownRef}>
      <button 
        className="profile-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {profile.avatar ? (
          <img src={profile.avatar} alt={profile.fullName} />
        ) : (
          <span className="profile-initials">{getInitials(profile.fullName)}</span>
        )}
      </button>

      {showDropdown && (
        <div className="profile-dropdown">
          <div className="dropdown-header" onClick={() => handleNavigation('/settings')} style={{ cursor: 'pointer' }} title="Go to Settings">
            <div className="dropdown-avatar">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.fullName} />
              ) : (
                <span className="dropdown-initials">{getInitials(profile.fullName)}</span>
              )}
            </div>
            <div className="dropdown-user-info">
              <div className="dropdown-name">{profile.fullName}</div>
              <div className="dropdown-email">{profile.email}</div>
            </div>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-menu">
            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/settings')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile & {t('settings')}
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/wallet')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              {t('wallet')}
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/assets')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
              </svg>
              {t('navPortfolio')}
            </button>

            <button 
              className="dropdown-item"
              onClick={() => handleNavigation('/history')}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              Transaction {t('history')}
            </button>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-menu">
            <button 
              className="dropdown-item logout"
              onClick={handleLogout}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
              {t('logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileButton;
