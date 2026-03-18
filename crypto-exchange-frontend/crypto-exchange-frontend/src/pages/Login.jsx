import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useLanguage } from "../context/LanguageContext";
import "../styles/components/auth.css";
import PasswordStrength from "../components/common/PasswordStrength";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();
  const { loginUser } = useUser();
  const { t } = useLanguage();

  const validateEmail = (email) => {
    // RFC 5322 compliant email regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const verifyEmailExists = async (email) => {
    try {
      // Check if API key is configured
      const apiKey = "YOUR_API_KEY"; // Replace with actual key or use environment variable
      
      // If no API key is set, skip verification and allow the email
      if (apiKey === "YOUR_API_KEY" || !apiKey) {
        console.log("Email verification skipped - no API key configured");
        return true; // Allow email to pass
      }

      // Using Abstract API for email verification
      const response = await fetch(
        `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${encodeURIComponent(email)}`
      );
      
      if (!response.ok) {
        console.log("Email verification API error, allowing email");
        return true; // If API fails, allow the email
      }

      const data = await response.json();
      
      // Check if email is deliverable
      return data.deliverability === "DELIVERABLE" && data.is_valid_format.value && !data.is_disposable_email.value;
    } catch (error) {
      console.error('Email verification error:', error);
      // If API fails, allow the email to pass
      return true;
    }
  };

  const isValidEmailProvider = (email) => {
    // List of legitimate email providers
    const validProviders = [
      // Popular email providers
      'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
      'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.in',
      'icloud.com', 'me.com', 'mac.com',
      'aol.com', 'protonmail.com', 'proton.me',
      'zoho.com', 'yandex.com', 'mail.com',
      // Business/Corporate domains
      'microsoft.com', 'apple.com', 'amazon.com',
      // Educational domains
      '.edu', '.ac.uk', '.edu.au',
      // Common country domains
      '.com', '.net', '.org', '.co', '.io', '.tech'
    ];

    // Blocked temporary/disposable email providers
    const blockedProviders = [
      'tempmail.com', 'guerrillamail.com', '10minutemail.com',
      'throwaway.email', 'mailinator.com', 'maildrop.cc',
      'temp-mail.org', 'fakeinbox.com', 'trashmail.com',
      'getnada.com', 'emailondeck.com', 'yopmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    
    if (!domain) return false;

    // Check if it's a blocked provider
    if (blockedProviders.some(blocked => domain.includes(blocked))) {
      return false;
    }

    // Check if it matches valid providers
    return validProviders.some(provider => {
      if (provider.startsWith('.')) {
        return domain.endsWith(provider);
      }
      return domain === provider || domain.endsWith('.' + provider);
    });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    
    // Real-time validation
    if (value) {
      if (!validateEmail(value)) {
        setEmailError("Please enter a valid email address");
      } else if (!isValidEmailProvider(value)) {
        setEmailError("Please use a valid email provider (Gmail, Outlook, Yahoo, etc.)");
      } else {
        setEmailError("");
      }
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Check for valid email provider
    if (!isValidEmailProvider(email)) {
      setError("Please use a valid email provider (Gmail, Outlook, Yahoo, etc.). Temporary emails are not allowed.");
      setLoading(false);
      return;
    }

    // Verify if email actually exists (optional - only if API key is configured)
    const emailExists = await verifyEmailExists(email);
    if (!emailExists) {
      setError("This email address does not exist or is not deliverable. Please check and try again.");
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Store auth token (in real app, this would come from backend)
      localStorage.setItem("authToken", "demo-token-" + Date.now());
      localStorage.setItem("userEmail", email);
      loginUser(email);
      
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      setLoading(false);
      // Redirect to home page
      navigate("/");
    }, 1000);
  };

  return (
    <div className="auth-page">
      <a href="/intro" className="auth-back-btn" aria-label="Back to home">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5"/>
          <path d="M12 19l-7-7 7-7"/>
        </svg>
        <span>Back</span>
      </a>
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-branding">
          <div className="auth-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">NEXUS</span>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">
            Trade crypto and forex with confidence on the most secure platform
          </p>
          <div className="auth-features">
            <div className="auth-feature">
              <span className="feature-icon">🔒</span>
              <span>Bank-level security</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">⚡</span>
              <span>Lightning-fast trades</span>
            </div>
            <div className="auth-feature">
              <span className="feature-icon">🌍</span>
              <span>Global markets access</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <h2 className="form-title">{t('signIn')}</h2>
            <p className="form-subtitle">Enter your credentials to access your account</p>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">{t('emailAddress')}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder={t('emailAddress')}
                  className={`form-input ${emailError ? 'input-error' : ''}`}
                  autoComplete="email"
                />
                {emailError && <small className="form-error">{emailError}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <div className="input-password-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('password')}
                    className="form-input"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
                <PasswordStrength password={password} showRules={false} />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-link">{t('forgotPassword')}</a>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('loading') : t('signIn')}
              </button>
            </form>

            <div className="form-divider">
              <span>or continue with</span>
            </div>

            <div className="social-login">
              <button className="social-btn google">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="social-btn apple">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Apple
              </button>
            </div>

            <div className="form-footer">
              {t('noAccount')} <a href="/signup" className="signup-link">{t('signUp')}</a>
            </div>

            <div className="back-to-home">
              <a href="/intro" className="back-link">← Back to Home</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
