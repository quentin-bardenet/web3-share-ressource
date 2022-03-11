import { useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { AccountContext } from "../Context/Account";

import Web3Ressources from "../artifacts/Web3Ressources.json";
import MyToken from "../artifacts/MyToken.json";
import MyNFT from "../artifacts/MyNFT.json";

export default function Home({ ressources }) {
  const [balance, setBalance] = useState(0);
  const [nft, setNft] = useState([]);
  const [allRessources, setAllRessources] = useState(ressources);

  const account = useContext(AccountContext);

  const likeRessource = async (ressourceId) => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDR,
        Web3Ressources.abi,
        signer
      );

      try {
        const val = await contract.likeRessource(ressourceId);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined" && account) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const ec20Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_EC20_ADDR,
        MyToken.abi,
        signer
      );

      ec20Contract.balanceOf(account).then((balance) => {
        setBalance(balance.toString());
      });

      const NFTContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDR,
        MyNFT.abi,
        signer
      );

      NFTContract.tokensOfOwner(account).then((balance) => {
        balance.forEach((element) => {
          NFTContract.tokenURI(element.toString()).then((nftEncoded) => {
            setNft([
              ...nft,
              JSON.parse(Buffer.from(nftEncoded.split(",")[1], "base64")),
            ]);
          });
        });
      });

      const Web3Contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDR,
        Web3Ressources.abi,
        signer
      );

      Web3Contract.on("NewRessource", (address, timestamp, link, comment) => {
        setAllRessources((ressources) => [
          ...ressources,
          { address, timestamp: timestamp.toString(), link, comment },
        ]);
      });
    }
  }, [account]);

  return (
    <div className="">
      <div className="stats bg-primary text-primary-content">
        <div className="stat">
          <div className="stat-title">Welcome</div>
          <div className="stat-value">
            {account.slice(0, 5)}..{account.slice(-4)}
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Current balance</div>
          <div className="stat-value">{balance / 10 ** 18} BDN</div>
        </div>
      </div>

      <div className="bg-base-200 rounded-xl p-4 my-8">
        <h2 className="text-4xl">List of NFT</h2>
        {nft.map((nftItem, index) => (
          <img
            className="mask mask-hexagon-2 max-w-md"
            src={nftItem.image}
            key={index}
          />
        ))}
      </div>

      <div className="bg-base-200 rounded-xl p-4 my-8">
        <div className="w-full flex flex-row justify-between mb-4">
          <h2 className="text-4xl">Ressources</h2>
          <a
            className="btn btn-primary normal-case text-xl"
            href="/ressources/create"
          >
            Add Ressource
          </a>
        </div>
        <div className="flex flex-wrap justify-center">
          {allRessources.map((ressource, index) => (
            <div
              className="card w-96 bg-primary text-primary-content m-4"
              key={index}
            >
              <div className="card-body">
                <h2 className="card-title">{ressource.link}</h2>
                <p>{ressource.comment}</p>
                <p>{ressource.nbLike || 0} like</p>
                <div className="card-actions justify-end">
                  <button className="btn" onClick={() => likeRessource(index)}>
                    Like
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  /* here we check to see the current environment variable */
  /* and render a provider based on the environment we're in */
  let provider;
  if (process.env.ENVIRONMENT === "local") {
    provider = new ethers.providers.JsonRpcProvider();
  } else if (process.env.ENVIRONMENT === "testnet") {
    provider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.matic.today"
    );
  } else {
    provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/");
  }

  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDR,
    Web3Ressources.abi,
    provider
  );
  const data = await contract.getRessources();
  const dataObj = data.map((element) => {
    return Object.entries({ ...element }).reduce((obj, item) => {
      if (isNaN(parseInt(item[0]))) {
        if (typeof item[1] == "object") {
          // should be a timestamp
          obj[item[0]] = parseInt(item[1].toString());
        } else {
          obj[item[0]] = item[1];
        }
      }
      return obj;
    }, {});
  });

  return {
    props: {
      ressources: dataObj,
    },
  };
}
