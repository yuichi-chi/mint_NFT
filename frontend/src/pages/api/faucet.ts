import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';

// フォーセット用の秘密鍵（環境変数から取得）
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const SEPOLIA_RPC_URL = process.env.SEPOLIA_URL || 'https://sepolia.infura.io/v3/';

// 送金制限用のデータベース（実際のプロダクションではデータベースを使用することを推奨）
const lastRequestTime: { [key: string]: number } = {};

// フォーセットの送金元アドレス
const FAUCET_ADDRESS = '0x3896d8EB3f8F39EDefFa3f570c54570c7761E5fD';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: 'アドレスが必要です' });
    }

    // アドレスのバリデーション
    if (!ethers.isAddress(address)) {
      return res.status(400).json({ message: '無効なアドレスです' });
    }

    // 24時間以内のリクエストをチェック
    const now = Date.now();
    const lastRequest = lastRequestTime[address] || 0;
    const timeSinceLastRequest = now - lastRequest;
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (timeSinceLastRequest < twentyFourHours) {
      const remainingTime = Math.ceil((twentyFourHours - timeSinceLastRequest) / (60 * 60 * 1000));
      return res.status(429).json({
        message: `24時間に1回のみリクエストできます。あと${remainingTime}時間お待ちください。`,
      });
    }

    if (!FAUCET_PRIVATE_KEY) {
      throw new Error('フォーセットの秘密鍵が設定されていません');
    }

    // Sepoliaネットワークに接続
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

    // ウォレットアドレスの確認
    if (wallet.address.toLowerCase() !== FAUCET_ADDRESS.toLowerCase()) {
      throw new Error('フォーセットのアドレスが一致しません');
    }

    // 0.01 ETHを送金
    const amount = ethers.parseEther('0.01');
    const tx = await wallet.sendTransaction({
      to: address,
      value: amount,
    });

    // トランザクションの完了を待つ
    await tx.wait();

    // リクエスト時間を記録
    lastRequestTime[address] = now;

    res.status(200).json({
      message: '送金が完了しました',
      transactionHash: tx.hash,
      from: FAUCET_ADDRESS,
    });
  } catch (error: any) {
    console.error('フォーセットエラー:', error);
    res.status(500).json({
      message: error.message || '送金に失敗しました',
    });
  }
} 