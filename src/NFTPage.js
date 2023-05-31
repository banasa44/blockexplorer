import React, { useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function NFTInfo() {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenID, setTokenID] = useState("");
  const [NFTInfo, setNFTInfo] = useState(null);

  const handleContractAddressChange = (event) => {
    setContractAddress(event.target.value);
  };

  const handleTokenIDChange = (event) => {
    setTokenID(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted");
    console.log("Contract Address:", contractAddress);
    console.log("Token ID:", tokenID);

    // Perform the balance retrieval logic here using the provided public key
    let NFTInfo = await alchemy.nft.getNftMetadata(contractAddress, tokenId);
    console.log("NFTInfo:", JSON.stringify(NFTInfo));
    setNFTInfo(JSON.stringify(NFTInfo));
  };

  console.log("Rendering NFTInfo component");

  return (
    <div>
      <h2>NFT Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Contract Address:
          <input
            type="text"
            value={contractAddress}
            onChange={handleContractAddressChange}
          />
        </label>
        <label>
          Token ID:
          <input type="text" value={tokenID} onChange={handleTokenIDChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {NFTInfo && <p>Requested NFT Info: {NFTInfo}</p>}
    </div>
  );
}

export default NFTInfo;
