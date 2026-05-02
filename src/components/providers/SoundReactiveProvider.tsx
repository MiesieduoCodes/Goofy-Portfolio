"use client";

import { createContext, useContext, useEffect, useState } from "react";

const SoundContext = createContext({
  bass: 0,
  mid: 0,
  high: 0,
  overall: 0,
});

export function useSound() {
  return useContext(SoundContext);
}

export function SoundReactiveProvider({ children }: { children: React.ReactNode }) {
  const [levels, setLevels] = useState({
    bass: 0,
    mid: 0,
    high: 0,
    overall: 0,
  });

  useEffect(() => {
    let audioCtx: AudioContext;
    let analyser: AnalyserNode;
    let source: MediaStreamAudioSourceNode;
    let animationId: number;

    const init = async () => {
      try {
        console.log("🎤 Requesting Microphone Access...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaStreamSource(stream);

        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);

        // AUTO-RESUME AudioContext on interaction
        const resume = async () => {
          if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
            console.log("🔊 AudioContext Resumed!");
          }
        };
        window.addEventListener('click', resume);
        window.addEventListener('touchstart', resume);

        const update = () => {
          analyser.getByteFrequencyData(data);

          // BASS (0-10)
          let bassSum = 0;
          for(let i = 0; i < 10; i++) bassSum += data[i];
          const bass = bassSum / 10;

          // MID (10-50)
          let midSum = 0;
          for(let i = 10; i < 50; i++) midSum += data[i];
          const mid = midSum / 40;

          // HIGH (50-100)
          let highSum = 0;
          for(let i = 50; i < 100; i++) highSum += data[i];
          const high = highSum / 50;

          const overall = (bass + mid + high) / 3;

          if (Math.random() < 0.01) {
            console.log("📊 Audio Levels:", { bass: Math.round(bass), high: Math.round(high), overall: Math.round(overall) });
          }

          setLevels({ bass, mid, high, overall });
          animationId = requestAnimationFrame(update);
        };

        update();
      } catch (err) {
        console.error("❌ Audio Analysis Error:", err);
      }
    };

    init();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
      if (audioCtx) audioCtx.close();
    };
  }, []);

  return (
    <SoundContext.Provider value={levels}>
      {children}
    </SoundContext.Provider>
  );
}
