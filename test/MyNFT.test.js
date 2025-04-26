const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MyNFT = await ethers.getContractFactory("MyNFT");
    nft = await MyNFT.deploy("MyNFT", "MNFT", "https://api.example.com/nft/");
    await nft.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal("MyNFT");
      expect(await nft.symbol()).to.equal("MNFT");
    });
  });

  describe("Minting", function () {
    it("Should allow minting with correct payment", async function () {
      const mintPrice = await nft.MINT_PRICE();
      await nft.connect(addr1).mint({ value: mintPrice });
      expect(await nft.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should fail when minting with insufficient payment", async function () {
      const mintPrice = await nft.MINT_PRICE();
      await expect(
        nft.connect(addr1).mint({ value: mintPrice.sub(1) })
      ).to.be.revertedWith("Insufficient payment");
    });
  });

  describe("URI Management", function () {
    it("Should return correct token URI", async function () {
      const mintPrice = await nft.MINT_PRICE();
      await nft.connect(addr1).mint({ value: mintPrice });
      expect(await nft.tokenURI(0)).to.equal("https://api.example.com/nft/0");
    });

    it("Should allow owner to set base URI", async function () {
      await nft.setBaseURI("https://new-api.example.com/nft/");
      const mintPrice = await nft.MINT_PRICE();
      await nft.connect(addr1).mint({ value: mintPrice });
      expect(await nft.tokenURI(0)).to.equal("https://new-api.example.com/nft/0");
    });
  });
}); 