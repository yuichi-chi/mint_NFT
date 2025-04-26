require('dotenv').config();
const hre = require("hardhat");

async function main() {
    // コントラクトのアドレスを環境変数から取得
    const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
        console.error('Error: NFT_CONTRACT_ADDRESS not found in environment variables');
        process.exit(1);
    }

    console.log("コントラクトアドレス:", contractAddress);

    // コントラクトに接続
    const MyNFT = await hre.ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.attach(contractAddress);

    // 新しいメタデータフォルダのCIDを使用
    const newBaseURI = "ipfs://bafybeifrf47fzggf3bpz2bn4so734adi4v3ca2rhptlr22cvrzu3cm6gju/";
    
    console.log("現在のベースURIを確認中...");
    try {
        const currentURI = await nft.baseURI();
        console.log("現在のベースURI:", currentURI);
    } catch (error) {
        console.log("現在のベースURIの取得に失敗しました");
    }
    
    console.log("新しいベースURIを設定中...");
    console.log("新しいベースURI:", newBaseURI);
    
    const tx = await nft.setBaseURI(newBaseURI);
    console.log("トランザクション送信完了。確認待ち...");
    console.log("トランザクションハッシュ:", tx.hash);
    
    await tx.wait();
    console.log("トランザクション確認完了！");
    
    console.log("更新後のベースURIを確認中...");
    const updatedURI = await nft.baseURI();
    console.log("更新後のベースURI:", updatedURI);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("エラー:", error);
        process.exit(1);
    }); 