import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlockTransactions() {
      const block = await alchemy.core.getBlockWithTransactions();
      setBlockTransactions(block.transactions || []);
    }

    if (showTransactions) {
      getBlockTransactions();
    }
  }, [showTransactions]);

  const toggleTransactions = () => {
    setShowTransactions(!showTransactions);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Block Information</h1>
      </header>
      <main>
        <h2>Block Number: {blockNumber}</h2>
        <button onClick={toggleTransactions}>
          {showTransactions ? "Hide Transactions" : "Show Transactions"}
        </button>
        {showTransactions && (
          <div>
            <h3>Transactions:</h3>
            {blockTransactions.map((tx) => (
              <p key={tx.hash}>{tx.hash}</p>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}


export default App;
