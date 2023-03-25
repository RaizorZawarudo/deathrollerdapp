import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { MyStats } from './MyStats';
import { Leaderboards } from './Leaderboards';
import './Navbar.css';

const Navbar = () => {
  const [showLeaderboards, setShowLeaderboards] = useState(false);
  const [showMyStats, setShowMyStats] = useState(false);
  const [showConnectMenu, setShowConnectMenu] = useState(false);

  const navigate = useNavigate();

  const handleDeathRollerClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleLeaderboardsClick = () => {
    setShowLeaderboards(true);
  };

  const handleMyStatsClick = () => {
    setShowMyStats(true);
  };

  const handleConnectWalletClick = () => {
    setShowConnectMenu(true);
  };

  const handleDocsClick = () => {
    navigate('/docs');
  };

  const handleLeaderboardsClose = () => {
    setShowLeaderboards(false);
  };

  const handleMyStatsClose = () => {
    setShowMyStats(false);
  };

  const handleConnectMenuClose = () => {
    setShowConnectMenu(false);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-nav">
        <li className="nav-item">
          <div onClick={handleDeathRollerClick}>DeathRoller</div>
        </li>
        <li className="nav-item">
          <div onClick={handleDashboardClick}>Dashboard</div>
        </li>
        <li className="nav-item">
          <div onClick={handleLeaderboardsClick}>Leaderboards</div>
        </li>
        <li className="nav-item">
          <div onClick={handleMyStatsClick}>My Stats</div>
        </li>
        <li className="nav-item">
          <ConnectButton onClick={handleConnectWalletClick} />
        </li>
        <li className="nav-item">
          <div onClick={handleDocsClick}>Docs</div>
        </li>
      </ul>
      {showLeaderboards && <Leaderboards onClose={handleLeaderboardsClose} />}
      {showMyStats && <MyStats onClose={handleMyStatsClose} />}
      {showConnectMenu && <ConnectButton onClose={handleConnectMenuClose} />}
    </nav>
  );
};

export default Navbar;
