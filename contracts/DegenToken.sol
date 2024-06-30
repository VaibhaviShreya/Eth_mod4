// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DegenToken is ERC20, Ownable {
    mapping(address => bool) public redeemers; 
    mapping(uint256 => uint256) public redeemPrices; 


    constructor() ERC20("DegenToken", "DGN"){
        redeemPrices[1] = 20; 
        redeemPrices[2] = 50; 
        redeemPrices[3] = 100;
    }

    function mint(address to, uint256 amount) public  onlyOwner {
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), to, amount);
        return true;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return super.balanceOf(account);
    }

    function allowRedeem(address redeemer) public  onlyOwner {
        redeemers[redeemer] = true;
    }

    function redeem(uint256 itemId) public {
        require(redeemers[msg.sender], "Address not allowed to redeem tokens");
        uint256 price = redeemPrices[itemId];
        require(price > 0, "Invalid item ID");
        require(balanceOf(msg.sender) >= price, "Insufficient balance to redeem");
        _burn(msg.sender, price);
        
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    
}