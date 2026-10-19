/**
 * Web Speech API utilities for native Chinese speech synthesis and voice recognition
 */

export function speakChinese(text: string, rate: number = 0.85): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      return resolve();
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate; // Slightly slower for language learners
    utterance.pitch = 1.0;

    // Pick best available Chinese voice if present
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((v) => v.lang.includes('zh') || v.lang.includes('cmn'));
    if (zhVoice) {
      utterance.voice = zhVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speech recognition helper
export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export function createSpeechRecognizer(
  onResult: (state: SpeechRecognitionResultState) => void,
  onError: (err: any) => void
) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'zh-CN';

  recognition.onresult = (event: any) => {
    let interim = '';
    let isFinal = false;

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        interim = event.results[i][0].transcript;
        isFinal = true;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    onResult({ transcript: interim, isFinal });
  };

  recognition.onerror = (event: any) => {
    onError(event.error);
  };

  return recognition;
}
