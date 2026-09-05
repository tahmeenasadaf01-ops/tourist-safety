/**
 * Web Audio API Emergency Siren & Sound Synthesizer
 */
class EmergencyAudioEngine {
  private ctx: AudioContext | null = null;
  private isSirenActive = false;
  private sirenInterval: any = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Play single emergency notification beep
   */
  playAlertBeep(freq = 880, duration = 0.2) {
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio alert unavailable:", e);
    }
  }

  /**
   * Play Morse code SOS: ... --- ...
   */
  playMorseSOS() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const dotTime = 0.08;
      const dashTime = 0.24;
      const freq = 950;

      const pattern = [
        dotTime, dotTime, dotTime, // S
        dashTime, dashTime, dashTime, // O
        dotTime, dotTime, dotTime  // S
      ];

      let delay = 0;
      pattern.forEach((dur, index) => {
        setTimeout(() => {
          this.playAlertBeep(freq, dur);
        }, delay * 1000);
        delay += dur + 0.08;
        if (index === 2 || index === 5) delay += 0.2; // letter gap
      });
    } catch (e) {
      console.warn("Morse SOS sound failed:", e);
    }
  }

  /**
   * Start looping high-intensity emergency siren
   */
  startSiren() {
    if (this.isSirenActive) return;
    this.isSirenActive = true;
    this.initContext();

    let high = true;
    const toggleTone = () => {
      if (!this.isSirenActive) return;
      this.playAlertBeep(high ? 900 : 600, 0.4);
      high = !high;
    };

    toggleTone();
    this.sirenInterval = setInterval(toggleTone, 450);
  }

  /**
   * Stop emergency siren
   */
  stopSiren() {
    this.isSirenActive = false;
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
  }

  /**
   * Play positive confirmation chime
   */
  playSuccessChime() {
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        setTimeout(() => {
          this.playAlertBeep(freq, 0.15);
        }, i * 100);
      });
    } catch (e) {
      console.warn("Success chime failed:", e);
    }
  }
}

export const emergencyAudio = new EmergencyAudioEngine();
