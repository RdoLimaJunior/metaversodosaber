
import React from 'react';
import type { Choice } from '../types';

interface ChoiceInteractionProps {
  choices: Choice[];
  onAdvance: (nextNodeId: string) => void;
  onScoreUpdate: (points: number) => void;
}

const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/positive/success.mp3';
const playSound = (url: string) => { new Audio(url).play().catch(e => console.error("Error playing sound:", e)); };


const ChoiceInteraction: React.FC<ChoiceInteractionProps> = ({ choices, onAdvance, onScoreUpdate }) => {
  const handleChoice = (nextNodeId: string) => {
    playSound(CORRECT_SOUND_URL);
    onScoreUpdate(10);
    onAdvance(nextNodeId);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => handleChoice(choice.nextNodeId)}
          className="w-full sm:w-auto font-display text-xl px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 hover:-translate-y-1 transform transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          {choice.text}
        </button>
      ))}
    </div>
  );
};

export default ChoiceInteraction;
