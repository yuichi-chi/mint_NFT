require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// 環境変数のチェック
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  console.error('Error: Pinata API keys not found in environment variables');
  console.error('Please create a .env file with PINATA_API_KEY and PINATA_SECRET_KEY');
  process.exit(1);
}

// 画像をアップロードする関数
async function uploadImageToPinata(imagePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(imagePath));

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });
        return response.data.IpfsHash;
    } catch (error) {
        console.error('画像のアップロードに失敗しました:', error);
        throw error;
    }
}

// メタデータをアップロードする関数
async function uploadMetadataToPinata(metadata) {
    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
            headers: {
                'Content-Type': 'application/json',
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            }
        });
        return response.data.IpfsHash;
    } catch (error) {
        console.error('メタデータのアップロードに失敗しました:', error);
        throw error;
    }
}

async function main() {
    // assetsディレクトリ内の全画像をアップロード
    const assetsDir = path.join(__dirname, '../assets');
    const files = fs.readdirSync(assetsDir);
    
    for (let i = 0; i < files.length; i++) {
        if (files[i].endsWith('.png') || files[i].endsWith('.jpg') || files[i].endsWith('.jpeg')) {
            const imagePath = path.join(assetsDir, files[i]);
            console.log(`画像 ${files[i]} をアップロード中...`);
            
            try {
                // 画像をアップロード
                const imageHash = await uploadImageToPinata(imagePath);
                console.log(`画像のIPFSハッシュ: ${imageHash}`);

                // メタデータを作成
                const metadata = {
                    name: `Grumpy Cat #${i + 1}`,
                    description: "A grumpy black cat with green eyes, wearing a collar. This cat looks particularly unimpressed.",
                    image: `ipfs://${imageHash}`,
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
                            trait_type: "Eye Color",
                            value: "Green"
                        },
                        {
                            trait_type: "Mood",
                            value: "Grumpy"
                        },
                        {
                            trait_type: "Accessory",
                            value: "Collar"
                        },
                        {
                            trait_type: "Token ID",
                            value: `#${i + 1}`
                        }
                    ]
                };

                // メタデータをアップロード
                const metadataHash = await uploadMetadataToPinata(metadata);
                console.log(`メタデータのIPFSハッシュ: ${metadataHash}`);
                
                // 結果を保存
                const results = {
                    tokenId: i + 1,
                    imageHash,
                    metadataHash,
                    metadataUri: `ipfs://${metadataHash}`
                };
                
                // 結果をJSONファイルに保存
                fs.writeFileSync(
                    path.join(__dirname, `../metadata/${i + 1}.json`),
                    JSON.stringify(results, null, 2)
                );
                
            } catch (error) {
                console.error(`画像 ${files[i]} の処理中にエラーが発生しました:`, error);
            }
        }
    }
}

// スクリプトを実行
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
} 