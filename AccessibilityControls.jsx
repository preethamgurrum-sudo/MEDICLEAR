import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Type } from 'lucide-react';

export function AccessibilityControls({ textToRead }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [largeText, setLargeText] = useState(() => {
    return document.documentElement.classList.contains('large-text');
  });

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const toggleTextSize = () => {
    setLargeText(!largeText);
    if (!largeText) {
      document.documentElement.classList.add('large-text');
    } else {
      document.documentElement.classList.remove('large-text');
    }
  };

  const toggleSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(textToRead || "No summary available for reading.");
      utterance.onend = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex bg-card/80 backdrop-blur-md border border-border shadow-md rounded-2xl p-2 gap-2 fixed bottom-6 right-6 z-50">
      <button 
        title="Toggle Screen Reader / Voice Over"
        onClick={toggleSpeech}
        className="p-3 bg-secondary hover:bg-muted text-secondary-foreground rounded-xl transition-colors"
      >
        {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>

      <button
        title="Toggle Large Text"
        onClick={toggleTextSize}
        className={`p-3 rounded-xl transition-colors ${largeText ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-muted text-secondary-foreground'}`}
      >
        <Type className="w-5 h-5" />
      </button>
    </div>
  );
}
