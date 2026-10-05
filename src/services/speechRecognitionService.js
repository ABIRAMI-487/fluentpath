// Speech Recognition Service for FluentPath
// Explicit States Required by Specifications:
export const SPEECH_STATES = {
  IDLE: 'IDLE',
  REQUESTING_PERMISSION: 'REQUESTING_PERMISSION',
  LISTENING: 'LISTENING',
  SPEECH_DETECTED: 'SPEECH_DETECTED',
  PROCESSING: 'PROCESSING',
  NO_SPEECH: 'NO_SPEECH',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  NOT_SUPPORTED: 'NOT_SUPPORTED',
  ERROR: 'ERROR',
  STOPPED: 'STOPPED'
};

export class SpeechRecognitionService {
  constructor({ onStateChange, onResult, onError, language = 'en-US' } = {}) {
    this.onStateChange = onStateChange || (() => {});
    this.onResult = onResult || (() => {});
    this.onError = onError || (() => {});
    this.language = language;
    this.state = SPEECH_STATES.IDLE;
    this.recognition = null;
    this.isExplicitlyStopped = false;
    this.noSpeechTimer = null;
    this.continuous = true;
    this.interimResults = true;

    this.checkBrowserSupport();
  }

  setState(newState, details = null) {
    this.state = newState;
    this.onStateChange(newState, details);
  }

  getState() {
    return this.state;
  }

  checkBrowserSupport() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.setState(SPEECH_STATES.NOT_SUPPORTED, {
        message: 'Speech recognition is not supported in this browser. Please use Chrome, Edge, or a Web Speech-compatible browser.'
      });
      return false;
    }
    return true;
  }

  setLanguage(langCode) {
    this.language = langCode;
    if (this.recognition) {
      this.recognition.lang = langCode;
    }
  }

  start({ language } = {}) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      this.setState(SPEECH_STATES.NOT_SUPPORTED, {
        message: 'Web Speech API is not supported in this browser environment.'
      });
      return false;
    }

    if (language) {
      this.language = language;
    }

    // Clean up any existing instance first
    this.cleanup();
    this.isExplicitlyStopped = false;
    this.setState(SPEECH_STATES.REQUESTING_PERMISSION);

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = this.continuous;
      this.recognition.interimResults = this.interimResults;
      this.recognition.maxAlternatives = 1;
      this.recognition.lang = this.language;

      // Reset no-speech watchdog
      this.startNoSpeechWatchdog(12000);

      this.recognition.onstart = () => {
        this.setState(SPEECH_STATES.LISTENING);
      };

      this.recognition.onaudiostart = () => {
        if (this.state === SPEECH_STATES.LISTENING) {
          // Audio input received
        }
      };

      this.recognition.onspeechstart = () => {
        this.clearNoSpeechWatchdog();
        this.setState(SPEECH_STATES.SPEECH_DETECTED);
      };

      this.recognition.onspeechend = () => {
        if (!this.isExplicitlyStopped) {
          this.setState(SPEECH_STATES.PROCESSING);
        }
      };

      this.recognition.onresult = (event) => {
        this.clearNoSpeechWatchdog();
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        this.onResult({
          finalTranscript: finalTranscript.trim(),
          interimTranscript: interimTranscript.trim(),
          rawEvent: event
        });

        // Restart no speech watchdog after speech event
        this.startNoSpeechWatchdog(10000);
      };

      this.recognition.onerror = (event) => {
        this.clearNoSpeechWatchdog();
        const errorCode = event.error;

        if (errorCode === 'not-allowed' || errorCode === 'service-not-allowed') {
          this.setState(SPEECH_STATES.PERMISSION_DENIED, {
            message: 'Microphone permission was denied. Please allow microphone access in your browser address bar to practice speech.'
          });
        } else if (errorCode === 'no-speech') {
          this.setState(SPEECH_STATES.NO_SPEECH, {
            message: 'No speech was detected. Please check your microphone volume and speak into the mic.'
          });
        } else if (errorCode === 'network') {
          this.setState(SPEECH_STATES.ERROR, {
            message: 'Network issue occurred during speech recognition. Please check your connection.'
          });
        } else if (errorCode !== 'aborted') {
          this.setState(SPEECH_STATES.ERROR, {
            message: `Speech recognition error: ${errorCode}`
          });
        }

        this.onError(event);
      };

      this.recognition.onend = () => {
        this.clearNoSpeechWatchdog();
        if (this.isExplicitlyStopped) {
          this.setState(SPEECH_STATES.STOPPED);
        } else {
          // In some browsers (like Chrome), continuous recognition can automatically end on silence.
          // If we weren't stopped explicitly and are not in an error state, return to IDLE or attempt gentle resume if listening was wanted
          if (this.state === SPEECH_STATES.PROCESSING || this.state === SPEECH_STATES.SPEECH_DETECTED) {
            this.setState(SPEECH_STATES.IDLE);
          } else if (this.state !== SPEECH_STATES.PERMISSION_DENIED && this.state !== SPEECH_STATES.NOT_SUPPORTED) {
            this.setState(SPEECH_STATES.STOPPED);
          }
        }
      };

      this.recognition.start();
      return true;
    } catch (err) {
      this.clearNoSpeechWatchdog();
      if (err.name === 'InvalidStateError') {
        // Recognition was already active
        return true;
      }
      this.setState(SPEECH_STATES.ERROR, { message: err.message || 'Unable to start microphone' });
      return false;
    }
  }

  startNoSpeechWatchdog(timeoutMs = 12000) {
    this.clearNoSpeechWatchdog();
    this.noSpeechTimer = setTimeout(() => {
      if (this.state === SPEECH_STATES.LISTENING) {
        this.setState(SPEECH_STATES.NO_SPEECH, {
          message: 'Listening... (Speak whenever you are ready, or tap Pause to take a break)'
        });
      }
    }, timeoutMs);
  }

  clearNoSpeechWatchdog() {
    if (this.noSpeechTimer) {
      clearTimeout(this.noSpeechTimer);
      this.noSpeechTimer = null;
    }
  }

  stop() {
    this.isExplicitlyStopped = true;
    this.clearNoSpeechWatchdog();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // Ignore if already stopped
      }
    }
    this.setState(SPEECH_STATES.STOPPED);
  }

  abort() {
    this.isExplicitlyStopped = true;
    this.clearNoSpeechWatchdog();
    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch (err) {
        // Ignore
      }
    }
    this.setState(SPEECH_STATES.STOPPED);
  }

  cleanup() {
    this.clearNoSpeechWatchdog();
    if (this.recognition) {
      this.recognition.onstart = null;
      this.recognition.onaudiostart = null;
      this.recognition.onspeechstart = null;
      this.recognition.onspeechend = null;
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      try {
        this.recognition.abort();
      } catch (e) {
        // Safe to ignore on cleanup
      }
      this.recognition = null;
    }
  }
}

// Utility to normalize words for robust comparison across English and Tamil
export function cleanWord(word) {
  if (!word) return '';
  // Remove punctuation, symbols, extra quotes, whitespace
  return word
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"'‘’“”\[\]]/g, '')
    .trim();
}

// Fuzzy matching for speech recognition transcripts against passage words
// Handles minor acoustic variations, contractions, and phonetic approximations
export function matchSpokenTranscriptToPassage(passageWords, spokenTranscript, currentIndex = 0) {
  if (!spokenTranscript || !passageWords || passageWords.length === 0) {
    return {
      updatedIndex: currentIndex,
      matchedIndices: [],
      newMatches: 0
    };
  }

  // Tokenize speech transcript
  const spokenTokens = spokenTranscript
    .split(/\s+/)
    .map(w => cleanWord(w))
    .filter(Boolean);

  if (spokenTokens.length === 0) {
    return {
      updatedIndex: currentIndex,
      matchedIndices: [],
      newMatches: 0
    };
  }

  let testIndex = currentIndex;
  const newMatchedIndices = [];

  for (let i = 0; i < spokenTokens.length; i++) {
    const spoken = spokenTokens[i];
    if (testIndex >= passageWords.length) break;

    const targetWord = cleanWord(passageWords[testIndex]);

    // Check exact or close match
    if (targetWord === spoken) {
      newMatchedIndices.push(testIndex);
      testIndex++;
    } else if (testIndex + 1 < passageWords.length && cleanWord(passageWords[testIndex + 1]) === spoken) {
      // User jumped ahead by 1 word
      newMatchedIndices.push(testIndex + 1);
      testIndex = testIndex + 2;
    } else if (targetWord.length > 3 && (targetWord.startsWith(spoken) || spoken.startsWith(targetWord))) {
      // Partial prefix match
      newMatchedIndices.push(testIndex);
      testIndex++;
    }
  }

  return {
    updatedIndex: testIndex,
    matchedIndices: newMatchedIndices,
    newMatches: newMatchedIndices.length
  };
}
