import React from 'react';
import Lobby from '../Components/Lobby';
import {useAccount } from "wagmi";
import './Dashboard.css';

const Dashboard = ({layout}) => {
  const { address, isConnecting, isDisconnected } = useAccount();
  return (
    <div>
      {layout}
      {!isDisconnected && (
      <div className="dashboard-content">
        <Lobby lobbyId={0} entryFee={0.001} />
        <Lobby lobbyId={1} entryFee={0.005} />
        <Lobby lobbyId={2} entryFee={0.01} />
      </div>
      )}
    </div>
  );
};

export default Dashboard;
