'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DevMemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-blue-500/5 rounded-lg mb-3 border border-blue-500/10 flex items-center justify-between hover:bg-blue-500/10 transition-colors"
      >
        <h3 className="text-lg font-bold text-blue-400">Dev memo</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-blue-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-blue-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-6 bg-blue-500/5 rounded-lg border border-blue-500/10 mt-2 mb-12">
          <div className="space-y-4 text-blue-300">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-200">コントラクト情報</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>コントラクトアドレス: {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}</li>
                <li>ネットワーク: Sepoliaテストネットワーク</li>
                <li>IPFS CID: {process.env.NEXT_PUBLIC_IPFS_CID}</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-200">開発環境</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>フロントエンド: Next.js 14 + TypeScript 5.3.3</li>
                <li>UIフレームワーク: Tailwind CSS 3.4.1</li>
                <li>ウォレット接続: Web3.js 4.3.0</li>
                <li>スマートコントラクト: Solidity 0.8.20</li>
                <li>開発フレームワーク: Hardhat 2.19.4</li>
                <li>IPFS: Pinata</li>
                <li>RPCプロバイダー: Alchemy</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-blue-200">反省・改善点/備忘録</h4>
              <ul className="list-disc list-inside space-y-1">
                <li>デプロイ時にURIを設定し忘れたため、NFTの画像がウォレットやOpenSeaで表示されない。本実装時は設定する。
                </li>
                <li>今回は限定的な公開なのでBOT対策をしていない。本実装時はfauset関連の制限を厳格にしたい。&gt;&gt; IP制限 レート制限
                </li>
                <li>
                    今回はmetamask SDK を使い、同walletのみ対応。本実装時はwalletconnectも対応したい。
                </li>
              </ul>　
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 