/**
 * Sound synthesis engine using the Web Audio API.
 * Provides cheerful, game-like sound effects without requiring external audio files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggleSound(enabled?: boolean) {
    this.enabled = enabled ?? !this.enabled;
    return this.enabled;
  }

  public isEnabled() {
    return this.enabled;
  }

  /** Soft bubble tap when tapping a level */
  public playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio playback fails gracefully if unpermitted
    }
  }

  /** Locked dull rattle */
  public playLocked() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(110, now + 0.06);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  /** Ascending chime when a star is earned */
  public playStar(starIndex = 1) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [587.33, 739.99, 880.0]; // D5, F#5, A5
      const freq = freqs[(starIndex - 1) % freqs.length] || 880;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch {}
  }

  /** Harmonious victory fanfare upon completing a level */
  public playLevelSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.12 }, // C5
        { freq: 659.25, time: 0.1, dur: 0.12 }, // E5
        { freq: 783.99, time: 0.2, dur: 0.14 }, // G5
        { freq: 1046.5, time: 0.32, dur: 0.35 }, // C6
      ];

      const now = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.2, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.01, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.02);
      });
    } catch {}
  }

  /** Grand majestic fanfare for Employability Passport */
  public playGrandFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [
        { freq: 523.25, time: 0.0, dur: 0.15 }, // C5
        { freq: 523.25, time: 0.15, dur: 0.15 }, // C5
        { freq: 523.25, time: 0.3, dur: 0.15 }, // C5
        { freq: 659.25, time: 0.45, dur: 0.3 }, // E5
        { freq: 783.99, time: 0.75, dur: 0.3 }, // G5
        { freq: 1046.5, time: 1.05, dur: 0.6 }, // C6
      ];

      const now = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(n.freq, now + n.time);

        gain.gain.setValueAtTime(0.25, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.01, now + n.time + n.dur);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();
