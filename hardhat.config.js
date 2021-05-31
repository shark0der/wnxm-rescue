require('dotenv').config();
require('@nomiclabs/hardhat-ethers');

const PROVIDER_URL = 'https://bsc-dataseed.binance.org/';

module.exports = {
  solidity: {
    compilers: [
      { version: '0.7.6', settings: { optimizer: { enabled: true, runs: 200 } } },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      // forking: { url: PROVIDER_URL, blockNumber: 7891362 },
      forking: { url: PROVIDER_URL, blockNumber: parseInt(process.env.FORK_BLOCK, 16) },
      blockGasLimit: 15e6,
      gas: 15e6,
    },
    bsc: {
      url: PROVIDER_URL,
    },
  },
};
