import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link, Route, Switch, useParams } from 'react-router-dom';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div>
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
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

function App() {
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

  // const handleNextPage = () => {
  //   setCurrentPage((prevPage) => prevPage + 1);
  // };

  // const handlePrevPage = () => {
  //   setCurrentPage((prevPage) => prevPage - 1);
  // };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = blockTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Block Information</h1>
        </header>
        <main>
          <h2>Block Number: {blockNumber}</h2>
          <button onClick={toggleTransactions}>
            {showTransactions ? 'Hide Transactions' : 'Show Transactions'}
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
                  totalPages={Math.ceil(blockTransactions.length / transactionsPerPage)}
                  onPageChange={setCurrentPage}
                />
              )}
            </div>
          )}
        </main>
      </div>
      <Switch>
        <Route path="/transactions/:txHash">
          <TransactionDetails />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
