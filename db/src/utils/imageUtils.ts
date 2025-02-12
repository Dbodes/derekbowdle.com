// utils/imageUtils.ts
export function generateHilbertImage(hilbertData: number[][]): string {
  const canvas = document.createElement('canvas');
  const n = hilbertData.length * 4;
  canvas.width = n;
  canvas.height = n;
  const ctx = canvas.getContext('2d');
  const imageData = ctx?.createImageData(n, n);

  if (ctx && imageData) {
    for (let x = 0; x < n; x++) {
      for (let y = 0; y < n; y++) {
        const index = (y * n + x) * 4;
        const value = hilbertData[Math.floor(x / 4)][Math.floor(y / 4)];
        imageData.data[index] = value;
        imageData.data[index + 1] = value;
        imageData.data[index + 2] = value;
        imageData.data[index + 3] = 255;
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }
  return '';
}