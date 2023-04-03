import React from 'react';
import { useState, useEffect } from "react";
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
import './Lobby.css';

import LobbyDetails from './LobbyDetails';

function getStateString(state) {
    if (state === 0) {
      return "OPEN";
    } else if (state === 1) {
      return " 0: 24 remaining to join";
    } else if (state === 3) {
      return "ROLLING";
    } else if (state === 4) {
      return "CLOSED";
    } else {
      return "UNKNOWN";
    }
  }

const Lobby = ({ lobbyId, entryFee }) => {
    const contractADRESS = process.env.REACT_APP_CONTRACT_ADRESS; //temp adress gotten from hardhat deploy on localhost network , in production should be in a .env file
    const { address, isConnecting, isDisconnected } = useAccount();

    const [playerCount, setPlayerCount] = useState(0);
    const [lobbyState, setLobbyState] = useState(4);
    const [showLobbyDetails, setShowLobbyDetails] = useState(false);
    

    //listen to LOBBY PLAYER JOINED event and update Lobby player amount
    useContractEvent({
        address: contractADRESS,
        abi: tokenContract.abi,
        eventName: 'PlayerJoinedLobby',
        listener(lobbyIndexLOG, playerAdressLOG, timestampLOG, playerPoolSizeLOG) {
            console.log(lobbyIndexLOG, playerAdressLOG, timestampLOG, playerPoolSizeLOG)
            
            //COMPLETE UPDATE OF PLAYER COUNT
            if (lobbyIndexLOG.toNumber() === lobbyId) {
                setPlayerCount(playerPoolSizeLOG.toNumber());
            }
        },
    })
    //listen to LOBBY IS TIMER event and update lobby state on the frontend
    useContractEvent({
        address: contractADRESS,
        abi: tokenContract.abi,
        eventName: 'LobbyIsTimer',
        listener(lobbyIndexLOG) {
            console.log(lobbyIndexLOG)
            
            //COMPLETE UPDATE OF PLAYER COUNT
            if (lobbyIndexLOG.toNumber() === lobbyId) {
                setLobbyState(1);
            }
        },
    })

    

    //reading from contract : GET LOBBY PLAYERS
    const contractRead = useContractRead({
        address: contractADRESS,
        abi: tokenContract.abi,
        functionName: 'getCurrentLobbyPlayers',
        args: [lobbyId],
    })

    
    

    //reading from contract : GET LOBBY STATE
    const contractRead2 = useContractRead({
        address: contractADRESS,
        abi: tokenContract.abi,
        functionName: 'getCurrentLobbyState',
        args: [lobbyId],
    })

    //Fetch initial player count
    useEffect(() => {
        const getPlayerCount = async () => {
            setPlayerCount(contractRead.data.length);
        };
        const getLobbyState = async () => {
            setLobbyState(contractRead2.data);
        };
        getLobbyState();
        getPlayerCount();
    },[contractRead.data, contractRead2.data]);

    //writing to contract : JOIN LOBBY
    const { config } = usePrepareContractWrite({
        address: contractADRESS,
        abi: tokenContract.abi,
        functionName: 'joinLobby',
        args: [lobbyId],
        overrides: {
          from: address,
          value: ethers.utils.parseEther(String(entryFee)),
        },
    });

    const { data: joinData, isLoading: isJoinLoading, isSuccess: isJoinSuccess, write} = useContractWrite(config);  
    const HandleJoinLobby = async () => {
      //check if the user has already joined the lobby
      const hasJoined = contractRead.data && contractRead.data.some((player) => player === address);
      if (hasJoined) {
        return;
      }
      await write?.();
      // update UI as needed
    };

    //Define the text to display on the Join button based on the current state
    let joinButtonText;
    if (isJoinLoading) {
      joinButtonText = "Joining...";
    } else if (isJoinSuccess) {
      joinButtonText = "Joined!";
    } else if (contractRead.data && contractRead.data.some((player) => player === address)) {
      joinButtonText = "Joined!";
    } else {
      joinButtonText = "Join Lobby";
    }

    //Disable the Join button if already joined or in progress
    const isJoinDisabled = isJoinLoading || isJoinSuccess || (contractRead.data && contractRead.data.some((player) => player === address));

    const handleViewLobbyDetails = () => {
      setShowLobbyDetails(true);
    }
    

  return (
    <div className="lobby">
        <div>LOBBY {lobbyId + 1} </div>
        <div> {getStateString(lobbyState)}</div>
        <div> Entry fee : {entryFee} MATIC</div >
        <div> Current Players : {playerCount}</div>
        <button onClick={HandleJoinLobby} disabled={isJoinDisabled}>{joinButtonText}</button>
        {isJoinDisabled &&
          <button className='lobby-details-button' onClick={handleViewLobbyDetails}>View</button>
        }
        {showLobbyDetails && 
          (<LobbyDetails  onClose={() => setShowLobbyDetails(false)} lobbyId= {lobbyId} entryFee ={entryFee} /> )}
    </div>
  );
};

export default Lobby;
