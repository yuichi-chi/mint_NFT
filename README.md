# NFT Mint App

## NFT画像とメタデータの設定手順

### 1. IPFSへのアップロード

1. NFT画像の準備
   - `assets/images/` ディレクトリに画像ファイルを配置
   - 推奨フォーマット: PNG, 1500x1500px

2. [Pinata](https://www.pinata.cloud/)でアカウントを作成

3. 画像のアップロード
   - Pinataにログイン
   - "Upload" → "File"を選択
   - 画像ファイルをアップロード
   - アップロード後、CIDをコピー

4. メタデータの更新
   - `public/metadata/1.json`の`image`フィールドを更新
   - `ipfs://あなたの画像のCID/ファイル名`の形式で設定

5. メタデータのアップロード
   - 更新したメタデータJSONファイルをPinataにアップロード
   - 取得したCIDをスマートコントラクトの`tokenURI`として使用

### 2. ローカルでのテスト

1. 画像の配置
   ```bash
   cp your-image.png public/nft-preview.png
   ```

2. メタデータの確認
   ```bash
   cat public/metadata/1.json
   ```

### 3. 本番環境での注意点

- IPFSにアップロードした画像とメタデータは永続的に保存されます
- Pinataで "Pin" 状態を維持することが重要です
- バックアップとしてローカルにもファイルを保管してください

### 4. 画像の要件

- 推奨サイズ: 1500x1500px
- 最大ファイルサイズ: 10MB
- サポートフォーマット: PNG, JPG, GIF
- アスペクト比: 1:1 (正方形)

### 5. メタデータの構造

```json
{
  "name": "コレクション名 #トークンID",
  "description": "NFTの説明",
  "image": "ipfs://CID/filename.png",
  "attributes": [
    {
      "trait_type": "属性名",
      "value": "値"
    }
  ]
}
```

## 開発者向け情報

スマートコントラクトの`tokenURI`関数は、以下の形式のURIを返す必要があります：
```
ipfs://あなたのメタデータのCID/1.json
```

これにより、OpenSeaなどのNFTマーケットプレイスで正しく表示されます。 