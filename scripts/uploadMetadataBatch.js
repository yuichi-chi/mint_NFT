require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Pinataの認証情報
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

async function uploadFileToPinata(filePath, fileName) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), {
        filepath: fileName
    });

    try {
        const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'pinata_api_key': PINATA_API_KEY,
                'pinata_secret_api_key': PINATA_SECRET_KEY
            },
            maxBodyLength: Infinity
        });
        return response.data.IpfsHash;
    } catch (error) {
        console.error('アップロードエラー:', error.response ? error.response.data : error);
        throw error;
    }
}

async function main() {
    const metadataDir = path.join(__dirname, '../metadata');
    const batchSize = 50; // 一度にアップロードするファイル数
    const files = fs.readdirSync(metadataDir)
        .filter(file => file.endsWith('.json'))
        .sort((a, b) => parseInt(a) - parseInt(b));

    console.log(`全${files.length}個のメタデータファイルを処理します。`);
    
    const results = {};
    for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);
        console.log(`\nバッチ ${Math.floor(i/batchSize) + 1}/${Math.ceil(files.length/batchSize)} を処理中...`);
        
        for (const file of batch) {
            const filePath = path.join(metadataDir, file);
            try {
                console.log(`${file} をアップロード中...`);
                const hash = await uploadFileToPinata(filePath, file);
                results[file] = hash;
                console.log(`成功: ${file} -> ${hash}`);
            } catch (error) {
                console.error(`${file} のアップロードに失敗しました`);
            }
        }
    }

    // 結果をファイルに保存
    const resultPath = path.join(__dirname, '../metadata_hashes.json');
    fs.writeFileSync(resultPath, JSON.stringify(results, null, 2));
    console.log(`\n結果を保存しました: ${resultPath}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 