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

function getStateString(state) {
    if (state === 0) {
      return "OPEN";
    } else if (state === 1) {
      return "TIMER";
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
        const txHash= await write?.();
      // update UI as needed
    };

  return (
    <div className="lobby">
        <p>Lobby {lobbyId} is : {getStateString(lobbyState)}</p>
        <p>{entryFee} MATIC</p>
        <p>  PLAYERS : {playerCount}</p>
        <li onClick={() => HandleJoinLobby()}>Join Lobby</li>
        <div className="lobby-state">
        
        </div>
    </div>
  );
};

export default Lobby;
