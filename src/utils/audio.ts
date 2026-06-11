// Web Audio API Synthesizer for cozy cafe ambience and soft background lofi piano chords
// This avoids relying on external URLs which can crash or trigger CORS errors.

class CafeAudioEngine {
  private ctx: AudioContext | null = null;
  private isAmbientPlaying = false;
  private masterGain: GainNode | null = null;
  private musicVolume = 0.5;
  private ambientVolume = 0.4;
  private sfxVolume = 0.6;

  // Nodes references
  private vinylFilter: BiquadFilterNode | null = null;
  private vinylSource: AudioWorkletNode | ScriptProcessorNode | null = null;
  private pianoInterval: any = null;

  init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  setVolume(vol: number) {
    this.init();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.1);
    }
  }

  // Play a brief text write-out tick
  playTypeTick() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    // super low quiet click
    osc.frequency.setValueAtTime(150 + Math.random() * 50, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(this.sfxVolume * 0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    if (this.masterGain) gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  // Play a beautiful chime sound when selections are made
  playChoiceChime() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 for happy chime
    notes.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.06);
      
      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.15, this.ctx!.currentTime + index * 0.06 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.06 + 0.35);
      
      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      
      osc.start(this.ctx!.currentTime + index * 0.06);
      osc.stop(this.ctx!.currentTime + index * 0.06 + 0.4);
    });
  }

  // Play a dramatic romantic chime for important scenes or endings
  playEndingChime() {
    this.init();
    if (!this.ctx || this.ctx.state === 'suspended') return;

    const baseChords = [440, 554.37, 659.25, 830.61]; // A, C#, E, G# - Amaj7 chords
    baseChords.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.1);
      
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, this.ctx!.currentTime);
      
      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.18, this.ctx!.currentTime + index * 0.1 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.1 + 1.2);
      
      osc.connect(filter);
      filter.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);
      
      osc.start(this.ctx!.currentTime + index * 0.1);
      osc.stop(this.ctx!.currentTime + index * 0.1 + 1.5);
    });
  }

  // Synthesize a retro vinyl crackle / cafe rain background noise
  startAmbient() {
    this.init();
    if (!this.ctx || this.isAmbientPlaying) return;
    
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    
    this.isAmbientPlaying = true;
    
    // Create Rain & Crackle nodes
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    
    // High-pass filter to sound like soft rain rustle
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1600;
    filter.Q.value = 0.5;
    
    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(this.ambientVolume * 0.12, this.ctx.currentTime);
    
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    if (this.masterGain) gainNode.connect(this.masterGain);
    
    whiteNoise.start();
    
    // Periodically play a crackle pop
    const playPop = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80 + Math.random() * 80, this.ctx.currentTime);
      
      popGain.gain.setValueAtTime(this.ambientVolume * 0.02 * Math.random(), this.ctx.currentTime);
      popGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      
      osc.connect(popGain);
      if (this.masterGain) popGain.connect(this.masterGain);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
      
      setTimeout(playPop, 500 + Math.random() * 2500);
    };
    playPop();

    // Start piano track
    this.startLofiPianoMusic();
  }

  // Play repeating soft Lofi chords
  private startLofiPianoMusic() {
    if (!this.ctx || !this.isAmbientPlaying) return;

    // Chords defined by MIDI numbers: 
    // Fmaj7: [53, 57, 60, 64] (F3, A3, C4, E4)
    // Em7: [52, 55, 59, 62]   (E3, G3, B3, D4)
    // Dm7: [50, 53, 57, 60]   (D3, F3, A3, C4)
    // Am7: [57, 60, 64, 67]   (A3, C4, E4, G4)
    const chords = [
      [53, 57, 60, 64],
      [52, 55, 59, 62],
      [50, 53, 57, 60],
      [57, 60, 64, 67]
    ];
    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isAmbientPlaying || !this.ctx) return;
      const midis = chords[chordIndex];
      chordIndex = (chordIndex + 1) % chords.length;

      // Play notes in chord with micro-strum delay
      midis.forEach((midi, index) => {
        const freq = 440 * Math.pow(2, (midi - 69) / 12);
        
        const osc1 = this.ctx!.createOscillator();
        const osc2 = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        const biquad = this.ctx!.createBiquadFilter();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, this.ctx!.currentTime + index * 0.04);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(freq * 2, this.ctx!.currentTime + index * 0.04); // subtle octave shimmer

        biquad.type = 'lowpass';
        biquad.frequency.setValueAtTime(600, this.ctx!.currentTime); // cozy dark filter

        gain.gain.setValueAtTime(0, this.ctx!.currentTime);
        gain.gain.linearRampToValueAtTime(this.musicVolume * 0.15, this.ctx!.currentTime + index * 0.04 + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + index * 0.04 + 5.5);

        osc1.connect(biquad);
        osc2.connect(biquad);
        biquad.connect(gain);
        if (this.masterGain) gain.connect(this.masterGain);

        osc1.start(this.ctx!.currentTime + index * 0.04);
        osc2.start(this.ctx!.currentTime + index * 0.04);
        
        osc1.stop(this.ctx!.currentTime + 6);
        osc2.stop(this.ctx!.currentTime + 6);
      });

      // Schedule next chord in 7 seconds
      this.pianoInterval = setTimeout(playNextChord, 7500);
    };

    playNextChord();
  }

  stopAmbient() {
    this.isAmbientPlaying = false;
    if (this.pianoInterval) {
      clearTimeout(this.pianoInterval);
      this.pianoInterval = null;
    }
  }

  isPlaying() {
    return this.isAmbientPlaying;
  }
}

export const cafeAudio = new CafeAudioEngine();
export default cafeAudio;
