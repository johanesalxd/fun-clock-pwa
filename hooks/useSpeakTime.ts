import { useState, useCallback, useEffect } from 'react';
import { getTimeAsWords, SpokenLanguage } from '@/lib/timeToWords';

export function useSpeakTime() {
  const [language, setLanguage] = useState<SpokenLanguage>('en-US');
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
    }
  }, []);

  const speakTime = useCallback((timeMs: number) => {
    if (!isSupported || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    const date = new Date(timeMs);
    const text = getTimeAsWords(date.getHours(), date.getMinutes(), language);

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    
    // Try to find a voice that matches the language
    const voices = window.speechSynthesis.getVoices();
    const voice = 
      voices.find(v => v.lang === language) ||
      voices.find(v => v.lang.replace('_', '-') === language) ||
      voices.find(v => v.lang.startsWith(language)) ||
      voices.find(v => v.lang.startsWith(language.split('-')[0]));
      
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }, [language, isSupported]);

  return { language, setLanguage, speakTime, isSupported };
}
