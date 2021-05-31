const { ethers } = require("hardhat");

const { TARGET_NONCE, GAS_PRICE, BATCH_SIZE } = process.env;

// nh run scripts/nonceBump.js --network bsc

async function main() {
  const [sender] = await ethers.getSigners();
  console.log(`Bumping nonce for account ${sender.address}`);

  let nonce = await ethers.provider.getTransactionCount(sender.address);
  console.log(`Current nonce is ${nonce}`);

  let lastHash;
  while (nonce < TARGET_NONCE) {
    for (
      let i = nonce;
      i < Math.min(nonce + Number(BATCH_SIZE), Number(TARGET_NONCE));
      i++
    ) {
      const receiptPromise = sender.sendTransaction({
        to: sender.address,
        gasPrice: Number(GAS_PRICE) * 10 ** 9,
        nonce: nonce++, // use n and then increment to n+1
      });

      if (i % BATCH_SIZE === 0 || i === Number(TARGET_NONCE)) {
        const receipt = await receiptPromise;
        lastHash = receipt.hash;
        console.log("The latest hash of the batch", lastHash);
      }
    }

    await ethers.provider.waitForTransaction(lastHash);
    console.log(`Nonce bumped to ${nonce}`);
  }
}

main();
