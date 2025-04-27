export const generateNFTImage = async (tokenId: number): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      console.log('Base image loaded successfully');
      // キャンバスサイズを画像に合わせる
      canvas.width = img.width;
      canvas.height = img.height;

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // 画像を描画
      ctx.drawImage(img, 0, 0);

      // テキストのスタイル設定
      const fontSize = Math.floor(canvas.width * 0.12); // 画像幅の12%
      ctx.font = `bold ${fontSize}px 'Sora', Arial, sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';

      // テキストを描画する位置（右下から5%マージン）
      const text = `#${tokenId}`;
      const margin = canvas.width * 0.05;
      const x = canvas.width - margin;
      const y = canvas.height - margin;

      // 縁取りの太さ（フォントサイズの3%）
      const strokeWidth = Math.max(Math.floor(fontSize * 0.03), 2);

      // 縁取りを描画
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = '#000000';
      ctx.lineJoin = 'round';
      ctx.miterLimit = 2;
      ctx.strokeText(text, x, y);

      // メインのテキストを描画
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(text, x, y);

      // Blobとして出力
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Image blob generated successfully');
          resolve(blob);
        } else {
          reject(new Error('Failed to generate image blob'));
        }
      }, 'image/png');
    };

    img.onerror = (error) => {
      console.error('Failed to load base image:', error);
      reject(new Error('Failed to load base image'));
    };

    // ベース画像の読み込み
    const baseImagePath = '/nft-base.png';
    console.log('Loading base image from:', baseImagePath);
    img.src = baseImagePath;
  });
}; 