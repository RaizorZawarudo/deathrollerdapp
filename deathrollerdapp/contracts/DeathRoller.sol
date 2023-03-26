pragma solidity ^0.8.0;

contract DeathRoller {
    enum LobbyState { OPEN, TIMER, ROLLING, FINISHED }
    
    struct Lobby {
        uint256 timer;
        LobbyState state;
        address[] players;
        mapping(address => uint256) playerRolls;
        mapping(address => uint256) playerTimestamps;
        uint256 bountyPool;
        uint256 entryFee;
    }
    
    Lobby[3] public lobbies;
    address public owner;
    
    event LobbyOpened(uint256 indexed lobbyIndex);
    event PlayerJoinedLobby(uint256 indexed lobbyIndex, address indexed player, uint256 timestamp);
    event LobbyIsTimer(uint256 indexed lobbyIndex);
    event LobbyIsRolling(uint256 indexed lobbyIndex);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function.");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        lobbies[0].entryFee = 1 ether;
        lobbies[1].entryFee = 5 ether;
        lobbies[2].entryFee = 10 ether;
        for (uint256 i = 0; i < lobbies.length; i++) {
            lobbies[i].state = LobbyState.OPEN;
            emit LobbyOpened(i);
        }
    }
    
    function joinLobby(uint256 lobbyIndex) payable external {
        require(msg.value == lobbies[lobbyIndex].entryFee, "Invalid entry fee amount.");
        require(lobbies[lobbyIndex].state == LobbyState.OPEN, "Lobby is not open.");
        require(lobbies[lobbyIndex].playerTimestamps[msg.sender] == 0, "You have already joined this lobby.");
        lobbies[lobbyIndex].players.push(msg.sender);
        lobbies[lobbyIndex].playerTimestamps[msg.sender] = block.timestamp;
        lobbies[lobbyIndex].bountyPool += msg.value;
        emit PlayerJoinedLobby(lobbyIndex, msg.sender, block.timestamp);
        if (lobbies[lobbyIndex].players.length >= 2) {
            lobbies[lobbyIndex].timer = block.timestamp + 1 minutes;
            lobbies[lobbyIndex].state = LobbyState.TIMER;
            emit LobbyIsTimer(lobbyIndex);
        }
    }
    
    function getCurrentLobbyState(uint256 lobbyIndex) public view returns (LobbyState) {
        return lobbies[lobbyIndex].state;
    }
    
    function getCurrentLobbyPlayers(uint256 lobbyIndex) public view returns (address[] memory) {
        return lobbies[lobbyIndex].players;
    }
    
    function getCurrentPlayerRoll(uint256 lobbyIndex, address player) public view returns (uint256) {
        return lobbies[lobbyIndex].playerRolls[player];
    }
    
    function getCurrentPlayerTimestamp(uint256 lobbyIndex, address player) public view returns (uint256) {
        return lobbies[lobbyIndex].playerTimestamps[player];
    }
    
    function getCurrentBountyPool(uint256 lobbyIndex) public view returns (uint256) {
        return lobbies[lobbyIndex].bountyPool;
    }
    
    function getCurrentEntryFee(uint256 lobbyIndex) public view returns (uint256) {
        return lobbies[lobbyIndex].entryFee;
    }
}
