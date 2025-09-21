
import React, { useState, useEffect, useMemo } from 'react';
import type { DragAndDropMathData } from '../types';

interface DragAndDropMathInteractionProps {
  details: DragAndDropMathData;
  onAdvance: (nextNodeId: string) => void;
  pieceImages: string[];
  backgroundUrl?: string;
  onScoreUpdate: (points: number) => void;
}

const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/positive/success.mp3';
const INCORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/negative/failure.mp3';
const playSound = (url: string) => { new Audio(url).play().catch(e => console.error("Error playing sound:", e)); };


// Função para embaralhar um array
const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DragAndDropMathInteraction: React.FC<DragAndDropMathInteractionProps> = ({ details, onAdvance, pieceImages, backgroundUrl, onScoreUpdate }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [correctlyAnswered, setCorrectlyAnswered] = useState(0);
  const [droppedAnswer, setDroppedAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const currentProblem = details.problems[currentProblemIndex];

  const answerOptions = useMemo(() => {
    if (!currentProblem) return [];
    const options = new Set<number>([currentProblem.correctAnswer]);
    // Gera 2 respostas incorretas aleatórias, mas próximas
    while (options.size < 3) {
      const wrongAnswer = Math.max(1, currentProblem.correctAnswer + Math.floor(Math.random() * 5) - 2);
      if (wrongAnswer !== currentProblem.correctAnswer) {
          options.add(wrongAnswer);
      }
    }
    return shuffleArray(Array.from(options));
  }, [currentProblem]);

  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>, answer: number) => {
    e.dataTransfer.setData('text/plain', answer.toString());
    setIsDragging(true);
  };
  
  const handleDragEnd = () => {
      setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const answerStr = e.dataTransfer.getData('text/plain');
    const answer = parseInt(answerStr, 10);
    setDroppedAnswer(answer);
    setIsDragging(false);

    if (answer === currentProblem.correctAnswer) {
      playSound(CORRECT_SOUND_URL);
      setFeedback('correct');
      onScoreUpdate(10);
      setTimeout(() => {
        setCorrectlyAnswered(prev => prev + 1);
        if (currentProblemIndex < details.problems.length - 1) {
          setCurrentProblemIndex(prev => prev + 1);
        } else {
          setIsComplete(true);
        }
        setFeedback(null);
        setDroppedAnswer(null);
      }, 1000);
    } else {
      playSound(INCORRECT_SOUND_URL);
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        setDroppedAnswer(null);
      }, 800);
    }
  };
  
  useEffect(() => {
      if(isComplete) {
          // A animação de decolagem dura 2s, depois avança
          setTimeout(() => {
              onAdvance(details.nextNodeId);
          }, 2500);
      }
  }, [isComplete, onAdvance, details.nextNodeId]);

  if (!currentProblem && !isComplete) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white font-display">
            Carregando desafio...
        </div>
      );
  }
  
  const shipPieces = [
      { top: '40%', left: '35%', width: '30%' }, // 1. Fuselagem
      { top: '30%', left: '42%', width: '16%' }, // 2. Bico
      { top: '50%', left: '15%', width: '70%' }, // 3. Asas
      { top: '65%', left: '42%', width: '16%' }, // 4. Motor
      { top: '38%', left: '42%', width: '16%' }, // 5. Cockpit
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 bg-gray-800 text-white relative overflow-hidden">
        {backgroundUrl && backgroundUrl !== 'placeholder' && <img src={backgroundUrl} alt="Oficina Espacial" className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-40" />}
      
        {/* Área de montagem da nave */}
        <div className={`relative flex-grow flex items-center justify-center ${isComplete ? 'animate-liftoff' : ''}`}>
            {pieceImages.slice(0, correctlyAnswered).map((pieceUrl, index) => {
                const style = {
                    top: shipPieces[index].top,
                    left: shipPieces[index].left,
                    width: shipPieces[index].width,
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))'
                };

                if (pieceUrl === 'placeholder') {
                    return (
                        <div
                            key={index}
                            className="absolute animate-piece-appear bg-gray-500 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center"
                            style={style}
                        >
                           <span className="text-xs text-white/70">Peça {index+1}</span>
                        </div>
                    );
                }

                return (
                    <img
                        key={index}
                        src={pieceUrl}
                        alt={`Peça da nave ${index + 1}`}
                        className="absolute animate-piece-appear"
                        style={style}
                    />
                );
            })}
        </div>

        {/* HUD do jogo */}
        {!isComplete && (
            <div className="relative z-10 bg-black/50 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex justify-center items-center gap-4 mb-4">
                    <div className="font-display text-4xl text-cyan-300 tracking-widest">{currentProblem.question} =</div>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}
                        className={`font-display text-4xl w-24 h-24 flex items-center justify-center rounded-lg border-4 transition-all duration-300
                            ${feedback === 'correct' ? 'bg-green-500 border-green-300 animate-glow-blue' : ''}
                            ${feedback === 'incorrect' ? 'bg-red-500 border-red-300 animate-shake' : ''}
                            ${!feedback && isDragging ? 'bg-blue-500/50 border-blue-300 border-dashed' : 'bg-gray-700/50 border-gray-500'}
                        `}
                    >
                        {droppedAnswer ?? '?'}
                    </div>
                </div>
                <div className="flex justify-center gap-4">
                    {answerOptions.map((opt) => (
                        <button
                            key={opt}
                            draggable
                            onDragStart={(e) => handleDragStart(e, opt)}
                            onDragEnd={handleDragEnd}
                            className="font-display text-3xl bg-amber-500 text-amber-900 w-20 h-20 rounded-lg shadow-lg border-b-4 border-amber-700 hover:bg-amber-400 transform transition hover:-translate-y-1 cursor-grab active:cursor-grabbing"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};

export default DragAndDropMathInteraction;
