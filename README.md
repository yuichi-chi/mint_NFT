# NFT Minting DApp

Sepoliaテストネットワーク上で動作するNFTミンティングDAppです。Next.jsとHardhatを使用して構築されています。

## 機能

- MetaMaskウォレットとの連携
- SepoliaテストネットワークでのNFTミント
- フォーセット機能（Sepolia ETHの取得）
- NFTのメタデータ管理
- IPFSとの連携

## 必要条件

- Node.js (v16以上)
- MetaMaskウォレット
- SepoliaテストネットワークのETH

## セットアップ

1. リポジトリのクローン
```bash
git clone <リポジトリURL>
cd nft
```

2. 依存関係のインストール
```bash
# プロジェクトルートで
npm install

# frontendディレクトリで
cd frontend
npm install
```

3. 環境変数の設定
`.env.local`ファイルを作成し、以下の変数を設定：
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=あなたのコントラクトアドレス
NEXT_PUBLIC_INFURA_PROJECT_ID=あなたのInfuraプロジェクトID
```

## 使用方法

1. 開発サーバーの起動
```bash
cd frontend
npm run dev
```

2. ブラウザで`http://localhost:3000`にアクセス

3. MetaMaskでSepoliaテストネットワークに接続

4. フォーセットからSepolia ETHを取得

5. NFTをミント

## プロジェクト構造

```
nft/
├── contracts/          # スマートコントラクト
├── frontend/          # Next.jsフロントエンド
├── scripts/           # デプロイ・ミント用スクリプト
├── test/             # テストファイル
└── public/           # 静的ファイル
```

## 技術スタック

- **フロントエンド**
  - Next.js
  - TypeScript
  - Tailwind CSS
  - Web3.js

- **スマートコントラクト**
  - Solidity
  - Hardhat
  - OpenZeppelin

## 開発者向け情報

### コントラクトのデプロイ

1. コントラクトのコンパイル
```bash
npx hardhat compile
```

2. デプロイ
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### メタデータの管理

1. メタデータの生成
```bash
node scripts/generateMetadata.js
```

2. IPFSへのアップロード
```bash
node scripts/uploadToIPFS.js
```

### テストの実行

```bash
npx hardhat test
```

## 注意事項

- このプロジェクトはSepoliaテストネットワーク用です
- 本番環境で使用する場合は、適切なセキュリティ対策を実施してください
- メタデータはIPFSにアップロードする必要があります

## ライセンス

MIT

## 貢献

プルリクエストやイシューは歓迎します。大きな変更の場合は、まずイシューを開いて議論してください 