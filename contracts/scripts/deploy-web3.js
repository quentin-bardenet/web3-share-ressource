require("dotenv").config({ path: __dirname + "/.env" });

const main = async () => {
  const web3ContractFactory = await hre.ethers.getContractFactory(
    "Web3Ressources"
  );
  const web3Contract = await web3ContractFactory.deploy(
    process.env.TOKEN_ADDR,
    process.env.NFT_ADDR
  );
  await web3Contract.deployed();

  console.log(`Web3Ressource address: ${web3Contract.address}`);
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
