import React, { useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function YourBalance() {
    const [publicKey, setPublicKey] = useState('');
    const [balance, setBalance] = useState(null);
  
    const handleInputChange = (event) => {
      setPublicKey(event.target.value);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      console.log('Form submitted');
      console.log('Public Key:', publicKey);
  
      // Perform the balance retrieval logic here using the provided public key
      const balance = await alchemy.core.getBalance(publicKey,"latest");
      console.log('Balance:', balance._hex);
      setBalance(balance._hex);
    };
  
    console.log('Rendering YourBalance component');
  
    return (
      <div>
        <h2>Your Balance</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Public Key:
            <input type="text" value={publicKey} onChange={handleInputChange} />
          </label>
          <button type="submit">Get Balance</button>
        </form>
        {balance && <p>Your balance: {balance}</p>}
      </div>
    );
  }
  

export default YourBalance;
