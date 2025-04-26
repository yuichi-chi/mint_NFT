const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Checking status for account:", signer.address);

  const contractAddress = "0xfE80bba25E7847BAbaB58048648bAE1Ef8BC3Ab9";
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const nft = MyNFT.attach(contractAddress);

  // オーナーかどうかを確認
  const owner = await nft.owner();
  console.log("Is owner:", owner.toLowerCase() === signer.address.toLowerCase());

  // 既にミントしているかを確認
  const mintCount = await nft.mintCount(signer.address);
  console.log("Mint count:", mintCount.toString());

  // 総供給量を確認
  const totalSupply = await nft.totalSupply();
  const maxSupply = await nft.MAX_SUPPLY();
  console.log("Total supply:", totalSupply.toString(), "/", maxSupply.toString());

  // ミント価格を確認
  const mintPrice = await nft.MINT_PRICE();
  console.log("Mint price:", ethers.formatEther(mintPrice), "ETH");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 