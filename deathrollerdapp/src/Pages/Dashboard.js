import React from 'react';
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  useSigner,
  useAccount,
  useConnect,
  useContract,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import tokenContract from '../abis/drollerABI.json';

import './Dashboard.css';

const Dashboard = ({layout}) => {
  const contractADRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3'; //temp adress gotten from hardhat deploy on localhost network , in production should be in a .env file
  const { address, isConnecting, isDisconnected } = useAccount();

  const { config: joinLobbyConfig } = usePrepareContractWrite({
    address: contractADRESS,
    abi: tokenContract.abi,
    functionName: 'joinLobby',
    args: [0],
    overrides: {
      from: address,
      value: ethers.utils.parseEther('0.01'),
    },
  });

  const { write: joinLobbyWrite } = useContractWrite(joinLobbyConfig);

  const handleJoinLobby = async (lobbyIndex, entryfee) => {
    const overrides = {
      from: address,
      value: entryfee,
    };
    const args = [lobbyIndex];

    const { data, isLoading, isSuccess } = await joinLobbyWrite();

    // update your UI as needed
  };
  
  return (
    <div>
      {layout}
      <div className="dashboard-content">
        <button onClick={() => handleJoinLobby(0, ethers.utils.parseEther('0.01'))}>Join Lobby 0</button>
        <button onClick={() => handleJoinLobby(1, ethers.utils.parseEther('0.05'))}>Join Lobby 1</button>
        <button onClick={() => handleJoinLobby(2, ethers.utils.parseEther('0.1'))}>Join Lobby 2</button>
      </div>
    </div>
  );
};

export default Dashboard;
