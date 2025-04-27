'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Web3Context';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface FaucetProps {
  onBalanceUpdate: () => void;
  faucetBalance: string;
}

const Faucet: React.FC<FaucetProps> = ({ onBalanceUpdate, faucetBalance }) => {
  const { account, web3 } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const requestSepoliaETH = async () => {
    if (!account) {
      toast.error('ウォレットを接続してください');
      return;
    }

    if (Number(faucetBalance) < 0.01) {
      toast.error('フォーセットの残高が不足しています。送金できません。');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/faucet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: account,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'フォーセットのリクエストに失敗しました');
      }

      // トランザクションの完了を待つ
      if (web3) {
        let receipt = null;
        while (!receipt) {
          receipt = await web3.eth.getTransactionReceipt(data.transactionHash);
          if (!receipt) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2秒待機
          }
        }
        
        // 成功メッセージを表示
        toast.success(
          <div>
            <p>0.01 sepoETHの送金が完了しました！</p>
            <p className="text-sm mt-1">
              トランザクション: 
              <a 
                href={`https://sepolia.etherscan.io/tx/${data.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline"
              >
                {data.transactionHash.slice(0, 6)}...{data.transactionHash.slice(-4)}
              </a>
            </p>
          </div>
        );

        // 残高を更新
        const weiBalance = await web3.eth.getBalance(account);
        const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
        toast.info(`現在の残高: ${Number(ethBalance).toFixed(4)} sepoETH`);
        // 親コンポーネントに残高更新を通知
        onBalanceUpdate();
      }
    } catch (error: any) {
      console.error('フォーセットエラー:', error);
      toast.error(error.message || 'エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-lg border border-white/10">
      <h2 className="text-xl font-bold mb-4">Sepolia ETH Fauset</h2>
      <p className="text-gray-400 mb-4">
        NFTをミントするために必要なSepolia ETHを取得できます。
        24時間に1回、開発者に0.01 sepoETHをリクエストできます。
      </p>
      <div className="mb-4">
        <p className="text-sm text-gray-400">
          dev wallet 残高: {faucetBalance} sepoETH
          {Number(faucetBalance) < 0.01 && (
            <span className="text-red-400 ml-2">※ 残高不足のため送金できません</span>
          )}
        </p>
      </div>
      <button
        onClick={requestSepoliaETH}
        disabled={isLoading || !account || Number(faucetBalance) < 0.01}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            処理中...
          </>
        ) : (
          'Sepolia ETHを取得'
        )}
      </button>
    </div>
  );
};

export default Faucet; 