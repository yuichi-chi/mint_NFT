'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Web3 from 'web3';
import { MetaMaskSDK } from '@metamask/sdk';
import { toast } from 'react-toastify';

interface Web3ContextType {
  web3: Web3 | null;
  account: string | null;
  contract: any | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  mintNFT: () => Promise<any>;
  getNFTData: (tokenId: number) => Promise<string>;
  switchAccount: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | null>(null);

// コントラクトのABIとアドレス
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
if (!CONTRACT_ADDRESS) {
  console.error('コントラクトアドレスが設定されていません。.env.localファイルを確認してください。');
}

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// MetaMaskのイベントの型定義
type EthereumEvents = {
  accountsChanged: string[];
  chainChanged: string;
};

type EthereumProvider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on<K extends keyof EthereumEvents>(
    eventName: K,
    handler: (event: EthereumEvents[K]) => void
  ): void;
  isMetaMask?: boolean;
};

// MMSDKをコンポーネント外でグローバルに初期化
let MMSDK: MetaMaskSDK | null = null;

if (typeof window !== 'undefined') {
  MMSDK = new MetaMaskSDK({
    dappMetadata: {
      name: "NFT Mint App",
      url: window.location.href,
    },
    extensionOnly: true
  });
}

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // MMSDKの初期化
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      MMSDK = new MetaMaskSDK({
        dappMetadata: {
          name: "NFT Mint App",
          url: window.location.href,
        },
        extensionOnly: true
      });
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // コントラクトの初期化
  useEffect(() => {
    if (web3 && account && CONTRACT_ADDRESS) {
      try {
        const contractInstance = new web3.eth.Contract(CONTRACT_ABI as any, CONTRACT_ADDRESS);
        setContract(contractInstance);
      } catch (error) {
        console.error('Contract initialization error:', error);
        toast.error('コントラクトの初期化に失敗しました。');
      }
    }
  }, [web3, account]);

  const connectWallet = async () => {
    if (!MMSDK) {
      console.error('MetaMask SDK is not available');
      toast.error('MetaMaskが利用できません。ブラウザ環境を確認してください。');
      return;
    }

    if (!CONTRACT_ADDRESS) {
      console.error('Contract address is not set');
      toast.error('コントラクトアドレスが設定されていません。');
      return;
    }

    try {
      await MMSDK.connect();
      const provider = MMSDK.getProvider();
      
      if (!provider || !provider.isMetaMask) {
        toast.error("MetaMaskをインストールしてください。");
        return;
      }

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xaa36a7' }], // Sepolia
        });
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18
                },
                rpcUrls: ['https://sepolia.infura.io/v3/'],
                blockExplorerUrls: ['https://sepolia.etherscan.io']
              },
            ],
          });
        } else {
          throw switchError;
        }
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' }) as string[];
      if (!accounts || accounts.length === 0) {
        throw new Error('アカウントが取得できませんでした。');
      }
      
      console.log("Connected account:", accounts[0]);

      const web3Instance = new Web3(provider as any);
      
      // 署名メッセージを作成
      const message = `
NFTミントアプリケーションへようこそ！

このメッセージに署名することで、以下に同意したことになります：
- このアプリケーションがあなたのウォレットアドレスを読み取ること
- NFTをミントする際にトランザクションを送信すること

署名日時: ${new Date().toLocaleString()}
      `.trim();

      try {
        const signature = await web3Instance.eth.personal.sign(
          message,
          accounts[0],
          ''
        );
        console.log('署名成功:', signature);

        const contractInstance = new web3Instance.eth.Contract(
          CONTRACT_ABI,
          CONTRACT_ADDRESS
        );

        setWeb3(web3Instance);
        setAccount(accounts[0]);
        setContract(contractInstance);

        // イベントリスナーの設定
        provider.on('accountsChanged', (newAccounts: unknown) => {
          if (Array.isArray(newAccounts)) {
            setAccount(newAccounts[0] || null);
          }
        });

        provider.on('chainChanged', () => {
          window.location.reload();
        });
      } catch (error) {
        console.error('署名エラー:', error);
        alert('ウォレットの接続には署名が必要です。');
      }
    } catch (error) {
      console.error('接続エラー:', error);
      toast.error('ウォレットの接続に失敗しました。');
    }
  };

  const disconnectWallet = () => {
    setWeb3(null);
    setAccount(null);
    setContract(null);
    
    // LocalStorageからも接続情報を削除
    localStorage.removeItem('walletConnected');
    
    toast.info('ウォレットを切断しました');
  };

  // 自動再接続の処理
  useEffect(() => {
    const wasConnected = localStorage.getItem('walletConnected');
    if (wasConnected === 'true') {
      connectWallet();
    }
  }, []);

  // 接続状態を保存
  useEffect(() => {
    if (account) {
      localStorage.setItem('walletConnected', 'true');
    }
  }, [account]);

  const mintNFT = async () => {
    if (!contract || !account) {
      throw new Error('ウォレットを接続してください。');
    }

    if (!CONTRACT_ADDRESS) {
      throw new Error('コントラクトアドレスが設定されていません。');
    }

    try {
      // NFTの所持数をチェック
      const balance = await contract.methods.balanceOf(account).call();
      if (Number(balance) > 0) {
        throw new Error('このウォレットはすでにNFTをミント済みです。');
      }

      const mintPrice = '1000000000000'; // 0.000001 ETH in wei
      
      console.log('Estimating gas...');
      // ガス見積もりを取得
      const gasEstimate = await contract.methods.mint().estimateGas({
        from: account,
        value: mintPrice
      }).catch((error: any) => {
        console.error('Gas estimation error:', error);
        throw new Error(`ガス見積もりエラー: ${error.message || JSON.stringify(error)}`);
      });

      console.log('Estimated gas:', gasEstimate);

      // ガス制限を設定（見積もりの1.2倍）
      const gasLimit = Math.ceil(Number(gasEstimate) * 1.2).toString();
      console.log('Gas limit:', gasLimit);

      console.log('Sending transaction...');
      
      // トランザクションを送信
      const tx = await contract.methods.mint().send({
        from: account,
        value: mintPrice,
        gas: gasLimit,
        maxFeePerGas: null,
        maxPriorityFeePerGas: null
      }).catch((error: any) => {
        console.error('Transaction error:', error);
        throw new Error(`トランザクションエラー: ${error.message || JSON.stringify(error)}`);
      });

      console.log('Transaction hash:', tx.transactionHash);
      
      // トランザクションのレシートを待つ
      console.log('Waiting for transaction receipt...');
      const receipt = await web3?.eth.getTransactionReceipt(tx.transactionHash);
      
      if (!receipt) {
        throw new Error('トランザクションレシートが取得できませんでした。');
      }

      console.log('Transaction receipt:', receipt);

      if (receipt.status) {
        console.log('Mint successful!');
        
        // NFTをMetaMaskに追加
        try {
          const tokenId = 1; // 固定のトークンID
          const currentProvider = MMSDK?.getProvider();
          
          if (!currentProvider) {
            throw new Error('Provider not available');
          }

          // MetaMaskにNFTコレクションを追加
          await currentProvider.request({
            method: 'wallet_watchAsset',
            params: {
              type: 'ERC721',
              options: {
                address: CONTRACT_ADDRESS,
              },
            },
          });

          console.log('NFT collection added to MetaMask');

          // OpenSeaのURLをコンソールに出力
          console.log('View on OpenSea:', `https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${tokenId}`);
        } catch (watchError) {
          console.error('Failed to add NFT to MetaMask:', watchError);
          // NFTの追加に失敗してもミント自体は成功しているので、エラーはスローしない
        }

        // トランザクション完了後にNFTの所持状態を更新
        const newBalance = await contract.methods.balanceOf(account).call();
        if (Number(newBalance) > 0) {
          console.log('NFT balance updated:', newBalance);
        }

        return tx;
      } else {
        throw new Error('トランザクションは送信されましたが、失敗しました。');
      }
    } catch (error: any) {
      console.error('Mint error details:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack,
        receipt: error.receipt,
        transaction: error.transaction
      });
      
      let errorMessage = '';
      
      if (error.code === 4001) {
        errorMessage = 'トランザクションがキャンセルされました。';
      } else if (error.message) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = '残高が不足しています。';
        } else if (error.message.includes('gas required exceeds allowance')) {
          errorMessage = 'ガス代が不足しています。';
        } else if (error.message.includes('already minted')) {
          errorMessage = 'このウォレットはすでにNFTをミント済みです。';
        } else if (error.message.includes('コントラクトアドレス')) {
          errorMessage = 'コントラクトアドレスが設定されていません。';
        } else {
          errorMessage = `エラー: ${error.message}`;
        }
      } else if (error.data?.message) {
        errorMessage = `コントラクトエラー: ${error.data.message}`;
      } else {
        errorMessage = `不明なエラーが発生しました: ${JSON.stringify(error)}`;
      }

      throw new Error(errorMessage);
    }
  };

  const getNFTData = async (tokenId: number) => {
    if (!contract) {
      throw new Error('コントラクトが初期化されていません。');
    }

    try {
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      return tokenURI;
    } catch (error) {
      console.error('NFTデータの取得エラー:', error);
      throw error;
    }
  };

  // アカウント切り替え関数を追加
  const switchAccount = async () => {
    if (!MMSDK) {
      toast.error('MetaMaskが利用できません。');
      return;
    }

    try {
      const provider = MMSDK.getProvider();
      if (!provider) {
        toast.error('MetaMaskが利用できません。');
        return;
      }

      await provider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      });
    } catch (error) {
      console.error('アカウント切り替えエラー:', error);
      toast.error('アカウントの切り替えに失敗しました。');
    }
  };

  return (
    <Web3Context.Provider value={{ 
      web3, 
      account, 
      contract,
      connectWallet, 
      disconnectWallet,
      mintNFT,
      getNFTData,
      switchAccount
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}; 