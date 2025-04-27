const hre = require("hardhat");
require('dotenv').config();

async function main() {
  // コントラクトの取得
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");
  const nft = await MyNFT.attach(process.env.NFT_CONTRACT_ADDRESS);

  // トークンIDの取得
  const tokenId = process.argv[2] || 1;
  console.log(`Checking metadata for token ID: ${tokenId}`);

  try {
    // トークンURIの取得
    const tokenURI = await nft.tokenURI(tokenId);
    console.log("\nToken URI:", tokenURI);

    // IPFSゲートウェイを使用してメタデータを取得
    const gateway = process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs/";
    const metadataUrl = tokenURI.replace("ipfs://", gateway);
    console.log("\nMetadata URL:", metadataUrl);

    // メタデータの取得
    const response = await fetch(metadataUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }
    const metadata = await response.json();
    console.log("\nMetadata:", JSON.stringify(metadata, null, 2));

    // 画像URLの確認
    const imageUrl = metadata.image.replace("ipfs://", gateway);
    console.log("\nImage URL:", imageUrl);

    // 画像の存在確認
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.log("\n⚠️ Warning: Image not found or inaccessible");
    } else {
      console.log("\n✅ Image is accessible");
    }

  } catch (error) {
    console.error("\nError:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 