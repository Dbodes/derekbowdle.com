// components/WaveformUploader.tsx
'use client';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWaveform } from '@/hooks/useWaveform';

const presetFiles = ['/audio/I_Wanna_Be_Sedated.mp3', '/audio/Just_Another_Girl.mp3', '/audio/Lie_Cheat_Steal.mp3'];

export default function WaveformUploader() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { waveformImage, hilbertImage, totalValues, processAudio, audioUrl, audioRef, currentAmplitude } = useWaveform();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) processAudio(file);
  };

  const handlePresetSelect = (fileUrl: string) => {
    setSelectedFile(fileUrl);
    fetch(fileUrl)
      .then(response => response.blob())
      .then(blob => processAudio(new File([blob], fileUrl)));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
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
      <div className="flex space-x-4 mb-4">
        {presetFiles.map((file) => (
          <Button key={file} onClick={() => handlePresetSelect(file)}>
            {file.split('/').pop()}
          </Button>
        ))}
      </div>
      {audioUrl && (
        <audio ref={audioRef} controls className="mt-4" autoPlay>
          <source src={audioUrl} type="audio/mp3" />
        </audio>
      )}
      <div className="mt-4 w-24 bg-blue-500 transition-all" style={{ height: `${currentAmplitude}px` }}></div>
      <p>Current Amplitude: {currentAmplitude}</p>
      {waveformImage && <img src={waveformImage} alt="Waveform" className="mt-4 border rounded-lg w-96 h-48" />}
      {hilbertImage && <img src={hilbertImage} alt="Hilbert Curve" className="mt-4 border rounded-lg w-96 h-96" />}
    </div>
  );
}
