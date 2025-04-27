'use client';

export default function TestnetInfo() {
  return (
    <div className="mt-8 p-6 bg-white/5 rounded-lg border border-white/10">
      <h3 className="text-lg font-bold mb-4 text-white">Sepolia ETHについて</h3>
      <div className="space-y-4 text-gray-300">
        <p className="text-red-400">
          ※ Sepoliaはイーサリアムのテストネットワークであり、実際の資金は移動されません。
          <br />
          ※ sepoETH fausetで取得したETHはテスト用で、実際の価値はありません。
        </p>
        <p>
          Sepoliaテストネットワークは、Ethereumの開発者向けテスト環境です。
          実際のメインネットと同様の機能を持ちながら、テスト用のETHを使用して安全に開発やテストを行うことができます。
        </p>
        <p>
          テストネットワークでの取引は実際のメインネットには影響しませんが、リスク管理のため新しいアカウントで試すことをお勧めします。
          <br />
          本サイトを通じて発生したいかなる損害・損失についても、当方は一切の責任を負いかねますので、あらかじめご了承ください。
        
        </p>
      </div>
    </div>
  );
} 