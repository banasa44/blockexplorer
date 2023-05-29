import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Link,
  Route,
  Switch,
  useParams,
  Redirect,
} from "react-router-dom";
import YourBalance from "./YourBalance";

import "./App.css";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const DefaultPage = ({ blockNumber }) => {
  return (
    <div>
      <h2>Block Number: {blockNumber}</h2>
      <nav>
        <ul>
          <li>
            <Link to="/your-balance">Your Balance</Link>
          </li>
          <li>
            <Link to="/transactions">All Transactions</Link>
          </li>
          <li>
            <Link to="/nft">NFT Page</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

function TransactionDetails() {
  const { txHash } = useParams();
  const [transaction, setTransaction] = useState(null);

  useEffect(() => {
    async function getTransactionDetails() {
      const tx = await alchemy.core.getTransactionReceipt(txHash);
      setTransaction(tx);
    }

    getTransactionDetails();
  }, [txHash]);

  if (!transaction) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Transaction Details</h2>
      <p>Hash: {transaction.transactionHash}</p>
      <p>To: {transaction.to}</p>
      <p>From: {transaction.from}</p>
      <p>Contract Address: {transaction.contractAddress}</p>
      <p>Transaction Index: {transaction.transactionIndex}</p>
      <p>Gas Used: {transaction.gasUsed.toString()}</p>
    </div>
  );
}
// Define the NFTPage component
const NFTPage = () => {
  return (
    <div>
      <header>
        <h1>NFT Information</h1>
        {/* Add any additional header content specific to the NFT page */}
      </header>
      <main>
        {/* Add your NFT page content */}
        <h2>NFTs</h2>
        {/* Additional NFT-related components */}
      </main>
    </div>
  );
};

const App = () => {
  const [blockNumber, setBlockNumber] = useState();
  const [blockTransactions, setBlockTransactions] = useState([]);
  const [showTransactions, setShowTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

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

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = blockTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  console.log("Rendering App component");

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Block Information</h1>
          <nav>
            <ul>
              <li>
                <Link to="/your-balance">Your Balance</Link>
              </li>
              <li>
                <Link to="/transactions">All Transactions</Link>
              </li>
              <li>
                <Link to="/nft">NFT Page</Link>
              </li>
            </ul>
          </nav>
        </header>
        <Switch>
          <Route exact path="/">
            <DefaultPage blockNumber={blockNumber} />
          </Route>
          <Route exact path="/your-balance">
            <YourBalance
              alchemy={alchemy}
              onBalanceClick={toggleTransactions}
            />
          </Route>
          <Route exact path="/nft">
            <NFTPage />
          </Route>
          <Route exact path="/transactions">
            <button onClick={toggleTransactions}>
              {showTransactions ? "Hide Transactions" : "Show Transactions"}
            </button>
            {showTransactions && (
              <div>
                <h3>Transactions:</h3>
                <ul>
                  {currentTransactions.map((tx) => (
                    <li key={tx.hash}>
                      <Link to={`/transactions/${tx.hash}`}>{tx.hash}</Link>
                    </li>
                  ))}
                </ul>
                {blockTransactions.length > transactionsPerPage && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      blockTransactions.length / transactionsPerPage
                    )}
                    onPageChange={setCurrentPage}
                  />
                )}
              </div>
            )}
          </Route>
          <Route path="/transactions/:txHash">
            <TransactionDetails />
          </Route>
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
