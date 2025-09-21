
import React from 'react';

interface EndInteractionProps {
  studentName: string;
  score: number;
  onRestartSubject: () => void;
  onBackToSubjects: () => void;
}

const EndInteraction: React.FC<EndInteractionProps> = ({ studentName, score, onRestartSubject, onBackToSubjects }) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center bg-amber-50/80 p-6 rounded-xl">
      <h2 className="text-4xl font-display text-green-700">Parabéns, {studentName}!</h2>
      <p className="text-lg text-amber-800">Você completou esta aventura com sucesso!</p>
      
      <div className="my-4 bg-white p-4 rounded-lg shadow-inner w-full max-w-xs">
          <p className="text-sm uppercase text-gray-500">Sua Pontuação Final</p>
          <p className="font-display text-5xl text-yellow-500 tracking-wider">{score}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mt-4">
        <button
            onClick={onRestartSubject}
            className="font-display text-xl px-8 py-4 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 hover:-translate-y-1 transform transition-all duration-150"
        >
            Jogar de Novo
        </button>
        <button
            onClick={onBackToSubjects}
            className="font-display text-xl px-8 py-4 bg-amber-500 text-white rounded-xl shadow-lg border-b-4 border-amber-700 hover:bg-amber-400 hover:-translate-y-1 transform transition-all duration-150"
        >
            Escolher Outra Matéria
        </button>
      </div>
    </div>
  );
};

export default EndInteraction;