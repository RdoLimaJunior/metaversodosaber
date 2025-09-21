
import React, { useState, useRef, useEffect } from 'react';
import type { FindTheItemData, BoundingBox } from '../types';

interface FindTheItemInteractionProps {
  details: FindTheItemData;
  onAdvance: (nextNodeId: string) => void;
  imageUrl?: string;
  itemLocations: Record<string, BoundingBox & { isCorrect: boolean }>;
  onScoreUpdate: (points: number) => void;
}

const CORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/positive/success.mp3';
const INCORRECT_SOUND_URL = 'https://actions.google.com/sounds/v1/negative/failure.mp3';
const playSound = (url: string) => { new Audio(url).play().catch(e => console.error("Error playing sound:", e)); };


const FindTheItemInteraction: React.FC<FindTheItemInteractionProps> = ({ details, onAdvance, imageUrl, itemLocations, onScoreUpdate }) => {
  const [foundItem, setFoundItem] = useState<string | null>(null);
  const [wrongClick, setWrongClick] = useState<{ x: number, y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (foundItem) return; // Não permite cliques após encontrar o item

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;
    
    let itemFound = false;

    for (const name in itemLocations) {
        const loc = itemLocations[name];
        if (clickX >= loc.x && clickX <= loc.x + loc.width &&
            clickY >= loc.y && clickY <= loc.y + loc.height) {
            
            if (loc.isCorrect) {
                playSound(CORRECT_SOUND_URL);
                setFoundItem(name);
                onScoreUpdate(10);
                itemFound = true;
                setTimeout(() => {
                    onAdvance(details.nextNodeId);
                }, 1500); // Aguarda a animação antes de avançar
            }
            break; // Para no primeiro item encontrado
        }
    }
    
    if (!itemFound) {
        playSound(INCORRECT_SOUND_URL);
        setWrongClick({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setTimeout(() => setWrongClick(null), 400); // Duração da animação de erro
    }
  };
  
  // Se as localizações ainda não foram carregadas, mostra um loader
  if (Object.keys(itemLocations).length === 0) {
      return (
         <div className="w-full h-full flex items-center justify-center bg-amber-200">
            <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
          </div>
      );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full"
      onClick={handleImageClick}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={details.prompt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-amber-200">
           <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
        </div>
      )}

      {/* Renderiza os itens clicáveis e a animação */}
      {Object.entries(itemLocations).map(([name, loc]) => {
        const isFound = foundItem === name;
        if (isFound) {
          // Renderiza uma cópia da imagem recortada para a animação
          return (
            <div
              key={name}
              className={`absolute overflow-hidden ${isFound ? 'found-item' : ''}`}
              style={{
                left: `${loc.x}%`,
                top: `${loc.y}%`,
                width: `${loc.width}%`,
                height: `${loc.height}%`,
              }}
            >
                <img 
                    src={imageUrl} 
                    alt={`Item encontrado: ${name}`}
                    className="absolute w-full h-full object-cover"
                    style={{ 
                        width: `${100 / (loc.width / 100)}%`,
                        height: `${100 / (loc.height / 100)}%`,
                        top: `-${loc.y / (loc.height / 100)}%`,
                        left: `-${loc.x / (loc.width / 100)}%`,
                        maxWidth: 'none',
                    }} 
                />
            </div>
          );
        }
        return null;
      })}

      {/* Feedback de clique errado */}
      {wrongClick && (
         <div 
            className="wrong-click-feedback"
            style={{ left: `${wrongClick.x - 12}px`, top: `${wrongClick.y - 12}px`}}
        >
            X
        </div>
      )}

    </div>
  );
};

export default FindTheItemInteraction;
