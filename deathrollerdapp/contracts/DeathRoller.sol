// SPDX-License-Identifier: UNLICENSED

import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";


pragma solidity ^0.8.4;

contract DeathRoller {
    uint public betAmount;
    address[] public waitingPlayers;
    Game[] public games;

    struct Game {
        address player1;
        address player2;
        uint betAmount;
        bytes32 requestId;
        uint player1Roll;
        uint player2Roll;
        bytes32 keyHash;
        uint linkFee;
    }

    event NewGame(address player1, address player2, uint betAmount);

    constructor(address vrfCoordinator, address linkToken) VRFConsumerBase(vrfCoordinator, linkToken) {
        betAmount = _betAmount;
    }

    function enterQueue() public {
        require(msg.sender != address(0), "Invalid address.");
        waitingPlayers.push(msg.sender);
        if (waitingPlayers.length == 2) {
            address player1 = waitingPlayers[0];
            address player2 = waitingPlayers[1];
            waitingPlayers.pop();
            waitingPlayers.pop();
            emit NewGame(player1, player2, betAmount);
            Game memory newGame = Game(player1, player2, betAmount, 0, 0, 0, 0x8b1a9953c4611296a827abf8c47804d7, 0.1 * 10 ** 18);
            games.push(newGame);
        }
    }

    function rollDice() public {
    require(player1 == msg.sender || player2 == msg.sender, "You are not a player in this game.");
    uint gameId = getGameId();
    Game storage game = games[gameId];

    require(game.state == GameState.IN_PROGRESS, "Game is not in progress.");
    require(game.requestId == 0, "A dice roll has already been initiated for this player.");

    bytes32 requestId = requestRandomness(game.keyHash, game.linkFee);
    game.requestId = requestId;
    emit DiceRollInitiated(requestId, gameId, msg.sender);
    }


    function fulfillRandomness(bytes32 _requestId, uint256 _randomness) internal override {
        for (uint i = 0; i < games.length; i++) {
            Game storage game = games[i];
            if (game.requestId == _requestId) {
                uint roll = (_randomness % 6) + 1;
                if (msg.sender == game.player1) {
                    game.player1Roll = roll;
                } else {
                    game.player2Roll = roll;
                }
                return;
            }
        }
        revert("Invalid request ID.");
    }

    function determineWinner(uint gameId) public view returns (address) {
        Game storage game = games[gameId];
        require(game.player1Roll > 0 && game.player2Roll > 0, "Both players must roll the dice first.");
        if (game.player1Roll > game.player2Roll) {
            return game.player1;
        } else if (game.player2Roll > game.player1Roll) {
            return game.player2;
        } else {
            return address(0); // tie
        }
    }

    function distributeWinnings(uint gameId) public {
        Game storage game = games[gameId];
        address winner = determineWinner(gameId);
        require(winner != address(0), "The game ended in a tie.");
        address loser = winner == game.player1 ? game.player2 : game.player1;
        (bool success,) = winner.call{value: game.betAmount * 2}("");
        require(success, "Transfer failed.");
    }
}
