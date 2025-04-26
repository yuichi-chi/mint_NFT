require('dotenv').config();
const hre = require("hardhat");

async function main() {
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    const walletAddress = process.env.WALLET_ADDRESS; // ウォレットアドレスを.envファイルに追加してください

    if (!contractAddress || !walletAddress) {
        console.error('Error: Contract address or wallet address not found in environment variables');
        process.exit(1);
    }

    console.log("コントラクトアドレス:", contractAddress);
    console.log("ウォレットアドレス:", walletAddress);

    // コントラクトに接続
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.attach(contractAddress);

    try {
        // ウォレットが所有するNFTの数を取得
        const balance = await nft.balanceOf(walletAddress);
        console.log(`\nウォレットが所有するNFTの数: ${balance}`);

        // 各NFTのトークンIDを取得
        console.log("\n所有するNFTのトークンID:");
        for (let i = 0; i < balance; i++) {
            const tokenId = await nft.tokenOfOwnerByIndex(walletAddress, i);
            console.log(`NFT ${i + 1}: Token ID = ${tokenId}`);
        }
    } catch (error) {
        console.error("エラー:", error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 