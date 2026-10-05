import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PASSAGES } from '../services/passagesData';
import { storageService } from '../services/storageService';
import { SpeechRecognitionService, SPEECH_STATES, matchSpokenTranscriptToPassage, cleanWord } from '../services/speechRecognitionService';
import { speechSynthesisService } from '../services/speechSynthesisService';
import { useSettings } from '../context/SettingsContext';
import { useToast } from '../context/ToastContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  BookmarkPlus,
  Sparkles,
  ArrowRight,
  Filter,
  Layers,
  HelpCircle,
  Volume1
} from 'lucide-react';

export default function ReadPage() {
  const [searchParams] = useSearchParams();
  const { settings, updateSetting } = useSettings();
  const { addToast } = useToast();

  // Custom text or curated passages
  const customTexts = useMemo(() => storageService.getCustomTexts(), []);
  const allPassages = useMemo(() => [...customTexts, ...PASSAGES], [customTexts]);

  // Selected filters & active passage
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [activePassageId, setActivePassageId] = useState(() => {
    const fromParam = searchParams.get('customId') || searchParams.get('id');
    if (fromParam) return fromParam;
    return PASSAGES[0]?.id || '';
  });

  const activePassage = useMemo(() => {
    return allPassages.find((p) => p.id === activePassageId) || PASSAGES[0];
  }, [allPassages, activePassageId]);

  // Breakdown of words in current passage
  const words = useMemo(() => {
    if (!activePassage?.content) return [];
    return activePassage.content.trim().split(/\s+/);
  }, [activePassage]);

  // Reading Session State
  // Mode: 'IDLE' | 'SPEECH_READING' | 'TTS_READING' | 'PAUSED' | 'COMPLETED'
  const [sessionMode, setSessionMode] = useState('IDLE');
  const [speechState, setSpeechState] = useState(SPEECH_STATES.IDLE);
  const [stateMessage, setStateMessage] = useState('');
  const [matchedIndices, setMatchedIndices] = useState(new Set());
  const [missedIndices, setMissedIndices] = useState(new Set());
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [ttsCharIndex, setTtsCharIndex] = useState(null);

  // Audio Speed: 0.75 | 1.0 | 1.25
  const [speechSpeed, setSpeechSpeed] = useState(settings.speechRate || 1.0);

  // Session Timing & Metrics
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef(null);
  const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
  const [completedMetrics, setCompletedMetrics] = useState(null);

  // Speech Recognition Service Instance Ref
  const recognizerRef = useRef(null);

  // Filtered passages list
  const filteredPassages = useMemo(() => {
    return allPassages.filter((p) => {
      const matchLang = selectedLanguage === 'all' || p.language === selectedLanguage;
      const matchDiff = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
      return matchLang && matchDiff;
    });
  }, [allPassages, selectedLanguage, selectedDifficulty]);

  // Accuracy calculation
  const accuracyPercentage = useMemo(() => {
    if (words.length === 0) return 0;
    const matchedCount = matchedIndices.size;
    const attemptedCount = Math.max(matchedCount, currentWordIndex);
    if (attemptedCount === 0) return 0;
    return Math.min(100, Math.round((matchedCount / attemptedCount) * 100));
  }, [words.length, matchedIndices.size, currentWordIndex]);

  // Words Per Minute (WPM)
  const currentWpm = useMemo(() => {
    if (elapsedSeconds < 5 || matchedIndices.size === 0) return 0;
    const minutes = elapsedSeconds / 60;
    return Math.round(matchedIndices.size / minutes);
  }, [elapsedSeconds, matchedIndices.size]);

  // Stop Timer
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start Timer
  const startTimer = useCallback(() => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
  }, [stopTimer]);

  // Clean up services on unmount or passage change
  const handleFullStop = useCallback(() => {
    stopTimer();
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current.cleanup();
      recognizerRef.current = null;
    }
    speechSynthesisService.stop();
    setSessionMode('IDLE');
    setSpeechState(SPEECH_STATES.STOPPED);
    setTtsCharIndex(null);
  }, [stopTimer]);

  useEffect(() => {
    return () => {
      handleFullStop();
    };
  }, [handleFullStop]);

  // Reset progress when switching passages
  useEffect(() => {
    handleFullStop();
    setMatchedIndices(new Set());
    setMissedIndices(new Set());
    setCurrentWordIndex(0);
    setElapsedSeconds(0);
    setIsCompletedModalOpen(false);
  }, [activePassageId, handleFullStop]);

  // Speech Recognition Callback Handler
  const handleSpeechResult = useCallback(
    ({ finalTranscript, interimTranscript }) => {
      const transcriptToProcess = finalTranscript || interimTranscript;
      if (!transcriptToProcess) return;

      const { updatedIndex, matchedIndices: newMatches } = matchSpokenTranscriptToPassage(
        words,
        transcriptToProcess,
        currentWordIndex
      );

      if (newMatches.length > 0) {
        setMatchedIndices((prev) => {
          const next = new Set(prev);
          newMatches.forEach((idx) => next.add(idx));
          return next;
        });
      }

      if (updatedIndex > currentWordIndex) {
        // Mark any skipped words (between currentWordIndex and updatedIndex) as missed
        setMissedIndices((prev) => {
          const next = new Set(prev);
          for (let i = currentWordIndex; i < updatedIndex; i++) {
            if (!newMatches.includes(i)) {
              next.add(i);
            }
          }
          return next;
        });

        setCurrentWordIndex(updatedIndex);

        // Check if finished passage
        if (updatedIndex >= words.length) {
          handleSessionComplete(true);
        }
      }
    },
    [words, currentWordIndex]
  );

  // Complete session and log to storage
  const handleSessionComplete = useCallback(
    (isSpeech) => {
      stopTimer();
      if (recognizerRef.current) {
        recognizerRef.current.stop();
      }
      speechSynthesisService.stop();
      setSessionMode('COMPLETED');

      const matchedCount = matchedIndices.size;
      const totalWords = words.length;
      const finalAccuracy = Math.min(100, Math.max(10, Math.round((matchedCount / totalWords) * 100)));
      const finalWpm = elapsedSeconds > 4 ? Math.round(matchedCount / (elapsedSeconds / 60)) : 0;

      const sessionRecord = {
        passageId: activePassage.id,
        passageTitle: activePassage.title,
        language: activePassage.language,
        difficulty: activePassage.difficulty,
        durationSeconds: elapsedSeconds,
        totalWords,
        correctWords: matchedCount,
        accuracyPercentage: finalAccuracy,
        wpm: finalWpm,
        mode: isSpeech ? 'speech_recognition' : 'read_aloud'
      };

      storageService.saveSession(sessionRecord);
      setCompletedMetrics(sessionRecord);
      setIsCompletedModalOpen(true);
      addToast({
        type: 'success',
        message: 'Passage complete! Session recorded to your genuine progress history.'
      });
    },
    [stopTimer, matchedIndices.size, words.length, elapsedSeconds, activePassage, addToast]
  );

  // 1. START READING (Microphone Speech Recognition)
  const handleStartSpeechReading = () => {
    speechSynthesisService.stop();

    const langCode = activePassage.language === 'ta' ? 'ta-IN' : 'en-US';

    recognizerRef.current = new SpeechRecognitionService({
      language: langCode,
      onStateChange: (newState, details) => {
        setSpeechState(newState);
        if (details?.message) {
          setStateMessage(details.message);
        } else {
          setStateMessage('');
        }
      },
      onResult: handleSpeechResult,
      onError: (err) => {
        console.warn('Speech Recognition Event Error:', err);
      }
    });

    const started = recognizerRef.current.start({ language: langCode });
    if (started) {
      setSessionMode('SPEECH_READING');
      startTimer();
    }
  };

  // 2. READ ALOUD (Text-To-Speech)
  const handleStartReadAloud = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current.cleanup();
      recognizerRef.current = null;
    }

    setSessionMode('TTS_READING');
    setSpeechState(SPEECH_STATES.IDLE);
    startTimer();

    const langCode = activePassage.language === 'ta' ? 'ta-IN' : 'en-US';

    speechSynthesisService.speak(activePassage.content, {
      lang: langCode,
      rate: speechSpeed,
      onBoundary: (charIndex) => {
        setTtsCharIndex(charIndex);
        // Find which word index corresponds to charIndex
        const textUpToChar = activePassage.content.slice(0, charIndex);
        const wordCountBefore = textUpToChar.trim().split(/\s+/).filter(Boolean).length;
        setCurrentWordIndex(wordCountBefore);
      },
      onEnd: () => {
        handleSessionComplete(false);
      },
      onError: (err) => {
        addToast({
          type: 'error',
          message: 'Speech synthesis error: ' + (err.message || 'Unable to play audio')
        });
        setSessionMode('IDLE');
        stopTimer();
      }
    });
  };

  // 3. PAUSE
  const handlePause = () => {
    stopTimer();
    if (sessionMode === 'SPEECH_READING' && recognizerRef.current) {
      recognizerRef.current.stop();
    } else if (sessionMode === 'TTS_READING') {
      speechSynthesisService.pause();
    }
    setSessionMode('PAUSED');
  };

  // 4. RESUME
  const handleResume = () => {
    startTimer();
    if (sessionMode === 'PAUSED') {
      if (recognizerRef.current) {
        recognizerRef.current.start();
        setSessionMode('SPEECH_READING');
      } else {
        speechSynthesisService.resume();
        setSessionMode('TTS_READING');
      }
    }
  };

  // 5. STOP
  const handleStop = () => {
    handleFullStop();
  };

  // 6. TRY AGAIN
  const handleTryAgain = () => {
    handleFullStop();
    setMatchedIndices(new Set());
    setMissedIndices(new Set());
    setCurrentWordIndex(0);
    setElapsedSeconds(0);
    setIsCompletedModalOpen(false);
    addToast({ type: 'info', message: 'Passage reset. You can begin whenever you are ready!' });
  };

  // Speed changer
  const handleSpeedChange = (speed) => {
    setSpeechSpeed(speed);
    updateSetting('speechRate', speed);
    if (sessionMode === 'TTS_READING') {
      // Re-trigger with new speed from current index
      speechSynthesisService.stop();
      handleStartReadAloud();
    }
  };

  // Flag a word for Word Practice
  const handleFlagWord = (wordText) => {
    const cleaned = cleanWord(wordText);
    if (!cleaned) return;
    storageService.saveFlaggedWord({
      word: cleaned,
      passageTitle: activePassage.title,
      language: activePassage.language
    });
    addToast({
      type: 'success',
      message: `"${cleaned}" saved to your Word & Pronunciation practice list!`
    });
  };

  // Helper for badge indicator for recognition state
  const renderSpeechStatusBadge = () => {
    switch (speechState) {
      case SPEECH_STATES.LISTENING:
        return (
          <span className="badge badge-primary" style={{ animation: 'pulse 2s infinite' }}>
            <Mic size={14} />
            <span>LISTENING — Speak into mic</span>
          </span>
        );
      case SPEECH_STATES.SPEECH_DETECTED:
        return (
          <span className="badge badge-accent">
            <Volume2 size={14} />
            <span>SPEECH DETECTED</span>
          </span>
        );
      case SPEECH_STATES.PROCESSING:
        return (
          <span className="badge badge-warning">
            <Sparkles size={14} />
            <span>PROCESSING...</span>
          </span>
        );
      case SPEECH_STATES.NO_SPEECH:
        return (
          <span className="badge badge-warning">
            <HelpCircle size={14} />
            <span>NO SPEECH DETECTED</span>
          </span>
        );
      case SPEECH_STATES.REQUESTING_PERMISSION:
        return (
          <span className="badge badge-warning">
            <span>REQUESTING PERMISSION...</span>
          </span>
        );
      case SPEECH_STATES.PERMISSION_DENIED:
        return (
          <span className="badge badge-danger">
            <MicOff size={14} />
            <span>PERMISSION DENIED</span>
          </span>
        );
      case SPEECH_STATES.NOT_SUPPORTED:
        return (
          <span className="badge badge-danger">
            <AlertCircle size={14} />
            <span>BROWSER NOT SUPPORTED</span>
          </span>
        );
      case SPEECH_STATES.ERROR:
        return (
          <span className="badge badge-danger">
            <AlertCircle size={14} />
            <span>MICROPHONE ERROR</span>
          </span>
        );
      case SPEECH_STATES.STOPPED:
        return (
          <span className="badge badge-secondary">
            <span>STOPPED</span>
          </span>
        );
      case SPEECH_STATES.IDLE:
      default:
        return (
          <span className="badge badge-secondary">
            <span>IDLE — Ready</span>
          </span>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Filter Bar: Language, Difficulty, Passage Selector */}
      <section
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          backgroundColor: 'var(--color-bg-surface)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Language filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate)' }}>Language:</span>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ minHeight: '38px', padding: '0.25rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>

          {/* Difficulty filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate)' }}>Difficulty:</span>
            <select
              className="form-select"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ minHeight: '38px', padding: '0.25rem 0.6rem', fontSize: '0.85rem' }}
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          {/* Passage picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate)' }}>Passage:</span>
            <select
              className="form-select"
              value={activePassageId}
              onChange={(e) => setActivePassageId(e.target.value)}
              style={{ minHeight: '38px', padding: '0.25rem 0.6rem', fontSize: '0.85rem', maxWidth: '240px' }}
            >
              {filteredPassages.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.difficulty})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Speed Controls: Slow (0.75x), Normal (1.0x), Fast (1.25x) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Volume1 size={18} color="var(--color-slate)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-slate)' }}>Audio Speed:</span>
          <div style={{ display: 'inline-flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {[
              { val: 0.75, label: '0.75x' },
              { val: 1.0, label: '1.0x' },
              { val: 1.25, label: '1.25x' }
            ].map(({ val, label }) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSpeedChange(val)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: speechSpeed === val ? 'var(--color-primary)' : 'var(--color-bg-surface)',
                  color: speechSpeed === val ? '#ffffff' : 'var(--color-navy-dark)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Interactive Reading Canvas Card */}
      <section className="card" style={{ padding: '2rem' }}>
        {/* Passage Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--color-border-subtle)',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-primary">{activePassage.difficulty}</span>
              <span className="badge badge-accent">
                {activePassage.language === 'ta' ? 'தமிழ் (Tamil)' : 'English'}
              </span>
              {activePassage.category && (
                <span className="badge badge-secondary">{activePassage.category}</span>
              )}
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
              {activePassage.title}
            </h1>
            {activePassage.summary && (
              <p style={{ color: 'var(--color-slate)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                {activePassage.summary}
              </p>
            )}
          </div>

          {/* Real-time Recognition State Indicator */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Speech Recognition Engine:</div>
            {renderSpeechStatusBadge()}
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'var(--color-bg-base)',
            borderRadius: 'var(--radius-md)',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={18} color="var(--color-primary)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>Accuracy:</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)' }}>
              {accuracyPercentage}%
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--color-success)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>Words Recognized:</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)' }}>
              {matchedIndices.size} / {words.length}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--color-accent)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>Reading Time:</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)' }}>
              {Math.floor(elapsedSeconds / 60)}:{(elapsedSeconds % 60).toString().padStart(2, '0')}
            </strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--color-primary)" />
            <span style={{ fontSize: '0.875rem', color: 'var(--color-slate)' }}>Speed:</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--color-navy-dark)' }}>
              {currentWpm} WPM
            </strong>
          </div>
        </div>

        {/* State Notice / Error Alert / Recovery Controls */}
        {stateMessage && (
          <div
            role="status"
            aria-live="polite"
            style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.25rem',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              backgroundColor:
                speechState === SPEECH_STATES.PERMISSION_DENIED || speechState === SPEECH_STATES.ERROR
                  ? 'var(--color-danger-light)'
                  : speechState === SPEECH_STATES.NO_SPEECH
                  ? 'var(--color-warning-light)'
                  : 'var(--color-primary-light)',
              color:
                speechState === SPEECH_STATES.PERMISSION_DENIED || speechState === SPEECH_STATES.ERROR
                  ? 'var(--color-danger-text)'
                  : speechState === SPEECH_STATES.NO_SPEECH
                  ? 'var(--color-warning-text)'
                  : 'var(--color-primary-text)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{stateMessage}</span>
            </div>

            {speechState === SPEECH_STATES.PERMISSION_DENIED && (
              <button
                type="button"
                onClick={handleStartSpeechReading}
                className="btn btn-sm btn-secondary"
              >
                Retry Microphone
              </button>
            )}
          </div>
        )}

        {/* Interactive Text Display with Word Highlighting */}
        <div
          className="reading-passage-text"
          style={{
            minHeight: '180px',
            padding: '1.5rem',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            fontSize: 'var(--font-size-base)',
            lineHeight: 'var(--line-height-base)',
            letterSpacing: 'var(--letter-spacing-base)'
          }}
        >
          {words.map((word, index) => {
            const isMatched = matchedIndices.has(index);
            const isMissed = missedIndices.has(index);
            const isCurrentActive = index === currentWordIndex && sessionMode === 'SPEECH_READING';
            const isTtsCurrent = index === currentWordIndex && sessionMode === 'TTS_READING';

            let className = 'passage-word';
            if (isMatched) {
              className += ' spoken-correct';
            } else if (isMissed) {
              className += ' spoken-missed';
            } else if (isCurrentActive) {
              className += ' active-reading';
            } else if (isTtsCurrent) {
              className += ' tts-current';
            }

            return (
              <span
                key={index}
                className={className}
                onClick={() => handleFlagWord(word)}
                title={isMissed ? `"${word}" — mispronounced or skipped. Click to save to practice.` : 'Click to add word to pronunciation practice'}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFlagWord(word);
                  }
                }}
              >
                {word}
              </span>
            );
          })}
        </div>

        {/* Color Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--color-slate)' }}>Color Key:</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#16a34a' }} />
            <span style={{ color: 'var(--color-slate)' }}>Correct (said right)</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#dc2626' }} />
            <span style={{ color: 'var(--color-slate)' }}>Missed / Mispronounced</span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
            <span style={{ display: 'inline-block', width: '14px', height: '14px', borderRadius: '3px', backgroundColor: '#fef08a', border: '1.5px solid #ca8a04' }} />
            <span style={{ color: 'var(--color-slate)' }}>Current word</span>
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)', marginBottom: '1.5rem' }}>
          💡 <em>Tip: Tap any <span style={{ color: '#dc2626', fontWeight: 700 }}>red</span> word to save it to your Word &amp; Pronunciation practice list!</em>
        </div>

        {/* Controls: Start Reading, Read Aloud, Pause, Resume, Stop, Try Again */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.875rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border-subtle)'
          }}
        >
          {/* Start Reading (Microphone) */}
          {sessionMode === 'IDLE' && (
            <>
              <button
                type="button"
                onClick={handleStartSpeechReading}
                className="btn btn-primary btn-lg"
              >
                <Mic size={20} />
                <span>Start Reading (Speak)</span>
              </button>

              <button
                type="button"
                onClick={handleStartReadAloud}
                className="btn btn-secondary btn-lg"
              >
                <Volume2 size={20} />
                <span>Read Aloud (Listen)</span>
              </button>
            </>
          )}

          {/* Active reading states */}
          {(sessionMode === 'SPEECH_READING' || sessionMode === 'TTS_READING') && (
            <>
              <button
                type="button"
                onClick={handlePause}
                className="btn btn-secondary btn-lg"
              >
                <Pause size={20} />
                <span>Pause</span>
              </button>

              <button
                type="button"
                onClick={handleStop}
                className="btn btn-danger btn-lg"
              >
                <Square size={18} />
                <span>Stop</span>
              </button>
            </>
          )}

          {/* Paused state */}
          {sessionMode === 'PAUSED' && (
            <>
              <button
                type="button"
                onClick={handleResume}
                className="btn btn-primary btn-lg"
              >
                <Play size={20} />
                <span>Resume</span>
              </button>

              <button
                type="button"
                onClick={handleStop}
                className="btn btn-secondary btn-lg"
              >
                <Square size={18} />
                <span>End Session</span>
              </button>
            </>
          )}

          {/* Try Again / Reset button */}
          <button
            type="button"
            onClick={handleTryAgain}
            className="btn btn-ghost"
            title="Reset this passage to beginning"
          >
            <RotateCcw size={18} />
            <span>Try Again</span>
          </button>
        </div>
      </section>

      {/* Completion Modal / Celebration */}
      {isCompletedModalOpen && completedMetrics && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="completion-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '1rem'
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-success-light)',
                color: 'var(--color-success-text)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem'
              }}
            >
              <Award size={34} />
            </div>

            <h2 id="completion-title" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
              Wonderful Reading Practice!
            </h2>
            <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', marginTop: '0.25rem' }}>
              You completed "{completedMetrics.passageTitle}". Here is your session summary:
            </p>

            {/* Metrics Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                margin: '1.5rem 0',
                textAlign: 'left'
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Accuracy</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
                  {completedMetrics.accuracyPercentage}%
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Words Matched</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
                  {completedMetrics.correctWords} / {completedMetrics.totalWords}
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Reading Time</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
                  {completedMetrics.durationSeconds}s
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: 'var(--color-bg-base)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-slate)' }}>Reading Speed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
                  {completedMetrics.wpm} WPM
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setIsCompletedModalOpen(false)}
                className="btn btn-secondary"
              >
                Review Passage
              </button>
              <Link to="/progress" className="btn btn-primary">
                <span>View in Progress</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory Non-Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
