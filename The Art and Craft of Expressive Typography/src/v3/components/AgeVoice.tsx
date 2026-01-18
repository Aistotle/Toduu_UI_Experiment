import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { AgeState } from '../TypographyLabPage';

interface AgeVoiceProps {
  state: AgeState;
  updateState: <K extends keyof AgeState>(age: K, updates: Partial<AgeState[K]>) => void;
  onComplete: () => void;
  prefersReducedMotion: boolean;
}

type VoiceType = 'formal' | 'modern' | 'playful' | 'technical';

interface VoiceStyle {
  fontFamily: string;
  fontWeight: number;
  letterSpacing: string;
  color: string;
  transform: string;
}

const VOICE_STYLES: Record<VoiceType, VoiceStyle> = {
  formal: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 400,
    letterSpacing: '0.02em',
    color: '#8B4513',
    transform: 'none',
  },
  modern: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    letterSpacing: '-0.02em',
    color: '#2196F3',
    transform: 'none',
  },
  playful: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 600,
    letterSpacing: '0.04em',
    color: '#FF4081',
    transform: 'rotate(-2deg)',
  },
  technical: {
    fontFamily: "'JetBrains Mono', monospace",
    fontWeight: 400,
    letterSpacing: '0em',
    color: '#00BCD4',
    transform: 'none',
  },
};

// Words that suggest different voices
const VOICE_KEYWORDS: Record<VoiceType, string[]> = {
  formal: ['elegant', 'grace', 'wisdom', 'tradition', 'refined', 'classic', 'timeless', 'beauty', 'heritage', 'dignity'],
  modern: ['fast', 'bold', 'now', 'future', 'power', 'strong', 'direct', 'clear', 'sharp', 'clean'],
  playful: ['joy', 'love', 'fun', 'happy', 'dance', 'sing', 'dream', 'wonder', 'magic', 'sparkle', 'heart', 'laugh'],
  technical: ['code', 'data', 'system', 'logic', 'precise', 'exact', 'function', 'process', 'algorithm', 'compute'],
};

// Analyze text to determine voice
const analyzeText = (text: string): VoiceType => {
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);

  // Check for keywords
  for (const [voice, keywords] of Object.entries(VOICE_KEYWORDS) as [VoiceType, string[]][]) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        return voice;
      }
    }
  }

  // Check sentence patterns
  const hasQuestionMark = text.includes('?');
  const hasExclamation = text.includes('!');
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const sentenceLength = words.length;

  if (hasExclamation) return 'playful';
  if (hasQuestionMark && sentenceLength < 6) return 'playful';
  if (avgWordLength > 6) return 'formal';
  if (sentenceLength > 15) return 'formal';
  if (avgWordLength < 4 && sentenceLength < 8) return 'modern';

  // Default based on punctuation density
  const punctuation = (text.match(/[.,;:!?]/g) || []).length;
  if (punctuation > text.length / 20) return 'technical';

  return 'modern';
};

// Extract a key word from user input
const extractKeyWord = (text: string): string => {
  const words = text.split(/\s+/).filter(w => w.length > 3);
  if (words.length === 0) return 'BREATHE';

  // Look for emotionally significant words
  const emotionalWords = ['love', 'hope', 'dream', 'fear', 'joy', 'wonder', 'beauty', 'truth', 'life', 'light', 'soul'];
  for (const word of words) {
    if (emotionalWords.includes(word.toLowerCase())) {
      return word.toUpperCase();
    }
  }

  // Return the longest word
  return words.reduce((a, b) => a.length > b.length ? a : b).toUpperCase();
};

export const AgeVoice: React.FC<AgeVoiceProps> = ({
  state,
  updateState,
  onComplete,
  prefersReducedMotion,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');
  const [currentVoice, setCurrentVoice] = useState<VoiceType>('modern');
  const [displayWord, setDisplayWord] = useState('BREATHE');
  const [isTyping, setIsTyping] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [spotlightIntensity, setSpotlightIntensity] = useState(0.3);
  const [voiceConfirmed, setVoiceConfirmed] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Focus input on mount
  useEffect(() => {
    if (!prefersReducedMotion) {
      setTimeout(() => inputRef.current?.focus(), 500);
    }
  }, [prefersReducedMotion]);

  // Analyze text as user types
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setIsTyping(true);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Analyze and update voice in real-time
    if (value.length > 3) {
      const voice = analyzeText(value);
      setCurrentVoice(voice);
    }

    // Set timeout for when user stops typing
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (value.length > 5 && !hasSubmitted) {
        handleSubmit();
      }
    }, 2000);
  }, [hasSubmitted]);

  // Handle submission
  const handleSubmit = useCallback(() => {
    if (userInput.length < 3 || hasSubmitted) return;

    setHasSubmitted(true);
    setIsTyping(false);

    const finalVoice = analyzeText(userInput);
    const keyWord = extractKeyWord(userInput);

    setCurrentVoice(finalVoice);
    setDisplayWord(keyWord);

    // Dramatic reveal
    setSpotlightIntensity(1);

    // Confirm voice after dramatic pause
    setTimeout(() => {
      setVoiceConfirmed(true);
      updateState('voice', {
        userInput,
        detectedVoice: finalVoice,
        currentWord: keyWord,
      });

      setTimeout(onComplete, 2500);
    }, 1500);
  }, [userInput, hasSubmitted, onComplete, updateState]);

  // Handle Enter key
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }, [handleSubmit]);

  // Get current style with transitions
  const getWordStyle = (): React.CSSProperties => {
    const voiceStyle = VOICE_STYLES[currentVoice];
    return {
      fontFamily: voiceStyle.fontFamily,
      fontWeight: voiceStyle.fontWeight,
      letterSpacing: voiceStyle.letterSpacing,
      color: hasSubmitted ? voiceStyle.color : 'rgba(240, 240, 240, 0.5)',
      transform: voiceStyle.transform,
      transition: 'all 0.5s ease-out',
      textShadow: voiceConfirmed ? `0 0 60px ${voiceStyle.color}40` : 'none',
    };
  };

  if (prefersReducedMotion) {
    return (
      <div className="relative h-screen w-full flex items-center justify-center"
        style={{ background: 'linear-gradient(to bottom, #1A1A2E, #16213E)' }}>
        <div
          className="text-[12vw] cursor-pointer hover:opacity-80 transition-opacity"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: '#F0F0F0',
          }}
          onClick={onComplete}
        >
          VOICE
        </div>
        <p className="absolute bottom-12 text-[#F0F0F0]/60 text-sm">
          Click to continue
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #1A1A2E, #16213E)' }}
    >
      {/* Stage floor line */}
      <div className="absolute bottom-[35%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F0F0F0]/20 to-transparent" />

      {/* Spotlight effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[60vw] h-[80vh] pointer-events-none transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, rgba(255,255,255,${spotlightIntensity * 0.15}) 0%, transparent 60%)`,
        }}
      />

      {/* Side stage shadows */}
      <div className="absolute left-0 top-0 bottom-0 w-1/4 bg-gradient-to-r from-black/30 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-black/30 to-transparent pointer-events-none" />

      {/* The Word on Stage */}
      <div className="relative z-10 mb-16">
        <div
          className={`
            text-[min(14vw,160px)] transition-all duration-700
            ${isTyping ? 'animate-pulse' : ''}
          `}
          style={getWordStyle()}
        >
          {displayWord}
        </div>

        {/* Voice indicator */}
        <div
          className={`
            absolute -bottom-8 left-1/2 -translate-x-1/2
            text-xs font-mono tracking-widest uppercase
            transition-all duration-500
            ${voiceConfirmed ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ color: VOICE_STYLES[currentVoice].color }}
        >
          {currentVoice} voice
        </div>
      </div>

      {/* Voice options visualization */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 flex gap-8">
        {(Object.entries(VOICE_STYLES) as [VoiceType, VoiceStyle][]).map(([voice, style]) => (
          <div
            key={voice}
            className={`
              text-center transition-all duration-300
              ${currentVoice === voice ? 'scale-110 opacity-100' : 'scale-90 opacity-30'}
            `}
          >
            <div
              className="text-2xl mb-1"
              style={{ fontFamily: style.fontFamily, color: style.color }}
            >
              Aa
            </div>
            <div className="text-[10px] uppercase tracking-wide text-[#F0F0F0]/60">
              {voice}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      {!hasSubmitted && (
        <div className="relative z-10 w-full max-w-xl px-8">
          <label className="block text-center text-[#F0F0F0]/60 text-sm mb-4">
            Tell me something true.
          </label>
          <input
            ref={inputRef}
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type here..."
            className={`
              w-full bg-transparent border-b-2 border-[#F0F0F0]/30
              text-[#F0F0F0] text-xl text-center py-4
              placeholder:text-[#F0F0F0]/20
              focus:outline-none focus:border-[#FFD700]
              transition-all duration-300
            `}
          />

          <p className="text-center text-[#F0F0F0]/40 text-xs mt-4">
            Your words shape the voice
          </p>
        </div>
      )}

      {/* Confirmation message */}
      {voiceConfirmed && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center">
          <p className="text-[#F0F0F0]/80 text-lg">
            The voice has been found.
          </p>
          <p className="text-[#F0F0F0]/50 text-sm mt-2">
            Typography speaks when words take form.
          </p>
        </div>
      )}

      {/* Typing indicator */}
      {isTyping && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
