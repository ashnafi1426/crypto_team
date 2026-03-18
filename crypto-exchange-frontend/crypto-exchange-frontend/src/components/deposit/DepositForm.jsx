import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/components/deposit.css';

export const DepositForm = () => {
  const { addNotification } = useNotifications();
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [selectedNetwork, setSelectedNetwork] = useState('BTTC');

  const cryptoOptions = [
    { symbol: 'BTC',  name: 'Bitcoin (BTC)',        icon: '₿', minDeposit: '0.001 BTC',      confirmations: 3,   arrivalTime: '30-60 min' },
    { symbol: 'ETH',  name: 'Ethereum (ETH)',        icon: 'Ξ', minDeposit: '0.01 ETH',       confirmations: 12,  arrivalTime: '5-15 min'  },
    { symbol: 'USDT', name: 'Tether (USDT)',         icon: '₮', minDeposit: '10 USDT',        confirmations: 12,  arrivalTime: '5-15 min'  },
    { symbol: 'USDC', name: 'USD Coin (USDC)',       icon: '$', minDeposit: '10 USDC',        confirmations: 12,  arrivalTime: '5-15 min'  },
    { symbol: 'BNB',  name: 'Binance Coin (BNB)',    icon: 'B', minDeposit: '0.01 BNB',       confirmations: 15,  arrivalTime: '3-10 min'  },
    { symbol: 'SOL',  name: 'Solana (SOL)',           icon: '◎', minDeposit: '0.1 SOL',        confirmations: 32,  arrivalTime: '1-3 min'   },
    { symbol: 'XRP',  name: 'Ripple (XRP)',           icon: 'X', minDeposit: '10 XRP',         confirmations: 1,   arrivalTime: '1-5 min'   },
    { symbol: 'ADA',  name: 'Cardano (ADA)',          icon: '₳', minDeposit: '10 ADA',         confirmations: 15,  arrivalTime: '5-10 min'  },
    { symbol: 'DOGE', name: 'Dogecoin (DOGE)',        icon: 'Ð', minDeposit: '50 DOGE',        confirmations: 6,   arrivalTime: '10-20 min' },
    { symbol: 'MATIC',name: 'Polygon (MATIC)',        icon: 'M', minDeposit: '10 MATIC',       confirmations: 128, arrivalTime: '2-5 min'   },
    { symbol: 'DOT',  name: 'Polkadot (DOT)',         icon: '●', minDeposit: '1 DOT',          confirmations: 10,  arrivalTime: '5-15 min'  },
    { symbol: 'AVAX', name: 'Avalanche (AVAX)',       icon: 'A', minDeposit: '0.1 AVAX',       confirmations: 1,   arrivalTime: '1-3 min'   },
    { symbol: 'SHIB', name: 'Shiba Inu (SHIB)',       icon: '🐕',minDeposit: '1000000 SHIB',   confirmations: 12,  arrivalTime: '5-15 min'  },
    { symbol: 'LTC',  name: 'Litecoin (LTC)',         icon: 'Ł', minDeposit: '0.01 LTC',       confirmations: 6,   arrivalTime: '15-30 min' },
    { symbol: 'TRX',  name: 'TRON (TRX)',             icon: 'T', minDeposit: '100 TRX',        confirmations: 19,  arrivalTime: '3-5 min'   },
  ];

  const networkOptions = ['BTTC', 'BTC (SegWit)', 'BEP20 (BSC)', 'ERC20'];
  const depositAddress = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa';

  const selectedCryptoData = cryptoOptions.find(c => c.symbol === selectedCrypto);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(depositAddress);
    addNotification('success', 'Deposit address copied to clipboard!');
  };

  const handleContactSupport = () => {
    addNotification('info', 'Opening support chat...');
    setTimeout(() => addNotification('success', 'Support team will assist you shortly!'), 1000);
  };

  return (
    <div className="deposit-container-new">
      <div className="deposit-section-new">
        <label className="deposit-label-new">Select Cryptocurrency</label>
        <div className="crypto-select-wrapper">
          <div className="crypto-icon-select">₿</div>
          <select
            className="crypto-select-new"
            value={selectedCrypto}
            onChange={e => setSelectedCrypto(e.target.value)}
          >
            {cryptoOptions.map(c => (
              <option key={c.symbol} value={c.symbol}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="deposit-section-new">
        <label className="deposit-label-new">Select Network</label>
        <div className="network-buttons">
          {networkOptions.map(n => (
            <button
              key={n}
              className={`network-btn ${selectedNetwork === n ? 'active' : ''}`}
              onClick={() => setSelectedNetwork(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="deposit-address-section">
        <div className="qr-code-box">
          <QRCodeSVG
            value={depositAddress}
            size={160}
            bgColor="transparent"
            fgColor="#ffffff"
            level="H"
            includeMargin={true}
          />
        </div>
        <div className="address-info-box">
          <label className="deposit-label-new">{selectedCrypto} Deposit Address</label>
          <div className="address-display">
            <span className="btc-icon">{selectedCryptoData?.icon}</span>
            <span className="address-value">{depositAddress}</span>
            <button className="copy-icon-btn" onClick={handleCopyAddress}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
              </svg>
            </button>
          </div>
          <button className="copy-address-btn" onClick={handleCopyAddress}>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
            Copy Address
          </button>
          <div className="deposit-warnings">
            <p>• Send only {selectedCryptoData?.name.split(' ')[0]} ({selectedCrypto}) to this address.</p>
            <p>• Minimum Deposit: {selectedCryptoData?.minDeposit}</p>
            <p>• Please ensure the network is correct.</p>
          </div>
        </div>
      </div>

      <div className="crypto-deposit-info">
        <div className="crypto-info-card">
          <div className="info-icon">⏱️</div>
          <div className="info-content">
            <div className="info-label">Estimated Arrival</div>
            <div className="info-value">{selectedCryptoData?.arrivalTime}</div>
          </div>
        </div>
        <div className="crypto-info-card">
          <div className="info-icon">✓</div>
          <div className="info-content">
            <div className="info-label">Confirmations Required</div>
            <div className="info-value">{selectedCryptoData?.confirmations} blocks</div>
          </div>
        </div>
        <div className="crypto-info-card">
          <div className="info-icon">💰</div>
          <div className="info-content">
            <div className="info-label">Minimum Deposit</div>
            <div className="info-value">{selectedCryptoData?.minDeposit}</div>
          </div>
        </div>
        <div className="crypto-info-card">
          <div className="info-icon">🔒</div>
          <div className="info-content">
            <div className="info-label">Security</div>
            <div className="info-value">SSL Encrypted</div>
          </div>
        </div>
      </div>

      <div className="deposit-history-section">
        <h3 className="section-title-new">Deposit History</h3>
        <div className="history-table">
          <div className="history-header">
            <div>Date</div>
            <div>Asset</div>
            <div>Network</div>
            <div>Amount</div>
            <div>Status</div>
            <div>Transaction ID</div>
          </div>
          <div className="history-row">
            <div>2024-03-10 14:32</div>
            <div>BTC</div>
            <div>Bitcoin</div>
            <div>0.025 BTC</div>
            <div><span className="status-badge completed">Completed</span></div>
            <div className="tx-id">TXN-8F3A9B2C</div>
          </div>
          <div className="history-row">
            <div>2024-03-08 09:15</div>
            <div>ETH</div>
            <div>ERC-20</div>
            <div>1.5 ETH</div>
            <div><span className="status-badge completed">Completed</span></div>
            <div className="tx-id">TXN-7E2D8A1F</div>
          </div>
          <div className="history-row">
            <div>2024-03-05 16:48</div>
            <div>USDT</div>
            <div>TRC-20</div>
            <div>500 USDT</div>
            <div><span className="status-badge pending">Pending</span></div>
            <div className="tx-id">TXN-6C1B7D9E</div>
          </div>
        </div>
      </div>

      <div className="help-section">
        <h3 className="help-title">Need Help?</h3>
        <p className="help-text">Visit our <a href="#" className="help-link">Help Center</a> or contact our support team if you need assistance with deposits.</p>
        <button className="contact-support-btn" onClick={handleContactSupport}>Contact Support</button>
      </div>
    </div>
  );
};
