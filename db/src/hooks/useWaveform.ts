// hooks/useWaveform.ts
import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { hilbertCurveTransform } from '@/utils/hilbert';
import { generateHilbertImage } from '@/utils/imageUtils';

export function useWaveform() {
  const [waveformImage, setWaveformImage] = useState<string | null>(null);
  const [hilbertImage, setHilbertImage] = useState<string | null>(null);
  const [totalValues, setTotalValues] = useState<number>(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [currentAmplitude, setCurrentAmplitude] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current) {
        const audioContext = new AudioContext();
        const source = audioContext.createMediaElementSource(audioRef.current);
        const analyser = audioContext.createAnalyser();
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(dataArray);
        setCurrentAmplitude(dataArray[0]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const processAudio = async (file: File) => {
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    if (audioRef.current) {
      audioRef.current.src = url;
      audioRef.current.play();
    }
    const audioContext = new AudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const rawData = Array.from(audioBuffer.getChannelData(0));
    setTotalValues(rawData.length);
    setHilbertImage(generateHilbertImage(hilbertCurveTransform(rawData)));
  };

  return { waveformImage, hilbertImage, totalValues, processAudio, audioUrl, audioRef, currentAmplitude };
}
