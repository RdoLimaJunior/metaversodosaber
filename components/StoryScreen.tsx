
import React, { useState, useRef } from 'react';
import type { StoryNodeData, BoundingBox } from '../types';
import { InteractionType } from '../types';
import ChoiceInteraction from './ChoiceInteraction';
import FillInTheBlankInteraction from './FillInTheBlankInteraction';
import VoiceChoiceInteraction from './VoiceChoiceInteraction';
import EndInteraction from './EndInteraction';
import FindTheItemInteraction from './FindTheItemInteraction';
import DragAndDropMathInteraction from './DragAndDropMathInteraction';
import ImagePlaceholder from './ImagePlaceholder';

interface StoryScreenProps {
  node: StoryNodeData;
  imageUrl?: string;
  itemLocations?: Record<string, BoundingBox & { isCorrect: boolean }>;
  interactiveElementImages?: string[];
  studentName: string;
  score: number;
  onAdvance: (nextNodeId: string) => void;
  onRestartSubject: () => void;
  onBackToSubjects: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  cancel: () => void;
  onScoreUpdate: (points: number) => void;
}

const StoryScreen: React.FC<StoryScreenProps> = ({ node, imageUrl, itemLocations, interactiveElementImages, studentName, score, onAdvance, onRestartSubject, onBackToSubjects, speak, isSpeaking, cancel, onScoreUpdate }) => {
  const [isSoundPlaying, setIsSoundPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleToggleSpeech = () => isSpeaking ? cancel() : speak(node.text);
  
  const handlePlaySound = () => {
    if (!node.soundUrl || isSoundPlaying) return;

    if (isSpeaking) {
      cancel();
    }

    if (!audioRef.current) {
        audioRef.current = new Audio(node.soundUrl);
        audioRef.current.onended = () => setIsSoundPlaying(false);
        audioRef.current.onerror = () => {
            console.error("Erro ao tocar o áudio.");
            setIsSoundPlaying(false);
        };
    }
    
    audioRef.current.onplaying = () => setIsSoundPlaying(true);

    audioRef.current.play().catch(e => {
      console.error("Erro ao tentar tocar áudio:", e);
      setIsSoundPlaying(false);
    });
  };

  const renderInteraction = () => {
    switch (node.interactionType) {
      case InteractionType.Choice:
        return <ChoiceInteraction choices={node.choices!} onAdvance={onAdvance} onScoreUpdate={onScoreUpdate} />;
      case InteractionType.FillInTheBlank:
        return <FillInTheBlankInteraction details={node.fillInTheBlank!} onAdvance={onAdvance} onScoreUpdate={onScoreUpdate} />;
      case InteractionType.VoiceChoice:
        return <VoiceChoiceInteraction choices={node.voiceChoices!} onAdvance={onAdvance} onScoreUpdate={onScoreUpdate} />;
      case InteractionType.FindTheItem:
        return <FindTheItemInteraction details={node.findTheItem!} onAdvance={onAdvance} imageUrl={imageUrl} itemLocations={itemLocations!} onScoreUpdate={onScoreUpdate} />;
      case InteractionType.DragAndDropMath:
        return <DragAndDropMathInteraction details={node.dragAndDropMath!} onAdvance={onAdvance} pieceImages={interactiveElementImages!} backgroundUrl={imageUrl} onScoreUpdate={onScoreUpdate} />;
      case InteractionType.End:
        return <EndInteraction 
                  studentName={studentName}
                  score={score}
                  onRestartSubject={onRestartSubject} 
                  onBackToSubjects={onBackToSubjects}
                />;
      default:
        return null;
    }
  };

  const isFindInteraction = node.interactionType === InteractionType.FindTheItem;
  const isMathInteraction = node.interactionType === InteractionType.DragAndDropMath;
  const isSpecialInteraction = isFindInteraction || isMathInteraction;

  return (
    <main className="container mx-auto max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-10 border-4 border-amber-300">
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-display text-amber-800 drop-shadow-md">{node.title}</h1>
      </div>
      
      <div className={`relative aspect-video w-full rounded-2xl bg-amber-200 mb-6 shadow-lg overflow-hidden border-4 border-amber-200 ${isFindInteraction ? 'cursor-pointer' : ''}`}>
        {isSpecialInteraction ? (
          // Componentes de interação especiais renderizam suas próprias imagens de fundo e interações
          renderInteraction()
        ) : (
          <>
            {imageUrl === 'placeholder' ? (
              <ImagePlaceholder />
            ) : imageUrl ? (
              <img src={imageUrl} alt="Cena da história" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-amber-600"></div>
              </div>
            )}
          </>
        )}

        {node.soundUrl && (
            <button
                onClick={handlePlaySound}
                disabled={isSoundPlaying}
                className="absolute bottom-4 right-4 p-4 rounded-full bg-blue-600 text-white shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 disabled:bg-gray-400 disabled:opacity-75 transform transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 z-20"
                aria-label="Ouvir som do animal"
            >
                {isSoundPlaying ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M4.929 4.929a12 12 0 0114.142 0M7.757 7.757a7 7 0 019.9 0" /></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                )}
            </button>
        )}
      </div>

      <div className="relative text-xl text-amber-900 bg-amber-100/70 p-6 rounded-xl shadow-inner">
        <p>{node.text}</p>
        <button 
          onClick={handleToggleSpeech} 
          className="absolute top-2 right-2 p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-all"
          aria-label={isSpeaking ? "Parar narração" : "Ouvir texto"}
        >
          {isSpeaking ? (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6" /></svg>
          ) : (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M4.929 4.929a12 12 0 0114.142 0M7.757 7.757a7 7 0 019.9 0" /></svg>
          )}
        </button>
      </div>
      
      {!isSpecialInteraction && (
        <div className="mt-8">
            {renderInteraction()}
        </div>
      )}
    </main>
  );
};

export default StoryScreen;