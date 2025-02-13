import numpy as np
import pyaudio
import wave
import threading
import pygame
from scipy.fft import fft
import time
from collections import deque

class AudioVisualizer:
    def __init__(self, filename):
        # Audio setup
        self.chunk = 1024
        self.wf = wave.open(filename, 'rb')
        self.p = pyaudio.PyAudio()
        
        # FFT setup
        self.fft_data = np.zeros(self.chunk)
        self.fft_history = deque(maxlen=50)  # Store recent FFT data for visualization
        
        # Pygame visualization setup
        pygame.init()
        self.width = 800
        self.height = 600
        self.screen = pygame.display.set_mode((self.width, self.height))
        pygame.display.set_caption('Audio Visualizer')
        
        # Stream setup with callback
        self.stream = self.p.open(
            format=self.p.get_format_from_width(self.wf.getsampwidth()),
            channels=self.wf.getnchannels(),
            rate=self.wf.getframerate(),
            output=True,
            input=False,
            stream_callback=self.audio_callback,
            frames_per_buffer=self.chunk
        )
        
        self.running = True
        
    def audio_callback(self, in_data, frame_count, time_info, status):
        data = self.wf.readframes(frame_count)
        
        # Process audio data
        audio_data = np.frombuffer(data, dtype=np.int16)
        
        # Apply FFT
        if len(audio_data) >= self.chunk:
            self.fft_data = np.abs(fft(audio_data[:self.chunk]))
            self.fft_history.append(self.fft_data[:self.chunk//2])  # Only keep positive frequencies
            
        return (data, pyaudio.paContinue)
    
    def apply_effect(self, data):
        """Example effect: Add distortion"""
        threshold = 32767 * 0.3
        data = np.clip(data, -threshold, threshold)
        return data
    
    def draw_visualization(self):
        self.screen.fill((0, 0, 0))
        
        # Draw frequency spectrum
        if len(self.fft_history) > 0:
            latest_fft = self.fft_history[-1]
            bar_width = self.width // (len(latest_fft) // 4)
            
            for i, magnitude in enumerate(latest_fft[:len(latest_fft)//4]):
                # Normalize magnitude and apply log scaling
                height = int(np.log10(magnitude + 1) * 30)
                height = min(height, self.height)
                
                # Color based on frequency
                color = (
                    min(255, int(magnitude * 0.05)),  # R
                    min(255, int(magnitude * 0.02)),  # G
                    min(255, int(255 - magnitude * 0.02))  # B
                )
                
                pygame.draw.rect(
                    self.screen,
                    color,
                    (i * bar_width, self.height - height, bar_width - 2, height)
                )
        
        pygame.display.flip()
    
    def run(self):
        self.stream.start_stream()
        
        try:
            while self.running and self.stream.is_active():
                self.draw_visualization()
                
                for event in pygame.event.get():
                    if event.type == pygame.QUIT:
                        self.running = False
                    
                time.sleep(0.01)  # Small delay to prevent maxing CPU
                
        finally:
            self.stream.stop_stream()
            self.stream.close()
            self.p.terminate()
            pygame.quit()

if __name__ == "__main__":
    visualizer = AudioVisualizer(r"C:\Users\dkbow\GIT\derekbowdle.com\db\public\audio\Lie_Cheat_Steal.mp3")
    visualizer.run()
