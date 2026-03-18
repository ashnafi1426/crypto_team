import { useState } from 'react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DepositForm } from '../components/deposit/DepositForm';
import { useNotifications } from '../context/NotificationContext';
import '../styles/components/wallet.css';
import '../styles/components/wallet-additions.css';
import '../styles/components/deposit.css';
import '../styles/components/withdraw.css';

function Wallet() {
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState('deposit');
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAddress, setWithdrawAddress] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('Bitcoin');
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState('fiat');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [withdrawalHistory, setWithdrawalHistory] = useState([
    { id: 1, date: '2024-03-10', method: 'Bank Transfer', amount: 500, currency: 'USD', status: 'Completed', txId: 'WD-2024-001' },
    { id: 2, date: '2024-03-08', method: 'PayPal', amount: 250, currency: 'USD', status: 'Pending', txId: 'WD-2024-002' },
    { id: 3, date: '2024-03-05', method: 'Credit Card', amount: 1000, currency: 'USD', status: 'Completed', txId: 'WD-2024-003' },
  ]);
  
  // Crypto withdrawal history
  const [cryptoWithdrawalHistory, setCryptoWithdrawalHistory] = useState([
    { id: 1, date: '2024-03-11', coin: 'BTC', amount: 0.05, network: 'Bitcoin', address: '1A1zP1...DivfNa', status: 'Completed', txHash: '0x1a2b3c4d5e6f...' },
    { id: 2, date: '2024-03-09', coin: 'ETH', amount: 0.8, network: 'Ethereum', address: '0x742d35...0bEb', status: 'Pending', txHash: '0x7g8h9i0j1k2l...' },
  ]);

  // Swap states
  const [swapFromCoin, setSwapFromCoin] = useState('BTC');
  const [swapToCoin, setSwapToCoin] = useState('ETH');
  const [swapAmount, setSwapAmount] = useState('');
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [showSwapConfirmation, setShowSwapConfirmation] = useState(false);
  const [swapHistory, setSwapHistory] = useState([
    { id: 1, date: '2024-03-12', fromCoin: 'BTC', fromAmount: 0.1, toCoin: 'ETH', toAmount: 2.0, rate: 20, status: 'Completed', txHash: '0xabc123...' },
    { id: 2, date: '2024-03-10', fromCoin: 'USDT', fromAmount: 1000, toCoin: 'BTC', toAmount: 0.0167, rate: 60000, status: 'Completed', txHash: '0xdef456...' },
  ]);
  
  // Transfer states
  const [transferRecipient, setTransferRecipient] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [showTransferSummary, setShowTransferSummary] = useState(false);
  
  // Currency toggle
  const [currency, setCurrency] = useState('USD');
  
  // History filters
  const [historyType, setHistoryType] = useState('all');
  const [historyStatus, setHistoryStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  
  // Price alerts
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertCoin, setAlertCoin] = useState('BTC');
  const [alertPrice, setAlertPrice] = useState('');
  const [alertType, setAlertType] = useState('above');
  
  // Recurring deposits
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [recurringAmount, setRecurringAmount] = useState('');
  const [recurringFrequency, setRecurringFrequency] = useState('weekly');
  const [recurringCoin, setRecurringCoin] = useState('BTC');

  const walletData = [
    { asset: 'Bitcoin', symbol: 'BTC', balance: 0.12, price: 60000, icon: '₿', color: '#f7931a' },
    { asset: 'Ethereum', symbol: 'ETH', balance: 1.5, price: 3000, icon: 'Ξ', color: '#627eea' },
    { asset: 'Tether', symbol: 'USDT', balance: 840, price: 1, icon: '₮', color: '#26a17b' },
    { asset: 'Solana', symbol: 'SOL', balance: 5.2, price: 145, icon: '◎', color: '#9945ff' },
    { asset: 'Cardano', symbol: 'ADA', balance: 1200, price: 0.45, icon: '₳', color: '#0033ad' },
    { asset: 'Polygon', symbol: 'MATIC', balance: 350, price: 0.89, icon: '⬡', color: '#8247e5' },
  ];

  // Crypto options for withdraw
  const cryptoWithdrawOptions = [
    { 
      symbol: 'BTC', 
      name: 'Bitcoin',
      networks: ['Bitcoin', 'Lightning Network'],
      fees: { 'Bitcoin': 0.0002, 'Lightning Network': 0.00001 },
      minWithdraw: 0.001,
      confirmations: 3,
      arrivalTime: '30-60 min'
    },
    { 
      symbol: 'ETH', 
      name: 'Ethereum',
      networks: ['Ethereum', 'Arbitrum', 'Optimism'],
      fees: { 'Ethereum': 0.003, 'Arbitrum': 0.0001, 'Optimism': 0.0001 },
      minWithdraw: 0.01,
      confirmations: 12,
      arrivalTime: '5-15 min'
    },
    { 
      symbol: 'USDT', 
      name: 'Tether',
      networks: ['Ethereum (ERC20)', 'Tron (TRC20)', 'BSC (BEP20)'],
      fees: { 'Ethereum (ERC20)': 5, 'Tron (TRC20)': 1, 'BSC (BEP20)': 0.8 },
      minWithdraw: 10,
      confirmations: 12,
      arrivalTime: '5-15 min'
    },
    { 
      symbol: 'USDC', 
      name: 'USD Coin',
      networks: ['Ethereum (ERC20)', 'Solana', 'Polygon'],
      fees: { 'Ethereum (ERC20)': 5, 'Solana': 0.01, 'Polygon': 0.1 },
      minWithdraw: 10,
      confirmations: 12,
      arrivalTime: '5-15 min'
    },
    { 
      symbol: 'BNB', 
      name: 'Binance Coin',
      networks: ['BSC'],
      fees: { 'BSC': 0.0005 },
      minWithdraw: 0.01,
      confirmations: 15,
      arrivalTime: '3-10 min'
    },
    { 
      symbol: 'SOL', 
      name: 'Solana',
      networks: ['Solana'],
      fees: { 'Solana': 0.01 },
      minWithdraw: 0.1,
      confirmations: 32,
      arrivalTime: '1-3 min'
    },
    { 
      symbol: 'XRP', 
      name: 'Ripple',
      networks: ['XRP Ledger'],
      fees: { 'XRP Ledger': 0.25 },
      minWithdraw: 10,
      confirmations: 1,
      arrivalTime: '1-5 min'
    },
    { 
      symbol: 'ADA', 
      name: 'Cardano',
      networks: ['Cardano'],
      fees: { 'Cardano': 1 },
      minWithdraw: 10,
      confirmations: 15,
      arrivalTime: '5-10 min'
    },
    { 
      symbol: 'DOGE', 
      name: 'Dogecoin',
      networks: ['Dogecoin'],
      fees: { 'Dogecoin': 5 },
      minWithdraw: 50,
      confirmations: 6,
      arrivalTime: '10-20 min'
    },
    { 
      symbol: 'MATIC', 
      name: 'Polygon',
      networks: ['Polygon', 'Ethereum (ERC20)'],
      fees: { 'Polygon': 0.1, 'Ethereum (ERC20)': 5 },
      minWithdraw: 10,
      confirmations: 128,
      arrivalTime: '2-5 min'
    },
    { 
      symbol: 'DOT', 
      name: 'Polkadot',
      networks: ['Polkadot'],
      fees: { 'Polkadot': 0.1 },
      minWithdraw: 1,
      confirmations: 10,
      arrivalTime: '5-15 min'
    },
    { 
      symbol: 'AVAX', 
      name: 'Avalanche',
      networks: ['Avalanche C-Chain'],
      fees: { 'Avalanche C-Chain': 0.01 },
      minWithdraw: 0.1,
      confirmations: 1,
      arrivalTime: '1-3 min'
    },
    { 
      symbol: 'SHIB', 
      name: 'Shiba Inu',
      networks: ['Ethereum (ERC20)'],
      fees: { 'Ethereum (ERC20)': 500000 },
      minWithdraw: 1000000,
      confirmations: 12,
      arrivalTime: '5-15 min'
    },
    { 
      symbol: 'LTC', 
      name: 'Litecoin',
      networks: ['Litecoin'],
      fees: { 'Litecoin': 0.001 },
      minWithdraw: 0.01,
      confirmations: 6,
      arrivalTime: '15-30 min'
    },
    { 
      symbol: 'TRX', 
      name: 'TRON',
      networks: ['TRON'],
      fees: { 'TRON': 1 },
      minWithdraw: 100,
      confirmations: 19,
      arrivalTime: '3-5 min'
    }
  ];

  // Saved addresses (mock data)
  const savedAddresses = [
    { id: 1, label: 'My Ledger Wallet', address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', coin: 'BTC' },
    { id: 2, label: 'Exchange Account', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb', coin: 'ETH' },
    { id: 3, label: 'Cold Storage', address: 'TXYZopQRSTUVWXYZabcdefghijklmn', coin: 'USDT' },
  ];

  // Recent withdrawals (mock data)
  const recentWithdrawals = [
    { date: '2024-03-11', coin: 'BTC', amount: '0.05', status: 'Completed', txHash: '0x1a2b3c...' },
    { date: '2024-03-09', coin: 'ETH', amount: '0.8', status: 'Completed', txHash: '0x4d5e6f...' },
    { date: '2024-03-07', coin: 'USDT', amount: '500', status: 'Pending', txHash: '0x7g8h9i...' },
  ];

  // Payment methods for fiat withdrawal
  const paymentMethods = [
    {
      id: 'bank',
      icon: '🏦',
      name: 'Bank Transfer',
      description: 'Withdraw to your bank account',
      fee: 0,
      feeText: '0% Fee',
      minAmount: 50,
      maxAmount: 50000,
      processingTime: '1-3 business days'
    },
    {
      id: 'card',
      icon: '💳',
      name: 'Credit / Debit Card',
      description: 'Withdraw to your debit or credit card',
      fee: 1.5,
      feeText: '1.5% Fee',
      minAmount: 20,
      maxAmount: 10000,
      processingTime: '1-2 business days'
    },
    {
      id: 'paypal',
      icon: '💰',
      name: 'PayPal',
      description: 'Withdraw to your PayPal',
      fee: 1,
      feeText: '1% Fee',
      minAmount: 10,
      maxAmount: 25000,
      processingTime: 'Instant - 24 hours'
    },
    {
      id: 'ewallet',
      icon: '👛',
      name: 'E-Wallets',
      description: 'Use Skrill, Neteller & more',
      fee: 2,
      feeText: '2.0% Fee',
      minAmount: 10,
      maxAmount: 15000,
      processingTime: 'Instant - 24 hours'
    }
  ];

  const transactions = [
    { date: '2024-03-12', time: '14:30', type: 'Deposit', asset: 'BTC', amount: '0.02', status: 'Completed', color: '#10b981', txHash: '0x1a2b3c...' },
    { date: '2024-03-11', time: '09:15', type: 'Withdraw', asset: 'USDT', amount: '200', status: 'Pending', color: '#f59e0b', txHash: '0x4d5e6f...' },
    { date: '2024-03-10', time: '16:45', type: 'Deposit', asset: 'ETH', amount: '0.5', status: 'Completed', color: '#10b981', txHash: '0x7g8h9i...' },
    { date: '2024-03-09', time: '11:20', type: 'Withdraw', asset: 'BTC', amount: '0.01', status: 'Completed', color: '#10b981', txHash: '0xj1k2l3...' },
    { date: '2024-03-08', time: '13:00', type: 'Deposit', asset: 'USDT', amount: '500', status: 'Completed', color: '#10b981', txHash: '0xm4n5o6...' },
    { date: '2024-03-07', time: '10:30', type: 'Transfer', asset: 'SOL', amount: '2.5', status: 'Completed', color: '#00ffe0', txHash: '0xp7q8r9...' },
    { date: '2024-03-06', time: '15:45', type: 'Deposit', asset: 'ADA', amount: '500', status: 'Completed', color: '#10b981', txHash: '0xs1t2u3...' },
    { date: '2024-03-05', time: '08:20', type: 'Withdraw', asset: 'ETH', amount: '0.3', status: 'Failed', color: '#ef4444', txHash: '0xv4w5x6...' },
  ];

  const priceAlerts = [
    { id: 1, coin: 'BTC', targetPrice: 65000, type: 'above', active: true },
    { id: 2, coin: 'ETH', targetPrice: 2800, type: 'below', active: true },
    { id: 3, coin: 'SOL', targetPrice: 150, type: 'above', active: false },
  ];

  const recurringDeposits = [
    { id: 1, coin: 'BTC', amount: 100, frequency: 'weekly', nextDate: '2024-03-19', active: true },
    { id: 2, coin: 'ETH', amount: 50, frequency: 'monthly', nextDate: '2024-04-01', active: true },
  ];

  // Portfolio history data for chart (last 30 days)
  const portfolioHistory = [
    { date: 'Feb 12', value: 8500 },
    { date: 'Feb 15', value: 8800 },
    { date: 'Feb 18', value: 9200 },
    { date: 'Feb 21', value: 9000 },
    { date: 'Feb 24', value: 9500 },
    { date: 'Feb 27', value: 10200 },
    { date: 'Mar 01', value: 10800 },
    { date: 'Mar 04', value: 11200 },
    { date: 'Mar 07', value: 11500 },
    { date: 'Mar 10', value: 12100 },
    { date: 'Mar 12', value: 12340 },
  ];

  // Prepare pie chart data
  const pieChartData = walletData.map(item => ({
    name: item.symbol,
    value: parseFloat((item.balance * item.price).toFixed(2)),
    color: item.color
  }));

  const currencyRates = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  };

  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£'
  };

  const totalBalance = walletData.reduce((sum, item) => sum + (item.balance * item.price), 0);
  const convertedBalance = totalBalance * currencyRates[currency];

  const filteredWallets = walletData
    .filter(item => {
      const matchesSearch = item.asset.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const meetsMinBalance = !hideSmallBalances || (item.balance * item.price) >= 10;
      return matchesSearch && meetsMinBalance;
    })
    .sort((a, b) => (b.balance * b.price) - (a.balance * a.price));

  const filteredTransactions = transactions.filter(tx => {
    const matchesType = historyType === 'all' || tx.type.toLowerCase() === historyType.toLowerCase();
    const matchesStatus = historyStatus === 'all' || tx.status.toLowerCase() === historyStatus.toLowerCase();
    
    let matchesDate = true;
    if (dateRange !== 'all') {
      const txDate = new Date(tx.date);
      const now = new Date();
      const daysDiff = Math.floor((now - txDate) / (1000 * 60 * 60 * 24));
      
      if (dateRange === '7days') matchesDate = daysDiff <= 7;
      else if (dateRange === '30days') matchesDate = daysDiff <= 30;
      else if (dateRange === '90days') matchesDate = daysDiff <= 90;
    }
    
    return matchesType && matchesStatus && matchesDate;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    navigator.clipboard.writeText(text);
    addNotification('success', 'Copied to clipboard!');
  };

  const handleTransfer = () => {
    if (!transferRecipient || !transferAmount) {
      alert('Please fill in all required fields');
      return;
    }
    setShowTransferSummary(true);
  };

  const confirmTransfer = () => {
    alert('Transfer successful! The recipient will receive the funds instantly.');
    setTransferRecipient('');
    setTransferAmount('');
    setTransferNote('');
    setShowTransferSummary(false);
  };

  const setMaxTransferAmount = () => {
    const selectedWallet = walletData.find(w => w.symbol === selectedCoin);
    if (selectedWallet) {
      setTransferAmount(selectedWallet.balance.toString());
    }
  };

  const handlePriceAlert = () => {
    if (!alertPrice) {
      alert('Please enter a target price');
      return;
    }
    alert(`Price alert set! You'll be notified when ${alertCoin} ${alertType === 'above' ? 'goes above' : 'drops below'} ${currencySymbols[currency]}${alertPrice}`);
    setShowAlertModal(false);
    setAlertPrice('');
  };

  const handleRecurringDeposit = () => {
    if (!recurringAmount) {
      alert('Please enter an amount');
      return;
    }
    alert(`Recurring deposit scheduled! ${currencySymbols[currency]}${recurringAmount} of ${recurringCoin} will be deposited ${recurringFrequency}.`);
    setShowRecurringModal(false);
    setRecurringAmount('');
  };

  const formatCurrency = (amount) => {
    return `${currencySymbols[currency]}${(amount * currencyRates[currency]).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Fiat Withdrawal Functions
  const handleQuickAmount = (multiplier) => {
    const baseAmount = 100;
    const amount = baseAmount * multiplier;
    setWithdrawAmount(amount.toString());
  };

  const handleMaxWithdrawFiat = () => {
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);
    if (selectedMethod) {
      // Use the lesser of total balance or max withdrawal limit
      const maxAmount = Math.min(totalBalance, selectedMethod.maxAmount);
      setWithdrawAmount(maxAmount.toString());
    }
  };

  const handleFiatWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const selectedMethod = paymentMethods.find(m => m.id === selectedPaymentMethod);

    // Validation
    if (!withdrawAmount || isNaN(amount) || amount <= 0) {
      addNotification('error', 'Please enter a valid amount');
      return;
    }

    if (!selectedMethod) {
      addNotification('error', 'Please select a withdrawal method');
      return;
    }

    if (amount < selectedMethod.minAmount) {
      addNotification('error', `Minimum withdrawal: $${selectedMethod.minAmount}`);
      return;
    }

    if (amount > selectedMethod.maxAmount) {
      addNotification('error', `Maximum withdrawal: $${selectedMethod.maxAmount}`);
      return;
    }

    const fee = (amount * selectedMethod.fee) / 100;
    const totalWithFee = amount + fee;

    if (totalWithFee > totalBalance) {
      addNotification('error', `Insufficient balance. Available: $${totalBalance.toFixed(2)}`);
      return;
    }

    // Process withdrawal
    addNotification('info', 'Processing withdrawal...');
    
    setTimeout(() => {
      // Add to withdrawal history
      const newWithdrawal = {
        id: withdrawalHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        method: selectedMethod.name,
        amount: amount,
        currency: selectedCurrency,
        status: 'Pending',
        txId: `WD-2024-${String(withdrawalHistory.length + 4).padStart(3, '0')}`
      };
      
      setWithdrawalHistory([newWithdrawal, ...withdrawalHistory]);
      
      addNotification('success', `Withdrawal of $${amount.toFixed(2)} submitted successfully!`);
      setWithdrawAmount('');
    }, 1500);
  };

  // Crypto Withdrawal Functions
  const handleCoinChange = (coin) => {
    setSelectedCoin(coin);
    const cryptoData = cryptoWithdrawOptions.find(c => c.symbol === coin);
    if (cryptoData && cryptoData.networks.length > 0) {
      setSelectedNetwork(cryptoData.networks[0]);
    }
    setWithdrawAmount('');
    setWithdrawAddress('');
  };

  const handleMaxWithdrawCrypto = () => {
    const currentWallet = walletData.find(w => w.symbol === selectedCoin);
    const selectedCryptoData = cryptoWithdrawOptions.find(c => c.symbol === selectedCoin);
    
    if (!currentWallet || !selectedCryptoData) return;
    
    const networkFee = selectedCryptoData.fees[selectedNetwork] || 0;
    const maxAmount = Math.max(0, currentWallet.balance - networkFee);
    setWithdrawAmount(maxAmount.toString());
  };

  // Validate crypto address (basic validation)
  const validateAddress = (address, coin) => {
    if (!address || address.length < 26) return false;
    
    // Basic validation patterns
    const patterns = {
      BTC: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
      ETH: /^0x[a-fA-F0-9]{40}$/,
      USDT: /^(0x[a-fA-F0-9]{40}|T[A-Za-z1-9]{33})$/,
      USDC: /^(0x[a-fA-F0-9]{40}|[A-Za-z0-9]{32,44})$/,
      SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
      ADA: /^addr1[a-z0-9]{58}$/,
      MATIC: /^0x[a-fA-F0-9]{40}$/,
    };
    
    const pattern = patterns[coin];
    return pattern ? pattern.test(address) : address.length >= 26;
  };

  const handleCryptoWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    const selectedCryptoData = cryptoWithdrawOptions.find(c => c.symbol === selectedCoin);
    const currentWallet = walletData.find(w => w.symbol === selectedCoin);

    // Validation
    if (!withdrawAddress || !withdrawAmount) {
      addNotification('error', 'Please fill in all fields');
      return;
    }

    if (!validateAddress(withdrawAddress, selectedCoin)) {
      addNotification('error', `Invalid ${selectedCoin} address format`);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      addNotification('error', 'Please enter a valid amount');
      return;
    }

    if (!selectedCryptoData) {
      addNotification('error', 'Please select a cryptocurrency');
      return;
    }

    if (amount < selectedCryptoData.minWithdraw) {
      addNotification('error', `Minimum withdrawal: ${selectedCryptoData.minWithdraw} ${selectedCoin}`);
      return;
    }

    if (!currentWallet) {
      addNotification('error', 'Wallet not found');
      return;
    }

    const networkFee = selectedCryptoData.fees[selectedNetwork] || 0;

    if (amount + networkFee > currentWallet.balance) {
      addNotification('error', `Insufficient balance. Available: ${currentWallet.balance} ${selectedCoin}`);
      return;
    }

    // Show confirmation
    setShowWithdrawConfirmation(true);
  };

  const confirmCryptoWithdrawal = () => {
    addNotification('info', 'Processing withdrawal...');
    
    setTimeout(() => {
      const newWithdrawal = {
        id: cryptoWithdrawalHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        coin: selectedCoin,
        amount: parseFloat(withdrawAmount),
        network: selectedNetwork,
        address: withdrawAddress.substring(0, 10) + '...' + withdrawAddress.substring(withdrawAddress.length - 6),
        status: 'Pending',
        txHash: `0x${Math.random().toString(16).substring(2, 15)}...`
      };
      
      setCryptoWithdrawalHistory([newWithdrawal, ...cryptoWithdrawalHistory]);
      
      addNotification('success', `Withdrawal of ${withdrawAmount} ${selectedCoin} submitted! Check your email for verification.`);
      setWithdrawAddress('');
      setWithdrawAmount('');
      setShowWithdrawConfirmation(false);
    }, 1500);
  };

  // Swap Functions
  const getExchangeRate = (fromCoin, toCoin) => {
    const fromWallet = walletData.find(w => w.symbol === fromCoin);
    const toWallet = walletData.find(w => w.symbol === toCoin);
    
    if (!fromWallet || !toWallet) return 0;
    
    return fromWallet.price / toWallet.price;
  };

  const calculateSwapReceive = () => {
    if (!swapAmount || parseFloat(swapAmount) <= 0) return 0;
    
    const rate = getExchangeRate(swapFromCoin, swapToCoin);
    const amount = parseFloat(swapAmount);
    const fee = amount * 0.005; // 0.5% fee
    const amountAfterFee = amount - fee;
    
    return (amountAfterFee * rate).toFixed(6);
  };

  const handleSwapCoins = () => {
    // Reverse the swap direction
    const tempFrom = swapFromCoin;
    setSwapFromCoin(swapToCoin);
    setSwapToCoin(tempFrom);
    setSwapAmount('');
  };

  const handleMaxSwap = () => {
    const fromWallet = walletData.find(w => w.symbol === swapFromCoin);
    if (fromWallet) {
      setSwapAmount(fromWallet.balance.toString());
    }
  };

  const handleSwap = () => {
    const amount = parseFloat(swapAmount);
    const fromWallet = walletData.find(w => w.symbol === swapFromCoin);

    // Validation
    if (!swapAmount || isNaN(amount) || amount <= 0) {
      addNotification('error', 'Please enter a valid amount');
      return;
    }

    if (swapFromCoin === swapToCoin) {
      addNotification('error', 'Cannot swap same cryptocurrency');
      return;
    }

    if (!fromWallet) {
      addNotification('error', 'Wallet not found');
      return;
    }

    if (amount > fromWallet.balance) {
      addNotification('error', `Insufficient balance. Available: ${fromWallet.balance} ${swapFromCoin}`);
      return;
    }

    // Show confirmation
    setShowSwapConfirmation(true);
  };

  const confirmSwap = () => {
    addNotification('info', 'Processing swap...');
    
    setTimeout(() => {
      const rate = getExchangeRate(swapFromCoin, swapToCoin);
      const receiveAmount = parseFloat(calculateSwapReceive());
      
      const newSwap = {
        id: swapHistory.length + 1,
        date: new Date().toISOString().split('T')[0],
        fromCoin: swapFromCoin,
        fromAmount: parseFloat(swapAmount),
        toCoin: swapToCoin,
        toAmount: receiveAmount,
        rate: rate,
        status: 'Completed',
        txHash: `0x${Math.random().toString(16).substring(2, 15)}...`
      };
      
      setSwapHistory([newSwap, ...swapHistory]);
      
      addNotification('success', `Successfully swapped ${swapAmount} ${swapFromCoin} to ${receiveAmount.toFixed(6)} ${swapToCoin}!`);
      setSwapAmount('');
      setShowSwapConfirmation(false);
    }, 1500);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  // Custom pie chart label
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show label if less than 5%

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="600"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="main-content">
      <div className="wallet-page">
        <div className="deposit-header">
          <h1 className="page-title">Wallet</h1>
          <p className="page-subtitle">Manage your crypto assets and transactions</p>
        </div>

      {/* Tabs */}
      <div className="wallet-tabs">
        <button 
          className={`wallet-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'deposit' ? 'active' : ''}`}
          onClick={() => setActiveTab('deposit')}
        >
          Deposit
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'withdraw' ? 'active' : ''}`}
          onClick={() => setActiveTab('withdraw')}
        >
          Withdraw
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'swap' ? 'active' : ''}`}
          onClick={() => setActiveTab('swap')}
        >
          Swap
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'transfer' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfer')}
        >
          Transfer
        </button>
        <button 
          className={`wallet-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="wallet-content">
          {/* Total Balance */}
          <div className="balance-card">
            <div className="balance-label">Total Balance</div>
            <div className="balance-amount">{formatCurrency(totalBalance)}</div>
            <div className="balance-change positive">+2.45% (24h)</div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <button className="action-btn alert-btn" onClick={() => setShowAlertModal(true)}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"/>
              </svg>
              Price Alerts
            </button>
            <button className="action-btn recurring-btn" onClick={() => setShowRecurringModal(true)}>
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
              </svg>
              Recurring Deposits
            </button>
          </div>

          {/* Portfolio Chart */}
          <div className="portfolio-chart-section">
            <h3>Portfolio Value (30 Days)</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={portfolioHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3a6ff7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3a6ff7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(58, 111, 247, 0.1)" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#b0b8d4" 
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#b0b8d4" 
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `${currencySymbols[currency]}${(value * currencyRates[currency] / 1000).toFixed(1)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3a6ff7" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Asset Allocation Pie Chart */}
          <div className="allocation-section">
            <h3>Asset Allocation</h3>
            <div className="allocation-container">
              <div className="pie-chart-wrapper">
                <ResponsiveContainer width={220} height={220}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      contentStyle={{
                        background: 'rgba(15, 15, 30, 0.95)',
                        border: '1px solid rgba(58, 111, 247, 0.3)',
                        borderRadius: '8px',
                        color: '#ffffff'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="allocation-legend">
                {walletData.map((item, index) => {
                  const percentage = ((item.balance * item.price) / totalBalance) * 100;
                  return (
                    <div key={index} className="legend-item">
                      <span className="legend-color" style={{ background: item.color }}></span>
                      <span className="legend-label">{item.symbol}</span>
                      <span className="legend-value">{percentage.toFixed(1)}%</span>
                      <span className="legend-amount">{formatCurrency(item.balance * item.price)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="wallet-filters">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Search assets..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={hideSmallBalances}
                onChange={(e) => setHideSmallBalances(e.target.checked)}
              />
              Hide small balances
            </label>
          </div>

          {/* Assets Table */}
          <div className="assets-table">
            <div className="table-header">
              <div>Asset</div>
              <div>Balance</div>
              <div>Value</div>
              <div>Actions</div>
            </div>
            {filteredWallets.map((item, index) => (
              <div key={index} className="wallet-row">
                {/* Asset Column */}
                <div className="asset">
                  <span className="coin-icon" style={{ color: item.color }}>{item.icon}</span>
                  <div className="coin-text">
                    <div className="coin-name">{item.asset}</div>
                    <div className="coin-symbol">{item.symbol}</div>
                  </div>
                </div>
                
                {/* Balance Column */}
                <div className="balance">
                  <div className="balance-amount">{item.balance} {item.symbol}</div>
                  <div className="balance-price">${item.price.toLocaleString()}</div>
                </div>
                
                {/* Value Column */}
                <div className="value">
                  ${(item.balance * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                
                {/* Actions Column */}
                <div className="actions">
                  <button className="deposit" onClick={() => { setSelectedCoin(item.symbol); setActiveTab('deposit'); }}>Deposit</button>
                  <button className="withdraw" onClick={() => { setSelectedCoin(item.symbol); setActiveTab('withdraw'); }}>Withdraw</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposit Tab */}
      {activeTab === 'deposit' && (
        <div className="wallet-content">
          <DepositForm />
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="wallet-content">
          <div className="withdraw-page-container">
            <h2 className="withdraw-page-title">Withdraw</h2>
            <p className="withdraw-page-subtitle">
              Withdraw cryptocurrency to your external wallet.
            </p>

            {true && (
              <>
                <div className="crypto-withdraw-section">
                  <label className="withdraw-section-label">Select Cryptocurrency</label>
                  <div className="crypto-grid-withdraw">
                    {cryptoWithdrawOptions.slice(0, 6).map(crypto => {
                      const wallet = walletData.find(w => w.symbol === crypto.symbol);
                      return (
                        <div 
                          key={crypto.symbol}
                          className={`crypto-card-withdraw ${selectedCoin === crypto.symbol ? 'selected' : ''}`}
                          onClick={() => handleCoinChange(crypto.symbol)}
                        >
                          <div className="crypto-icon-withdraw">{wallet?.icon || crypto.symbol[0]}</div>
                          <div className="crypto-name-withdraw">{crypto.name}</div>
                          <div className="crypto-symbol-withdraw">{crypto.symbol}</div>
                          <div className="crypto-balance-withdraw">
                            {wallet ? wallet.balance.toFixed(4) : '0.0000'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="network-section-withdraw">
                  <label className="withdraw-section-label">Select Network</label>
                  <select 
                    className="network-select-withdraw"
                    value={selectedNetwork}
                    onChange={(e) => setSelectedNetwork(e.target.value)}
                  >
                    {cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.networks.map(network => (
                      <option key={network} value={network}>{network}</option>
                    ))}
                  </select>
                  <div className="network-info-withdraw">
                    <span>⚠️ Network Fee: {cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.fees[selectedNetwork]} {selectedCoin}</span>
                  </div>
                </div>

                <div className="address-section-withdraw">
                  <label className="withdraw-section-label">Withdrawal Address</label>
                  <input 
                    type="text"
                    className="address-input-withdraw"
                    placeholder={`Enter ${selectedCoin} address`}
                    value={withdrawAddress}
                    onChange={(e) => setWithdrawAddress(e.target.value)}
                  />
                  <div className="address-warning-withdraw">
                    ⚠️ Please ensure the address is correct. Withdrawals cannot be reversed.
                  </div>
                </div>

                <div className="withdraw-amount-section">
                  <label className="withdraw-section-label">Withdrawal Amount</label>
                  <div className="amount-input-group-withdraw">
                    <input 
                      type="number"
                      className="amount-input-crypto-withdraw"
                      placeholder="0.00"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      step="0.0001"
                    />
                    <span className="currency-label-crypto">{selectedCoin}</span>
                    <button className="max-btn-withdraw" onClick={handleMaxWithdrawCrypto}>MAX</button>
                  </div>
                  
                  {withdrawAmount && parseFloat(withdrawAmount) > 0 && (
                    <>
                      <div className="fee-info-withdraw">
                        Network Fee: {cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.fees[selectedNetwork]} {selectedCoin}
                      </div>
                      <div className="total-receive-withdraw">
                        You will receive: <strong>{(parseFloat(withdrawAmount) - (cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.fees[selectedNetwork] || 0)).toFixed(4)} {selectedCoin}</strong>
                      </div>
                      <div className="estimated-arrival-withdraw">
                        ⏱️ Estimated Arrival: {cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.arrivalTime}
                      </div>
                    </>
                  )}
                </div>

                <div className="security-notices-withdraw">
                  <div className="security-notice-item-withdraw">
                    <span className="notice-icon-withdraw">🛡️</span>
                    <span className="notice-text-withdraw">
                      Two-Factor Authentication (2FA) is <strong>required</strong> to process withdrawals
                    </span>
                  </div>
                  <div className="security-notice-item-withdraw">
                    <span className="notice-icon-withdraw">📧</span>
                    <span className="notice-text-withdraw">
                      You will receive a confirmation email to complete your withdrawal request.
                    </span>
                  </div>
                </div>

                <button 
                  className="withdraw-submit-btn-main" 
                  onClick={handleCryptoWithdraw}
                  disabled={!withdrawAmount || !withdrawAddress || parseFloat(withdrawAmount) <= 0}
                >
                  Withdraw {withdrawAmount || '0'} {selectedCoin}
                </button>
              </>
            )}

            <div className="withdrawal-history-section-main">
              <h2 className="history-title-withdraw">Withdrawal History</h2>
              <div className="history-table-withdraw">
                <div className="history-header-withdraw">
                  <div>Date</div>
                  <div>Coin</div>
                  <div>Amount</div>
                  <div>Network</div>
                  <div>Status</div>
                  <div>TX Hash</div>
                </div>
                {cryptoWithdrawalHistory.length > 0 ? (
                  cryptoWithdrawalHistory.map(withdrawal => (
                    <div key={withdrawal.id} className="history-row-withdraw">
                      <div className="history-cell-withdraw">{withdrawal.date}</div>
                      <div className="history-cell-withdraw">{withdrawal.coin}</div>
                      <div className="history-cell-withdraw">{withdrawal.amount} {withdrawal.coin}</div>
                      <div className="history-cell-withdraw">{withdrawal.network}</div>
                      <div className="history-cell-withdraw">
                        <span className={`status-badge-withdraw ${withdrawal.status.toLowerCase()}`}>
                          {withdrawal.status}
                        </span>
                      </div>
                      <div className="history-cell-withdraw tx-id-cell">
                        {withdrawal.txHash}
                        <button 
                          className="copy-tx-btn" 
                          onClick={() => copyToClipboard(withdrawal.txHash)}
                          title="Copy TX Hash"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="history-empty-withdraw">No recent withdrawal history</div>
                )}
              </div>
            </div>

            <div className="help-section-withdraw">
              <h3 className="help-title-withdraw">Need Help?</h3>
              <p className="help-text-withdraw">
                Visit our <a href="#" className="help-link-withdraw">Help Center</a> or contact our support team if you need assistance with withdrawals.
              </p>
              <button className="contact-support-btn-withdraw" onClick={() => addNotification('info', 'Opening support chat...')}>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Swap Tab */}
      {activeTab === 'swap' && (
        <div className="wallet-content">
          <div className="swap-section">
            <h2 className="swap-title">Swap Crypto</h2>
            <p className="swap-subtitle">Exchange one cryptocurrency for another instantly</p>

            <div className="swap-container">
              {/* From Section */}
              <div className="swap-from-section">
                <label className="swap-label">From</label>
                <div className="swap-input-group">
                  <select 
                    className="swap-coin-select"
                    value={swapFromCoin}
                    onChange={(e) => {
                      console.log('From coin changed:', e.target.value);
                      setSwapFromCoin(e.target.value);
                    }}
                  >
                    {walletData.map(coin => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.icon} {coin.symbol} - {coin.asset}
                      </option>
                    ))}
                  </select>
                  <div className="swap-amount-input-wrapper">
                    <input 
                      type="number"
                      className="swap-amount-input"
                      placeholder="0.00"
                      value={swapAmount}
                      onChange={(e) => {
                        console.log('Amount changed:', e.target.value);
                        setSwapAmount(e.target.value);
                      }}
                      step="0.0001"
                      min="0"
                    />
                    <button 
                      className="swap-max-btn" 
                      onClick={(e) => {
                        e.preventDefault();
                        console.log('MAX clicked');
                        handleMaxSwap();
                      }}
                      type="button"
                    >
                      MAX
                    </button>
                  </div>
                </div>
                <div className="swap-balance">
                  Balance: {walletData.find(w => w.symbol === swapFromCoin)?.balance.toFixed(4) || '0.0000'} {swapFromCoin}
                </div>
              </div>

              {/* Swap Icon Button */}
              <div className="swap-icon-container">
                <button 
                  className="swap-icon-btn" 
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Swap coins clicked');
                    handleSwapCoins();
                  }}
                  type="button"
                  title="Reverse swap direction"
                >
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
                  </svg>
                </button>
              </div>

              {/* To Section */}
              <div className="swap-to-section">
                <label className="swap-label">To</label>
                <div className="swap-input-group">
                  <select 
                    className="swap-coin-select"
                    value={swapToCoin}
                    onChange={(e) => {
                      console.log('To coin changed:', e.target.value);
                      setSwapToCoin(e.target.value);
                    }}
                  >
                    {walletData.map(coin => (
                      <option key={coin.symbol} value={coin.symbol}>
                        {coin.icon} {coin.symbol} - {coin.asset}
                      </option>
                    ))}
                  </select>
                  <div className="swap-amount-display">
                    <div className="swap-receive-amount">
                      ≈ {calculateSwapReceive()}
                    </div>
                  </div>
                </div>
                <div className="swap-balance">
                  Balance: {walletData.find(w => w.symbol === swapToCoin)?.balance.toFixed(4) || '0.0000'} {swapToCoin}
                </div>
              </div>

              {/* Exchange Rate Info */}
              {swapAmount && parseFloat(swapAmount) > 0 && (
                <div className="swap-info-card">
                  <div className="swap-info-row">
                    <span className="swap-info-label">Exchange Rate:</span>
                    <span className="swap-info-value">
                      1 {swapFromCoin} = {getExchangeRate(swapFromCoin, swapToCoin).toFixed(6)} {swapToCoin}
                    </span>
                  </div>
                  <div className="swap-info-row">
                    <span className="swap-info-label">Exchange Fee (0.5%):</span>
                    <span className="swap-info-value">
                      {(parseFloat(swapAmount) * 0.005).toFixed(6)} {swapFromCoin}
                    </span>
                  </div>
                  <div className="swap-info-row">
                    <span className="swap-info-label">Slippage Tolerance:</span>
                    <div className="slippage-selector">
                      <button 
                        className={`slippage-btn ${slippageTolerance === 0.1 ? 'active' : ''}`}
                        onClick={() => setSlippageTolerance(0.1)}
                        type="button"
                      >
                        0.1%
                      </button>
                      <button 
                        className={`slippage-btn ${slippageTolerance === 0.5 ? 'active' : ''}`}
                        onClick={() => setSlippageTolerance(0.5)}
                        type="button"
                      >
                        0.5%
                      </button>
                      <button 
                        className={`slippage-btn ${slippageTolerance === 1 ? 'active' : ''}`}
                        onClick={() => setSlippageTolerance(1)}
                        type="button"
                      >
                        1%
                      </button>
                      <input 
                        type="number"
                        className="slippage-custom"
                        placeholder="Custom"
                        value={slippageTolerance !== 0.1 && slippageTolerance !== 0.5 && slippageTolerance !== 1 ? slippageTolerance : ''}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 50) {
                            setSlippageTolerance(val);
                          }
                        }}
                        step="0.1"
                        min="0"
                        max="50"
                      />
                    </div>
                  </div>
                  <div className="swap-info-row">
                    <span className="swap-info-label">Minimum Received:</span>
                    <span className="swap-info-value">
                      {(parseFloat(calculateSwapReceive()) * (1 - slippageTolerance / 100)).toFixed(6)} {swapToCoin}
                    </span>
                  </div>
                  <div className="swap-info-row">
                    <span className="swap-info-label">Price Impact:</span>
                    <span className="swap-info-value" style={{ color: '#10b981' }}>
                      {'<'} 0.01%
                    </span>
                  </div>
                  <div className="swap-info-row total">
                    <span className="swap-info-label">You will receive:</span>
                    <span className="swap-info-value highlight">
                      {calculateSwapReceive()} {swapToCoin}
                    </span>
                  </div>
                </div>
              )}

              {/* Swap Button */}
              <button 
                className="swap-submit-btn"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Swap button clicked');
                  handleSwap();
                }}
                disabled={!swapAmount || parseFloat(swapAmount) <= 0}
                type="button"
              >
                {!swapAmount || parseFloat(swapAmount) <= 0 
                  ? 'Enter amount to swap' 
                  : `Swap ${swapAmount} ${swapFromCoin} to ${swapToCoin}`
                }
              </button>

              {/* Quick Amount Buttons */}
              <div className="swap-quick-amounts">
                <button 
                  className="swap-quick-btn" 
                  onClick={() => {
                    const wallet = walletData.find(w => w.symbol === swapFromCoin);
                    if (wallet) setSwapAmount((wallet.balance * 0.25).toFixed(4));
                  }}
                  type="button"
                >
                  25%
                </button>
                <button 
                  className="swap-quick-btn" 
                  onClick={() => {
                    const wallet = walletData.find(w => w.symbol === swapFromCoin);
                    if (wallet) setSwapAmount((wallet.balance * 0.5).toFixed(4));
                  }}
                  type="button"
                >
                  50%
                </button>
                <button 
                  className="swap-quick-btn" 
                  onClick={() => {
                    const wallet = walletData.find(w => w.symbol === swapFromCoin);
                    if (wallet) setSwapAmount((wallet.balance * 0.75).toFixed(4));
                  }}
                  type="button"
                >
                  75%
                </button>
                <button 
                  className="swap-quick-btn" 
                  onClick={() => handleMaxSwap()}
                  type="button"
                >
                  100%
                </button>
              </div>
            </div>

            {/* Swap History */}
            <div className="swap-history-section">
              <h3 className="swap-history-title">Swap History</h3>
              <div className="swap-history-table">
                <div className="swap-history-header">
                  <div>Date</div>
                  <div>From</div>
                  <div>To</div>
                  <div>Rate</div>
                  <div>Status</div>
                  <div>TX Hash</div>
                </div>
                {swapHistory.length > 0 ? (
                  swapHistory.map(swap => (
                    <div key={swap.id} className="swap-history-row">
                      <div className="swap-history-cell">{swap.date}</div>
                      <div className="swap-history-cell">
                        {swap.fromAmount} {swap.fromCoin}
                      </div>
                      <div className="swap-history-cell">
                        {swap.toAmount.toFixed(6)} {swap.toCoin}
                      </div>
                      <div className="swap-history-cell">
                        1:{swap.rate.toFixed(4)}
                      </div>
                      <div className="swap-history-cell">
                        <span className={`status-badge-swap ${swap.status.toLowerCase()}`}>
                          {swap.status}
                        </span>
                      </div>
                      <div className="swap-history-cell tx-hash-cell">
                        {swap.txHash}
                        <button 
                          className="copy-tx-btn" 
                          onClick={() => copyToClipboard(swap.txHash)}
                          title="Copy TX Hash"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="swap-history-empty">
                    No swap history yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Tab */}
      {activeTab === 'transfer' && (
        <div className="wallet-content">
          <div className="transfer-section">
            <h2>Internal Transfer</h2>
            <p className="section-description">Transfer crypto to another user on the platform</p>

            {/* Coin Selection */}
            <div className="coin-selector">
              <label>Select Coin</label>
              <div className="coin-buttons">
                {['BTC', 'ETH', 'USDT', 'SOL', 'ADA', 'MATIC'].map(coin => (
                  <button 
                    key={coin}
                    className={`coin-btn ${selectedCoin === coin ? 'active' : ''}`}
                    onClick={() => setSelectedCoin(coin)}
                  >
                    {coin}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Form */}
            <div className="transfer-card">
              <div className="transfer-header">
                <h3>Transfer {selectedCoin}</h3>
                <div className="available-balance">
                  Available: {walletData.find(w => w.symbol === selectedCoin)?.balance || 0} {selectedCoin}
                </div>
              </div>

              {!showTransferSummary ? (
                <>
                  <div className="form-group">
                    <label>Recipient (Username, Email, or Wallet ID)</label>
                    <input 
                      type="text" 
                      placeholder="Enter recipient username or email"
                      value={transferRecipient}
                      onChange={(e) => setTransferRecipient(e.target.value)}
                    />
                    <div className="input-hint">
                      💡 Transfers within the platform are instant and free
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Amount</label>
                    <div className="amount-input">
                      <input 
                        type="number" 
                        placeholder="0.00"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                      />
                      <span className="currency-label">{selectedCoin}</span>
                      <button className="max-btn" onClick={setMaxTransferAmount}>MAX</button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Note (Optional)</label>
                    <textarea 
                      placeholder="Add a note for the recipient..."
                      value={transferNote}
                      onChange={(e) => setTransferNote(e.target.value)}
                      rows="3"
                    />
                  </div>

                  <div className="transfer-info">
                    <div className="info-row">
                      <span>Transfer Fee</span>
                      <span className="free-badge">FREE</span>
                    </div>
                    <div className="info-row">
                      <span>Processing Time</span>
                      <span>Instant</span>
                    </div>
                    <div className="info-row total">
                      <span>Recipient will receive</span>
                      <span>{transferAmount || '0.00'} {selectedCoin}</span>
                    </div>
                  </div>

                  <button className="transfer-submit-btn" onClick={handleTransfer}>
                    Continue to Review
                  </button>

                  <div className="security-notice">
                    <span className="security-icon">🔒</span>
                    <div>
                      <strong>Security Notice:</strong> Please verify the recipient details carefully. Internal transfers cannot be reversed.
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="transfer-summary">
                    <h3>Review Transfer</h3>
                    <p className="summary-subtitle">Please confirm the details below</p>

                    <div className="summary-card">
                      <div className="summary-row">
                        <span className="summary-label">Cryptocurrency</span>
                        <span className="summary-value">
                          <span className="coin-badge">{selectedCoin}</span>
                        </span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Amount</span>
                        <span className="summary-value highlight">{transferAmount} {selectedCoin}</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">Recipient</span>
                        <span className="summary-value">{transferRecipient}</span>
                      </div>
                      {transferNote && (
                        <div className="summary-row">
                          <span className="summary-label">Note</span>
                          <span className="summary-value note">{transferNote}</span>
                        </div>
                      )}
                      <div className="summary-row">
                        <span className="summary-label">Transfer Fee</span>
                        <span className="summary-value free">FREE</span>
                      </div>
                      <div className="summary-row total-row">
                        <span className="summary-label">Total Amount</span>
                        <span className="summary-value total">{transferAmount} {selectedCoin}</span>
                      </div>
                    </div>

                    <div className="summary-actions">
                      <button className="btn-back" onClick={() => setShowTransferSummary(false)}>
                        ← Back to Edit
                      </button>
                      <button className="btn-confirm" onClick={confirmTransfer}>
                        Confirm Transfer
                      </button>
                    </div>
                  </div>

                  <div className="verification-notice">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </svg>
                    <div>
                      <div className="notice-title-full">2FA Verification Required</div>
                      <div className="notice-text-full">You may be asked to verify this transfer via email or authenticator app.</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="wallet-content">
          <div className="history-section">
            <h2>Transaction History</h2>
            <p className="section-description">All deposits, withdrawals, and transfers</p>

            {/* Filters */}
            <div className="history-filters">
              <div className="filter-group">
                <label>Type</label>
                <select value={historyType} onChange={(e) => setHistoryType(e.target.value)}>
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdraw</option>
                  <option value="transfer">Transfer</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select value={historyStatus} onChange={(e) => setHistoryStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Date Range</label>
                <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  <option value="all">All Time</option>
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="history-table">
              <div className="table-header">
                <div>Date & Time</div>
                <div>Type</div>
                <div>Asset</div>
                <div>Amount</div>
                <div>Status</div>
                <div>TX Hash</div>
              </div>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx, index) => (
                  <div key={index} className="table-row">
                    <div>
                      <div className="tx-date">{new Date(tx.date).toLocaleDateString()}</div>
                      <div className="tx-time">{tx.time}</div>
                    </div>
                    <div>
                      <span className={`type-badge ${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </div>
                    <div className="asset-cell-small">
                      <strong>{tx.asset}</strong>
                    </div>
                    <div>{tx.amount} {tx.asset}</div>
                    <div>
                      <span className="status-badge" style={{ color: tx.color }}>
                        {tx.status}
                      </span>
                    </div>
                    <div className="tx-hash">
                      {tx.txHash}
                      <button className="copy-hash-btn" onClick={() => copyToClipboard(tx.txHash)}>
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <svg width="64" height="64" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
                  </svg>
                  <p>No transactions found</p>
                  <span>Try adjusting your filters</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Alert Modal */}
      {showAlertModal && (
        <div className="modal-overlay" onClick={() => setShowAlertModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Set Price Alert</h3>
              <button className="modal-close" onClick={() => setShowAlertModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Cryptocurrency</label>
                <select value={alertCoin} onChange={(e) => setAlertCoin(e.target.value)}>
                  {walletData.map(coin => (
                    <option key={coin.symbol} value={coin.symbol}>{coin.asset} ({coin.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Alert Type</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input type="radio" value="above" checked={alertType === 'above'} onChange={(e) => setAlertType(e.target.value)} />
                    Price goes above
                  </label>
                  <label className="radio-label">
                    <input type="radio" value="below" checked={alertType === 'below'} onChange={(e) => setAlertType(e.target.value)} />
                    Price drops below
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Target Price ({currency})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                />
              </div>
              <button className="modal-submit-btn" onClick={handlePriceAlert}>
                Set Alert
              </button>
            </div>
            
            {/* Active Alerts */}
            <div className="active-alerts">
              <h4>Active Alerts</h4>
              {priceAlerts.filter(a => a.active).map(alert => (
                <div key={alert.id} className="alert-item">
                  <span className="alert-coin">{alert.coin}</span>
                  <span className="alert-condition">
                    {alert.type === 'above' ? '↑' : '↓'} {currencySymbols[currency]}{alert.targetPrice}
                  </span>
                  <button className="alert-delete">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recurring Deposit Modal */}
      {showRecurringModal && (
        <div className="modal-overlay" onClick={() => setShowRecurringModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule Recurring Deposit</h3>
              <button className="modal-close" onClick={() => setShowRecurringModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Select Cryptocurrency</label>
                <select value={recurringCoin} onChange={(e) => setRecurringCoin(e.target.value)}>
                  {walletData.map(coin => (
                    <option key={coin.symbol} value={coin.symbol}>{coin.asset} ({coin.symbol})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Amount ({currency})</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={recurringAmount}
                  onChange={(e) => setRecurringAmount(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <select value={recurringFrequency} onChange={(e) => setRecurringFrequency(e.target.value)}>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <button className="modal-submit-btn" onClick={handleRecurringDeposit}>
                Schedule Deposit
              </button>
            </div>
            
            {/* Active Recurring Deposits */}
            <div className="active-alerts">
              <h4>Active Schedules</h4>
              {recurringDeposits.filter(d => d.active).map(deposit => (
                <div key={deposit.id} className="alert-item">
                  <span className="alert-coin">{deposit.coin}</span>
                  <span className="alert-condition">
                    {currencySymbols[currency]}{deposit.amount} · {deposit.frequency}
                  </span>
                  <span className="next-date">Next: {deposit.nextDate}</span>
                  <button className="alert-delete">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Crypto Withdrawal Confirmation Modal */}
      {showWithdrawConfirmation && (
        <div className="modal-overlay" onClick={() => setShowWithdrawConfirmation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Withdrawal</h3>
              <button className="modal-close" onClick={() => setShowWithdrawConfirmation(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="confirmation-details">
                <div className="confirmation-row">
                  <span className="confirmation-label">Cryptocurrency:</span>
                  <span className="confirmation-value">{selectedCoin}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Network:</span>
                  <span className="confirmation-value">{selectedNetwork}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Amount:</span>
                  <span className="confirmation-value highlight">{withdrawAmount} {selectedCoin}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Network Fee:</span>
                  <span className="confirmation-value">
                    {cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.fees[selectedNetwork]} {selectedCoin}
                  </span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Address:</span>
                  <span className="confirmation-value address-value">{withdrawAddress}</span>
                </div>
                <div className="confirmation-row total-row">
                  <span className="confirmation-label">You will receive:</span>
                  <span className="confirmation-value total">
                    {(parseFloat(withdrawAmount) - (cryptoWithdrawOptions.find(c => c.symbol === selectedCoin)?.fees[selectedNetwork] || 0)).toFixed(4)} {selectedCoin}
                  </span>
                </div>
              </div>
              
              <div className="confirmation-warning">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div>
                  <div className="warning-title">Important Notice</div>
                  <div className="warning-text">Please verify the withdrawal address carefully. Cryptocurrency transactions cannot be reversed.</div>
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn-back" onClick={() => setShowWithdrawConfirmation(false)}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={confirmCryptoWithdrawal}>
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swap Confirmation Modal */}
      {showSwapConfirmation && (
        <div className="modal-overlay" onClick={() => setShowSwapConfirmation(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Swap</h3>
              <button className="modal-close" onClick={() => setShowSwapConfirmation(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="confirmation-details">
                <div className="confirmation-row">
                  <span className="confirmation-label">From:</span>
                  <span className="confirmation-value highlight">{swapAmount} {swapFromCoin}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">To:</span>
                  <span className="confirmation-value highlight">{calculateSwapReceive()} {swapToCoin}</span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Exchange Rate:</span>
                  <span className="confirmation-value">
                    1 {swapFromCoin} = {getExchangeRate(swapFromCoin, swapToCoin).toFixed(6)} {swapToCoin}
                  </span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Exchange Fee (0.5%):</span>
                  <span className="confirmation-value">
                    {(parseFloat(swapAmount) * 0.005).toFixed(6)} {swapFromCoin}
                  </span>
                </div>
                <div className="confirmation-row">
                  <span className="confirmation-label">Slippage Tolerance:</span>
                  <span className="confirmation-value">{slippageTolerance}%</span>
                </div>
                <div className="confirmation-row total-row">
                  <span className="confirmation-label">You will receive:</span>
                  <span className="confirmation-value total">
                    {calculateSwapReceive()} {swapToCoin}
                  </span>
                </div>
              </div>
              
              <div className="confirmation-warning">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div>
                  <div className="warning-title">Important Notice</div>
                  <div className="warning-text">Please review the exchange rate and amounts carefully. Swaps are executed instantly and cannot be reversed.</div>
                </div>
              </div>

              <div className="confirmation-actions">
                <button className="btn-back" onClick={() => setShowSwapConfirmation(false)}>
                  Cancel
                </button>
                <button className="btn-confirm" onClick={confirmSwap}>
                  Confirm Swap
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Wallet;
