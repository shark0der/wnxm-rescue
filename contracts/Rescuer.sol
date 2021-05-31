//SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

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
