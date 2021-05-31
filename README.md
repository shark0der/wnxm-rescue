# wnxm rescuer for bsc chain

## Running tests

This repo uses `hardhat_setNonce` from unreleased hardhat from this pull request: https://github.com/nomiclabs/hardhat/pull/1435

To install:

```
git clone https://github.com/feuGeneA/hardhat hardhat-set-nonce
cd hardhat-set-nonce
git checkout rpc-account-mods

# important to use yarn for installation and building
yarn
cd packages/hardhat-core
yarn build
# important to use npm for linking
npm link

# then go to project folder
cd ../../../wnxm-rescue
npm link hardhat

npx hardhat test
```
