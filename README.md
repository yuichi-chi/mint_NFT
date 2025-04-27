# NFTコントラクトデプロイ手順書　NFT Contract Deployment Guide

このドキュメントでは、NFTコントラクトのSepoliaテストネットワークへのデプロイ手順を詳細に説明します。  
This document provides a detailed guide on how to deploy an NFT contract to the Sepolia test network.  
開発者のデプロイしたNFTは [https://mint-nft-2b4c.vercel.app/](https://mint-nft-2b4c.vercel.app/) でミントできます。

## 目次
1. [前提条件](#前提条件)
2. [Gitからのダウンロード](#gitからのダウンロード)
3. [必要なライブラリのインストール](#必要なライブラリのインストール)
4. [Alchemyのセットアップ](#alchemyのセットアップ)
5. [環境変数の設定](#環境変数の設定)
6. [デプロイ手順](#デプロイ手順)
7. [デプロイ後の確認](#デプロイ後の確認)
8. [トラブルシューティング](#トラブルシューティング)
9. [セキュリティガイドライン](#セキュリティガイドライン)

## 前提条件

### 必要なソフトウェア
- Node.js (v16以上)
  - https://nodejs.org/ からダウンロード
- MetaMaskウォレット
  - https://metamask.io/ からブラウザ拡張機能をインストール
  - アカウントを作成し、秘密鍵を安全に保管(`.env`に後で記載するため)

## Gitからのダウンロード

1. **リポジトリのクローン**
```bash
# プロジェクトディレクトリで実行
git clone https://github.com/yuichi-chi/mint_NFT.git
cd mint_NFT
```

## 必要なライブラリのインストール

### 1. プロジェクトの初期化
```bash
# プロジェクトルートで実行
npm init -y
```

### 2. Hardhatと関連ライブラリのインストール
```bash
# スマートコントラクト開発用
npm install --save-dev @nomicfoundation/hardhat-toolbox hardhat #スマコンのコンパイル・デプロイ用開発環境
npm install --save-dev @nomicfoundation/hardhat-verify
npm install --save-dev hardhat-gas-reporter
npm install --save-dev ethers #ブロックチェーン接続に使用
npm install --save-dev @typechain/ethers-v6 #以下ts用
npm install --save-dev @typechain/hardhat
npm install --save-dev typechain
npm install --save-dev typescript
npm install --save-dev ts-node
# OpenZeppelinコントラクト
npm install @openzeppelin/contracts
# 環境変数管理
npm install dotenv
# IPFS関連(NFTサムネイル設定用)
npm install ipfs-http-client form-data axios
```

### 3. プロジェクト構造の確認
以下のような構造になっていることを確認：
```
root/
├── contracts/          # スマートコントラクト
├── frontend/           # ウェブ表示用
├── scripts/           # デプロイスクリプト
├── .env.example      # 環境変数を保管
├── hardhat.config.js # Hardhat設定
└── package.json      # 依存関係
```

### 4. .env.exampleを編集
`.env.example`をrenameし `.env`に変更
metamask の private_key を`.env`に保存


## Alchemyのセットアップ

1. **Alchemyアカウントの作成**
   - https://www.alchemy.com/ にアクセス
   - アカウントを作成

2. **APIキーの取得**
   - ダッシュボードで「Create New App」をクリック
   - 以下の情報を入力：
     - App Name: ***(=your project name)
     - use case: NFTs
     - Chain: Ethereum
   - 「Create App」をクリック
   - network tab:Mainnet > sepolia に変更
   - https://eth-sepolia.g.alchemy.com/v2/your_api_key を`.env`に保存


### Pinataのセットアップ

1. **アカウントの作成**
   - https://app.pinata.cloud/ にアクセス
   - 「Sign Up」をクリックしてアカウントを作成

2. **APIキーの取得**
   - ダッシュボードにログイン
   - 「API Keys」タブをクリック
   - 「New Key」をクリック
   - キー名を入力（例：NFT-Minting）
   - 生成されたAPIキーとシークレットキーをコピー
   - `.env`ファイルの`PINATA_API_KEY`と`PINATA_SECRET_KEY`に保存


## metadata作成
今回はすべてのNFTで同じ画像を使用（※Pinataのファイル数上限が500のため）
   - それぞれ異なる画像を設定する場合はそれぞれのCIDをメタデータに含める必要がある
NFT用画像をPinataのFILESにアップロードし、取得したCIDを`.env`に保存
```bash
node scripts/generateMetadata.js
```
   - この作成した400個のメタデータを "metadata" フォルダごと pinata にアップロードする
      - "+ add" ボタンからアップロード可能
   - "metadata"フォルダのCIDを取得し`.env`に保存

   
## デプロイ手順

1. **Sepolia ETHの取得**
   - fauset サイトから sepolia ETH を入手する。デプロイにはガス代が必要。
      - https://docs.metamask.io/developer-tools/faucet/ #メインネットでの活動量による
      - https://www.alchemy.com/faucets/ethereum-sepolia #メインネットで0.001ETH保有
      - https://cloud.google.com/application/web3/faucet/ethereum/sepolia #メインネットで0.001ETH保有
      - https://sepolia-faucet.pk910.de/#/ #これが一番効率がいい。2.5sepoETH/12h

2. **コントラクトのコンパイル**
root/contracts/MyNFT.sol を編集することでNFTの設定を変更できる。
   -例) max_supply, mint_price 等
```bash
npx hardhat compile
```

3. **デプロイの実行**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

## デプロイ後の確認

1. **Alchemy Explorerでの確認**
   - https://dashboard.alchemy.com/ にアクセス
   - アプリを選択
   - 「Explorer」タブでトランザクションを確認

3. **環境変数の更新**
   - デプロイ後に表示されるコントラクトアドレスを`.env`に保存



### よくある問題と解決策

1. **接続エラー**
   - AlchemyのAPIキーが正しいか確認
   - ネットワーク設定が正しいか確認
   - アカウントに十分なETHがあるか確認

2. **ガス関連のエラー**
   - ガス設定を調整：
     ```javascript
     // hardhat.config.jsに追加
     networks: {
       sepolia: {
         url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
         accounts: [process.env.PRIVATE_KEY],
         gasPrice: await ethers.provider.getGasPrice(),
         gas: 5000000
       }
     }
     ```

3. **コンパイルエラー**
   - Solidityのバージョンを確認
   - 依存関係のバージョンを確認
   - キャッシュをクリア：
     ```bash
     npx hardhat clean
     ```

## セキュリティガイドライン

1. **秘密鍵の管理**
   - `.env`ファイルは`.gitignore`に追加されていることを確認
   - 秘密鍵は絶対に公開しない
   - 定期的にキーをローテーション

2. **APIキーの管理**
   - 環境変数を使用
   - キーをバージョン管理に含めない
   - 必要最小限の権限を設定

3. **レート制限の管理**
   - Alchemyのダッシュボードで使用量を監視
   - 必要に応じてプランをアップグレード

## 追加リソース

- [Alchemy Documentation](https://docs.alchemy.com/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Etherscan Sepolia](https://sepolia.etherscan.io/)

## 注意事項

- この手順書はSepoliaテストネットワーク用です
- 本番環境で使用する場合は、適切なセキュリティ対策を実施してください
- デプロイ前に十分なテストを実施してください 
