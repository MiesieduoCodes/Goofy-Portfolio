"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw } from "lucide-react";

const STEPS = 16;

const VOICES = ["Kick", "Snare", "Hi-hat", "Tom"] as const;
type Voice = (typeof VOICES)[number];

// A laid-back groove to start from
const DEFAULT_PATTERN: boolean[][] = [
  [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
].map((row) => row.map(Boolean));

// --- Synthesized drum voices (Web Audio, no samples) ---

function noiseBuffer(ctx: AudioContext) {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function playVoice(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, voice: Voice, time: number) {
  const gain = ctx.createGain();
  gain.connect(out);

  if (voice === "Kick" || voice === "Tom") {
    const osc = ctx.createOscillator();
    const [from, to, length, level] = voice === "Kick" ? [150, 42, 0.45, 1] : [220, 110, 0.32, 0.6];
    osc.frequency.setValueAtTime(from, time);
    osc.frequency.exponentialRampToValueAtTime(to, time + length * 0.35);
    gain.gain.setValueAtTime(level, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + length);
    osc.connect(gain);
    osc.start(time);
    osc.stop(time + length);
    return;
  }

  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  const [cutoff, length, level] = voice === "Snare" ? [1200, 0.2, 0.55] : [7000, 0.05, 0.28];
  filter.frequency.value = cutoff;
  gain.gain.setValueAtTime(level, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + length);
  src.connect(filter).connect(gain);
  src.start(time);
  src.stop(time + length);

  if (voice === "Snare") {
    // A little body under the noise
    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "triangle";
    body.frequency.value = 185;
    bodyGain.gain.setValueAtTime(0.35, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    body.connect(bodyGain).connect(out);
    body.start(time);
    body.stop(time + 0.1);
  }
}

// 16-step drum machine. Click pads to program a beat; sound starts only when Play is pressed.
export function DrumSequencer() {
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBpm] = useState(96);
  const [step, setStep] = useState(-1);

  const audio = useRef<{ ctx: AudioContext; out: GainNode; noise: AudioBuffer } | null>(null);
  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  const ensureAudio = useCallback(() => {
    if (!audio.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const out = ctx.createGain();
      out.gain.value = 0.8;
      out.connect(ctx.destination);
      audio.current = { ctx, out, noise: noiseBuffer(ctx) };
    }
    if (audio.current.ctx.state === "suspended") audio.current.ctx.resume();
    return audio.current;
  }, []);

  // Step clock: plays the current column and moves the playhead
  useEffect(() => {
    if (!playing) {
      setStep(-1);
      return;
    }
    const { ctx, out, noise } = ensureAudio();
    let current = 0;
    const tick = () => {
      const time = ctx.currentTime + 0.01;
      patternRef.current.forEach((row, v) => row[current] && playVoice(ctx, out, noise, VOICES[v], time));
      setStep(current);
      current = (current + 1) % STEPS;
    };
    tick();
    // 16th notes
    const id = setInterval(tick, (60 / bpm / 4) * 1000);
    return () => clearInterval(id);
  }, [playing, bpm, ensureAudio]);

  // Stop when the tab is hidden, and release audio on unmount
  useEffect(() => {
    const onHidden = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      audio.current?.ctx.close();
      audio.current = null;
    };
  }, []);

  const toggle = (v: number, s: number) => {
    setPattern((p) => p.map((row, ri) => (ri === v ? row.map((on, si) => (si === s ? !on : on)) : row)));
    // Audition the pad when switching it on while stopped
    if (!playing && !pattern[v][s]) {
      const { ctx, out, noise } = ensureAudio();
      playVoice(ctx, out, noise, VOICES[v], ctx.currentTime + 0.01);
    }
  };

  return (
    <div className="rounded-sm border border-white/10 bg-white/[0.02] p-4 md:p-8">
      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Stop" : "Play"}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-white p-0 text-black transition-transform hover:scale-105"
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5" />}
          </button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Groove box</p>
            <p className="text-sm font-semibold">{playing ? "Playing" : "Press play, then tap the pads"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Slower"
            onClick={() => setBpm((b) => Math.max(60, b - 4))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white hover:border-white"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-20 text-center font-mono text-sm tabular-nums">{bpm} BPM</span>
          <button
            type="button"
            aria-label="Faster"
            onClick={() => setBpm((b) => Math.min(180, b + 4))}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white hover:border-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Reset pattern"
            onClick={() => setPattern(DEFAULT_PATTERN)}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-transparent p-0 text-white hover:border-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto" data-lenis-prevent>
        <div className="min-w-[640px] space-y-2">
          {VOICES.map((voice, v) => (
            <div key={voice} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/50">{voice}</span>
              <div className="grid flex-1 gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))` }}>
                {pattern[v].map((on, s) => {
                  const isPlayhead = s === step;
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-label={`${voice} step ${s + 1}${on ? " on" : ""}`}
                      aria-pressed={on}
                      onClick={() => toggle(v, s)}
                      className={`aspect-square rounded-[3px] p-0 transition-all duration-100 ${
                        on
                          ? isPlayhead
                            ? "scale-110 bg-white shadow-[0_0_18px_rgba(255,255,255,0.7)]"
                            : "bg-white/85 hover:bg-white"
                          : isPlayhead
                            ? "bg-white/25"
                            : s % 4 === 0
                              ? "bg-white/[0.09] hover:bg-white/25"
                              : "bg-white/[0.04] hover:bg-white/20"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          ))}
          {/* Beat markers */}
          <div className="flex items-center gap-2 pt-1">
            <span className="w-16 shrink-0" />
            <div className="grid flex-1 gap-1.5" style={{ gridTemplateColumns: `repeat(${STEPS}, minmax(0, 1fr))` }}>
              {Array.from({ length: STEPS }).map((_, s) => (
                <span key={s} className={`text-center font-mono text-[9px] ${s % 4 === 0 ? "text-white/50" : "text-white/15"}`}>
                  {s % 4 === 0 ? s / 4 + 1 : "·"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
