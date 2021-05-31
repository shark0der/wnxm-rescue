const { ethers, network } = require('hardhat');
const assert = require('assert');

const DEPLOYER = '0x1B36E154C15a1568E3a23fa0C702807B19B988f2';
const WNXM = '0x0d438F3b5175Bebc262bF23753C1E53d03432bDE';
const ETH = '0x2170ed0880ac9a755fd29b2688956bd959f933f8';
const TARGET_NONCE = 58490;

describe('Rescuer', async function () {

  this.timeout(0);
  this.slow(0);

  it('increment nonce and rescue', async function () {

    console.log('Impersonating accounts');
    await network.provider.send('hardhat_impersonateAccount', [DEPLOYER]);
    await network.provider.send('hardhat_impersonateAccount', [ethers.constants.AddressZero]);

    console.log('Funding deployer');
    const sponsor = ethers.constants.AddressZero;
    await ethers.provider.getSigner(sponsor).sendTransaction({
      to: DEPLOYER,
      value: ethers.utils.parseEther('100'),
    });

    const deployer = ethers.provider.getSigner(DEPLOYER);

    console.log('Setting nonce');
    // https://github.com/nomiclabs/hardhat/pull/1435
    await network.provider.send('hardhat_setNonce', [DEPLOYER, '0x' + TARGET_NONCE.toString(16)]);

    console.log('Deploying contract');
    const Rescuer = await ethers.getContractFactory('Rescuer', deployer);
    const rescuer = await Rescuer.deploy();
    await rescuer.deployed();

    const eth = await ethers.getContractAt('IERC20', ETH, deployer);

    console.log(`Deployed Rescuer at ${rescuer.address}`);
    assert.strictEqual(WNXM.toLowerCase(), rescuer.address.toLowerCase());

    console.log('Claiming tokens');
    await rescuer.claimTokens([ETH]);

    console.log('Checking balance');
    const ethBalance = await eth.balanceOf(DEPLOYER);

    console.log(`Rescued ${ethers.utils.formatEther(ethBalance)} ETH`);
  });

});
