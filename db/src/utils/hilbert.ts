// utils/hilbert.ts
export function hilbertCurveTransform(data: number[]): number[][] {
  const n = Math.ceil(Math.sqrt(data.length));
  const hilbertData = Array.from({ length: n }, () => Array(n).fill(0));

  function rot(n: number, x: number, y: number, rx: number, ry: number) {
    if (ry === 0) {
      if (rx === 1) {
        x = n - 1 - x;
        y = n - 1 - y;
      }
      return [y, x];
    }
    return [x, y];
  }

  function d2xy(n: number, d: number) {
    let x = 0, y = 0, t = d;
    for (let s = 1; s < n; s *= 2) {
      let rx = 1 & (t / 2);
      let ry = 1 & (t ^ rx);
      [x, y] = rot(s, x, y, rx, ry);
      x += s * rx;
      y += s * ry;
      t /= 4;
    }
    return [x, y];
  }

  for (let i = 0; i < data.length; i++) {
    const [x, y] = d2xy(n, i);
    hilbertData[x][y] = Math.round(((data[i] + 1) / 2) * 255);
  }

  return hilbertData;
}