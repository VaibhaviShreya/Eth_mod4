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

  it("Should have correct redeem prices for items", async function () {
    expect(await degenToken.redeemPrices(1)).to.equal(20);
    expect(await degenToken.redeemPrices(2)).to.equal(50);
    expect(await degenToken.redeemPrices(3)).to.equal(100);
  });

  it("Should fail to redeem invalid item ID", async function () {
    await degenToken.mint(addr1.address, 100);
    await degenToken.allowRedeem(addr1.address);
    await expect(degenToken.connect(addr1).redeem(4)).to.be.revertedWith("Invalid item ID");
  });
});
