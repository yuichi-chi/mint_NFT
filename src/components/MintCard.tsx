'use client';

import { useWeb3 } from '@/context/Web3Context';
import { Loader2, WalletIcon } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { generateNFTImage } from '@/utils/imageGenerator';

type MintStatus = 'idle' | 'signing' | 'pending' | 'success' | 'error';

export default function MintCard() {
  const { account, connectWallet, mintNFT, contract } = useWeb3();
  const [mintStatus, setMintStatus] = useState<MintStatus>('idle');
  const [hasNFT, setHasNFT] = useState(false);
  const [nftImage, setNftImage] = useState<string>('/nft-base.png');
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [imageError, setImageError] = useState(false);

  // 画像を生成して表示する関数
  const updateNFTImage = useCallback(async (id: number) => {
    try {
      console.log('Generating image for token:', id);
      const imageBlob = await generateNFTImage(id);
      const imageUrl = URL.createObjectURL(imageBlob);
      console.log('Generated image URL:', imageUrl);
      setNftImage(imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error generating NFT image:', error);
      setNftImage('/nft-base.png');
      return null;
    }
  }, []);

  // NFTの所持状態とデータをチェック
  useEffect(() => {
    const checkNFTBalance = async () => {
      if (contract && account) {
        try {
          const balance = await contract.methods.balanceOf(account).call();
          const hasToken = Number(balance) > 0;
          setHasNFT(hasToken);

          if (hasToken) {
            try {
              // tokenOfOwnerByIndexを使用してトークンIDを取得
              const tokenId = await contract.methods.tokenOfOwnerByIndex(account, 0).call();
              setTokenId(Number(tokenId));
              const imageUrl = await updateNFTImage(Number(tokenId));
              if (imageUrl) {
                return () => {
                  console.log('Cleaning up image URL:', imageUrl);
                  URL.revokeObjectURL(imageUrl);
                };
              }
            } catch (error) {
              console.error('Error getting token ID:', error);
              setNftImage('/nft-base.png');
            }
          } else {
            setNftImage('/nft-base.png');
          }
        } catch (error) {
          console.error('NFT balance check error:', error);
          setNftImage('/nft-base.png');
        }
      } else {
        setNftImage('/nft-base.png');
      }
    };

    checkNFTBalance();
  }, [contract, account, updateNFTImage]);

  const handleMint = async () => {
    if (!mintNFT) {
      toast.error('ミント機能が利用できません。');
      return;
    }

    try {
      setMintStatus('signing');
      const tx = await mintNFT();
      
      if (tx) {
        toast.success('NFTのミントが完了しました！');
        setMintStatus('success');
        setHasNFT(true);
      }
    } catch (error: any) {
      console.error('Mint error:', error);
      setMintStatus('error');
      
      // エラーメッセージの処理
      let errorMessage = 'ミント中にエラーが発生しました。';
      
      if (error.message) {
        if (error.message.includes('already minted')) {
          errorMessage = 'このウォレットはすでにNFTをミント済みです。';
        } else if (error.message.includes('insufficient funds')) {
          errorMessage = '残高が不足しています。';
        } else if (error.message.includes('gas required exceeds allowance')) {
          errorMessage = 'ガス代が不足しています。';
        } else if (error.message.includes('cancelled')) {
          errorMessage = 'トランザクションがキャンセルされました。';
        } else if (error.message.includes('ウォレットを接続してください')) {
          errorMessage = 'ウォレットを接続してください。';
        } else if (error.message.includes('ガス見積もりエラー')) {
          errorMessage = 'ガス代の見積もりに失敗しました。';
        } else if (error.message.includes('トランザクションエラー')) {
          errorMessage = 'トランザクションの送信に失敗しました。';
        } else if (error.message.includes('トランザクションレシート')) {
          errorMessage = 'トランザクションの確認に失敗しました。';
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    }
  };

  const getMintButtonText = () => {
    if (!account) return 'Connect Wallet';
    if (hasNFT) return 'ミント済み';
    
    switch (mintStatus) {
      case 'signing':
        return '署名を待っています...';
      case 'pending':
        return 'トランザクション処理中...';
      case 'success':
        return 'ミント成功！';
      case 'error':
        return 'ミント失敗';
      default:
        return 'Mint NFT (0.000001 sepoETH)';
    }
  };

  const getMintButtonStyle = () => {
    if (!account) {
      return 'bg-gradient-to-r from-blue-500 to-purple-600';
    }
    if (hasNFT) {
      return 'bg-gray-500 cursor-not-allowed';
    }
    if (mintStatus === 'success') {
      return 'bg-gradient-to-r from-green-500 to-green-700';
    }
    if (mintStatus === 'error') {
      return 'bg-gradient-to-r from-red-500 to-red-700';
    }
    return 'bg-gradient-to-r from-blue-500 to-purple-600';
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)]
                    border border-white/10 transition-all duration-300
                    hover:shadow-[0_8px_30px_rgba(0,255,255,0.1)]">
        {/* NFT画像 */}
        <div className="aspect-square rounded-xl overflow-hidden mb-6 
                      bg-gradient-to-br from-blue-500/20 to-purple-600/20 
                      border border-white/10 relative">
          <img
            key={nftImage}
            src={imageError ? '/nft-base.png' : nftImage}
            alt="NFT Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Image load error:', e);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', nftImage);
              setImageError(false);
            }}
          />
          {hasNFT && tokenId && (
            <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-sm">
              #{tokenId}
            </div>
          )}
        </div>

        {/* NFT情報 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Portfolio NFT Collectible</h2>
          <p className="text-white/80">
            期間限定NFTコレクションの特別なデジタルアート。
            {!account ? 'ウォレットを接続してミントを開始しましょう。' :
             hasNFT ? 'このウォレットはすでにNFTをミント済みです。' :
             '0.000001 sepoETH でミント可能です。'}
          </p>

          {/* ミント/接続ボタン */}
          <button
            onClick={account ? handleMint : connectWallet}
            disabled={Boolean(account) && (mintStatus !== 'idle' || hasNFT)}
            className={`w-full py-3 px-4 rounded-xl font-medium
                     transition-all duration-200
                     ${getMintButtonStyle()}
                     ${!hasNFT && 'hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]'}
                     disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            <span className="flex items-center justify-center">
              {!account && <WalletIcon className="w-5 h-5 mr-2" />}
              {(mintStatus === 'signing' || mintStatus === 'pending') && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              {getMintButtonText()}
            </span>
          </button>

          {/* ステータス表示 */}
          {mintStatus === 'pending' && (
            <div className="mt-4 text-center">
              <div className="text-sm text-white/60">
                トランザクションの確認を待っています...
                <br />
                MetaMaskで進行状況を確認できます
              </div>
            </div>
          )}

          {/* NFTが存在する場合、OpenSeaへのリンクを表示 */}
          {hasNFT && tokenId && contract && (
            <div className="text-center">
              <a
                href={`https://testnets.opensea.io/assets/sepolia/${contract._address}/${tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                OpenSeaで表示 ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 