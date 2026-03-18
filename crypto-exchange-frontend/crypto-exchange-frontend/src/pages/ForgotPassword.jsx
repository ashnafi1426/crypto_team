import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/components/auth.css";
import "../styles/components/forgot-password.css";
import PasswordStrength, { getPasswordScore } from "../components/common/PasswordStrength";
import { useLanguage } from "../context/LanguageContext";

// Eye icons
const EyeOpen = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

function ForgotPassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef([]);

  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
      startResendTimer();
    }, 1000);
  };

  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (otp.some(d => d === "")) { setError("Please enter the full 6-digit code"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (getPasswordScore(newPassword).score < 3) { setError("Password is too weak. Please meet all requirements."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1000);
  };

  const steps = [t('fpStepEmail'), t('fpStepVerify'), t('fpStepReset'), t('fpStepDone')];

  return (
    <div className="auth-page">
      <div className="fp-container">
        {/* Logo */}
        <div className="fp-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">NEXUS</span>
        </div>

        {/* Step indicator */}
        <div className="fp-steps">
          {steps.map((s, i) => (
            <div key={i} className={`fp-step ${step > i ? "done" : step === i + 1 ? "active" : ""}`}>
              <div className="fp-step-dot">{step > i + 1 ? "✓" : i + 1}</div>
              <span className="fp-step-label">{s}</span>
              {i < steps.length - 1 && <div className="fp-step-line" />}
            </div>
          ))}
        </div>

        {/* Step 1 — Email */}
        {step === 1 && (
          <div className="fp-card">
            <div className="fp-icon">📧</div>
            <h2 className="fp-title">{t('forgotPassword')}</h2>
            <p className="fp-subtitle">{t('fpEmailSubtitle')}</p>
            {error && <div className="error-message"><span className="error-icon">⚠️</span>{error}</div>}
            <form onSubmit={handleEmailSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fp-email">{t('emailAddress')}</label>
                <input
                  type="email" id="fp-email" className="form-input"
                  placeholder={t('enterEmail')}
                  value={email} onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('sending') : t('sendResetCode')}
              </button>
            </form>
            <div className="fp-back"><a href="/login" className="back-link">← {t('backToLogin')}</a></div>
          </div>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <div className="fp-card">
            <div className="fp-icon">🔐</div>
            <h2 className="fp-title">{t('checkYourEmail')}</h2>
            <p className="fp-subtitle">{t('fpOtpSubtitle')} <strong>{email}</strong></p>
            {error && <div className="error-message"><span className="error-icon">⚠️</span>{error}</div>}
            <form onSubmit={handleOtpSubmit} className="auth-form">
              <div className="otp-row">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => otpRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    className={`otp-input ${digit ? "filled" : ""}`}
                    value={digit}
                    onChange={e => handleOtpChange(e.target.value, i)}
                    onKeyDown={e => handleOtpKeyDown(e, i)}
                  />
                ))}
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('verifying') : t('verifyCode')}
              </button>
            </form>
            <div className="fp-resend">
              {resendTimer > 0
                ? <span className="resend-timer">{t('resendIn')} {resendTimer}s</span>
                : <button className="resend-btn" onClick={() => { startResendTimer(); }}>{t('resendCode')}</button>
              }
            </div>
            <div className="fp-back"><button className="back-link" onClick={() => setStep(1)}>← {t('changeEmail')}</button></div>
          </div>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <div className="fp-card">
            <div className="fp-icon">🔑</div>
            <h2 className="fp-title">{t('setNewPassword')}</h2>
            <p className="fp-subtitle">{t('fpPasswordSubtitle')}</p>
            {error && <div className="error-message"><span className="error-icon">⚠️</span>{error}</div>}
            <form onSubmit={handlePasswordSubmit} className="auth-form">
              <div className="form-group">
                <label>{t('newPassword')}</label>
                <div className="input-password-wrap">
                  <input
                    type={showNew ? "text" : "password"} className="form-input"
                    placeholder={t('enterNewPassword')}
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowNew(v => !v)}>
                    {showNew ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                <PasswordStrength password={newPassword} />
              </div>
              <div className="form-group">
                <label>{t('confirmPassword')}</label>
                <div className="input-password-wrap">
                  <input
                    type={showConfirm ? "text" : "password"} className="form-input"
                    placeholder={t('confirmNewPassword')}
                    value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" className="password-toggle" onClick={() => setShowConfirm(v => !v)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {confirmPassword && (
                  <small style={{ color: confirmPassword === newPassword ? '#00ffe0' : '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    {confirmPassword === newPassword ? '✓ ' + t('passwordsMatch') : '✗ ' + t('passwordsNoMatch')}
                  </small>
                )}
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? t('saving') : t('resetPassword')}
              </button>
            </form>
          </div>
        )}

        {/* Step 4 — Success */}
        {step === 4 && (
          <div className="fp-card fp-success">
            <div className="fp-icon success-icon">✅</div>
            <h2 className="fp-title">{t('passwordReset')}</h2>
            <p className="fp-subtitle">{t('passwordResetSuccess')}</p>
            <button className="btn-submit" onClick={() => navigate("/login")}>
              {t('backToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
