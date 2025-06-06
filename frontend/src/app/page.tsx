'use client';

import { useWeb3 } from '@/context/Web3Context';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TestnetInfo from '@/components/TestnetInfo';
import DevMemo from '@/components/DevMemo';
import MintCard from '@/components/MintCard';

const Faucet = dynamic(() => import('@/components/Faucet'), { ssr: false });

const FAUCET_ADDRESS = '0x3896d8EB3f8F39EDefFa3f570c54570c7761E5fD';

export default function Home() {
  const { account, web3 } = useWeb3();
  const [balance, setBalance] = useState('0');
  const [faucetBalance, setFaucetBalance] = useState('0');

  const fetchBalance = async () => {
    if (!web3 || !account) return;
    try {
      const weiBalance = await web3.eth.getBalance(account);
      const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
      setBalance(Number(ethBalance).toFixed(4));
    } catch (error) {
      console.error('残高取得エラー:', error);
    }
  };

  const fetchFaucetBalance = async () => {
    if (!web3) return;
    try {
      const weiBalance = await web3.eth.getBalance(FAUCET_ADDRESS);
      const ethBalance = web3.utils.fromWei(weiBalance, 'ether');
      setFaucetBalance(Number(ethBalance).toFixed(4));
    } catch (error) {
      console.error('フォーセット残高取得エラー:', error);
    }
  };

  useEffect(() => {
    fetchBalance();
    fetchFaucetBalance();
  }, [web3, account, fetchBalance, fetchFaucetBalance]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchBalance();
      fetchFaucetBalance();
    }, 5000);

    return () => clearInterval(interval);
  }, [web3, account, fetchBalance, fetchFaucetBalance]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header balance={balance} />

      <main className="flex flex-col gap-16 pb-16">
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/20 to-black" />
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000" />
          <div className="relative z-10">
            <MintCard />
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <p className="text-xl text-gray-400">
              SepoliaテストネットワークでNFTをミントしよう！
            </p>
          </div>

          {account && (
            <div className="mb-8 text-center">
              <p className="text-gray-400">現在の残高: {balance} sepoETH</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Faucet onBalanceUpdate={fetchBalance} faucetBalance={faucetBalance} />
          </div>

          <TestnetInfo />
          <DevMemo />
        </div>
      </main>

      <Footer />
    </div>
  );
}
