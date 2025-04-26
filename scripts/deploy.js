const hre = require("hardhat");
require('dotenv').config();

async function main() {
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.deploy(
    "Portfolio Launch NFT",           // name
    "PNFT",                          // symbol
    `ipfs://${process.env.IPFS_CID}/` // baseURI
  );

  await nft.waitForDeployment();
  const address = await nft.getAddress();

  console.log("NFT deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 