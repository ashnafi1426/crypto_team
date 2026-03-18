import React, { useState } from 'react';
import { formatPrice, formatAmount } from '../utils/formatters';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/staking.css';

const Staking = () => {
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('available');
  const [selectedStake, setSelectedStake] = useState(null);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  // Mock wallet balances - now with setter
  const [walletBalances, setWalletBalances] = useState({
    ETH: 10.5,
    SOL: 250,
    ADA: 5000,
    DOT: 150,
    AVAX: 80,
    MATIC: 2500
  });

  // Mock staking opportunities
  const stakingPools = [
    {
      id: 1,
      asset: 'ETH',
      name: 'Ethereum 2.0',
      apy: 4.5,
      duration: 'Flexible',
      minStake: 0.01,
      totalStaked: 125000,
      participants: 8234,
      risk: 'Low'
    },
    {
      id: 2,
      asset: 'SOL',
      name: 'Solana Staking',
      apy: 7.2,
      duration: '30 days',
      minStake: 1,
      totalStaked: 450000,
      participants: 12456,
      risk: 'Low'
    },
    {
      id: 3,
      asset: 'ADA',
      name: 'Cardano Pool',
      apy: 5.8,
      duration: 'Flexible',
      minStake: 10,
      totalStaked: 890000,
      participants: 15678,
      risk: 'Low'
    },
    {
      id: 4,
      asset: 'DOT',
      name: 'Polkadot Staking',
      apy: 12.5,
      duration: '90 days',
      minStake: 5,
      totalStaked: 320000,
      participants: 5432,
      risk: 'Medium'
    },
    {
      id: 5,
      asset: 'AVAX',
      name: 'Avalanche Validator',
      apy: 9.3,
      duration: '60 days',
      minStake: 25,
      totalStaked: 180000,
      participants: 3421,
      risk: 'Medium'
    },
    {
      id: 6,
      asset: 'MATIC',
      name: 'Polygon Staking',
      apy: 6.7,
      duration: 'Flexible',
      minStake: 100,
      totalStaked: 560000,
      participants: 9876,
      risk: 'Low'
    },
  ];

  // Active stakes state - now dynamic
  const [activeStakes, setActiveStakes] = useState([
    {
      id: 'STK-001',
      asset: 'ETH',
      amount: 5.5,
      apy: 4.5,
      startDate: '2024-02-15',
      endDate: 'Flexible',
      earned: 0.0234,
      status: 'Active',
      poolId: 1
    },
    {
      id: 'STK-002',
      asset: 'SOL',
      amount: 150,
      apy: 7.2,
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      earned: 0.8945,
      status: 'Active',
      poolId: 2
    },
    {
      id: 'STK-003',
      asset: 'DOT',
      amount: 200,
      apy: 12.5,
      startDate: '2024-01-20',
      endDate: '2024-04-20',
      earned: 6.234,
      status: 'Active',
      poolId: 4
    },
  ]);

  // Calculate totals dynamically
  const prices = { ETH: 3541.20, SOL: 172.85, DOT: 7.45, ADA: 0.65, AVAX: 42.30, MATIC: 1.15 };

  const totalStaked = activeStakes.reduce((sum, stake) => {
    return sum + (stake.amount * (prices[stake.asset] || 0));
  }, 0);

  const totalEarned = activeStakes.reduce((sum, stake) => {
    return sum + (stake.earned * (prices[stake.asset] || 0));
  }, 0);

  const handleStake = (pool) => {
    setSelectedStake(pool);
    setStakeAmount('');
    setShowStakeModal(true);
  };

  const handleMaxAmount = () => {
    if (selectedStake) {
      const available = walletBalances[selectedStake.asset] || 0;
      setStakeAmount(available.toString());
    }
  };

  const handleConfirmStake = () => {
    const amount = parseFloat(stakeAmount);

    // Validation
    if (!stakeAmount || amount <= 0 || isNaN(amount)) {
      addNotification('error', 'Please enter a valid amount');
      return;
    }

    // Soft warning for minimum stake (not blocking)
    if (amount < selectedStake.minStake) {
      addNotification('warning', `Recommended minimum: ${selectedStake.minStake} ${selectedStake.asset}. Proceeding with ${amount} ${selectedStake.asset}.`);
    }

    const available = walletBalances[selectedStake.asset] || 0;
    if (amount > available) {
      addNotification('error', `Insufficient balance. Available: ${available} ${selectedStake.asset}`);
      return;
    }

    // Generate new stake ID
    const newStakeId = `STK-${String(activeStakes.length + 1).padStart(3, '0')}`;

    // Calculate end date based on duration
    const startDate = new Date().toISOString().split('T')[0];
    let endDate = 'Flexible';

    if (selectedStake.duration !== 'Flexible') {
      const durationMatch = selectedStake.duration.match(/(\d+)/);
      if (durationMatch) {
        const days = parseInt(durationMatch[1]);
        const end = new Date();
        end.setDate(end.getDate() + days);
        endDate = end.toISOString().split('T')[0];
      }
    }

    // Create new stake
    const newStake = {
      id: newStakeId,
      asset: selectedStake.asset,
      amount: amount,
      apy: selectedStake.apy,
      startDate: startDate,
      endDate: endDate,
      earned: 0,
      status: 'Active',
      poolId: selectedStake.id
    };

    console.log('Creating new stake:', newStake);

    // Add to active stakes
    setActiveStakes(prevStakes => [...prevStakes, newStake]);

    // Update wallet balance
    setWalletBalances(prev => ({
      ...prev,
      [selectedStake.asset]: prev[selectedStake.asset] - amount
    }));

    addNotification('success', `Successfully staked ${amount} ${selectedStake.asset}!`);

    // Switch to My Stakes tab to show the new stake
    setTimeout(() => {
      setActiveTab('mystakes');
    }, 500);

    setShowStakeModal(false);
    setStakeAmount('');
    setSelectedStake(null);
  };

  const handleQuickAmount = (percentage) => {
    if (selectedStake) {
      const available = walletBalances[selectedStake.asset] || 0;
      const amount = (available * percentage / 100).toFixed(6);
      setStakeAmount(amount);
    }
  };

  const handleClaim = (stake) => {
    if (stake.earned <= 0) {
      addNotification('warning', 'No rewards to claim yet');
      return;
    }

    addNotification('info', 'Processing claim...');

    setTimeout(() => {
      // Update the stake to reset earned amount
      setActiveStakes(prevStakes =>
        prevStakes.map(s =>
          s.id === stake.id ? { ...s, earned: 0 } : s
        )
      );

      // Update wallet balance
      setWalletBalances(prev => ({
        ...prev,
        [stake.asset]: (prev[stake.asset] || 0) + stake.earned
      }));

      addNotification('success', `Claimed ${stake.earned.toFixed(6)} ${stake.asset}!`);
    }, 1000);
  };

  const handleUnstake = (stake) => {
    if (stake.endDate !== 'Flexible') {
      const endDate = new Date(stake.endDate);
      const now = new Date();
      if (now < endDate) {
        addNotification('error', 'Cannot unstake before lock period ends');
        return;
      }
    }

    addNotification('info', 'Processing unstake...');

    setTimeout(() => {
      // Remove stake from active stakes
      setActiveStakes(prevStakes => prevStakes.filter(s => s.id !== stake.id));

      // Return staked amount + earned to wallet
      const totalReturn = stake.amount + stake.earned;
      setWalletBalances(prev => ({
        ...prev,
        [stake.asset]: (prev[stake.asset] || 0) + totalReturn
      }));

      addNotification('success', `Unstaked ${stake.amount} ${stake.asset} + ${stake.earned.toFixed(6)} ${stake.asset} rewards!`);
    }, 1000);
  };

  return (
    <main className="main-content" style={{ padding: '1.5rem 2rem', overflowY: 'auto' }}>
      <div className="staking-header">
        <div>
          <h1 className="page-title">{t('staking')}</h1>
          <p className="page-subtitle">Earn rewards by staking your crypto assets</p>
        </div>
        <div className="staking-summary">
          <div className="summary-card">
            <div className="summary-label">Total Staked</div>
            <div className="summary-value">{formatPrice(totalStaked)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Earned</div>
            <div className="summary-value earned">{formatPrice(totalEarned)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Active Stakes</div>
            <div className="summary-value">{activeStakes.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="staking-tabs">
        <button
          className={`staking-tab ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          {t('availablePools')}
        </button>
        <button
          className={`staking-tab ${activeTab === 'mystakes' ? 'active' : ''}`}
          onClick={() => setActiveTab('mystakes')}
        >
          {t('myStakes')}
        </button>
      </div>

      {/* Available Pools */}
      {activeTab === 'available' && (
        <div className="staking-pools-grid">
          {stakingPools.map(pool => (
            <div key={pool.id} className="staking-pool-card">
              <div className="pool-header">
                <div className="pool-asset">
                  <div className="asset-icon">{pool.asset}</div>
                  <div>
                    <div className="pool-name">{pool.name}</div>
                    <div className="pool-asset-label">{pool.asset}</div>
                  </div>
                </div>
                <div className={`risk-badge ${pool.risk.toLowerCase()}`}>
                  {pool.risk} Risk
                </div>
              </div>

              <div className="pool-apy">
                <div className="apy-label">APY</div>
                <div className="apy-value">{pool.apy}%</div>
              </div>

              <div className="pool-details">
                <div className="detail-row">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{pool.duration}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Min. Stake</span>
                  <span className="detail-value">{pool.minStake} {pool.asset}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Staked</span>
                  <span className="detail-value">{formatPrice(pool.totalStaked)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Participants</span>
                  <span className="detail-value">{pool.participants.toLocaleString()}</span>
                </div>
              </div>

              <button
                className="stake-btn"
                onClick={() => handleStake(pool)}
              >
                {t('stakeNow')}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* My Stakes */}
      {activeTab === 'mystakes' && (
        <div className="my-stakes-container">
          {activeStakes.length > 0 ? (
            <div className="stakes-table-container">
              <table className="stakes-table">
                <thead>
                  <tr>
                    <th>Stake ID</th>
                    <th>{t('asset')}</th>
                    <th>Amount Staked</th>
                    <th>{t('apy')}</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>{t('totalEarned')}</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {activeStakes.map(stake => (
                    <tr key={stake.id}>
                      <td className="stake-id">{stake.id}</td>
                      <td className="stake-asset">{stake.asset}</td>
                      <td className="stake-amount">
                        {formatAmount(stake.amount)} {stake.asset}
                      </td>
                      <td className="stake-apy">{stake.apy}%</td>
                      <td className="stake-date">{stake.startDate}</td>
                      <td className="stake-date">{stake.endDate}</td>
                      <td className="stake-earned positive">
                        +{formatAmount(stake.earned)} {stake.asset}
                      </td>
                      <td>
                        <span className={`status-badge ${stake.status.toLowerCase()}`}>
                          {stake.status}
                        </span>
                      </td>
                      <td>
                        <div className="stake-actions">
                          <button
                            className="action-btn claim"
                            onClick={() => handleClaim(stake)}
                            disabled={stake.earned <= 0}
                          >
                            {t('rewards')}
                          </button>
                          {stake.endDate === 'Flexible' && (
                            <button
                              className="action-btn unstake"
                              onClick={() => handleUnstake(stake)}
                            >
                              {t('unstake')}
                            </button>
                          )}
                          {stake.endDate !== 'Flexible' && new Date(stake.endDate) <= new Date() && (
                            <button
                              className="action-btn unstake"
                              onClick={() => handleUnstake(stake)}
                            >
                              {t('unstake')}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'rgba(15, 20, 35, 0.6)',
              borderRadius: '16px',
              border: '1px solid rgba(58, 111, 247, 0.2)'
            }}>
              <div style={{
                fontSize: '48px',
                marginBottom: '20px',
                opacity: 0.5
              }}>📊</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                marginBottom: '10px'
              }}>{t('noActiveStakes')}</h3>
              <p style={{
                fontSize: '16px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginBottom: '30px'
              }}>{t('startStaking')}</p>
              <button
                onClick={() => setActiveTab('available')}
                style={{
                  padding: '12px 32px',
                  background: 'linear-gradient(135deg, #3a6ff7, #00ffe0)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                {t('viewAvailablePools')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stake Modal */}
      {showStakeModal && selectedStake && (
        <div className="modal-overlay" onClick={() => setShowStakeModal(false)}>
          <div className="modal-content stake-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Stake {selectedStake.asset}</h2>
              <button className="modal-close" onClick={() => setShowStakeModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="stake-form">
                <div className="stake-info-card">
                  <div className="info-row">
                    <span>Pool</span>
                    <span className="info-value">{selectedStake.name}</span>
                  </div>
                  <div className="info-row">
                    <span>APY</span>
                    <span className="info-value highlight">{selectedStake.apy}%</span>
                  </div>
                  <div className="info-row">
                    <span>Duration</span>
                    <span className="info-value">{selectedStake.duration}</span>
                  </div>
                  <div className="info-row">
                    <span>Min. Stake</span>
                    <span className="info-value">{selectedStake.minStake} {selectedStake.asset}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Amount to Stake</label>

                  {/* Quick percentage buttons */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px'
                  }}>
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(25)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'rgba(58, 111, 247, 0.15)',
                        border: '1px solid rgba(58, 111, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#3a6ff7',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.25)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.15)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      25%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(50)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'rgba(58, 111, 247, 0.15)',
                        border: '1px solid rgba(58, 111, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#3a6ff7',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.25)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.15)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      50%
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAmount(75)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'rgba(58, 111, 247, 0.15)',
                        border: '1px solid rgba(58, 111, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#3a6ff7',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.25)';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(58, 111, 247, 0.15)';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      75%
                    </button>
                    <button
                      type="button"
                      onClick={handleMaxAmount}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: 'linear-gradient(135deg, rgba(58, 111, 247, 0.2), rgba(0, 255, 224, 0.2))',
                        border: '1px solid rgba(58, 111, 247, 0.4)',
                        borderRadius: '8px',
                        color: '#00ffe0',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '700',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(58, 111, 247, 0.3), rgba(0, 255, 224, 0.3))';
                        e.target.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'linear-gradient(135deg, rgba(58, 111, 247, 0.2), rgba(0, 255, 224, 0.2))';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      MAX
                    </button>
                  </div>

                  <div className="amount-input-group">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="amount-input"
                      step="any"
                      min="0"
                    />
                    <span className="input-suffix">{selectedStake.asset}</span>
                  </div>
                  <div className="balance-info">
                    Available: {walletBalances[selectedStake.asset] || 0} {selectedStake.asset}
                    <span style={{
                      marginLeft: '10px',
                      color: 'rgba(255, 255, 255, 0.5)',
                      fontSize: '11px'
                    }}>
                      • Recommended min: {selectedStake.minStake} {selectedStake.asset}
                    </span>
                  </div>
                </div>

                <div className="estimated-rewards">
                  <h4>{t('estimatedRewards')}</h4>
                  <div className="rewards-grid">
                    <div className="reward-item">
                      <span className="reward-period">{t('daily')}</span>
                      <span className="reward-amount">
                        {stakeAmount ? ((parseFloat(stakeAmount) * selectedStake.apy / 100) / 365).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-period">{t('monthly')}</span>
                      <span className="reward-amount">
                        {stakeAmount ? ((parseFloat(stakeAmount) * selectedStake.apy / 100) / 12).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                    <div className="reward-item">
                      <span className="reward-period">{t('yearly')}</span>
                      <span className="reward-amount">
                        {stakeAmount ? (parseFloat(stakeAmount) * selectedStake.apy / 100).toFixed(6) : '0.000000'} {selectedStake.asset}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className={`confirm-stake-btn ${stakeAmount && parseFloat(stakeAmount) > 0 ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Button clicked!');
                    console.log('Stake amount:', stakeAmount);
                    console.log('Parsed amount:', parseFloat(stakeAmount));
                    handleConfirmStake();
                  }}
                  disabled={!stakeAmount || parseFloat(stakeAmount) <= 0}
                  type="button"
                >
                  {!stakeAmount || parseFloat(stakeAmount) <= 0
                    ? t('enterAmount').toUpperCase()
                    : t('confirmStake').toUpperCase()
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Staking;
