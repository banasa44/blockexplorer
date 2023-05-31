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
  const [nftInfo, setNFTInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    // Set the loading state to true
    setIsLoading(true);

    try {
      // Perform the NFTInfo retrieval logic here using the provided contract address and token ID
      const nftData = await alchemy.nft.getNftMetadata(
        contractAddress,
        tokenID
      );
      console.log("NFTInfo:", JSON.stringify(nftData));
      setNFTInfo(nftData);
    } catch (error) {
      // Handle the error gracefully
      console.error("Error fetching NFT info:", error);
      setNFTInfo(null);
    }

    // Set the loading state back to false after the API call is completed
    setIsLoading(false);
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Submit"}
        </button>
      </form>
      {isLoading ? (
        <p>Loading NFT information...</p>
      ) : nftInfo ? (
        <div>
          <p>Requested NFT Info:</p>
          <p>Name: {nftInfo.contract.name}</p>
          <p>Symbol: {nftInfo.contract.symbol}</p>
          <p>TotalSupply: {nftInfo.contract.totalSupply}</p>
          <p>Description: {nftInfo.description}</p>
          <img
            src={nftInfo.rawMetadata.image}
            alt={nftInfo.contract.name}
            style={{ maxWidth: "700px" }} // Adjust the maximum width as needed
          />
        </div>
      ) : null}
    </div>
  );
}

export default NFTInfo;
