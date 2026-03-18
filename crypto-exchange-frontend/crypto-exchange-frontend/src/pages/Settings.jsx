import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import CountryPhoneSelect from '../components/common/CountryPhoneSelect';
import '../styles/components/settings.css';

const Settings = () => {
  const { addNotification } = useNotifications();
  const { profile, setProfile } = useUser();
  const [activeSection, setActiveSection] = useState('profile');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showAPIModal, setShowAPIModal] = useState(false);

  // Referral
  const [referralCode] = useState('NEXUS-T7K2X');
  const [referralCopied, setReferralCopied] = useState(false);
  const referralStats = { invited: 7, earned: 142.50 };

  // Account tier
  const tradingVolume30d = 34800; // USD
  const getTier = (vol) => {
    if (vol >= 100000) return { name: 'VIP', color: '#f59e0b', glow: 'rgba(245,158,11,0.4)', next: null, nextVol: null };
    if (vol >= 10000) return { name: 'Pro', color: '#3a6ff7', glow: 'rgba(58,111,247,0.4)', next: 'VIP', nextVol: 100000 };
    return { name: 'Basic', color: '#94a3b8', glow: 'rgba(148,163,184,0.3)', next: 'Pro', nextVol: 10000 };
  };
  const tier = getTier(tradingVolume30d);
  const tierProgress = tier.nextVol ? Math.min((tradingVolume30d / tier.nextVol) * 100, 100) : 100;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://nexus.exchange/ref/${referralCode}`);
    setReferralCopied(true);
    setTimeout(() => setReferralCopied(false), 2000);
    addNotification('success', 'Referral link copied!');
  };

  // Security state
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [loginActivity, setLoginActivity] = useState([
    { id: 1, date: 'Mar 12, 2026', time: '14:30', device: 'Chrome - Windows', ip: '192.168.1.1', location: 'Ethiopia', current: true, trusted: false },
    { id: 2, date: 'Mar 11, 2026', time: '09:15', device: 'Firefox - Windows', ip: '192.168.1.1', location: 'Ethiopia', current: false, trusted: true },
    { id: 3, date: 'Mar 10, 2026', time: '16:45', device: 'Chrome - Android', ip: '192.168.1.2', location: 'Ethiopia', current: false, trusted: false },
    { id: 4, date: 'Mar 09, 2026', time: '22:10', device: 'Safari - iPhone', ip: '192.168.1.3', location: 'Ethiopia', current: false, trusted: true }
  ]);

  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [activityLog, setActivityLog] = useState([
    { id: 1, date: '2026-03-12', time: '14:30', type: 'login', description: 'Logged in from Chrome - Windows', status: 'success', ip: '192.168.1.1' },
    { id: 2, date: '2026-03-12', time: '10:15', type: 'trade', description: 'Bought 0.05 BTC at $67,500', status: 'completed', ip: '192.168.1.1' },
    { id: 3, date: '2026-03-11', time: '16:20', type: 'withdrawal', description: 'Withdrew 1.5 ETH to external wallet', status: 'completed', ip: '192.168.1.1' },
    { id: 4, date: '2026-03-11', time: '09:15', type: 'login', description: 'Logged in from Firefox - Windows', status: 'success', ip: '192.168.1.1' },
    { id: 5, date: '2026-03-10', time: '18:45', type: 'settings', description: 'Changed notification preferences', status: 'success', ip: '192.168.1.1' },
    { id: 6, date: '2026-03-10', time: '16:45', type: 'login', description: 'Logged in from Chrome - Android', status: 'success', ip: '192.168.1.2' },
    { id: 7, date: '2026-03-10', time: '11:30', type: 'deposit', description: 'Deposited 5000 USDT', status: 'completed', ip: '192.168.1.1' },
    { id: 8, date: '2026-03-09', time: '22:10', type: 'login', description: 'Logged in from Safari - iPhone', status: 'success', ip: '192.168.1.3' },
    { id: 9, date: '2026-03-09', time: '14:20', type: 'security', description: 'Password changed successfully', status: 'success', ip: '192.168.1.1' },
    { id: 10, date: '2026-03-08', time: '09:00', type: 'login', description: 'Failed login attempt', status: 'failed', ip: '192.168.1.5' }
  ]);
  const [activityFilter, setActivityFilter] = useState('all');
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: true,
    pushAlerts: false,
    depositAlerts: true,
    withdrawalAlerts: true,
    securityAlerts: true,
    priceAlerts: false
  });

  // Preferences
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    language: 'en'
  });

  // KYC state — per level
  const [kycLevels, setKycLevels] = useState({
    level1: { status: 'verified', submittedAt: '2026-02-10' },   // email verified
    level2: { status: 'not-started', submittedAt: null },         // ID document
    level3: { status: 'not-started', submittedAt: null }          // address proof
  });
  const [kycStep, setKycStep] = useState(null); // null | 'level2' | 'level3'
  const [kycForm, setKycForm] = useState({
    docType: 'passport',
    docFront: null, docBack: null,
    selfie: null,
    addressDoc: null,
    docFrontName: '', docBackName: '', selfieName: '', addressDocName: ''
  });

  // Anti-phishing code
  const [phishingCode, setPhishingCode] = useState('NEXUS-SAFE');
  const [phishingInput, setPhishingInput] = useState('NEXUS-SAFE');
  const [phishingEditing, setPhishingEditing] = useState(false);

  // Withdrawal whitelist
  const [whitelistEnabled, setWhitelistEnabled] = useState(false);
  const [whitelist, setWhitelist] = useState([
    { id: 1, label: 'My Ledger', address: '0x1a2b3c4d5e6f...', coin: 'ETH', added: '2026-03-01' },
    { id: 2, label: 'Cold Wallet', address: 'bc1qxy2kgdygjrs...', coin: 'BTC', added: '2026-02-20' }
  ]);
  const [showAddWhitelist, setShowAddWhitelist] = useState(false);
  const [newWhitelist, setNewWhitelist] = useState({ label: '', address: '', coin: 'BTC' });

  // Payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'bank', bankName: 'Commercial Bank of Ethiopia', accountHolder: 'Toni User', accountNumber: '1000234521', currency: 'ETB', isDefault: true, verified: true, addedDate: '2026-01-15' },
    { id: 2, type: 'bank', bankName: 'Awash Bank', accountHolder: 'Toni User', accountNumber: '0087654321', currency: 'ETB', isDefault: false, verified: true, addedDate: '2026-02-03' },
    { id: 3, type: 'card', cardBrand: 'Visa', cardHolder: 'TONI USER', cardNumber: '4111111111118834', expiry: '09/28', currency: 'USD', isDefault: false, verified: true, addedDate: '2026-02-20' }
  ]);
  const [paymentTab, setPaymentTab] = useState('bank'); // 'bank' | 'card'
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [newPayment, setNewPayment] = useState({
    type: 'bank',
    bankName: '', accountHolder: '', accountNumber: '', currency: 'ETB',
    cardBrand: 'Visa', cardHolder: '', cardNumber: '', expiry: ''
  });

  // Trading preferences
  const [tradingPrefs, setTradingPrefs] = useState({
    defaultPair: 'BTC/USDT',
    defaultOrderType: 'limit',
    confirmOrder: true,
    defaultLeverage: '10x',
    showPnlPercent: true
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    hideBalance: false,
    profileVisibility: 'private'
  });

  // API Keys
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Trading Bot', key: 'sk_live_***************', created: '2026-03-01', permissions: ['read', 'trade'], active: true },
    { id: 2, name: 'Portfolio Tracker', key: 'sk_live_***************', created: '2026-02-15', permissions: ['read'], active: true }
  ]);

  const handleProfileUpdate = () => {
    setProfile(profile); // persists current state to localStorage via updateProfile
    addNotification('success', 'Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      addNotification('error', 'Please fill all fields');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      addNotification('error', 'Passwords do not match');
      return;
    }
    if (passwordForm.new.length < 8) {
      addNotification('error', 'Password must be at least 8 characters');
      return;
    }
    addNotification('success', 'Password changed successfully');
    setShowPasswordModal(false);
    setPasswordForm({ current: '', new: '', confirm: '' });
  };

  const handleToggle2FA = () => {
    if (!twoFAEnabled) {
      setShow2FAModal(true);
    } else {
      setTwoFAEnabled(false);
      addNotification('success', '2FA disabled');
    }
  };

  const handleEnable2FA = () => {
    setTwoFAEnabled(true);
    setShow2FAModal(false);
    // Generate backup codes
    const codes = Array.from({ length: 10 }, () => 
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    setBackupCodes(codes);
    setShowBackupCodes(true);
    addNotification('success', '2FA enabled successfully');
  };

  const handleDownloadBackupCodes = () => {
    const content = `NEXUS Exchange - 2FA Backup Codes\nGenerated: ${new Date().toLocaleString()}\n\n${backupCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}\n\nKeep these codes safe. Each code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nexus-backup-codes.txt';
    link.click();
    addNotification('success', 'Backup codes downloaded');
  };

  const handleTrustDevice = (id) => {
    setLoginActivity(loginActivity.map(activity => 
      activity.id === id ? { ...activity, trusted: !activity.trusted } : activity
    ));
    const device = loginActivity.find(a => a.id === id);
    addNotification('success', `Device ${device.trusted ? 'untrusted' : 'trusted'}`);
  };

  const handleLogoutDevice = (device) => {
    setLoginActivity(loginActivity.filter(a => a.device !== device));
    addNotification('success', `Logged out from ${device}`);
  };

  const handleLogoutAll = () => {
    setLoginActivity(loginActivity.filter(a => a.current));
    addNotification('success', 'Logged out from all devices except current');
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return '🔐';
      case 'trade': return '💱';
      case 'deposit': return '💰';
      case 'withdrawal': return '💸';
      case 'settings': return '⚙️';
      case 'security': return '🛡️';
      default: return '📝';
    }
  };

  const getActivityColor = (type, status) => {
    if (status === 'failed') return '#ef4444';
    switch (type) {
      case 'login': return '#00f5ff';
      case 'trade': return '#00ff88';
      case 'deposit': return '#00ff88';
      case 'withdrawal': return '#f59e0b';
      case 'security': return '#bf5fff';
      default: return 'var(--text-secondary)';
    }
  };

  const filteredActivityLog = activityFilter === 'all' 
    ? activityLog 
    : activityLog.filter(log => log.type === activityFilter);

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const handleThemeChange = (theme) => {
    setPreferences({ ...preferences, theme });
    addNotification('info', `Theme changed to ${theme}`);
  };

  const handleLanguageChange = (language) => {
    setPreferences({ ...preferences, language });
    addNotification('info', 'Language updated');
  };

  const handleCreateAPIKey = () => {
    setShowAPIModal(true);
  };

  const handleRevokeAPIKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
    addNotification('success', 'API key revoked');
  };

  const handleSavePhishingCode = () => {
    if (!phishingInput.trim()) { addNotification('error', 'Code cannot be empty'); return; }
    setPhishingCode(phishingInput.trim().toUpperCase());
    setPhishingEditing(false);
    addNotification('success', 'Anti-phishing code updated');
  };

  const handleAddWhitelist = () => {
    if (!newWhitelist.label || !newWhitelist.address) { addNotification('error', 'Fill all fields'); return; }
    setWhitelist([...whitelist, { ...newWhitelist, id: Date.now(), added: new Date().toISOString().split('T')[0] }]);
    setNewWhitelist({ label: '', address: '', coin: 'BTC' });
    setShowAddWhitelist(false);
    addNotification('success', 'Address added to whitelist');
  };

  const handleRemoveWhitelist = (id) => {
    setWhitelist(whitelist.filter(w => w.id !== id));
    addNotification('success', 'Address removed from whitelist');
  };

  const handleAddPayment = () => {
    if (newPayment.type === 'bank') {
      if (!newPayment.bankName || !newPayment.accountHolder || !newPayment.accountNumber) {
        addNotification('error', 'Fill all bank account fields'); return;
      }
      setPaymentMethods([...paymentMethods, {
        id: Date.now(), type: 'bank',
        bankName: newPayment.bankName,
        accountHolder: newPayment.accountHolder,
        accountNumber: newPayment.accountNumber,
        currency: newPayment.currency,
        isDefault: false, verified: false,
        addedDate: new Date().toISOString().split('T')[0]
      }]);
    } else {
      if (!newPayment.cardBrand || !newPayment.cardHolder || !newPayment.cardNumber || !newPayment.expiry) {
        addNotification('error', 'Fill all card fields'); return;
      }
      setPaymentMethods([...paymentMethods, {
        id: Date.now(), type: 'card',
        cardBrand: newPayment.cardBrand,
        cardHolder: newPayment.cardHolder,
        cardNumber: newPayment.cardNumber,
        expiry: newPayment.expiry,
        currency: newPayment.currency || 'USD',
        isDefault: false, verified: false,
        addedDate: new Date().toISOString().split('T')[0]
      }]);
    }
    setNewPayment({ type: newPayment.type, bankName: '', accountHolder: '', accountNumber: '', currency: 'ETB', cardBrand: 'Visa', cardHolder: '', cardNumber: '', expiry: '' });
    setShowAddPayment(false);
    addNotification('success', 'Payment method added — pending verification');
  };

  const handleRemovePayment = (id) => {
    setPaymentMethods(paymentMethods.filter(p => p.id !== id));
    addNotification('success', 'Payment method removed');
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(paymentMethods.map(p => ({ ...p, isDefault: p.id === id })));
    addNotification('success', 'Default payment method updated');
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="settings-section">
            <h2 className="section-title">Profile Settings</h2>

            {/* Account Tier Banner */}
            <div className="tier-banner" style={{ '--tier-color': tier.color, '--tier-glow': tier.glow }}>
              <div className="tier-left">
                <div className="tier-badge" style={{ background: `linear-gradient(135deg, ${tier.color}, ${tier.color}99)`, boxShadow: `0 0 20px ${tier.glow}` }}>
                  {tier.name === 'VIP' && '👑'}
                  {tier.name === 'Pro' && '⚡'}
                  {tier.name === 'Basic' && '🔰'}
                  {tier.name}
                </div>
                <div className="tier-info">
                  <div className="tier-label">Account Tier</div>
                  <div className="tier-perks">
                    {tier.name === 'VIP' && '0.05% fees · Unlimited withdrawals · Priority support'}
                    {tier.name === 'Pro' && '0.1% fees · $500k/day withdrawals · Live support'}
                    {tier.name === 'Basic' && '0.2% fees · $50k/day withdrawals · Email support'}
                  </div>
                </div>
              </div>
              {tier.next && (
                <div className="tier-progress-wrap">
                  <div className="tier-progress-label">
                    <span>${tradingVolume30d.toLocaleString()} / ${tier.nextVol.toLocaleString()}</span>
                    <span>→ {tier.next}</span>
                  </div>
                  <div className="tier-progress-bar">
                    <div className="tier-progress-fill" style={{ width: `${tierProgress}%`, background: `linear-gradient(90deg, ${tier.color}, #00ffe0)` }}></div>
                  </div>
                  <div className="tier-progress-sub">${(tier.nextVol - tradingVolume30d).toLocaleString()} more volume needed (30d)</div>
                </div>
              )}
            </div>

            {/* Avatar */}
            <div className="profile-avatar-section">
              <div className="avatar-preview">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Profile" />
                ) : (
                  <div className="avatar-placeholder">{(profile.fullName || profile.username || 'U').charAt(0).toUpperCase()}</div>
                )}
                <div className="tier-dot" style={{ background: tier.color, boxShadow: `0 0 8px ${tier.glow}` }}></div>
              </div>
              <div className="avatar-actions">
                <label className="btn-upload" style={{ cursor: 'pointer' }}>
                  Upload Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      if (file.size > 5 * 1024 * 1024) {
                        addNotification('error', 'Image must be under 5MB');
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        setProfile({ ...profile, avatar: ev.target.result });
                        addNotification('success', 'Profile photo updated');
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
                <button
                  className="btn-remove"
                  onClick={() => {
                    setProfile({ ...profile, avatar: '' });
                    addNotification('success', 'Profile photo removed');
                  }}
                  disabled={!profile.avatar}
                  style={{ opacity: profile.avatar ? 1 : 0.4, cursor: profile.avatar ? 'pointer' : 'not-allowed' }}
                >
                  Remove
                </button>
                <p className="avatar-hint">JPG, PNG or WEBP. Max 5MB</p>
              </div>
            </div>

            {/* Name fields */}
            <div className="form-row">
              <div className="form-group">
                <label>Full Name <span className="form-hint">Used for KYC verification</span></label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Username <span className="form-hint">Shown publicly in the app</span></label>
                <div className="input-prefix-wrap">
                  <span className="input-prefix">@</span>
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value.replace(/\s/g, '_').toLowerCase() })}
                    className="input-with-prefix"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              />
            </div>

            <CountryPhoneSelect
              country={profile.country}
              phone={profile.phone}
              onCountryChange={(val) => setProfile({ ...profile, country: val })}
              onPhoneChange={(val) => setProfile({ ...profile, phone: val })}
            />

            <button className="btn-primary" onClick={handleProfileUpdate}>Save Changes</button>

            {/* Referral Card */}
            <div className="referral-card">
              <div className="referral-header">
                <div className="referral-title">
                  <svg width="20" height="20" fill="#00ffe0" viewBox="0 0 24 24">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  Referral Program
                </div>
                <div className="referral-stats">
                  <div className="ref-stat">
                    <span className="ref-stat-val">{referralStats.invited}</span>
                    <span className="ref-stat-label">Invited</span>
                  </div>
                  <div className="ref-stat">
                    <span className="ref-stat-val" style={{ color: '#00ff88' }}>${referralStats.earned}</span>
                    <span className="ref-stat-label">Earned</span>
                  </div>
                </div>
              </div>
              <div className="referral-code-row">
                <div className="referral-code-box">
                  <span className="ref-code-label">Your Code</span>
                  <span className="ref-code">{referralCode}</span>
                </div>
                <button className={`btn-copy ${referralCopied ? 'copied' : ''}`} onClick={handleCopyReferral}>
                  {referralCopied ? (
                    <>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
                      Copy Link
                    </>
                  )}
                </button>
              </div>
              <div className="referral-link-preview">nexus.exchange/ref/{referralCode}</div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="settings-section">
            <h2 className="section-title">Security Settings</h2>

            <div className="security-card">
              <div className="security-header">
                <div>
                  <h3>Password</h3>
                  <p>Change your account password</p>
                </div>
                <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>Change Password</button>
              </div>
            </div>

            <div className="security-card">
              <div className="security-header">
                <div>
                  <h3>Two-Factor Authentication</h3>
                  <p>Add an extra layer of security</p>
                  <span className={`status-badge ${twoFAEnabled ? 'enabled' : 'disabled'}`}>
                    {twoFAEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <button className="btn-secondary" onClick={handleToggle2FA}>
                  {twoFAEnabled ? 'Disable' : 'Enable'} 2FA
                </button>
              </div>
              {twoFAEnabled && backupCodes.length > 0 && (
                <div className="backup-codes-info">
                  <p>✓ Backup codes generated. Keep them safe!</p>
                  <button className="btn-link" onClick={() => setShowBackupCodes(true)}>View Backup Codes</button>
                </div>
              )}
            </div>

            <div className="security-card">
              <div className="security-header">
                <div>
                  <h3>Anti-Phishing Code</h3>
                  <p>This code appears in all emails from NEXUS so you know they're real</p>
                </div>
                {!phishingEditing
                  ? <button className="btn-secondary" onClick={() => setPhishingEditing(true)}>Edit</button>
                  : <button className="btn-primary" onClick={handleSavePhishingCode}>Save</button>
                }
              </div>
              <div className="phishing-code-wrap">
                {phishingEditing ? (
                  <input
                    className="phishing-input"
                    value={phishingInput}
                    onChange={e => setPhishingInput(e.target.value.toUpperCase())}
                    maxLength={20}
                    placeholder="e.g. NEXUS-SAFE"
                  />
                ) : (
                  <div className="phishing-code-display">
                    <span className="phishing-shield">🛡️</span>
                    <code className="phishing-code">{phishingCode}</code>
                  </div>
                )}
              </div>
            </div>

            <div className="security-card">
              <div className="security-header">
                <div>
                  <h3>Withdrawal Address Whitelist</h3>
                  <p>Only allow withdrawals to pre-approved wallet addresses</p>
                  <span className={`status-badge ${whitelistEnabled ? 'enabled' : 'disabled'}`}>
                    {whitelistEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={whitelistEnabled} onChange={() => {
                    setWhitelistEnabled(!whitelistEnabled);
                    addNotification('info', `Whitelist ${!whitelistEnabled ? 'enabled' : 'disabled'}`);
                  }} />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="whitelist-list">
                {whitelist.map(w => (
                  <div key={w.id} className="whitelist-item">
                    <div className="whitelist-info">
                      <span className="whitelist-label">{w.label}</span>
                      <span className="whitelist-coin">{w.coin}</span>
                      <code className="whitelist-addr">{w.address}</code>
                      <span className="whitelist-date">Added {w.added}</span>
                    </div>
                    <button className="btn-danger-outline" onClick={() => handleRemoveWhitelist(w.id)}>Remove</button>
                  </div>
                ))}
              </div>
              {showAddWhitelist ? (
                <div className="whitelist-add-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Label</label>
                      <input type="text" placeholder="e.g. My Ledger" value={newWhitelist.label} onChange={e => setNewWhitelist({...newWhitelist, label: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Coin</label>
                      <select value={newWhitelist.coin} onChange={e => setNewWhitelist({...newWhitelist, coin: e.target.value})}>
                        <option>BTC</option><option>ETH</option><option>USDT</option><option>BNB</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Wallet Address</label>
                    <input type="text" placeholder="0x..." value={newWhitelist.address} onChange={e => setNewWhitelist({...newWhitelist, address: e.target.value})} />
                  </div>
                  <div className="form-row-btns">
                    <button className="btn-primary" onClick={handleAddWhitelist}>Add Address</button>
                    <button className="btn-secondary" onClick={() => setShowAddWhitelist(false)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button className="btn-secondary" onClick={() => setShowAddWhitelist(true)}>+ Add Address</button>
              )}
            </div>

            <div className="security-card">
              <div className="security-header">
                <div>
                  <h3>Active Sessions</h3>
                  <p>Manage devices with access to your account</p>
                </div>
                <button className="btn-secondary" onClick={() => setShowActivityModal(true)}>View Activity Log</button>
              </div>
              <div className="login-activity-list">
                {loginActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-info">
                      <div className="activity-device">
                        {activity.device}
                        {activity.current && <span className="current-badge">Current</span>}
                        {activity.trusted && <span className="trusted-badge">Trusted</span>}
                      </div>
                      <div className="activity-details">
                        {activity.date} at {activity.time} • IP: {activity.ip} • {activity.location}
                      </div>
                    </div>
                    <div className="activity-actions">
                      {!activity.current && (
                        <>
                          <button 
                            className="btn-trust" 
                            onClick={() => handleTrustDevice(activity.id)}
                            title={activity.trusted ? 'Remove trust' : 'Trust this device'}
                          >
                            {activity.trusted ? '🔓' : '🔒'}
                          </button>
                          <button className="btn-logout" onClick={() => handleLogoutDevice(activity.device)}>Logout</button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn-danger-outline" onClick={handleLogoutAll}>Logout from All Other Devices</button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h2 className="section-title">Notification Preferences</h2>

            <div className="notification-card">
              <h3>Notification Channels</h3>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Email Alerts</div>
                    <div className="toggle-desc">Receive notifications via email</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.emailAlerts}
                      onChange={() => handleNotificationToggle('emailAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">SMS Alerts</div>
                    <div className="toggle-desc">Receive notifications via SMS</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.smsAlerts}
                      onChange={() => handleNotificationToggle('smsAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Push Notifications</div>
                    <div className="toggle-desc">Receive browser push notifications</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.pushAlerts}
                      onChange={() => handleNotificationToggle('pushAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="notification-card">
              <h3>Alert Types</h3>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Deposit Alerts</div>
                    <div className="toggle-desc">When funds arrive in your account</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.depositAlerts}
                      onChange={() => handleNotificationToggle('depositAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Withdrawal Alerts</div>
                    <div className="toggle-desc">When funds are sent from your account</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.withdrawalAlerts}
                      onChange={() => handleNotificationToggle('withdrawalAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Security Alerts</div>
                    <div className="toggle-desc">Login attempts and password changes</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.securityAlerts}
                      onChange={() => handleNotificationToggle('securityAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Price Alerts</div>
                    <div className="toggle-desc">Crypto price triggers</div>
                  </div>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={notifications.priceAlerts}
                      onChange={() => handleNotificationToggle('priceAlerts')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="settings-section">
            <h2 className="section-title">Application Preferences</h2>

            <div className="preference-card">
              <h3>Theme Settings</h3>
              <div className="theme-options">
                <div 
                  className={`theme-option ${preferences.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <div className="theme-preview light"></div>
                  <span>Light Mode</span>
                </div>
                <div 
                  className={`theme-option ${preferences.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <div className="theme-preview dark"></div>
                  <span>Dark Mode</span>
                </div>
                <div 
                  className={`theme-option ${preferences.theme === 'system' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('system')}
                >
                  <div className="theme-preview system"></div>
                  <span>System Default</span>
                </div>
              </div>
            </div>

            <div className="preference-card">
              <h3>Language Settings</h3>
              <div className="form-group">
                <select 
                  value={preferences.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="ar">Arabic</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
            <div className="preference-card">
              <h3>Privacy</h3>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Hide Portfolio Balance</div>
                    <div className="toggle-desc">Shows **** instead of real amounts everywhere</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={privacy.hideBalance} onChange={() => setPrivacy({...privacy, hideBalance: !privacy.hideBalance})} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Profile Visibility</div>
                    <div className="toggle-desc">Who can see your profile on NEXUS</div>
                  </div>
                  <select className="inline-select" value={privacy.profileVisibility} onChange={e => setPrivacy({...privacy, profileVisibility: e.target.value})}>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="preference-card">
              <h3>Fee Schedule</h3>
              <div className="fee-table">
                <div className="fee-row fee-header">
                  <span>Tier</span><span>Maker</span><span>Taker</span><span>Withdrawal Limit</span>
                </div>
                {[
                  { name: 'Basic', color: '#94a3b8', maker: '0.20%', taker: '0.20%', limit: '$50,000/day' },
                  { name: 'Pro', color: '#3a6ff7', maker: '0.10%', taker: '0.10%', limit: '$500,000/day' },
                  { name: 'VIP', color: '#f59e0b', maker: '0.05%', taker: '0.05%', limit: 'Unlimited' }
                ].map(t => (
                  <div key={t.name} className={`fee-row ${tier.name === t.name ? 'fee-current' : ''}`}>
                    <span style={{ color: t.color, fontWeight: 600 }}>{t.name} {tier.name === t.name && '← You'}</span>
                    <span>{t.maker}</span>
                    <span>{t.taker}</span>
                    <span>{t.limit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'verification': {
        const levelConfig = [
          {
            key: 'level1',
            num: 1,
            title: 'Email Verification',
            desc: 'Verify your email address',
            limits: 'Spot trading · $2,000/day withdrawal',
            icon: '✉️'
          },
          {
            key: 'level2',
            num: 2,
            title: 'Identity Verification',
            desc: 'Government-issued ID + selfie',
            limits: 'Fiat deposits · $50,000/day withdrawal',
            icon: '🪪'
          },
          {
            key: 'level3',
            num: 3,
            title: 'Address Verification',
            desc: 'Proof of residential address',
            limits: 'Unlimited withdrawals · OTC trading · VIP tier',
            icon: '🏠'
          }
        ];

        const statusColor = (s) => ({
          verified: '#00ff88',
          pending: '#f59e0b',
          rejected: '#ef4444',
          'not-started': '#94a3b8'
        }[s] || '#94a3b8');

        const statusLabel = (s) => ({
          verified: '✓ Verified',
          pending: '⏳ Under Review',
          rejected: '✗ Rejected',
          'not-started': 'Not Started'
        }[s] || s);

        const handleFileSelect = (field, e) => {
          const file = e.target.files[0];
          if (!file) return;
          setKycForm(f => ({ ...f, [field]: file, [`${field}Name`]: file.name }));
        };

        const handleSubmitLevel = (levelKey) => {
          setKycLevels(prev => ({
            ...prev,
            [levelKey]: { status: 'pending', submittedAt: new Date().toISOString().split('T')[0] }
          }));
          setKycStep(null);
          addNotification('success', 'Documents submitted for review');
        };

        return (
          <div className="settings-section">
            <h2 className="section-title">Identity Verification (KYC)</h2>
            <p className="section-subtitle">Complete verification levels to unlock higher limits and features</p>

            {/* Limits table */}
            <div className="kyc-limits-table">
              <div className="kyc-limits-header">
                <span>Level</span><span>Daily Withdrawal</span><span>Fiat</span><span>Features</span>
              </div>
              <div className="kyc-limits-row">
                <span className="kyc-lv-badge lv1">Level 1</span>
                <span>$2,000</span><span>—</span><span>Spot trading</span>
              </div>
              <div className="kyc-limits-row">
                <span className="kyc-lv-badge lv2">Level 2</span>
                <span>$50,000</span><span>✓</span><span>Fiat deposits &amp; withdrawals</span>
              </div>
              <div className="kyc-limits-row">
                <span className="kyc-lv-badge lv3">Level 3</span>
                <span>Unlimited</span><span>✓</span><span>OTC · VIP tier · Priority support</span>
              </div>
            </div>

            {/* Level cards */}
            <div className="kyc-levels">
              {levelConfig.map((lv) => {
                const lvData = kycLevels[lv.key];
                const isActive = kycStep === lv.key;
                const canStart = lv.key === 'level1' ? false
                  : lv.key === 'level2' ? kycLevels.level1.status === 'verified'
                  : kycLevels.level2.status === 'verified';

                return (
                  <div key={lv.key} className={`kyc-level-card ${lvData.status}`}>
                    <div className="kyc-level-header">
                      <div className="kyc-level-left">
                        <div className="kyc-level-icon">{lv.icon}</div>
                        <div>
                          <div className="kyc-level-title">Level {lv.num} — {lv.title}</div>
                          <div className="kyc-level-desc">{lv.desc}</div>
                          <div className="kyc-level-limits">{lv.limits}</div>
                        </div>
                      </div>
                      <div className="kyc-level-right">
                        <span className="kyc-status-badge" style={{ color: statusColor(lvData.status), borderColor: statusColor(lvData.status) }}>
                          {statusLabel(lvData.status)}
                        </span>
                        {lvData.submittedAt && (
                          <div className="kyc-submitted-date">Submitted {lvData.submittedAt}</div>
                        )}
                        {lvData.status === 'not-started' && canStart && (
                          <button className="btn-primary kyc-start-btn" onClick={() => setKycStep(lv.key)}>
                            Start →
                          </button>
                        )}
                        {lvData.status === 'rejected' && (
                          <button className="btn-secondary kyc-start-btn" onClick={() => setKycStep(lv.key)}>
                            Resubmit
                          </button>
                        )}
                        {!canStart && lvData.status === 'not-started' && (
                          <span className="kyc-locked">🔒 Complete Level {lv.num - 1} first</span>
                        )}
                      </div>
                    </div>

                    {/* Inline form for level 2 */}
                    {isActive && lv.key === 'level2' && (
                      <div className="kyc-form">
                        <div className="kyc-form-title">Step 1 — Select ID Type</div>
                        <div className="kyc-doc-types">
                          {['passport', 'national_id', 'drivers_license'].map(dt => (
                            <button
                              key={dt}
                              className={`kyc-doc-type-btn ${kycForm.docType === dt ? 'active' : ''}`}
                              onClick={() => setKycForm(f => ({ ...f, docType: dt }))}
                            >
                              {dt === 'passport' ? '🛂 Passport' : dt === 'national_id' ? '🪪 National ID' : '🚗 Driver\'s License'}
                            </button>
                          ))}
                        </div>

                        <div className="kyc-form-title" style={{ marginTop: 20 }}>Step 2 — Upload Document</div>
                        <div className="kyc-upload-row">
                          <label className="kyc-upload-zone">
                            <input type="file" accept="image/*,.pdf" onChange={e => handleFileSelect('docFront', e)} hidden />
                            <div className="kyc-upload-inner">
                              {kycForm.docFrontName ? (
                                <><span className="kyc-upload-check">✓</span><span>{kycForm.docFrontName}</span></>
                              ) : (
                                <><span className="kyc-upload-icon">📄</span><span>Front Side</span><span className="kyc-upload-hint">Click to upload</span></>
                              )}
                            </div>
                          </label>
                          {kycForm.docType !== 'passport' && (
                            <label className="kyc-upload-zone">
                              <input type="file" accept="image/*,.pdf" onChange={e => handleFileSelect('docBack', e)} hidden />
                              <div className="kyc-upload-inner">
                                {kycForm.docBackName ? (
                                  <><span className="kyc-upload-check">✓</span><span>{kycForm.docBackName}</span></>
                                ) : (
                                  <><span className="kyc-upload-icon">📄</span><span>Back Side</span><span className="kyc-upload-hint">Click to upload</span></>
                                )}
                              </div>
                            </label>
                          )}
                        </div>

                        <div className="kyc-form-title" style={{ marginTop: 20 }}>Step 3 — Selfie with ID</div>
                        <label className="kyc-upload-zone kyc-selfie-zone">
                          <input type="file" accept="image/*" onChange={e => handleFileSelect('selfie', e)} hidden />
                          <div className="kyc-upload-inner">
                            {kycForm.selfieName ? (
                              <><span className="kyc-upload-check">✓</span><span>{kycForm.selfieName}</span></>
                            ) : (
                              <>
                                <span className="kyc-upload-icon">🤳</span>
                                <span>Selfie holding your ID</span>
                                <span className="kyc-upload-hint">Face + ID must be clearly visible</span>
                              </>
                            )}
                          </div>
                        </label>

                        <div className="kyc-form-actions">
                          <button
                            className="btn-primary"
                            onClick={() => handleSubmitLevel('level2')}
                            disabled={!kycForm.docFrontName || !kycForm.selfieName}
                          >
                            Submit for Review
                          </button>
                          <button className="btn-secondary" onClick={() => setKycStep(null)}>Cancel</button>
                        </div>
                      </div>
                    )}

                    {/* Inline form for level 3 */}
                    {isActive && lv.key === 'level3' && (
                      <div className="kyc-form">
                        <div className="kyc-form-title">Upload Proof of Address</div>
                        <p className="kyc-form-hint">Accepted: Bank statement, utility bill, or government letter — issued within last 3 months</p>
                        <label className="kyc-upload-zone kyc-selfie-zone">
                          <input type="file" accept="image/*,.pdf" onChange={e => handleFileSelect('addressDoc', e)} hidden />
                          <div className="kyc-upload-inner">
                            {kycForm.addressDocName ? (
                              <><span className="kyc-upload-check">✓</span><span>{kycForm.addressDocName}</span></>
                            ) : (
                              <>
                                <span className="kyc-upload-icon">🏠</span>
                                <span>Address Document</span>
                                <span className="kyc-upload-hint">PDF or image, max 10MB</span>
                              </>
                            )}
                          </div>
                        </label>
                        <div className="kyc-form-actions">
                          <button
                            className="btn-primary"
                            onClick={() => handleSubmitLevel('level3')}
                            disabled={!kycForm.addressDocName}
                          >
                            Submit for Review
                          </button>
                          <button className="btn-secondary" onClick={() => setKycStep(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      case 'payment':
        const bankMethods = paymentMethods.filter(p => p.type === 'bank');
        const cardMethods = paymentMethods.filter(p => p.type === 'card');
        const maskAccount = (num) => '•••• •••• ' + num.slice(-4);
        const maskCard = (num) => '•••• •••• •••• ' + num.slice(-4);
        const cardIcon = (brand) => ({ Visa: '💳', Mastercard: '🔴', Amex: '🟦' }[brand] || '💳');

        return (
          <div className="settings-section">
            <h2 className="section-title">Payment Methods</h2>
            <p className="section-subtitle">Saved bank accounts and cards used for fiat deposits and withdrawals</p>

            {/* Tabs */}
            <div className="pm-tabs">
              <button className={`pm-tab ${paymentTab === 'bank' ? 'active' : ''}`} onClick={() => { setPaymentTab('bank'); setShowAddPayment(false); }}>
                🏦 Bank Accounts <span className="pm-tab-count">{bankMethods.length}</span>
              </button>
              <button className={`pm-tab ${paymentTab === 'card' ? 'active' : ''}`} onClick={() => { setPaymentTab('card'); setShowAddPayment(false); }}>
                💳 Cards <span className="pm-tab-count">{cardMethods.length}</span>
              </button>
            </div>

            {/* Bank accounts list */}
            {paymentTab === 'bank' && (
              <div className="pm-list">
                {bankMethods.length === 0 && !showAddPayment && (
                  <div className="pm-empty">No bank accounts saved yet</div>
                )}
                {bankMethods.map(pm => (
                  <div key={pm.id} className={`pm-card ${pm.isDefault ? 'pm-default' : ''}`}>
                    <div className="pm-card-left">
                      <div className="pm-icon">🏦</div>
                      <div className="pm-details">
                        <div className="pm-name">{pm.bankName}</div>
                        <div className="pm-holder">{pm.accountHolder}</div>
                        <div className="pm-number">{maskAccount(pm.accountNumber)}</div>
                        <div className="pm-meta">
                          <span className="pm-currency">{pm.currency}</span>
                          <span className="pm-date">Added {pm.addedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pm-card-right">
                      <div className="pm-badges">
                        {pm.verified
                          ? <span className="pm-badge verified">✓ Verified</span>
                          : <span className="pm-badge pending">⏳ Pending</span>
                        }
                        {pm.isDefault && <span className="pm-badge default-badge">★ Default</span>}
                      </div>
                      <div className="pm-actions">
                        {!pm.isDefault && (
                          <button className="btn-secondary pm-btn" onClick={() => handleSetDefault(pm.id)}>Set Default</button>
                        )}
                        <button className="btn-danger-outline pm-btn" onClick={() => handleRemovePayment(pm.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add bank form */}
                {showAddPayment && newPayment.type === 'bank' && (
                  <div className="pm-add-form">
                    <h3>Add Bank Account</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Bank Name</label>
                        <input type="text" placeholder="e.g. Commercial Bank of Ethiopia" value={newPayment.bankName} onChange={e => setNewPayment({...newPayment, bankName: e.target.value})} />
                      </div>
                      <div className="form-group">
                        <label>Currency</label>
                        <select value={newPayment.currency} onChange={e => setNewPayment({...newPayment, currency: e.target.value})}>
                          <option>ETB</option><option>USD</option><option>EUR</option><option>GBP</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Account Holder Name</label>
                      <input type="text" placeholder="Full name as on bank account" value={newPayment.accountHolder} onChange={e => setNewPayment({...newPayment, accountHolder: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label>Account Number</label>
                      <input type="text" placeholder="Enter account number" value={newPayment.accountNumber} onChange={e => setNewPayment({...newPayment, accountNumber: e.target.value.replace(/\D/g,'')})} />
                    </div>
                    <div className="pm-form-note">
                      ℹ️ We'll send a small test deposit to verify your account. This may take 1–2 business days.
                    </div>
                    <div className="form-row-btns">
                      <button className="btn-primary" onClick={handleAddPayment}>Add Bank Account</button>
                      <button className="btn-secondary" onClick={() => setShowAddPayment(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {!showAddPayment && (
                  <button className="btn-primary pm-add-btn" onClick={() => { setShowAddPayment(true); setNewPayment({...newPayment, type: 'bank'}); }}>
                    + Add Bank Account
                  </button>
                )}
              </div>
            )}

            {/* Cards list */}
            {paymentTab === 'card' && (
              <div className="pm-list">
                {cardMethods.length === 0 && !showAddPayment && (
                  <div className="pm-empty">No cards saved yet</div>
                )}
                {cardMethods.map(pm => (
                  <div key={pm.id} className={`pm-card ${pm.isDefault ? 'pm-default' : ''}`}>
                    <div className="pm-card-left">
                      <div className="pm-icon">{cardIcon(pm.cardBrand)}</div>
                      <div className="pm-details">
                        <div className="pm-name">{pm.cardBrand}</div>
                        <div className="pm-holder">{pm.cardHolder}</div>
                        <div className="pm-number">{maskCard(pm.cardNumber)}</div>
                        <div className="pm-meta">
                          <span className="pm-currency">Expires {pm.expiry}</span>
                          <span className="pm-date">Added {pm.addedDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pm-card-right">
                      <div className="pm-badges">
                        {pm.verified
                          ? <span className="pm-badge verified">✓ Verified</span>
                          : <span className="pm-badge pending">⏳ Pending</span>
                        }
                        {pm.isDefault && <span className="pm-badge default-badge">★ Default</span>}
                      </div>
                      <div className="pm-actions">
                        {!pm.isDefault && (
                          <button className="btn-secondary pm-btn" onClick={() => handleSetDefault(pm.id)}>Set Default</button>
                        )}
                        <button className="btn-danger-outline pm-btn" onClick={() => handleRemovePayment(pm.id)}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add card form */}
                {showAddPayment && newPayment.type === 'card' && (
                  <div className="pm-add-form">
                    <h3>Add Card</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Card Brand</label>
                        <select value={newPayment.cardBrand} onChange={e => setNewPayment({...newPayment, cardBrand: e.target.value})}>
                          <option>Visa</option><option>Mastercard</option><option>Amex</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" maxLength={5} value={newPayment.expiry} onChange={e => setNewPayment({...newPayment, expiry: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Name on Card</label>
                      <input type="text" placeholder="As printed on card" value={newPayment.cardHolder} onChange={e => setNewPayment({...newPayment, cardHolder: e.target.value.toUpperCase()})} />
                    </div>
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" placeholder="1234 5678 9012 3456" maxLength={19} value={newPayment.cardNumber} onChange={e => setNewPayment({...newPayment, cardNumber: e.target.value.replace(/\D/g,'')})} />
                    </div>
                    <div className="pm-form-note">
                      🔒 Card details are encrypted and stored securely. Only the last 4 digits are shown.
                    </div>
                    <div className="form-row-btns">
                      <button className="btn-primary" onClick={handleAddPayment}>Add Card</button>
                      <button className="btn-secondary" onClick={() => setShowAddPayment(false)}>Cancel</button>
                    </div>
                  </div>
                )}

                {!showAddPayment && (
                  <button className="btn-primary pm-add-btn" onClick={() => { setShowAddPayment(true); setNewPayment({...newPayment, type: 'card'}); }}>
                    + Add Card
                  </button>
                )}
              </div>
            )}
          </div>
        );

      case 'trading':
        return (
          <div className="settings-section">
            <h2 className="section-title">Trading Preferences</h2>
            <div className="preference-card">
              <h3>Default Settings</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Default Trading Pair</label>
                  <select value={tradingPrefs.defaultPair} onChange={e => setTradingPrefs({...tradingPrefs, defaultPair: e.target.value})}>
                    <option>BTC/USDT</option><option>ETH/USDT</option><option>BNB/USDT</option><option>SOL/USDT</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Default Order Type</label>
                  <select value={tradingPrefs.defaultOrderType} onChange={e => setTradingPrefs({...tradingPrefs, defaultOrderType: e.target.value})}>
                    <option value="limit">Limit</option>
                    <option value="market">Market</option>
                    <option value="stop">Stop-Limit</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Default Leverage</label>
                  <select value={tradingPrefs.defaultLeverage} onChange={e => setTradingPrefs({...tradingPrefs, defaultLeverage: e.target.value})}>
                    {['1x','2x','5x','10x','20x','50x','100x'].map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="preference-card">
              <h3>Order Behavior</h3>
              <div className="toggle-list">
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Confirm Before Submit</div>
                    <div className="toggle-desc">Show confirmation dialog before placing orders</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={tradingPrefs.confirmOrder} onChange={() => setTradingPrefs({...tradingPrefs, confirmOrder: !tradingPrefs.confirmOrder})} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="toggle-item">
                  <div>
                    <div className="toggle-label">Show PnL as Percentage</div>
                    <div className="toggle-desc">Display profit/loss as % instead of absolute value</div>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" checked={tradingPrefs.showPnlPercent} onChange={() => setTradingPrefs({...tradingPrefs, showPnlPercent: !tradingPrefs.showPnlPercent})} />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
            <button className="btn-primary" onClick={() => addNotification('success', 'Trading preferences saved')}>Save Preferences</button>
          </div>
        );

      case 'api':
        return (
          <div className="settings-section">
            <h2 className="section-title">API Keys</h2>

            <div className="api-info">
              <p>API keys allow you to connect trading bots and third-party applications to your account.</p>
              <button className="btn-primary" onClick={handleCreateAPIKey}>Create New API Key</button>
            </div>

            <div className="api-keys-list">
              {apiKeys.map(key => (
                <div key={key.id} className="api-key-card">
                  <div className="api-key-header">
                    <div>
                      <h4>{key.name}</h4>
                      <code className="api-key-value">{key.key}</code>
                    </div>
                    <span className={`status-badge ${key.active ? 'enabled' : 'disabled'}`}>
                      {key.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="api-key-details">
                    <div className="api-key-info">
                      <span>Created: {key.created}</span>
                      <span>Permissions: {key.permissions.join(', ')}</span>
                    </div>
                    <button className="btn-danger-outline" onClick={() => handleRevokeAPIKey(key.id)}>Revoke</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="main-content">
      <div className="settings-page">
        <div className="settings-sidebar">
          <h2>Settings</h2>
          <nav className="settings-nav">
            <button 
              className={activeSection === 'profile' ? 'active' : ''}
              onClick={() => setActiveSection('profile')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
              Profile
            </button>
            <button 
              className={activeSection === 'security' ? 'active' : ''}
              onClick={() => setActiveSection('security')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
              </svg>
              Security
            </button>
            <button 
              className={activeSection === 'notifications' ? 'active' : ''}
              onClick={() => setActiveSection('notifications')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              Notifications
            </button>
            <button 
              className={activeSection === 'preferences' ? 'active' : ''}
              onClick={() => setActiveSection('preferences')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94L14.4 2.81c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
              </svg>
              Preferences
            </button>
            <button 
              className={activeSection === 'payment' ? 'active' : ''}
              onClick={() => setActiveSection('payment')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              Payment Methods
            </button>
            <button 
              className={activeSection === 'trading' ? 'active' : ''}
              onClick={() => setActiveSection('trading')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>
              </svg>
              Trading Prefs
            </button>
            <button 
              className={activeSection === 'verification' ? 'active' : ''}
              onClick={() => setActiveSection('verification')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              Verification
            </button>
            <button 
              className={activeSection === 'api' ? 'active' : ''}
              onClick={() => setActiveSection('api')}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
              </svg>
              API Keys
            </button>
          </nav>
        </div>

        <div className="settings-content">
          {renderSection()}
        </div>

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Change Password</h3>
                <button className="modal-close" onClick={() => setShowPasswordModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Current Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.new}
                    onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                  />
                  <small>Minimum 8 characters, 1 number, 1 uppercase, 1 special character</small>
                </div>
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordForm.confirm}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                  />
                </div>
                <button className="btn-primary" onClick={handlePasswordChange}>Change Password</button>
              </div>
            </div>
          </div>
        )}

        {/* 2FA Setup Modal */}
        {show2FAModal && (
          <div className="modal-overlay" onClick={() => setShow2FAModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Enable Two-Factor Authentication</h3>
                <button className="modal-close" onClick={() => setShow2FAModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="twofa-setup">
                  <p>Scan this QR code with Google Authenticator or Authy</p>
                  <div className="qr-code-placeholder">
                    <div className="qr-box">QR CODE</div>
                  </div>
                  <div className="form-group">
                    <label>Enter 6-digit code</label>
                    <input type="text" maxLength="6" placeholder="000000" />
                  </div>
                  <button className="btn-primary" onClick={handleEnable2FA}>Enable 2FA</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Key Creation Modal */}
        {showAPIModal && (
          <div className="modal-overlay" onClick={() => setShowAPIModal(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create API Key</h3>
                <button className="modal-close" onClick={() => setShowAPIModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>API Key Name</label>
                  <input type="text" placeholder="e.g., Trading Bot" />
                </div>
                <div className="form-group">
                  <label>Permissions</label>
                  <div className="checkbox-group">
                    <label><input type="checkbox" /> Read Data</label>
                    <label><input type="checkbox" /> Trade Orders</label>
                    <label><input type="checkbox" /> Withdraw Funds</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>IP Whitelist (Optional)</label>
                  <input type="text" placeholder="192.168.1.1" />
                </div>
                <button className="btn-primary" onClick={() => {
                  addNotification('success', 'API key created successfully');
                  setShowAPIModal(false);
                }}>Create API Key</button>
              </div>
            </div>
          </div>
        )}

        {/* Backup Codes Modal */}
        {showBackupCodes && backupCodes.length > 0 && (
          <div className="modal-overlay" onClick={() => setShowBackupCodes(false)}>
            <div className="modal-box backup-codes-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>2FA Backup Codes</h3>
                <button className="modal-close" onClick={() => setShowBackupCodes(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="backup-codes-warning">
                  <svg width="24" height="24" fill="#f59e0b" viewBox="0 0 24 24">
                    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                  </svg>
                  <p>Save these codes in a safe place. Each code can only be used once to access your account if you lose your 2FA device.</p>
                </div>
                <div className="backup-codes-grid">
                  {backupCodes.map((code, index) => (
                    <div key={index} className="backup-code-item">
                      <span className="code-number">{index + 1}.</span>
                      <code className="backup-code">{code}</code>
                    </div>
                  ))}
                </div>
                <div className="backup-codes-actions">
                  <button className="btn-secondary" onClick={handleDownloadBackupCodes}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                    </svg>
                    Download Codes
                  </button>
                  <button className="btn-primary" onClick={() => {
                    navigator.clipboard.writeText(backupCodes.join('\n'));
                    addNotification('success', 'Codes copied to clipboard');
                  }}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                    </svg>
                    Copy All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Activity Log Modal */}
        {showActivityModal && (
          <div className="modal-overlay" onClick={() => setShowActivityModal(false)}>
            <div className="modal-box activity-log-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Account Activity Log</h3>
                <button className="modal-close" onClick={() => setShowActivityModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="activity-filters">
                  <button 
                    className={activityFilter === 'all' ? 'active' : ''}
                    onClick={() => setActivityFilter('all')}
                  >All</button>
                  <button 
                    className={activityFilter === 'login' ? 'active' : ''}
                    onClick={() => setActivityFilter('login')}
                  >Login</button>
                  <button 
                    className={activityFilter === 'trade' ? 'active' : ''}
                    onClick={() => setActivityFilter('trade')}
                  >Trade</button>
                  <button 
                    className={activityFilter === 'deposit' ? 'active' : ''}
                    onClick={() => setActivityFilter('deposit')}
                  >Deposit</button>
                  <button 
                    className={activityFilter === 'withdrawal' ? 'active' : ''}
                    onClick={() => setActivityFilter('withdrawal')}
                  >Withdrawal</button>
                  <button 
                    className={activityFilter === 'security' ? 'active' : ''}
                    onClick={() => setActivityFilter('security')}
                  >Security</button>
                </div>
                <div className="activity-timeline">
                  {filteredActivityLog.map((log) => (
                    <div key={log.id} className="timeline-item">
                      <div 
                        className="timeline-icon" 
                        style={{ background: getActivityColor(log.type, log.status) }}
                      >
                        {getActivityIcon(log.type)}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span className="timeline-type">{log.type.toUpperCase()}</span>
                          <span className={`timeline-status ${log.status}`}>{log.status}</span>
                        </div>
                        <div className="timeline-description">{log.description}</div>
                        <div className="timeline-meta">
                          {log.date} at {log.time} • IP: {log.ip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="btn-secondary" onClick={() => {
                  const csv = 'Date,Time,Type,Description,Status,IP\n' + 
                    activityLog.map(log => `${log.date},${log.time},${log.type},${log.description},${log.status},${log.ip}`).join('\n');
                  const blob = new Blob([csv], { type: 'text/csv' });
                  const url = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'activity-log.csv';
                  link.click();
                  addNotification('success', 'Activity log exported');
                }}>
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
                  </svg>
                  Export Activity Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Settings;
