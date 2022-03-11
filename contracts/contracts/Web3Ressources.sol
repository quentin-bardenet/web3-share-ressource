// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract MyTokenInterface {
    function rewardUser(address _userToReward, uint256 _amount) public {}
}

contract MyNFTInterface {
    function makeNFT(address _to) public {}
}

contract Web3Ressources {
    struct Ressource {
        address creator;
        string link;
        string comment;
        uint256 timestamp;
        uint16 nbLike;
    }

    Ressource[] ressources;
    MyTokenInterface private myToken;
    MyNFTInterface private myNFT;
    address private owner;

    mapping(address => uint16) private nbRessource;
    mapping(address => uint16) private nbLike;

    event NewRessource(
        address indexed from,
        uint256 timestamp,
        string link,
        string comment
    );
    event UpdateRessource(
        address indexed from,
        uint256 timestamp,
        string link,
        string comment,
        uint16 nbLike // should be replaced by array of address to avoid duplicate
    );

    constructor(address _myTokenContractAddress, address _myNFTContractAddress)
    {
        owner = msg.sender;
        myToken = MyTokenInterface(_myTokenContractAddress);
        myNFT = MyNFTInterface(_myNFTContractAddress);
        console.log("Smart Contract Web3Ressource ready to go !");
    }

    modifier onlyCreator(uint256 _ressourceId) {
        require(ressources[_ressourceId].creator == msg.sender);
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function.");
        _;
    }

    function updateTokenContractAddress(address _myTokenContractAddress)
        public
        onlyOwner
    {
        myToken = MyTokenInterface(_myTokenContractAddress);
    }

    function updateNFTContractAddress(address _myNFTContractAddress)
        public
        onlyOwner
    {
        myNFT = MyNFTInterface(_myNFTContractAddress);
    }

    function addRessource(string memory _ressource, string memory _comment)
        public
    {
        ressources.push(
            Ressource(msg.sender, _ressource, _comment, block.timestamp, 0)
        );

        nbRessource[msg.sender]++;

        emit NewRessource(msg.sender, block.timestamp, _ressource, _comment);

        // reward user every 10 ressources
        if (nbRessource[msg.sender] % 10 == 0) {
            uint256 rewardAmount = 1 ether;
            myToken.rewardUser(msg.sender, rewardAmount);
        }
    }

    function getRessources() public view returns (Ressource[] memory) {
        return ressources;
    }

    function removeRessource(uint256 _ressourceId)
        public
        onlyCreator(_ressourceId)
    {
        require(_ressourceId < ressources.length, "index out of bound");

        nbRessource[msg.sender]--;
        for (uint256 i = _ressourceId; i < ressources.length - 1; i++) {
            ressources[i] = ressources[i + 1];
        }

        ressources.pop();
    }

    function updateRessource(
        uint256 _ressourceId,
        string memory _ressource,
        string memory _comment
    ) public onlyCreator(_ressourceId) {
        ressources[_ressourceId].link = _ressource;
        ressources[_ressourceId].comment = _comment;
        ressources[_ressourceId].timestamp = block.timestamp;

        emit UpdateRessource(
            msg.sender,
            block.timestamp,
            _ressource,
            _comment,
            ressources[_ressourceId].nbLike
        );
    }

    function likeRessource(uint256 _ressourceId) public {
        // todo : check that the user didn't like this ressource yet
        ressources[_ressourceId].nbLike++;
        nbLike[ressources[_ressourceId].creator]++;

        // reward user that has more than 10 like on their ressources
        if (nbLike[ressources[_ressourceId].creator] == 10) {
            myNFT.makeNFT(ressources[_ressourceId].creator);
        }

        emit UpdateRessource(
            ressources[_ressourceId].creator,
            block.timestamp,
            ressources[_ressourceId].link,
            ressources[_ressourceId].comment,
            ressources[_ressourceId].nbLike
        );
    }
}
