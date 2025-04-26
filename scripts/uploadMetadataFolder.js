require('dotenv').config();
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Pinataの認証情報
const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

async function uploadFolderToPinata(folderPath) {
    const formData = new FormData();
    
    // フォルダ内のすべてのファイルを追加
    const files = fs.readdirSync(folderPath);
    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const fileStream = fs.createReadStream(filePath);
        formData.append('file', fileStream, {
            filepath: file // ファイル名を保持
        });
    }

    try {
        console.log("フォルダをIPFSにアップロード中...");
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
    
    try {
        // メタデータフォルダ全体をアップロード
        const folderHash = await uploadFolderToPinata(metadataDir);
        console.log('メタデータフォルダのIPFSハッシュ:', folderHash);
        
        // 新しいベースURIを表示
        console.log('新しいベースURI:', `ipfs://${folderHash}/`);
        
        // 確認用のメッセージ
        console.log('\nこのハッシュを使用してベースURIを更新してください。');
        console.log('スクリプト実行例:');
        console.log(`METADATA_CID=${folderHash} npx hardhat run scripts/updateBaseURI.js --network sepolia`);
    } catch (error) {
        console.error('エラー:', error);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 