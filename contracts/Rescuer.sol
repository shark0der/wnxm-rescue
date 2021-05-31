//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

/*

We deployed this contract to rescue the 8 ETH sent by accident to 0x0d438f3b5175bebc262bf23753c1e53d03432bde on BSC,
which is the Wrapped NXM address on Ethereum mainnet. If you are the owner of these tokens
(i.e. 0x02699a4cbbea963d20baf49fbb9f5204198ae2ff) please contact @alex_pertsev or @shark0der on Telegram.

*/

interface IERC20 {

  function balanceOf(address account) external view returns (uint256);

  function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Rescuer {

  address payable immutable public owner;

  constructor () {
    owner = msg.sender;
  }

  function claimTokens(IERC20[] calldata tokens) external payable {

    require(msg.sender == owner, "not owner");

    for (uint i = 0; i < tokens.length; i++) {

      // BNB
      if (address(tokens[i]) == address(0)) {
        (bool ok,) = owner.call{value : address(this).balance}(new bytes(0));
        require(ok, "transfer failed");
        continue;
      }

      // ERC20
      tokens[i].transfer(owner, tokens[i].balanceOf(address(this)));
    }

  }

}
