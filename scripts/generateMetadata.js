require('dotenv').config();
const fs = require('fs');
const path = require('path');

// 環境変数から画像のIPFSハッシュを取得
const IMAGE_HASH = process.env.IPFS_IMAGE_HASH;
if (!IMAGE_HASH) {
    throw new Error("IPFS_IMAGE_HASH is not set in .env file");
}

async function main() {
    const metadataDir = path.join(__dirname, '../metadata');
    
    // メタデータディレクトリが存在しない場合は作成
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
    }

    // 400個のメタデータを生成
    for (let i = 1; i <= 400; i++) {
        const metadata = {
            name: `Portfolio Launch NFT #${i}`,
            description: "This NFT commemorates the launch of my portfolio website. Each token represents a unique piece of digital art celebrating this milestone.",
            image: `ipfs://${IMAGE_HASH}`,
            attributes: [
                {
                    trait_type: "Launch Phase",
                    value: "Early Supporter"
                },
                {
                    trait_type: "Website Version",
                    value: "v1.0"
                },
                {
                    trait_type: "Access Level",
                    value: "VIP"
                },
                {
                    trait_type: "Edition",
                    value: "Limited"
                }
            ]
        };

        const filePath = path.join(metadataDir, `${i}.json`);
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
        console.log(`メタデータ生成完了: ${i}.json`);
    }

    console.log("全メタデータの生成が完了しました！");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 