const fetch = require('node-fetch');

const PROVIDER_URL = 'https://bsc-dataseed.binance.org/';
const body = '{"method":"eth_blockNumber","params":[],"id":1,"jsonrpc":"2.0"}';

fetch(PROVIDER_URL, { method: 'post', body })
  .then(r => r.json())
  .then(data => {

    process.env.FORK_BLOCK = data.result;
    console.log('Fork block = %s (%s)', process.env.FORK_BLOCK, parseInt(process.env.FORK_BLOCK, 16));

    const { run } = require('hardhat');
    return run('test');

  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
