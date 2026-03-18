import React from 'react';
import './PasswordStrength.css';

export const getPasswordScore = (password) => {
  if (!password) return { score: 0, label: '', rules: getRules('') };
  const rules = getRules(password);
  const passed = Object.values(rules).filter(Boolean).length;
  const score = passed; // 0-4
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[passed] || '', rules };
};

const getRules = (password) => ({
  length:    password.length >= 8,
  uppercase: /[A-Z]/.test(password),
  number:    /[0-9]/.test(password),
  special:   /[^A-Za-z0-9]/.test(password),
});

const RULE_LABELS = {
  length:    'At least 8 characters',
  uppercase: 'One uppercase letter',
  number:    'One number',
  special:   'One special character (!@#$...)',
};

const SCORE_COLORS = ['', '#ef4444', '#f59e0b', '#3a6ff7', '#00ffe0'];

export default function PasswordStrength({ password, showRules = true }) {
  const { score, label, rules } = getPasswordScore(password);
  if (!password) return null;

  return (
    <div className="pw-strength">
      <div className="pw-bar-row">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="pw-bar-seg"
            style={{ background: i <= score ? SCORE_COLORS[score] : 'rgba(255,255,255,0.08)' }}
          />
        ))}
        <span className="pw-label" style={{ color: SCORE_COLORS[score] }}>{label}</span>
      </div>
      {showRules && (
        <ul className="pw-rules">
          {Object.entries(rules).map(([key, passed]) => (
            <li key={key} className={`pw-rule ${passed ? 'pass' : 'fail'}`}>
              <span className="pw-rule-icon">{passed ? '✓' : '✗'}</span>
              {RULE_LABELS[key]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
