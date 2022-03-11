import "../styles/globals.css";
import { useEffect, useState } from "react";
import { AccountContext } from "../Context/Account";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        setAccount(account);
      } else {
        console.log("No authorized accound found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <AccountContext.Provider value={account}>
      <div className=" w-full p-4 min-h-screen flex flex-col">
        <div className="navbar rounded-xl shadow-xl bg-primary mb-8">
          <a className="btn btn-ghost normal-case text-xl" href="/">
            Web3Ressources
          </a>
        </div>
        {account ? (
          <Component {...pageProps} />
        ) : (
          <div className="grow justify-center">
            <div className="hero rounded-xl bg-base-200">
              <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl font-bold">Login now!</h1>
                  <p className="py-6">
                    You should be logged in to continue.
                    <br /> If you don't have Metamask Yet, install it and
                    configure Polygon network.
                  </p>
                </div>
                <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-6">
                  <div className="card-body">
                    <div className="form-control">
                      <button
                        className="btn btn-primary"
                        onClick={connectWallet}
                      >
                        Connect Wallet
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AccountContext.Provider>
  );
}

export default MyApp;
