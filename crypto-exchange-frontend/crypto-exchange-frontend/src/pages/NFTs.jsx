import React, { useState } from 'react';
import { formatPrice } from '../utils/formatters';
import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import '../styles/components/nfts.css';

const NFTs = () => {
  const { addNotification } = useNotifications();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('mynfts');
  const [viewMode, setViewMode] = useState('grid');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [rarityFilter, setRarityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [blockchainFilter, setBlockchainFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Modal states
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sellPrice, setSellPrice] = useState('');
  const [transferAddress, setTransferAddress] = useState('');

  // Wallet
  const [walletBalance] = useState(15.5);

  // NFT Data
  const [myNFTs, setMyNFTs] = useState([
    {
      id: 1,
      name: 'Bored Ape #7234',
      collection: 'Bored Ape Yacht Club',
      image: null,
      gradient: 'linear-gradient(135deg, #f7971e, #ffd200, #f7971e)',
      emoji: '🦍',
      price: 45.5,
      lastSale: 42.3,
      purchasePrice: 40.0,
      category: 'Art',
      rarity: 'Legendary',
      blockchain: 'Ethereum'
    },
    {
      id: 2,
      name: 'CryptoPunk #3100',
      collection: 'CryptoPunks',
      image: null,
      gradient: 'linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)',
      emoji: '👾',
      price: 78.2,
      lastSale: 75.0,
      purchasePrice: 70.0,
      category: 'Art',
      rarity: 'Epic',
      blockchain: 'Ethereum'
    },
    {
      id: 3,
      name: 'Azuki #9045',
      collection: 'Azuki',
      image: null,
      gradient: 'linear-gradient(135deg, #f43f5e, #ec4899, #a855f7)',
      emoji: '⚔️',
      price: 12.8,
      lastSale: 11.5,
      purchasePrice: 10.0,
      category: 'Art',
      rarity: 'Rare',
      blockchain: 'Ethereum'
    },
    {
      id: 4,
      name: 'Doodle #2341',
      collection: 'Doodles',
      image: null,
      gradient: 'linear-gradient(135deg, #10b981, #06b6d4, #3b82f6)',
      emoji: '🎨',
      price: 8.4,
      lastSale: 8.0,
      purchasePrice: 7.5,
      category: 'Art',
      rarity: 'Common',
      blockchain: 'Ethereum'
    },
    {
      id: 5,
      name: 'Clone X #5678',
      collection: 'Clone X',
      image: null,
      gradient: 'linear-gradient(135deg, #00ffe0, #3a6ff7, #7c3aed)',
      emoji: '🤖',
      price: 15.2,
      lastSale: 14.8,
      purchasePrice: 13.0,
      category: 'Gaming',
      rarity: 'Rare',
      blockchain: 'Ethereum'
    },
    {
      id: 6,
      name: 'Moonbird #1234',
      collection: 'Moonbirds',
      image: null,
      gradient: 'linear-gradient(135deg, #7c3aed, #4f46e5, #0ea5e9)',
      emoji: '🦉',
      price: 22.5,
      lastSale: 21.0,
      purchasePrice: 19.0,
      category: 'Art',
      rarity: 'Epic',
      blockchain: 'Ethereum'
    }
  ]);

  const trendingNFTs = [
    {
      id: 101,
      name: 'Pudgy Penguin #4567',
      collection: 'Pudgy Penguins',
      image: null,
      gradient: 'linear-gradient(135deg, #06b6d4, #0ea5e9, #38bdf8)',
      emoji: '🐧',
      price: 18.9,
      volume24h: 245.8,
      change24h: 12.5,
      category: 'Art',
      rarity: 'Rare',
      blockchain: 'Ethereum',
      listed: true
    },
    {
      id: 102,
      name: 'Mutant Ape #8901',
      collection: 'Mutant Ape Yacht Club',
      image: null,
      gradient: 'linear-gradient(135deg, #84cc16, #22c55e, #10b981)',
      emoji: '🧬',
      price: 32.4,
      volume24h: 512.3,
      change24h: -5.2,
      category: 'Art',
      rarity: 'Epic',
      blockchain: 'Ethereum',
      listed: true
    },
    {
      id: 103,
      name: 'Otherdeed #2345',
      collection: 'Otherdeed',
      image: null,
      gradient: 'linear-gradient(135deg, #f59e0b, #ef4444, #dc2626)',
      emoji: '🌍',
      price: 2.8,
      volume24h: 89.4,
      change24h: 8.3,
      category: 'Virtual Land',
      rarity: 'Common',
      blockchain: 'Ethereum',
      listed: true
    }
  ];

  // Calculate totals dynamically
  const ethToUsd = 3541.20; // ETH price in USD
  const totalValue = myNFTs.reduce((sum, nft) => sum + nft.price, 0);
  const totalProfit = myNFTs.reduce((sum, nft) => sum + (nft.price - nft.purchasePrice), 0);
  const profitPercentage = ((totalProfit / myNFTs.reduce((sum, nft) => sum + nft.purchasePrice, 0)) * 100).toFixed(2);

  // Handlers
  const handleBuyNFT = (nft) => {
    setSelectedNFT(nft);
    setShowBuyModal(true);
  };

  const confirmBuy = () => {
    if (walletBalance < selectedNFT.price) {
      addNotification('error', 'Insufficient balance');
      return;
    }
    addNotification('success', `Successfully purchased ${selectedNFT.name}!`);
    setShowBuyModal(false);
  };

  const handleSellNFT = (nft) => {
    setSelectedNFT(nft);
    setSellPrice(nft.price.toString());
    setShowSellModal(true);
  };

  const confirmSell = () => {
    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      addNotification('error', 'Please enter a valid price');
      return;
    }
    addNotification('success', `Listed ${selectedNFT.name} for ${sellPrice} ETH!`);
    setShowSellModal(false);
    setSellPrice('');
  };

  const handleTransferNFT = (nft) => {
    setSelectedNFT(nft);
    setShowTransferModal(true);
  };

  const confirmTransfer = () => {
    if (!transferAddress || transferAddress.length < 10) {
      addNotification('error', 'Please enter a valid address');
      return;
    }
    addNotification('success', `Transferred ${selectedNFT.name} successfully!`);
    setMyNFTs(myNFTs.filter(nft => nft.id !== selectedNFT.id));
    setShowTransferModal(false);
    setTransferAddress('');
  };

  const handleViewDetails = (nft) => {
    setSelectedNFT(nft);
    setShowDetailModal(true);
  };

  const handleViewCollection = (collectionName) => {
    // Switch to trending tab and filter by collection
    setActiveTab('trending');
    setSearchQuery(collectionName);
    addNotification('info', `Showing NFTs from ${collectionName}`);
  };

  // Filtering
  const filteredNFTs = (activeTab === 'mynfts' ? myNFTs : trendingNFTs).filter(nft => {
    const matchesCategory = filterCategory === 'all' || nft.category === filterCategory;
    const matchesSearch = nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = nft.price >= priceRange[0] && nft.price <= priceRange[1];
    const matchesRarity = rarityFilter === 'all' || nft.rarity === rarityFilter;
    const matchesBlockchain = blockchainFilter === 'all' || nft.blockchain === blockchainFilter;
    return matchesCategory && matchesSearch && matchesPrice && matchesRarity && matchesBlockchain;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rarity') {
      const rarityOrder = { 'Legendary': 4, 'Epic': 3, 'Rare': 2, 'Common': 1 };
      return (rarityOrder[b.rarity] || 0) - (rarityOrder[a.rarity] || 0);
    }
    return 0;
  });

  return (
    <main className="main-content">
      {/* Header */}
      <div className="nfts-header">
        <div>
          <h1 className="page-title">{t('nftMarketplace')}</h1>
          <p className="page-subtitle">Discover, collect, and trade digital assets</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-label">{t('walletBalance')}</span>
            <span className="stat-value">{formatPrice(walletBalance)} ETH</span>
            <span className="stat-usd">${formatPrice(walletBalance * ethToUsd)}</span>
          </div>
          {activeTab === 'mynfts' && (
            <>
              <div className="stat-card">
                <span className="stat-label">{t('totalValue')}</span>
                <span className="stat-value">{formatPrice(totalValue)} ETH</span>
                <span className="stat-usd">${formatPrice(totalValue * ethToUsd)}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">{t('totalProfit')}</span>
                <span className={`stat-value ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
                  {totalProfit >= 0 ? '+' : ''}{formatPrice(totalProfit)} ETH ({profitPercentage}%)
                </span>
                <span className={`stat-usd ${totalProfit >= 0 ? 'positive' : 'negative'}`}>
                  {totalProfit >= 0 ? '+' : ''}${formatPrice(totalProfit * ethToUsd)}
                </span>
              </div>
              <div className="stat-card">
                <span className="stat-label">{t('nftsOwned')}</span>
                <span className="stat-value">{myNFTs.length}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="nfts-controls">
        <div className="nfts-tabs">
          <button
            className={`nfts-tab ${activeTab === 'mynfts' ? 'active' : ''}`}
            onClick={() => setActiveTab('mynfts')}
          >
            {t('myNfts')} ({myNFTs.length})
          </button>
          <button
            className={`nfts-tab ${activeTab === 'trending' ? 'active' : ''}`}
            onClick={() => setActiveTab('trending')}
          >
            {t('trending')}
          </button>
          <button
            className={`nfts-tab ${activeTab === 'collections' ? 'active' : ''}`}
            onClick={() => setActiveTab('collections')}
          >
            {t('collections')}
          </button>
        </div>

        <button
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
          {t('filters')}
        </button>
      </div>

      {/* Filters Panel */}
      <div className={`nfts-filters-panel ${showFilters ? 'show' : ''}`}>
        <div className="filters-row">
          <input
            type="text"
            className="search-input"
            placeholder={t('search') + ' NFTs...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">{t('allCategories')}</option>
            <option value="Art">Art</option>
            <option value="Gaming">Gaming</option>
            <option value="Virtual Land">Virtual Land</option>
          </select>

          <select
            className="filter-select"
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value)}
          >
            <option value="all">{t('allRarities')}</option>
            <option value="Legendary">Legendary</option>
            <option value="Epic">Epic</option>
            <option value="Rare">Rare</option>
            <option value="Common">Common</option>
          </select>

          <select
            className="filter-select"
            value={blockchainFilter}
            onChange={(e) => setBlockchainFilter(e.target.value)}
          >
            <option value="all">{t('allBlockchains')}</option>
            <option value="Ethereum">Ethereum</option>
            <option value="Solana">Solana</option>
            <option value="Polygon">Polygon</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recent">Recent</option>
            <option value="price-low">{t('price')}: Low to High</option>
            <option value="price-high">{t('price')}: High to Low</option>
            <option value="rarity">Rarity</option>
          </select>
        </div>

        <div className="price-slider-container">
          <label className="slider-label">
            {t('priceRange')}: {priceRange[0]} ETH - {priceRange[1]} ETH
          </label>
          <div className="slider-inputs">
            <input
              type="number"
              className="price-input"
              placeholder="Min"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
              min="0"
              max={priceRange[1]}
            />
            <span className="slider-separator">to</span>
            <input
              type="number"
              className="price-input"
              placeholder="Max"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 100])}
              min={priceRange[0]}
            />
          </div>
        </div>
      </div>

      {/* NFT Grid */}
      {activeTab === 'collections' ? (
        <div className="collections-view">
          <div className="collection-card">
            <div className="collection-banner" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}></div>
            <div className="collection-info">
              <h3>Bored Ape Yacht Club</h3>
              <p>Floor: 45.5 ETH • Volume: 125K ETH</p>
              <button
                className="view-collection-btn"
                onClick={() => handleViewCollection('Bored Ape Yacht Club')}
              >
                {t('viewCollection')}
              </button>
            </div>
          </div>
          <div className="collection-card">
            <div className="collection-banner" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}></div>
            <div className="collection-info">
              <h3>CryptoPunks</h3>
              <p>Floor: 78.2 ETH • Volume: 890K ETH</p>
              <button
                className="view-collection-btn"
                onClick={() => handleViewCollection('CryptoPunks')}
              >
                {t('viewCollection')}
              </button>
            </div>
          </div>
          <div className="collection-card">
            <div className="collection-banner" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}></div>
            <div className="collection-info">
              <h3>Azuki</h3>
              <p>Floor: 12.8 ETH • Volume: 320K ETH</p>
              <button
                className="view-collection-btn"
                onClick={() => handleViewCollection('Azuki')}
              >
                {t('viewCollection')}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="nfts-grid">
          {filteredNFTs.map(nft => (
            <NFTCard
              key={nft.id}
              nft={nft}
              activeTab={activeTab}
              ethToUsd={ethToUsd}
              onBuy={() => handleBuyNFT(nft)}
              onSell={() => handleSellNFT(nft)}
              onTransfer={() => handleTransferNFT(nft)}
              onViewDetails={() => handleViewDetails(nft)}
            />
          ))}
        </div>
      )}

      {/* Buy Modal */}
      {showBuyModal && selectedNFT && (
        <div className="modal-overlay" onClick={() => setShowBuyModal(false)}>
          <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('buy')} NFT</h2>
              <button className="modal-close" onClick={() => setShowBuyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <img src={selectedNFT.image} alt={selectedNFT.name} className="modal-nft-image" />
              <h3>{selectedNFT.name}</h3>
              <p className="modal-collection">{selectedNFT.collection}</p>
              <div className="modal-info">
                <div className="info-row">
                  <span>Price:</span>
                  <span className="highlight">{formatPrice(selectedNFT.price)} ETH</span>
                </div>
                <div className="info-row">
                  <span>Gas Fee (est):</span>
                  <span>0.005 ETH</span>
                </div>
                <div className="info-row total">
                  <span>Total:</span>
                  <span className="highlight">{formatPrice(selectedNFT.price + 0.005)} ETH</span>
                </div>
                <div className="info-row">
                  <span>Your Balance:</span>
                  <span>{formatPrice(walletBalance)} ETH</span>
                </div>
              </div>
              <button
                className="modal-btn primary"
                onClick={confirmBuy}
                disabled={walletBalance < selectedNFT.price}
              >
                {walletBalance < selectedNFT.price ? t('insufficientBalance') : t('confirmPurchase')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sell Modal */}
      {showSellModal && selectedNFT && (
        <div className="modal-overlay" onClick={() => setShowSellModal(false)}>
          <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('listForSale')}</h2>
              <button className="modal-close" onClick={() => setShowSellModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <img src={selectedNFT.image} alt={selectedNFT.name} className="modal-nft-image" />
              <h3>{selectedNFT.name}</h3>
              <div className="form-group">
                <label>Listing Price (ETH)</label>
                <input
                  type="number"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
              <div className="modal-info">
                <div className="info-row">
                  <span>Platform Fee (2.5%):</span>
                  <span>{formatPrice(parseFloat(sellPrice || 0) * 0.025)} ETH</span>
                </div>
                <div className="info-row total">
                  <span>You'll Receive:</span>
                  <span className="highlight">{formatPrice(parseFloat(sellPrice || 0) * 0.975)} ETH</span>
                </div>
              </div>
              <button className="modal-btn primary" onClick={confirmSell}>
                {t('listForSale')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && selectedNFT && (
        <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
          <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('transfer')} NFT</h2>
              <button className="modal-close" onClick={() => setShowTransferModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <img src={selectedNFT.image} alt={selectedNFT.name} className="modal-nft-image" />
              <h3>{selectedNFT.name}</h3>
              <div className="form-group">
                <label>Recipient Address</label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="warning-box">
                ⚠️ Please verify the address carefully. Transfers cannot be reversed.
              </div>
              <button className="modal-btn primary" onClick={confirmTransfer}>
                {t('confirm')} {t('transfer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

// NFT Card Component
const NFTCard = ({ nft, activeTab, ethToUsd, onBuy, onSell, onTransfer, onViewDetails }) => {
  const { t } = useLanguage();
  const getBlockchainIcon = (blockchain) => {
    const icons = {
      'Ethereum': '⟠',
      'Solana': '◎',
      'Polygon': '⬡'
    };
    return icons[blockchain] || '⬡';
  };

  return (
    <div className="nft-card" onClick={onViewDetails}>
      <div className="nft-image-wrapper">
        {nft.image ? (
          <img
            src={nft.image}
            alt={nft.name}
            className="nft-image"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="nft-art" style={{ background: nft.gradient }}>
            <span className="nft-art-emoji">{nft.emoji}</span>
            <div className="nft-art-particles">
              {[...Array(6)].map((_, i) => (
                <span key={i} className="particle" style={{ '--i': i }} />
              ))}
            </div>
          </div>
        )}
        <div className={`nft-rarity-badge rarity-${nft.rarity.toLowerCase()}`}>
          {nft.rarity}
        </div>
        <div className="nft-blockchain-badge">
          {getBlockchainIcon(nft.blockchain)}
        </div>
      </div>
      <div className="nft-card-content">
        <h3 className="nft-name">{nft.name}</h3>
        <p className="nft-collection">{nft.collection}</p>
        <div className="nft-price-section">
          <span className="nft-price-label">{t('price')}</span>
          <div className="nft-price-group">
            <span className="nft-price">{formatPrice(nft.price)} ETH</span>
            <span className="nft-price-usd">${formatPrice(nft.price * ethToUsd)}</span>
          </div>
        </div>
        {activeTab === 'mynfts' && (
          <div className="nft-actions" onClick={(e) => e.stopPropagation()}>
            <button className="nft-btn sell" onClick={onSell}>{t('sell')}</button>
            <button className="nft-btn transfer" onClick={onTransfer}>{t('transfer')}</button>
          </div>
        )}
        {activeTab === 'trending' && (
          <button className="nft-btn buy" onClick={(e) => { e.stopPropagation(); onBuy(); }}>
            {t('buyNow')}
          </button>
        )}
      </div>
    </div>
  );
};

export default NFTs;
