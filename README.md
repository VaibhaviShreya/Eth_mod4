
# Degen Token Project

## Overview

This project implements a custom ERC-20 token named DegenToken (DGN) on Ethereum. It includes functionalities for token minting, transferring, burning, and redemption based on predefined prices. The token contract is tested using Hardhat and deployed to the Avalanche Fuji Testnet. Finally, the contract is verified on Snowtrace.

## Smart Contract

```solidity
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

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        _transfer(_msgSender(), to, amount);
        return true;
    }

    function allowRedeem(address redeemer) public onlyOwner {
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
```

## Testing

The smart contract is tested using Hardhat and Chai. Here's the test script (`DegenToken.test.js`):

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DegenToken Contract", function () {
  let DegenToken;
  let degenToken;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers
    DegenToken = await ethers.getContractFactory("DegenToken");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

    // Deploy the contract
    degenToken = await DegenToken.deploy();
    await degenToken.deployed();
  });

  it("Should have the correct name and symbol", async function () {
    expect(await degenToken.name()).to.equal("DegenToken");
    expect(await degenToken.symbol()).to.equal("DGN");
  });

  it("Should mint tokens to the owner", async function () {
    await degenToken.mint(owner.address, 100);
    expect(await degenToken.balanceOf(owner.address)).to.equal(100);
  });

  it("Should allow transfer of tokens", async function () {
    await degenToken.mint(owner.address, 100);
    await degenToken.transfer(addr1.address, 50);
    expect(await degenToken.balanceOf(owner.address)).to.equal(50);
    expect(await degenToken.balanceOf(addr1.address)).to.equal(50);
  });

  it("Should allow an address to redeem tokens", async function () {
    await degenToken.mint(addr1.address, 100);
    await degenToken.allowRedeem(addr1.address);
    
    // addr1 redeems itemId 1, which costs 20 tokens
    await degenToken.connect(addr1).redeem(1);

    // Check the balance after redeeming: 100 (initial) - 20 (cost) = 80
    expect(await degenToken.balanceOf(addr1.address)).to.equal(80);
  });

  it("Should not allow redeem if not authorized", async function () {
    await degenToken.mint(addr1.address, 100);
    await expect(degenToken.connect(addr1).redeem(1)).to.be.revertedWith("Address not allowed to redeem tokens");
  });

  it("Should not allow redeem with insufficient balance", async function () {
    await degenToken.mint(addr1.address, 10); // Less than the price of any item
    await degenToken.allowRedeem(addr1.address);
    await expect(degenToken.connect(addr1).redeem(1)).to.be.revertedWith("Insufficient balance to redeem");
  });

  it("Should allow burning of tokens", async function () {
    await degenToken.mint(addr1.address, 100);
    await degenToken.connect(addr1).burn(50);
    expect(await degenToken.balanceOf(addr1.address)).to.equal(50);
  });
});
```

## Deployment and Verification



### Steps

1. **Clone Repo**

   ```bash
   git clone  [git url]
   cd [dir name]
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Test Smart Contract**
  Update `hardhat.config.js` with Fuji Testnet configuration and deploy:
   ```
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
      accounts: ['Private Key']
    },
    // Uncomment for test with fuji
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: ['Private Key'], 
    },
    mainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43114,
      accounts: ['Private Key'],
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
   ```
In this paste your account private key in place of private key in the above code 
   ```bash
   npx hardhat test
   ```

4. **Deploy to Avalanche Fuji Testnet**
   ```bash
   npx hardhat run scripts/deploy.js --network fuji
   ```

6. **Verify on Snowtrace**

   - Navigate to [Snowtrace](https://testnet.snowtrace.io/).
   - Locate your deployed contract using its address.
   - Verify the contract by providing source code, compiler version (`0.8.20`), and settings.

## Help

For troubleshooting and detailed assistance, refer to the provided documentation or community forums.

## Authors

- **Vaibhavi Shreya**
 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Conclusion

By following these steps, you will successfully create, test, deploy, and verify an ERC-20 token named "DegenToken" (symbol: "DGN") on the Avalanche Fuji Testnet.
