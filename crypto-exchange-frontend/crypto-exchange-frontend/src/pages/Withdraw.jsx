import { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/withdraw.css';

const CRYPTO_NETWORKS = {
  BTC:  ['Bitcoin (BTC)'],
  ETH:  ['Ethereum (ERC-20)', 'Arbitrum', 'Optimism'],
  USDT: ['Ethereum (ERC-20)', 'Tron (TRC-20)', 'BNB Smart Chain (BEP-20)'],
  BNB:  ['BNB Smart Chain (BEP-20)'],
  SOL:  ['Solana'],
  USDC: ['Ethereum (ERC-20)', 'Solana', 'Polygon'],
};

function Withdraw() {
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const [cryptoAsset, setCryptoAsset] = useState('BTC');
  const [network, setNetwork] = useState('Bitcoin (BTC)');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCryptoSubmit = (e) => {
    e.preventDefault();
    if (!amount || !address) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setAmount('');
      setAddress('');
      addNotification({ type: 'success', title: 'Withdrawal Submitted', message: `${amount} ${cryptoAsset} sent to ${address.slice(0, 8)}…` });
    }, 1200);
  };

  return (
    <main className="withdraw-page">
      <div className="wd-header fi">
        <div className="wd-title">{t('withdraw')}</div>
        <div className="wd-subtitle">{t('withdrawSubtitle')}</div>
      </div>

      <div className="wd-body fi" style={{ animationDelay: '.1s' }}>
        <div className="wd-card">
          <div className="wd-section-title">{t('cryptoWithdrawal')}</div>
          <form className="wd-form" onSubmit={handleCryptoSubmit}>
            <div className="wd-row">
              <div className="wd-field">
                <label>Asset</label>
                <select
                  className="wd-select"
                  value={cryptoAsset}
                  onChange={e => { setCryptoAsset(e.target.value); setNetwork(CRYPTO_NETWORKS[e.target.value][0]); }}
                >
                  {Object.keys(CRYPTO_NETWORKS).map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="wd-field">
                <label>Network</label>
                <select className="wd-select" value={network} onChange={e => setNetwork(e.target.value)}>
                  {CRYPTO_NETWORKS[cryptoAsset].map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="wd-field">
              <label>Recipient Address</label>
              <input
                type="text"
                className="wd-input mono"
                placeholder="Enter wallet address…"
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div className="wd-field">
              <label>Amount ({cryptoAsset})</label>
              <div className="wd-input-wrap">
                <input
                  type="number"
                  placeholder="0.00000000"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  step="any"
                  min="0"
                />
                <button type="button" className="wd-max" onClick={() => setAmount('1.5')}>MAX</button>
              </div>
            </div>

            <div className="wd-warning">
              ⚠ Double-check the address and network. Crypto withdrawals are irreversible.
            </div>

            <button type="submit" className="wd-submit" disabled={submitting || !amount || !address}>
              {submitting ? t('sending') : `${t('send')} ${cryptoAsset}`}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Withdraw;
