import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { DrumSequencer } from "./drum-sequencer"

// Minimal Web Audio stand-in: every node supports connect/start/stop and param ramps
const param = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() })
const node = () => {
  const n: any = { gain: param(), frequency: param(), connect: vi.fn(() => n), start: vi.fn(), stop: vi.fn(), type: "", buffer: null }
  return n
}
class FakeAudioContext {
  static last: FakeAudioContext | null = null
  constructor() {
    FakeAudioContext.last = this
  }
  currentTime = 0
  sampleRate = 8000
  state = "running"
  destination = {}
  createGain = vi.fn(node)
  createOscillator = vi.fn(node)
  createBufferSource = vi.fn(node)
  createBiquadFilter = vi.fn(node)
  createBuffer = vi.fn(() => ({ getChannelData: () => new Float32Array(10) }))
  resume = vi.fn()
  close = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal("AudioContext", FakeAudioContext)
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe("DrumSequencer", () => {
  it("renders 4 voices × 16 steps with the starter groove", () => {
    render(<DrumSequencer />)
    expect(screen.getAllByRole("button", { name: /step \d+/ })).toHaveLength(64)
    expect(screen.getByRole("button", { name: "Kick step 1 on" })).toHaveAttribute("aria-pressed", "true")
    expect(screen.getByRole("button", { name: "Kick step 2" })).toHaveAttribute("aria-pressed", "false")
  })

  it("toggles a pad on and off", () => {
    render(<DrumSequencer />)
    fireEvent.click(screen.getByRole("button", { name: "Snare step 2" }))
    expect(screen.getByRole("button", { name: "Snare step 2 on" })).toHaveAttribute("aria-pressed", "true")
    fireEvent.click(screen.getByRole("button", { name: "Snare step 2 on" }))
    expect(screen.getByRole("button", { name: "Snare step 2" })).toHaveAttribute("aria-pressed", "false")
  })

  it("changes tempo within 60–180 BPM", () => {
    render(<DrumSequencer />)
    expect(screen.getByText("96 BPM")).toBeInTheDocument()
    fireEvent.click(screen.getByRole("button", { name: "Faster" }))
    expect(screen.getByText("100 BPM")).toBeInTheDocument()
    for (let i = 0; i < 20; i++) fireEvent.click(screen.getByRole("button", { name: "Slower" }))
    expect(screen.getByText("60 BPM")).toBeInTheDocument()
  })

  it("plays and stops, scheduling sounds on each step", () => {
    vi.useFakeTimers()
    render(<DrumSequencer />)
    fireEvent.click(screen.getByRole("button", { name: "Play" }))
    expect(screen.getByRole("button", { name: "Stop" })).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1000)
    })
    // The starter groove's kick and tom are oscillators; hats and snares use noise
    const ctx = FakeAudioContext.last!
    expect(ctx.createOscillator).toHaveBeenCalled()
    expect(ctx.createBufferSource).toHaveBeenCalled()
    fireEvent.click(screen.getByRole("button", { name: "Stop" }))
    expect(screen.getByRole("button", { name: "Play" })).toBeInTheDocument()
  })

  it("resets to the starter groove", () => {
    render(<DrumSequencer />)
    fireEvent.click(screen.getByRole("button", { name: "Kick step 1 on" }))
    fireEvent.click(screen.getByRole("button", { name: "Reset pattern" }))
    expect(screen.getByRole("button", { name: "Kick step 1 on" })).toBeInTheDocument()
  })
})
