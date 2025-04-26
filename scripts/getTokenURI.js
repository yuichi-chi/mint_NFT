const hre = require("hardhat");

async function main() {
  const contractAddress = "0xfE80bba25E7847BAbaB58048648bAE1Ef8BC3Ab9";
  const tokenId = 1;

  // コントラクトのABIを取得
  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.attach(contractAddress);

  try {
    // tokenURIを取得
    const uri = await nft.tokenURI(tokenId);
    console.log(`Token URI for token ${tokenId}:`, uri);

    // URIの内容を取得
    if (uri.startsWith('http')) {
      const response = await fetch(uri);
      const metadata = await response.json();
      console.log('Metadata:', metadata);
    } else {
      console.log('URI content:', uri);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 