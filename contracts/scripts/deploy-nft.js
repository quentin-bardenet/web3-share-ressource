const main = async () => {
  const myNFTContractFactory = await ethers.getContractFactory("MyNFT");
  const myNFTContract = await myNFTContractFactory.deploy();
  await myNFTContract.deployed();

  console.log(`MyNFT address: ${myNFTContract.address}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

runMain();
