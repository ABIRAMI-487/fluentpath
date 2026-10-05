import React, { useState, useEffect, useRef } from 'react';
import { CURATED_PRACTICE_WORDS } from '../services/wordPracticeService';
import { storageService } from '../services/storageService';
import { SpeechRecognitionService, SPEECH_STATES, cleanWord } from '../services/speechRecognitionService';
import { speechSynthesisService } from '../services/speechSynthesisService';
import { useToast } from '../context/ToastContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  BookmarkCheck,
  Volume2,
  Mic,
  MicOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trash2,
  Sparkles,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function PracticePage() {
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('curated'); // 'curated' | 'flagged'
  const [selectedLanguage, setSelectedLanguage] = useState('all'); // 'all' | 'en' | 'ta'
  const [flaggedWords, setFlaggedWords] = useState(() => storageService.getFlaggedWords());
  const [activeWord, setActiveWord] = useState(CURATED_PRACTICE_WORDS[0]);

  // Pronunciation Test State
  // Status: 'IDLE' | 'LISTENING' | 'MATCHED' | 'TRY_AGAIN'
  const [testStatus, setTestStatus] = useState('IDLE');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const recognizerRef = useRef(null);

  useEffect(() => {
    setFlaggedWords(storageService.getFlaggedWords());
  }, []);

  // Filter curated words
  const filteredCurated = CURATED_PRACTICE_WORDS.filter((w) => {
    return selectedLanguage === 'all' || w.language === selectedLanguage;
  });

  const filteredFlagged = flaggedWords.filter((w) => {
    return selectedLanguage === 'all' || w.language === selectedLanguage;
  });

  // Switch active word
  const handleSelectWord = (wordObj) => {
    handleStopRecognition();
    setActiveWord(wordObj);
    setTestStatus('IDLE');
    setSpokenTranscript('');
  };

  // Clean up recognition
  const handleStopRecognition = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stop();
      recognizerRef.current.cleanup();
      recognizerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      handleStopRecognition();
      speechSynthesisService.stop();
    };
  }, []);

  // Play TTS audio of the word
  const handleListenWord = (wordText, language) => {
    const langCode = language === 'ta' ? 'ta-IN' : 'en-US';
    speechSynthesisService.speak(wordText, {
      lang: langCode,
      rate: 0.85
    });
  };

  // Start Mic Pronunciation Check
  const handleTestPronunciation = () => {
    handleStopRecognition();
    setTestStatus('LISTENING');
    setSpokenTranscript('');

    const targetClean = cleanWord(activeWord.word);
    const langCode = activeWord.language === 'ta' ? 'ta-IN' : 'en-US';

    recognizerRef.current = new SpeechRecognitionService({
      language: langCode,
      onStateChange: (state) => {
        if (state === SPEECH_STATES.NO_SPEECH && testStatus === 'LISTENING') {
          setTestStatus('TRY_AGAIN');
        }
      },
      onResult: ({ finalTranscript, interimTranscript }) => {
        const spoken = (finalTranscript || interimTranscript || '').trim();
        if (!spoken) return;
        setSpokenTranscript(spoken);

        const cleanSpoken = cleanWord(spoken);

        if (cleanSpoken.includes(targetClean) || targetClean.includes(cleanSpoken)) {
          setTestStatus('MATCHED');
          addToast({ type: 'success', message: `Superb! Your pronunciation of "${activeWord.word}" was recognized.` });
          handleStopRecognition();
        } else {
          setTestStatus('TRY_AGAIN');
        }
      },
      onError: () => {
        setTestStatus('TRY_AGAIN');
      }
    });

    recognizerRef.current.start({ language: langCode });
  };

  // Remove flagged word
  const handleRemoveFlagged = (wordText) => {
    storageService.removeFlaggedWord(wordText);
    const updated = storageService.getFlaggedWords();
    setFlaggedWords(updated);
    if (activeWord?.word === wordText) {
      setActiveWord(filteredCurated[0] || null);
    }
    addToast({ type: 'info', message: `Removed "${wordText}" from saved words.` });
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-accent">
            <BookmarkCheck size={14} />
            <span>Pronunciation Lab</span>
          </span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--color-navy-dark)' }}>
          Word Recognition & Pronunciation Practice
        </h1>
        <p style={{ color: 'var(--color-slate)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Master difficult syllable divisions, phonetic sounds, and stress patterns in English and Tamil.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left Column: Word List Navigator */}
        <div className="card" style={{ padding: '1.25rem' }}>
          {/* Tabs: Curated vs Flagged */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-subtle)', marginBottom: '1rem' }}>
            <button
              type="button"
              onClick={() => setActiveTab('curated')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderBottom: activeTab === 'curated' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'curated' ? 'var(--color-primary)' : 'var(--color-slate)'
              }}
            >
              Curated ({filteredCurated.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flagged')}
              style={{
                flex: 1,
                padding: '0.6rem 0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                borderBottom: activeTab === 'flagged' ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === 'flagged' ? 'var(--color-primary)' : 'var(--color-slate)'
              }}
            >
              My Saved ({filteredFlagged.length})
            </button>
          </div>

          {/* Language filter */}
          <div style={{ marginBottom: '1rem' }}>
            <select
              className="form-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{ width: '100%', minHeight: '36px', fontSize: '0.85rem' }}
            >
              <option value="all">All Languages</option>
              <option value="en">English Words</option>
              <option value="ta">தமிழ் சொற்கள் (Tamil)</option>
            </select>
          </div>

          {/* Words list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '500px', overflowY: 'auto' }}>
            {activeTab === 'curated' ? (
              filteredCurated.map((w) => {
                const isSelected = activeWord?.id === w.id || activeWord?.word === w.word;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => handleSelectWord(w)}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>{w.word}</div>
                      <div style={{ fontSize: '0.775rem', color: 'var(--color-slate)' }}>{w.syllables}</div>
                    </div>
                    <span className="badge badge-secondary" style={{ fontSize: '0.7rem' }}>
                      {w.language === 'ta' ? 'தமிழ்' : 'EN'}
                    </span>
                  </button>
                );
              })
            ) : filteredFlagged.length > 0 ? (
              filteredFlagged.map((w) => {
                const isSelected = activeWord?.word === w.word;
                return (
                  <div
                    key={w.word}
                    style={{
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: isSelected ? 'var(--color-primary-light)' : 'var(--color-bg-surface)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectWord(w)}
                      style={{ textAlign: 'left', flex: 1 }}
                    >
                      <div style={{ fontWeight: 600, color: 'var(--color-navy-dark)' }}>{w.word}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-slate)' }}>
                        From: {w.passageTitle || 'Reading'}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFlagged(w.word)}
                      title="Remove from saved words"
                      style={{ color: 'var(--color-slate)', padding: '4px' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--color-slate)', fontSize: '0.875rem' }}>
                No saved tricky words yet. While reading in the Read section, tap any word to save it here!
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Word Practice Studio */}
        {activeWord ? (
          <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {/* Word Heading */}
            <div style={{ borderBottom: '1px solid var(--color-border-subtle)', paddingBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span className="badge badge-primary">
                  {activeWord.language === 'ta' ? 'தமிழ்' : 'English'}
                </span>
                {activeWord.difficulty && (
                  <span className="badge badge-secondary">{activeWord.difficulty}</span>
                )}
              </div>
              <h2
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  color: 'var(--color-navy-dark)',
                  letterSpacing: '0.02em',
                  marginBottom: '0.25rem'
                }}
              >
                {activeWord.word}
              </h2>
              {activeWord.phonetic && (
                <div style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                  {activeWord.phonetic}
                </div>
              )}
            </div>

            {/* Syllable Division Ribbon */}
            <div style={{ backgroundColor: 'var(--color-bg-base)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-slate)', marginBottom: '0.5rem' }}>
                SYLLABLE BREAKDOWN:
              </div>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 700,
                  color: 'var(--color-navy-dark)',
                  letterSpacing: '0.05em'
                }}
              >
                {activeWord.syllables || activeWord.word}
              </div>
            </div>

            {/* Definition & Pronunciation Tip */}
            {activeWord.definition && (
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-navy-dark)', marginBottom: '0.25rem' }}>
                  Meaning & Context:
                </div>
                <p style={{ color: 'var(--color-slate)', fontSize: '0.925rem', lineHeight: '1.5' }}>
                  {activeWord.definition}
                </p>
              </div>
            )}

            {activeWord.tip && (
              <div
                style={{
                  padding: '1rem',
                  backgroundColor: 'var(--color-accent-light)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--color-accent-text)',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Sparkles size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>Acoustic Tip:</strong> {activeWord.tip}
                </span>
              </div>
            )}

            {/* Interactive Actions: Listen & Speak */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border-subtle)'
              }}
            >
              <button
                type="button"
                onClick={() => handleListenWord(activeWord.word, activeWord.language)}
                className="btn btn-secondary btn-lg"
              >
                <Volume2 size={20} />
                <span>Hear Pronunciation</span>
              </button>

              <button
                type="button"
                onClick={handleTestPronunciation}
                className="btn btn-primary btn-lg"
                disabled={testStatus === 'LISTENING'}
              >
                <Mic size={20} />
                <span>{testStatus === 'LISTENING' ? 'Listening...' : 'Say it Aloud (Check)'}</span>
              </button>
            </div>

            {/* Verification Feedback Banner */}
            {testStatus === 'LISTENING' && (
              <div
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Mic size={20} />
                <span>Say "{activeWord.word}" clearly into your microphone now...</span>
              </div>
            )}

            {testStatus === 'MATCHED' && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-success-light)',
                  color: 'var(--color-success-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                <div>
                  <strong style={{ display: 'block', fontSize: '1.05rem' }}>Splendid Pronunciation!</strong>
                  <span style={{ fontSize: '0.875rem' }}>
                    Recognized speech matched "{activeWord.word}". Your pronunciation confidence is improving!
                  </span>
                </div>
              </div>
            )}

            {testStatus === 'TRY_AGAIN' && (
              <div
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-warning-light)',
                  color: 'var(--color-warning-text)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem'
                }}
              >
                <HelpCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block' }}>Let’s Try That Again</strong>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.2rem', marginBottom: '0.5rem' }}>
                    {spokenTranscript
                      ? `Heard: "${spokenTranscript}". Break it down slowly: ${activeWord.syllables || activeWord.word}`
                      : 'No speech was detected clearly. Take a gentle breath and try speaking closer to your mic.'}
                  </p>
                  <button
                    type="button"
                    onClick={handleTestPronunciation}
                    className="btn btn-secondary btn-sm"
                  >
                    <RotateCcw size={14} />
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-slate)' }}>
            Select a word on the left to begin practice.
          </div>
        )}
      </div>

      {/* Mandatory Non-Medical Disclaimer */}
      <MedicalDisclaimer />
    </div>
  );
}
