// Text-to-Speech (TTS) Service using Web SpeechSynthesis API

class SpeechSynthesisService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.voices = [];
    this.isSpeaking = false;
    this.isPaused = false;
    this.currentUtterance = null;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const loadVoices = () => {
      this.voices = this.synth.getVoices() || [];
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  getVoices() {
    if (!this.synth) return [];
    if (!this.voices || this.voices.length === 0) {
      this.voices = this.synth.getVoices() || [];
    }
    return this.voices;
  }

  getVoicesForLanguage(langCode = 'en') {
    const all = this.getVoices();
    const prefix = langCode.startsWith('ta') ? 'ta' : 'en';
    const filtered = all.filter(v => v.lang && v.lang.toLowerCase().startsWith(prefix));
    return filtered.length > 0 ? filtered : all;
  }

  speak(text, {
    voiceURI = null,
    lang = 'en-US',
    rate = 1.0,
    pitch = 1.0,
    onBoundary = null,
    onStart = null,
    onEnd = null,
    onError = null
  } = {}) {
    if (!this.synth) {
      if (onError) onError(new Error('SpeechSynthesis not supported in this browser.'));
      return;
    }

    // Cancel any previous utterance
    this.stop();

    if (!text || text.trim().length === 0) return;

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Resolve voice
    const voices = this.getVoices();
    let selectedVoice = null;
    if (voiceURI) {
      selectedVoice = voices.find(v => v.voiceURI === voiceURI);
    }
    if (!selectedVoice) {
      const langPrefix = lang.startsWith('ta') ? 'ta' : 'en';
      selectedVoice = voices.find(v => v.lang && v.lang.toLowerCase().startsWith(langPrefix));
    }
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = lang;
    }

    utterance.rate = Math.max(0.5, Math.min(2.0, rate));
    utterance.pitch = pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (onStart) onStart();
    };

    utterance.onboundary = (event) => {
      // charIndex allows calculating the current word in the passage
      if (onBoundary && event.name === 'word') {
        onBoundary(event.charIndex, event.charLength || 0);
      }
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
      // 'canceled' or 'interrupted' is expected when stopping
      if (event.error !== 'canceled' && event.error !== 'interrupted') {
        if (onError) onError(event);
      }
    };

    this.synth.speak(utterance);
  }

  pause() {
    if (this.synth && this.isSpeaking && !this.isPaused) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
      this.currentUtterance = null;
    }
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
