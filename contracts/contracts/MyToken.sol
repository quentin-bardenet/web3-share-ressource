// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

contract MyToken is ERC20 {
    address owner;

    constructor(uint256 initialSupply) ERC20("Barden", "BDN") {
        //_mint(address(this), initialSupply); // mint initial supply and give token to the contract, what if I update the contract ?
        _mint(msg.sender, initialSupply); // maybe we can send all the token to owner ?
        owner = msg.sender;
        console.log("MyToken Contract ready to go !");
    }

    function rewardUser(address _userToReward, uint256 _amount) public {
        _transfer(owner, _userToReward, _amount);
    }

    // add function that allow owner only to add contract address that can call "rewardUser"
}
