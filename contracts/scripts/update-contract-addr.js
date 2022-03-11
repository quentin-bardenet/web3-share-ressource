require("dotenv").config({ path: __dirname + "/.env" });

const main = async () => {
  // TODO
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
