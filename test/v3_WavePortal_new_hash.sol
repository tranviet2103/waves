// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.17;

import "hardhat/console.sol";

contract WavePortal {
    uint256 totalWaves;

    event NewWave(address indexed from, uint256 timestamp, string message);
    event NewWaveWithHash(bytes32 indexed requestId, address indexed from, uint256 timestamp, string message, bytes32 indexed hash);

    mapping(bytes32 => uint256) public requestIdToWaveId;

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() {
        console.log("Yo yo, I am a contract and I am smart, I was built by Simon - a real builder ))");
    }

    function wave(string memory _message) public {
        totalWaves += 1;
        console.log("%s waved w/ message %s", msg.sender, _message);
        waves.push(Wave(msg.sender, _message, block.timestamp));
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp, _message));
        requestIdToWaveId[requestId] = waves.length - 1;
        emit NewWaveWithHash(requestId, msg.sender, block.timestamp, _message, blockhash(block.number - 1));
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}
