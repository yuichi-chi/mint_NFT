'use client';

import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const WalletConnect: React.FC = () => {
  const { account, connectWallet, disconnectWallet } = useWeb3();

  return (
    <div className="flex flex-col items-center gap-4">
      {account ? (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-600">接続中のアドレス:</p>
          <p className="font-mono text-sm bg-gray-100 p-2 rounded">{account}</p>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            切断する
          </button>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <img
            src="/metamask-fox.svg"
            alt="MetaMask"
            className="w-5 h-5"
          />
          MetaMaskで接続
        </button>
      )}
    </div>
  );
};

export default WalletConnect; 