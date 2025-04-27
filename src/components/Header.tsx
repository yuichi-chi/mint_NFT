'use client';

import { useWeb3 } from '@/context/Web3Context';
import { WalletIcon, LogOut, Copy, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';

interface HeaderProps {
  balance: string;
}

export default function Header({ balance }: HeaderProps) {
  const { account, connectWallet, disconnectWallet, switchAccount } = useWeb3();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleCopyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      toast.success('アドレスをコピーしました');
    }
  };

  const handleConnectWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);

    try {
      // まず通常の接続を試みる（署名を含む）
      await connectWallet();
    } catch (error) {
      console.error('Initial connection error:', error);
      try {
        // 接続に失敗した場合、アカウント選択を試みる
        await switchAccount();
        // アカウント選択後、再度接続を試みる
        await connectWallet();
      } catch (switchError) {
        console.error('Account switch error:', switchError);
        toast.error('ウォレットの接続に失敗しました。');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // クリック外でドロップダウンを閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              NFT Mint
            </h1>
          </div>

          {/* 残高とウォレット接続ボタン */}
          <div className="flex items-center gap-4">
            {account && (
              <div className="text-white/80 font-mono">
                balance: {balance} sepoETH
              </div>
            )}
            <div className="relative" ref={dropdownRef}>
              {!account ? (
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="inline-flex items-center px-4 py-2 rounded-lg
                           bg-gradient-to-r from-blue-500 to-purple-600
                           text-white font-medium
                           transition-all duration-200
                           hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <WalletIcon className="w-5 h-5 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </button>
              ) :
                <>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="px-4 py-2 rounded-lg bg-white/10 text-white/90 font-mono
                             hover:bg-white/20 transition-all duration-200"
                  >
                    {shortenAddress(account)}
                  </button>

                  {/* ドロップダウンメニュー */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/90 backdrop-blur-lg
                                  border border-white/10 shadow-lg overflow-hidden">
                      <div className="p-2 space-y-1">
                        <button
                          onClick={() => {
                            handleCopyAddress();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-white/80
                                   hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          アドレスをコピー
                        </button>
                        <button
                          onClick={() => {
                            switchAccount();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-white/80
                                   hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          アカウントを変更
                        </button>
                        <button
                          onClick={() => {
                            disconnectWallet();
                            setIsDropdownOpen(false);
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-400
                                   hover:bg-white/10 rounded-lg transition-colors duration-200"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          切断する
                        </button>
                      </div>
                    </div>
                  )}
                </>
              }
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 