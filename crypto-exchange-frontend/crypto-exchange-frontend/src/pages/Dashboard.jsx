import React from 'react';
import StatsRow from '../components/dashboard/StatsRow';
import PortfolioSection from '../components/dashboard/PortfolioSection';
import MarketTable from '../components/dashboard/MarketTable';
import PortfolioPerformance from '../components/dashboard/PortfolioPerformance';
import Watchlist from '../components/dashboard/Watchlist';
import RecentActivity from '../components/dashboard/RecentActivity';
import FearGreedIndex from '../components/trading/FearGreedIndex';
import OrderBook from '../components/trading/OrderBook';
import '../styles/components/dashboard-new.css';

const Dashboard = () => {
  return (
    <main className="main-content dashboard-container dashboard-fullwidth">
      {/* Top Row */}
      <div className="dashboard-top-row">
        <PortfolioPerformance />
        <Watchlist />
      </div>

      {/* Stats Row */}
      <StatsRow />
      
      {/* Three Column Layout */}
      <div className="dashboard-bottom-row">
        <div className="dashboard-left-column">
          <PortfolioSection />
          <div className="market-table-wrapper">
            <MarketTable />
          </div>
        </div>
        <RecentActivity />
        <div className="dashboard-right-column">
          <FearGreedIndex />
          <OrderBook />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
