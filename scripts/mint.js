const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Minting with the account:", signer.address);

  const contractAddress = "0xfE80bba25E7847BAbaB58048648bAE1Ef8BC3Ab9";
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(contractAddress);

  // オーナーでないことを確認
  const owner = await nft.owner();
  if (owner.toLowerCase() === signer.address.toLowerCase()) {
    throw new Error("Owner should use ownerMint.js script");
  }

  console.log("Minting NFT...");
  const tx = await nft.mint({ value: ethers.parseEther("0.000001") });
  await tx.wait();
  
  const balance = await nft.balanceOf(signer.address);
  console.log("Minting successful!");
  console.log("Your NFT balance:", balance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 