const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Web3Ressources", function () {
  it("Should be initialized", async function () {
    const initialSupply = ethers.utils.parseEther("1000000.0");

    const [owner, randomPerson] = await ethers.getSigners();

    const myTokenContractFactory = await ethers.getContractFactory("MyToken");
    const myTokenContract = await myTokenContractFactory.deploy(initialSupply);
    await myTokenContract.deployed();

    const myNFTContractFactory = await ethers.getContractFactory("MyNFT");
    const myNFTContract = await myNFTContractFactory.deploy();
    await myNFTContract.deployed();

    const web3RessourceContractFactory = await ethers.getContractFactory(
      "Web3Ressources"
    );
    const web3RessourceContract = await web3RessourceContractFactory.deploy(
      myTokenContract.address,
      myNFTContract.address
    );
    await web3RessourceContract.deployed();

    let ownerBalance = await myTokenContract.balanceOf(owner.address);
    let randomPersonBalance = await myTokenContract.balanceOf(
      randomPerson.address
    );

    expect(ownerBalance).to.equal("1000000000000000000000000");
    expect(randomPersonBalance).to.equal("0");

    await web3RessourceContract.addRessource("1- MyRessource1", "1- Comment1");
    for (let i = 0; i < 10; i++) {
      await web3RessourceContract
        .connect(randomPerson)
        .addRessource("2- MyRessource" + (i + 1), "2- Comment" + (i + 1));
    }

    let ressources = await web3RessourceContract.getRessources();

    expect(ressources.length).to.equal(11);

    ownerBalance = await myTokenContract.balanceOf(owner.address);
    randomPersonBalance = await myTokenContract.balanceOf(randomPerson.address);

    expect(ownerBalance).to.equal("999999000000000000000000");
    expect(randomPersonBalance).to.equal("1000000000000000000");

    await web3RessourceContract.likeRessource(1);
    ressources = await web3RessourceContract.getRessources();

    expect(ressources[1].nbLike).to.equal(1);

    for (let i = 0; i < 10; i++) {
      await web3RessourceContract.likeRessource(1);
    }

    ressources = await web3RessourceContract.getRessources();
    expect(ressources[1].nbLike).to.equal(11);
  });
});
