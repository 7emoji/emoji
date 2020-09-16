pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";


contract EmojiBar is ERC20("EmojiBar", "xEMOJI"){
    using SafeMath for uint256;
    IERC20 public emoji;

    constructor(IERC20 _emoji) public {
        emoji = _emoji;
    }

    // Enter the bar. Pay some EMOJIs. Earn some shares.
    function enter(uint256 _amount) public {
        uint256 totalEmoji = emoji.balanceOf(address(this));
        uint256 totalShares = totalSupply();
        if (totalShares == 0 || totalEmoji == 0) {
            _mint(msg.sender, _amount);
        } else {
            uint256 what = _amount.mul(totalShares).div(totalEmoji);
            _mint(msg.sender, what);
        }
        emoji.transferFrom(msg.sender, address(this), _amount);
    }

    // Leave the bar. Claim back your EMOJIs.
    function leave(uint256 _share) public {
        uint256 totalShares = totalSupply();
        uint256 what = _share.mul(emoji.balanceOf(address(this))).div(totalShares);
        _burn(msg.sender, _share);
        emoji.transfer(msg.sender, what);
    }
}