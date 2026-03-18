import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import Topbar from './components/layout/Topbar';
import Sidebar from './components/layout/Sidebar';
import RightPanel from './components/layout/RightPanel';
import Dashboard from './pages/Dashboard';
import Markets from './pages/Markets';
import Trade from './pages/Trade';
import History from './pages/History';
import Assets from './pages/Assets';
import Staking from './pages/Staking';
import NFTs from './pages/NFTs';
import Deposit from './pages/Deposit';
import Wallet from './pages/Wallet';
import BuyCrypto from './pages/BuyCrypto';
import Intro from './pages/Intro';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Withdraw from './pages/Withdraw';
import './App.css';
import './styles/themes.css';
import './styles/light-theme-overrides.css';
import './styles/components/sidebar-collapsible.css';

// Pages that manage their own full-width layout — hide the RightPanel on these
const FULL_WIDTH_ROUTES = ['/', '/markets', '/trade', '/settings', '/wallet', '/history', '/assets', '/staking', '/nfts', '/deposit', '/withdraw', '/buy'];

function LayoutWrapper() {
  const location = useLocation();
  const showRightPanel = false;
  const hideRightPanel = true;

  return (
    <div className="layout">
      <Topbar />
      <Sidebar />
      <div className="main-content" style={{ gridColumn: hideRightPanel ? '1 / -1' : '1', gridRow: 2, minWidth: 0, overflowY: 'auto', height: 'calc(100vh - clamp(48px, 4.2vw, 60px))', display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/history" element={<History />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/deposit" element={<Deposit />} />
          <Route path="/withdraw" element={<Withdraw />} />
          <Route path="/buy" element={<BuyCrypto />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
      {!hideRightPanel && <RightPanel />}
    </div>
  );
}

function AppContent() {
  useKeyboardShortcuts();

  return (
    <Routes>
      <Route path="/intro" element={<Intro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/*" element={<LayoutWrapper />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <UserProvider>
            <Router>
              <AppContent />
            </Router>
          </UserProvider>
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
