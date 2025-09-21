import React, { useState, useEffect } from 'react';

interface PlayerHUDProps {
  name: string;
  sceneTitle: string;
  score: number;
  avatarUrl: string | null;
}

const PlayerHUD: React.FC<PlayerHUDProps> = ({ name, sceneTitle, score, avatarUrl }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Não anima a pontuação inicial de 0
    if (score > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 400); // Duração deve corresponder à animação CSS
      return () => clearTimeout(timer);
    }
  }, [score]);

  const Avatar: React.FC = () => (
    avatarUrl ? (
        <img src={avatarUrl} alt="Avatar do jogador" className="w-14 h-14 rounded-full object-cover border-2 border-white/50" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center font-display text-3xl border-2 border-white/50">
          {name.charAt(0).toUpperCase()}
        </div>
      )
  );

  return (
    <div className="absolute top-4 right-4 z-50">
       <div 
          className={`relative bg-black/60 text-white rounded-full shadow-lg backdrop-blur-sm border border-white/20 transition-all duration-300 ease-in-out ${isExpanded ? 'w-72 p-2' : 'w-16 h-16 p-1 cursor-pointer'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
             <div className="flex-shrink-0">
                <Avatar />
             </div>
             {isExpanded && (
                <div className="animate-fade-in-fast overflow-hidden">
                    <h3 className="font-bold text-lg leading-tight truncate">{name}</h3>
                    <p className="text-xs text-amber-200 uppercase tracking-wider truncate">{sceneTitle}</p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-sm uppercase text-gray-300">Pontos:</p>
                        <p className={`font-display text-2xl text-yellow-300 tracking-wider ${isAnimating ? 'animate-score-update' : ''}`}>
                            {score}
                        </p>
                    </div>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default PlayerHUD;