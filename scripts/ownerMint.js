const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Owner account:", signer.address);

  const contractAddress = "0xfE80bba25E7847BAbaB58048648bAE1Ef8BC3Ab9";
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(contractAddress);

  // オーナーであることを確認
  const owner = await nft.owner();
  if (owner.toLowerCase() !== signer.address.toLowerCase()) {
    throw new Error("This account is not the owner of the contract");
  }

  console.log("Owner minting NFT...");
  const tx = await nft.ownerMint();
  await tx.wait();
  
  const balance = await nft.balanceOf(signer.address);
  console.log("Owner minting successful!");
  console.log("Owner's NFT balance:", balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 