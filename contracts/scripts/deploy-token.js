const main = async () => {
  const initialSupply = ethers.utils.parseEther("1000000.0");

  const myTokenContractFactory = await ethers.getContractFactory("MyToken");
  const myTokenContract = await myTokenContractFactory.deploy(initialSupply);
  await myTokenContract.deployed();

  console.log(`MyToken address: ${myTokenContract.address}`);
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
