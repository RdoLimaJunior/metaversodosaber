
import React, { useState } from 'react';
import type { FillInTheBlank } from '../types';

interface FillInTheBlankInteractionProps {
  details: FillInTheBlank;
  onAdvance: (nextNodeId: string) => void;
  onScoreUpdate: (points: number) => void;
}

const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/positive/success.mp3';
const INCORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/negative/failure.mp3';
const playSound = (url: string) => { new Audio(url).play().catch(e => console.error("Error playing sound:", e)); };

const incorrectFeedbackMessages = [
    "Hmm, não foi bem isso. Tente de novo!",
    "Quase lá! Qual era o nome daquelas comunidades?",
    "Essa palavra não parece a certa. Lembre da nossa conversa!",
    "Tente se lembrar... eles fugiam para lugares secretos na mata."
];

const FillInTheBlankInteraction: React.FC<FillInTheBlankInteractionProps> = ({ details, onAdvance, onScoreUpdate }) => {
  const [answer, setAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(''); // Limpa o feedback anterior antes de validar
    const isAnswerCorrect = answer.trim().toLowerCase() === details.correctAnswer.toLowerCase();
    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect) {
      playSound(CORRECT_SOUND_URL);
      setFeedback('Isso mesmo!');
      onScoreUpdate(10);
      setTimeout(() => {
        onAdvance(details.nextNodeId);
      }, 1000);
    } else {
      playSound(INCORRECT_SOUND_URL);
      const randomFeedback = incorrectFeedbackMessages[Math.floor(Math.random() * incorrectFeedbackMessages.length)];
      setFeedback(randomFeedback);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
      <div className="flex items-center justify-center gap-2 text-xl bg-white p-4 rounded-lg shadow-md">
        <span>{details.promptParts[0]}</span>
        <input
          type="text"
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          className={`font-display text-center w-32 md:w-48 px-3 py-2 border-b-4 rounded-t-md transition-colors duration-300
            ${isCorrect === true ? 'border-green-500 bg-green-100' : ''}
            ${isCorrect === false ? 'border-red-500 bg-red-100 animate-shake' : 'border-amber-400 focus:border-blue-500'}
            focus:outline-none`}
          placeholder="???"
        />
        <span>{details.promptParts[1]}</span>
      </div>
      <button
        type="submit"
        className="font-display text-xl px-8 py-3 bg-green-600 text-white rounded-xl shadow-lg border-b-4 border-green-800 hover:bg-green-500 hover:-translate-y-1 transform transition-all duration-150 disabled:bg-gray-400 disabled:border-gray-500 disabled:cursor-not-allowed"
        disabled={!answer}
      >
        Responder
      </button>
      {feedback && isCorrect !== null && (
        <p className={`font-bold mt-2 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {feedback}
        </p>
      )}
    </form>
  );
};

export default FillInTheBlankInteraction;