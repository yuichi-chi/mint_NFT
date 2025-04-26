require('dotenv').config();
const fs = require('fs');
const path = require('path');

// 新しい画像のIPFSハッシュ
const IMAGE_HASH = "bafybeicemi3w5q2auh5ueqei4d6de3zongfitsgwjhyopje7dkkveqcbuq";

async function main() {
    const metadataDir = path.join(__dirname, '../metadata');
    
    // メタデータディレクトリが存在しない場合は作成
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
    }

    // 577個のメタデータを生成（アップロード済みの数）
    for (let i = 1; i <= 577; i++) {
        const metadata = {
            name: `Grumpy Black Cat #${i}`,
            description: "A mysterious black cat with emerald eyes, known for its perpetually grumpy expression. Despite its stern look, it brings luck to its owner.",
            image: `ipfs://${IMAGE_HASH}`,
            attributes: [
                {
                    trait_type: "Species",
                    value: "Cat"
                },
                {
                    trait_type: "Color",
                    value: "Black"
                },
                {
                    trait_type: "Expression",
                    value: "Grumpy"
                },
                {
                    trait_type: "Eye Color",
                    value: "Emerald"
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