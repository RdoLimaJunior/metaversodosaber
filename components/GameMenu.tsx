
import React, { useState } from 'react';

interface GameMenuProps {
    onBackToSubjects: () => void;
    onRestart: () => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onBackToSubjects, onRestart }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="absolute top-4 left-4 bg-black/50 text-white p-3 rounded-full shadow-lg backdrop-blur-sm border border-white/20 z-[100] hover:bg-black/70 transition-colors"
                aria-label="Abrir menu do jogo"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
            </button>
        );
    }
    
    return (
        <div className="game-menu-overlay" role="dialog" aria-modal="true">
            <div className="game-menu-modal">
                <h2 className="text-3xl font-display text-amber-800 mb-6">Menu</h2>
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="w-full font-display text-xl px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg border-b-4 border-blue-800 hover:bg-blue-500 transform transition-all duration-150"
                    >
                        Retornar ao Jogo
                    </button>
                    <button
                        onClick={onBackToSubjects}
                        className="w-full font-display text-xl px-6 py-3 bg-amber-500 text-white rounded-xl shadow-lg border-b-4 border-amber-700 hover:bg-amber-400 transform transition-all duration-150"
                    >
                        Voltar ao Menu de Matérias
                    </button>
                     <button
                        onClick={onRestart}
                        className="w-full font-display text-xl px-6 py-3 bg-red-600 text-white rounded-xl shadow-lg border-b-4 border-red-800 hover:bg-red-500 transform transition-all duration-150"
                    >
                        Começar de Novo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameMenu;
