require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();
require("@nomiclabs/hardhat-ethers");

const FORK_FUJI = false;
const FORK_MAINNET = false;
let forkingData = undefined;

if (FORK_MAINNET) {
  forkingData = {
    url: "https://api.avax.network/ext/bc/C/rpcc",
  };
}
if (FORK_FUJI) {
  forkingData = {
    url: "https://api.avax-test.network/ext/bc/C/rpc",
  };
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      gasPrice: 225000000000,
      chainId: !forkingData ? 43112 : undefined, 
      forking: forkingData,
    },
    snowtrace: {
      url: 'https://api.avax-test.network/ext/bc/C/rpc',
      accounts: ['79b69f5a028c58d3cdc3a5d0e228add1bd0e2806e6189768373b6df301a9a03c']
    },
    // Uncomment for test with fuji
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: ['79b69f5a028c58d3cdc3a5d0e228add1bd0e2806e6189768373b6df301a9a03c'], 
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: ['79b69f5a028c58d3cdc3a5d0e228add1bd0e2806e6189768373b6df301a9a03c'],
    },
    localhost: {
      url: "http://localhost:8545", // Adjust port number if needed
    },
  },
  etherscan: {
    apiKey: 'Etherscan Api Kay', 
    snowtrace: "snowtrace leave it like this", // apiKey is not required, just set a placeholder
  },
  customChains: [
    {
      network: "snowtrace",
      chainId: 43113,
      urls: {
        apiURL: "https://api.routescan.io/v2/network/testnet/evm/43113/etherscan",
        browserURL: "https://avalanche.testnet.localhost:8080"
      }
    }
  ]
}