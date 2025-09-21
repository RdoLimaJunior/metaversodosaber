import React, { useEffect, useState } from 'react';
import type { Choice } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

interface VoiceChoiceInteractionProps {
  choices: Choice[];
  onAdvance: (nextNodeId: string) => void;
  onScoreUpdate: (points: number) => void;
}

const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/positive/success.mp3';
const playSound = (url: string) => { new Audio(url).play().catch(e => console.error("Error playing sound:", e)); };

const VoiceChoiceInteraction: React.FC<VoiceChoiceInteractionProps> = ({ choices, onAdvance, onScoreUpdate }) => {
  const { isListening, transcript, startListening, isSupported, error } = useSpeechRecognition();
  const [feedback, setFeedback] = useState('');
  // Se a API de voz não for suportada, use botões como padrão.
  const [useButtons, setUseButtons] = useState(!isSupported);

  useEffect(() => {
    if (transcript) {
      const lowerTranscript = transcript.toLowerCase();
      setFeedback(`Você disse: "${transcript}"`);
      
      const matchedChoice = choices.find(choice => 
        choice.keywords?.some(keyword => lowerTranscript.includes(keyword.toLowerCase()))
      );

      if (matchedChoice) {
        playSound(CORRECT_SOUND_URL);
        onScoreUpdate(10);
        setTimeout(() => {
          onAdvance(matchedChoice.nextNodeId);
        }, 1500);
      } else {
        // Tenta de novo se não encontrar, mas mostra feedback
        setTimeout(() => {
          setFeedback('Não entendi bem. Tente falar uma das opções de novo!');
        }, 1500);
      }
    }
  }, [transcript, choices, onScoreUpdate, onAdvance]);

  // Se o modo de botão estiver ativo (seja por escolha do usuário ou por falta de suporte)
  if (useButtons) {
    const handleChoice = (nextNodeId: string) => {
        playSound(CORRECT_SOUND_URL);
        onScoreUpdate(10);
        onAdvance(nextNodeId);
    };

    return (
        <div className="flex flex-col gap-4 justify-center items-center">
            <p className="text-lg text-amber-800 font-semibold mb-2">Escolha uma das opções:</p>
            {choices.map((choice, index) => (
                <button
                    key={index}
                    onClick={() => handleChoice(choice.nextNodeId)}
                    className="w-full sm:w-auto font-display text-xl px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 hover:-translate-y-0.5 hover:scale-[1.02] transform transition-all duration-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                    {choice.text}
                </button>
            ))}
        </div>
    );
  }

  // Renderização padrão com reconhecimento de voz
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-lg text-amber-800">Diga em voz alta uma das opções:</p>
      <div className="flex gap-4 font-display text-xl text-blue-700">
        {choices.map(c => `"${c.text}"`).join(' ou ')}?
      </div>
      <button
        onClick={startListening}
        disabled={isListening}
        className="p-6 rounded-full bg-red-600 text-white shadow-lg border-b-4 border-red-800 hover:bg-red-500 disabled:bg-gray-400 transform transition-transform hover:scale-110"
        aria-label="Ativar microfone"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${isListening ? 'animate-pulse' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </button>
      <div className="h-6 mt-2 text-center">
        {isListening && <p className="text-blue-600 animate-pulse font-semibold">Ouvindo...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {feedback && !isListening && <p className="text-gray-700 font-semibold">{feedback}</p>}
      </div>

      <div className="mt-4 border-t pt-4 w-full text-center">
          <button onClick={() => setUseButtons(true)} className="text-sm text-gray-600 hover:text-blue-700 hover:underline">
            Prefere usar botões?
          </button>
      </div>
    </div>
  );
};

export default VoiceChoiceInteraction;