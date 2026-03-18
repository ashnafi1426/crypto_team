import { useState } from 'react';
import '../styles/components/buycrypto.css';
import { useLanguage } from '../context/LanguageContext';

function BuyCrypto() {
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [amount, setAmount] = useState('');
  const [fiatAmount, setFiatAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  
  // Card payment states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardName, setCardName] = useState('');
  
  // PayPal state
  const [paypalEmail, setPaypalEmail] = useState('');
  
  // P2P states
  const [p2pOffers, setP2pOffers] = useState([
    { id: 1, seller: 'CryptoKing', price: 60500, min: 100, max: 5000, rating: 4.9, trades: 1250, paymentMethods: ['Bank Transfer', 'PayPal'] },
    { id: 2, seller: 'BitMaster', price: 60450, min: 50, max: 3000, rating: 4.8, trades: 890, paymentMethods: ['Bank Transfer', 'Wise'] },
    { id: 3, seller: 'CoinTrader', price: 60600, min: 200, max: 10000, rating: 5.0, trades: 2100, paymentMethods: ['Bank Transfer', 'PayPal', 'Revolut'] },
  ]);
  
  // Gift card state
  const [giftCardCode, setGiftCardCode] = useState('');
  const [giftCardPin, setGiftCardPin] = useState('');

  const cryptoOptions = [
    { symbol: 'BTC', name: 'Bitcoin', price: 60000, icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', price: 3000, icon: 'Ξ' },
    { symbol: 'USDT', name: 'Tether', price: 1, icon: '₮' },
    { symbol: 'BNB', name: 'Binance Coin', price: 400, icon: 'B' },
    { symbol: 'SOL', name: 'Solana', price: 145, icon: '◎' },
  ];

  const selectedCryptoData = cryptoOptions.find(c => c.symbol === selectedCrypto);

  const calculateCrypto = (fiat) => {
    if (!fiat || !selectedCryptoData) return '0.00';
    return (parseFloat(fiat) / selectedCryptoData.price).toFixed(8);
  };

  const calculateFiat = (crypto) => {
    if (!crypto || !selectedCryptoData) return '0.00';
    return (parseFloat(crypto) * selectedCryptoData.price).toFixed(2);
  };

  const handleFiatChange = (value) => {
    setFiatAmount(value);
    setAmount(calculateCrypto(value));
  };

  const handleCryptoChange = (value) => {
    setAmount(value);
    setFiatAmount(calculateFiat(value));
  };

  return (
    <main className="main-content">
      <div className="buy-crypto-page">
        <div className="buy-header">
          <h1>{t('buyCrypto')}</h1>
          <p>{t('buyCryptoSubtitle')}</p>
        </div>

        <div className="buy-container">
          {/* Payment Method Selection */}
          <div className="payment-methods">
            <button
              className={`payment-method-btn ${paymentMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
              </svg>
              <span>{t('card')}</span>
            </button>

            <button
              className={`payment-method-btn ${paymentMethod === 'paypal' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.32 21.97a.546.546 0 0 1-.26-.32c-.03-.15-.06-.3-.06-.45l.02-.14 1.29-8.23H7.25c-.23 0-.44-.02-.63-.07a1.99 1.99 0 0 1-1.36-1.71c-.02-.2-.01-.4.03-.6l1.52-9.6c.05-.3.18-.57.38-.79.2-.22.46-.37.75-.43.15-.03.3-.04.45-.04h7.09c1.54 0 2.88.44 3.91 1.29 1.03.85 1.64 2.05 1.77 3.49.03.33.03.66 0 .99-.13 1.44-.74 2.64-1.77 3.49-1.03.85-2.37 1.29-3.91 1.29h-3.55l-.77 4.88c-.05.3-.18.57-.38.79-.2.22-.46.37-.75.43-.15.03-.3.04-.45.04H8.32z"/>
              </svg>
              <span>PayPal</span>
            </button>

            <button
              className={`payment-method-btn ${paymentMethod === 'wire' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('wire')}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              <span>{t('wireTransfer')}</span>
            </button>

            <button
              className={`payment-method-btn ${paymentMethod === 'p2p' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('p2p')}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              <span>{t('p2pTrading')}</span>
            </button>

            <button
              className={`payment-method-btn ${paymentMethod === 'giftcard' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('giftcard')}
            >
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
              </svg>
              <span>{t('giftCard')}</span>
            </button>
          </div>

          <div className="buy-content">
            {/* Amount Selection */}
            <div className="amount-section">
              <h3>{t('selectAmount')}</h3>
              
              <div className="crypto-selector-buy">
                <label>{t('cryptocurrency')}</label>
                <div className="crypto-buttons-buy">
                  {cryptoOptions.map(crypto => (
                    <button
                      key={crypto.symbol}
                      className={`crypto-btn-buy ${selectedCrypto === crypto.symbol ? 'active' : ''}`}
                      onClick={() => setSelectedCrypto(crypto.symbol)}
                    >
                      <span className="crypto-icon-buy">{crypto.icon}</span>
                      <span>{crypto.symbol}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="amount-inputs">
                <div className="input-group-buy">
                  <label>{t('youPay')}</label>
                  <div className="input-wrapper-buy">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={fiatAmount}
                      onChange={(e) => handleFiatChange(e.target.value)}
                    />
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="swap-icon-buy">⇅</div>

                <div className="input-group-buy">
                  <label>{t('youReceive')}</label>
                  <div className="input-wrapper-buy">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => handleCryptoChange(e.target.value)}
                    />
                    <span className="currency-label-buy">{selectedCrypto}</span>
                  </div>
                </div>
              </div>

              <div className="quick-amounts">
                {[100, 500, 1000, 5000].map(preset => (
                  <button
                    key={preset}
                    className="quick-amount-btn"
                    onClick={() => handleFiatChange(preset.toString())}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>


            {/* Payment Forms */}
            {paymentMethod === 'card' && (
              <div className="payment-form">
                <h3>Card Payment</h3>
                <p className="payment-description">Instant purchase with credit/debit card</p>
                
                <div className="form-group-buy">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    maxLength="19"
                  />
                </div>

                <div className="form-row-buy">
                  <div className="form-group-buy">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group-buy">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cardCVV}
                      onChange={(e) => setCardCVV(e.target.value)}
                      maxLength="4"
                    />
                  </div>
                </div>

                <div className="form-group-buy">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                <div className="payment-info-buy">
                  <div className="info-row-buy">
                    <span>Processing Fee (2.5%)</span>
                    <span>${(parseFloat(fiatAmount) * 0.025 || 0).toFixed(2)}</span>
                  </div>
                  <div className="info-row-buy total-row-buy">
                    <span>Total Amount</span>
                    <span>${(parseFloat(fiatAmount) * 1.025 || 0).toFixed(2)}</span>
                  </div>
                </div>

                <button className="buy-submit-btn">
                  {t('buy')} {selectedCrypto} {t('now')}
                </button>

                <div className="security-badges">
                  <span>🔒 Secure Payment</span>
                  <span>✓ PCI Compliant</span>
                  <span>✓ 3D Secure</span>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="payment-form">
                <h3>PayPal Payment</h3>
                <p className="payment-description">Quick and secure payment with PayPal</p>
                
                <div className="paypal-info">
                  <div className="paypal-logo">PayPal</div>
                  <p>You'll be redirected to PayPal to complete your purchase</p>
                </div>

                <div className="form-group-buy">
                  <label>PayPal Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={paypalEmail}
                    onChange={(e) => setPaypalEmail(e.target.value)}
                  />
                </div>

                <div className="payment-info-buy">
                  <div className="info-row-buy">
                    <span>Processing Fee (3.5%)</span>
                    <span>${(parseFloat(fiatAmount) * 0.035 || 0).toFixed(2)}</span>
                  </div>
                  <div className="info-row-buy total-row-buy">
                    <span>Total Amount</span>
                    <span>${(parseFloat(fiatAmount) * 1.035 || 0).toFixed(2)}</span>
                  </div>
                </div>

                <button className="buy-submit-btn paypal-btn">
                  {t('continueWithPaypal')}
                </button>

                <div className="payment-features">
                  <div className="feature-item">✓ Buyer Protection</div>
                  <div className="feature-item">✓ Instant Processing</div>
                  <div className="feature-item">✓ No Card Required</div>
                </div>
              </div>
            )}

            {paymentMethod === 'wire' && (
              <div className="payment-form">
                <h3>Wire Transfer</h3>
                <p className="payment-description">Best for large purchases (min $10,000)</p>
                
                <div className="wire-notice">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                  </svg>
                  <div>
                    <strong>Processing Time:</strong> 1-3 business days
                    <br />
                    <strong>Minimum Amount:</strong> $10,000
                  </div>
                </div>

                <div className="bank-details-buy">
                  <h4>Bank Details</h4>
                  <div className="detail-row-buy">
                    <span>Bank Name:</span>
                    <span>Nexus Financial Bank</span>
                  </div>
                  <div className="detail-row-buy">
                    <span>Account Name:</span>
                    <span>Nexus Exchange Ltd</span>
                  </div>
                  <div className="detail-row-buy">
                    <span>Account Number:</span>
                    <span>1234567890</span>
                  </div>
                  <div className="detail-row-buy">
                    <span>Routing Number:</span>
                    <span>021000021</span>
                  </div>
                  <div className="detail-row-buy">
                    <span>SWIFT Code:</span>
                    <span>NEXUUS33</span>
                  </div>
                  <div className="detail-row-buy">
                    <span>Reference Code:</span>
                    <span className="reference-code">NEX-{Date.now().toString().slice(-8)}</span>
                  </div>
                </div>

                <div className="payment-info-buy">
                  <div className="info-row-buy">
                    <span>Processing Fee</span>
                    <span>FREE</span>
                  </div>
                  <div className="info-row-buy total-row-buy">
                    <span>Total Amount</span>
                    <span>${parseFloat(fiatAmount || 0).toFixed(2)}</span>
                  </div>
                </div>

                <button className="buy-submit-btn">
                  {t('sentWireTransfer')}
                </button>
              </div>
            )}


            {paymentMethod === 'p2p' && (
              <div className="payment-form">
                <h3>P2P Trading</h3>
                <p className="payment-description">Buy directly from other users</p>
                
                <div className="p2p-filters">
                  <input type="text" placeholder="Search by seller..." className="p2p-search" />
                  <select className="p2p-filter">
                    <option>All Payment Methods</option>
                    <option>Bank Transfer</option>
                    <option>PayPal</option>
                    <option>Wise</option>
                  </select>
                </div>

                <div className="p2p-offers">
                  {p2pOffers.map(offer => (
                    <div key={offer.id} className="p2p-offer-card">
                      <div className="offer-header">
                        <div className="seller-info">
                          <div className="seller-avatar">{offer.seller[0]}</div>
                          <div>
                            <div className="seller-name">{offer.seller}</div>
                            <div className="seller-stats">
                              <span className="rating">⭐ {offer.rating}</span>
                              <span className="trades">{offer.trades} trades</span>
                            </div>
                          </div>
                        </div>
                        <div className="offer-price">
                          <div className="price-label">Price</div>
                          <div className="price-value">${offer.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <div className="offer-details">
                        <div className="detail-item-p2p">
                          <span>Limits:</span>
                          <span>${offer.min} - ${offer.max.toLocaleString()}</span>
                        </div>
                        <div className="detail-item-p2p">
                          <span>Payment:</span>
                          <span>{offer.paymentMethods.join(', ')}</span>
                        </div>
                      </div>

                      <button className="p2p-buy-btn">Buy from {offer.seller}</button>
                    </div>
                  ))}
                </div>

                <div className="p2p-info">
                  <h4>How P2P Trading Works</h4>
                  <ol>
                    <li>Select an offer from a verified seller</li>
                    <li>Crypto is held in escrow for your protection</li>
                    <li>Complete payment using seller's preferred method</li>
                    <li>Crypto is released to your wallet automatically</li>
                  </ol>
                </div>
              </div>
            )}

            {paymentMethod === 'giftcard' && (
              <div className="payment-form">
                <h3>Redeem Gift Card</h3>
                <p className="payment-description">Convert your crypto gift card to digital assets</p>
                
                <div className="giftcard-visual">
                  <div className="giftcard-mockup">
                    <div className="giftcard-logo">NEXUS</div>
                    <div className="giftcard-text">Crypto Gift Card</div>
                    <div className="giftcard-amount">$XXX.XX</div>
                  </div>
                </div>

                <div className="form-group-buy">
                  <label>Gift Card Code</label>
                  <input
                    type="text"
                    placeholder="XXXX-XXXX-XXXX-XXXX"
                    value={giftCardCode}
                    onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())}
                    maxLength="19"
                  />
                </div>

                <div className="form-group-buy">
                  <label>PIN (if applicable)</label>
                  <input
                    type="text"
                    placeholder="1234"
                    value={giftCardPin}
                    onChange={(e) => setGiftCardPin(e.target.value)}
                    maxLength="6"
                  />
                </div>

                <button className="buy-submit-btn">
                  {t('redeemGiftCard')}
                </button>

                <div className="giftcard-info">
                  <h4>Supported Gift Cards</h4>
                  <div className="giftcard-types">
                    <div className="giftcard-type">Nexus Gift Cards</div>
                    <div className="giftcard-type">Partner Cards</div>
                    <div className="giftcard-type">Promotional Codes</div>
                  </div>
                  <p className="giftcard-note">
                    Gift cards are non-refundable and must be redeemed within 12 months of purchase.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default BuyCrypto;
