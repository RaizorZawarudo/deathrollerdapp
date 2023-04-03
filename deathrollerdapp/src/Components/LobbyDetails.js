import React from 'react'
import { ethers } from "ethers";
import {
  useSigner,
  useAccount,
  useConnect,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import tokenContract from '../artifacts/contracts/DeathRoller.sol/DeathRoller.json';
import './LobbyDetails.css'

function truncateAddress(address, start = 6, end = 4) {
  if (!address) return "";
  return `${address.slice(0, start)}...${address.slice(-end)}`;
}


const LobbyDetails = ({onClose, lobbyId, entryFee }) => {
  const contractADRESS = process.env.REACT_APP_CONTRACT_ADRESS;


  //reading from contract : GET LOBBY PLAYERS
  const contractRead = useContractRead({
    address: contractADRESS,
    abi: tokenContract.abi,
    functionName: 'getCurrentLobbyPlayers',
    args: [lobbyId],
  });
  //reading from contract : GET LOBBY STATE
  const contractRead2 = useContractRead({
    address: contractADRESS,
    abi: tokenContract.abi,
    functionName: 'getCurrentLobbyState',
    args: [lobbyId],
  })

  return (
    <div className='lobby-details-container'>
      <h2>Lobby {lobbyId}</h2>
      <p>Some lobby details baby</p>
      <p>Entry Fee : {entryFee} MATIC</p>
      <div className='playerlist'>
        {contractRead.data.map((player, index) => (
          <div className='player-item' key={index}>{truncateAddress(player)}</div>
        ))}
      </div>
      <button className='close-lobby-view-button' onClick={onClose}>Close</button>
    </div>
  )
}

export default LobbyDetails