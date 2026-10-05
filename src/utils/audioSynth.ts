/**
 * Pure Web Audio API Ambient Cafe Soundscape Synthesizer
 * Generates warm cafe background resonance, gentle rain/chatter warmth, and soft espresso steam
 * Completely self-contained with no external audio file dependencies.
 */

class CafeSoundscape {
  private ctx: AudioContext | null = null;
  private isRunning: boolean = false;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private steamInterval: number | null = null;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  public play() {
    if (!this.ctx) this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isRunning) return;
    this.isRunning = true;

    // Create pink noise buffer for warm cafe acoustic murmur
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
      b6 = white * 0.115926;
    }

    this.noiseNode = this.ctx.createBufferSource();
    this.noiseNode.buffer = noiseBuffer;
    this.noiseNode.loop = true;

    // Filter to warm low-mid coffee shop acoustic frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    // Subtle LFO modulation to simulate shifting room dynamics
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.15, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(60, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    this.noiseNode.connect(filter);
    filter.connect(this.masterGain);
    this.noiseNode.start();

    // Occasional gentle steam hiss pulse
    this.steamInterval = window.setInterval(() => {
      this.triggerSteamPuff();
    }, 12000);
  }

  public triggerSteamPuff() {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.02;
      }
      const puff = this.ctx.createBufferSource();
      puff.buffer = buffer;

      const puffFilter = this.ctx.createBiquadFilter();
      puffFilter.type = 'bandpass';
      puffFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      puffFilter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      const puffGain = this.ctx.createGain();
      puffGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      puffGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 0.1);
      puffGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      puff.connect(puffFilter);
      puffFilter.connect(puffGain);
      puffGain.connect(this.masterGain);

      puff.start();
      puff.stop(this.ctx.currentTime + 0.6);
    } catch {
      // Audio context might be closing
    }
  }

  public triggerChime() {
    // Pleasant two-tone bell chime when order updates or timer fires
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc2.frequency.setValueAtTime(1318.51, this.ctx.currentTime + 0.1); // E6

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(this.ctx.currentTime);
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.start(this.ctx.currentTime + 0.1);
      osc2.stop(this.ctx.currentTime + 0.8);
    } catch {
      // Audio permission or unsupported
    }
  }

  public stop() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch {
        // Safe disconnect
      }
      this.noiseNode = null;
    }
    if (this.steamInterval) {
      window.clearInterval(this.steamInterval);
      this.steamInterval = null;
    }
    this.isRunning = false;
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isRunning;
  }
}

export const soundscape = new CafeSoundscape();
