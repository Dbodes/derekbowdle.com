'use client';

import SideNav from "@/components/sidenav";
import { useState, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Button } from '@/components/ui/button';

// Function to map a 1D array to a 2D Hilbert curve and normalize values
function hilbertCurveTransform(data: number[]): number[][] {
  const n = Math.pow(2, Math.ceil(Math.log2(Math.sqrt(data.length)))); // Calculate the next power of 2
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

  for (let i = 0; i < n * n && i < data.length; i++) {
    const [x, y] = d2xy(n, i);
    hilbertData[x][y] = Math.round(((data[i] + 1) / 2) * 255); // Normalize to 0-255
  }

  return hilbertData;
}

export default function WaveformUploader() {
  const [hilbertImage, setHilbertImage] = useState<string | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [totalValues, setTotalValues] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const url = URL.createObjectURL(file);
    const audioContext = new AudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    const rawData = audioBuffer.getChannelData(0);
    setTotalValues(rawData.length);
    const slicedData = Array.from(rawData.slice(0, rawData.length)); // Use 1024 values for Hilbert mapping
    setWaveformData(slicedData);
    const hilbertData = hilbertCurveTransform(slicedData);

    // Generate Hilbert Image
    const canvas = document.createElement('canvas');
    const n = hilbertData.length;
    canvas.width = n;
    canvas.height = n;
    const ctx = canvas.getContext('2d');
    const imageData = ctx?.createImageData(n, n);

    if (ctx && imageData) {
      for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
          const index = (y * n + x) * 4;
          const value = hilbertData[x][y];
          imageData.data[index] = value; // R
          imageData.data[index + 1] = value; // G
          imageData.data[index + 2] = value; // B
          imageData.data[index + 3] = 255; // A (fully opaque)
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setHilbertImage(canvas.toDataURL());
    }

    const waveSurfer = WaveSurfer.create({
      container: document.createElement('div'), // Temporary container
      waveColor: 'black',
      progressColor: 'gray',
      barWidth: 2,
      barHeight: 1,
    });

    waveSurfer.load(url);
    waveSurfer.on('ready', () => {
      const peaks = rawData;
      const waveformCanvas = document.createElement('canvas');
      waveformCanvas.width = peaks.length / 100;
      waveformCanvas.height = 100;
      const waveformCtx = waveformCanvas.getContext('2d');
      
      if (waveformCtx) {
        waveformCtx.fillStyle = 'white';
        waveformCtx.fillRect(0, 0, waveformCanvas.width, waveformCanvas.height);
        waveformCtx.fillStyle = 'black';

        for (let i = 0; i < waveformCanvas.width; i++) {
          const peak = peaks[Math.floor((i / waveformCanvas.width) * peaks.length)] || 0;
          const height = Math.abs(peak) * waveformCanvas.height;
          waveformCtx.fillRect(i, (waveformCanvas.height - height) / 2, 1, height);
        }

      }
      waveSurfer.destroy();
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <SideNav />
      <h1 className="text-2xl font-bold mb-4">MP3 Waveform Generator</h1>
      <input
        type="file"
        accept="audio/mp3"
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden"
      />
      <Button onClick={() => fileInputRef.current?.click()} className="mb-4">
        Upload MP3 File
      </Button>
      {hilbertImage && <img src={hilbertImage} alt="Hilbert Curve" className="mt-4 border rounded-lg w-full max-w-4xl" />}
      {waveformData.length > 0 && (
        <div className="mt-4 text-sm max-w-lg overflow-x-auto p-2 bg-gray-800 rounded-lg">
          <h2 className="font-bold">Waveform Data:</h2>
          <p>Total Values: {totalValues}</p>
        </div>
      )}
    </div>
  );
}
