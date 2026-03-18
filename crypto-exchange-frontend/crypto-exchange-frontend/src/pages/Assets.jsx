import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import '../styles/components/assets.css';

const DONUT_COLORS = ['#00f5ff', '#00ff88', '#bf5fff', '#f59e0b', '#26a17b', '#3b82f6', '#e84142', '#9b59f5', '#10b981', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#84cc16', '#a855f7', '#14b8a6'];

const ASSETS = [
  { rank: 1, sym: 'BTC', name: 'Bitcoin', icon: '₿', bg: 'radial-gradient(circle,#ff9500,#f7931a)', color: '#f7931a', cat: 'spot', qty: 1.2341, price: 67842.50, chg: 1.86, chg7: 8.2, staking: false, apy: 0 },
  { rank: 2, sym: 'ETH', name: 'Ethereum', icon: 'Ξ', bg: 'radial-gradient(circle,#8ea3f5,#627eea)', color: '#627eea', cat: 'spot', qty: 8.420, price: 3541.20, chg: 2.34, chg7: 12.1, staking: true, apy: 4.2 },
  { rank: 3, sym: 'SOL', name: 'Solana', icon: '◎', bg: 'radial-gradient(circle,#c074fc,#9945ff)', color: '#9945ff', cat: 'earn', qty: 42.00, price: 172.85, chg: -0.82, chg7: -3.4, staking: false, apy: 6.8 },
  { rank: 4, sym: 'BNB', name: 'BNB', icon: 'B', bg: 'radial-gradient(circle,#f5cc3a,#f3ba2f)', color: '#f3ba2f', cat: 'spot', qty: 14.50, price: 412.30, chg: 0.45, chg7: 2.8, staking: false, apy: 0 },
  { rank: 5, sym: 'USDT', name: 'Tether', icon: '₮', bg: 'radial-gradient(circle,#26a17b,#16634b)', color: '#26a17b', cat: 'earn', qty: 84291, price: 1.0001, chg: 0.01, chg7: 0.02, staking: false, apy: 8.5 },
  { rank: 6, sym: 'LINK', name: 'Chainlink', icon: '⬡', bg: 'radial-gradient(circle,#3b82f6,#1d4ed8)', color: '#3b82f6', cat: 'spot', qty: 120.0, price: 14.82, chg: 2.88, chg7: 9.4, staking: false, apy: 0 },
  { rank: 7, sym: 'AVAX', name: 'Avalanche', icon: 'A', bg: 'radial-gradient(circle,#ff6060,#e84142)', color: '#e84142', cat: 'staking', qty: 80.0, price: 38.42, chg: 3.12, chg7: 15.4, staking: true, apy: 11.2 },

];

const Assets = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const donutRef = useRef(null);
  const perfChartRef = useRef(null);
  const detailChartRef = useRef(null);
  
  const [assets, setAssets] = useState(ASSETS);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSort, setCurrentSort] = useState('value');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState('above');
  const [priceAlerts, setPriceAlerts] = useState([]);
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2024-03-12', time: '14:30', type: 'Buy', asset: 'BTC', amount: 0.05, price: 67500, total: 3375, status: 'Completed' },
    { id: 2, date: '2024-03-11', time: '09:15', type: 'Sell', asset: 'ETH', amount: 1.2, price: 3520, total: 4224, status: 'Completed' },
    { id: 3, date: '2024-03-10', time: '16:45', type: 'Deposit', asset: 'USDT', amount: 5000, price: 1, total: 5000, status: 'Completed' },
    { id: 4, date: '2024-03-09', time: '11:20', type: 'Buy', asset: 'SOL', amount: 10, price: 170, total: 1700, status: 'Completed' },
    { id: 5, date: '2024-03-08', time: '13:00', type: 'Stake', asset: 'ETH', amount: 2, price: 3500, total: 7000, status: 'Active' },
    { id: 6, date: '2024-03-07', time: '10:30', type: 'Withdraw', asset: 'BTC', amount: 0.02, price: 68000, total: 1360, status: 'Completed' },
    { id: 7, date: '2024-03-06', time: '15:45', type: 'Buy', asset: 'MATIC', amount: 1000, price: 0.85, total: 850, status: 'Completed' },
    { id: 8, date: '2024-03-05', time: '08:20', type: 'Sell', asset: 'LINK', amount: 50, price: 14.5, total: 725, status: 'Completed' },
  ]);

  const assetValue = (a) => a.qty * a.price;
  const totalValue = () => assets.reduce((s, a) => s + assetValue(a), 0);

  const fmtP = (v) => {
    return v < 1 ? '$' + v.toFixed(4) : v < 100 ? '$' + v.toFixed(2) : '$' + v.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  useEffect(() => {
    drawDonut();
    drawPerfChart();
    
    const interval = setInterval(() => {
      setAssets(prev => prev.map(a => ({
        ...a,
        price: a.price * (1 + (Math.random() - 0.499) * 0.0015)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    drawDonut();
  }, [assets]);

  useEffect(() => {
    if (showDetailModal && selectedAsset) {
      drawDetailChart();
    }
  }, [showDetailModal, selectedAsset]);

  const drawDonut = () => {
    const canvas = donutRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const tv = totalValue();
    const cx = 65, cy = 65, r = 58, inner = 36;
    canvas.width = 130;
    canvas.height = 130;
    ctx.clearRect(0, 0, 130, 130);
    let start = -Math.PI / 2;
    assets.forEach((a, i) => {
      const pct = assetValue(a) / tv;
      const angle = pct * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, start, start + angle);
      ctx.arc(cx, cy, inner, start + angle, start, true);
      ctx.closePath();
      ctx.fillStyle = DONUT_COLORS[i];
      ctx.shadowColor = DONUT_COLORS[i];
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
      start += angle + 0.015;
    });
  };

  const drawPerfChart = () => {
    const canvas = perfChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 320, H = 120;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const pts = 30;
    const data = [];
    let v = 100000;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.45) * 3000;
      data.push(v);
    }
    const mn = Math.min(...data) * 0.998;
    const mx = Math.max(...data) * 1.002;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0,245,255,.25)');
    grad.addColorStop(1, 'rgba(0,245,255,0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const genSpark = () => {
    const pts = 12;
    const data = [];
    let v = 50;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.5) * 15;
      data.push(Math.max(10, Math.min(90, v)));
    }
    return data;
  };

  const sparkSVG = (data, up) => {
    const W = 60, H = 24;
    const mn = Math.min(...data);
    const mx = Math.max(...data);
    const path = data.map((d, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
    const col = up ? '#00ff88' : '#ef4444';
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="${path}" fill="none" stroke="${col}" stroke-width="1.5"/></svg>`;
  };

  const buildExposure = () => {
    const cats = { spot: 0, earn: 0, staking: 0 };
    assets.forEach(a => {
      cats[a.cat] = (cats[a.cat] || 0) + assetValue(a);
    });
    const tv = totalValue();
    return Object.entries(cats).map(([cat, val]) => ({
      cat: cat.charAt(0).toUpperCase() + cat.slice(1),
      val,
      pct: (val / tv) * 100
    }));
  };

  const buildHeatmap = () => {
    return assets.map(a => ({
      sym: a.sym,
      chg: a.chg,
      val: assetValue(a)
    })).sort((a, b) => b.val - a.val);
  };

  const filteredAssets = assets.filter(a => {
    if (currentFilter !== 'all' && a.cat !== currentFilter) return false;
    if (searchTerm && !a.sym.toLowerCase().includes(searchTerm.toLowerCase()) && !a.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    if (currentSort === 'value') return assetValue(b) - assetValue(a);
    if (currentSort === 'name') return a.sym.localeCompare(b.sym);
    if (currentSort === 'change') return b.chg - a.chg;
    return 0;
  });

  const totalPL = assets.reduce((s, a) => s + (assetValue(a) * a.chg / 100), 0);
  const inStaking = assets.filter(a => a.staking).reduce((s, a) => s + assetValue(a), 0);
  const usdtAsset = assets.find(a => a.sym === 'USDT');
  const availUSDT = usdtAsset ? assetValue(usdtAsset) : 0;

  // Handler functions
  const handleDeposit = (asset) => {
    addNotification('info', `Navigating to deposit ${asset.sym}...`);
    navigate('/deposit', { state: { selectedCoin: asset.sym } });
  };

  const handleWithdraw = (asset) => {
    addNotification('info', `Navigating to withdraw ${asset.sym}...`);
    navigate('/withdraw', { state: { selectedCoin: asset.sym } });
  };

  const handleTrade = (asset) => {
    addNotification('info', `Opening ${asset.sym}/USDT trading pair...`);
    navigate('/trade', { state: { pair: `${asset.sym}/USDT` } });
  };

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    setShowDetailModal(true);
  };

  const handleSetAlert = () => {
    if (!alertPrice || !selectedAsset) {
      addNotification('error', 'Please enter a valid price');
      return;
    }

    const newAlert = {
      id: Date.now(),
      asset: selectedAsset.sym,
      targetPrice: parseFloat(alertPrice),
      type: alertType,
      active: true,
      created: new Date().toISOString()
    };

    setPriceAlerts([...priceAlerts, newAlert]);
    addNotification('success', `Price alert set for ${selectedAsset.sym} at $${alertPrice}`);
    setAlertPrice('');
    setShowPriceAlert(false);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Asset', 'Symbol', 'Quantity', 'Price', 'Value', '24H Change', '7D Change', 'Category'],
      ...sortedAssets.map(a => [
        a.name,
        a.sym,
        a.qty,
        a.price,
        assetValue(a),
        a.chg,
        a.chg7,
        a.cat
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    addNotification('success', 'Portfolio exported to CSV');
  };

  const handleExportPDF = () => {
    addNotification('info', 'Generating PDF report...');
    setTimeout(() => {
      addNotification('success', 'PDF report generated successfully');
    }, 1500);
  };

  const drawDetailChart = () => {
    const canvas = detailChartRef.current;
    if (!canvas || !selectedAsset) return;
    const ctx = canvas.getContext('2d');
    const W = 600, H = 200;
    canvas.width = W;
    canvas.height = H;
    ctx.clearRect(0, 0, W, H);

    const pts = 50;
    const data = [];
    let v = selectedAsset.price;
    for (let i = 0; i < pts; i++) {
      v += (Math.random() - 0.48) * (selectedAsset.price * 0.02);
      data.push(v);
    }
    const mn = Math.min(...data) * 0.995;
    const mx = Math.max(...data) * 1.005;

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, 'rgba(0,245,255,.3)');
    grad.addColorStop(1, 'rgba(0,245,255,0)');

    ctx.beginPath();
    ctx.moveTo(0, H);
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      ctx.lineTo(x, y);
    });
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    data.forEach((d, i) => {
      const x = (i / (pts - 1)) * W;
      const y = H - ((d - mn) / (mx - mn)) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = '#00f5ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();
  };

  return (
    <div className="assets-page-wrapper">
      <div className="assets-page">
        <div className="ap-header">
          <div className="ap-title">Portfolio Assets</div>
          <div className="ap-header-actions">
            <button className="ap-action-btn" onClick={() => setShowTransactionHistory(true)} title="Transaction History">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
              </svg>
              History
            </button>
            <button className="ap-action-btn" onClick={handleExportCSV} title="Export to CSV">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z"/>
              </svg>
              CSV
            </button>
            <button className="ap-action-btn" onClick={handleExportPDF} title="Export to PDF">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z"/>
              </svg>
              PDF
            </button>
          </div>
          <div className="ap-total">
            <div className="ap-total-label">Total Portfolio Value</div>
            <div className="ap-total-val">{fmtP(totalValue())}</div>
            <div className={`ap-total-chg ${totalPL >= 0 ? 'up' : 'dn'}`}>
              {totalPL >= 0 ? '▲' : '▼'} {fmtP(Math.abs(totalPL))} ({(totalPL / totalValue() * 100).toFixed(2)}%)
            </div>
          </div>
        </div>

        <div className="ap-kpis">
          <div className="kpi-card">
            <div className="kpi-label">Total Assets</div>
            <div className="kpi-val">{assets.length}</div>
            <div className="kpi-sub">Across all categories</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Unrealized P&L</div>
            <div className={`kpi-val ${totalPL >= 0 ? 'up' : 'dn'}`}>{fmtP(totalPL)}</div>
            <div className="kpi-sub">24H change</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">In Staking</div>
            <div className="kpi-val">{fmtP(inStaking)}</div>
            <div className="kpi-sub">{assets.filter(a => a.staking).length} assets staked</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Available USDT</div>
            <div className="kpi-val">{fmtP(availUSDT)}</div>
            <div className="kpi-sub">Ready to trade</div>
          </div>
        </div>

        <div className="ap-main">
          <div className="ap-left">
            <div className="ap-section">
              <div className="ap-sec-title">Portfolio Allocation</div>
              <div className="donut-wrap">
                <canvas ref={donutRef} width="130" height="130"></canvas>
                <div className="donut-legend">
                  {assets.map((a, i) => (
                    <div key={a.sym} className="dl-item">
                      <div className="dl-dot" style={{ background: DONUT_COLORS[i] }}></div>
                      <div className="dl-sym">{a.sym}</div>
                      <div className="dl-pct">{((assetValue(a) / totalValue()) * 100).toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">Portfolio Performance (30D)</div>
              <div className="perf-chart-wrap">
                <canvas ref={perfChartRef}></canvas>
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">Exposure by Category</div>
              <div className="exposure-list">
                {buildExposure().map(e => (
                  <div key={e.cat} className="exp-item">
                    <div className="exp-cat">{e.cat}</div>
                    <div className="exp-bar">
                      <div className="exp-fill" style={{ width: `${e.pct}%` }}></div>
                    </div>
                    <div className="exp-val">{fmtP(e.val)}</div>
                    <div className="exp-pct">{e.pct.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="ap-section">
              <div className="ap-sec-title">24H Change Heatmap</div>
              <div className="heatmap">
                {buildHeatmap().map(h => (
                  <div 
                    key={h.sym} 
                    className={`hm-cell ${h.chg >= 0 ? 'up' : 'dn'}`}
                    style={{ 
                      opacity: 0.5 + Math.min(Math.abs(h.chg) / 10, 0.5),
                      flex: h.val / totalValue()
                    }}
                  >
                    <div className="hm-sym">{h.sym}</div>
                    <div className="hm-chg">{h.chg >= 0 ? '+' : ''}{h.chg.toFixed(2)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="ap-right">
            <div className="ap-section">
              <div className="ap-sec-title">Assets</div>
              <div className="assets-controls">
                <div className="ac-filters">
                  {['all', 'spot', 'earn', 'staking'].map(f => (
                    <button 
                      key={f}
                      className={`ac-filter ${currentFilter === f ? 'on' : ''}`}
                      onClick={() => setCurrentFilter(f)}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="ac-search">
                  <input 
                    type="text" 
                    placeholder="Search assets..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="ac-sort">
                  <select value={currentSort} onChange={(e) => setCurrentSort(e.target.value)}>
                    <option value="value">Sort by Value</option>
                    <option value="name">Sort by Name</option>
                    <option value="change">Sort by Change</option>
                  </select>
                </div>
              </div>

              <div className="assets-table">
                <div className="at-header">
                  <div className="ath-col">Asset</div>
                  <div className="ath-col">Price</div>
                  <div className="ath-col">24H</div>
                  <div className="ath-col">7D</div>
                  <div className="ath-col">Holdings</div>
                  <div className="ath-col">Value</div>
                  <div className="ath-col">Actions</div>
                </div>
                <div className="at-body">
                  {sortedAssets.map(a => {
                    const spark = genSpark();
                    return (
                      <div key={a.sym} className="at-row" onClick={() => handleAssetClick(a)} style={{ cursor: 'pointer' }}>
                        <div className="at-cell at-asset">
                          <div className="at-orb" style={{ background: a.bg }}>{a.icon}</div>
                          <div className="at-info">
                            <div className="at-sym">{a.sym}</div>
                            <div className="at-name">{a.name}</div>
                          </div>
                        </div>
                        <div className="at-cell at-price">
                          <div className="at-spark" dangerouslySetInnerHTML={{ __html: sparkSVG(spark, a.chg >= 0) }}></div>
                          <div className="at-pval">{fmtP(a.price)}</div>
                        </div>
                        <div className={`at-cell at-chg ${a.chg >= 0 ? 'up' : 'dn'}`}>
                          {a.chg >= 0 ? '▲' : '▼'} {Math.abs(a.chg).toFixed(2)}%
                        </div>
                        <div className={`at-cell at-chg ${a.chg7 >= 0 ? 'up' : 'dn'}`}>
                          {a.chg7 >= 0 ? '▲' : '▼'} {Math.abs(a.chg7).toFixed(2)}%
                        </div>
                        <div className="at-cell at-hold">
                          <div className="at-qty">{a.qty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {a.sym}</div>
                          {a.staking && <div className="at-badge">Staking {a.apy}% APY</div>}
                        </div>
                        <div className="at-cell at-val">{fmtP(assetValue(a))}</div>
                        <div className="at-cell at-actions" onClick={(e) => e.stopPropagation()}>
                          <button className="at-btn deposit" onClick={() => handleDeposit(a)}>Deposit</button>
                          <button className="at-btn withdraw" onClick={() => handleWithdraw(a)}>Withdraw</button>
                          <button className="at-btn trade" onClick={() => handleTrade(a)}>Trade</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ap-status">
          <div className="aps-feed">
            <div className="aps-item">● BTC +1.86% | ETH +2.34% | SOL -0.82%</div>
          </div>
          <div className="aps-time">{new Date().toLocaleTimeString()}</div>
        </div>

        {/* Asset Detail Modal */}
        {showDetailModal && selectedAsset && (
          <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
            <div className="modal-detail" onClick={(e) => e.stopPropagation()}>
              <div className="modal-detail-header">
                <div className="mdh-left">
                  <div className="mdh-orb" style={{ background: selectedAsset.bg }}>{selectedAsset.icon}</div>
                  <div className="mdh-info">
                    <div className="mdh-name">{selectedAsset.name}</div>
                    <div className="mdh-sym">{selectedAsset.sym}</div>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
              </div>

              <div className="modal-detail-price">
                <div className="mdp-current">{fmtP(selectedAsset.price)}</div>
                <div className={`mdp-change ${selectedAsset.chg >= 0 ? 'up' : 'dn'}`}>
                  {selectedAsset.chg >= 0 ? '▲' : '▼'} {Math.abs(selectedAsset.chg).toFixed(2)}% (24H)
                </div>
              </div>

              <div className="modal-detail-chart">
                <canvas ref={detailChartRef}></canvas>
              </div>

              <div className="modal-detail-stats">
                <div className="mds-item">
                  <div className="mds-label">Holdings</div>
                  <div className="mds-value">{selectedAsset.qty.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 4 })} {selectedAsset.sym}</div>
                </div>
                <div className="mds-item">
                  <div className="mds-label">Value</div>
                  <div className="mds-value">{fmtP(assetValue(selectedAsset))}</div>
                </div>
                <div className="mds-item">
                  <div className="mds-label">7D Change</div>
                  <div className={`mds-value ${selectedAsset.chg7 >= 0 ? 'up' : 'dn'}`}>
                    {selectedAsset.chg7 >= 0 ? '+' : ''}{selectedAsset.chg7.toFixed(2)}%
                  </div>
                </div>
                <div className="mds-item">
                  <div className="mds-label">Category</div>
                  <div className="mds-value">{selectedAsset.cat.charAt(0).toUpperCase() + selectedAsset.cat.slice(1)}</div>
                </div>
                {selectedAsset.staking && (
                  <div className="mds-item">
                    <div className="mds-label">APY</div>
                    <div className="mds-value" style={{ color: '#00ff88' }}>{selectedAsset.apy}%</div>
                  </div>
                )}
              </div>

              <div className="modal-detail-actions">
                <button className="mda-btn deposit" onClick={() => { handleDeposit(selectedAsset); setShowDetailModal(false); }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  Deposit
                </button>
                <button className="mda-btn withdraw" onClick={() => { handleWithdraw(selectedAsset); setShowDetailModal(false); }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 13H5v-2h14v2z"/>
                  </svg>
                  Withdraw
                </button>
                <button className="mda-btn trade" onClick={() => { handleTrade(selectedAsset); setShowDetailModal(false); }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.5 21H2V9h5.5v12zm7.25-18h-5.5v18h5.5V3zM22 11h-5.5v10H22V11z"/>
                  </svg>
                  Trade
                </button>
                <button className="mda-btn alert" onClick={() => { setShowPriceAlert(true); setShowDetailModal(false); }}>
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
                  </svg>
                  Set Alert
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History Modal */}
        {showTransactionHistory && (
          <div className="modal-overlay" onClick={() => setShowTransactionHistory(false)}>
            <div className="modal-history" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Transaction History</h3>
                <button className="modal-close" onClick={() => setShowTransactionHistory(false)}>×</button>
              </div>
              <div className="history-table">
                <div className="history-header">
                  <div>Date</div>
                  <div>Type</div>
                  <div>Asset</div>
                  <div>Amount</div>
                  <div>Price</div>
                  <div>Total</div>
                  <div>Status</div>
                </div>
                <div className="history-body">
                  {transactions.map(tx => (
                    <div key={tx.id} className="history-row">
                      <div className="history-cell">
                        <div>{tx.date}</div>
                        <div className="history-time">{tx.time}</div>
                      </div>
                      <div className="history-cell">
                        <span className={`history-type ${tx.type.toLowerCase()}`}>{tx.type}</span>
                      </div>
                      <div className="history-cell">{tx.asset}</div>
                      <div className="history-cell">{tx.amount.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</div>
                      <div className="history-cell">{fmtP(tx.price)}</div>
                      <div className="history-cell">{fmtP(tx.total)}</div>
                      <div className="history-cell">
                        <span className={`history-status ${tx.status.toLowerCase()}`}>{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Price Alert Modal */}
        {showPriceAlert && selectedAsset && (
          <div className="modal-overlay" onClick={() => setShowPriceAlert(false)}>
            <div className="modal-alert" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Set Price Alert for {selectedAsset.sym}</h3>
                <button className="modal-close" onClick={() => setShowPriceAlert(false)}>×</button>
              </div>
              <div className="alert-form">
                <div className="alert-current">
                  Current Price: <strong>{fmtP(selectedAsset.price)}</strong>
                </div>
                <div className="alert-type">
                  <label>
                    <input 
                      type="radio" 
                      value="above" 
                      checked={alertType === 'above'} 
                      onChange={(e) => setAlertType(e.target.value)}
                    />
                    Alert when price goes above
                  </label>
                  <label>
                    <input 
                      type="radio" 
                      value="below" 
                      checked={alertType === 'below'} 
                      onChange={(e) => setAlertType(e.target.value)}
                    />
                    Alert when price drops below
                  </label>
                </div>
                <div className="alert-input">
                  <label>Target Price</label>
                  <input 
                    type="number" 
                    placeholder="Enter price" 
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    step="0.01"
                  />
                </div>
                <button className="alert-submit" onClick={handleSetAlert}>Set Alert</button>
                
                {priceAlerts.filter(a => a.asset === selectedAsset.sym && a.active).length > 0 && (
                  <div className="alert-list">
                    <h4>Active Alerts</h4>
                    {priceAlerts.filter(a => a.asset === selectedAsset.sym && a.active).map(alert => (
                      <div key={alert.id} className="alert-item">
                        <span>{alert.type === 'above' ? '↑' : '↓'} {fmtP(alert.targetPrice)}</span>
                        <button onClick={() => setPriceAlerts(priceAlerts.filter(a => a.id !== alert.id))}>×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assets;
